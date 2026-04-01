/**
 * exportWord.ts — Xuất file Word chuẩn BGD 2025-2026
 * Font: Times New Roman | Math: MathML (Word native) | Khổ: A4
 */

// KaTeX interface (tránh lỗi khi không có @types/katex)
interface KatexStatic {
  renderToString(latex: string, options?: Record<string, unknown>): string;
}

// Cache instance sau khi load lần đầu
let _katex: KatexStatic | null = null;

async function loadKatex(): Promise<KatexStatic | null> {
  if (_katex) return _katex;
  try {
    // Dynamic import — Vite sẽ bundle katex vào chunk riêng
    const mod = await import(/* @vite-ignore */ 'katex');
    _katex = (mod.default || mod) as KatexStatic;
    return _katex;
  } catch {
    // Fallback: thử lấy từ window (khi load từ CDN)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).katex || null;
  }
}

// ============================================================
// TIỆN ÍCH CHUNG
// ============================================================

/**
 * Render LaTeX đồng bộ — dùng output:'html' thay vì 'mathml'
 * MathML chứa <annotation> với LaTeX gốc → Word render cả hai → bị lặp text
 * HTML output không có annotation → Word hiển thị đúng
 */
function renderMathSync(text: string): string {
  if (!text) return text;
  const k = _katex;
  if (!k) {
    // KaTeX chưa load: strip dấu $ và giữ nguyên LaTeX text
    return text.replace(/\$\$?([^$]+)\$\$?/g, (_m, latex) => latex.trim());
  }

  let result = text.replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
    try { return k.renderToString(latex.trim(), { throwOnError: false, output: 'html', displayMode: true }); }
    catch { return `<em>${latex}</em>`; }
  });
  result = result.replace(/\$([^$\n]+)\$/g, (_, latex) => {
    try { return k.renderToString(latex.trim(), { throwOnError: false, output: 'html', displayMode: false }); }
    catch { return `<em>${latex}</em>`; }
  });
  return result;
}

/** Tải file xuống dưới dạng .doc (Word mở được) */
function downloadWordDoc(htmlBody: string, filename: string, title = '') {
  const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<meta name="ProgId" content="Word.Document">
<meta name="Generator" content="Math Matrix Pro 2026">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">
<title>${title}</title>
<style>
  @page {
    size: 210mm 297mm;
    margin: 25mm 20mm 25mm 30mm;
    mso-page-orientation: portrait;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.5;
    color: #000000;
    margin: 0;
    padding: 0;
  }
  h1 { font-size: 14pt; font-weight: bold; text-align: center; margin: 6pt 0; }
  h2 { font-size: 13pt; font-weight: bold; text-align: center; margin: 4pt 0; }
  p  { font-size: 13pt; margin: 3pt 0; }

  /* ── Bảng chuẩn ── */
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 11pt;
    font-family: 'Times New Roman', Times, serif;
    page-break-inside: avoid;
  }
  th, td {
    border: 1pt solid #000000;
    padding: 3pt 5pt;
    vertical-align: middle;
    text-align: center;
    word-wrap: break-word;
  }
  th {
    background-color: #D9D9D9;
    font-weight: bold;
    font-size: 11pt;
  }
  td.left { text-align: left; }
  td.bold { font-weight: bold; }
  td.total { background-color: #F2F2F2; font-weight: bold; }

  /* ── Đề thi ── */
  .exam-header { text-align: center; margin-bottom: 12pt; }
  .exam-header .school { font-size: 12pt; font-weight: bold; }
  .exam-header .title  { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
  .exam-header .info   { font-size: 12pt; }
  .exam-header .line   { border-top: 1pt solid black; margin: 6pt 0; }

  .phan-header {
    font-size: 13pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 4pt;
  }
  .phan-note {
    font-size: 12pt;
    font-style: italic;
    margin-bottom: 6pt;
  }

  .cau {
    margin: 8pt 0;
    page-break-inside: avoid;
  }
  .cau-num { font-weight: bold; }

  .ds-table { width: 100%; border-collapse: collapse; margin: 4pt 0; }
  .ds-table td { border: none; padding: 2pt 4pt; font-size: 12pt; }
  .ds-table .label { font-weight: bold; width: 22pt; }
  .ds-table .dung-sai {
    text-align: right;
    white-space: nowrap;
    width: 60pt;
  }
  .box {
    display: inline-block;
    border: 1pt solid #000;
    width: 30pt;
    text-align: center;
    padding: 1pt 2pt;
    font-size: 10pt;
    margin-left: 4pt;
  }

  .tln-blank {
    display: inline-block;
    border-bottom: 1pt solid #000;
    width: 80pt;
    margin-left: 6pt;
  }

  .dap-an-section {
    margin-top: 20pt;
    border-top: 1pt solid #000;
    padding-top: 8pt;
  }
  .dap-an-table { width: 100%; border-collapse: collapse; font-size: 11pt; }
  .dap-an-table th, .dap-an-table td {
    border: 1pt solid #000;
    padding: 2pt 4pt;
    text-align: center;
  }

  .footer-end { text-align: center; margin-top: 20pt; font-weight: bold; font-style: italic; }

  /* KaTeX MathML — Word renders natively, no CSS needed */
</style>
</head>
<body>
${htmlBody}
</body>
</html>`;

  const blob = new Blob(['\ufeff' + fullHtml], {
    type: 'application/msword; charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ============================================================
// 1. XUẤT MA TRẬN ĐỀ THI
// ============================================================
export function exportMatrixWord(
  data: any[],
  countQuestions: (s: string) => number,
  monHoc = 'Toán',
  lop = '12'
) {
  const LEVEL_NAMES = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];

  // Tính tổng toàn bài
  let totalNLC = 0, totalDS = 0, totalTLN = 0;
  const rows: string[] = [];
  let stt = 0;

  data.forEach((chuong: any) => {
    let chuongNLC = 0, chuongDS = 0, chuongTLN = 0;
    const chuongRows: string[] = [];

    chuong.noiDungs.forEach((nd: any, ndIdx: number) => {
      stt++;
      let ndNLC = 0, ndDS = 0, ndTLN = 0;

      // Tính số câu theo mức độ
      const levels = LEVEL_NAMES.map((_, mIdx) => {
        const md = nd.mucDos[mIdx] || {};
        const nlc = countQuestions(md.qs?.nlc || '');
        const ds  = countQuestions(md.qs?.ds  || '');
        const tln = countQuestions(md.qs?.tln || '');
        ndNLC += nlc; ndDS += ds; ndTLN += tln;
        return { nlc, ds, tln };
      });

      chuongNLC += ndNLC; chuongDS += ndDS; chuongTLN += ndTLN;

      // 4 rows con cho 4 mức độ
      LEVEL_NAMES.forEach((mucDo, mIdx) => {
        const { nlc, ds, tln } = levels[mIdx];
        const isFirst = mIdx === 0;
        const rowspan = isFirst ? ` rowspan="4"` : '';
        const rowspanCells = isFirst
          ? `<td${rowspan}>${stt}</td><td class="left"${rowspan}>${chuong.tenChuong}</td><td class="left"${rowspan}>${nd.tenNoiDung}</td>`
          : '';
        chuongRows.push(`<tr>
          ${rowspanCells}
          <td>${mucDo}</td>
          <td>${nlc || ''}</td>
          <td>${ds  || ''}</td>
          <td>${tln || ''}</td>
          <td>${nlc + ds + tln || ''}</td>
        </tr>`);
      });
    });

    rows.push(...chuongRows);

    // Tổng chương
    totalNLC += chuongNLC; totalDS += chuongDS; totalTLN += chuongTLN;
    rows.push(`<tr class="total">
      <td colspan="3" class="bold left">Tổng: ${chuong.tenChuong}</td>
      <td></td>
      <td class="bold">${chuongNLC || ''}</td>
      <td class="bold">${chuongDS  || ''}</td>
      <td class="bold">${chuongTLN || ''}</td>
      <td class="bold">${chuongNLC + chuongDS + chuongTLN}</td>
    </tr>`);
  });

  const body = `
<div class="exam-header">
  <p class="school">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
  <h1>MA TRẬN ĐỀ KIỂM TRA</h1>
  <h2>MÔN: ${monHoc} — LỚP ${lop}</h2>
  <p class="info">Năm học 2025-2026</p>
  <div class="line"></div>
</div>

<table>
  <thead>
    <tr>
      <th rowspan="2">STT</th>
      <th rowspan="2">Nội dung<br>kiến thức</th>
      <th rowspan="2">Đơn vị<br>kiến thức</th>
      <th rowspan="2">Mức độ<br>nhận thức</th>
      <th>Câu TNPA<br><small>(Phần I)</small></th>
      <th>Câu Đúng/Sai<br><small>(Phần II)</small></th>
      <th>Trả lời ngắn<br><small>(Phần III)</small></th>
      <th rowspan="2">Tổng<br>câu</th>
    </tr>
    <tr>
      <th>Số câu</th>
      <th>Số câu</th>
      <th>Số câu</th>
    </tr>
  </thead>
  <tbody>
    ${rows.join('\n')}
    <tr class="total">
      <td colspan="3" class="bold">TỔNG TOÀN ĐỀ</td>
      <td></td>
      <td class="bold">${totalNLC}</td>
      <td class="bold">${totalDS}</td>
      <td class="bold">${totalTLN}</td>
      <td class="bold">${totalNLC + totalDS + totalTLN}</td>
    </tr>
    <tr>
      <td colspan="3" class="bold">Tỉ lệ %</td>
      <td></td>
      <td>${totalNLC + totalDS + totalTLN > 0 ? Math.round(totalNLC * 100 / (totalNLC + totalDS + totalTLN)) : 0}%</td>
      <td>${totalNLC + totalDS + totalTLN > 0 ? Math.round(totalDS  * 100 / (totalNLC + totalDS + totalTLN)) : 0}%</td>
      <td>${totalNLC + totalDS + totalTLN > 0 ? Math.round(totalTLN * 100 / (totalNLC + totalDS + totalTLN)) : 0}%</td>
      <td>100%</td>
    </tr>
  </tbody>
</table>

<p style="margin-top:16pt; font-size:12pt;">
  <strong>Ghi chú:</strong> TNPA: Trắc nghiệm nhiều phương án; Đúng/Sai: Câu trắc nghiệm đúng sai 4 phát biểu; TLN: Câu trả lời ngắn.
</p>`;

  downloadWordDoc(body, `ma-tran-de-thi-${monHoc.toLowerCase()}.doc`, `Ma trận đề thi ${monHoc}`);
}

// ============================================================
// 2. XUẤT MA TRẬN ĐẶC TẢ
// ============================================================
export function exportSpecMatrixWord(
  data: any[],
  countQuestions: (s: string) => number,
  monHoc = 'Toán',
  lop = '12'
) {
  const LEVEL_NAMES = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];
  const rows: string[] = [];
  let stt = 0;

  data.forEach((chuong: any) => {
    // Header chương
    rows.push(`<tr>
      <td colspan="7" class="bold left" style="background:#E8E8E8;">
        ${chuong.tenChuong}
      </td>
    </tr>`);

    chuong.noiDungs.forEach((nd: any) => {
      stt++;

      LEVEL_NAMES.forEach((mucDo, mIdx) => {
        const md = nd.mucDos[mIdx] || {};
        const nlc = countQuestions(md.qs?.nlc || '');
        const ds  = countQuestions(md.qs?.ds  || '');
        const tln = countQuestions(md.qs?.tln || '');
        const yeuCau = md.yeuCau || `Yêu cầu cần đạt ở mức ${mucDo.toLowerCase()} của ${nd.tenNoiDung}.`;

        const isFirst = mIdx === 0;
        const rowspan = isFirst ? ` rowspan="4"` : '';
        const rowspanCells = isFirst
          ? `<td${rowspan} style="text-align:center;">${stt}</td>
             <td class="left"${rowspan}><strong>${nd.tenNoiDung}</strong></td>`
          : '';

        rows.push(`<tr>
          ${rowspanCells}
          <td>${mucDo}</td>
          <td class="left" style="font-size:10pt;">${yeuCau}</td>
          <td>${nlc || ''}</td>
          <td>${ds  || ''}</td>
          <td>${tln || ''}</td>
        </tr>`);
      });
    });
  });

  const body = `
<div class="exam-header">
  <p class="school">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
  <h1>BẢNG ĐẶC TẢ ĐỀ KIỂM TRA</h1>
  <h2>MÔN: ${monHoc} — LỚP ${lop}</h2>
  <p class="info">Năm học 2025-2026</p>
  <div class="line"></div>
</div>

<table>
  <thead>
    <tr>
      <th rowspan="2" style="width:30pt;">STT</th>
      <th rowspan="2">Nội dung/Đơn vị kiến thức</th>
      <th rowspan="2">Mức độ</th>
      <th rowspan="2">Yêu cầu cần đạt</th>
      <th colspan="3">Số câu hỏi</th>
    </tr>
    <tr>
      <th>TNPA</th>
      <th>Đúng/Sai</th>
      <th>TLN</th>
    </tr>
  </thead>
  <tbody>
    ${rows.join('\n')}
  </tbody>
</table>

<p style="margin-top:16pt; font-size:12pt; font-style:italic;">
  Bảng đặc tả được lập theo Thông tư số 22/2021/TT-BGDĐT và cấu trúc đề thi THPT năm 2025-2026.
</p>`;

  downloadWordDoc(body, `bang-dac-ta-${monHoc.toLowerCase()}.doc`, `Bảng đặc tả ${monHoc}`);
}

// ============================================================
// 3. XUẤT ĐỀ THI — Chuẩn BGD 2025-2026
// ============================================================
export async function exportExamWord(
  exam: any[],
  monHoc = 'Toán',
  lop = '12',
  thoiGian = '90',
  truong = 'TRƯỜNG THPT ...',
  maDeThiNum = '112'
) {
  if (!exam || exam.length === 0) {
    alert('Chưa có đề thi! Vui lòng tạo đề thi trước.');
    return;
  }
  // Pre-load KaTeX để renderMathSync hoạt động đúng
  await loadKatex();

  const phanI   = exam.filter(q => q.phan === 'I');
  const phanII  = exam.filter(q => q.phan === 'II');
  const phanIII = exam.filter(q => q.phan === 'III');
  const totalPages = Math.max(3, Math.ceil(exam.length / 10));

  // ── Phần I: Trắc nghiệm nhiều phương án ──
  const buildPhanI = () => {
    if (phanI.length === 0) return '';
    const items = phanI.map((q, i) => {
      const stt = i + 1;
      const noiDung = renderMathSync(q.noiDung || `Câu hỏi trắc nghiệm ${stt}.`);
      const optTexts: string[] = q.options && q.options.length === 4
        ? q.options
        : ['...', '...', '...', '...'];
      // Layout: dòng 1 = A + B, dòng 2 = C + D (2 cột, giống mẫu BGD)
      const row1 = `<tr style="border:none;">
        <td style="border:none; padding:1pt 8pt 1pt 20pt; width:50%; font-size:13pt;">A. ${renderMathSync(String(optTexts[0] || '...'))}</td>
        <td style="border:none; padding:1pt 8pt; width:50%; font-size:13pt;">B. ${renderMathSync(String(optTexts[1] || '...'))}</td>
      </tr>`;
      const row2 = `<tr style="border:none;">
        <td style="border:none; padding:1pt 8pt 1pt 20pt; width:50%; font-size:13pt;">C. ${renderMathSync(String(optTexts[2] || '...'))}</td>
        <td style="border:none; padding:1pt 8pt; width:50%; font-size:13pt;">D. ${renderMathSync(String(optTexts[3] || '...'))}</td>
      </tr>`;

      return `<div class="cau">
  <p style="font-size:13pt; margin:6pt 0 2pt 0;"><b>Câu ${stt}.</b> ${noiDung}</p>
  <table style="width:100%; border:none; border-collapse:collapse; margin:0;">
    ${row1}${row2}
  </table>
</div>`;
    });

    return `
<p style="font-size:13pt; font-weight:bold; margin-top:12pt; margin-bottom:2pt;">PHẦN I. Câu trắc nghiệm nhiều phương án.</p>
<p style="font-size:12pt; font-style:italic; margin:0 0 6pt 0;">Thí sinh trả lời từ câu 1 đến câu ${phanI.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án.</p>
${items.join('\n')}`;
  };

  // ── Phần II: Đúng/Sai ──
  const buildPhanII = () => {
    if (phanII.length === 0) return '';
    const items = phanII.map((q, i) => {
      const stt = i + 1;
      const context = renderMathSync(q.context || q.noiDung || `Câu Đúng/Sai ${i + 1}.`);
      const stmtLabels = ['a', 'b', 'c', 'd'];

      const stmtRows = (q.statements || [{text:'Mệnh đề a.'},{text:'Mệnh đề b.'},{text:'Mệnh đề c.'},{text:'Mệnh đề d.'}])
        .map((stmt: any, li: number) => {
          const stmtText = renderMathSync(stmt.text || `Mệnh đề ${stmtLabels[li]}.`);
          return `<p style="font-size:13pt; margin:2pt 0 2pt 20pt;">${stmtLabels[li]}) ${stmtText}</p>`;
        }).join('\n');

      return `<div class="cau">
  <p style="font-size:13pt; margin:6pt 0 2pt 0;"><b>Câu ${stt}:</b></p>
  <p style="font-size:13pt; margin:2pt 0;">${context}</p>
  ${stmtRows}
</div>`;
    });

    return `
<p style="font-size:13pt; font-weight:bold; margin-top:14pt; margin-bottom:2pt;">PHẦN II. Câu trắc nghiệm đúng sai.</p>
<p style="font-size:12pt; font-style:italic; margin:0 0 6pt 0;">(Thí sinh trả lời từ câu 1 đến câu ${phanII.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.)</p>
${items.join('\n')}`;
  };

  // ── Phần III: Trả lời ngắn ──
  const buildPhanIII = () => {
    if (phanIII.length === 0) return '';
    const items = phanIII.map((q, i) => {
      const stt = i + 1;
      const noiDung = renderMathSync(q.noiDung || `Câu trả lời ngắn ${i + 1}.`);
      return `<div class="cau">
  <p style="font-size:13pt; margin:6pt 0 2pt 0;"><b>Câu ${stt}.</b></p>
  <p style="font-size:13pt; margin:2pt 0;">${noiDung}</p>
</div>`;
    });

    return `
<p style="font-size:13pt; font-weight:bold; margin-top:14pt; margin-bottom:2pt;">PHẦN III. Câu hỏi trắc nghiệm trả lời ngắn.</p>
<p style="font-size:12pt; font-style:italic; margin:0 0 6pt 0;">Thí sinh trả lời từ câu 1 đến câu ${phanIII.length}</p>
${items.join('\n')}`;
  };

  // ── ĐÁP ÁN VÀ THANG ĐIỂM CHẤM ──
  const buildDapAn = () => {
    const td  = (extra = '') => `border:1pt solid #000; padding:3pt 7pt; text-align:center; font-size:12pt; font-family:'Times New Roman',serif;${extra}`;
    const tdH = () => td(' font-weight:bold;');

    // ── PHẦN I: 2 hàng — hàng header + hàng đáp án ──
    const I_headers = phanI.map((_, i) =>
      `<td style="${tdH()}">Câu<br>${i + 1}</td>`
    ).join('');
    const I_answers = phanI.map(q =>
      `<td style="${td(' font-weight:bold;')}">${q.dapAn || 'A'}</td>`
    ).join('');

    const dapAnPhanI = phanI.length > 0 ? `
<p style="font-size:13pt; font-weight:bold; margin:12pt 0 2pt 0;">PHẦN I</p>
<p style="font-size:12pt; margin:0 0 6pt 0;">(Mỗi câu trả lời đúng học sinh được <b>0,25 điểm</b>)</p>
<table style="border-collapse:collapse; width:100%; font-size:12pt; margin-bottom:14pt;">
  <tr>
    <td style="${tdH()}">Câu</td>
    ${I_headers}
  </tr>
  <tr>
    <td style="${tdH()}">Chọn</td>
    ${I_answers}
  </tr>
</table>` : '';

    // ── PHẦN II: cột = câu, hàng = a/b/c/d ──
    const II_header = phanII.map((_, i) =>
      `<td style="${tdH()}">Câu ${i + 1}</td>`
    ).join('');
    const II_rows: string[] = [];
    for (let li = 0; li < 4; li++) {
      const lbl = ['a', 'b', 'c', 'd'][li];
      const cells = phanII.map(q => {
        const s = (q.statements || [])[li];
        const val = s ? (s.answer === 'Đúng' ? 'Đ' : 'S') : '?';
        return `<td style="${td()}">${lbl}) ${val}</td>`;
      }).join('');
      II_rows.push(`<tr>${cells}</tr>`);
    }

    const dapAnPhanII = phanII.length > 0 ? `
<p style="font-size:13pt; font-weight:bold; margin:14pt 0 2pt 0;">PHẦN II</p>
<p style="font-size:12pt; margin:2pt 0 2pt 0;">Điểm tối đa của 01 câu hỏi là <b>1 điểm.</b></p>
<p style="font-size:12pt; margin:1pt 0 1pt 20pt;">- Thí sinh chỉ lựa chọn chính xác 01 ý trong 1 câu hỏi được <b>0,1 điểm</b>.</p>
<p style="font-size:12pt; margin:1pt 0 1pt 20pt;">- Thí sinh chỉ lựa chọn chính xác 02 ý trong 1 câu hỏi được <b>0,25 điểm</b>.</p>
<p style="font-size:12pt; margin:1pt 0 1pt 20pt;">- Thí sinh chỉ lựa chọn chính xác 03 ý trong 1 câu hỏi được <b>0,5 điểm</b>.</p>
<p style="font-size:12pt; margin:1pt 0 8pt 20pt;">- Thí sinh chỉ lựa chọn chính xác 04 ý trong 1 câu hỏi được <b>1 điểm</b>.</p>
<table style="border-collapse:collapse; font-size:12pt; margin:0 auto 14pt auto;">
  <tr>${II_header}</tr>
  ${II_rows.join('\n')}
</table>` : '';

    // ── PHẦN III: 2 hàng giống PHẦN I ──
    const III_headers = phanIII.map((_, i) =>
      `<td style="${tdH()}">Câu ${i + 1}</td>`
    ).join('');
    const III_answers = phanIII.map(q => {
      const raw = (q.dapAn || '...').replace(/\$\$?([^$]+)\$\$?/g, (_: string, t: string) => t.trim());
      return `<td style="${td()}">${raw}</td>`;
    }).join('');

    const dapAnPhanIII = phanIII.length > 0 ? `
<p style="font-size:13pt; font-weight:bold; margin:14pt 0 2pt 0;">PHẦN III</p>
<p style="font-size:12pt; margin:0 0 6pt 0;">(Mỗi câu trả lời đúng học sinh được <b>0,5 điểm</b>)</p>
<table style="border-collapse:collapse; width:100%; font-size:12pt; margin-bottom:14pt;">
  <tr>
    <td style="${tdH()}">Câu</td>
    ${III_headers}
  </tr>
  <tr>
    <td style="${tdH()}">Chọn</td>
    ${III_answers}
  </tr>
</table>` : '';

    return `
<div style="page-break-before:always; padding-top:10pt;">
  <p style="text-align:center; font-size:14pt; font-weight:bold; margin:10pt 0 16pt 0; text-transform:uppercase;">ĐÁP ÁN VÀ THANG ĐIỂM CHẤM</p>
  ${dapAnPhanI}
  ${dapAnPhanII}
  ${dapAnPhanIII}
</div>`;
  };

  // ── BODY CHÍNH ──
  const body = `
<div style="text-align:center; margin-bottom:10pt;">
  <p style="font-size:14pt; font-weight:bold; margin:0;">MÔN TOÁN - Lớp ${lop}</p>
  <p style="font-size:12pt; font-style:italic; margin:2pt 0;">Thời gian làm bài: ${thoiGian} phút</p>
  <p style="font-size:11pt; font-style:italic; margin:0 0 6pt 0;">(không kể thời gian phát đề)</p>
  <p style="font-size:11pt; font-style:italic; margin:0 0 8pt 0;">(Đề thi có ${totalPages} trang)</p>
  <table style="margin:0 auto; border-collapse:collapse;">
    <tr>
      <td style="border:2pt solid #000; padding:4pt 20pt; text-align:center; font-size:14pt; font-weight:bold;">
        Mã đề ${maDeThiNum}
      </td>
    </tr>
  </table>
</div>

<p style="font-size:13pt; margin:10pt 0 14pt 0;">
  Họ và tên học sinh: .......................................................................................... Số báo danh: ..........................
</p>

${buildPhanI()}

${buildPhanII()}

${buildPhanIII()}

<p style="text-align:center; font-size:13pt; font-weight:bold; font-style:italic; margin-top:20pt; margin-bottom:0;">
  -------------------- HẾT --------------------
</p>

${buildDapAn()}`;

  downloadWordDoc(body, `de-thi-${monHoc.toLowerCase()}-ma${maDeThiNum}.doc`, `Đề thi ${monHoc} Lớp ${lop}`);
}

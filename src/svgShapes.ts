/**
 * svgShapes.ts — Hình minh họa SVG inline cho câu hỏi Toán
 * Trả về chuỗi SVG có thể nhúng trực tiếp vào <img src="data:image/svg+xml,..."/>
 */

function toDataUri(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Khối chóp tứ giác đều S.ABCD */
export function pyramidSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
  <style>line{stroke:#222;stroke-width:1.5} text{font-family:Times New Roman;font-size:13px;fill:#111}</style>
  <!-- Đáy ABCD (hình thoi perspective) -->
  <polygon points="100,140 160,110 100,80 40,110" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Cạnh bên SA, SB, SC, SD -->
  <line x1="100" y1="20" x2="160" y2="110"/>
  <line x1="100" y1="20" x2="100" y2="80"/>
  <line x1="100" y1="20" x2="40" y2="110"/>
  <line x1="100" y1="20" x2="100" y2="140" stroke-dasharray="5,3"/>
  <!-- Đường chéo ẩn -->
  <line x1="40" y1="110" x2="160" y2="110" stroke-dasharray="4,3" stroke="#888"/>
  <!-- Nhãn -->
  <text x="95" y="14">S</text>
  <text x="163" y="114">B</text>
  <text x="95" y="76">C</text>
  <text x="26" y="114">D</text>
  <text x="95" y="156">A</text>
</svg>`;
  return toDataUri(svg);
}

/** Hình lăng trụ tam giác đều ABC.A'B'C' */
export function prismSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
  <style>line{stroke:#222;stroke-width:1.5} text{font-family:Times New Roman;font-size:13px;fill:#111}</style>
  <!-- Đáy dưới ABC -->
  <polygon points="60,150 140,150 100,120" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Đáy trên A'B'C' -->
  <polygon points="60,50 140,50 100,20" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Cạnh bên -->
  <line x1="60" y1="150" x2="60" y2="50"/>
  <line x1="140" y1="150" x2="140" y2="50"/>
  <line x1="100" y1="120" x2="100" y2="20"/>
  <!-- Ẩn -->
  <line x1="60" y1="150" x2="100" y2="120" stroke-dasharray="4,3" stroke="#888"/>
  <!-- Nhãn -->
  <text x="44" y="165">A</text><text x="143" y="165">B</text><text x="97" y="118">C</text>
  <text x="44" y="46">A'</text><text x="143" y="46">B'</text><text x="97" y="16">C'</text>
</svg>`;
  return toDataUri(svg);
}

/** Hình nón */
export function coneSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="170" viewBox="0 0 180 170">
  <style>text{font-family:Times New Roman;font-size:12px;fill:#111}</style>
  <!-- Đáy ellipse -->
  <ellipse cx="90" cy="140" rx="60" ry="15" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Hai đường sinh -->
  <line x1="90" y1="25" x2="30" y2="140" stroke="#222" stroke-width="1.5"/>
  <line x1="90" y1="25" x2="150" y2="140" stroke="#222" stroke-width="1.5"/>
  <!-- Đường cao (ẩn) -->
  <line x1="90" y1="25" x2="90" y2="140" stroke="#555" stroke-width="1" stroke-dasharray="5,3"/>
  <!-- Bán kính -->
  <line x1="90" y1="140" x2="150" y2="140" stroke="#555" stroke-width="1"/>
  <!-- Nhãn -->
  <text x="86" y="20">S</text>
  <text x="84" y="162">O</text>
  <text x="152" y="144">r</text>
  <text x="92" y="85">h</text>
</svg>`;
  return toDataUri(svg);
}

/** Hình trụ */
export function cylinderSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <style>text{font-family:Times New Roman;font-size:12px;fill:#111}</style>
  <!-- Đáy trên -->
  <ellipse cx="90" cy="35" rx="55" ry="14" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Đáy dưới -->
  <ellipse cx="90" cy="145" rx="55" ry="14" fill="none" stroke="#222" stroke-width="1.5"/>
  <!-- Đường bên -->
  <line x1="35" y1="35" x2="35" y2="145" stroke="#222" stroke-width="1.5"/>
  <line x1="145" y1="35" x2="145" y2="145" stroke="#222" stroke-width="1.5"/>
  <!-- Trục và chú thích -->
  <line x1="90" y1="35" x2="90" y2="145" stroke="#888" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="90" y1="145" x2="145" y2="145" stroke="#555" stroke-width="1"/>
  <text x="110" y="162">r</text>
  <text x="93" y="95">h</text>
</svg>`;
  return toDataUri(svg);
}

/** Đồ thị hàm số bậc 3 đơn giản (có cực trị) */
export function cubicGraphSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
  <style>text{font-family:Times New Roman;font-size:11px;fill:#111}</style>
  <!-- Trục -->
  <line x1="20" y1="90" x2="185" y2="90" stroke="#333" stroke-width="1.2"/>
  <line x1="100" y1="10" x2="100" y2="170" stroke="#333" stroke-width="1.2"/>
  <!-- Mũi tên -->
  <polygon points="185,87 192,90 185,93" fill="#333"/>
  <polygon points="97,10 100,3 103,10" fill="#333"/>
  <!-- Đồ thị y = x^3-3x (vẽ tay bằng path) -->
  <path d="M 30,160 C 50,130 65,50 80,45 C 90,43 105,140 120,135 C 135,130 155,80 170,20"
        fill="none" stroke="#1a73e8" stroke-width="2"/>
  <!-- Điểm cực trị -->
  <circle cx="78" cy="45" r="3" fill="#e53935"/>
  <circle cx="122" cy="135" r="3" fill="#e53935"/>
  <!-- Nhãn -->
  <text x="188" y="94">x</text>
  <text x="104" y="8">y</text>
  <text x="104" y="94">O</text>
</svg>`;
  return toDataUri(svg);
}

/** Đồ thị hàm bậc 4 trùng phương */
export function quarticGraphSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180">
  <style>text{font-family:Times New Roman;font-size:11px;fill:#111}</style>
  <line x1="20" y1="90" x2="185" y2="90" stroke="#333" stroke-width="1.2"/>
  <line x1="100" y1="10" x2="100" y2="170" stroke="#333" stroke-width="1.2"/>
  <polygon points="185,87 192,90 185,93" fill="#333"/>
  <polygon points="97,10 100,3 103,10" fill="#333"/>
  <!-- y = x^4-2x^2 (W-shape) -->
  <path d="M 30,160 C 50,50 70,130 100,140 C 130,130 150,50 170,160"
        fill="none" stroke="#1a73e8" stroke-width="2"/>
  <circle cx="100" cy="140" r="3" fill="#e53935"/>
  <text x="188" y="94">x</text>
  <text x="104" y="8">y</text>
  <text x="104" y="94">O</text>
</svg>`;
  return toDataUri(svg);
}

/** Khối cầu */
export function sphereSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <style>text{font-family:Times New Roman;font-size:12px;fill:#111}</style>
  <circle cx="80" cy="80" r="60" fill="none" stroke="#222" stroke-width="1.5"/>
  <ellipse cx="80" cy="80" rx="60" ry="18" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="5,3"/>
  <line x1="80" y1="20" x2="80" y2="140" stroke="#888" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="80" y1="80" x2="140" y2="80" stroke="#555" stroke-width="1"/>
  <text x="108" y="76">R</text>
  <text x="76" y="76">O</text>
</svg>`;
  return toDataUri(svg);
}

/** Hình thang (bài toán diện tích) */
export function trapezoidSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="130" viewBox="0 0 200 130">
  <style>text{font-family:Times New Roman;font-size:12px;fill:#111}</style>
  <polygon points="40,110 160,110 130,20 70,20" fill="none" stroke="#222" stroke-width="1.5"/>
  <line x1="70" y1="20" x2="70" y2="110" stroke="#888" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="10" y="115">A</text><text x="162" y="115">B</text>
  <text x="132" y="18">C</text><text x="52" y="18">D</text>
  <text x="72" y="68">h</text>
</svg>`;
  return toDataUri(svg);
}

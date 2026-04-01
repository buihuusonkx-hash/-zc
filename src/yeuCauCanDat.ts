/**
 * Yêu cầu cần đạt theo chương trình Toán 12 - Cánh Diều (2025)
 * Dữ liệu được tổ chức theo: Tên bài → 4 mức độ nhận thức
 * Sử dụng để tự động điền "Yêu cầu cần đạt" khi nhập tên bài học
 */

export interface YeuCauData {
  [key: string]: {
    nhanBiet: string;
    thongHieu: string;
    vanDung: string;
    vanDungCao: string;
  };
}

export const YEU_CAU_CAN_DAT: YeuCauData = {
  // ===== CHƯƠNG 1: ỨNG DỤNG ĐẠO HÀM =====
  
  "Tính đơn điệu của hàm số": {
    nhanBiet: "Nhận biết được tính đơn điệu của hàm số dựa vào dấu của đạo hàm. Nêu được quy tắc xét tính đơn điệu của hàm số.",
    thongHieu: "Hiểu và giải thích được mối liên hệ giữa dấu của đạo hàm và tính đơn điệu của hàm số. Xác định được các khoảng đơn điệu của hàm số.",
    vanDung: "Vận dụng được quy tắc xét tính đơn điệu để tìm khoảng đồng biến, nghịch biến của các hàm số đa thức, phân thức, lượng giác.",
    vanDungCao: "Giải quyết được các bài toán tìm điều kiện của tham số để hàm số đơn điệu trên khoảng cho trước."
  },

  "Giá trị lớn nhất và giá trị nhỏ nhất của hàm số": {
    nhanBiet: "Nhận biết được khái niệm giá trị lớn nhất, giá trị nhỏ nhất của hàm số trên một tập hợp. Nêu được quy tắc tìm GTLN, GTNN.",
    thongHieu: "Hiểu được phương pháp tìm GTLN, GTNN của hàm số liên tục trên đoạn [a;b]. Phân biệt cực trị và giá trị lớn nhất, nhỏ nhất.",
    vanDung: "Tìm được GTLN, GTNN của hàm số trên đoạn, trên khoảng. Áp dụng vào các bài toán thực tế về tối ưu.",
    vanDungCao: "Giải quyết được bài toán tìm GTLN, GTNN chứa tham số hoặc bài toán thực tế phức tạp yêu cầu lập mô hình hàm số."
  },

  "Đường tiệm cận của đồ thị hàm số": {
    nhanBiet: "Nhận biết được các khái niệm tiệm cận đứng, tiệm cận ngang của đồ thị hàm số. Nêu được định nghĩa đường tiệm cận.",
    thongHieu: "Hiểu và xác định được phương trình đường tiệm cận đứng, tiệm cận ngang của đồ thị hàm phân thức bậc nhất trên bậc nhất.",
    vanDung: "Tìm được tiệm cận đứng, tiệm cận ngang của các hàm phân thức. Xác định đường tiệm cận từ đồ thị cho trước.",
    vanDungCao: "Xác định tiệm cận của đồ thị hàm số chứa tham số. Giải bài toán liên quan đến vị trí tương đối của đồ thị và đường tiệm cận."
  },

  "Khảo sát sự biến thiên và vẽ đồ thị của hàm số": {
    nhanBiet: "Nhận biết được sơ đồ khảo sát hàm số. Nêu được các bước khảo sát sự biến thiên và vẽ đồ thị hàm số.",
    thongHieu: "Hiểu và thực hiện được các bước khảo sát hàm số bậc ba, bậc bốn trùng phương, phân thức bậc nhất trên bậc nhất.",
    vanDung: "Khảo sát và vẽ được đồ thị hàm số. Dựa vào đồ thị biện luận số nghiệm phương trình, bất phương trình.",
    vanDungCao: "Giải quyết bài toán tương giao đồ thị chứa tham số. Sử dụng đồ thị để giải quyết bài toán thực tiễn phức tạp."
  },

  // ===== CHƯƠNG 2: TỌA ĐỘ VECTƠ TRONG KHÔNG GIAN =====

  "Vectơ và các phép toán vectơ trong không gian": {
    nhanBiet: "Nhận biết được khái niệm vectơ trong không gian: hướng, độ dài, vectơ bằng nhau, vectơ-không.",
    thongHieu: "Hiểu được các phép toán cộng, trừ vectơ, nhân vectơ với một số trong không gian. Phân biệt các tính chất.",
    vanDung: "Thực hiện được phép cộng, trừ vectơ, nhân vectơ với số. Chứng minh các đẳng thức vectơ trong không gian.",
    vanDungCao: "Giải quyết bài toán hình học không gian bằng phương pháp vectơ phức tạp."
  },

  "Toạ độ của vectơ trong không gian": {
    nhanBiet: "Nhận biết được hệ trục tọa độ Oxyz, tọa độ vectơ, tọa độ điểm trong không gian.",
    thongHieu: "Hiểu được cách xác định tọa độ vectơ, tọa độ điểm trong hệ trục Oxyz. Tính được tọa độ trung điểm, trọng tâm.",
    vanDung: "Tìm được tọa độ vectơ, tọa độ điểm. Tính khoảng cách giữa hai điểm, tọa độ trung điểm, trọng tâm tam giác.",
    vanDungCao: "Giải quyết bài toán tọa độ không gian liên quan đến quỹ tích, cực trị khoảng cách."
  },

  "Biểu thức toạ độ của các phép toán vectơ": {
    nhanBiet: "Nhận biết được biểu thức tọa độ của phép cộng, trừ vectơ, nhân vectơ với số, tích vô hướng.",
    thongHieu: "Hiểu và áp dụng được biểu thức tọa độ để tính tích vô hướng, xét vuông góc, tính góc giữa hai vectơ.",
    vanDung: "Sử dụng biểu thức tọa độ giải các bài toán về góc, khoảng cách, chứng minh vuông góc trong không gian.",
    vanDungCao: "Giải quyết bài toán phức tạp kết hợp tích vô hướng và các phép toán vectơ trong không gian."
  },

  // ===== CHƯƠNG 3: SỐ ĐẶC TRƯNG MẪU SỐ LIỆU GHÉP NHÓM =====

  "Khoảng biến thiên, khoảng tứ phân vị của mẫu số liệu ghép nhóm": {
    nhanBiet: "Nhận biết được khái niệm khoảng biến thiên, tứ phân vị, khoảng tứ phân vị của mẫu số liệu ghép nhóm.",
    thongHieu: "Hiểu được ý nghĩa thống kê của khoảng biến thiên và khoảng tứ phân vị. Giải thích được mức độ phân tán.",
    vanDung: "Tính được khoảng biến thiên, các tứ phân vị, khoảng tứ phân vị của mẫu số liệu ghép nhóm cho trước.",
    vanDungCao: "Vận dụng các số đặc trưng để phân tích, so sánh và rút ra kết luận từ dữ liệu thực tế phức tạp."
  },

  "Phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm": {
    nhanBiet: "Nhận biết được công thức tính phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm.",
    thongHieu: "Hiểu được ý nghĩa thống kê của phương sai và độ lệch chuẩn. Phân biệt với khoảng tứ phân vị.",
    vanDung: "Tính được phương sai, độ lệch chuẩn của mẫu số liệu ghép nhóm. So sánh mức độ phân tán của hai mẫu.",
    vanDungCao: "Phân tích dữ liệu thực tế, rút ra nhận xét và đưa ra quyết định dựa trên các số đặc trưng đo mức độ phân tán."
  },

  // ===== CHƯƠNG 4: NGUYÊN HÀM. TÍCH PHÂN =====

  "Nguyên hàm": {
    nhanBiet: "Nhận biết được khái niệm nguyên hàm của hàm số. Nêu được định nghĩa và tính chất cơ bản của nguyên hàm.",
    thongHieu: "Hiểu được mối liên hệ giữa nguyên hàm và đạo hàm. Giải thích được tính chất của nguyên hàm.",
    vanDung: "Tìm được nguyên hàm của các hàm số cơ bản bằng bảng nguyên hàm. Kiểm tra một hàm số có phải nguyên hàm hay không.",
    vanDungCao: "Tìm nguyên hàm thỏa mãn điều kiện cho trước. Giải bài toán ứng dụng liên quan đến nguyên hàm."
  },

  "Nguyên hàm của một số hàm số sơ cấp": {
    nhanBiet: "Nhận biết được công thức nguyên hàm của các hàm số sơ cấp: lũy thừa, mũ, lượng giác.",
    thongHieu: "Hiểu và áp dụng được quy tắc tìm nguyên hàm: đổi biến số, nguyên hàm từng phần.",
    vanDung: "Tính được nguyên hàm bằng phương pháp đổi biến, nguyên hàm từng phần cho các hàm số phức tạp.",
    vanDungCao: "Tìm nguyên hàm của các hàm số phức tạp kết hợp nhiều phương pháp. Giải quyết bài toán thực tế."
  },

  "Tích phân": {
    nhanBiet: "Nhận biết được khái niệm tích phân xác định. Nêu được định nghĩa, tính chất và công thức Newton-Leibniz.",
    thongHieu: "Hiểu được ý nghĩa hình học của tích phân (diện tích hình thang cong). Áp dụng công thức Newton-Leibniz.",
    vanDung: "Tính được tích phân bằng công thức Newton-Leibniz, phương pháp đổi biến, tích phân từng phần.",
    vanDungCao: "Tính tích phân phức tạp kết hợp nhiều phương pháp. Chứng minh bất đẳng thức liên quan đến tích phân."
  },

  "Ứng dụng hình học của tích phân": {
    nhanBiet: "Nhận biết được công thức tính diện tích hình phẳng, thể tích vật thể tròn xoay bằng tích phân.",
    thongHieu: "Hiểu và xác định được cận tích phân, hàm dưới dấu tích phân để tính diện tích, thể tích.",
    vanDung: "Tính được diện tích hình phẳng giới hạn bởi các đường. Tính thể tích vật thể tròn xoay.",
    vanDungCao: "Giải quyết bài toán tính diện tích, thể tích phức tạp chứa tham số. Ứng dụng vào bài toán thực tiễn."
  },

  // ===== CHƯƠNG 5: PT MẶT PHẲNG, ĐƯỜNG THẲNG, MẶT CẦU =====

  "Phương trình mặt phẳng": {
    nhanBiet: "Nhận biết được vectơ pháp tuyến của mặt phẳng. Nêu được dạng phương trình tổng quát của mặt phẳng.",
    thongHieu: "Hiểu và viết được phương trình mặt phẳng khi biết vectơ pháp tuyến và một điểm, hoặc ba điểm không thẳng hàng.",
    vanDung: "Viết được phương trình mặt phẳng trong các trường hợp khác nhau. Tính góc giữa hai mặt phẳng, khoảng cách.",
    vanDungCao: "Giải quyết bài toán phức tạp về vị trí tương đối, khoảng cách, góc liên quan đến mặt phẳng chứa tham số."
  },

  "Phương trình đường thẳng": {
    nhanBiet: "Nhận biết được vectơ chỉ phương của đường thẳng. Nêu được dạng phương trình tham số, chính tắc của đường thẳng.",
    thongHieu: "Hiểu và viết được phương trình đường thẳng khi biết điểm và vectơ chỉ phương. Xác định vị trí tương đối.",
    vanDung: "Viết được phương trình đường thẳng, tính khoảng cách từ điểm đến đường thẳng, giữa hai đường thẳng.",
    vanDungCao: "Giải quyết bài toán về đường vuông góc chung, khoảng cách, hình chiếu vuông góc trong không gian."
  },

  "Phương trình mặt cầu": {
    nhanBiet: "Nhận biết được phương trình mặt cầu với tâm I(a;b;c) và bán kính R. Nêu được dạng tổng quát.",
    thongHieu: "Hiểu và xác định được tâm, bán kính mặt cầu từ phương trình. Viết phương trình mặt cầu khi biết tâm và bán kính.",
    vanDung: "Viết được phương trình mặt cầu trong các trường hợp: ngoại tiếp hình hộp, tiếp xúc mặt phẳng. Tìm giao tuyến.",
    vanDungCao: "Giải quyết bài toán về mặt cầu ngoại tiếp, nội tiếp khối đa diện. Tìm bán kính mặt cầu chứa tham số."
  },

  // ===== BÀI TẬP CUỐI CHƯƠNG =====

  "Bài tập cuối chương 2": {
    nhanBiet: "Ôn tập các khái niệm về vectơ, tọa độ vectơ, tọa độ điểm trong không gian.",
    thongHieu: "Tổng hợp kiến thức về phép toán vectơ, tích vô hướng, biểu thức tọa độ.",
    vanDung: "Giải các bài tập tổng hợp về vectơ, tọa độ, khoảng cách, góc trong không gian.",
    vanDungCao: "Giải quyết bài toán nâng cao kết hợp nhiều kiến thức vectơ và tọa độ trong không gian."
  },

  "Bài tập cuối chương 3": {
    nhanBiet: "Ôn tập các khái niệm về khoảng biến thiên, tứ phân vị, phương sai, độ lệch chuẩn.",
    thongHieu: "Tổng hợp kiến thức về các số đặc trưng đo mức độ phân tán.",
    vanDung: "Giải các bài tập tổng hợp về thống kê mẫu số liệu ghép nhóm.",
    vanDungCao: "Phân tích dữ liệu thực tế phức tạp và đưa ra nhận xét, so sánh."
  },

  "Bài tập cuối chương IV": {
    nhanBiet: "Ôn tập các khái niệm về nguyên hàm và tích phân.",
    thongHieu: "Tổng hợp các phương pháp tìm nguyên hàm và tính tích phân.",
    vanDung: "Giải bài tập tổng hợp về nguyên hàm, tích phân và ứng dụng hình học.",
    vanDungCao: "Giải quyết bài toán tích phân nâng cao và ứng dụng thực tế phức tạp."
  },

  // ===== CHƯƠNG 6: XÁC SUẤT =====

  "Xác suất": {
    nhanBiet: "Nhận biết được các khái niệm cơ bản: biến cố, không gian mẫu, xác suất của biến cố. Công thức tính xác suất cổ điển.",
    thongHieu: "Hiểu được các phép toán trên biến cố. Áp dụng quy tắc cộng xác suất cho biến cố xung khắc và quy tắc nhân cho biến cố độc lập.",
    vanDung: "Tính được xác suất của biến cố khi biết không gian mẫu. Giải bài toán tổ hợp-xác suất trong thực tế.",
    vanDungCao: "Giải quyết bài toán xác suất phức tạp kết hợp đếm, tổ hợp và quy tắc xác suất."
  },

  "Xác suất có điều kiện": {
    nhanBiet: "Nhận biết được khái niệm xác suất có điều kiện $P(A|B)$. Nêu được công thức tính xác suất có điều kiện.",
    thongHieu: "Hiểu được công thức nhân xác suất, công thức xác suất đầy đủ. Phân biệt biến cố độc lập và phụ thuộc.",
    vanDung: "Tính được xác suất có điều kiện. Áp dụng công thức xác suất toàn phần và công thức Bayes vào bài toán thực tế.",
    vanDungCao: "Vận dụng công thức Bayes vào bài toán chẩn đoán, kiểm định. Giải quyết bài toán nhiều tầng điều kiện."
  },

  // ===== MŨ - LOGARIT =====

  "Hàm số mũ - Hàm số Logarit": {
    nhanBiet: "Nhận biết được định nghĩa hàm số mũ, hàm số logarit. Nêu được tính chất và đồ thị của hàm số mũ, logarit.",
    thongHieu: "Hiểu được các tính chất của lũy thừa và logarit: đổi cơ số, logarit của tích, thương, lũy thừa.",
    vanDung: "Rút gọn, tính toán biểu thức lũy thừa, logarit. Giải phương trình, bất phương trình mũ, logarit cơ bản.",
    vanDungCao: "Giải phương trình, bất phương trình mũ-logarit phức tạp chứa tham số. Ứng dụng mô hình tăng trưởng."
  },

  "Phương trình - Bất phương trình mũ và logarit": {
    nhanBiet: "Nhận biết được dạng phương trình mũ, logarit cơ bản. Nêu được nguyên tắc đặt ẩn phụ.",
    thongHieu: "Hiểu và áp dụng được phương pháp đưa về cùng cơ số hoặc đặt ẩn phụ để giải phương trình mũ, logarit.",
    vanDung: "Giải được phương trình, hệ phương trình, bất phương trình mũ và logarit. Tìm điều kiện xác định.",
    vanDungCao: "Giải phương trình, bất phương trình chứa tham số. Tìm điều kiện tham số để phương trình có nghiệm thỏa mãn."
  },

  // ===== SỐ PHỨC =====

  "Số phức": {
    nhanBiet: "Nhận biết được khái niệm số phức, phần thực, phần ảo, mô-đun, số phức liên hợp.",
    thongHieu: "Hiểu và thực hiện được các phép toán cộng, trừ, nhân, chia số phức. Tính mô-đun số phức.",
    vanDung: "Giải được phương trình bậc hai với hệ số thực trong tập số phức. Tính lũy thừa số phức.",
    vanDungCao: "Giải hệ phương trình số phức. Tìm số phức thỏa mãn điều kiện hình học trên mặt phẳng phức."
  },

  // ===== HÌNH HỌC KHÔNG GIAN =====

  "Khối đa diện": {
    nhanBiet: "Nhận biết được các loại khối đa diện: hình hộp, lăng trụ, chóp. Nêu được công thức tính thể tích.",
    thongHieu: "Hiểu và tính được thể tích, diện tích toàn phần của các khối đa diện thông dụng.",
    vanDung: "Tính thể tích, diện tích khối đa diện trong bài toán thực tế. Xác định tỉ số thể tích khi cắt.",
    vanDungCao: "Giải bài toán về khối đa diện chứa tham số, tối ưu thể tích. Tính nhanh khối đa diện phức tạp."
  },

  "Mặt cầu - Hình trụ - Hình nón": {
    nhanBiet: "Nhận biết được yếu tố (bán kính, đường sinh, chiều cao) của hình trụ, nón, cầu. Nêu công thức diện tích, thể tích.",
    thongHieu: "Hiểu và tính được diện tích xung quanh, toàn phần và thể tích hình trụ, nón, cầu.",
    vanDung: "Tính các đại lượng của mặt tròn xoay trong bài toán thực tiễn. Tính khối cầu ngoại tiếp đa diện.",
    vanDungCao: "Tối ưu kích thước hình trụ, nón nội tiếp/ngoại tiếp cầu. Giải toán thực tế phức tạp."
  },

  "Đường thẳng và mặt phẳng trong không gian": {
    nhanBiet: "Nhận biết phương trình mặt phẳng, đường thẳng trong không gian. Nêu công thức khoảng cách.",
    thongHieu: "Hiểu và viết được phương trình mặt phẳng, đường thẳng. Tính khoảng cách, góc giữa các đối tượng.",
    vanDung: "Viết phương trình mặt phẳng, đường thẳng thỏa điều kiện. Tính khoảng cách từ điểm đến mặt phẳng, đường thẳng.",
    vanDungCao: "Giải bài toán hình học tọa độ không gian phức tạp, tìm điểm thỏa mãn nhiều điều kiện."
  },

  // ===== GIỚI HẠN =====

  "Giới hạn hàm số": {
    nhanBiet: "Nhận biết được khái niệm giới hạn của hàm số tại một điểm và tại vô cực. Nêu được định nghĩa hàm số liên tục.",
    thongHieu: "Hiểu và tính được giới hạn của các hàm số bằng cách khử dạng vô định. Xét tính liên tục của hàm số.",
    vanDung: "Tính giới hạn của hàm số hợp, hàm lượng giác. Xét và sửa tính không liên tục của hàm số.",
    vanDungCao: "Áp dụng định lý giá trị trung gian để chứng minh phương trình có nghiệm."
  },

  "Tích phân ứng dụng": {
    nhanBiet: "Nhận biết được công thức tính diện tích hình phẳng, thể tích vật thể tròn xoay, ứng dụng vật lý của tích phân.",
    thongHieu: "Hiểu được cách thiết lập tích phân để tính diện tích, thể tích, quãng đường theo vận tốc.",
    vanDung: "Tính diện tích hình phẳng giới hạn bởi các đường cong. Tính thể tích vật thể tròn xoay quanh trục.",
    vanDungCao: "Giải bài toán ứng dụng tích phân thực tế: tính công, lưu lượng, mô hình kinh tế-vật lý."
  }
};

/**
 * Tìm yêu cầu cần đạt phù hợp nhất với tên bài học
 * Sử dụng fuzzy matching đơn giản
 */
export function findYeuCau(tenBai: string): YeuCauData[string] | null {
  if (!tenBai || tenBai.trim().length < 3) return null;
  
  const normalized = tenBai.trim().toLowerCase();
  
  // Tìm chính xác trước
  for (const [key, value] of Object.entries(YEU_CAU_CAN_DAT)) {
    if (key.toLowerCase() === normalized) return value;
  }
  
  // Tìm theo chuỗi con
  for (const [key, value] of Object.entries(YEU_CAU_CAN_DAT)) {
    if (key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Tìm theo từ khóa chính
  const keywords = normalized.split(/[\s,]+/).filter(w => w.length > 2);
  let bestMatch: { key: string; score: number; value: YeuCauData[string] } | null = null;
  
  for (const [key, value] of Object.entries(YEU_CAU_CAN_DAT)) {
    const keyLower = key.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (keyLower.includes(kw)) score++;
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score, value };
    }
  }
  
  return bestMatch ? bestMatch.value : null;
}

/**
 * Lấy danh sách tất cả tên bài học có sẵn
 */
export function getAllTopics(): string[] {
  return Object.keys(YEU_CAU_CAN_DAT);
}

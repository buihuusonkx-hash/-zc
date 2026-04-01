# -*- coding: utf-8 -*-
"""Scan App.tsx for remaining encoding issues and syntax problems"""
path = r"c:\Users\Administrator\Downloads\math-matrix-pro-2026\src\App.tsx"

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

problems = []
bad_patterns = [
    ("nTi", "nội"), ("bT ", "bộ "), ("li?u", "liệu"), ("nghi?m", "nghiệm"),
    ("s' ", "số "), ("t.ng", "tổng"), ("b. ", "bổ "), ("ph'i", "phối"),
    ("Đ?", "Đề"), ("KI,M", "KIỂM"), ("HI?N", "HIỆN"), ("ĐI?N", "ĐIỀN"),
    ("LI?U", "LIỆU"), ("N,NG", "NĂNG"), ("HƯs", "HƯỚ"), ("ĐS", "ĐỊ"),
    ("BƯs", "BƯỚ"), ("GTp", "Gộp"), ("LoI", "LỜI"), ("Đs", "ĐÚ"),
    ("hifu", "hiểu"), ("chuyfn", "chuyển"), ("khifn", "khiển"),
    ("'ặc", "đặc"), ("'ề", "đề"), ("'ạt", "đạt"), ("'ơn", "đơn"),
    ("'ạo", "đạo"), ("'ổi", "đổi"), ("'ộ", "độ"), ("'ã", "đã"),
    ("'ược", "được"), ("'úng", "đúng"), ("'ến", "đến"), ("'ều", "đều"),
    ("'ộng", "động"), ("'iều", "điều"), ("'ịnh", "định"), ("'ứng", "đứng"),
    ("M\"N", "MÔN"), ("LsP", "LỚP"), ("T\"NG", "TỔNG"), ("C~NG", "CỘNG"),
    ("v<", None), ("v>", None), ("b<", None), ("hư>", None),
]

for i, line in enumerate(lines):
    for bad, good in bad_patterns:
        if bad in line:
            # Skip if it's inside a regex or a valid code pattern
            if bad == "v<" and ("<" in line and "v<" not in line.split("//")[-1] if "//" in line else True):
                continue
            problems.append((i+1, bad, good, line.rstrip()[:100]))

if problems:
    print(f"Found {len(problems)} remaining issues:")
    for ln, bad, good, text in problems:
        print(f"  L{ln}: '{bad}' -> '{good}': {text}")
else:
    print("NO ISSUES FOUND - File is clean!")

# Also check bracket balance
braces = 0
parens = 0  
brackets = 0
for i, line in enumerate(lines):
    for ch in line:
        if ch == '{': braces += 1
        elif ch == '}': braces -= 1
        elif ch == '(': parens += 1
        elif ch == ')': parens -= 1
        elif ch == '[': brackets += 1
        elif ch == ']': brackets -= 1

print(f"\nBracket balance: braces={braces}, parens={parens}, brackets={brackets}")
if braces != 0 or parens != 0 or brackets != 0:
    print("WARNING: Unbalanced brackets!")
else:
    print("All brackets balanced OK")

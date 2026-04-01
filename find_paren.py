# -*- coding: utf-8 -*-
"""Find exact location of unbalanced parenthesis"""
path = r"c:\Users\Administrator\Downloads\math-matrix-pro-2026\src\App.tsx"

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Track paren balance line by line
balance = 0
for i, line in enumerate(lines):
    old_balance = balance
    for ch in line:
        if ch == '(': balance += 1
        elif ch == ')': balance -= 1
    if balance < old_balance - 3 or balance < 0:
        print(f"L{i+1}: balance went from {old_balance} to {balance}: {line.rstrip()[:120]}")
        if balance < 0:
            print(f"  >>> NEGATIVE BALANCE at line {i+1}! Extra closing paren.")
            break

# Also find where balance first goes negative
balance = 0
for i, line in enumerate(lines):
    for ci, ch in enumerate(line):
        if ch == '(': balance += 1
        elif ch == ')':
            balance -= 1
            if balance < 0:
                print(f"\nFirst negative paren at L{i+1}, col {ci+1}")
                print(f"  Line: {line.rstrip()[:120]}")
                # Show context
                for ctx in range(max(0,i-3), min(len(lines), i+4)):
                    print(f"  {'>>>' if ctx==i else '   '} L{ctx+1}: {lines[ctx].rstrip()[:120]}")
                break
    if balance < 0:
        break

import re

with open(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

brace_level = 0
bracket_level = 0
paren_level = 0

open_tags = []

for idx, line in enumerate(lines):
    line_num = idx + 1
    
    # Simple brace balance (ignoring string literals for now)
    # We can count them
    for char in line:
        if char == '{':
            brace_level += 1
        elif char == '}':
            brace_level -= 1
            if brace_level < 0:
                print(f"Negative brace level at line {line_num}: {line.strip()}")
                brace_level = 0
        elif char == '(':
            paren_level += 1
        elif char == ')':
            paren_level -= 1
            if paren_level < 0:
                print(f"Negative paren level at line {line_num}: {line.strip()}")
                paren_level = 0

print(f"Final levels - Braces: {brace_level}, Parens: {paren_level}")

import re

with open(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Filter lines to only include inside the return statement of DashboardPage
# This starts around line 220
lines = content.splitlines()
jsx_lines = lines[220:]

# Clean comments
jsx_content = '\n'.join(jsx_lines)
jsx_content = re.sub(r'{\s*/\*.*?\*/\s*}', '', jsx_content, flags=re.DOTALL)
jsx_content = re.sub(r'//.*?\n', '\n', jsx_content)

# Match JSX tags: either <tagName ...> or </tagName> or <> or </>
# Avoid matching comparisons like idx < 5 or types
tag_pattern = re.compile(r'</?([a-zA-Z][a-zA-Z0-9.]*|)\s*[^>]*>')

stack = []

for idx, line in enumerate(jsx_lines):
    line_num = idx + 221
    # Skip lines that are just typescript code or comments
    # Simple heuristic: if line has 'const ' or 'let ' or 'function ' or 'return ' or 'import ' or 'class ', skip
    if any(keyword in line for keyword in ['const ', 'let ', 'function ', 'import ', 'class ']) and not '<' in line:
        continue
        
    for match in tag_pattern.finditer(line):
        tag_str = match.group(0)
        tag_name = match.group(1)
        
        # Self-closing check
        if tag_str.endswith('/>'):
            continue
            
        if tag_str.startswith('</'):
            if not stack:
                print(f"Line {line_num}: Extra closing tag '{tag_str}'")
            else:
                pop_name, pop_line = stack.pop()
                if pop_name != tag_name:
                    print(f"Line {line_num}: Mismatched closing tag '{tag_str}' (expected closing for '{pop_name}' opened on line {pop_line})")
                    stack.append((pop_name, pop_line))
        else:
            stack.append((tag_name, line_num))

print("\n--- Stack of unclosed tags at end of file ---")
for tag, line in stack:
    print(f"Unclosed tag '{tag}' opened on line {line}")

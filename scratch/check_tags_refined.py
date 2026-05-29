import re

with open(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Let's clean comments first
content = re.sub(r'{\s*/\*.*?\*/\s*}', '', content, flags=re.DOTALL)
content = re.sub(r'//.*?\n', '\n', content)

# A multiline tag matches from < to > (allowing newlines inside attributes)
# We match:
# 1. Self-closing tags: <tagName ... />
# 2. Closing tags: </tagName> or </>
# 3. Opening tags: <tagName ... > or <>
# Let's write a regular expression that matches tags across lines!
# To avoid matching comparisons like idx < 5, we ensure tag name is standard
# Tag name starts with word character, optional dots

# Pattern for tag
tag_pattern = re.compile(r'(</?([a-zA-Z][a-zA-Z0-9.]*|)\s*[^>]*>)', re.DOTALL)

KNOWN_TAGS = {
    'div', 'span', 'button', 'form', 'label', 'input', 'select', 'option',
    'table', 'tr', 'td', 'th', 'thead', 'tbody', 'h1', 'h2', 'h3', 'h4',
    'MainLayout', 'Navigation', 'Zap', 'X', 'ChevronDown', 'ChevronRight',
    'svg', 'path', 'defs', 'linearGradient', 'stop', 'circle', 'rect', 'polygon',
    'ArrowUpRight', 'ArrowDownRight', 'Users', 'CreditCard', 'DollarSign',
    'RefreshCw', 'MoreVertical', 'Search', 'CheckCircle2', 'Tag', 'Clock',
    'Phone', 'Send'
}

# We want to find the line number of each match in the original content.
# We can do this by counting newlines before the match start index.
def get_line_num(index):
    return content[:index].count('\n') + 1

stack = []

# Only start parsing from MainLayout return block
# We find where '<MainLayout' starts
start_index = content.find('<MainLayout')
if start_index == -1:
    start_index = 0

for match in tag_pattern.finditer(content, pos=start_index):
    tag_str = match.group(1)
    tag_name = match.group(2)
    start_pos = match.start(1)
    line_num = get_line_num(start_pos)
    
    # If tag name is empty, it's a fragment
    if tag_name == '':
        is_fragment = True
    else:
        is_fragment = False
        if tag_name not in KNOWN_TAGS:
            continue
            
    # Check if self-closing
    if tag_str.strip().endswith('/>') or (tag_name in ['input', 'img', 'br', 'hr'] and not tag_str.startswith('</')):
        continue
        
    if tag_str.startswith('</'):
        if not stack:
            print(f"Line {line_num}: Extra closing tag '{tag_str.strip()}'")
        else:
            pop_name, pop_line = stack.pop()
            if pop_name != tag_name:
                print(f"Line {line_num}: Mismatched closing tag '{tag_str.strip()}' (expected closing for '{pop_name}' opened on line {pop_line})")
                stack.append((pop_name, pop_line))
    else:
        stack.append((tag_name, line_num))

print("\n--- Stack of unclosed tags at end of file ---")
for tag, line in stack:
    print(f"Unclosed tag '{tag}' opened on line {line}")

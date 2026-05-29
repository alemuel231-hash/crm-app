import re

def check_jsx_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    jsx_lines = lines[223:] # line 224 to the end
    
    tag_pattern = re.compile(r'<(/?[a-zA-Z0-9_\-\.]+)(?:\s+[^>]*?)?(/?)>')
    
    stack = []
    
    for rel_idx, line in enumerate(jsx_lines, 224):
        line_clean = re.sub(r'{\/\*.*?\*\/}', '', line)
        line_clean = re.sub(r'\/\/.*', '', line_clean)
        
        # Clean string literals
        line_clean = re.sub(r'="[^"]*"', '=""', line_clean)
        line_clean = re.sub(r"='[^']*'", "=''", line_clean)
        
        for match in tag_pattern.finditer(line_clean):
            tag_name = match.group(1)
            is_close = tag_name.startswith('/')
            is_self_closing = match.group(2) == '/' or tag_name.lower() in [
                'input', 'img', 'br', 'hr', 'circle', 'path', 'rect', 'polygon', 
                'defs', 'lineargradient', 'stop', 'use', 'embed', 'col', 'link', 'meta'
            ]
            
            # Skip non-tags
            if tag_name.lower() in ['const', 'let', 'var', 'function', 'if', 'else', 'return']:
                continue
            if not re.match(r'^/?[-a-zA-Z0-9_\.]+$', tag_name):
                continue
                
            if is_close:
                name = tag_name[1:]
                if not stack:
                    if rel_idx >= 800:
                        print(f"Line {rel_idx}: Pop from empty stack for </{name}>")
                else:
                    open_tag, open_line = stack.pop()
                    if rel_idx >= 800:
                        print(f"Line {rel_idx}: Pop </{name}> matched against <{open_tag}> from line {open_line}")
                    if open_tag != name:
                        print(f"Line {rel_idx}: MISMATCH! </{name}> vs <{open_tag}> from line {open_line}")
                        # Restore
                        stack.append((open_tag, open_line))
            elif not is_self_closing:
                if rel_idx >= 800:
                    print(f"Line {rel_idx}: Push <{tag_name}>")
                stack.append((tag_name, rel_idx))
                
    print("\n--- Final Stack ---")
    for tag, line in reversed(stack):
        print(f"<{tag}> from line {line}")

if __name__ == "__main__":
    check_jsx_tags(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx")

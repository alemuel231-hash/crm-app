import re

def check_jsx_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Simple tag parser
    tag_pattern = re.compile(r'<(/?[a-zA-Z0-9_\-\.]+)(?:\s+[^>]*?)?(/?)>')
    
    stack = []
    in_return = False
    
    for line_idx, line in enumerate(lines, 1):
        # We start checking when we see return (
        if 'return (' in line:
            in_return = True
            continue
        if in_return and line.strip() == ');':
            in_return = False
            # Print remaining stack at this point
            print(f"\n--- Stack at Return End (Line {line_idx}) ---")
            for tag, l in reversed(stack):
                print(f"Unclosed tag <{tag}> from line {l}")
            stack = []
            continue
            
        if not in_return:
            continue
            
        # Strip comments
        line_clean = re.sub(r'{\/\*.*?\*\/}', '', line)
        line_clean = re.sub(r'\/\/.*', '', line_clean)
        
        for match in tag_pattern.finditer(line_clean):
            tag_name = match.group(1)
            is_close = tag_name.startswith('/')
            is_self_closing = match.group(2) == '/' or tag_name.lower() in ['input', 'img', 'br', 'hr', 'circle', 'path', 'rect', 'polygon', 'defs', 'lineargradient', 'stop', 'use', 'embed', 'col']
            
            if is_close:
                name = tag_name[1:]
                if not stack:
                    print(f"Line {line_idx}: Unexpected closing tag </{name}>")
                else:
                    open_tag, open_line = stack.pop()
                    if open_tag != name:
                        print(f"Line {line_idx}: Mismatched closing tag </{name}> for opening tag <{open_tag}> from line {open_line}")
                        # Put it back to continue analyzing
                        stack.append((open_tag, open_line))
            elif not is_self_closing:
                stack.append((tag_name, line_idx))

if __name__ == "__main__":
    check_jsx_tags(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx")

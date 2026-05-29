with open(r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\src\app\crm\dashboard\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Let's find any occurrences of } that are NOT preceded by a balanced { or are stray in JSX.
# Or better, let's print all lines containing '}' to manually check!
for idx, line in enumerate(content.splitlines()):
    line_num = idx + 1
    # Check if there is a '}' that is not part of a {...} expression or a javascript block.
    # We can print lines with '}' that also contain JSX tags or seem to be text.
    if '}' in line and ('<' in line or 'className' in line or 'div' in line or 'span' in line or 'button' in line):
        # Count { and } on this line
        c_open = line.count('{')
        c_close = line.count('}')
        if c_close > c_open:
            print(f"Line {line_num}: {line.strip()}")

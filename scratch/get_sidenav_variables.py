scss_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\assets\scss\_variables.scss"

with open(scss_path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r"\$sidenav-[\w-]+\s*:\s*([^;]+);", content)
print(f"Sidenav variables found: {len(matches)}")
all_matches = re.findall(r"\$(\w*sidenav[\w-]*)\s*:\s*([^;]+);", content)
for k, v in all_matches:
    print(f"${k}: {v.strip()}")

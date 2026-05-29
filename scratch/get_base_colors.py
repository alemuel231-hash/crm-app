import re

scss_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\assets\scss\_variables.scss"

with open(scss_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for blue, green, red, yellow, orange, etc.
base_colors = ["blue", "green", "red", "yellow", "orange", "cyan", "gray", "prefix"]
for c in base_colors:
    match = re.search(r"\$" + c + r"\s*:\s*([^;]+);", content)
    if match:
        print(f"${c}: {match.group(1).strip()}")

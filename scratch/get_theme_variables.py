import re

scss_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\assets\scss\_variables.scss"

print("Reading primary SCSS variables:")
with open(scss_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for primary color and theme colors
color_matches = re.findall(r"\$(\w+-\w+|\w+)\s*:\s*(#\w+|\w+\(.*?\)|[^\n;]+);", content)
print(f"Total variables found: {len(color_matches)}")

target_keys = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark", "purple", "body-bg", "body-color", "font-family-base", "border-color", "card-bg", "sidebar-bg", "topbar-bg"]

for k, v in color_matches:
    if any(t in k.lower() for t in target_keys):
        print(f"${k}: {v.strip()}")

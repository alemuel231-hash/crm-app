scss_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\assets\scss\structure\_sidenav.scss"

with open(scss_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in _sidenav.scss: {len(lines)}")
# Print lines that define colors or active states
for i, line in enumerate(lines):
    if "color" in line or "background" in line or "active" in line or "hover" in line:
        if i < 150: # look at first 150 lines
            print(f"{i+1}: {line.strip()}")

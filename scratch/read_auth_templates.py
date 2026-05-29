import os

sign_in_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\auth-sign-in.php"
card_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\auth-card-sign-in.php"

print(f"Inspecting auth templates:")
for p in [sign_in_path, card_path]:
    if os.path.exists(p):
        print(f"\n--- FILE: {os.path.basename(p)} ---")
        with open(p, "r", encoding="utf-8") as f:
            lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        # Print lines that look like forms, inputs, images, or buttons
        for i, line in enumerate(lines):
            if any(k in line for k in ["<img", "<button", "<form", "card-title", "logo"]):
                if i < 200: # look at first 200 lines
                    print(f"{i+1}: {line.strip()}")
    else:
        print(f"Path does not exist: {p}")

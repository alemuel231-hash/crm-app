import os

search_dir = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project"
print(f"Searching for 'button' or 'buttons' in: {search_dir}")

found_files = []
for root, dirs, files in os.walk(search_dir):
    for d in dirs:
        if "button" in d.lower():
            path = os.path.join(root, d)
            print(f"Found Directory: {path}")
    for f in files:
        if "button" in f.lower():
            path = os.path.join(root, f)
            found_files.append(path)

print(f"Found {len(found_files)} files with 'button' in their name:")
for f in found_files[:10]:
    print(f"  {f}")

import os
import shutil

src_dir = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\PHP\PHP\paces\src\assets\images"
dest_dir = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\crm-app\public\assets\images"

print(f"Copying images from {src_dir} to {dest_dir}...")
if not os.path.exists(src_dir):
    print("Source directory does not exist!")
    exit(1)

if os.path.exists(dest_dir):
    shutil.rmtree(dest_dir)

shutil.copytree(src_dir, dest_dir)
print("Successfully copied images recursively!")

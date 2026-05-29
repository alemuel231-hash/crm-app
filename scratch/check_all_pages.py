import fitz

pdf_path = r"c:\Users\wailf\OneDrive\Attachments\Desktop\Project\Orbit Dashboard _.pdf"
doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")
for i in range(len(doc)):
    page = doc.load_page(i)
    print(f"Page {i}: rect={page.rect}, images={len(page.get_images())}, text_blocks={len(page.get_text('blocks'))}")

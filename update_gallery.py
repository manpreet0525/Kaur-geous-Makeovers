import os
import json

GALLERY_DIR = 'gallery'
MANIFEST_FILE = os.path.join(GALLERY_DIR, 'manifest.json')

def scan_gallery():
    # Supported image extensions
    valid_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    
    images = []
    
    # Check if directory exists
    if not os.path.exists(GALLERY_DIR):
        print(f"Error: Directory '{GALLERY_DIR}' not found.")
        return

    # Scan directory
    for filename in os.listdir(GALLERY_DIR):
        if filename.lower().endswith(tuple(valid_extensions)):
             if filename != "manifest.json":
                images.append(filename)
    
    # Sort for consistency
    images.sort()
    
    # Write to manifest.json
    with open(MANIFEST_FILE, 'w') as f:
        json.dump(images, f, indent=2)
    
    print(f"Success! Found {len(images)} images.")
    print(f"Updated {MANIFEST_FILE}")

if __name__ == "__main__":
    scan_gallery()

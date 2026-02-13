#!/usr/bin/env python3
"""
Fix clints partner logo images to use WebP format
"""

import re
import os

def fix_clints_images(file_path):
    """Update clints images to use picture tags"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Pattern to find img tags with clints images
    pattern = r'<img\s+src="images/kolimg/clints/(\d+)\.png"\s+alt="([^"]*)">'

    def replace_with_picture(match):
        number = match.group(1)
        alt_text = match.group(2)

        return f'''<picture>
    <source srcset="images/kolimg/clints/{number}.webp" type="image/webp">
    <img src="images/kolimg/clints/{number}.png" alt="{alt_text}">
</picture>'''

    # Replace all matches
    content = re.sub(pattern, replace_with_picture, content)

    if content != original_content:
        # Create backup
        backup_path = file_path + '.backup-clints'
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)

        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        count = len(re.findall(pattern, original_content))
        return count

    return 0

if __name__ == '__main__':
    files = ['index.html', 'demo-corporate.html']

    total_converted = 0
    for file_path in files:
        if os.path.exists(file_path):
            count = fix_clints_images(file_path)
            if count > 0:
                print(f"[OK] {file_path}: Converted {count} partner logos to WebP")
                total_converted += count
            else:
                print(f"[SKIP] {file_path}: No changes needed")

    print(f"\nTotal: Converted {total_converted} partner logo references")
    print("Partner logos now using WebP format with PNG fallback!")

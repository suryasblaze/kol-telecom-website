#!/usr/bin/env python3
"""
HTML Auto-Updater for WebP Images
Automatically converts <img> tags to <picture> tags with WebP support
"""

import os
import re
import glob
from pathlib import Path
from datetime import datetime

def backup_file(file_path):
    """Create backup of HTML file before modification"""
    backup_dir = "html_backups"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.basename(file_path)
    backup_path = os.path.join(backup_dir, f"{filename}.{timestamp}.bak")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return backup_path

def extract_attributes(img_tag):
    """Extract all attributes from img tag"""
    attributes = {}

    # Extract src
    src_match = re.search(r'src=["\'](.*?)["\']', img_tag)
    if src_match:
        attributes['src'] = src_match.group(1)

    # Extract alt
    alt_match = re.search(r'alt=["\'](.*?)["\']', img_tag)
    if alt_match:
        attributes['alt'] = alt_match.group(1)
    else:
        attributes['alt'] = ""

    # Extract other attributes
    for attr in ['class', 'id', 'style', 'width', 'height', 'loading', 'title', 'data-aos', 'data-aos-delay', 'data-aos-duration']:
        pattern = rf'{attr}=["\'](.*?)["\']'
        match = re.search(pattern, img_tag)
        if match:
            attributes[attr] = match.group(1)

    return attributes

def build_img_tag(attributes):
    """Rebuild img tag with all attributes"""
    img_parts = ['<img']

    # src is required
    if 'src' in attributes:
        img_parts.append(f'src="{attributes["src"]}"')

    # alt is required for accessibility
    img_parts.append(f'alt="{attributes.get("alt", "")}"')

    # Add other attributes in order
    for attr in ['class', 'id', 'style', 'width', 'height', 'loading', 'title', 'data-aos', 'data-aos-delay', 'data-aos-duration']:
        if attr in attributes:
            img_parts.append(f'{attr}="{attributes[attr]}"')

    return ' '.join(img_parts) + '>'

def convert_img_to_picture(img_tag):
    """Convert <img> tag to <picture> tag with WebP source"""

    # Extract attributes
    attrs = extract_attributes(img_tag)

    if 'src' not in attrs:
        return img_tag  # Invalid img tag, skip

    src = attrs['src']

    # Only convert images from images/kolimg/ directory
    if 'images/kolimg/' not in src:
        return img_tag  # Not a target image, skip

    # Skip if already a placeholder or external URL
    if 'placeholder.com' in src or src.startswith('http'):
        return img_tag

    # Generate WebP path
    webp_src = re.sub(r'\.(png|jpg|jpeg|PNG|JPG|JPEG)$', '.webp', src)

    # If src doesn't have image extension, skip
    if webp_src == src:
        return img_tag

    # Build new img tag
    new_img_tag = build_img_tag(attrs)

    # Build picture tag
    picture_tag = f'''<picture>
    <source srcset="{webp_src}" type="image/webp">
    {new_img_tag}
</picture>'''

    return picture_tag

def update_html_file(file_path):
    """Update a single HTML file"""

    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Find all img tags (excluding those already in picture tags)
        # Pattern: Find <img> tags that are NOT preceded by <source> tag
        img_pattern = r'<img[^>]+?src=["\']images/kolimg/[^>]*?>'

        images_found = re.findall(img_pattern, content)

        if not images_found:
            return 0, []

        # Create backup
        backup_path = backup_file(file_path)

        # Track changes
        changes = []
        converted_count = 0

        # Convert each img tag
        for img_tag in images_found:
            # Check if already in a picture tag
            # Find the position of this img tag
            img_pos = content.find(img_tag)

            # Check 200 characters before for <picture> tag
            before_context = content[max(0, img_pos-200):img_pos]

            # If already in picture tag, skip
            if '<picture>' in before_context and '<source' in before_context:
                continue

            # Convert
            picture_tag = convert_img_to_picture(img_tag)

            if picture_tag != img_tag:
                content = content.replace(img_tag, picture_tag, 1)

                # Extract filename for reporting
                src_match = re.search(r'src=["\'](.*?)["\']', img_tag)
                if src_match:
                    filename = os.path.basename(src_match.group(1))
                    changes.append(filename)

                converted_count += 1

        # Write updated content
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

        return converted_count, changes

    except Exception as e:
        print(f"[ERROR] Error processing {file_path}: {e}")
        return 0, []

def update_all_html_files(directory='.'):
    """Update all HTML files in directory"""

    print("HTML Auto-Updater for WebP Images")
    print("=" * 60)
    print(f"Directory: {os.path.abspath(directory)}")
    print("=" * 60)
    print()

    # Find all HTML files
    html_files = glob.glob(os.path.join(directory, '*.html'))

    if not html_files:
        print("No HTML files found!")
        return

    print(f"Found {len(html_files)} HTML files\n")

    # Track statistics
    total_converted = 0
    files_modified = 0
    all_changes = {}

    # Process each file
    for i, html_file in enumerate(html_files, 1):
        filename = os.path.basename(html_file)
        print(f"[{i}/{len(html_files)}] Processing: {filename}")

        count, changes = update_html_file(html_file)

        if count > 0:
            files_modified += 1
            total_converted += count
            all_changes[filename] = changes

            print(f"    [OK] Converted {count} images")
            for img in changes:
                print(f"       -> {img}")
        else:
            print(f"    [SKIP] No changes needed")

        print()

    # Summary
    print("=" * 60)
    print("UPDATE SUMMARY")
    print("=" * 60)
    print(f"Files processed: {len(html_files)}")
    print(f"Files modified: {files_modified}")
    print(f"Total images converted: {total_converted}")
    print(f"Backups created in: html_backups/")
    print()

    # Detailed changes
    if all_changes:
        print("DETAILED CHANGES:")
        print("-" * 60)
        for filename, images in all_changes.items():
            print(f"\n{filename}:")
            for img in images:
                print(f"  - {img} -> {img.rsplit('.', 1)[0]}.webp")

    print()
    print("=" * 60)
    print("Next Steps:")
    print("1. Review the changes in your HTML files")
    print("2. Test the website in your browser")
    print("3. Verify WebP images load correctly")
    print("4. If everything looks good, commit to Git:")
    print("   git add .")
    print('   git commit -m "Update: Convert images to WebP format with fallbacks"')
    print("   git push origin master")
    print()
    print("[INFO] If you need to rollback, backups are in html_backups/")
    print("=" * 60)

if __name__ == '__main__':
    import sys

    # Check if running from correct directory
    if not os.path.exists('index.html'):
        print("[ERROR] Please run this script from the project root directory")
        print("   (The directory containing index.html)")
        sys.exit(1)

    # Run update
    update_all_html_files()

    print("\nHTML update complete!")

#!/usr/bin/env python3
"""
Image Optimization Script for KOL Telecom Website
Converts PNG/JPG images to WebP format for faster loading
"""

import os
from pathlib import Path
from PIL import Image
import glob

def convert_to_webp(input_path, output_path=None, quality=85):
    """
    Convert image to WebP format

    Args:
        input_path: Path to input image
        output_path: Path to output WebP file (optional)
        quality: WebP quality (0-100, default 85)

    Returns:
        tuple: (success, original_size, webp_size, savings_percent)
    """
    try:
        # Open image
        img = Image.open(input_path)

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background

        # Generate output path if not provided
        if output_path is None:
            output_path = str(Path(input_path).with_suffix('.webp'))

        # Get original file size
        original_size = os.path.getsize(input_path)

        # Save as WebP
        img.save(output_path, 'WebP', quality=quality, method=6)

        # Get WebP file size
        webp_size = os.path.getsize(output_path)

        # Calculate savings
        savings = ((original_size - webp_size) / original_size) * 100

        return True, original_size, webp_size, savings

    except Exception as e:
        print(f"[ERROR] Error converting {input_path}: {e}")
        return False, 0, 0, 0

def format_size(bytes):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.1f}{unit}"
        bytes /= 1024.0
    return f"{bytes:.1f}TB"

def optimize_images(directory='images/kolimg', quality=85, min_size_mb=0.5):
    """
    Optimize all images in directory

    Args:
        directory: Path to image directory
        quality: WebP quality (0-100)
        min_size_mb: Only convert files larger than this (in MB)
    """
    print("KOL Telecom Image Optimization")
    print("=" * 60)
    print(f"Directory: {directory}")
    print(f"WebP Quality: {quality}")
    print(f"Minimum file size: {min_size_mb}MB")
    print("=" * 60)

    # Find all image files
    image_extensions = ['*.png', '*.jpg', '*.jpeg', '*.PNG', '*.JPG', '*.JPEG']
    image_files = []

    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(directory, ext)))

    if not image_files:
        print(f"No images found in {directory}")
        return

    print(f"\nFound {len(image_files)} images\n")

    # Filter by size
    min_size_bytes = min_size_mb * 1024 * 1024
    large_files = [f for f in image_files if os.path.getsize(f) >= min_size_bytes]

    print(f"{len(large_files)} images larger than {min_size_mb}MB will be converted\n")

    if not large_files:
        print("No large files to optimize!")
        return

    # Convert images
    total_original = 0
    total_webp = 0
    successful = 0
    failed = 0

    for i, img_path in enumerate(large_files, 1):
        filename = os.path.basename(img_path)
        print(f"[{i}/{len(large_files)}] Processing: {filename}")

        success, orig_size, webp_size, savings = convert_to_webp(img_path, quality=quality)

        if success:
            successful += 1
            total_original += orig_size
            total_webp += webp_size

            print(f"    [OK] Original: {format_size(orig_size)}")
            print(f"    [OK] WebP: {format_size(webp_size)}")
            print(f"    [OK] Saved: {savings:.1f}%\n")
        else:
            failed += 1

    # Summary
    print("=" * 60)
    print("OPTIMIZATION SUMMARY")
    print("=" * 60)
    print(f"Successfully converted: {successful}")
    print(f"Failed: {failed}")
    print(f"Original total size: {format_size(total_original)}")
    print(f"WebP total size: {format_size(total_webp)}")

    if total_original > 0:
        total_savings = ((total_original - total_webp) / total_original) * 100
        print(f"Total savings: {format_size(total_original - total_webp)} ({total_savings:.1f}%)")

    print("=" * 60)
    print("\nNext Steps:")
    print("1. Test the WebP images in your browser")
    print("2. Update HTML to use <picture> tags for WebP with fallback")
    print("3. Delete original PNG files if WebP works well")
    print("4. Commit changes to Git")
    print("5. Push to GitHub and redeploy")

if __name__ == '__main__':
    import sys

    # Check if PIL/Pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("[ERROR] Pillow library not found!")
        print("\nInstall it with:")
        print("  pip install Pillow")
        sys.exit(1)

    # Run optimization
    optimize_images(
        directory='images/kolimg',
        quality=85,  # 85 = good quality, smaller file size
        min_size_mb=0  # Convert ALL images (including small ones)
    )

    print("\nImage optimization complete!")

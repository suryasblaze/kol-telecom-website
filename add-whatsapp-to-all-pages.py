"""
Add WhatsApp Button CSS and JS to All HTML Pages
This script automatically adds the WhatsApp button includes to all HTML pages
"""

import os
import re
from pathlib import Path

# Configuration
ROOT_DIR = Path(__file__).parent
CSS_INCLUDE = '    <link rel="stylesheet" href="css/whatsapp-button.css"/>'
JS_INCLUDE = '    <script src="js/whatsapp-button.js"></script>'

def get_html_files():
    """Get all HTML files in root directory (exclude node_modules)"""
    html_files = []
    for file in ROOT_DIR.glob('*.html'):
        if 'node_modules' not in str(file):
            html_files.append(file)
    return sorted(html_files)

def add_whatsapp_includes(file_path):
    """Add WhatsApp CSS and JS includes to HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        modified = False

        # Check if already has WhatsApp button CSS
        if 'whatsapp-button.css' not in content:
            # Try to add after chatbot.css
            if 'chatbot.css' in content:
                content = content.replace(
                    '<link rel="stylesheet" href="css/chatbot.css"/>',
                    '<link rel="stylesheet" href="css/chatbot.css"/>\n' + CSS_INCLUDE
                )
                modified = True
            # If no chatbot.css, add before </head>
            elif '</head>' in content:
                content = content.replace('</head>', CSS_INCLUDE + '\n</head>')
                modified = True

        # Check if already has WhatsApp button JS
        if 'whatsapp-button.js' not in content:
            # Try to add after chatbot.js
            if 'chatbot.js' in content:
                content = re.sub(
                    r'(<script src="js/chatbot\.js"></script>)',
                    r'\1\n' + JS_INCLUDE,
                    content
                )
                modified = True
            # If no chatbot.js, add before </body>
            elif '</body>' in content:
                content = content.replace('</body>', JS_INCLUDE + '\n</body>')
                modified = True

        # Remove old WhatsApp button HTML if exists (JS will add it automatically)
        if 'phone-call cbh-phone' in content:
            # Remove old WhatsApp button div
            old_button_pattern = r'<div class="phone-call cbh-phone[^>]*>.*?</div>\s*<!-- WhatsApp floating button -->|<!-- WhatsApp floating button -->\s*<div class="phone-call cbh-phone[^>]*>.*?</div>'
            old_button_pattern2 = r'<div class="phone-call cbh-phone[^>]*>.*?</div>'

            # Only remove if it's the floating button div (not in main content)
            lines = content.split('\n')
            new_lines = []
            skip_until_close = False

            for i, line in enumerate(lines):
                if 'phone-call cbh-phone' in line and 'clbh_phone_div' in line:
                    skip_until_close = True
                    modified = True
                    continue
                if skip_until_close:
                    if '</div>' in line and 'phone-call' not in line:
                        skip_until_close = False
                    continue
                new_lines.append(line)

            content = '\n'.join(new_lines)

        # Save if modified
        if modified and content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, "Updated"
        elif 'whatsapp-button.css' in content and 'whatsapp-button.js' in content:
            return False, "Already has includes"
        else:
            return False, "No changes made"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Main function"""
    print("=" * 60)
    print("Adding WhatsApp Button to All HTML Pages")
    print("=" * 60)
    print()

    html_files = get_html_files()
    print(f"Found {len(html_files)} HTML files\n")

    updated = 0
    skipped = 0
    errors = 0

    for file_path in html_files:
        file_name = file_path.name
        success, message = add_whatsapp_includes(file_path)

        if success:
            print(f"[OK] {file_name:40} - {message}")
            updated += 1
        elif "Error" in message:
            print(f"[ERROR] {file_name:40} - {message}")
            errors += 1
        else:
            print(f"[SKIP] {file_name:40} - {message}")
            skipped += 1

    print()
    print("=" * 60)
    print(f"Summary:")
    print(f"  Updated: {updated}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors:  {errors}")
    print(f"  Total:   {len(html_files)}")
    print("=" * 60)
    print()
    print("SUCCESS! WhatsApp button will now appear on all pages!")
    print("  Phone: +1 (302) 867-5050")
    print("  The button is auto-injected via JavaScript")

if __name__ == "__main__":
    main()

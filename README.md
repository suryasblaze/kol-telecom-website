# KOL Telecom Website

A modern, feature-rich telecommunications company website built with HTML, CSS, and JavaScript.

## 🚀 Features

### Main Website
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Product Showcase** - WhatsApp Business API, SMS, RCS, Voice API, and more
- **Solutions Pages** - TEXTR, ECHT, CEDAR solutions
- **Services** - Bulk SMS, Voice Broadcasting, Number Lookup
- **Blog System** - Dynamic blog with localStorage-based CMS
- **Contact Forms** - With reCAPTCHA integration
- **WhatsApp Integration** - Floating WhatsApp button
- **AI Chatbot** - Interactive customer support chatbot

### Blog Management System
- **Blog Admin Panel** (`blog-admin.html`) - Create, edit, and publish blog posts
- **Dynamic Blog Loading** - Posts stored in localStorage
- **Rich Text Support** - HTML template library with 16+ pre-built sections
- **Image Upload** - Featured images with preview
- **Category Management** - Organize posts by category
- **Tags System** - Tag-based organization
- **Social Sharing** - Facebook, Twitter, LinkedIn, WhatsApp, Copy Link
- **Comments System** - User engagement with replies
- **Analytics Dashboard** (`analytics.html`) - Track views, shares, comments, and engagement

### HTML Template Library
The blog admin includes ready-to-use HTML templates:
- Headings & Paragraphs
- Lists & Text Formatting
- Highlight Boxes (Light Green)
- Statistics Boxes
- Feature Cards
- Use Case Grid Cards
- Code Blocks (Dark Background)
- Best Practices (Green Border)
- Example Boxes (Light Blue)
- Image + Text Layouts
- Blockquotes
- And more!

## 📁 Project Structure

```
kol/
├── index.html              # Homepage
├── about-us.html          # About page
├── contact-us.html        # Contact page
├── blog.html              # Blog listing page
├── blog-admin.html        # Blog admin panel
├── blog-post.html         # Dynamic blog post viewer
├── analytics.html         # Analytics dashboard
├── products-*.html        # Product pages
├── services-*.html        # Service pages
├── solutions-*.html       # Solution pages
├── css/                   # Stylesheets
│   ├── style.min.css
│   ├── responsive.min.css
│   └── ...
├── js/                    # JavaScript files
│   ├── blog-list.js      # Blog loading logic
│   ├── chatbot.js        # AI chatbot
│   ├── whatsapp-button.js
│   ├── social-share.js   # Social sharing
│   └── ...
├── images/               # Image assets
│   └── kolimg/          # KOL-specific images
└── demos/               # Theme demos
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, shadows, animations
- **JavaScript (ES6+)** - Interactive features
- **Bootstrap 5** - Responsive grid and components
- **Bootstrap Icons** - Icon library
- **Font Awesome** - Additional icons
- **Google Fonts** - Plus Jakarta Sans typography
- **localStorage API** - Client-side data persistence

## 📊 Blog System Architecture

### Data Storage
All blog data is stored in the browser's `localStorage`:
- `blog_posts` - Array of blog post objects
- `blog_shares` - Array of social share events
- `blog_comments_<blogId>` - Comments for each blog

### Blog Post Object Structure
```javascript
{
  id: "blog-1234567890",
  title: "Blog Title",
  category: "CPaaS",
  author: "KOL Telecom Team",
  readTime: 5,
  date: "2026-02-13",
  image: "images/kolimg/blog-image.jpg",
  description: "Short description for preview",
  content: "Full HTML content",
  tags: ["cpaas", "api", "messaging"],
  created: "2026-02-13T10:30:00.000Z",
  views: 0,
  comments: []
}
```

## 🎨 Color Scheme

- **Primary Gradient**: Purple to Blue (`#667eea` to `#764ba2`)
- **Accent**: Orange (`#FF6B35`)
- **Success/WhatsApp**: Green (`#25D366`, `#4CAF50`)
- **Light Green CTA**: `linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)`

## 🚀 Getting Started

### Option 1: Open Locally
1. Clone this repository
2. Open `index.html` in a web browser
3. No build process required!

### Option 2: Use a Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📝 Blog Admin Access

1. Navigate to `blog-admin.html`
2. Fill in the blog post form:
   - Title, Category, Author
   - Read Time, Date
   - Featured Image (URL or upload)
   - Description, Content
   - Tags
3. Use the HTML template library for rich content formatting
4. Click "Publish Blog Post"
5. View your blog on `blog.html`

## 📈 Analytics Dashboard

Access the analytics dashboard at `analytics.html` to view:
- Total views, posts, shares, and comments
- Most viewed posts table
- Category performance breakdown
- Social share statistics by platform

## 🌐 Deployment

### Temporary Hosting (For Client Review)
- **GitHub Pages**: Free, fast, easy setup
- **Netlify**: Free tier with custom domain support
- **Vercel**: Free hosting with automatic deployments

### Production Hosting
Once approved by client, deploy to:
- **Your Domain**: Upload files via FTP/SFTP
- **Cloud Hosting**: AWS S3, Azure, Google Cloud Storage
- **Managed Hosting**: cPanel, Plesk, etc.

## 📄 License

© 2026 KOL Telecom Services LLC. All rights reserved.

## 🤝 Support

For questions or support, contact:
- **Email**: info@koltelecom.com
- **Address**: 251 Little Falls Drive, Wilmington, DE 19808, USA

---

**Built with ❤️ for KOL Telecom**

/**
 * Blog List - Load and display blogs from localStorage
 */

(function() {
    'use strict';

    // Load blogs when page loads
    document.addEventListener('DOMContentLoaded', function() {
        loadBlogsFromStorage();
    });

    function loadBlogsFromStorage() {
        try {
            // Get blogs from localStorage
            const blogs = JSON.parse(localStorage.getItem('blog_posts') || '[]');

            // Get the container where blog cards should be displayed
            const blogContainer = document.querySelector('#blog-posts .row.g-4');

            if (!blogContainer) {
                console.warn('Blog container not found');
                return;
            }

            // If there are blogs in localStorage, prepend them to existing blogs
            if (blogs.length > 0) {
                // Generate cards for each blog and prepend to container
                let newBlogsHTML = '';
                blogs.forEach(function(blog) {
                    newBlogsHTML += createBlogCard(blog);
                });

                // Prepend new blogs before existing static blogs
                blogContainer.insertAdjacentHTML('afterbegin', newBlogsHTML);

                // Update article count in hero section (localStorage blogs + static blogs)
                const articleCountElements = document.querySelectorAll('.blg-stat-num');
                const staticBlogCount = 6; // Number of default static blogs
                const totalBlogs = blogs.length + staticBlogCount;

                if (articleCountElements[0]) {
                    articleCountElements[0].textContent = totalBlogs;
                }

                // Calculate total read time (localStorage + static blogs: 8+12+10+15+11+9 = 65)
                const staticReadTime = 65;
                const localStorageReadTime = blogs.reduce(function(sum, blog) {
                    const readTime = parseInt(blog.readTime) || 0;
                    return sum + readTime;
                }, 0);
                const totalReadTime = localStorageReadTime + staticReadTime;

                if (articleCountElements[2]) {
                    articleCountElements[2].textContent = totalReadTime + '+';
                }

                // Update category count (localStorage + static categories)
                const localStorageCategories = [...new Set(blogs.map(b => b.category))];
                const staticCategories = ['CPaaS', 'WhatsApp', 'Messaging', 'Voice API', 'Security', 'Trends'];
                const allCategories = [...new Set([...localStorageCategories, ...staticCategories])];

                if (articleCountElements[1]) {
                    articleCountElements[1].textContent = allCategories.length;
                }
            }

        } catch (error) {
            console.error('Error loading blogs from localStorage:', error);
        }
    }

    function createBlogCard(blog) {
        // Get category class
        const categoryClass = getCategoryClass(blog.category);

        // Format date
        const formattedDate = formatDate(blog.date);

        // Create URL with blog ID as query parameter
        const blogUrl = 'blog-post.html?id=' + blog.id;

        // Truncate excerpt if too long
        const excerpt = blog.description.length > 180
            ? blog.description.substring(0, 180) + '...'
            : blog.description;

        // Generate image HTML
        let imageHTML;
        if (blog.image || blog.featuredImage) {
            const imageUrl = blog.image || blog.featuredImage;
            imageHTML = `<img src="${imageUrl}" alt="${escapeHtml(blog.title)}" loading="lazy">`;
        } else {
            imageHTML = `<div class="blg-card-img-placeholder">
                <i class="bi bi-file-text-fill"></i>
            </div>`;
        }

        return `
        <div class="col-lg-6">
            <article class="blg-card">
                <div class="blg-card-img">
                    ${imageHTML}
                </div>
                <div class="blg-card-body">
                    <div class="blg-card-meta">
                        <span class="blg-category ${categoryClass}">${escapeHtml(blog.category)}</span>
                        <span class="blg-date"><i class="bi bi-calendar3"></i>${formattedDate}</span>
                    </div>
                    <h3 class="blg-card-title"><a href="${blogUrl}">${escapeHtml(blog.title)}</a></h3>
                    <p class="blg-card-excerpt">${escapeHtml(excerpt)}</p>
                    <div class="blg-card-footer">
                        <a href="${blogUrl}" class="blg-read-btn">Read Full Article <i class="bi bi-arrow-right"></i></a>
                        <span class="blg-read-time"><i class="bi bi-clock"></i>${blog.readTime} min read</span>
                    </div>
                </div>
            </article>
        </div>
        `;
    }

    function getCategoryClass(category) {
        const categoryMap = {
            'CPaaS': 'blg-category-cpaas',
            'WhatsApp': 'blg-category-whatsapp',
            'Messaging': 'blg-category-messaging',
            'Voice API': 'blg-category-voice',
            'Security': 'blg-category-security',
            'Trends': 'blg-category-trends',
            'RCS': 'blg-category-messaging',
            'SMS': 'blg-category-messaging',
            'API': 'blg-category-voice',
            'Business': 'blg-category-trends'
        };

        return categoryMap[category] || 'blg-category-cpaas';
    }

    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            return dateString;
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();

/**
 * Blog Comments System
 * Simple commenting system using localStorage (no database required)
 */

(function() {
    'use strict';

    // Initialize comments on page load
    document.addEventListener('DOMContentLoaded', function() {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            initializeComments();
        }
    });

    function initializeComments() {
        const blogId = getBlogId();
        loadComments(blogId);
        setupCommentForm(blogId);
    }

    // Get blog ID from URL or page title
    function getBlogId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'blog-' + Date.now();
    }

    // Load and display comments
    function loadComments(blogId) {
        const comments = getComments(blogId);
        const commentsContainer = document.getElementById('comments-list');

        if (!commentsContainer) return;

        if (comments.length === 0) {
            commentsContainer.innerHTML = `
                <div class="no-comments text-center text-muted py-4">
                    <i class="fa fa-comments fa-3x mb-3" style="opacity: 0.3;"></i>
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            `;
            return;
        }

        // Sort comments by date (newest first)
        comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const html = comments.map(comment => `
            <div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-avatar">
                        ${comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="comment-meta">
                        <strong class="comment-author">${escapeHtml(comment.name)}</strong>
                        <span class="comment-date">${formatDate(comment.timestamp)}</span>
                    </div>
                </div>
                <div class="comment-body">
                    ${escapeHtml(comment.message).replace(/\n/g, '<br>')}
                </div>
                <div class="comment-actions">
                    <button class="comment-reply-btn" onclick="replyToComment('${comment.id}', '${escapeHtml(comment.name)}')">
                        <i class="fa fa-reply"></i> Reply
                    </button>
                    <button class="comment-delete-btn" onclick="deleteComment('${blogId}', '${comment.id}')">
                        <i class="fa fa-trash"></i> Delete
                    </button>
                </div>
                ${comment.replies ? renderReplies(comment.replies) : ''}
            </div>
        `).join('');

        commentsContainer.innerHTML = html;

        // Update comment count
        updateCommentCount(comments.length);
    }

    // Render replies
    function renderReplies(replies) {
        if (!replies || replies.length === 0) return '';

        return `
            <div class="comment-replies">
                ${replies.map(reply => `
                    <div class="comment-item reply">
                        <div class="comment-header">
                            <div class="comment-avatar small">
                                ${reply.name.charAt(0).toUpperCase()}
                            </div>
                            <div class="comment-meta">
                                <strong class="comment-author">${escapeHtml(reply.name)}</strong>
                                <span class="comment-date">${formatDate(reply.timestamp)}</span>
                            </div>
                        </div>
                        <div class="comment-body">
                            ${escapeHtml(reply.message).replace(/\n/g, '<br>')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Setup comment form
    function setupCommentForm(blogId) {
        const form = document.getElementById('comment-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitComment(blogId);
        });
    }

    // Submit comment
    function submitComment(blogId) {
        const nameInput = document.getElementById('comment-name');
        const emailInput = document.getElementById('comment-email');
        const messageInput = document.getElementById('comment-message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) {
            showCommentMessage('error', 'Please fill in all fields');
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            showCommentMessage('error', 'Please enter a valid email address');
            return;
        }

        const comment = {
            id: 'comment-' + Date.now(),
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            replies: []
        };

        // Save comment
        const comments = getComments(blogId);
        comments.push(comment);
        saveComments(blogId, comments);

        // Reload comments
        loadComments(blogId);

        // Reset form
        form.reset();

        // Show success message
        showCommentMessage('success', 'Comment posted successfully!');

        // Scroll to comments
        document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Get comments from localStorage
    function getComments(blogId) {
        const allComments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
        return allComments[blogId] || [];
    }

    // Save comments to localStorage
    function saveComments(blogId, comments) {
        const allComments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
        allComments[blogId] = comments;
        localStorage.setItem('blog_comments', JSON.stringify(allComments));
    }

    // Delete comment
    window.deleteComment = function(blogId, commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        const comments = getComments(blogId);
        const filtered = comments.filter(c => c.id !== commentId);
        saveComments(blogId, filtered);
        loadComments(blogId);

        showCommentMessage('success', 'Comment deleted successfully');
    };

    // Reply to comment
    window.replyToComment = function(commentId, authorName) {
        const messageInput = document.getElementById('comment-message');
        messageInput.value = `@${authorName} `;
        messageInput.focus();
        messageInput.scrollIntoView({ behavior: 'smooth' });
    };

    // Update comment count
    function updateCommentCount(count) {
        const countElement = document.getElementById('comment-count');
        if (countElement) {
            countElement.textContent = count + (count === 1 ? ' Comment' : ' Comments');
        }
    }

    // Show message
    function showCommentMessage(type, message) {
        const messageDiv = document.getElementById('comment-message-box');
        if (!messageDiv) {
            const div = document.createElement('div');
            div.id = 'comment-message-box';
            div.className = 'comment-message-box';
            document.getElementById('comment-form').appendChild(div);
        }

        const box = document.getElementById('comment-message-box');
        box.className = `comment-message-box ${type}`;
        box.textContent = message;
        box.style.display = 'block';

        setTimeout(() => {
            box.style.display = 'none';
        }, 5000);
    }

    // Helper functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }

        // Less than 1 hour
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return `${mins} minute${mins > 1 ? 's' : ''} ago`;
        }

        // Less than 1 day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }

        // Less than 7 days
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }

        // Format as date
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Export comments (for admin)
    window.exportComments = function() {
        const allComments = JSON.parse(localStorage.getItem('blog_comments') || '{}');
        const blob = new Blob([JSON.stringify(allComments, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comments-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

})();

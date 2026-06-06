import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiTrash2, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { likePost, commentOnPost, deletePost, getAvatar, formatTimeAgo } from '../utils/api';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  // Local state for instant UI updates
  const [localLikes, setLocalLikes] = useState(post.likes || []);
  const [localComments, setLocalComments] = useState(post.comments || []);

  const isLiked = user && localLikes.some((id) => id.toString() === user._id.toString());
  const isOwner = user && post.user && (
    post.user === user._id || post.user._id === user._id || post.user.toString() === user._id.toString()
  );

  const handleLike = async () => {
    if (!user) { toast.info('Login to like posts'); return; }
    if (liking) return;
    setLiking(true);

    // Optimistic update
    if (isLiked) {
      setLocalLikes(localLikes.filter((id) => id.toString() !== user._id.toString()));
    } else {
      setLocalLikes([...localLikes, user._id]);
    }

    try {
      await likePost(post._id);
    } catch {
      // Revert on error
      setLocalLikes(post.likes || []);
      toast.error('Failed to update like');
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) { toast.info('Login to comment'); return; }
    setSubmittingComment(true);
    try {
      const { data } = await commentOnPost(post._id, commentText.trim());
      setLocalComments([...localComments, data.comment]);
      setCommentText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(post._id);
      onDelete(post._id);
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const avatarUrl = post.avatar || getAvatar(post.username, '');

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <img
          src={avatarUrl}
          alt={post.username}
          className="post-avatar"
          onError={(e) => {
            e.target.src = getAvatar(post.username, '');
          }}
        />
        <div className="post-user-info">
          <div className="post-username">
            {post.username}
            <span className="handle"> @{post.username.toLowerCase()}</span>
            <span className="verified-badge ms-1">🥉</span>
          </div>
          <div className="post-time">{formatTimeAgo(post.createdAt)}</div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {!isOwner && user && (
            <button className="follow-btn btn btn-sm">Follow</button>
          )}
          {isOwner && (
            <button
              className="post-options-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete post"
            >
              {deleting ? '...' : <FiTrash2 size={15} />}
            </button>
          )}
        </div>
      </div>

      {/* Post Text */}
      {post.text && (
        <div className="post-text">{post.text}</div>
      )}

      {/* Post Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="post-image"
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Stats Row */}
      <div className="post-stats">
        <div className="stat-item">
          <span style={{ fontSize: '0.95rem' }}>❤️</span>
          <span className="count">{localLikes.length}</span>
          <span>Likes</span>
        </div>
        <div className="stat-item">
          <span style={{ fontSize: '0.95rem' }}>💬</span>
          <span className="count">{localComments.length}</span>
          <span>Comments</span>
        </div>
        <div className="stat-item">
          <span style={{ fontSize: '0.95rem' }}>🔗</span>
          <span className="count">{post.shares || 0}</span>
          <span>Shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="post-actions">
        <button
          className={`post-act-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={liking}
        >
          <FiHeart size={17} style={isLiked ? { fill: 'var(--tp-red)', color: 'var(--tp-red)' } : {}} />
          {isLiked ? 'Liked' : 'Like'}
        </button>

        <button
          className="post-act-btn comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageCircle size={17} />
          Comment
          {showComments ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
        </button>

        <button className="post-act-btn share-btn">
          <FiShare2 size={17} />
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {/* Existing Comments */}
          {localComments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '8px 0', color: 'var(--tp-text-muted)', fontSize: '0.83rem', fontWeight: 600 }}>
              No comments yet. Be the first!
            </div>
          )}
          {localComments.map((c, i) => (
            <div key={c._id || i} className="comment-item">
              <img
                src={c.avatar || getAvatar(c.username, '')}
                alt={c.username}
                className="comment-avatar"
                onError={(e) => { e.target.src = getAvatar(c.username, ''); }}
              />
              <div className="comment-bubble">
                <div className="comment-username">{c.username}</div>
                <div className="comment-text">{c.text}</div>
                <div className="comment-time">{c.createdAt ? formatTimeAgo(c.createdAt) : 'just now'}</div>
              </div>
            </div>
          ))}

          {/* Comment Input */}
          {user && (
            <form className="comment-input-row" onSubmit={handleComment}>
              <img
                src={user.avatar || getAvatar(user.username, '')}
                alt={user.username}
                className="comment-avatar"
                onError={(e) => { e.target.src = getAvatar(user.username, ''); }}
              />
              <input
                className="comment-input"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
                autoFocus
              />
              <button
                type="submit"
                className="comment-send-btn"
                disabled={!commentText.trim() || submittingComment}
              >
                {submittingComment ? (
                  <span style={{ fontSize: 10 }}>...</span>
                ) : (
                  <FiSend size={15} />
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;

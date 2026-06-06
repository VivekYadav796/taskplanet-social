import React, { useState, useRef } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FiImage, FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { createPost, getAvatar } from '../utils/api';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) {
      toast.error('Add some text or image to post');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      const { data } = await createPost(formData);
      onPostCreated(data);
      toast.success('Post created! 🎉');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="tp-modal-overlay" onClick={handleOverlayClick}>
      <div className="tp-modal">
        {/* Header */}
        <div className="tp-modal-header">
          <span className="tp-modal-title">Create Post</span>
          <button className="tp-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="tp-modal-body">
          <div className="modal-post-header">
            <div className="avatar-circle">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.username}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--tp-text-secondary)', fontWeight: 600 }}>
                Public post
              </div>
            </div>
          </div>

          <textarea
            className="modal-textarea"
            placeholder={`What's on your mind, ${user.username}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={4}
            autoFocus
          />
          <div className={`char-counter ${text.length > 900 ? 'danger' : ''}`}>
            {text.length}/1000
          </div>

          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="preview" className="image-preview" />
              <button className="remove-image-btn" onClick={removeImage}>
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer-actions">
          <div className="modal-attach-btns">
            <button
              className="attach-btn photo"
              onClick={() => fileInputRef.current?.click()}
              title="Add Photo"
            >
              🖼️
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
          </div>

          <Button
            className="submit-post-btn"
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !imageFile)}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Posting...
              </>
            ) : (
              <>
                <FiSend className="me-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

import React from 'react';
import { FiImage, FiSmile, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAvatar } from '../utils/api';

const CreatePostBar = ({ onOpenModal }) => {
  const { user } = useAuth();

  const avatarUrl = user.avatar || getAvatar(user.username, '');

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <div className="avatar-circle">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        <button
          className="create-post-input"
          onClick={onOpenModal}
        >
          What's on your mind?
        </button>
      </div>
      <div className="create-post-actions">
        <button className="post-action-btn photo" onClick={onOpenModal}>
          🖼️ Photo / Video
        </button>
        <button className="post-action-btn" onClick={onOpenModal}>
          📢 Promote
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn btn-primary btn-sm"
            style={{
              borderRadius: 20,
              fontWeight: 800,
              fontSize: '0.83rem',
              padding: '6px 20px',
              background: 'var(--tp-primary)',
              border: 'none',
            }}
            onClick={onOpenModal}
          >
            ➤ Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBar;

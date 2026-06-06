import React, { useState, useEffect, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import CreatePostBar from '../components/CreatePostBar';
import CreatePostModal from '../components/CreatePostModal';
import { SkeletonCard } from '../components/LoadingSpinner';
import { fetchPosts } from '../utils/api';

const FILTERS = [
  { key: 'all', label: 'All Post' },
  { key: 'forYou', label: 'For You' },
  { key: 'mostLiked', label: 'Most Liked' },
  { key: 'mostCommented', label: 'Most Commented' },
  { key: 'promotions', label: 'Promotions' },
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = useCallback(async (pageNum = 1, filter = 'all', reset = true) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiFilter = filter === 'forYou' || filter === 'promotions' ? 'all' : filter;
      const { data } = await fetchPosts(pageNum, 10, apiFilter);
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(1, activeFilter, true);
  }, [activeFilter, loadPosts]);

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      loadPosts(page + 1, activeFilter, false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <div className="feed-page">
      <div className="feed-container">

        {/* Create Post Bar */}
        <CreatePostBar onOpenModal={() => setShowModal(true)} />

        {/* Filter Tabs */}
        <div className="filter-tabs mb-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pinned Earn Post Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: 'var(--tp-radius)',
            padding: '14px 16px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>📌</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.97rem', color: '#92400e' }}>
              Create Post and Earn Points
            </div>
            <div style={{ fontSize: '0.82rem', color: '#78350f', fontWeight: 600, marginTop: 4, lineHeight: 1.6 }}>
              💰 Reward: 100 Points per valid post<br />
              🚀 Daily: Up to 1000 Points &nbsp;|&nbsp; Weekly: 10,000 Points
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginLeft: 'auto',
              background: '#f59e0b',
              border: 'none',
              borderRadius: 20,
              padding: '6px 14px',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Post & Earn
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No posts yet</div>
            <p className="empty-state-sub">Be the first to share something!</p>
            <Button
              onClick={() => setShowModal(true)}
              style={{
                marginTop: 16,
                background: 'var(--tp-primary)',
                border: 'none',
                borderRadius: 20,
                fontWeight: 700,
                padding: '8px 24px',
              }}
            >
              Create First Post
            </Button>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdated}
              />
            ))}

            {/* Load More */}
            {page < totalPages && (
              <button className="load-more-btn btn" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Loading more...
                  </>
                ) : (
                  'Load more posts ↓'
                )}
              </button>
            )}

            {page >= totalPages && posts.length > 0 && (
              <div style={{ textAlign: 'center', color: 'var(--tp-text-muted)', fontSize: '0.83rem', fontWeight: 600, padding: '16px 0' }}>
                You've seen all posts! 🎉
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default Feed;

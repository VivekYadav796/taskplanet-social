import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// Posts API
export const fetchPosts = (page = 1, limit = 10, filter = 'all') =>
  axios.get(`${API_BASE}/posts?page=${page}&limit=${limit}&filter=${filter}`);

export const createPost = (formData) =>
  axios.post(`${API_BASE}/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const likePost = (postId) =>
  axios.patch(`${API_BASE}/posts/${postId}/like`);

export const commentOnPost = (postId, text) =>
  axios.post(`${API_BASE}/posts/${postId}/comment`, { text });

export const fetchComments = (postId) =>
  axios.get(`${API_BASE}/posts/${postId}/comments`);

export const deletePost = (postId) =>
  axios.delete(`${API_BASE}/posts/${postId}`);

// Auth API
export const loginUser = (email, password) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

export const registerUser = (username, email, password) =>
  axios.post(`${API_BASE}/auth/register`, { username, email, password });

// Avatar placeholder
export const getAvatar = (username, avatar) => {
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=FF6B00&color=fff&bold=true&size=128`;
};

// Format time ago
export const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-IN');
};

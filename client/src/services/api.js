import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Posts
export const postAPI = {
  createPost: (formData) => api.post('/posts', formData),
  getPosts: (page = 1, limit = 10) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  deletePost: (id) => api.delete(`/posts/${id}`)
};

// Comments
export const commentAPI = {
  createComment: (data) => api.post('/comments', data),
  getComments: (postId) => api.get(`/comments/${postId}`),
  likeComment: (id) => api.put(`/comments/${id}/like`),
  deleteComment: (id) => api.delete(`/comments/${id}`)
};

// Users
export const userAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getUserProfile: (username) => api.get(`/users/profile/${username}`),
  followUser: (id) => api.put(`/users/follow/${id}`),
  getSuggestedUsers: () => api.get('/users/suggested')
};

export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  createConversation: (recipientId) => api.post('/chat/conversations', { recipientId }),
  getConversation: (conversationId) => api.get(`/chat/conversations/${conversationId}`),
  sendMessage: (conversationId, text) => api.post(`/chat/conversations/${conversationId}/messages`, { text })
};

export default api;
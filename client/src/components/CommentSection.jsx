import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../services/api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await commentAPI.createComment({
        content: newComment,
        postId
      });

      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await commentAPI.likeComment(commentId);
      setComments(prev => prev.map(comment =>
        comment._id === commentId ? response.data : comment
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  if (loading) {
    return <div className="mt-4 text-center text-slate-400">Loading comments...</div>;
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-5">
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="flex gap-3">
          <img
            src={user?.profilePicture || '/profile-photo.jpg'}
            alt={user?.username}
            className="h-10 w-10 rounded-full border border-slate-800 object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
              rows="2"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="rounded-3xl bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-slate-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="flex gap-3">
              <img
                src={comment.author.profilePicture || '/profile-photo.jpg'}
                alt={comment.author.username}
                className="h-8 w-8 rounded-full border border-slate-800 object-cover"
              />
              <div className="flex-1">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-white">{comment.author.fullName}</span>
                      <span className="text-slate-500">@{comment.author.username}</span>
                    </div>
                    {comment.author._id?.toString() === user._id?.toString() && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-slate-400 transition hover:text-red-500"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-slate-200 text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-3 text-xs text-slate-400">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`flex items-center gap-1 transition ${
                      comment.likes?.some((like) => like.toString() === user._id.toString())
                        ? 'text-red-500'
                        : 'hover:text-slate-200'
                    }`}
                  >
                    <svg className="h-4 w-4" fill={comment.likes.includes(user._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{comment.likes.length}</span>
                  </button>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI, commentAPI } from '../services/api';
import CommentSection from './CommentSection';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);
  const { user } = useAuth();

  const isLiked = post.likes?.some((like) => like.toString() === user._id.toString());
  const isOwnPost = post.author?._id?.toString() === user._id?.toString();

  const handleLike = async () => {
    if (liking) return;

    setLiking(true);
    try {
      const response = await postAPI.likePost(post._id);
      onUpdate(response.data);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(post._id);
      onDelete(post._id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.profilePicture || '/profile-photo.jpg'}
            alt={post.author.username}
            className="h-12 w-12 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">{post.author.fullName}</h3>
            <p className="text-slate-500 text-sm">@{post.author.username}</p>
            <p className="text-slate-400 text-xs mt-1">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {isOwnPost && (
          <button
            onClick={handleDelete}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-400 transition hover:border-red-500 hover:text-red-500"
            title="Delete post"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4 mb-4">
        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{post.content}</p>
        {post.image && (
          <img
            src={`http://localhost:5001${post.image}`}
            alt="Post content"
            className="max-w-full rounded-xl border border-slate-200 object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-start gap-2">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            isLiked
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <svg className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs">{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs">{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <CommentSection postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
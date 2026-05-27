import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', bio: '', profilePicture: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const isOwnProfile = currentUser?.username === username;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserProfile(username);
      setProfileUser(response.data);
      setFollowing(response.data.followers.some(f => f._id === currentUser._id));
      if (isOwnProfile) {
        setEditData({
          fullName: response.data.fullName || '',
          bio: response.data.bio || '',
          profilePicture: null
        });
        setPreviewImage(response.data.profilePicture || null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      await userAPI.followUser(profileUser._id);
      setFollowing(!following);

      // Update follower count
      setProfileUser(prev => ({
        ...prev,
        followers: following
          ? prev.followers.filter(f => f._id !== currentUser._id)
          : [...prev.followers, currentUser]
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = () => {
    navigate(`/chat?user=${profileUser.username}`);
  };

  const handleToggleEdit = () => {
    if (editMode) {
      setPreviewImage(profileUser.profilePicture || null);
      setEditData(prev => ({ ...prev, profilePicture: null }));
    }
    setEditMode((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setSaveError('');
  };

  const handleSaveProfile = async () => {
    if (!editData.fullName.trim()) {
      setSaveError('Full name is required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const formData = new FormData();
      formData.append('fullName', editData.fullName);
      formData.append('bio', editData.bio);
      if (editData.profilePicture) {
        formData.append('profilePicture', editData.profilePicture);
      }

      const response = await updateProfile(formData);
      if (response.success) {
        setProfileUser((prev) => ({ ...prev, ...response.data }));
        setEditMode(false);
      } else {
        setSaveError(response.error || 'Unable to update profile.');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveError('Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setProfileUser(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    }));
  };

  const handlePostDelete = (postId) => {
    setProfileUser(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post._id !== postId)
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-6">
            <img
              src={profileUser.profilePicture || '/profile-photo.jpg'}
              alt={profileUser.username}
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover flex-shrink-0"
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{profileUser.fullName}</h1>
              <p className="mt-1 text-slate-500">@{profileUser.username}</p>
              {profileUser.bio && (
                <p className="mt-3 max-w-2xl text-slate-700 leading-relaxed">{profileUser.bio}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isOwnProfile ? (
              <>
                <button
                  onClick={handleToggleEdit}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
                {editMode && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  disabled={actionLoading}
                  className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
                    following
                      ? 'border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                  } disabled:opacity-50`}
                >
                  {actionLoading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  onClick={handleMessage}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{profileUser.posts.length}</div>
            <div className="mt-1 text-sm text-slate-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{profileUser.followers.length}</div>
            <div className="mt-1 text-sm text-slate-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{profileUser.following.length}</div>
            <div className="mt-1 text-sm text-slate-600">Following</div>
          </div>
        </div>

        {editMode && isOwnProfile && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-900">Edit Your Profile</h3>
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-900">Profile Picture</label>
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={previewImage || '/profile-photo.jpg'}
                    alt="Preview"
                    className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover"
                  />
                  <div>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="inline-block cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Change Picture
                    </label>
                    <p className="mt-2 text-xs text-slate-500">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  value={editData.fullName}
                  onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-900" htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              {saveError && <p className="text-sm text-red-600 font-medium">{saveError}</p>}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  onClick={handleToggleEdit}
                  className="rounded-lg border border-slate-300 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {profileUser.posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-medium text-slate-600">
              {isOwnProfile ? 'You haven\'t posted anything yet.' : 'No posts yet.'}
            </p>
            <p className="mt-1 text-slate-500">Share your first moment!</p>
          </div>
        ) : (
          profileUser.posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
              onDelete={handlePostDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
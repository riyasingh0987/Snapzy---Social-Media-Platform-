import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI, userAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const formatTimestamp = (value) => {
  const date = new Date(value);
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const targetUsername = searchParams.get('user');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (targetUsername && conversations.length > 0) {
      openConversationWithUsername(targetUsername);
    }
  }, [targetUsername, conversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      setConversations(response.data);
      if (response.data.length > 0) {
        setActiveConversation(response.data[0]);
        setMessages(response.data[0].messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Could not load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const openConversationWithUsername = async (username) => {
    try {
      if (!username || username === user.username) return;
      const profileResponse = await userAPI.getUserProfile(username);
      const response = await chatAPI.createConversation(profileResponse.data._id);
      const openedConversation = response.data;
      setActiveConversation(openedConversation);
      setMessages(openedConversation.messages || []);
      setConversations((prev) => {
        const existing = prev.find((conversation) => conversation._id === openedConversation._id);
        if (existing) {
          return prev.map((conversation) =>
            conversation._id === openedConversation._id ? openedConversation : conversation
          );
        }
        return [openedConversation, ...prev];
      });
      navigate('/chat', { replace: true });
    } catch (err) {
      console.error('Failed to open conversation:', err);
      setError('Unable to start chat with that user.');
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages || []);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    setSending(true);
    try {
      const response = await chatAPI.sendMessage(activeConversation._id, messageText.trim());
      setMessages(response.data.messages || []);
      setMessageText('');
      setActiveConversation(response.data);
      setConversations((prev) => [response.data, ...prev.filter((c) => c._id !== response.data._id)]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Could not send your message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Messages</p>
            <h2 className="text-2xl font-semibold text-white">Chats</h2>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="rounded-3xl bg-slate-950/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}

        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-400">
            No conversations yet. Message a profile to start chatting.
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const peer = conversation.participants.find((participant) => participant._id !== user._id) || conversation.participants[0];
              const lastText = conversation.lastMessage?.text || 'New conversation';
              const isActive = activeConversation?._id === conversation._id;

              return (
                <button
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                    isActive
                      ? 'border-sky-500 bg-slate-950 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.profilePicture || '/profile-photo.jpg'}
                      alt={peer.username}
                      className="h-12 w-12 rounded-full border border-slate-800 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white">{peer.fullName}</p>
                        <span className="text-xs text-slate-500">{formatTimestamp(conversation.updatedAt)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-400">{lastText}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Conversation</p>
            <h2 className="text-2xl font-semibold text-white">
              {activeConversation?.participants[0]?.fullName || 'Select a chat'}
            </h2>
          </div>
          {activeConversation?.participants[0] && (
            <span className="rounded-full bg-slate-950/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              @{activeConversation.participants[0].username}
            </span>
          )}
        </div>

        <div className="mb-6 min-h-[420px] rounded-3xl border border-slate-800 bg-slate-950/90 p-5 overflow-y-auto">
          {activeConversation ? (
            messages.length === 0 ? (
              <p className="text-slate-400">Say hello to start the conversation.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.sender._id === user._id;
                  return (
                    <div
                      key={`${message._id || index}-${message.createdAt}`}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-3xl px-4 py-3 ${isOwn ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-200'}`}>
                        <p className="text-sm leading-6">{message.text}</p>
                        <p className="mt-2 text-xs text-slate-400">{formatTimestamp(message.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="flex min-h-[420px] items-center justify-center text-slate-500">
              Select a chat on the left or open a profile to message someone.
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={activeConversation ? 'Type a message...' : 'Choose a conversation first.'}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
            rows={3}
            disabled={!activeConversation}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={!activeConversation || sending || !messageText.trim()}
              className="rounded-3xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
            {activeConversation && (
              <button
                type="button"
                onClick={() => {
                  setMessageText('');
                  setError('');
                }}
                className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default Chat;

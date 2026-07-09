/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, MessageCircle, Share2, Bookmark, Send, Image, Film, 
  Trash, MessageSquare, AlertCircle, Sparkles, CheckCircle, Bell,
  Copy, Check, ExternalLink, Globe, Users, Plus, X, Play, Pause,
  ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import { Post, Comment } from '../types';

const IMAGE_PRESETS = [
  { name: 'Cyber Neon Setup', url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800' },
  { name: 'Esports Arena', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Vaporwave Visuals', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800' },
  { name: 'Kyoto Sakura Walk', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Luxury Yacht Club', url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800' }
];

const MULTI_IMAGE_PRESETS = [
  {
    name: 'Neon Cyber Aesthetics (3 Images)',
    urls: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    name: 'Kyoto Sights (4 Images)',
    urls: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    name: 'Cosplay & Stage (2 Images)',
    urls: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

const VIDEO_PRESETS = [
  { name: 'Starry Cosmic Loop', url: 'https://assets.mixkit.co/videos/preview/mixkit-starry-space-animation-background-12108-large.mp4' },
  { name: 'Matrix Cyber Screens', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-43093-large.mp4' },
  { name: 'HUD Radar Interface', url: 'https://assets.mixkit.co/videos/preview/mixkit-hud-interface-radar-animation-31718-large.mp4' }
];

export const FeedView: React.FC = () => {
  const { 
    currentUser, 
    posts, 
    notifications, 
    users, 
    follows = [],
    createPost, 
    deletePost, 
    likePost, 
    savePost, 
    sharePost,
    addComment, 
    getComments, 
    setView,
    markNotificationRead 
  } = useApp();

  // General Post Creation State
  const [newPostText, setNewPostText] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | 'multiple_images' | undefined>(undefined);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);
  const [attachmentMode, setAttachmentMode] = useState<'none' | 'image' | 'multiple_images' | 'video'>('none');
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Comment & Filter State
  const [activeCommentDrawerPostId, setActiveCommentDrawerPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeFeedFilter, setActiveFeedFilter] = useState<'all' | 'following' | 'saved'>('all');

  // Custom Interactivity Modals State
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedMediaUrl && selectedMediaUrls.length === 0) return;

    if (selectedMediaType === 'multiple_images') {
      createPost(
        newPostText, 
        selectedMediaUrls[0] || undefined, 
        'image', 
        selectedMediaUrls
      );
    } else {
      createPost(
        newPostText, 
        selectedMediaUrl || undefined, 
        selectedMediaType
      );
    }

    // Reset Creation Slate
    setNewPostText('');
    setSelectedMediaUrl('');
    setSelectedMediaUrls([]);
    setSelectedMediaType(undefined);
    setAttachmentMode('none');
    setCustomUrlInput('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  // Attach Preset Helpers
  const handleAttachSinglePreset = (url: string) => {
    setSelectedMediaUrl(url);
    setSelectedMediaUrls([]);
    setSelectedMediaType('image');
  };

  const handleAttachMultiplePreset = (urls: string[]) => {
    setSelectedMediaUrls(urls);
    setSelectedMediaUrl('');
    setSelectedMediaType('multiple_images');
  };

  const handleAttachVideoPreset = (url: string) => {
    setSelectedMediaUrl(url);
    setSelectedMediaUrls([]);
    setSelectedMediaType('video');
  };

  const handleCustomUrlAttach = () => {
    if (!customUrlInput.trim()) return;
    if (attachmentMode === 'image') {
      setSelectedMediaUrl(customUrlInput);
      setSelectedMediaUrls([]);
      setSelectedMediaType('image');
    } else if (attachmentMode === 'video') {
      setSelectedMediaUrl(customUrlInput);
      setSelectedMediaUrls([]);
      setSelectedMediaType('video');
    } else if (attachmentMode === 'multiple_images') {
      setSelectedMediaUrls([...selectedMediaUrls, customUrlInput]);
      setSelectedMediaType('multiple_images');
    }
    setCustomUrlInput('');
  };

  const openShareModal = (post: Post) => {
    setSharingPost(post);
    setCopiedLink(false);
  };

  const executeCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    if (sharingPost) {
      sharePost(sharingPost.id);
    }
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openLightbox = (urls: string[], index: number) => {
    setLightboxImages(urls);
    setLightboxIndex(index);
  };

  // Post Filtering Logic
  const filteredPosts = posts.filter(post => {
    if (activeFeedFilter === 'saved') {
      return post.is_saved;
    }
    if (activeFeedFilter === 'following') {
      if (!currentUser) return false;
      return follows.some(f => f.follower_id === currentUser.id && f.following_id === post.user_id);
    }
    return true; // 'all'
  });

  const followingCount = currentUser 
    ? follows.filter(f => f.follower_id === currentUser.id).length 
    : 0;

  const savedCount = posts.filter(p => p.is_saved).length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" id="feed-container">
      
      {/* MAIN POST STREAM PANEL */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* POST CREATION PANEL (Registered Users Only) */}
        {currentUser ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4" id="post-creation-panel">
            <div className="flex gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.display_name} 
                className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <form onSubmit={handleCreatePost}>
                  <textarea 
                    placeholder="Share what is happening! Offer virtual gifts 🌹 or showcase moments..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    rows={3}
                    className="w-full resize-none border-0 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
                    id="feed-post-textarea"
                  />
                  
                  {/* ATTACHMENT MODE DRAWER */}
                  {attachmentMode !== 'none' && (
                    <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <span>
                          {attachmentMode === 'image' && 'Attach Image'}
                          {attachmentMode === 'multiple_images' && 'Attach Multiple Images'}
                          {attachmentMode === 'video' && 'Attach Video Loop'}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setAttachmentMode('none')}
                          className="rounded p-1 hover:bg-zinc-900 text-zinc-500 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* URL input field */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={
                            attachmentMode === 'multiple_images' 
                              ? "Paste image URL and click Add" 
                              : `Paste custom ${attachmentMode} URL...`
                          }
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-violet-500"
                        />
                        <button
                          type="button"
                          onClick={handleCustomUrlAttach}
                          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-white font-bold"
                        >
                          {attachmentMode === 'multiple_images' ? 'Add' : 'Attach'}
                        </button>
                      </div>

                      {/* Showcase quick preset tags */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Or click a curated sample preset:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {attachmentMode === 'image' && IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleAttachSinglePreset(preset.url)}
                              className="text-[10px] bg-zinc-900 hover:bg-violet-950/40 border border-zinc-800 hover:border-violet-800 text-zinc-300 hover:text-white px-2 py-1 rounded-lg transition"
                            >
                              {preset.name}
                            </button>
                          ))}
                          {attachmentMode === 'multiple_images' && MULTI_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleAttachMultiplePreset(preset.urls)}
                              className="text-[10px] bg-zinc-900 hover:bg-violet-950/40 border border-zinc-800 hover:border-violet-800 text-zinc-300 hover:text-white px-2 py-1 rounded-lg transition"
                            >
                              {preset.name}
                            </button>
                          ))}
                          {attachmentMode === 'video' && VIDEO_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleAttachVideoPreset(preset.url)}
                              className="text-[10px] bg-zinc-900 hover:bg-cyan-950/40 border border-zinc-800 hover:border-cyan-800 text-zinc-300 hover:text-white px-2 py-1 rounded-lg transition"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE ATTACHMENTS PREVIEW LIST */}
                  {selectedMediaType && (
                    <div className="relative mt-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 pb-1 border-b border-zinc-900/60 font-mono">
                        <span className="flex items-center gap-1">
                          {selectedMediaType === 'image' && <Image className="h-3.5 w-3.5 text-violet-400" />}
                          {selectedMediaType === 'multiple_images' && <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                          {selectedMediaType === 'video' && <Film className="h-3.5 w-3.5 text-cyan-400" />}
                          <span className="capitalize font-bold">{selectedMediaType.replace('_', ' ')} Ready</span>
                        </span>
                        <button 
                          type="button"
                          onClick={() => { setSelectedMediaUrl(''); setSelectedMediaUrls([]); setSelectedMediaType(undefined); }}
                          className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-0.5 bg-zinc-900 px-1.5 py-0.5 rounded"
                        >
                          <X className="h-3 w-3" /> Clear
                        </button>
                      </div>

                      {selectedMediaType === 'image' && selectedMediaUrl && (
                        <div className="relative rounded-lg overflow-hidden max-h-48 border border-zinc-900 bg-zinc-950">
                          <img 
                            src={selectedMediaUrl} 
                            alt="Attachment preview" 
                            className="w-full object-cover max-h-48"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {selectedMediaType === 'video' && selectedMediaUrl && (
                        <div className="p-3 bg-zinc-900/40 rounded-lg flex items-center gap-2 border border-zinc-800">
                          <Film className="h-5 w-5 text-cyan-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-white font-bold truncate">Custom MP4 Video Added</p>
                            <p className="text-[10px] text-zinc-500 truncate">{selectedMediaUrl}</p>
                          </div>
                        </div>
                      )}

                      {selectedMediaType === 'multiple_images' && selectedMediaUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-1.5 mt-1">
                          {selectedMediaUrls.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded overflow-hidden border border-zinc-900 group">
                              <img src={url} alt={`Preview ${i}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = selectedMediaUrls.filter((_, idx) => idx !== i);
                                  setSelectedMediaUrls(updated);
                                  if (updated.length === 0) setSelectedMediaType(undefined);
                                }}
                                className="absolute top-0.5 right-0.5 rounded-full bg-zinc-950/80 p-0.5 text-zinc-400 hover:text-rose-500"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* FORM BOTTOM TOOLBAR */}
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={() => setAttachmentMode(attachmentMode === 'image' ? 'none' : 'image')}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          attachmentMode === 'image' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-violet-400 hover:bg-zinc-800/40'
                        }`}
                        title="Add single image"
                      >
                        <Image className="h-4 w-4" />
                        <span>Image</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAttachmentMode(attachmentMode === 'multiple_images' ? 'none' : 'multiple_images')}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          attachmentMode === 'multiple_images' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-amber-400 hover:bg-zinc-800/40'
                        }`}
                        title="Add multiple images grid"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Multi-Images</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAttachmentMode(attachmentMode === 'video' ? 'none' : 'video')}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          attachmentMode === 'video' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-cyan-400 hover:bg-zinc-800/40'
                        }`}
                        title="Add loop video"
                      >
                        <Film className="h-4 w-4" />
                        <span>Video</span>
                      </button>
                    </div>

                    <button 
                      type="submit"
                      disabled={!newPostText.trim() && !selectedMediaUrl && selectedMediaUrls.length === 0}
                      className="rounded-full bg-violet-600 px-5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-500/10 hover:bg-violet-500 transition disabled:opacity-40"
                      id="submit-post-btn"
                    >
                      Post Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-violet-950/20 to-fuchsia-950/20 p-5 text-center">
            <Sparkles className="h-7 w-7 text-violet-400 mx-auto animate-bounce" />
            <h3 className="mt-2 text-sm font-bold text-white font-display">Connect with Global Stars</h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
              Unlock the Home Feed to write posts, comment, like content, and exchange virtual diamonds!
            </p>
          </div>
        )}

        {/* FEED FILTER NAVIGATION TABS */}
        <div className="border-b border-zinc-800 pb-px flex gap-6 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
          <button
            onClick={() => setActiveFeedFilter('all')}
            className={`pb-3 border-b-2 transition ${activeFeedFilter === 'all' ? 'border-violet-500 text-white' : 'border-transparent hover:text-white'}`}
          >
            🌎 All Feed
          </button>
          <button
            onClick={() => setActiveFeedFilter('following')}
            className={`pb-3 border-b-2 transition ${activeFeedFilter === 'following' ? 'border-violet-500 text-white' : 'border-transparent hover:text-white'}`}
          >
            👥 Following ({followingCount})
          </button>
          <button
            onClick={() => setActiveFeedFilter('saved')}
            className={`pb-3 border-b-2 transition ${activeFeedFilter === 'saved' ? 'border-violet-500 text-white' : 'border-transparent hover:text-white'}`}
          >
            💾 Saved Posts ({savedCount})
          </button>
        </div>

        {/* FEED POSTS STREAM */}
        <div className="space-y-5">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const isCommentsOpen = activeCommentDrawerPostId === post.id;
              const postComments = isCommentsOpen ? getComments(post.id) : [];

              return (
                <div 
                  key={post.id} 
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 transition hover:bg-zinc-900/30"
                  id={`feed-post-card-${post.id}`}
                >
                  {/* Author Row Header */}
                  <div className="flex items-start justify-between">
                    <div 
                      onClick={() => setView('profile', post.author.id)}
                      className="flex cursor-pointer gap-3"
                    >
                      <div className="relative">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.display_name} 
                          className={`h-10 w-10 rounded-full object-cover border-2 shrink-0 ${post.author.is_vip ? 'border-amber-400 shadow-amber-500/15' : 'border-zinc-800'}`}
                        />
                        {post.author.is_vip && (
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 rounded text-[7px] px-1 text-slate-950 font-extrabold font-mono">
                            VIP
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white hover:underline">
                            {post.author.display_name}
                          </span>
                          {post.author.is_vip && (
                            <span className="text-xs text-amber-400" title="VIP Level Member">👑</span>
                          )}
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 rounded">
                            Lv.{post.author.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          @{post.author.username} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {currentUser && (currentUser.id === post.user_id || currentUser.role === 'admin') && (
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400"
                        title="Delete Post"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Post Content Body */}
                  <div className="mt-3">
                    <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                      {post.content}
                    </p>

                    {/* RENDERING MULTIPLE IMAGES (Collage Layout) */}
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <div className={`mt-3 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 grid gap-1.5 ${
                        post.media_urls.length === 2 ? 'grid-cols-2' :
                        post.media_urls.length === 3 ? 'grid-cols-3' :
                        post.media_urls.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'
                      }`}>
                        {post.media_urls.map((url, index) => {
                          // Handle custom offsets or spanning for a spectacular layout
                          const isLarge = post.media_urls!.length === 3 && index === 0;
                          return (
                            <div 
                              key={index} 
                              onClick={() => openLightbox(post.media_urls!, index)}
                              className={`relative overflow-hidden cursor-pointer group bg-zinc-900 ${
                                isLarge ? 'col-span-2 row-span-2 aspect-video' : 'aspect-square'
                              }`}
                            >
                              <img 
                                src={url} 
                                alt={`Post attachment ${index}`} 
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <Eye className="h-5 w-5 text-white filter drop-shadow" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* RENDERING SINGLE ATTACHMENT (Image or Real HTML5 Video) */
                      post.media_url && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950">
                          {post.media_type === 'image' ? (
                            <img 
                              src={post.media_url} 
                              alt="Post attachment" 
                              onClick={() => openLightbox([post.media_url!], 0)}
                              className="w-full object-cover max-h-96 cursor-zoom-in hover:opacity-95 transition"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="relative">
                              <video 
                                src={post.media_url} 
                                controls 
                                playsInline
                                loop
                                muted
                                className="w-full object-cover max-h-[420px] rounded-b-xl"
                              />
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  {/* INTERACTION ROW: Like, Comment, Share, Save */}
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-900/60 pt-3 text-zinc-400">
                    {/* LIKE BUTTON */}
                    <button 
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition hover:text-rose-400 ${post.is_liked ? 'text-rose-500 font-extrabold scale-105' : ''}`}
                      id={`like-post-${post.id}`}
                    >
                      <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${post.is_liked ? 'fill-rose-500 text-rose-500 scale-125' : ''}`} />
                      <span>{post.likes_count}</span>
                    </button>

                    {/* COMMENT DRAWER TOGGLE */}
                    <button 
                      onClick={() => setActiveCommentDrawerPostId(isCommentsOpen ? null : post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition hover:text-violet-400 ${isCommentsOpen ? 'text-violet-400 font-extrabold' : ''}`}
                      id={`comment-toggle-${post.id}`}
                    >
                      <MessageCircle className="h-4.5 w-4.5" />
                      <span>{post.comments_count}</span>
                    </button>

                    {/* SHARE MODAL TRIGGER */}
                    <button 
                      onClick={() => openShareModal(post)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition hover:text-violet-400"
                    >
                      <Share2 className="h-4.5 w-4.5 hover:rotate-12 transition-transform" />
                      <span>{post.shares_count > 0 ? post.shares_count : 'Share'}</span>
                    </button>

                    {/* SAVE BOOKMARK BUTTON */}
                    <button 
                      onClick={() => savePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition hover:text-cyan-400 ${post.is_saved ? 'text-cyan-400 font-extrabold' : ''}`}
                    >
                      <Bookmark className={`h-4.5 w-4.5 transition-transform ${post.is_saved ? 'fill-cyan-400 text-cyan-400 scale-110' : ''}`} />
                      <span>{post.saved_count > 0 ? post.saved_count : 'Save'}</span>
                    </button>
                  </div>

                  {/* COMMENTS SECTION BLOCK */}
                  {isCommentsOpen && (
                    <div className="mt-4 border-t border-zinc-900/60 pt-4 space-y-4 animate-fadeIn">
                      {/* Comments list */}
                      {postComments.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                          {postComments.map((comment) => (
                            <div key={comment.id} className="flex gap-2.5 items-start text-xs bg-zinc-950/20 border border-zinc-900/60 p-2.5 rounded-xl">
                              <img 
                                src={comment.author.avatar} 
                                alt={comment.author.display_name} 
                                className="h-7 w-7 rounded-full object-cover mt-0.5 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span 
                                      className="font-bold text-white hover:underline cursor-pointer truncate" 
                                      onClick={() => setView('profile', comment.author.id)}
                                    >
                                      {comment.author.display_name}
                                    </span>
                                    {comment.author.is_vip && <span className="text-[10px]">👑</span>}
                                    <span className="text-[9px] bg-zinc-900 text-zinc-500 px-1 rounded scale-90">
                                      Lv.{comment.author.level}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-zinc-300 mt-1 whitespace-pre-line leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-xs text-zinc-500 py-2">
                          No comments yet. Write a friendly comment to show support!
                        </p>
                      )}

                      {/* Comment typing input field */}
                      {currentUser ? (
                        <div className="flex gap-2.5">
                          <input 
                            type="text" 
                            placeholder="Write a supportive comment..." 
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            className="rounded-xl bg-violet-600 px-4 text-xs font-bold text-white hover:bg-violet-500 transition flex items-center justify-center shrink-0"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-center text-[11px] text-zinc-500">
                          Please log in to leave comments.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-zinc-900/10 rounded-2xl border border-zinc-800 border-dashed">
              <Users className="h-10 w-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-400">No posts found</p>
              <p className="text-xs text-zinc-500 mt-1">Try switching back to Global Feed to see more content!</p>
            </div>
          )}
        </div>
      </div>

      {/* SIDE COLUMN DETAIL WIDGETS */}
      <div className="space-y-6">
        
        {/* Profile Card Summary if logged in */}
        {currentUser && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.display_name} 
                className="h-12 w-12 rounded-full object-cover border border-zinc-800"
              />
              <div>
                <h4 className="text-sm font-bold text-white font-display">{currentUser.display_name}</h4>
                <p className="text-xs text-zinc-400 font-mono">@{currentUser.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4 text-center border-t border-zinc-800/60 pt-3">
              <div className="bg-zinc-950/40 p-1.5 rounded-xl">
                <span className="block text-[10px] text-zinc-500 uppercase font-bold">Coins</span>
                <span className="text-xs font-bold text-amber-400">{currentUser.coins.toLocaleString()}</span>
              </div>
              <div className="bg-zinc-950/40 p-1.5 rounded-xl">
                <span className="block text-[10px] text-zinc-500 uppercase font-bold">Diamonds</span>
                <span className="text-xs font-bold text-cyan-400">{currentUser.diamonds.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setView('profile', currentUser.id)}
              className="mt-4 flex w-full justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold py-2 text-white transition border border-zinc-700/50"
            >
              Configure Profile
            </button>
          </div>
        )}

        {/* Live system alerts / Recent Notifications */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
            <Bell className="h-3.5 w-3.5 text-rose-500" />
            Live Activity Alerts
          </h4>
          
          {notifications.length > 0 ? (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {notifications.slice(0, 4).map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => { markNotificationRead(notif.id); if (notif.sender_id !== 'system') setView('profile', notif.sender_id); }}
                  className={`flex gap-2 text-xs p-2 rounded-xl transition cursor-pointer ${notif.is_read ? 'bg-zinc-950/10 hover:bg-zinc-950/30' : 'bg-rose-950/10 border-l-2 border-rose-500 hover:bg-rose-950/20'}`}
                >
                  <img 
                    src={notif.sender_avatar} 
                    alt={notif.sender_name} 
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-zinc-200">
                      <span className="font-bold text-white">{notif.sender_name}</span> {notif.message}
                    </p>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-zinc-500 flex flex-col items-center">
              <CheckCircle className="h-6 w-6 text-zinc-600 mb-1" />
              Your alerts stream is clear!
            </div>
          )}
        </div>

        {/* Trending Stars block */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Popular Creators
          </h4>
          
          <div className="space-y-3">
            {users.filter(u => u.id !== (currentUser?.id || 'null')).slice(0, 3).map((u) => (
              <div 
                key={u.id}
                onClick={() => setView('profile', u.id)}
                className="flex items-center justify-between p-1.5 rounded-xl hover:bg-zinc-900/40 cursor-pointer transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={u.avatar} 
                      alt={u.display_name} 
                      className={`h-8 w-8 rounded-full object-cover border ${u.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}
                    />
                    {u.is_online && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-zinc-950" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white leading-tight truncate">{u.display_name}</span>
                    <span className="block text-[10px] text-zinc-400 font-mono truncate">@{u.username}</span>
                  </div>
                </div>
                <span className="rounded bg-zinc-900 px-2 py-0.5 text-[9px] text-zinc-400 shrink-0">
                  Lv.{u.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PORTABLE INTERACTIVE SHARE MODAL OVERLAY */}
      {sharingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <button 
              onClick={() => setSharingPost(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-violet-600/15 border border-violet-500/25">
                <Share2 className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">Share Creative Post</h3>
                <p className="text-[10px] text-zinc-500">Spread the love to other digital communities</p>
              </div>
            </div>

            {/* Post Card Preview */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-3.5 mb-4 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <img src={sharingPost.author.avatar} alt="Author" className="h-5 w-5 rounded-full object-cover" />
                <span className="font-bold text-white">{sharingPost.author.display_name}</span>
                <span className="text-[10px] text-zinc-500">@{sharingPost.author.username}</span>
              </div>
              <p className="text-zinc-400 line-clamp-2 italic">"{sharingPost.content}"</p>
            </div>

            {/* Mock Post Url */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Shareable Direct Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://connectx.app/posts/${sharingPost.id}`}
                  className="flex-1 rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-2 text-xs font-mono text-zinc-300 outline-none"
                />
                <button
                  onClick={() => executeCopyLink(`https://connectx.app/posts/${sharingPost.id}`)}
                  className={`rounded-lg px-4 font-bold text-xs transition-colors flex items-center gap-1 shrink-0 ${
                    copiedLink ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Fast share buttons */}
            <div className="grid grid-cols-3 gap-2 mt-5">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out @${sharingPost.author.username} on ConnectX! `)}&url=${encodeURIComponent(`https://connectx.app/posts/${sharingPost.id}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => sharePost(sharingPost.id)}
                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-[10px] text-zinc-300 font-extrabold text-center hover:text-white transition"
              >
                Twitter / X
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`https://connectx.app/posts/${sharingPost.id}`)}&text=${encodeURIComponent(`Check out @${sharingPost.author.username} on ConnectX!`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => sharePost(sharingPost.id)}
                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-[10px] text-zinc-300 font-extrabold text-center hover:text-white transition"
              >
                Telegram
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out @${sharingPost.author.username} on ConnectX: https://connectx.app/posts/${sharingPost.id}`)}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => sharePost(sharingPost.id)}
                className="rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-2.5 text-[10px] text-zinc-300 font-extrabold text-center hover:text-white transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR IMMERSIVE MULTI-IMAGE & SINGLE IMAGE ZOOM */}
      {lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 select-none animate-fadeIn">
          {/* Top header navigation */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>
              Image {lightboxIndex + 1} of {lightboxImages.length}
            </span>
            <button 
              onClick={() => setLightboxImages([])}
              className="rounded-full bg-zinc-900 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Core visual stage */}
          <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center">
            {/* Previous button */}
            {lightboxIndex > 0 && (
              <button 
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 md:-left-16 z-10 rounded-full bg-zinc-900/80 p-3 text-white hover:bg-zinc-800 transition shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <img 
              src={lightboxImages[lightboxIndex]} 
              alt="Immersive view" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg border border-zinc-900 shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {/* Next button */}
            {lightboxIndex < lightboxImages.length - 1 && (
              <button 
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 md:-right-16 z-10 rounded-full bg-zinc-900/80 p-3 text-white hover:bg-zinc-800 transition shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

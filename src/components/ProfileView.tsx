/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, MessageSquare, Gift, Heart, UserPlus, UserMinus, 
  MapPin, Calendar, Compass, Star, Camera, Check, Settings, Sparkles, AlertTriangle,
  Users, UserCheck
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    profileUserId, 
    users, 
    posts, 
    gifts,
    sendGift,
    follows = [],
    followUser, 
    unfollowUser, 
    updateProfile, 
    setChatPartner, 
    setView,
    createReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'mutual' | 'suggested'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showGiftShop, setShowGiftShop] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Edit fields
  const [editedDisplayName, setEditedDisplayName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedAge, setEditedAge] = useState(25);
  const [editedGender, setEditedGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Prefer not to say');
  const [editedCountry, setEditedCountry] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');
  const [editedCover, setEditedCover] = useState('');

  // Report fields
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');

  // Success indicator for gift
  const [giftSuccessMsg, setGiftSuccessMsg] = useState('');
  const [giftErrorMsg, setGiftErrorMsg] = useState('');

  // Find target profile
  const profileUser = users.find(u => u.id === profileUserId) || currentUser;

  if (!profileUser) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 text-center text-zinc-400">
        Profile target not found. Please log in or return home.
      </div>
    );
  }

  const isOwnProfile = currentUser ? currentUser.id === profileUser.id : false;
  
  // Real database follow check
  const isFollowing = currentUser 
    ? follows.some(f => f.follower_id === currentUser.id && f.following_id === profileUser.id)
    : false;

  // Dynamic social graph calculations
  const followersList = users.filter(u => 
    follows.some(f => f.following_id === profileUser.id && f.follower_id === u.id)
  );

  const followingList = users.filter(u => 
    follows.some(f => f.follower_id === profileUser.id && f.following_id === u.id)
  );

  // Mutual friends list:
  // - If viewing someone else's profile: common following (users both follow).
  // - If viewing own profile: bidirectional follows (mutual follows, where both follow each other).
  const mutualFriendsList = currentUser
    ? (profileUser.id !== currentUser.id
        ? users.filter(u => 
            u.id !== currentUser.id &&
            u.id !== profileUser.id &&
            follows.some(f => f.follower_id === currentUser.id && f.following_id === u.id) &&
            follows.some(f => f.follower_id === profileUser.id && f.following_id === u.id)
          )
        : users.filter(u => 
            u.id !== currentUser.id &&
            follows.some(f => f.follower_id === currentUser.id && f.following_id === u.id) &&
            follows.some(f => f.follower_id === u.id && f.following_id === currentUser.id)
          )
      )
    : [];

  const suggestedUsersList = currentUser
    ? users.filter(u => 
        u.id !== currentUser.id &&
        !follows.some(f => f.follower_id === currentUser.id && f.following_id === u.id)
      ).slice(0, 8)
    : users.slice(0, 8);

  const followersCount = followersList.length;
  const followingCount = followingList.length;

  const startEdit = () => {
    setEditedDisplayName(profileUser.display_name);
    setEditedBio(profileUser.bio);
    setEditedAge(profileUser.age);
    setEditedGender(profileUser.gender);
    setEditedCountry(profileUser.country);
    setEditedAvatar(profileUser.avatar_url || profileUser.avatar);
    setEditedCover(profileUser.cover_url || profileUser.cover_photo);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: editedDisplayName,
      bio: editedBio,
      age: Number(editedAge),
      gender: editedGender,
      country: editedCountry,
      avatar: editedAvatar,
      avatar_url: editedAvatar,
      cover_photo: editedCover,
      cover_url: editedCover
    });
    setIsEditing(false);
  };

  const handleFollowToggle = () => {
    if (!currentUser) {
      alert('Please join ConnectX to follow creators!');
      return;
    }
    // Simple mock toggle
    if (isFollowing) {
      unfollowUser(profileUser.id);
    } else {
      followUser(profileUser.id);
    }
  };

  const handleMessageUser = () => {
    if (!currentUser) {
      alert('Please join ConnectX to chat with creators!');
      return;
    }
    setChatPartner(profileUser.id);
    setView('chat');
  };

  const handleSendGiftLocal = (giftId: string) => {
    if (!currentUser) {
      setGiftErrorMsg('Please register or sign in to purchase and exchange virtual gifts.');
      return;
    }

    const res = sendGift(profileUser.id, giftId);
    if (res.success) {
      const g = gifts.find(item => item.id === giftId);
      setGiftSuccessMsg(`You showered ${profileUser.display_name} with ${g?.name} ${g?.icon}! (+${g?.value_diamonds} Diamonds)`);
      setGiftErrorMsg('');
      setTimeout(() => setGiftSuccessMsg(''), 4000);
    } else {
      setGiftErrorMsg(res.error || 'Failed to send gift.');
      setGiftSuccessMsg('');
      setTimeout(() => setGiftErrorMsg(''), 4000);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    createReport(profileUser.id, reportReason, reportDetails);
    alert(`Thank you. Your report regarding @${profileUser.username} has been recorded. ConnectX administrators will inspect this within 2 hours.`);
    setShowReportModal(false);
    setReportDetails('');
  };

  // Filter posts authored by this user
  const userPosts = posts.filter(p => p.user_id === profileUser.id);

  const renderUserGrid = (userList: User[], emptyMessage: string) => {
    if (userList.length === 0) {
      return (
        <div className="text-center text-xs text-zinc-500 py-10 bg-zinc-900/10 rounded-2xl border border-zinc-900/60 border-dashed p-6">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userList.map((u) => {
          const isUFollowing = currentUser
            ? follows.some(f => f.follower_id === currentUser.id && f.following_id === u.id)
            : false;
          const isSelf = currentUser ? currentUser.id === u.id : false;

          return (
            <div
              key={u.id}
              className="relative flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900/20 p-4 transition hover:bg-zinc-900/30 group"
            >
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => setView('profile', u.id)}
              >
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                  <img
                    src={u.avatar_url || u.avatar}
                    alt={u.display_name}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                    referrerPolicy="no-referrer"
                  />
                  {u.is_online && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white truncate hover:text-violet-400 transition">
                      {u.display_name}
                    </span>
                    {u.is_vip && (
                      <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1 py-0.5 text-[8px] font-extrabold text-amber-400 uppercase">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">@{u.username}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{u.bio || "No bio yet."}</p>
                </div>
              </div>

              {/* Action Button */}
              {!isSelf && currentUser && (
                <button
                  onClick={() => {
                    if (isUFollowing) {
                      unfollowUser(u.id);
                    } else {
                      followUser(u.id);
                    }
                  }}
                  className={`ml-3 shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-extrabold transition flex items-center gap-1 ${
                    isUFollowing
                      ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750 hover:text-white border border-zinc-700/50'
                      : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  {isUFollowing ? (
                    <>
                      <UserMinus className="h-3 w-3" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="profile-view-container">
      
      {/* Cover / Profile Card Hero */}
      <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
        
        {/* Cover photo */}
        <div className="h-44 sm:h-60 w-full relative bg-zinc-900">
          <img 
            src={profileUser.cover_photo} 
            alt="User cover photo" 
            className="w-full h-full object-cover"
          />
          {isOwnProfile && (
            <button 
              onClick={() => navigate('/profile/edit')}
              className="absolute top-4 right-4 rounded-full bg-zinc-950/70 p-2 text-zinc-300 hover:text-white transition"
              title="Change cover photo"
            >
              <Camera className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Profile Identity details container */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar positioning */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
            <div className="relative">
              <div className={`rounded-full p-1 bg-zinc-950 border-4 ${profileUser.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}>
                <img 
                  src={profileUser.avatar} 
                  alt={profileUser.display_name} 
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover"
                  id="profile-avatar-img"
                />
              </div>
              {profileUser.is_online && (
                <span className="absolute bottom-2 right-2 h-4.5 w-4.5 rounded-full bg-emerald-500 border-4 border-zinc-950" title="Online" />
              )}
            </div>

            {/* Action buttons list */}
            <div className="flex flex-wrap gap-2">
              {isOwnProfile ? (
                <button 
                  onClick={() => navigate('/profile/edit')}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-zinc-800"
                  id="profile-edit-trigger"
                >
                  <Settings className="h-4 w-4 text-zinc-400" />
                  Edit My Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      isFollowing 
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                        : 'bg-violet-600 text-white hover:bg-violet-500'
                    }`}
                  >
                    {isFollowing ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>

                  <button 
                    onClick={handleMessageUser}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:text-white transition hover:bg-zinc-800"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>

                  <button 
                    onClick={() => setShowGiftShop(!showGiftShop)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:from-amber-400 hover:to-yellow-400"
                    id="profile-gift-trigger"
                  >
                    <Gift className="h-4 w-4 text-slate-950" />
                    Send Gift
                  </button>

                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                    title="Report creator"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User names & badge line */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">{profileUser.display_name}</h2>
              {profileUser.is_vip && (
                <span className="flex items-center gap-1 rounded bg-gradient-to-r from-amber-500 to-yellow-500 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950 animate-pulse">
                  VIP LEVEL {profileUser.vip_level}
                </span>
              )}
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 font-mono font-bold">
                Lv.{profileUser.level} Member
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">@{profileUser.username}</p>
          </div>

          {/* User Bio text */}
          <p className="mt-3 text-sm text-zinc-200 leading-relaxed max-w-2xl whitespace-pre-line">
            {profileUser.bio}
          </p>

          {/* Meta country age row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-zinc-400 border-t border-zinc-900 pt-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-violet-500" />
              Country: <strong className="text-zinc-300">{profileUser.country}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              Age: <strong className="text-zinc-300">{profileUser.age} y/o</strong>
            </span>
            <span className="flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-purple-400" />
              Gender: <strong className="text-zinc-300">{profileUser.gender}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              VIP Points: <strong className="text-zinc-300">{profileUser.vip_points} XP</strong>
            </span>
          </div>

          {/* Followers counts widget */}
          <div className="flex gap-6 mt-4 text-sm bg-zinc-900/10 border border-zinc-900 rounded-xl p-3 w-max">
            <button 
              onClick={() => setActiveTab('followers')}
              className="text-left cursor-pointer hover:opacity-80 transition group"
            >
              <span className="text-zinc-400 text-xs group-hover:text-violet-400">Followers</span>
              <strong className="block text-base text-white">{followersCount.toLocaleString()}</strong>
            </button>
            <div className="w-px bg-zinc-900" />
            <button 
              onClick={() => setActiveTab('following')}
              className="text-left cursor-pointer hover:opacity-80 transition group"
            >
              <span className="text-zinc-400 text-xs group-hover:text-violet-400">Following</span>
              <strong className="block text-base text-white">{followingCount.toLocaleString()}</strong>
            </button>
            <div className="w-px bg-zinc-900" />
            <div>
              <span className="text-zinc-400 text-xs">Diamonds Earned</span>
              <strong className="block text-base text-cyan-400">{(profileUser.diamonds || 0).toLocaleString()} 💎</strong>
            </div>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE DRAWER FORM */}
      {isEditing && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 font-display">Configure ConnectX Profile Details</h3>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input 
                  type="text" 
                  value={editedDisplayName}
                  onChange={(e) => setEditedDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Age
                </label>
                <input 
                  type="number" 
                  value={editedAge}
                  onChange={(e) => setEditedAge(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-violet-500 outline-none"
                  min={18}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={editedGender}
                  onChange={(e) => setEditedGender(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-violet-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input 
                  type="text" 
                  value={editedCountry}
                  onChange={(e) => setEditedCountry(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white focus:border-violet-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Biography / Motto
              </label>
              <textarea 
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white h-24 resize-none focus:border-violet-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Avatar Preset Image URL
                </label>
                <input 
                  type="text" 
                  value={editedAvatar}
                  onChange={(e) => setEditedAvatar(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Cover Preset Photo URL
                </label>
                <input 
                  type="text" 
                  value={editedCover}
                  onChange={(e) => setEditedCover(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-white focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-zinc-900">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIRTUAL GIFT SHOP POPUP CATALOG */}
      {showGiftShop && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4" id="virtual-gift-catalog-box">
          
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-yellow-400" />
                Virtual Gifting Room
              </h3>
              <p className="text-xs text-zinc-400">
                Send virtual gifts using coins. Virtual gift value converts received gifts into Diamonds at 50% cash-out value.
              </p>
            </div>
            <button 
              onClick={() => setShowGiftShop(false)}
              className="rounded p-1 text-zinc-500 hover:text-white hover:bg-zinc-900"
            >
              Close Catalog
            </button>
          </div>

          {/* Balance info and message panels */}
          {currentUser && (
            <div className="flex justify-between items-center text-xs bg-zinc-900/60 p-2.5 rounded-xl">
              <span className="text-zinc-400">
                Your Wallet Coins balance: <strong className="text-amber-400">{currentUser.coins.toLocaleString()} Coins 🪙</strong>
              </span>
              <button 
                onClick={() => setView('wallet')}
                className="text-[10px] bg-amber-500 text-zinc-950 px-2 py-0.5 rounded font-extrabold hover:bg-amber-400"
              >
                Refill Coins
              </button>
            </div>
          )}

          {giftSuccessMsg && (
            <div className="rounded-xl bg-emerald-950/40 border border-emerald-900 p-3 text-xs text-emerald-300">
              {giftSuccessMsg}
            </div>
          )}

          {giftErrorMsg && (
            <div className="rounded-xl bg-rose-950/40 border border-rose-900 p-3 text-xs text-rose-300">
              {giftErrorMsg}
            </div>
          )}

          {/* Gifts catalogue grid layout */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {gifts.map((g) => (
              <div 
                key={g.id}
                onClick={() => handleSendGiftLocal(g.id)}
                className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-3 text-center cursor-pointer hover:border-violet-500 hover:bg-zinc-900/40 transition group"
              >
                <span className="block text-4xl mb-1.5 transform group-hover:scale-125 transition">
                  {g.icon}
                </span>
                <span className="block text-xs font-bold text-white">{g.name}</span>
                <span className="block text-[10px] text-amber-400 font-bold mt-1">
                  🪙 {g.cost_coins}
                </span>
                <span className="block text-[9px] text-zinc-500">
                  +{g.value_diamonds} Diamonds
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 font-display flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Report @{profileUser.username}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Help us keep ConnectX a positive space. Tell us what is wrong.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Reason Category
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                >
                  <option value="Spamming">Spamming / Bot activity</option>
                  <option value="Harassment">Harassment / Insulting</option>
                  <option value="Inappropriate Content">Inappropriate Content / Nudity</option>
                  <option value="Impersonation">Impersonation / Fake Profile</option>
                  <option value="Scam">Scam / Financial Fraud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Detailed Explanation
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide timestamps, post content, or details to assist ConnectX administrators."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white h-24 resize-none focus:border-violet-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-1.5"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOCIAL RELATIONSHIP TABS */}
      <div className="space-y-5">
        <div className="border-b border-zinc-900 pb-px flex gap-5 overflow-x-auto text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3.5 transition outline-none border-b-2 shrink-0 ${
              activeTab === 'posts' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent hover:text-white'
            }`}
          >
            Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-3.5 transition outline-none border-b-2 shrink-0 ${
              activeTab === 'followers' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent hover:text-white'
            }`}
          >
            Followers ({followersList.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3.5 transition outline-none border-b-2 shrink-0 ${
              activeTab === 'following' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent hover:text-white'
            }`}
          >
            Following ({followingList.length})
          </button>
          <button
            onClick={() => setActiveTab('mutual')}
            className={`pb-3.5 transition outline-none border-b-2 shrink-0 ${
              activeTab === 'mutual' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent hover:text-white'
            }`}
          >
            {profileUser.id !== currentUser?.id ? 'Mutual Friends' : 'Mutual Follows'} ({mutualFriendsList.length})
          </button>
          <button
            onClick={() => setActiveTab('suggested')}
            className={`pb-3.5 transition outline-none border-b-2 shrink-0 ${
              activeTab === 'suggested' 
                ? 'border-violet-500 text-white font-extrabold' 
                : 'border-transparent hover:text-white'
            }`}
          >
            Suggested Users
          </button>
        </div>

        <div className="pt-2">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {userPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-4 transition hover:bg-zinc-900/20"
                    >
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                      {post.media_url && post.media_type === 'image' && (
                        <img 
                          src={post.media_url} 
                          alt="Post media" 
                          className="mt-3 rounded-xl max-h-60 object-cover w-full"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="mt-4 flex gap-4 text-xs text-zinc-500">
                        <span>👍 {post.likes_count} Likes</span>
                        <span>💬 {post.comments_count} Comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-zinc-500 py-10 bg-zinc-900/10 rounded-2xl border border-zinc-900/60 border-dashed p-6">
                  This user hasn't created any posts yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'followers' && 
            renderUserGrid(
              followersList, 
              profileUser.id === currentUser?.id 
                ? "No one is following you yet. Start posting updates or follow others to get noticed!" 
                : `@${profileUser.username} doesn't have any followers yet.`
            )
          }

          {activeTab === 'following' && 
            renderUserGrid(
              followingList, 
              profileUser.id === currentUser?.id 
                ? "You aren't following anyone yet. Head to the Suggestions or Feed to find creators!" 
                : `@${profileUser.username} is not following anyone yet.`
            )
          }

          {activeTab === 'mutual' && 
            renderUserGrid(
              mutualFriendsList, 
              profileUser.id === currentUser?.id 
                ? "No mutual follows yet. Mutually follow another creator to unlock this connection!" 
                : `You don't have any common friends/followed accounts with @${profileUser.username}.`
            )
          }

          {activeTab === 'suggested' && 
            renderUserGrid(
              suggestedUsersList, 
              "No suggestions available at the moment. Check back later!"
            )
          }
        </div>
      </div>

    </div>
  );
};

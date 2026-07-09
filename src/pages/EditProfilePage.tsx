/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, MapPin, Calendar, Compass, Star, Camera, 
  Check, ArrowLeft, ShieldCheck, Sparkles, Loader2 
} from 'lucide-react';
import { motion } from 'motion/react';
import MediaUploadZone from '../components/MediaUploadZone';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, isLoading } = useApp();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(21);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Prefer not to say');
  const [country, setCountry] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync state with current user data on load
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.display_name || '');
      setBio(currentUser.bio || '');
      setAge(currentUser.age || 21);
      setGender(currentUser.gender || 'Prefer not to say');
      setCountry(currentUser.country || '');
      setAvatarUrl(currentUser.avatar_url || currentUser.avatar || '');
      setCoverUrl(currentUser.cover_url || currentUser.cover_photo || '');
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-zinc-400">Please sign in to view or configure your profile settings.</p>
          <button 
            onClick={() => navigate('/login')}
            className="rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-violet-500 transition"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      await updateProfile({
        display_name: displayName,
        bio: bio,
        age: Number(age),
        gender: gender,
        country: country,
        avatar: avatarUrl,
        avatar_url: avatarUrl,
        cover_photo: coverUrl,
        cover_url: coverUrl
      });
      setSuccessMsg('Your profile has been saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto space-y-6 px-4 py-6"
      id="edit-profile-page-root"
    >
      {/* Top action header bar */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition group"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back to Profile
        </button>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
          Database Protected
        </div>
      </div>

      {/* Hero Visual Mockup banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
        <div className="h-36 sm:h-44 w-full relative bg-zinc-900">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt="Cover Preview" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-950/20 to-zinc-950/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
        </div>
        
        {/* Profile elements mock position */}
        <div className="px-6 pb-6 pt-0 relative flex items-end gap-4 -mt-10">
          <div className="relative">
            <div className="rounded-full p-1 bg-zinc-950 border-4 border-zinc-800 shadow-lg">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar Preview" 
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                  <UserIcon className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>
          <div className="pb-1">
            <h2 className="text-base sm:text-lg font-bold font-display text-white">{displayName || 'Your Profile Name'}</h2>
            <p className="text-[10px] text-zinc-400 font-mono">@{currentUser.username}</p>
          </div>
        </div>
      </div>

      {/* Main configuration settings box */}
      <div className="border border-zinc-850 bg-zinc-950/60 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400 animate-pulse" />
              Manage Profile Settings
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure your public-facing details synced with the profiles table.</p>
          </div>
          <span className="rounded bg-violet-600/10 border border-violet-500/20 px-2 py-1 text-[10px] font-bold text-violet-400">
            VIP Level {currentUser.vip_level}
          </span>
        </div>

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 p-4 mb-6 text-xs text-emerald-400"
          >
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="font-medium">{successMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition"
                placeholder="Sofia Chen"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Age
              </label>
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition"
                min={13}
                max={120}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Gender Selection
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-violet-500 outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Country
              </label>
              <input 
                type="text" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition"
                placeholder="United States"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Biography / Motto
            </label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white h-24 resize-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none transition leading-relaxed"
              placeholder="Tell other ConnectX creators about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/20 border border-zinc-900 rounded-xl p-5">
            <MediaUploadZone
              bucket="avatars"
              currentUrl={avatarUrl}
              onUploadComplete={(newUrl) => setAvatarUrl(newUrl)}
              label="Profile Avatar"
              aspectRatioClassName="aspect-square max-w-[240px] mx-auto md:max-w-none"
            />

            <MediaUploadZone
              bucket="covers"
              currentUrl={coverUrl}
              onUploadComplete={(newUrl) => setCoverUrl(newUrl)}
              label="Cover Image"
              aspectRatioClassName="aspect-[21/9] sm:aspect-[16/7]"
            />
          </div>

          {/* Locked fields info */}
          <div className="rounded-xl bg-zinc-900/40 border border-zinc-900/60 p-4">
            <h4 className="text-xs font-bold text-zinc-300 mb-2">System Assigned Metadata</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">COINS</span>
                <strong className="text-xs text-amber-500 font-mono">{currentUser.coins.toLocaleString()} 🪙</strong>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">DIAMONDS</span>
                <strong className="text-xs text-cyan-400 font-mono">{currentUser.diamonds.toLocaleString()} 💎</strong>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">FOLLOWERS</span>
                <strong className="text-xs text-zinc-300 font-mono">{currentUser.followers_count.toLocaleString()}</strong>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                <span className="text-[10px] text-zinc-500 block">STATUS</span>
                <strong className="text-[10px] text-emerald-500 uppercase font-mono">{currentUser.is_online ? 'ONLINE' : 'OFFLINE'}</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-900">
            <button 
              type="button" 
              onClick={() => navigate('/profile')}
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-violet-500 transition shadow-lg shadow-violet-900/20 flex items-center gap-1.5"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

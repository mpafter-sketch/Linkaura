/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, Image, Mic, Check, CheckCheck, Smile, Phone, Video, MoreVertical, 
  Search, Play, Pause, AlertCircle, RefreshCw, MessageSquare, Trash2,
  X, HelpCircle, Eye, EyeOff, Film, Sparkles, Heart, Flame, Laugh, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, User } from '../types';
import { LocalDB } from '../db';

const GIF_PRESETS = [
  { name: 'Frantic Cat Coding', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3g5aGF1dG5udG1uajV1MTJsbDFpZnM2cmgxbndvZmxhZTRqNmZ6MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tIaPrcBkdX8Vq/giphy.gif', tag: 'funny' },
  { name: 'Retro Arcade Play', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDRoM3E1djg3ZXEwdmN4NXk2OW05MmlybzdzZ2I5cmV6N2VvbjN4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/t3s3G2UPETOO4/giphy.gif', tag: 'gaming' },
  { name: 'Cyberpunk Neon Ride', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Nidnp3ejRkaGJkYTFhNzhxM20wM25rcjRsc2p3aHFtazVlZnpvMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0O9z3S7GZQLbXN9C/giphy.gif', tag: 'gaming' },
  { name: 'Anime Cheers', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnJ2eTR2Zm9wd2g5MXNmdzRwZzF1cmxlYnp0NThlZndxbXUzb3lhciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2zVr6cu95nF6O4/giphy.gif', tag: 'anime' },
  { name: 'Sparkling Hearts', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3RhZnR6N2hucmQzbGszN2p0eG9pMXZocTdzNXZsczd5OHUxdnZ6ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o6Zt481isntZOX6Te/giphy.gif', tag: 'love' },
  { name: 'Neon Controller Glow', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZpcWlyMnMxamowYjlydjR1NmpzdmU5dHpqZnNlcnJ0MHN1czU4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tP21unf8vYKMZQQ/giphy.gif', tag: 'gaming' },
  { name: 'Rick Astley Dance', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXZia3o3bWhkOHdldTgwbmM0ODgxbzFmNGV6Nzh4Y3oxdDJicHZsOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ju7l5y9osyymQ/giphy.gif', tag: 'funny' },
  { name: 'Thumbs Up Pup', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzhpM2hxcThtNHNudGRrNWswYWt6NDdzNWl4dWZ5d2Q3OHVldzNydSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NXS3HBC/giphy.gif', tag: 'funny' },
  { name: 'Victory Confetti Celebration', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHA5NTh3MTd2bWMyMXM2NWZibGRqZnY4MWUwbDFreHpyZjByMzFlOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4b45b8KlgAB7iM/giphy.gif', tag: 'celebration' },
  { name: 'Cute Pokeball Catch', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmxndzBneWtlZnZ6dW14cHNpeDhmdzYzdmdtdzBnaHZrbTV1cXZ6NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u29FMcJg0pvkY/giphy.gif', tag: 'anime' },
  { name: 'Gamer Cat rage', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmZkMmRhbDB4ZnZ6bWhnbDJpcG9yNzB2NmZscW94OWM1YThtN3VmeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jS8P4ERLJrgvazOxs3/giphy.gif', tag: 'funny' },
  { name: 'Victory Trophy Spin', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hveXZydm93MXpsZnRhdmVzMW9xZnYyc3phbnBqbjR2cGo4M2NzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0ExhcV6b4YF3j0dy/giphy.gif', tag: 'celebration' }
];

const EMOJI_CATEGORIES = [
  { label: 'Smilies', emojis: ['😀', '😂', '🥰', '😎', '🤔', '🤫', '🤪', '🥳'] },
  { label: 'Gestures', emojis: ['👍', '👏', '🙌', '👋', '👊', '🤙', '🤝', '💯'] },
  { label: 'Hearts & Fun', emojis: ['💖', '❤️', '🔥', '✨', '🎉', '🌟', '💥', '🌹'] },
  { label: 'Gaming & Elite', emojis: ['🎮', '👾', '💎', '👑', '🏆', '🏎️', '🥂', '💡'] }
];

const IMAGE_PRESETS = [
  { name: 'Neon Arcade', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Retro Setup', url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600' },
  { name: 'Luxury Yacht', url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600' },
  { name: 'Kyoto Temple', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Cosplay Stream', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600' },
  { name: 'Cyberpunk Room', url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&q=80&w=600' }
];

const QUICK_REACTION_EMOJIS = ['❤️', '🔥', '😂', '😮', '😢', '👍'];

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    activeChatPartnerId, 
    setChatPartner, 
    getMessages, 
    sendMessage, 
    reactToMessage,
    getChatList,
    updateProfile,
    users 
  } = useApp();

  // Basic States
  const [inputText, setInputText] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Advanced Panel Toggles
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGIFPicker, setShowGIFPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  // Custom GIF Search & Filter
  const [gifSearch, setGifSearch] = useState('');
  const [gifTag, setGifTag] = useState('All');

  // Custom Image Picker state
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Interactive Live Voice Recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceWaves, setVoiceWaves] = useState<number[]>([30, 45, 20, 60, 80, 50, 40, 75, 90, 55, 30, 40]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceWavesIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Voice Playback controller states
  const [voicePlayingId, setVoicePlayingId] = useState<string | null>(null);
  const [voiceElapsedSeconds, setVoiceElapsedSeconds] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(8); // mock/actual duration
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hover Reaction message reference
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  // Lightbox view state
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPartner = users.find(u => u.id === activeChatPartnerId);
  const messages = activeChatPartnerId ? getMessages(activeChatPartnerId) : [];
  const chatList = getChatList();

  // Scroll to bottom on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping, showEmojiPicker, showGIFPicker, showImagePicker, isRecording]);

  // Handle Real-time message updates directly inside the component
  useEffect(() => {
    const handleLocalMsg = () => {
      setForceUpdate(prev => prev + 1);
    };
    window.addEventListener('connectx_realtime_msg', handleLocalMsg);
    return () => {
      window.removeEventListener('connectx_realtime_msg', handleLocalMsg);
    };
  }, []);

  // 1. Dynamic Real-time "Seen" Status & "Typing" indicators trigger
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender_id === currentUser?.id) {
        // Only trigger mock creators sequence
        if (activeChatPartnerId === 'user-sofia' || activeChatPartnerId === 'user-chen' || activeChatPartnerId === 'user-maya') {
          
          // A. Mark as Seen in exactly 1.0 second
          const seenTimer = setTimeout(() => {
            if (currentUser && activeChatPartnerId) {
              LocalDB.markMessagesAsRead(activeChatPartnerId, currentUser.id);
              // Dispatch event to instantly refresh UI ticks
              window.dispatchEvent(new CustomEvent('connectx_realtime_msg'));
            }
          }, 1000);

          // B. Show partner typing... status at 1.5 seconds
          const typingStartTimer = setTimeout(() => {
            setIsTyping(true);
          }, 1500);

          // C. Hide partner typing indicator when reply arrives (simulated around 2.5s)
          // Just to be safe, auto hide typing indicator after 3.8 seconds
          const typingEndTimer = setTimeout(() => {
            setIsTyping(false);
          }, 3800);

          return () => {
            clearTimeout(seenTimer);
            clearTimeout(typingStartTimer);
            clearTimeout(typingEndTimer);
          };
        }
      } else {
        // If the last message is from the partner, they are obviously not typing anymore!
        setIsTyping(false);
      }
    }
  }, [messages.length, activeChatPartnerId, currentUser]);

  // Text Send Handler
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatPartnerId) return;

    sendMessage(activeChatPartnerId, inputText.trim(), undefined, 'text');
    setInputText('');
    setShowEmojiPicker(false);
  };

  // Preset Image Send
  const handleSendImage = (url: string) => {
    if (!activeChatPartnerId) return;
    sendMessage(activeChatPartnerId, 'Sent an image attachment 📸', url, 'image');
    setShowImagePicker(false);
  };

  // Custom Image Send
  const handleSendCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrl.trim() || !activeChatPartnerId) return;
    sendMessage(activeChatPartnerId, 'Sent a custom image attachment 📸', customImageUrl.trim(), 'image');
    setCustomImageUrl('');
    setShowImagePicker(false);
  };

  // Preset GIF Send
  const handleSendGIF = (url: string) => {
    if (!activeChatPartnerId) return;
    sendMessage(activeChatPartnerId, 'Sent an animated GIF 🎬', url, 'gif');
    setShowGIFPicker(false);
  };

  // Toggle Self Status (Online / Invisible)
  const handleToggleMyStatus = () => {
    if (!currentUser) return;
    const newOnlineState = !currentUser.is_online;
    updateProfile({ is_online: newOnlineState });
  };

  // LIVE VOICE RECORDER CONTROLLER
  const handleStartRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingTime(0);
    setShowEmojiPicker(false);
    setShowGIFPicker(false);
    setShowImagePicker(false);

    // Dynamic wave bar height randomizer
    voiceWavesIntervalRef.current = setInterval(() => {
      setVoiceWaves(Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 15));
    }, 110);

    // Live clock timer
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleStopAndSendRecording = () => {
    if (!isRecording || !activeChatPartnerId) return;
    
    // Clear recorder timers
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (voiceWavesIntervalRef.current) clearInterval(voiceWavesIntervalRef.current);
    
    const finalDuration = recordingTime > 0 ? recordingTime : 4;
    const minutes = Math.floor(finalDuration / 60);
    const seconds = finalDuration % 60;
    const displayDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    sendMessage(
      activeChatPartnerId,
      `Voice Note (${displayDuration}) 🎧`,
      'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', // Standard sample sound
      'voice'
    );

    // Reset voice recorder state
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (voiceWavesIntervalRef.current) clearInterval(voiceWavesIntervalRef.current);
    setIsRecording(false);
    setRecordingTime(0);
  };

  // VOICE MESSAGE REAL-TIME PLAYBACK CONTROLLER
  const handleVoicePlayToggle = (msgId: string, durationStr: string) => {
    // Determine duration in seconds from label
    let durationSec = 8; // fallback
    const match = durationStr.match(/\((\d+):(\d+)\)/);
    if (match) {
      durationSec = parseInt(match[1]) * 60 + parseInt(match[2]);
    }

    if (voicePlayingId === msgId) {
      // Pause
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      setVoicePlayingId(null);
    } else {
      // Clear previous playback timer
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);

      setVoicePlayingId(msgId);
      setVoiceDuration(durationSec);
      setVoiceElapsedSeconds(0);

      playbackTimerRef.current = setInterval(() => {
        setVoiceElapsedSeconds(prev => {
          if (prev >= durationSec - 1) {
            // Stop playback at end
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
            setVoicePlayingId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (voiceWavesIntervalRef.current) clearInterval(voiceWavesIntervalRef.current);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Insert Emoji Character in Input field at cursor
  const handleAppendEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  // Filter GIFs by search keyword and tag category
  const filteredGIFs = GIF_PRESETS.filter(gif => {
    const matchesSearch = gif.name.toLowerCase().includes(gifSearch.toLowerCase());
    const matchesTag = gifTag === 'All' || gif.tag === gifTag;
    return matchesSearch && matchesTag;
  });

  const gifTags = ['All', 'funny', 'gaming', 'anime', 'love', 'celebration'];

  const filteredChatList = chatList.filter(c => 
    c.user.display_name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.user.username.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl relative" id="chat-view-container">
      
      {/* LEFT COLUMN: Sidebar threads */}
      <div className={`w-full border-r border-zinc-900 md:w-80 flex flex-col bg-zinc-950 flex-shrink-0 ${activeChatPartnerId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Current user status indicator & toggle */}
        {currentUser && (
          <div className="p-4 border-b border-zinc-900 bg-zinc-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.display_name} 
                  className="h-8 w-8 rounded-full object-cover border border-zinc-800"
                />
                <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-zinc-950 ${currentUser.is_online ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
              </div>
              <div className="leading-tight">
                <span className="block text-[11px] font-bold text-zinc-300">My Status</span>
                <span className="block text-[10px] text-zinc-400 font-mono">
                  {currentUser.is_online ? 'Online (Visible)' : 'Invisible (Incognito)'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleToggleMyStatus}
              className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border transition flex items-center gap-1.5 ${
                currentUser.is_online 
                  ? 'border-emerald-900/40 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' 
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Toggle incognito invisible mode"
            >
              {currentUser.is_online ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {currentUser.is_online ? 'Go Stealth' : 'Go Active'}
            </button>
          </div>
        )}

        {/* Search Header */}
        <div className="p-4 border-b border-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans">Active Threads</h3>
            <span className="text-[10px] font-mono text-violet-400 bg-violet-950/30 border border-violet-900/40 px-2 py-0.5 rounded-full">Secure</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Filter conversations..." 
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 bg-zinc-900/40 py-1.5 pl-9 pr-3 text-xs text-white outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Channels Grid List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChatList.length > 0 ? (
            filteredChatList.map((chat) => (
              <div 
                key={chat.user.id}
                onClick={() => {
                  setChatPartner(chat.user.id);
                  setIsTyping(false);
                }}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                  activeChatPartnerId === chat.user.id 
                    ? 'bg-zinc-900 border border-zinc-800' 
                    : 'hover:bg-zinc-900/40 border border-transparent'
                }`}
                id={`chat-item-${chat.user.username}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={chat.user.avatar} 
                      alt={chat.user.display_name} 
                      className={`h-10 w-10 rounded-full object-cover border ${chat.user.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}
                    />
                    {chat.user.is_online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-zinc-950" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-xs font-bold text-white leading-snug">{chat.user.display_name}</span>
                    <span className="block text-[10px] text-zinc-400 truncate mt-0.5 font-mono">
                      {chat.lastMessage.sender_id === currentUser?.id ? 'You: ' : ''}
                      {chat.lastMessage.media_type === 'image' 
                        ? '📸 [Image attachment]' 
                        : chat.lastMessage.media_type === 'gif' 
                          ? '🎬 [Animated GIF]' 
                          : chat.lastMessage.media_type === 'voice' 
                            ? '🎙️ [Voice note]' 
                            : chat.lastMessage.content
                      }
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[8px] text-zinc-500 font-mono">
                    {new Date(chat.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[9px] font-bold text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-zinc-500 font-sans">No message threads active.</p>
              <p className="text-[10px] text-zinc-600 max-w-xs mx-auto mt-2 leading-relaxed">
                Send a private message from any creator profile or post creator link to start!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Selected chat thread */}
      {chatPartner ? (
        <div className={`flex-1 flex flex-col bg-zinc-950 relative ${activeChatPartnerId ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Header Banner info */}
          <div className="h-16 px-4 border-b border-zinc-900 bg-zinc-900/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setChatPartner(null)}
                className="md:hidden rounded p-1 text-zinc-400 hover:text-white"
              >
                <ArrowBackVector />
              </button>
              <div className="relative">
                <img 
                  src={chatPartner.avatar} 
                  alt={chatPartner.display_name} 
                  className={`h-9 w-9 rounded-full object-cover border ${chatPartner.is_vip ? 'border-amber-400' : 'border-zinc-800'}`}
                />
                {chatPartner.is_online && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-zinc-950 animate-pulse" />
                )}
              </div>
              <div>
                <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                  {chatPartner.display_name}
                  {chatPartner.is_vip && <span className="text-[8px] bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-full">VIP</span>}
                </span>
                <span className="block text-[10px] text-zinc-400 font-mono">
                  {chatPartner.is_online ? 'Online now' : 'Offline / Away'}
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition" title="Start voice call (Simulated)">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition" title="Start secure stream video call (Simulated)">
                <Video className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat scrolling message pane */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-zinc-950">
            {messages.map((m) => {
              const isMe = m.sender_id === currentUser?.id;
              const isVoicePlaying = voicePlayingId === m.id;

              return (
                <div 
                  key={m.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}
                  id={`msg-bubble-${m.id}`}
                  onMouseEnter={() => setHoveredMessageId(m.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  
                  {/* Floating Micro-Reaction bar (on hover) */}
                  {hoveredMessageId === m.id && (
                    <div className={`absolute -top-7 z-10 flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.75 shadow-xl transition ${isMe ? 'right-2' : 'left-2'}`}>
                      {QUICK_REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => reactToMessage(m.id, emoji)}
                          className="hover:scale-125 active:scale-95 transition text-xs p-0.5"
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message container */}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs relative ${
                    isMe 
                      ? 'bg-violet-600 text-white rounded-br-none shadow-lg shadow-violet-950/30' 
                      : 'bg-zinc-900 text-zinc-100 rounded-bl-none border border-zinc-800/40'
                  }`}>
                    
                    {/* Render message attachments by media types */}
                    {m.media_type === 'text' && (
                      <p className="whitespace-pre-line leading-relaxed break-words font-sans">{m.content}</p>
                    )}

                    {m.media_type === 'image' && (
                      <div className="space-y-1.5 relative group/img">
                        <img 
                          src={m.media_url} 
                          alt="Shared attachment" 
                          className="rounded-lg max-h-56 object-cover w-full cursor-pointer hover:brightness-95 transition"
                          onClick={() => setLightboxUrl(m.media_url || null)}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition bg-black/60 rounded-lg p-1.5 text-white cursor-pointer" onClick={() => setLightboxUrl(m.media_url || null)}>
                          <Maximize2 className="h-3 w-3" />
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono block italic">📸 Click to expand image</span>
                      </div>
                    )}

                    {m.media_type === 'gif' && (
                      <div className="space-y-1 relative">
                        <img 
                          src={m.media_url} 
                          alt="Shared animated GIF" 
                          className="rounded-lg max-h-52 object-cover w-full border border-zinc-800 bg-zinc-950"
                        />
                        <span className="text-[8px] bg-black/60 font-bold tracking-wider uppercase text-zinc-400 px-1.5 py-0.5 rounded absolute bottom-2 right-2">GIF</span>
                      </div>
                    )}

                    {m.media_type === 'voice' && (
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <button 
                          onClick={() => handleVoicePlayToggle(m.id, m.content)}
                          className={`rounded-full p-2 flex items-center justify-center transition hover:scale-105 active:scale-95 ${
                            isMe ? 'bg-white text-violet-600' : 'bg-violet-600 text-white'
                          }`}
                        >
                          {isVoicePlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
                        </button>
                        
                        <div className="flex-1">
                          {/* Playback Progress Visualizer */}
                          <div className="flex items-end gap-0.5 h-6">
                            {[20, 40, 60, 30, 80, 50, 45, 90, 70, 35, 50, 20].map((height, i) => {
                              // Calculate if this bar should highlight based on elapsed progress
                              const totalBars = 12;
                              const barThreshold = (i / totalBars) * voiceDuration;
                              const isHighlighted = isVoicePlaying && voiceElapsedSeconds >= barThreshold;

                              return (
                                <div 
                                  key={i}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isMe 
                                      ? isHighlighted ? 'bg-amber-300 h-[85%]' : 'bg-violet-300 h-[45%]'
                                      : isHighlighted ? 'bg-violet-400 h-[85%]' : 'bg-zinc-700 h-[45%]'
                                  } ${isVoicePlaying && i % 3 === 0 ? 'animate-pulse' : ''}`}
                                  style={{ 
                                    height: `${isVoicePlaying ? height * 0.24 : height * 0.16}px` 
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Ticking voice timer display */}
                        <span className="text-[9px] font-mono opacity-80 min-w-[24px]">
                          {isVoicePlaying ? formatTime(voiceElapsedSeconds) : m.content.match(/\(([^)]+)\)/)?.[1] || '0:08'}
                        </span>
                      </div>
                    )}

                    {/* Reaction Badge row pinned on bottom corner of bubble */}
                    {m.reactions && Object.keys(m.reactions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5 justify-end">
                        {Object.entries(m.reactions).map(([emoji, rawUserIds]) => {
                          const userIds = (rawUserIds || []) as string[];
                          const hasUserReacted = currentUser && userIds.includes(currentUser.id);
                          return (
                            <div 
                              key={emoji}
                              onClick={(e) => {
                                e.stopPropagation();
                                reactToMessage(m.id, emoji);
                              }}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] cursor-pointer border transition hover:scale-105 active:scale-95 ${
                                hasUserReacted 
                                  ? 'bg-violet-950/80 border-violet-700 text-violet-200' 
                                  : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
                              }`}
                              title={`Reacted by: ${userIds.length} user(s)`}
                            >
                              <span>{emoji}</span>
                              <span className="font-bold">{userIds.length}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Meta/Timestamp with double ticks Seen Indicators */}
                    <div className="mt-1 flex items-center justify-end gap-1 opacity-70 text-[9px] font-mono select-none">
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        m.is_read ? (
                          <CheckCheck className="h-3.5 w-3.5 text-cyan-300" title="Seen (Read receipt)" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-zinc-300/80" title="Sent (Single check)" />
                        )
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

            {/* LIVE DYNAMIC PARTNER TYPING INDICATOR BUBBLE */}
            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <img 
                  src={chatPartner.avatar} 
                  alt={chatPartner.display_name} 
                  className="h-6 w-6 rounded-full object-cover border border-zinc-800"
                />
                <div className="rounded-2xl rounded-bl-none bg-zinc-900 border border-zinc-800/60 px-4 py-3 text-xs text-zinc-300 flex flex-col gap-1.5 shadow-md">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[8px] text-zinc-500 font-mono tracking-wide">{chatPartner.display_name} is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CHAT ATTACHMENTS AND INPUT ACTIONS CONTEXT CONTAINER */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex flex-col gap-2 relative z-20">
            
            {/* 1. Emoji Picker Keyboard overlay panel */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-16 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-30 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smile className="h-3.5 w-3.5 text-amber-400" /> Choose Emoji Accent
                    </span>
                    <button 
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                    {EMOJI_CATEGORIES.map((cat) => (
                      <div key={cat.label} className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 font-sans tracking-wider block">{cat.label}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleAppendEmoji(emoji)}
                              className="text-lg p-1.5 hover:bg-zinc-800 rounded-xl active:scale-95 transition"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Image Attachment Picker overlay panel */}
            <AnimatePresence>
              {showImagePicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-16 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-30 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Image className="h-3.5 w-3.5 text-violet-400" /> Share Image Attachment
                    </span>
                    <button 
                      onClick={() => setShowImagePicker(false)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Paste Custom URL Field */}
                  <form onSubmit={handleSendCustomImage} className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="Paste external image URL..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                    />
                    <button
                      type="submit"
                      disabled={!customImageUrl.trim()}
                      className="bg-violet-600 hover:bg-violet-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition"
                    >
                      Attach Link
                    </button>
                  </form>

                  {/* Quick Preset Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-sans tracking-wider block">Browse Presets</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {IMAGE_PRESETS.map((p) => (
                        <div 
                          key={p.name}
                          onClick={() => handleSendImage(p.url)}
                          className="group relative rounded-lg overflow-hidden h-14 border border-zinc-850 cursor-pointer hover:border-violet-500 transition"
                        >
                          <img src={p.url} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-300" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                            <span className="text-[8px] text-white font-bold truncate block w-full">{p.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. GIF Keyboard Drawer Panel */}
            <AnimatePresence>
              {showGIFPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-16 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-30 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Film className="h-3.5 w-3.5 text-pink-400" /> GIF Keyboard Search
                    </span>
                    <button 
                      onClick={() => setShowGIFPicker(false)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Search Input for GIFs */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Search trending GIFs..."
                        value={gifSearch}
                        onChange={(e) => setGifSearch(e.target.value)}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-950 py-1.5 pl-8 pr-3 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  {/* Filter Tags */}
                  <div className="flex flex-wrap gap-1">
                    {gifTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setGifTag(tag)}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase transition ${
                          gifTag === tag 
                            ? 'bg-pink-600 text-white' 
                            : 'bg-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* GIF Grid List */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                    {filteredGIFs.map((gif) => (
                      <div 
                        key={gif.name}
                        onClick={() => handleSendGIF(gif.url)}
                        className="h-20 rounded-lg overflow-hidden border border-zinc-800 bg-black relative group cursor-pointer hover:border-pink-500 transition"
                      >
                        <img 
                          src={gif.url} 
                          alt={gif.name} 
                          className="h-full w-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition duration-300" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-1">
                          <span className="text-[8px] text-zinc-300 block truncate">{gif.name}</span>
                        </div>
                      </div>
                    ))}
                    {filteredGIFs.length === 0 && (
                      <div className="col-span-4 text-center py-4 text-[10px] text-zinc-500">
                        No GIFs matching filter criteria. Try other categories!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LIVE VOICE RECORDER CONTROLLER PANEL (PULSATING MIC DESIGN) */}
            {isRecording ? (
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 animate-pulse shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-60" />
                    <div className="h-3 w-3 rounded-full bg-rose-600 relative z-10" />
                  </div>
                  <div className="leading-none">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide">Recording Voice Memo</span>
                    <span className="block text-xs font-bold font-mono text-rose-400 mt-0.5">Elapsed: {formatTime(recordingTime)}</span>
                  </div>
                </div>

                {/* Animated real-time voice level wave bars */}
                <div className="flex items-center gap-0.5 h-6 mx-3">
                  {voiceWaves.map((h, i) => (
                    <div 
                      key={i}
                      className="w-0.75 bg-rose-500 rounded-full transition-all duration-100"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={handleCancelRecording}
                    className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-[10px] font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleStopAndSendRecording}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" /> Send Memo
                  </button>
                </div>
              </div>
            ) : (
              
              /* STANDARD INPUT ACTION FIELDS */
              <form onSubmit={handleSendText} className="flex items-center gap-1.5">
                
                {/* Image panel button */}
                <button 
                  type="button"
                  onClick={() => {
                    setShowImagePicker(!showImagePicker);
                    setShowEmojiPicker(false);
                    setShowGIFPicker(false);
                  }}
                  className={`rounded-xl p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition flex-shrink-0 ${showImagePicker ? 'text-violet-400 bg-zinc-900' : ''}`}
                  title="Attach image presets or URL"
                  id="chat-send-photo"
                >
                  <Image className="h-4.5 w-4.5" />
                </button>

                {/* GIF keyboard button */}
                <button 
                  type="button"
                  onClick={() => {
                    setShowGIFPicker(!showGIFPicker);
                    setShowEmojiPicker(false);
                    setShowImagePicker(false);
                  }}
                  className={`rounded-xl p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition flex-shrink-0 ${showGIFPicker ? 'text-pink-400 bg-zinc-900' : ''}`}
                  title="Open animated GIF keyboard"
                  id="chat-send-gif-btn"
                >
                  <Film className="h-4.5 w-4.5" />
                </button>

                {/* Voice recording button */}
                <button 
                  type="button"
                  onClick={handleStartRecording}
                  className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition flex-shrink-0"
                  title="Start live voice recorder memo"
                  id="chat-send-voice"
                >
                  <Mic className="h-4.5 w-4.5" />
                </button>

                {/* Emoji popover button */}
                <button 
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowGIFPicker(false);
                    setShowImagePicker(false);
                  }}
                  className={`rounded-xl p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white transition flex-shrink-0 ${showEmojiPicker ? 'text-amber-400 bg-zinc-900' : ''}`}
                  title="Add Emojis"
                >
                  <Smile className="h-4.5 w-4.5" />
                </button>

                {/* Text Field Input */}
                <input 
                  type="text" 
                  placeholder={`Send secure direct message to @${chatPartner.username}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500 focus:bg-zinc-900 font-sans transition"
                  id="chat-input-field"
                  onFocus={() => {
                    setShowEmojiPicker(false);
                    setShowGIFPicker(false);
                    setShowImagePicker(false);
                  }}
                />

                {/* Send Button */}
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="rounded-xl bg-violet-600 p-2.5 text-white shadow-md hover:bg-violet-500 transition disabled:opacity-40 flex-shrink-0"
                  id="chat-submit-btn"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* EMPTY STATE: Select a Thread */
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-zinc-950 text-zinc-500">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <MessageSquare className="h-14 w-14 text-zinc-800 mb-4 stroke-1 animate-pulse" />
            <h3 className="text-sm font-bold text-zinc-300 tracking-wide uppercase font-sans">Secure Message Core</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-2 leading-relaxed">
              Connect with fellow creators via real-time private threads. Choose an active thread from the sidebar log or search for friends.
            </p>
          </motion.div>
        </div>
      )}

      {/* LIGHTBOX MODAL: FULLSIZE IMAGE VIEWING */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxUrl(null)}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-zinc-300 p-2 bg-zinc-900/60 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightboxUrl} 
              alt="Expanded preview" 
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 text-center">
              <p className="text-[10px] text-zinc-400 font-mono tracking-wide uppercase">ConnectX Secure Media Attachment Viewer</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Simple back vector for compatibility
const ArrowBackVector = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

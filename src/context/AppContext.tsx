/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Post, Comment, Message, Gift, GiftTransaction, 
  Notification, Report, CoinPackage, VIPPackage, RankingEntry, 
  WalletTransaction, RankingPeriod, RankingType 
} from '../types';
import { LocalDB } from '../db';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export type AppView = 'feed' | 'profile' | 'chat' | 'wallet' | 'rankings' | 'vip' | 'admin';
export type AuthView = 'login' | 'signup' | 'forgot' | 'verification';

interface AppContextType {
  currentUser: User | null;
  isLoading: boolean;
  users: User[];
  posts: Post[];
  notifications: Notification[];
  reports: Report[];
  gifts: Gift[];
  coinPackages: CoinPackage[];
  vipPackages: VIPPackage[];
  walletTransactions: WalletTransaction[];
  currentView: AppView;
  authView: AuthView;
  profileUserId: string | null;
  activeChatPartnerId: string | null;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  
  // View managers
  setView: (view: AppView, profileId?: string | null) => void;
  setAuthView: (view: AuthView) => void;
  setChatPartner: (partnerId: string | null) => void;

  // Authentication
  handleLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  handleSignup: (username: string, display: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  handleLogout: () => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleVerifyEmail: (code: string) => boolean;

  // Actions
  createPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', mediaUrls?: string[]) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  addComment: (postId: string, content: string) => Comment;
  getComments: (postId: string) => Comment[];
  
  // Chat
  sendMessage: (receiverId: string, content: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'voice' | 'gif') => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  getMessages: (partnerId: string) => Message[];
  markMessagesAsRead: (partnerId: string) => void;
  getChatList: () => { user: User; lastMessage: Message; unreadCount: number }[];

  // Wallet and Shop
  buyCoins: (packageId: string) => void;
  buyVIP: (vipPkgId: string) => boolean;
  claimDailyReward: () => { success: boolean; coinsGranted: number; error?: string };
  sendGift: (receiverId: string, giftId: string) => { success: boolean; error?: string };
  convertDiamonds: (amount: number) => { success: boolean; coinsGranted: number; error?: string };

  // Profiles
  follows: { follower_id: string; following_id: string }[];
  followUser: (targetId: string) => void;
  unfollowUser: (targetId: string) => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // Rankings
  getRankings: (period: RankingPeriod, type: RankingType) => RankingEntry[];

  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notifId: string) => void;

  // Reports
  createReport: (reportedUserId: string, reason: string, details: string) => void;
  resolveReport: (reportId: string) => void;

  // Admin Configs
  adminDeleteUser: (userId: string) => void;
  adminAddGift: (gift: Gift) => void;
  adminDeleteGift: (giftId: string) => void;
  adminAddCoinPackage: (pkg: CoinPackage) => void;
  adminDeleteCoinPackage: (pkgId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  // Application general state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [supabaseFollows, setSupabaseFollows] = useState<{ follower_id: string; following_id: string }[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [vipPackages, setVIPPackages] = useState<VIPPackage[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  // Navigation state
  const [currentView, setViewState] = useState<AppView>('feed');
  const [authView, setAuthViewState] = useState<AuthView>('login');
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(null);

  // Load initial dataset
  const refreshData = () => {
    LocalDB.init();
    
    // Seed users locally first
    let localUsers = LocalDB.getUsers();
    
    // If we have a logged-in Supabase user, ensure they are in the local list for consistency
    if (currentUser) {
      const exists = localUsers.some(u => u.id === currentUser.id);
      if (!exists) {
        localUsers.push(currentUser);
        localStorage.setItem(`connectx_users`, JSON.stringify(localUsers));
      } else {
        // Sync local details with active Supabase details
        localUsers = localUsers.map(u => u.id === currentUser.id ? currentUser : u);
        localStorage.setItem(`connectx_users`, JSON.stringify(localUsers));
      }
    }

    setUsers(localUsers);
    setPosts(LocalDB.getPosts());
    setGifts(LocalDB.getGifts());
    setCoinPackages(LocalDB.getCoinPackages());
    setVIPPackages(LocalDB.getVIPPackages());
    
    if (currentUser) {
      setNotifications(LocalDB.getNotifications(currentUser.id));
      setWalletTransactions(LocalDB.getTransactions(currentUser.id));
      setReports(LocalDB.getReports());
    } else {
      setNotifications([]);
      setWalletTransactions([]);
      setReports([]);
    }
  };

  // Database Mappers for Supabase Profiles table
  const mapUserToDB = (user: User) => {
    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      bio: user.bio,
      avatar_url: user.avatar_url || user.avatar,
      cover_url: user.cover_url || user.cover_photo,
      gender: user.gender,
      country: user.country,
      age: Number(user.age),
      vip_level: user.vip_level,
      coins: user.coins,
      diamonds: user.diamonds,
      followers_count: user.followers_count,
      following_count: user.following_count,
      is_online: user.is_online
    };
  };

  const mapDBToUser = (data: any): User => {
    return {
      id: data.id,
      username: data.username,
      display_name: data.display_name || 'Explorer',
      bio: data.bio || 'New user on ConnectX! Say hello! 👋✨',
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      avatar: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      cover_url: data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      cover_photo: data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      gender: data.gender || 'Prefer not to say',
      country: data.country || 'Global Space',
      age: data.age || 21,
      is_online: data.is_online || false,
      vip_level: data.vip_level || 0,
      level: data.vip_level ? Math.max(1, data.vip_level) : 1,
      is_vip: (data.vip_level && data.vip_level > 0) ? true : false,
      followers_count: data.followers_count || 0,
      following_count: data.following_count || 0,
      coins: data.coins || 0,
      diamonds: data.diamonds || 0,
      vip_points: 0,
      role: 'user',
      created_at: data.created_at || new Date().toISOString()
    };
  };

  // Sync state to Supabase helpers
  const syncToSupabase = async (updatedUser: User) => {
    try {
      await supabase
        .from('profiles')
        .upsert(mapUserToDB(updatedUser));
    } catch (err) {
      console.error('Failed to sync profile to Supabase:', err);
    }
  };

  // 1. Listen to Supabase Authentication State Changes
  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !data) {
          // If no profile found in Supabase table (either because trigger hasn't fired or was omitted), create default
          const defaultProfile: User = {
            id: userId,
            username: 'user_' + userId.slice(0, 5),
            display_name: 'Explorer_' + userId.slice(0, 5),
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            cover_photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
            cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
            bio: 'New user on ConnectX! Say hello! 👋✨',
            gender: 'Prefer not to say',
            country: 'Global Space',
            age: 21,
            is_online: true,
            level: 1,
            is_vip: false,
            vip_level: 0,
            followers_count: 0,
            following_count: 0,
            coins: 1000,
            diamonds: 0,
            vip_points: 0,
            role: 'user',
            created_at: new Date().toISOString()
          };

          const { data: newProfile } = await supabase
            .from('profiles')
            .insert(mapUserToDB(defaultProfile))
            .select()
            .single();

          return newProfile ? mapDBToUser(newProfile) : defaultProfile;
        }

        return mapDBToUser(data);
      } catch (err) {
        console.error('Error in profile setup:', err);
        return null;
      }
    };

    const setupAuthListener = async () => {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem('connectx_current_user_id', profile.id);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('connectx_current_user_id');
      }
      setIsLoading(false);
    };

    setupAuthListener();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          localStorage.setItem('connectx_current_user_id', profile.id);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('connectx_current_user_id');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update effect to refresh state when currentUser state changes
  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Load real follows and profiles from Supabase
  const fetchSupabaseFollows = async () => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('*');
      if (data) {
        setSupabaseFollows(data);
      }
    } catch (err) {
      console.error('Error fetching follows from Supabase:', err);
    }
  };

  const fetchSupabaseProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (data && data.length > 0) {
        const dbUsers = data.map(mapDBToUser);
        
        // Merge with local users to ensure all mock users still exist,
        // but any users already defined in Supabase overwrite the mock state
        const localUsers = LocalDB.getUsers();
        const mergedUsers = [...localUsers];
        
        dbUsers.forEach(dbU => {
          const idx = mergedUsers.findIndex(u => u.id === dbU.id);
          if (idx !== -1) {
            mergedUsers[idx] = { ...mergedUsers[idx], ...dbU };
          } else {
            mergedUsers.push(dbU);
          }
        });
        
        setUsers(mergedUsers);
      }
    } catch (err) {
      console.error('Error fetching profiles from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchSupabaseFollows();
    fetchSupabaseProfiles();
  }, [currentUser]);

  // Listen to background real-time messages simulated from other creators
  useEffect(() => {
    const handleRealtimeMsg = (e: Event) => {
      const customEvent = e as CustomEvent<Message>;
      const newMsg = customEvent.detail;
      
      // If we are currently talking to this partner, mark message read automatically
      if (currentUser && activeChatPartnerId === newMsg.sender_id) {
        LocalDB.markMessagesAsRead(currentUser.id, newMsg.sender_id);
      }
      
      refreshData();
    };

    window.addEventListener('connectx_realtime_msg', handleRealtimeMsg);
    return () => {
      window.removeEventListener('connectx_realtime_msg', handleRealtimeMsg);
    };
  }, [currentUser, activeChatPartnerId]);

  // Derived metrics
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;
  
  const getChatList = () => {
    if (!currentUser) return [];
    return LocalDB.getChatList(currentUser.id);
  };

  const unreadMessagesCount = getChatList().reduce((sum, chat) => sum + chat.unreadCount, 0);

  // VIEW NAVIGATION
  const setView = (view: AppView, profileId: string | null = null) => {
    setViewState(view);
    if (view === 'profile') {
      setProfileUserId(profileId || (currentUser ? currentUser.id : null));
      navigate(profileId ? `/profile/${profileId}` : '/profile');
    } else {
      setProfileUserId(null);
      if (view === 'feed') navigate('/');
      else navigate(`/${view}`);
    }
  };

  const setAuthView = (view: AuthView) => {
    setAuthViewState(view);
  };

  const setChatPartner = (partnerId: string | null) => {
    setActiveChatPartnerId(partnerId);
    if (currentUser && partnerId) {
      LocalDB.markMessagesAsRead(currentUser.id, partnerId);
      refreshData();
    }
  };

  // REAL SUPABASE AUTHENTICATION
  const handleLogin = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const handleSignup = async (username: string, display: string, email: string, pass: string) => {
    // 1. Sign up user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          username: username.toLowerCase().replace(/\s+/g, ''),
          display_name: display,
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // 2. Proactively create/upsert the profile row immediately to guarantee profile exists
      const newProfile: User = {
        id: data.user.id,
        username: username.toLowerCase().replace(/\s+/g, ''),
        display_name: display,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        cover_photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        bio: 'New user on ConnectX! Say hello! 👋✨',
        gender: 'Prefer not to say',
        country: 'Global Space',
        age: 21,
        is_online: true,
        level: 1,
        is_vip: false,
        vip_level: 0,
        followers_count: 0,
        following_count: 0,
        coins: 0, // default 0 coins!
        diamonds: 0, // default 0 diamonds!
        vip_points: 0,
        role: 'user',
        created_at: new Date().toISOString()
      };

      await supabase.from('profiles').upsert(mapUserToDB(newProfile));
      setCurrentUser(newProfile);
    }

    return { success: true };
  };

  const handleLogout = async () => {
    if (currentUser) {
      await supabase.from('profiles').update({ is_online: false }).eq('id', currentUser.id);
    }
    await supabase.auth.signOut();
    setCurrentUser(null);
    setViewState('feed');
    navigate('/login');
  };

  const handleForgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  const handleVerifyEmail = (code: string) => {
    if (currentUser) {
      const updated = { ...currentUser, level: Math.max(currentUser.level, 2) };
      setCurrentUser(updated);
      syncToSupabase(updated);
      refreshData();
    }
    return true;
  };

  // CORE ACTIONS
  const createPost = (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', mediaUrls?: string[]) => {
    if (!currentUser) return;
    LocalDB.createPost(currentUser.id, content, mediaUrl, mediaType, mediaUrls);
    
    // Exp points update
    const newPoints = currentUser.vip_points + 15;
    const calculatedLevel = 1 + Math.floor(newPoints / 100);
    const updated = {
      ...currentUser,
      vip_points: newPoints,
      level: Math.min(100, Math.max(currentUser.level, calculatedLevel))
    };
    setCurrentUser(updated);
    syncToSupabase(updated);
    refreshData();
  };

  const deletePost = (postId: string) => {
    LocalDB.deletePost(postId);
    refreshData();
  };

  const likePost = (postId: string) => {
    if (!currentUser) return;
    LocalDB.likePost(currentUser.id, postId);
    refreshData();
  };

  const savePost = (postId: string) => {
    if (!currentUser) return;
    LocalDB.savePost(currentUser.id, postId);
    refreshData();
  };

  const sharePost = (postId: string) => {
    LocalDB.sharePost(postId);
    refreshData();
  };

  const addComment = (postId: string, content: string): Comment => {
    if (!currentUser) throw new Error('Not logged in');
    const comment = LocalDB.addComment(currentUser.id, postId, content);
    
    // Exp points update
    const newPoints = currentUser.vip_points + 8;
    const calculatedLevel = 1 + Math.floor(newPoints / 100);
    const updated = {
      ...currentUser,
      vip_points: newPoints,
      level: Math.min(100, Math.max(currentUser.level, calculatedLevel))
    };
    setCurrentUser(updated);
    syncToSupabase(updated);
    refreshData();
    return comment;
  };

  const getComments = (postId: string): Comment[] => {
    return LocalDB.getComments(postId);
  };

  // CHAT INTERFACES
  const sendMessage = (receiverId: string, content: string, mediaUrl?: string, mediaType: 'text' | 'image' | 'voice' | 'gif' = 'text') => {
    if (!currentUser) return;
    LocalDB.sendMessage(currentUser.id, receiverId, content, mediaUrl, mediaType);
    refreshData();
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    LocalDB.reactToMessage(messageId, currentUser.id, emoji);
    refreshData();
  };

  const getMessages = (partnerId: string): Message[] => {
    if (!currentUser) return [];
    return LocalDB.getMessages(currentUser.id, partnerId);
  };

  const markMessagesAsRead = (partnerId: string) => {
    if (!currentUser) return;
    LocalDB.markMessagesAsRead(currentUser.id, partnerId);
    refreshData();
  };

  // WALLET & VIRTUAL SHOP
  const buyCoins = (packageId: string) => {
    if (!currentUser) return;
    const res = LocalDB.buyCoins(currentUser.id, packageId);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      syncToSupabase(res.user);
    }
    refreshData();
  };

  const buyVIP = (vipPkgId: string): boolean => {
    if (!currentUser) return false;
    const res = LocalDB.buyVIP(currentUser.id, vipPkgId);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      syncToSupabase(res.user);
    }
    refreshData();
    return res.success;
  };

  const claimDailyReward = () => {
    if (!currentUser) throw new Error('Not authenticated');
    const res = LocalDB.claimDailyReward(currentUser.id);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      syncToSupabase(res.user);
    }
    refreshData();
    return { success: res.success, coinsGranted: res.coinsGranted, error: res.error };
  };

  const sendGift = (receiverId: string, giftId: string) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    const res = LocalDB.sendGift(currentUser.id, receiverId, giftId);
    if (res.success && res.sender) {
      setCurrentUser(res.sender);
      syncToSupabase(res.sender);
      
      // If receiver is a seeded user, also sync them
      if (res.receiver) {
        syncToSupabase(res.receiver);
      }
    }
    refreshData();
    return { success: res.success, error: res.error };
  };

  const convertDiamonds = (amount: number) => {
    if (!currentUser) return { success: false, coinsGranted: 0, error: 'Not authenticated' };
    const res = LocalDB.convertDiamonds(currentUser.id, amount);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      syncToSupabase(res.user);
    }
    refreshData();
    return { success: res.success, coinsGranted: res.coinsGranted, error: res.error };
  };

  // PROFILES
  const followUser = async (targetId: string) => {
    if (!currentUser) return;
    try {
      // 1. Update Supabase Database
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: targetId
        });

      if (error) {
        console.error('Error following user in Supabase:', error);
      }

      // 2. Also keep local storage DB consistent (allows offline/fallback capabilities)
      LocalDB.followUser(currentUser.id, targetId);

      // 3. Refresh live datasets
      await fetchSupabaseFollows();
      await fetchSupabaseProfiles();

      // Refresh current user statistics
      const { data: updatedMe } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      if (updatedMe) {
        setCurrentUser(mapDBToUser(updatedMe));
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
    refreshData();
  };

  const unfollowUser = async (targetId: string) => {
    if (!currentUser) return;
    try {
      // 1. Delete relationship in Supabase Database
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser.id)
        .eq('following_id', targetId);

      if (error) {
        console.error('Error unfollowing user in Supabase:', error);
      }

      // 2. Keep local DB in sync
      LocalDB.unfollowUser(currentUser.id, targetId);

      // 3. Refresh live datasets
      await fetchSupabaseFollows();
      await fetchSupabaseProfiles();

      // Refresh current user statistics
      const { data: updatedMe } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      if (updatedMe) {
        setCurrentUser(mapDBToUser(updatedMe));
      }
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
    refreshData();
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates } as User;
    setCurrentUser(updated);
    
    // Save to local storage DB
    LocalDB.updateProfile(currentUser.id, updates);
    
    // Save to Supabase
    await syncToSupabase(updated);
    refreshData();
  };

  // RANKINGS
  const getRankings = (period: RankingPeriod, type: RankingType): RankingEntry[] => {
    return LocalDB.getRankings(period, type);
  };

  // NOTIFICATIONS
  const fetchSupabaseNotifications = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) {
        const mappedNotifs: Notification[] = data.map((d: any) => ({
          id: d.id,
          user_id: d.user_id,
          type: d.type as any,
          sender_id: d.sender_id || 'system',
          sender_name: d.sender_name || 'ConnectX System',
          sender_avatar: d.sender_avatar || '',
          message: d.message,
          is_read: d.is_read,
          action_url: d.action_url || '',
          created_at: d.created_at
        }));
        
        // Merge with local ones to avoid missing simulated ones
        const localNotifs = LocalDB.getNotifications(userId);
        const merged = [...mappedNotifs];
        localNotifs.forEach(ln => {
          if (!merged.some(mn => mn.id === ln.id)) {
            merged.push(ln);
          }
        });
        setNotifications(merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    } catch (err) {
      console.error('Error fetching notifications from Supabase:', err);
    }
  };

  // 1. Listen to Local notification creations and push to Supabase
  useEffect(() => {
    const handleNewNotif = async (e: Event) => {
      const customEvent = e as CustomEvent<Notification>;
      const newNotif = customEvent.detail;
      
      // If Supabase is configured and the notification target matches, write it to Supabase
      if (isSupabaseConfigured && currentUser && newNotif.user_id === currentUser.id) {
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: newNotif.user_id,
              type: newNotif.type,
              sender_id: newNotif.sender_id === 'system' ? null : newNotif.sender_id,
              sender_name: newNotif.sender_name,
              sender_avatar: newNotif.sender_avatar,
              message: newNotif.message,
              action_url: newNotif.action_url,
              is_read: newNotif.is_read
            });
        } catch (err) {
          console.error('Error uploading notification to Supabase:', err);
        }
      }
      refreshData();
    };

    window.addEventListener('connectx_new_notification', handleNewNotif);
    return () => {
      window.removeEventListener('connectx_new_notification', handleNewNotif);
    };
  }, [currentUser]);

  // 2. Realtime subscription to Supabase notifications table
  useEffect(() => {
    if (!currentUser || !isSupabaseConfigured) return;

    fetchSupabaseNotifications(currentUser.id);

    const channel = supabase
      .channel(`user-notifications-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Realtime notification change:', payload);
          if (payload.eventType === 'INSERT') {
            const newNotif = payload.new as any;
            // Only add if not already present in state
            setNotifications(prev => {
              if (prev.some(n => n.id === newNotif.id)) return prev;
              const mapped: Notification = {
                id: newNotif.id,
                user_id: newNotif.user_id,
                type: newNotif.type,
                sender_id: newNotif.sender_id || 'system',
                sender_name: newNotif.sender_name || 'System',
                sender_avatar: newNotif.sender_avatar || '',
                message: newNotif.message,
                is_read: newNotif.is_read,
                action_url: newNotif.action_url || '',
                created_at: newNotif.created_at
              };
              return [mapped, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            setNotifications(prev => prev.map(n => n.id === updated.id ? {
              ...n,
              is_read: updated.is_read
            } : n));
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as any;
            setNotifications(prev => prev.filter(n => n.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const markNotificationRead = async (notifId: string) => {
    LocalDB.markNotificationAsRead(notifId);
    if (isSupabaseConfigured && currentUser) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notifId);
      } catch (err) {
        console.error('Error marking notification read in Supabase:', err);
      }
    }
    refreshData();
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    LocalDB.markAllNotificationsAsRead(currentUser.id);
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', currentUser.id);
      } catch (err) {
        console.error('Error marking all notifications read in Supabase:', err);
      }
    }
    refreshData();
  };

  const deleteNotification = async (notifId: string) => {
    if (!currentUser) return;
    LocalDB.deleteNotification(notifId);
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', notifId);
      } catch (err) {
        console.error('Error deleting notification in Supabase:', err);
      }
    }
    refreshData();
  };

  // REPORT SYSTEM
  const createReport = (reportedUserId: string, reason: string, details: string) => {
    if (!currentUser) return;
    LocalDB.createReport(currentUser.id, reportedUserId, reason, details);
    refreshData();
  };

  const resolveReport = (reportId: string) => {
    LocalDB.updateReportStatus(reportId, 'resolved');
    refreshData();
  };

  // ADMIN OPERATIONS
  const adminDeleteUser = (userId: string) => {
    LocalDB.deleteUser(userId);
    refreshData();
  };

  const adminAddGift = (gift: Gift) => {
    LocalDB.addGift(gift);
    refreshData();
  };

  const adminDeleteGift = (giftId: string) => {
    LocalDB.deleteGift(giftId);
    refreshData();
  };

  const adminAddCoinPackage = (pkg: CoinPackage) => {
    LocalDB.addCoinPackage(pkg);
    refreshData();
  };

  const adminDeleteCoinPackage = (pkgId: string) => {
    LocalDB.deleteCoinPackage(pkgId);
    refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoading,
        users,
        posts,
        notifications,
        reports,
        gifts,
        coinPackages,
        vipPackages,
        walletTransactions,
        currentView,
        authView,
        profileUserId,
        activeChatPartnerId,
        unreadNotificationsCount,
        unreadMessagesCount,
        setView,
        setAuthView,
        setChatPartner,
        handleLogin,
        handleSignup,
        handleLogout,
        handleForgotPassword,
        handleVerifyEmail,
        createPost,
        deletePost,
        likePost,
        savePost,
        sharePost,
        addComment,
        getComments,
        sendMessage,
        reactToMessage,
        getMessages,
        markMessagesAsRead,
        getChatList,
        buyCoins,
        buyVIP,
        claimDailyReward,
        sendGift,
        convertDiamonds,
        follows: supabaseFollows,
        followUser,
        unfollowUser,
        updateProfile,
        getRankings,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        createReport,
        resolveReport,
        adminDeleteUser,
        adminAddGift,
        adminDeleteGift,
        adminAddCoinPackage,
        adminDeleteCoinPackage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

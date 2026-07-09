/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, Post, Comment, Message, Gift, GiftTransaction, 
  Notification, Report, CoinPackage, VIPPackage, RankingEntry, 
  WalletTransaction, RankingPeriod, RankingType 
} from './types';

// Seeding standard assets with gorgeous Unsplash images
const SEED_USERS: User[] = [
  {
    id: 'user-current',
    username: 'alex_connect',
    display_name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    cover_photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    bio: 'UI designer and social builder. Exploring the metaverse of ConnectX! 🌐🎨🚀',
    gender: 'Male',
    country: 'United States',
    age: 26,
    is_online: true,
    level: 18,
    is_vip: true,
    vip_level: 3,
    followers_count: 1240,
    following_count: 482,
    coins: 2450,
    diamonds: 420,
    vip_points: 380,
    role: 'user',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-sofia',
    username: 'sofia_rossi',
    display_name: 'Sofia Rossi 👑',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    cover_photo: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000',
    bio: 'Live streamer and model. Daily live chats at 8 PM! 💎 Gifting gets you premium shoutouts! ✨🍒',
    gender: 'Female',
    country: 'Italy',
    age: 24,
    is_online: true,
    level: 45,
    is_vip: true,
    vip_level: 6,
    followers_count: 89400,
    following_count: 120,
    coins: 12000,
    diamonds: 24800,
    vip_points: 2400,
    role: 'user',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-chen',
    username: 'wealth_chen',
    display_name: 'Lord Chen 🦁',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    cover_photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    bio: 'Investor and art collector. Gifting top creators of ConnectX. Talk is cheap, show me the luxury gifts. 💰🥂🔥',
    gender: 'Male',
    country: 'Singapore',
    age: 32,
    is_online: true,
    level: 58,
    is_vip: true,
    vip_level: 8,
    followers_count: 5200,
    following_count: 85,
    coins: 245000,
    diamonds: 1450,
    vip_points: 24500,
    role: 'user',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-maya',
    username: 'maya_cosplay',
    display_name: 'Maya Chan 🌸',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    cover_photo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000',
    bio: 'Anime enthusiast and professional cosplayer. Japan travel diaries! ⛩️🍡 Stream host.',
    gender: 'Female',
    country: 'Japan',
    age: 21,
    is_online: false,
    level: 24,
    is_vip: true,
    vip_level: 2,
    followers_count: 14800,
    following_count: 321,
    coins: 820,
    diamonds: 4120,
    vip_points: 120,
    role: 'user',
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-admin',
    username: 'connectx_admin',
    display_name: 'ConnectX Admin 🛡️',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    cover_photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    bio: 'Official Admin account of ConnectX. Please report spam, abuse, or bugs. We keep our community positive! 🛡️🤝',
    gender: 'Other',
    country: 'Switzerland',
    age: 30,
    is_online: true,
    level: 99,
    is_vip: true,
    vip_level: 10,
    followers_count: 154000,
    following_count: 5,
    coins: 999999,
    diamonds: 999999,
    vip_points: 99999,
    role: 'admin',
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_GIFTS: Gift[] = [
  { id: 'gift-rose', name: 'Rose', icon: '🌹', cost_coins: 10, value_diamonds: 5, category: 'Popular' },
  { id: 'gift-heart', name: 'Heart', icon: '💖', cost_coins: 50, value_diamonds: 25, category: 'Popular' },
  { id: 'gift-icecream', name: 'Ice Cream', icon: '🍦', cost_coins: 100, value_diamonds: 50, category: 'Popular' },
  { id: 'gift-beer', name: 'Cheers Beer', icon: '🍺', cost_coins: 200, value_diamonds: 100, category: 'Special' },
  { id: 'gift-perfume', name: 'Luxury Perfume', icon: '🧪', cost_coins: 500, value_diamonds: 250, category: 'Special' },
  { id: 'gift-diamond', name: 'Big Diamond', icon: '💎', cost_coins: 1000, value_diamonds: 500, category: 'Luxury' },
  { id: 'gift-supercar', name: 'Supercar', icon: '🏎️', cost_coins: 5000, value_diamonds: 2500, category: 'Luxury' },
  { id: 'gift-yacht', name: 'Ocean Yacht', icon: '🛳️', cost_coins: 10000, value_diamonds: 5000, category: 'Luxury' },
  { id: 'gift-castle', name: 'VIP Castle', icon: '🏰', cost_coins: 20000, value_diamonds: 10000, category: 'VIP' },
  { id: 'gift-rocket', name: 'Space Rocket', icon: '🚀', cost_coins: 50000, value_diamonds: 25000, category: 'VIP' }
];

const SEED_COIN_PACKAGES: CoinPackage[] = [
  { id: 'pkg-1', coins: 100, cost_usd: 0.99, original_cost_usd: 1.20, badge: 'Starter' },
  { id: 'pkg-2', coins: 550, cost_usd: 4.99, original_cost_usd: 6.00, popular: false, badge: 'Value' },
  { id: 'pkg-3', coins: 1200, cost_usd: 9.99, original_cost_usd: 13.00, popular: true, badge: 'Popular' },
  { id: 'pkg-4', coins: 2500, cost_usd: 19.99, original_cost_usd: 27.00, badge: 'Pro' },
  { id: 'pkg-5', coins: 6500, cost_usd: 49.99, original_cost_usd: 70.00, badge: 'VIP Choice' },
  { id: 'pkg-6', coins: 14000, cost_usd: 99.99, original_cost_usd: 150.00, badge: 'Whale Deal' }
];

const SEED_VIP_PACKAGES: VIPPackage[] = [
  { id: 'vip-p1', level: 1, name: 'VIP Bronze', badge: '🥉', frame_color: 'border-amber-600 shadow-amber-600/50', cost_coins_per_month: 200, benefits: ['Bronze profile badge', 'Bronze animated avatar frame', 'Extra 10% daily coin reward', 'Access to VIP chat rooms'] },
  { id: 'vip-p2', level: 3, name: 'VIP Silver', badge: '🥈', frame_color: 'border-slate-300 shadow-slate-300/50', cost_coins_per_month: 800, benefits: ['Silver profile badge', 'Silver animated avatar frame', 'Extra 25% daily coin reward', 'Priority reports handling', 'Exclusive Silver entry entrance animation'] },
  { id: 'vip-p3', level: 5, name: 'VIP Gold', badge: '👑', frame_color: 'border-yellow-400 shadow-yellow-400/50', cost_coins_per_month: 2000, benefits: ['Gold crown profile badge', 'Neon Gold avatar frame', 'Extra 50% daily coin reward', 'Direct Admin feedback path', 'Immunity from temporary standard user blocks', 'Global broadcast when you send luxury gifts'] }
];

const SEED_POSTS = (users: User[]): Post[] => [
  {
    id: 'post-1',
    user_id: 'user-sofia',
    author: users.find(u => u.id === 'user-sofia')!,
    content: 'Unveiling my new stream outfit for tonight! See you all at 8 PM UTC. I will be doing a live Q&A. Gifting the "Luxury Perfume" gets a direct profile roast/review! 😘✨ See ya!',
    media_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    media_type: 'image',
    likes_count: 485,
    comments_count: 42,
    shares_count: 24,
    saved_count: 85,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    is_liked: true,
    is_saved: false
  },
  {
    id: 'post-2',
    user_id: 'user-chen',
    author: users.find(u => u.id === 'user-chen')!,
    content: 'Just acquired this beautiful piece of conceptual digital art. Real craftsmanship is rare. I am hosting a private yacht party this weekend. Only ConnectX VIP 5+ users invited. DM for details. 🥂🛥️',
    media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    media_type: 'image',
    likes_count: 120,
    comments_count: 8,
    shares_count: 2,
    saved_count: 14,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    is_liked: false,
    is_saved: false
  },
  {
    id: 'post-3',
    user_id: 'user-maya',
    author: users.find(u => u.id === 'user-maya')!,
    content: 'Walking around the historic temples of Kyoto today in full cosplay. The cherry blossoms are finally in bloom! 🌸 Let me know if you want me to bring back some custom matcha sweets for a raffle!',
    media_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    media_type: 'image',
    likes_count: 942,
    comments_count: 156,
    shares_count: 89,
    saved_count: 124,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_liked: false,
    is_saved: true
  },
  {
    id: 'post-4',
    user_id: 'user-admin',
    author: users.find(u => u.id === 'user-admin')!,
    content: '🛡️ ConnectX Rules Update 🛡️ \nWe have updated our gift conversion rates! Received gifts now convert into Diamonds at exactly 50% value, which you can save or convert back into premium level points. Keep sending roses 🌹 and let us know your feedback below!',
    likes_count: 1540,
    comments_count: 489,
    shares_count: 310,
    saved_count: 620,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    is_liked: false,
    is_saved: false
  }
];

const SEED_COMMENTS = (users: User[]): Comment[] => [
  {
    id: 'comment-1',
    post_id: 'post-1',
    user_id: 'user-chen',
    author: users.find(u => u.id === 'user-chen')!,
    content: 'I will be there to send a few VIP Castles 🏰. Make sure you play the requested songs!',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    user_id: 'user-current',
    author: users.find(u => u.id === 'user-current')!,
    content: 'Awesome! Excited for the live stream. Will try to save enough coins for a Rose 🌹',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'comment-3',
    post_id: 'post-3',
    user_id: 'user-sofia',
    author: users.find(u => u.id === 'user-sofia')!,
    content: 'This cosplay is absolutely beautiful Maya! We should do a dual stream soon 🌸✨',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender_id: 'user-sofia',
    receiver_id: 'user-current',
    content: 'Hey Alex! Loved your UI designs for the main room. Do you think we could design custom stickers for my loyal fans?',
    media_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-2',
    sender_id: 'user-current',
    receiver_id: 'user-sofia',
    content: 'Hey Sofia! Thank you so much. Yes, absolutely, I can sketch out some cute emojis based on your avatar. What colors do you prefer?',
    media_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-3',
    sender_id: 'user-sofia',
    receiver_id: 'user-current',
    content: 'Perfect, I like pinks, gold, and diamond neon. Check this background reference!',
    media_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-4',
    sender_id: 'user-sofia',
    receiver_id: 'user-current',
    content: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=500',
    media_type: 'image',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-5',
    sender_id: 'user-sofia',
    receiver_id: 'user-current',
    content: 'Let me know if we can start this week! I can tip you some extra coins here too!',
    media_type: 'text',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  // Thread with Lord Chen
  {
    id: 'msg-6',
    sender_id: 'user-chen',
    receiver_id: 'user-current',
    content: 'Hey there. I saw your post. I am buying up all premium assets. If you can configure a unique avatar outline, I will send you 3 Space Rockets 🚀.',
    media_type: 'text',
    is_read: false,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  }
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-current',
    type: 'like',
    sender_id: 'user-sofia',
    sender_name: 'Sofia Rossi 👑',
    sender_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    message: 'liked your comment on her post.',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    is_read: false
  },
  {
    id: 'notif-2',
    user_id: 'user-current',
    type: 'gift',
    sender_id: 'user-chen',
    sender_name: 'Lord Chen 🦁',
    sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    message: 'sent you a Big Diamond 💎 (1000 coins value).',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    is_read: false
  },
  {
    id: 'notif-3',
    user_id: 'user-current',
    type: 'follow',
    sender_id: 'user-maya',
    sender_name: 'Maya Chan 🌸',
    sender_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    message: 'started following you.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_read: true
  }
];

const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    user_id: 'user-current',
    type: 'daily_reward',
    amount_coins: 50,
    amount_diamonds: 0,
    description: 'Claimed Daily Login Reward',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-2',
    user_id: 'user-current',
    type: 'buy_coins',
    amount_coins: 2000,
    amount_diamonds: 0,
    description: 'Purchased 2000 Coins Package',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tx-3',
    user_id: 'user-current',
    type: 'receive_gift',
    amount_coins: 0,
    amount_diamonds: 500,
    description: 'Received Big Diamond 💎 from Lord Chen 🦁',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

const SEED_REPORTS: Report[] = [
  {
    id: 'report-1',
    reporter_id: 'user-maya',
    reporter_name: 'Maya Chan 🌸',
    reported_user_id: 'user-chen',
    reported_user_name: 'Lord Chen 🦁',
    reason: 'Spamming',
    details: 'Keeps messaging me offering coins to fly to Singapore. Blocked him.',
    status: 'pending',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

export class LocalDB {
  private static getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`connectx_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`connectx_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }

  // Clear or re-initialize db
  public static init() {
    if (!localStorage.getItem('connectx_seeded')) {
      LocalDB.setStorageItem('users', SEED_USERS);
      LocalDB.setStorageItem('gifts', SEED_GIFTS);
      LocalDB.setStorageItem('coin_packages', SEED_COIN_PACKAGES);
      LocalDB.setStorageItem('vip_packages', SEED_VIP_PACKAGES);
      
      const seedUsers = SEED_USERS;
      LocalDB.setStorageItem('posts', SEED_POSTS(seedUsers));
      LocalDB.setStorageItem('comments', SEED_COMMENTS(seedUsers));
      LocalDB.setStorageItem('messages', SEED_MESSAGES);
      LocalDB.setStorageItem('notifications', SEED_NOTIFICATIONS);
      LocalDB.setStorageItem('transactions', SEED_TRANSACTIONS);
      LocalDB.setStorageItem('reports', SEED_REPORTS);
      localStorage.setItem('connectx_current_user_id', 'user-current');
      localStorage.setItem('connectx_seeded', 'true');
    }
  }

  // --- AUTH SERVICE ---
  public static getCurrentUser(): User {
    LocalDB.init();
    const currentUserId = localStorage.getItem('connectx_current_user_id') || 'user-current';
    const users = LocalDB.getUsers();
    let current = users.find(u => u.id === currentUserId);
    if (!current) {
      // Fallback
      current = users[0];
      localStorage.setItem('connectx_current_user_id', current.id);
    }
    return current;
  }

  public static signIn(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = LocalDB.getUsers();
    // Simulate user search or standard credential verify
    const user = users.find(u => u.username === email.split('@')[0]) || users[0];
    localStorage.setItem('connectx_current_user_id', user.id);
    // Mark as online
    LocalDB.updateOnlineStatus(user.id, true);
    return { success: true, user: LocalDB.getCurrentUser() };
  }

  public static signUp(username: string, displayName: string, email: string): { success: boolean; user?: User; error?: string } {
    const users = LocalDB.getUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return { success: false, error: 'Username already exists' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.toLowerCase().replace(/\s+/g, ''),
      display_name: displayName,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`, // Default beauty avatar
      cover_photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
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
      coins: 1000, // free startup coins!
      diamonds: 0,
      vip_points: 0,
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    LocalDB.setStorageItem('users', users);
    localStorage.setItem('connectx_current_user_id', newUser.id);

    // Create a welcoming notification
    LocalDB.createSystemNotification(newUser.id, 'Welcome to ConnectX! 🌟 Explore the feed, buy packages, or talk to creators!');
    return { success: true, user: newUser };
  }

  public static signOut(): void {
    const current = LocalDB.getCurrentUser();
    LocalDB.updateOnlineStatus(current.id, false);
    localStorage.removeItem('connectx_current_user_id');
  }

  // --- USERS SERVICE ---
  public static getUsers(): User[] {
    LocalDB.init();
    return LocalDB.getStorageItem<User[]>('users', SEED_USERS);
  }

  public static updateProfile(userId: string, updates: Partial<User>): User {
    const users = LocalDB.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates } as User;
      LocalDB.setStorageItem('users', users);
      return users[idx];
    }
    throw new Error('User not found');
  }

  public static updateOnlineStatus(userId: string, isOnline: boolean): void {
    try {
      const users = LocalDB.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        users[idx].is_online = isOnline;
        LocalDB.setStorageItem('users', users);
      }
    } catch (e) {
      console.error(e);
    }
  }

  public static followUser(followerId: string, followingId: string): void {
    const users = LocalDB.getUsers();
    const followerIdx = users.findIndex(u => u.id === followerId);
    const followingIdx = users.findIndex(u => u.id === followingId);
    if (followerIdx !== -1 && followingIdx !== -1) {
      users[followerIdx].following_count += 1;
      users[followingIdx].followers_count += 1;
      LocalDB.setStorageItem('users', users);

      // Notify the receiver
      LocalDB.createNotification({
        user_id: followingId,
        type: 'follow',
        sender_id: followerId,
        sender_name: users[followerIdx].display_name,
        sender_avatar: users[followerIdx].avatar,
        message: 'started following you.'
      });
    }
  }

  public static unfollowUser(followerId: string, followingId: string): void {
    const users = LocalDB.getUsers();
    const followerIdx = users.findIndex(u => u.id === followerId);
    const followingIdx = users.findIndex(u => u.id === followingId);
    if (followerIdx !== -1 && followingIdx !== -1) {
      users[followerIdx].following_count = Math.max(0, users[followerIdx].following_count - 1);
      users[followingIdx].followers_count = Math.max(0, users[followingIdx].followers_count - 1);
      LocalDB.setStorageItem('users', users);
    }
  }

  // --- POSTS (FEED) SERVICE ---
  public static getPosts(): Post[] {
    LocalDB.init();
    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    const users = LocalDB.getUsers();
    // Resolve fresh user details in case levels, VIP badge or avatars changed
    return posts.map(post => {
      const author = users.find(u => u.id === post.user_id) || post.author;
      return { ...post, author };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static createPost(userId: string, content: string, mediaUrl?: string, mediaType?: 'image' | 'video', mediaUrls?: string[]): Post {
    const users = LocalDB.getUsers();
    const author = users.find(u => u.id === userId);
    if (!author) throw new Error('Author not found');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user_id: userId,
      author,
      content,
      media_url: mediaUrl,
      media_type: mediaType,
      media_urls: mediaUrls,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      saved_count: 0,
      created_at: new Date().toISOString(),
      is_liked: false,
      is_saved: false
    };

    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    posts.push(newPost);
    LocalDB.setStorageItem('posts', posts);

    // Increase user level points for posting activity
    LocalDB.addExpPoints(userId, 15);

    return newPost;
  }

  public static deletePost(postId: string): void {
    let posts = LocalDB.getStorageItem<Post[]>('posts', []);
    posts = posts.filter(p => p.id !== postId);
    LocalDB.setStorageItem('posts', posts);
  }

  public static likePost(userId: string, postId: string): Post {
    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      const post = posts[idx];
      if (post.is_liked) {
        post.likes_count = Math.max(0, post.likes_count - 1);
        post.is_liked = false;
      } else {
        post.likes_count += 1;
        post.is_liked = true;

        // Notify poster if it is not their own post
        if (post.user_id !== userId) {
          const liker = LocalDB.getCurrentUser();
          LocalDB.createNotification({
            user_id: post.user_id,
            type: 'like',
            sender_id: userId,
            sender_name: liker.display_name,
            sender_avatar: liker.avatar,
            message: 'liked your post.'
          });
        }
      }
      LocalDB.setStorageItem('posts', posts);
      return post;
    }
    throw new Error('Post not found');
  }

  public static savePost(userId: string, postId: string): Post {
    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      const post = posts[idx];
      if (post.is_saved) {
        post.saved_count = Math.max(0, post.saved_count - 1);
        post.is_saved = false;
      } else {
        post.saved_count += 1;
        post.is_saved = true;
      }
      LocalDB.setStorageItem('posts', posts);
      return post;
    }
    throw new Error('Post not found');
  }

  public static sharePost(postId: string): Post {
    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
      posts[idx].shares_count += 1;
      LocalDB.setStorageItem('posts', posts);
      return posts[idx];
    }
    throw new Error('Post not found');
  }

  public static getComments(postId: string): Comment[] {
    const comments = LocalDB.getStorageItem<Comment[]>('comments', []);
    const users = LocalDB.getUsers();
    return comments
      .filter(c => c.post_id === postId)
      .map(c => ({
        ...c,
        author: users.find(u => u.id === c.user_id) || c.author
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public static addComment(userId: string, postId: string, content: string): Comment {
    const users = LocalDB.getUsers();
    const author = users.find(u => u.id === userId);
    if (!author) throw new Error('User not found');

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      post_id: postId,
      user_id: userId,
      author,
      content,
      created_at: new Date().toISOString()
    };

    const comments = LocalDB.getStorageItem<Comment[]>('comments', []);
    comments.push(newComment);
    LocalDB.setStorageItem('comments', comments);

    // Update comment count in post
    const posts = LocalDB.getStorageItem<Post[]>('posts', []);
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
      posts[postIdx].comments_count += 1;
      LocalDB.setStorageItem('posts', posts);

      // Notify owner
      if (posts[postIdx].user_id !== userId) {
        LocalDB.createNotification({
          user_id: posts[postIdx].user_id,
          type: 'comment',
          sender_id: userId,
          sender_name: author.display_name,
          sender_avatar: author.avatar,
          message: 'commented on your post: "' + content.substring(0, 25) + (content.length > 25 ? '...' : '') + '"'
        });
      }
    }

    // Award level exp
    LocalDB.addExpPoints(userId, 8);

    return newComment;
  }

  // --- MESSAGES / CHAT SERVICE ---
  public static getMessages(userId1: string, userId2: string): Message[] {
    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    return messages
      .filter(m => 
        (m.sender_id === userId1 && m.receiver_id === userId2) ||
        (m.sender_id === userId2 && m.receiver_id === userId1)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public static sendMessage(senderId: string, receiverId: string, content: string, mediaUrl?: string, mediaType: 'text' | 'image' | 'voice' | 'gif' = 'text'): Message {
    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      media_url: mediaUrl,
      media_type: mediaType,
      is_read: false,
      created_at: new Date().toISOString()
    };

    messages.push(newMsg);
    LocalDB.setStorageItem('messages', messages);

    // Trigger auto-typing & simulated response if messaging pre-seeded creators to make Chat super interactive
    if (receiverId === 'user-sofia' || receiverId === 'user-chen' || receiverId === 'user-maya') {
      // Simulate reply after 2 seconds
      setTimeout(() => {
        LocalDB.simulateCreatorReply(receiverId, senderId, content);
      }, 2500);
    }

    return newMsg;
  }

  public static reactToMessage(messageId: string, userId: string, emoji: string): Message {
    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      const msg = messages[idx];
      if (!msg.reactions) {
        msg.reactions = {};
      }
      const list = msg.reactions[emoji] || [];
      const userIdx = list.indexOf(userId);
      if (userIdx !== -1) {
        list.splice(userIdx, 1);
        if (list.length === 0) {
          delete msg.reactions[emoji];
        } else {
          msg.reactions[emoji] = list;
        }
      } else {
        list.push(userId);
        msg.reactions[emoji] = list;
      }
      messages[idx] = msg;
      LocalDB.setStorageItem('messages', messages);
      
      // Fire window event to trigger real-time updates for reactions as well
      window.dispatchEvent(new CustomEvent('connectx_realtime_msg', { detail: msg }));
      return msg;
    }
    throw new Error('Message not found');
  }

  public static markMessagesAsRead(receiverId: string, senderId: string): void {
    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    let modified = false;
    messages.forEach(m => {
      if (m.sender_id === senderId && m.receiver_id === receiverId && !m.is_read) {
        m.is_read = true;
        modified = true;
      }
    });
    if (modified) {
      LocalDB.setStorageItem('messages', messages);
    }
  }

  public static getChatList(userId: string): { user: User; lastMessage: Message; unreadCount: number }[] {
    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    const users = LocalDB.getUsers();
    
    // Group by chat partner
    const chatsMap = new Map<string, { lastMessage: Message; unreadCount: number }>();
    
    messages.forEach(m => {
      const partnerId = m.sender_id === userId ? m.receiver_id : m.sender_id;
      if (partnerId === userId) return; // ignore self-chats

      const existing = chatsMap.get(partnerId);
      const isUnread = m.receiver_id === userId && !m.is_read;

      if (!existing || new Date(m.created_at).getTime() > new Date(existing.lastMessage.created_at).getTime()) {
        chatsMap.set(partnerId, {
          lastMessage: m,
          unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0)
        });
      } else {
        chatsMap.set(partnerId, {
          lastMessage: existing.lastMessage,
          unreadCount: existing.unreadCount + (isUnread ? 1 : 0)
        });
      }
    });

    const results: { user: User; lastMessage: Message; unreadCount: number }[] = [];
    chatsMap.forEach((val, partnerId) => {
      const partner = users.find(u => u.id === partnerId);
      if (partner) {
        results.push({
          user: partner,
          lastMessage: val.lastMessage,
          unreadCount: val.unreadCount
        });
      }
    });

    return results.sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());
  }

  private static simulateCreatorReply(creatorId: string, userId: string, originalContent: string) {
    const users = LocalDB.getUsers();
    const creator = users.find(u => u.id === creatorId);
    if (!creator) return;

    let reply = "Hello there! Thanks for your message. 💖 Send a Luxury Gift in my profile to get prioritised VIP replies!";
    
    // Check the last sent message's media type for contextual replies
    const userMessages = LocalDB.getMessages(userId, creatorId);
    const lastMsg = userMessages[userMessages.length - 1];
    
    if (lastMsg && lastMsg.media_type === 'voice') {
      if (creatorId === 'user-sofia') {
        reply = "Aww, your voice is absolutely sweet! 💖 I love hearing you. Let's talk more often! 🥰🎙️";
      } else if (creatorId === 'user-chen') {
        reply = "Received your voice memo. Good communication is a valuable asset. Let's schedule a VIP discussion! 💼🦁";
      } else {
        reply = "Konnichiwa! Your voice is so high-energy and cute! Let's talk more, it makes my day! 🌸🍡";
      }
    } else if (lastMsg && (lastMsg.media_type === 'image' || lastMsg.media_type === 'gif')) {
      if (creatorId === 'user-sofia') {
        reply = "Omg, what an amazing image! 😍 I absolutely love the aesthetic! You have top-tier visual taste. ✨📸";
      } else if (creatorId === 'user-chen') {
        reply = "Very high-quality visual branding. Presentation is critical for elite status. Excellent capture! 📈💎";
      } else {
        reply = "Sugoi! ⛩️ This is so beautifully artistic! Reminds me of the best moments from a Kyoto anime. 🌸🎨";
      }
    } else {
      const lower = originalContent.toLowerCase();
      if (creatorId === 'user-sofia') {
        if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
          reply = "Hey darling! Sofia here. So happy to connect! Will you be joining my streams tonight? 💖🌹";
        } else if (lower.includes('sticker') || lower.includes('design') || lower.includes('avatar')) {
          reply = "Yes please! Send me the draft designs soon. I will send you diamond rewards in your stream level! 💎✨";
        } else if (lower.includes('gift') || lower.includes('rose') || lower.includes('castle')) {
          reply = "Omg, thank you! Giving gifts really helps me rank high on the daily popularity charts. I appreciate it a lot! 🥰🏎️";
        }
      } else if (creatorId === 'user-chen') {
        if (lower.includes('yacht') || lower.includes('party')) {
          reply = "The party is ready. Premium beverages, top-tier networking. Upgrade your VIP Level or VIP Badge to join! 🥂🛥️";
        } else {
          reply = "ConnectX is all about status and luxury. Keep climbing the ranks, and we can discuss business deals. 🦁💰";
        }
      } else if (creatorId === 'user-maya') {
        if (lower.includes('cosplay') || lower.includes('japan')) {
          reply = "Hi! Yes, Kyoto temples are stunning. I am designing a custom anime maid outfit for tomorrow! 🍡🌸";
        } else {
          reply = "Konnichiwa! Let's follow each other and keep rising! ⛩️🌸";
        }
      }
    }

    const messages = LocalDB.getStorageItem<Message[]>('messages', []);
    const newMsg: Message = {
      id: `msg-reply-${Date.now()}`,
      sender_id: creatorId,
      receiver_id: userId,
      content: reply,
      media_type: 'text',
      is_read: false,
      created_at: new Date().toISOString()
    };
    messages.push(newMsg);
    LocalDB.setStorageItem('messages', messages);

    // Create a message notification
    LocalDB.createNotification({
      user_id: userId,
      type: 'message',
      sender_id: creatorId,
      sender_name: creator.display_name,
      sender_avatar: creator.avatar,
      message: 'sent you a private message.'
    });

    // Fire window event to trigger real-time rerender
    window.dispatchEvent(new CustomEvent('connectx_realtime_msg', { detail: newMsg }));
  }

  // --- GIFTS & WALLET SERVICE ---
  public static getGifts(): Gift[] {
    LocalDB.init();
    return LocalDB.getStorageItem<Gift[]>('gifts', SEED_GIFTS);
  }

  public static getCoinPackages(): CoinPackage[] {
    LocalDB.init();
    return LocalDB.getStorageItem<CoinPackage[]>('coin_packages', SEED_COIN_PACKAGES);
  }

  public static getVIPPackages(): VIPPackage[] {
    LocalDB.init();
    return LocalDB.getStorageItem<VIPPackage[]>('vip_packages', SEED_VIP_PACKAGES);
  }

  public static buyCoins(userId: string, packageId: string): { success: boolean; user: User } {
    const packages = LocalDB.getCoinPackages();
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) throw new Error('Package not found');

    const users = LocalDB.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].coins += pkg.coins;
      // also award VIP points proportional to purchase
      users[idx].vip_points += Math.floor(pkg.cost_usd * 10);
      
      // Check for automatic VIP status unlock
      if (users[idx].vip_points >= 100 && !users[idx].is_vip) {
        users[idx].is_vip = true;
        users[idx].vip_level = 1;
      } else if (users[idx].vip_points >= 500 && users[idx].vip_level < 3) {
        users[idx].vip_level = 3;
      } else if (users[idx].vip_points >= 2000 && users[idx].vip_level < 5) {
        users[idx].vip_level = 5;
      }

      LocalDB.setStorageItem('users', users);

      // Record transaction
      LocalDB.addTransaction({
        user_id: userId,
        type: 'buy_coins',
        amount_coins: pkg.coins,
        amount_diamonds: 0,
        description: `Purchased Coin Package: +${pkg.coins} Coins via Razorpay/Stripe`
      });

      LocalDB.createNotification({
        user_id: userId,
        type: 'coin_purchase',
        sender_id: 'system',
        sender_name: 'ConnectX System',
        sender_avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100',
        message: `Successfully bought ${pkg.coins} Coins! Your account has been credited. 🪙🎉`
      });

      return { success: true, user: users[idx] };
    }
    throw new Error('User not found');
  }

  public static buyVIP(userId: string, vipPkgId: string): { success: boolean; user: User } {
    const vipPackages = LocalDB.getVIPPackages();
    const pkg = vipPackages.find(p => p.id === vipPkgId);
    if (!pkg) throw new Error('VIP package not found');

    const users = LocalDB.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      const user = users[idx];
      if (user.coins < pkg.cost_coins_per_month) {
        return { success: false, user }; // not enough coins
      }

      user.coins -= pkg.cost_coins_per_month;
      user.is_vip = true;
      user.vip_level = Math.max(user.vip_level, pkg.level);
      user.vip_points += Math.floor(pkg.cost_coins_per_month / 10);
      LocalDB.setStorageItem('users', users);

      // Record Transaction
      LocalDB.addTransaction({
        user_id: userId,
        type: 'vip_purchase',
        amount_coins: -pkg.cost_coins_per_month,
        amount_diamonds: 0,
        description: `Upgraded to ${pkg.name} membership`
      });

      LocalDB.createNotification({
        user_id: userId,
        type: 'vip',
        sender_id: 'system',
        sender_name: 'ConnectX System',
        sender_avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100',
        message: `Congratulations! You are now a premium member of ${pkg.name}! Enjoy exclusive badges and animated avatar glow frames! 👑✨`
      });

      return { success: true, user };
    }
    throw new Error('User not found');
  }

  public static claimDailyReward(userId: string): { success: boolean; coinsGranted: number; user: User; error?: string } {
    // Check if claimed today
    const transactions = LocalDB.getTransactions(userId);
    const todayStr = new Date().toDateString();
    const alreadyClaimed = transactions.some(t => 
      t.type === 'daily_reward' && 
      new Date(t.created_at).toDateString() === todayStr
    );

    const users = LocalDB.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    const user = users[idx];

    if (alreadyClaimed) {
      return { success: false, coinsGranted: 0, user, error: 'You have already claimed your daily reward today. Come back tomorrow!' };
    }

    // VIP bonus rewards
    let baseReward = 50;
    if (user.is_vip) {
      if (user.vip_level >= 5) baseReward = 150; // Extra daily rewards
      else if (user.vip_level >= 3) baseReward = 100;
      else baseReward = 75;
    }

    user.coins += baseReward;
    LocalDB.setStorageItem('users', users);

    LocalDB.addTransaction({
      user_id: userId,
      type: 'daily_reward',
      amount_coins: baseReward,
      amount_diamonds: 0,
      description: `Claimed Daily Reward (Includes VIP multipliers)`
    });

    LocalDB.createSystemNotification(userId, `Daily Reward claimed! +${baseReward} Coins credited to your wallet. 🎁🪙`);
    return { success: true, coinsGranted: baseReward, user };
  }

  public static sendGift(senderId: string, receiverId: string, giftId: string): { success: boolean; error?: string; sender?: User; receiver?: User } {
    if (senderId === receiverId) {
      return { success: false, error: 'You cannot send a virtual gift to yourself.' };
    }

    const gifts = LocalDB.getGifts();
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) throw new Error('Gift not found');

    const users = LocalDB.getUsers();
    const senderIdx = users.findIndex(u => u.id === senderId);
    const receiverIdx = users.findIndex(u => u.id === receiverId);

    if (senderIdx === -1 || receiverIdx === -1) throw new Error('Sender or receiver not found');

    const sender = users[senderIdx];
    const receiver = users[receiverIdx];

    if (sender.coins < gift.cost_coins) {
      return { success: false, error: `Insufficient Coins. This gift costs ${gift.cost_coins} coins, but you only have ${sender.coins} coins.` };
    }

    // Deduct coins from sender, grant diamonds to receiver (convert virtual gifts into diamonds)
    sender.coins -= gift.cost_coins;
    // Add diamonds to receiver! E.g. virtual gift value conversion is 50% back in diamonds
    receiver.diamonds += gift.value_diamonds;

    // Send XP based on coins spent
    sender.level = Math.min(100, sender.level + Math.max(1, Math.floor(gift.cost_coins / 50)));
    receiver.level = Math.min(100, receiver.level + Math.max(1, Math.floor(gift.value_diamonds / 25)));

    LocalDB.setStorageItem('users', users);

    // Save transaction records for both
    LocalDB.addTransaction({
      user_id: senderId,
      type: 'send_gift',
      amount_coins: -gift.cost_coins,
      amount_diamonds: 0,
      description: `Sent virtual gift "${gift.name} ${gift.icon}" to ${receiver.display_name}`
    });

    LocalDB.addTransaction({
      user_id: receiverId,
      type: 'receive_gift',
      amount_coins: 0,
      amount_diamonds: gift.value_diamonds,
      description: `Received virtual gift "${gift.name} ${gift.icon}" from ${sender.display_name}`
    });

    // Save gift history (virtual gift catalog transactions)
    const giftTx: GiftTransaction = {
      id: `gift-tx-${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      sender_name: sender.display_name,
      receiver_name: receiver.display_name,
      gift_id: gift.id,
      gift_name: gift.name,
      gift_icon: gift.icon,
      cost_coins: gift.cost_coins,
      converted_diamonds: gift.value_diamonds,
      created_at: new Date().toISOString()
    };
    const giftTxs = LocalDB.getStorageItem<GiftTransaction[]>('gift_transactions', []);
    giftTxs.push(giftTx);
    LocalDB.setStorageItem('gift_transactions', giftTxs);

    // Create Notification
    LocalDB.createNotification({
      user_id: receiverId,
      type: 'gift',
      sender_id: senderId,
      sender_name: sender.display_name,
      sender_avatar: sender.avatar,
      message: `sent you a ${gift.name} ${gift.icon}! (+${gift.value_diamonds} Diamonds)`
    });

    // VIP global alert simulation for highly priced gifts
    if (gift.cost_coins >= 1000) {
      LocalDB.createSystemNotification('all', `🔥 VIP alert! ${sender.display_name} showered ${receiver.display_name} with a luxurious ${gift.name} ${gift.icon}!`);
    }

    return { success: true, sender, receiver };
  }

  public static convertDiamonds(userId: string, diamondAmount: number): { success: boolean; coinsGranted: number; user: User; error?: string } {
    const users = LocalDB.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    const user = users[idx];

    if (user.diamonds < diamondAmount) {
      return { success: false, coinsGranted: 0, user, error: 'Insufficient diamonds' };
    }

    // 1 Diamond convert back into 2 Coins
    const coinsGranted = diamondAmount * 2;
    user.diamonds -= diamondAmount;
    user.coins += coinsGranted;
    LocalDB.setStorageItem('users', users);

    LocalDB.addTransaction({
      user_id: userId,
      type: 'convert_diamonds',
      amount_coins: coinsGranted,
      amount_diamonds: -diamondAmount,
      description: `Converted ${diamondAmount} Diamonds into +${coinsGranted} Coins`
    });

    LocalDB.createSystemNotification(userId, `Converted ${diamondAmount} Diamonds into +${coinsGranted} Coins! 🪙💎`);

    return { success: true, coinsGranted, user };
  }

  // Helper level XP
  private static addExpPoints(userId: string, points: number): void {
    try {
      const users = LocalDB.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        const currentExp = users[idx].vip_points;
        const newPoints = currentExp + points;
        users[idx].vip_points = newPoints;
        // level scale: level increments every 100 points
        const calculatedLevel = 1 + Math.floor(newPoints / 100);
        if (calculatedLevel > users[idx].level) {
          users[idx].level = Math.min(100, calculatedLevel);
          // System notify level up
          LocalDB.createSystemNotification(userId, `🎉 Level Up! You have reached Level ${users[idx].level}! Keep active to rank higher!`);
        }
        LocalDB.setStorageItem('users', users);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // --- RANKINGS SERVICE ---
  public static getRankings(period: RankingPeriod, type: RankingType): RankingEntry[] {
    const users = LocalDB.getUsers();
    const giftTxs = LocalDB.getStorageItem<GiftTransaction[]>('gift_transactions', []);
    
    // Filter transactions based on period dates if needed, but for local simulation:
    // We aggregate coins spent (wealth ranking) or diamonds earned (popularity ranking)
    const aggregatedValues = new Map<string, number>();

    // Initial seed variables to guarantee Lord Chen is Wealth leader and Sofia is Popularity leader
    users.forEach(u => {
      if (type === 'wealth' || type === 'top_gifter') {
        if (u.id === 'user-chen') aggregatedValues.set(u.id, 85000);
        else if (u.id === 'user-sofia') aggregatedValues.set(u.id, 1400);
        else if (u.id === 'user-current') aggregatedValues.set(u.id, 500);
        else aggregatedValues.set(u.id, 100);
      } else if (type === 'popularity') {
        if (u.id === 'user-sofia') aggregatedValues.set(u.id, 24000);
        else if (u.id === 'user-maya') aggregatedValues.set(u.id, 8900);
        else if (u.id === 'user-current') aggregatedValues.set(u.id, 2400);
        else aggregatedValues.set(u.id, 200);
      } else if (type === 'richest') {
        // Net asset value in Standard Coins: coins + diamonds * 2
        const netWorth = u.coins + (u.diamonds * 2);
        aggregatedValues.set(u.id, netWorth);
      } else if (type === 'rising') {
        // Level points + followers gain formula
        const risingScore = u.level * 100 + u.followers_count;
        aggregatedValues.set(u.id, risingScore);
      }
    });

    // Add current actual gift tx details
    if (type === 'wealth' || type === 'top_gifter' || type === 'popularity') {
      giftTxs.forEach(tx => {
        const timeDiff = Date.now() - new Date(tx.created_at).getTime();
        let isWithinPeriod = true;

        if (period === 'daily') isWithinPeriod = timeDiff < 24 * 60 * 60 * 1000;
        else if (period === 'weekly') isWithinPeriod = timeDiff < 7 * 24 * 60 * 60 * 1000;
        else if (period === 'monthly') isWithinPeriod = timeDiff < 30 * 24 * 60 * 60 * 1000;

        if (isWithinPeriod) {
          if (type === 'wealth' || type === 'top_gifter') {
            const current = aggregatedValues.get(tx.sender_id) || 0;
            aggregatedValues.set(tx.sender_id, current + tx.cost_coins);
          } else {
            const current = aggregatedValues.get(tx.receiver_id) || 0;
            aggregatedValues.set(tx.receiver_id, current + tx.converted_diamonds);
          }
        }
      });
    }

    const entries: RankingEntry[] = [];
    aggregatedValues.forEach((val, userId) => {
      const user = users.find(u => u.id === userId);
      if (user) {
        entries.push({
          user,
          rank: 0,
          value: val,
          change: Math.random() > 0.5 ? 'up' : 'stable'
        });
      }
    });

    // Sort descending
    entries.sort((a, b) => b.value - a.value);

    // Apply ranking numbers
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  // --- NOTIFICATIONS SERVICE ---
  public static getNotifications(userId: string): Notification[] {
    LocalDB.init();
    const notifications = LocalDB.getStorageItem<Notification[]>('notifications', []);
    return notifications
      .filter(n => n.user_id === userId || n.user_id === 'all')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static createNotification(params: Omit<Notification, 'id' | 'created_at' | 'is_read'>): Notification {
    const notif: Notification = {
      ...params,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      is_read: false
    };
    const notifications = LocalDB.getStorageItem<Notification[]>('notifications', []);
    notifications.push(notif);
    LocalDB.setStorageItem('notifications', notifications);

    // Dispatch window event for realtime React components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('connectx_new_notification', { detail: notif }));
    }

    return notif;
  }

  public static createSystemNotification(userId: string, message: string): Notification {
    return LocalDB.createNotification({
      user_id: userId,
      type: 'system',
      sender_id: 'system',
      sender_name: 'ConnectX System',
      sender_avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=100', // tech sphere
      message: message
    });
  }

  public static markNotificationAsRead(notifId: string): void {
    const notifications = LocalDB.getStorageItem<Notification[]>('notifications', []);
    const idx = notifications.findIndex(n => n.id === notifId);
    if (idx !== -1) {
      notifications[idx].is_read = true;
      LocalDB.setStorageItem('notifications', notifications);
    }
  }

  public static markAllNotificationsAsRead(userId: string): void {
    const notifications = LocalDB.getStorageItem<Notification[]>('notifications', []);
    notifications.forEach(n => {
      if (n.user_id === userId || n.user_id === 'all') {
        n.is_read = true;
      }
    });
    LocalDB.setStorageItem('notifications', notifications);
  }

  public static deleteNotification(notifId: string): void {
    const notifications = LocalDB.getStorageItem<Notification[]>('notifications', []);
    const filtered = notifications.filter(n => n.id !== notifId);
    LocalDB.setStorageItem('notifications', filtered);
  }

  // --- TRANSACTIONS SERVICE ---
  public static getTransactions(userId: string): WalletTransaction[] {
    LocalDB.init();
    const txs = LocalDB.getStorageItem<WalletTransaction[]>('transactions', []);
    return txs
      .filter(t => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  private static addTransaction(tx: Omit<WalletTransaction, 'id' | 'created_at'>): void {
    const txs = LocalDB.getStorageItem<WalletTransaction[]>('transactions', []);
    const newTx: WalletTransaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString()
    };
    txs.push(newTx);
    LocalDB.setStorageItem('transactions', txs);
  }

  // --- REPORTING SERVICE ---
  public static createReport(reporterId: string, reportedUserId: string, reason: string, details: string): Report {
    const users = LocalDB.getUsers();
    const reporter = users.find(u => u.id === reporterId);
    const reported = users.find(u => u.id === reportedUserId);
    
    if (!reported) throw new Error('Reported user not found');

    const newReport: Report = {
      id: `report-${Date.now()}`,
      reporter_id: reporterId,
      reporter_name: reporter ? reporter.display_name : 'Anonymous',
      reported_user_id: reportedUserId,
      reported_user_name: reported.display_name,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const reports = LocalDB.getStorageItem<Report[]>('reports', []);
    reports.push(newReport);
    LocalDB.setStorageItem('reports', reports);
    return newReport;
  }

  public static getReports(): Report[] {
    LocalDB.init();
    return LocalDB.getStorageItem<Report[]>('reports', SEED_REPORTS)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static updateReportStatus(reportId: string, status: 'pending' | 'resolved'): Report {
    const reports = LocalDB.getReports();
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      reports[idx].status = status;
      LocalDB.setStorageItem('reports', reports);
      return reports[idx];
    }
    throw new Error('Report not found');
  }

  // --- ADMIN SETTING CONFIGURATORS ---
  public static deleteUser(userId: string): void {
    let users = LocalDB.getUsers();
    users = users.filter(u => u.id !== userId);
    LocalDB.setStorageItem('users', users);
  }

  public static addGift(gift: Gift): void {
    const gifts = LocalDB.getGifts();
    gifts.push(gift);
    LocalDB.setStorageItem('gifts', gifts);
  }

  public static deleteGift(giftId: string): void {
    let gifts = LocalDB.getGifts();
    gifts = gifts.filter(g => g.id !== giftId);
    LocalDB.setStorageItem('gifts', gifts);
  }

  public static addCoinPackage(pkg: CoinPackage): void {
    const pkgs = LocalDB.getCoinPackages();
    pkgs.push(pkg);
    LocalDB.setStorageItem('coin_packages', pkgs);
  }

  public static deleteCoinPackage(pkgId: string): void {
    let pkgs = LocalDB.getCoinPackages();
    pkgs = pkgs.filter(p => p.id !== pkgId);
    LocalDB.setStorageItem('coin_packages', pkgs);
  }
}

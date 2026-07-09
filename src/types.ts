/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  avatar_url?: string;
  cover_photo: string;
  cover_url?: string;
  bio: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  country: string;
  age: number;
  is_online: boolean;
  level: number;
  is_vip: boolean;
  vip_level: number;
  followers_count: number;
  following_count: number;
  coins: number;
  diamonds: number;
  vip_points: number;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  author: User;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  media_urls?: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saved_count: number;
  created_at: string;
  is_liked?: boolean;
  is_saved?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author: User;
  content: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  media_type: 'text' | 'image' | 'voice' | 'gif';
  is_read: boolean;
  created_at: string;
  reactions?: { [emoji: string]: string[] };
}

export interface Gift {
  id: string;
  name: string;
  icon: string; // Emoji or SVG description
  cost_coins: number;
  value_diamonds: number;
  category: 'Popular' | 'Luxury' | 'Special' | 'VIP';
}

export interface GiftTransaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  gift_id: string;
  gift_name: string;
  gift_icon: string;
  cost_coins: number;
  converted_diamonds: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'gift' | 'message' | 'system' | 'coin_purchase' | 'vip';
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  message: string;
  created_at: string;
  is_read: boolean;
  action_url?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reported_user_id: string;
  reported_user_name: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved';
  created_at: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  diamonds?: number;
  cost_usd: number;
  original_cost_usd?: number;
  popular?: boolean;
  badge?: string;
}

export interface VIPPackage {
  id: string;
  level: number;
  name: string;
  badge: string;
  frame_color: string;
  cost_coins_per_month: number;
  benefits: string[];
}

export type RankingPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
export type RankingType = 'wealth' | 'popularity' | 'richest' | 'rising' | 'top_gifter';

export interface RankingEntry {
  user: User;
  rank: number;
  value: number; // coins spent (wealth) or diamonds received (popularity)
  change: 'up' | 'down' | 'stable';
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'buy_coins' | 'send_gift' | 'receive_gift' | 'convert_diamonds' | 'daily_reward' | 'vip_purchase';
  amount_coins: number; // positive or negative
  amount_diamonds: number; // positive or negative
  description: string;
  created_at: string;
}

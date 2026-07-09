// src/components/Feed.tsx
import { supabase } from '../supabaseClient';

const fetchFeed = async () => {
  // 1. Fetch posts
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (postsError) throw postsError;

  // 2. Extract unique user IDs
  const userIds = [...new Set(posts.map((post) => post.user_id))];

  // 3. Fetch matching profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profilesError) throw profilesError;

  // 4. Map profiles to posts
  const postsWithProfiles = posts.map((post) => ({
    ...post,
    profile: profiles.find((p) => p.id === post.user_id) || null,
  }));

  setPosts(postsWithProfiles);
};

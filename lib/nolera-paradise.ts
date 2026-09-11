"use client";

import { getSupabaseClient } from "./nolera-auth";

export type ParadisePostType =
  | "text"
  | "image"
  | "video"
  | "link"
  | "product";

export interface ParadisePost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  content: string;
  type: ParadisePostType;
  mediaUrl?: string;
  linkUrl?: string;
  productId?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  createdAt: string;
}

export interface ParadiseComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface ParadiseStory {
  id: string;
  authorId: string;
  authorName: string;
  mediaUrl?: string;
  caption?: string;
  text?: string;
  views: number;
  createdAt: string;
  expiresAt: string;
}

export interface ParadiseMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface ParadiseGroup {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: number;
  imageUrl?: string;
  createdAt: string;
}

async function currentUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Authentication required");
  return data.user;
}

function profileName(user: any) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "NOLERA User"
  );
}

function profileUsername(user: any) {
  return (
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "nolera_user"
  );
}

function mapPost(row: any, userId?: string): ParadisePost {
  return {
    id: row.id,
    authorId: row.author_id,
    authorName: row.profiles?.name || row.profiles?.full_name || "NOLERA User",
    authorUsername:
      row.profiles?.username ||
      row.profiles?.email?.split("@")[0] ||
      "nolera_user",
    authorAvatar: row.profiles?.avatar_url,
    content: row.content,
    type: row.type,
    mediaUrl: row.media_url,
    linkUrl: row.link_url,
    productId: row.product_id,
    likes: row.likes || 0,
    comments: row.comments || 0,
    shares: row.shares || 0,
    liked: false,
    createdAt: row.created_at,
  };
}

export async function getParadisePosts() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("paradise_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => mapPost(row));
}

export async function createParadisePost(
  input: Omit<
    ParadisePost,
    "id" | "likes" | "comments" | "shares" | "liked" | "createdAt"
  >
) {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_posts")
    .insert({
      author_id: user.id,
      content: input.content,
      type: input.type,
      media_url: input.mediaUrl || null,
      link_url: input.linkUrl || null,
      product_id: input.productId || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return mapPost(data, user.id);
}

export async function deleteParadisePost(postId: string) {
  const user = await currentUser();

  const { error } = await getSupabaseClient()
    .from("paradise_posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw error;
}

export async function toggleParadiseLike(
  postId: string,
  _userId?: string
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "nolera_toggle_paradise_like",
    { p_post_id: postId }
  );

  if (error) throw error;

  return data;
}


export const toggleLike = toggleParadiseLike;

export async function shareParadisePost(postId: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "nolera_share_paradise_post",
    { p_post_id: postId }
  );

  if (error) throw error;

  return Number(data || 0);
}

export async function getParadiseComments(postId?: string) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("paradise_comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (postId) query = query.eq("post_id", postId);

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: "NOLERA User",
    content: row.content,
    likes: row.likes || 0,
    createdAt: row.created_at,
  })) as ParadiseComment[];
}

export async function addParadiseComment(input: {
  postId: string;
  authorId?: string;
  authorName?: string;
  content: string;
}) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "nolera_add_paradise_comment",
    {
      p_post_id: input.postId,
      p_content: input.content,
    }
  );

  if (error) throw error;

  return data;
}

export async function getParadiseStories() {
  const { data, error } = await getSupabaseClient()
    .from("paradise_stories")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    authorId: row.author_id,
    authorName: "NOLERA User",
    mediaUrl: row.media_url,
    caption: row.caption,
    text: row.text,
    views: row.views || 0,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
  })) as ParadiseStory[];
}

export async function createParadiseStory(
  input: Omit<
    ParadiseStory,
    "id" | "views" | "createdAt" | "expiresAt"
  >
) {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_stories")
    .insert({
      author_id: user.id,
      media_url: input.mediaUrl || null,
      caption: input.caption || null,
      text: input.text || null,
      expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    authorId: data.author_id,
    authorName: "NOLERA User",
    mediaUrl: data.media_url,
    caption: data.caption,
    text: data.text,
    views: data.views || 0,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
  } as ParadiseStory;
}

export async function viewParadiseStory(storyId: string) {
  await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_stories")
    .select("views")
    .eq("id", storyId)
    .single();

  if (error) throw error;

  const { data: updated, error: updateError } = await getSupabaseClient()
    .from("paradise_stories")
    .update({ views: (data?.views || 0) + 1 })
    .eq("id", storyId)
    .select("*")
    .single();

  if (updateError) throw updateError;

  return updated;
}

export async function getFollowing() {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_follows")
    .select("following_id")
    .eq("follower_id", user.id);

  if (error) throw error;

  return (data || []).map((row) => row.following_id);
}

export async function isFollowing(userId: string) {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function toggleFollow(userId: string) {
  const user = await currentUser();

  const supabase = getSupabaseClient();

  const { data: existing, error: lookupError } = await supabase
    .from("paradise_follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (existing) {
    const { error } = await supabase
      .from("paradise_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", userId);

    if (error) throw error;

    return false;
  }

  const { error } = await supabase
    .from("paradise_follows")
    .insert({
      follower_id: user.id,
      following_id: userId,
    });

  if (error) throw error;

  return true;
}

export async function getParadiseMessages(
  userId?: string,
  otherUserId?: string
) {
  const user = await currentUser();

  if (userId && userId !== user.id) {
    throw new Error("Unauthorized user context");
  }

  let query = getSupabaseClient()
    .from("paradise_messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (otherUserId) {
    query = query.or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    text: row.text,
    createdAt: row.created_at,
    read: row.read,
  })) as ParadiseMessage[];
}

export async function sendParadiseMessage(
  input: Omit<ParadiseMessage, "id" | "createdAt" | "read">
) {
  const user = await currentUser();

  if (input.senderId !== user.id) {
    throw new Error("Sender must be the authenticated user");
  }

  const { data, error } = await getSupabaseClient()
    .from("paradise_messages")
    .insert({
      sender_id: user.id,
      receiver_id: input.receiverId,
      text: input.text,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    senderId: data.sender_id,
    receiverId: data.receiver_id,
    text: data.text,
    createdAt: data.created_at,
    read: data.read,
  } as ParadiseMessage;
}

export async function markParadiseMessageRead(messageId: string) {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_messages")
    .update({ read: true })
    .eq("id", messageId)
    .eq("receiver_id", user.id)
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function getParadiseGroups() {
  const { data, error } = await getSupabaseClient()
    .from("paradise_groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    ownerId: row.owner_id,
    members: row.members || 1,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  })) as ParadiseGroup[];
}

export async function createParadiseGroup(
  input: Omit<ParadiseGroup, "id" | "members" | "createdAt">
) {
  const user = await currentUser();

  const { data, error } = await getSupabaseClient()
    .from("paradise_groups")
    .insert({
      name: input.name,
      description: input.description,
      owner_id: user.id,
      members: 1,
      image_url: input.imageUrl || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    ownerId: data.owner_id,
    members: data.members,
    imageUrl: data.image_url,
    createdAt: data.created_at,
  } as ParadiseGroup;
}

export async function getParadiseFeed() {
  return getParadisePosts();
}

export const createPost = createParadisePost;
export const createStory = createParadiseStory;
export const getFeed = getParadiseFeed;
export const getStories = getParadiseStories;


export async function resetParadiseDemo() {
  throw new Error("Demo reset is disabled. Paradise uses backend data only.");
}

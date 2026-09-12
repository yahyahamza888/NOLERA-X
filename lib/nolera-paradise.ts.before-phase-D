"use client";

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

const POSTS_KEY = "nolera-paradise-posts-v1";
const COMMENTS_KEY = "nolera-paradise-comments-v1";
const STORIES_KEY = "nolera-paradise-stories-v1";
const MESSAGES_KEY = "nolera-paradise-messages-v1";
const GROUPS_KEY = "nolera-paradise-groups-v1";
const FOLLOWING_KEY = "nolera-paradise-following-v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

/* POSTS */

export function getParadisePosts() {
  return read<ParadisePost[]>(POSTS_KEY, []);
}

export function createParadisePost(
  input: Omit<
    ParadisePost,
    "id" | "likes" | "comments" | "shares" | "liked" | "createdAt"
  >
) {
  const posts = getParadisePosts();

  const post: ParadisePost = {
    ...input,
    id: createId("POST"),
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(post);
  write(POSTS_KEY, posts);

  return post;
}

export function deleteParadisePost(postId: string) {
  write(
    POSTS_KEY,
    getParadisePosts().filter((post) => post.id !== postId)
  );
}

export function toggleParadiseLike(postId: string) {
  const posts = getParadisePosts();
  const post = posts.find((item) => item.id === postId);

  if (!post) return null;

  post.liked = !post.liked;
  post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));

  write(POSTS_KEY, posts);

  return post;
}

export function shareParadisePost(postId: string) {
  const posts = getParadisePosts();
  const post = posts.find((item) => item.id === postId);

  if (!post) return null;

  post.shares += 1;
  write(POSTS_KEY, posts);

  return post;
}

/* COMMENTS */

export function getParadiseComments(postId?: string) {
  const comments = read<ParadiseComment[]>(COMMENTS_KEY, []);

  return postId
    ? comments.filter((comment) => comment.postId === postId)
    : comments;
}

export function addParadiseComment(
  input: Omit<ParadiseComment, "id" | "likes" | "createdAt">
) {
  const comments = getParadiseComments();

  const comment: ParadiseComment = {
    ...input,
    id: createId("COMMENT"),
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  comments.push(comment);
  write(COMMENTS_KEY, comments);

  const posts = getParadisePosts();
  const post = posts.find((item) => item.id === input.postId);

  if (post) {
    post.comments += 1;
    write(POSTS_KEY, posts);
  }

  return comment;
}

/* STORIES */

export function getParadiseStories() {
  const now = Date.now();

  return read<ParadiseStory[]>(STORIES_KEY, []).filter(
    (story) => new Date(story.expiresAt).getTime() > now
  );
}

export function createParadiseStory(
  input: Omit<
    ParadiseStory,
    "id" | "views" | "createdAt" | "expiresAt"
  >
) {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

  const stories = getParadiseStories();

  const story: ParadiseStory = {
    ...input,
    id: createId("STORY"),
    views: 0,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  stories.unshift(story);
  write(STORIES_KEY, stories);

  return story;
}

export function viewParadiseStory(storyId: string) {
  const stories = getParadiseStories();
  const story = stories.find((item) => item.id === storyId);

  if (!story) return null;

  story.views += 1;
  write(STORIES_KEY, stories);

  return story;
}

/* FOLLOWING */

export function getFollowing() {
  return read<string[]>(FOLLOWING_KEY, []);
}

export function isFollowing(userId: string) {
  return getFollowing().includes(userId);
}

export function toggleFollow(userId: string) {
  const following = getFollowing();
  const index = following.indexOf(userId);

  if (index >= 0) {
    following.splice(index, 1);
  } else {
    following.push(userId);
  }

  write(FOLLOWING_KEY, following);

  return index < 0;
}

/* MESSAGES */

export function getParadiseMessages(
  userId?: string,
  otherUserId?: string
) {
  const messages = read<ParadiseMessage[]>(MESSAGES_KEY, []);

  if (!userId || !otherUserId) return messages;

  return messages.filter(
    (message) =>
      (message.senderId === userId &&
        message.receiverId === otherUserId) ||
      (message.senderId === otherUserId &&
        message.receiverId === userId)
  );
}

export function sendParadiseMessage(
  input: Omit<ParadiseMessage, "id" | "createdAt" | "read">
) {
  const messages = read<ParadiseMessage[]>(MESSAGES_KEY, []);

  const message: ParadiseMessage = {
    ...input,
    id: createId("MSG"),
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.push(message);
  write(MESSAGES_KEY, messages);

  return message;
}

export function markParadiseMessageRead(messageId: string) {
  const messages = read<ParadiseMessage[]>(MESSAGES_KEY, []);
  const message = messages.find((item) => item.id === messageId);

  if (!message) return null;

  message.read = true;
  write(MESSAGES_KEY, messages);

  return message;
}

/* GROUPS */

export function getParadiseGroups() {
  return read<ParadiseGroup[]>(GROUPS_KEY, []);
}

export function createParadiseGroup(
  input: Omit<ParadiseGroup, "id" | "members" | "createdAt">
) {
  const groups = getParadiseGroups();

  const group: ParadiseGroup = {
    ...input,
    id: createId("GROUP"),
    members: 1,
    createdAt: new Date().toISOString(),
  };

  groups.unshift(group);
  write(GROUPS_KEY, groups);

  return group;
}

/* FEED */

export function getParadiseFeed() {
  return getParadisePosts().sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
}

/* PAGE COMPATIBILITY */

export const createPost = createParadisePost;

export const createStory = createParadiseStory;

export const getFeed = getParadiseFeed;

export const getStories = getParadiseStories;

export function toggleLike(postId: string, _userId?: string) {
  return toggleParadiseLike(postId);
}

/* RESET */

export function resetParadiseDemo() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(POSTS_KEY);
  localStorage.removeItem(COMMENTS_KEY);
  localStorage.removeItem(STORIES_KEY);
  localStorage.removeItem(MESSAGES_KEY);
  localStorage.removeItem(GROUPS_KEY);
  localStorage.removeItem(FOLLOWING_KEY);
}

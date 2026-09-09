"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Camera,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Sparkles,
  Store,
  Users,
  Video,
  UserPlus,
} from "lucide-react";

import {
  createPost,
  createStory,
  getFeed,
  getStories,
  toggleFollow,
  toggleLike,
  type ParadisePost,
  type ParadiseStory,
} from "@/lib/nolera-paradise";

const currentUserId = "NXR-DEMO-USER";

export default function ParadisePage() {
  const [posts, setPosts] = useState<ParadisePost[]>([]);
  const [stories, setStories] = useState<ParadiseStory[]>([]);
  const [composer, setComposer] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [following, setFollowing] = useState<string[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setPosts(getFeed());
    setStories(getStories());
  }

  function publishPost() {
    const text = composer.trim();

    if (!text) return;

    createPost({
      authorId: currentUserId,
      authorName: "NOLERA User",
      type: "text",
      content: text,
    });

    setComposer("");
    refresh();
  }

  function addStory() {
    createStory({
      authorId: currentUserId,
      authorName: "NOLERA User",
      mediaUrl: "",
      caption: "Welcome to NOLERA PARADISE",
    });

    refresh();
  }

  function likePost(post: ParadisePost) {
    toggleLike(post.id, currentUserId);
    refresh();
  }

  function follow(authorId: string) {
    toggleFollow(currentUserId, authorId);

    setFollowing((items) =>
      items.includes(authorId)
        ? items.filter((id) => id !== authorId)
        : [...items, authorId]
    );
  }

  const visiblePosts = useMemo(() => {
    if (activeTab === "Following") {
      return posts.filter(
        (post) =>
          post.authorId === currentUserId ||
          following.includes(post.authorId)
      );
    }

    return posts;
  }, [posts, activeTab, following]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <div>
            <p className="text-xs font-bold tracking-widest text-purple-600">
              NOLERA X
            </p>

            <h1 className="text-2xl font-black">
              PARADISE
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full bg-slate-100 p-2.5">
              <Bell size={20} />
            </button>

            <button className="rounded-full bg-slate-100 p-2.5">
              <MessageCircle size={20} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
              N
            </div>
          </div>

        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,650px)_260px]">

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

            <NavButton
              active={activeTab === "Home"}
              label="Home"
              icon={<Sparkles size={18} />}
              onClick={() => setActiveTab("Home")}
            />

            <NavButton
              active={activeTab === "Following"}
              label="Following"
              icon={<Users size={18} />}
              onClick={() => setActiveTab("Following")}
            />

            <NavButton
              active={activeTab === "Messages"}
              label="Messages"
              icon={<MessageCircle size={18} />}
              onClick={() => setActiveTab("Messages")}
            />

            <NavButton
              active={activeTab === "Market"}
              label="Market"
              icon={<Store size={18} />}
              onClick={() => setActiveTab("Market")}
            />

            <NavButton
              active={activeTab === "Profile"}
              label="Profile"
              icon={<Users size={18} />}
              onClick={() => setActiveTab("Profile")}
            />

          </div>
        </aside>

        <section className="min-w-0">

          <div className="mb-5 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex gap-4">

              <button
                onClick={addStory}
                className="flex min-w-[82px] flex-col items-center gap-2"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-purple-500 bg-purple-50 text-purple-600">
                  <Camera size={23} />
                </div>

                <span className="text-xs font-semibold">
                  Add Story
                </span>
              </button>

              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex min-w-[82px] flex-col items-center gap-2"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-1">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white font-bold">
                      {story.authorName.charAt(0)}
                    </div>
                  </div>

                  <span className="max-w-[80px] truncate text-xs">
                    {story.authorName}
                  </span>
                </div>
              ))}

            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                N
              </div>

              <textarea
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="What's happening in Paradise?"
                className="min-h-[90px] flex-1 resize-none rounded-2xl bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-purple-200"
              />

            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

              <div className="flex gap-2">
                <button className="rounded-xl bg-slate-50 p-2 text-slate-600">
                  <ImageIcon size={19} />
                </button>

                <button className="rounded-xl bg-slate-50 p-2 text-slate-600">
                  <Video size={19} />
                </button>

                <button className="rounded-xl bg-slate-50 p-2 text-slate-600">
                  <Sparkles size={19} />
                </button>
              </div>

              <button
                onClick={publishPost}
                disabled={!composer.trim()}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
              >
                <Send size={17} />
                Post
              </button>

            </div>
          </div>

          <div className="space-y-5">

            {visiblePosts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <Sparkles className="mx-auto mb-3 text-purple-500" size={34} />

                <h2 className="font-bold">
                  Welcome to Paradise
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Be the first to share something with the community.
                </p>
              </div>
            ) : (
              visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onLike={() => likePost(post)}
                  onFollow={() => follow(post.authorId)}
                  isFollowing={following.includes(post.authorId)}
                />
              ))
            )}

          </div>

        </section>

        <aside className="hidden lg:block">

          <div className="sticky top-24 space-y-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Sparkles size={23} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Paradise AI
                  </h2>

                  <p className="text-xs text-slate-500">
                    Create with AI
                  </p>
                </div>
              </div>

              <button className="mt-4 w-full rounded-xl bg-purple-600 py-2.5 text-sm font-bold text-white">
                Open AI Creator
              </button>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold">
                  Discover
                </h2>

                <MoreHorizontal size={18} className="text-slate-400" />
              </div>

              <div className="space-y-4">

                <DiscoverItem name="NOLERA Community" />
                <DiscoverItem name="Digital Creators" />
                <DiscoverItem name="Marketplace" />

              </div>

            </div>

          </div>

        </aside>

      </div>
    </main>
  );
}

function PostCard({
  post,
  currentUserId,
  onLike,
  onFollow,
  isFollowing,
}: {
  post: ParadisePost;
  currentUserId: string;
  onLike: () => void;
  onFollow: () => void;
  isFollowing: boolean;
}) {
  const liked = post.likes.includes(currentUserId);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div className="flex gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white">
            {post.authorName.charAt(0)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold">
                {post.authorName}
              </h3>

              {post.authorId !== currentUserId && (
                <button
                  onClick={onFollow}
                  className="text-xs font-semibold text-purple-600"
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}

            </div>

            <p className="text-xs text-slate-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

        </div>

        <button className="rounded-full p-2 text-slate-400 hover:bg-slate-50">
          <MoreHorizontal size={19} />
        </button>

      </div>

      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7">
        {post.content}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">

        <button
          onClick={onLike}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
            liked
              ? "bg-pink-50 text-pink-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {post.likes.length}
        </button>

        <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50">
          <MessageCircle size={18} />
          Comment
        </button>

        <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50">
          <Share2 size={18} />
          Share
        </button>

      </div>

    </article>
  );
}

function NavButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
        active
          ? "bg-purple-50 text-purple-700"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DiscoverItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold">
          {name.charAt(0)}
        </div>

        <span className="text-sm font-semibold">
          {name}
        </span>
      </div>

      <UserPlus size={17} className="text-slate-400" />
    </div>
  );
}

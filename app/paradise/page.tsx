"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/lib/nolera-auth";
import MediaCapture from "@/components/media-capture";
import Link from "next/link";
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
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import {
  createPost,
  createStory,
  getFeed,
  getStories,
  toggleFollow,
  toggleLike,
  shareParadisePost,
  getParadiseComments,
  addParadiseComment,
  type ParadisePost,
  type ParadiseStory,
  type ParadiseComment,
} from "@/lib/nolera-paradise";

const EMPTY_USER_ID = "";

const storeProducts = [
  {
    id: "digital-starter",
    name: "Digital Creator Starter",
    description: "Tools and resources for digital creators.",
    price: "$9.99",
    icon: "✨",
  },
  {
    id: "ai-content-kit",
    name: "AI Content Kit",
    description: "Create social and digital content faster.",
    price: "$14.99",
    icon: "🤖",
  },
  {
    id: "nolera-template",
    name: "NOLERA Template Pack",
    description: "Premium templates for your next project.",
    price: "$19.99",
    icon: "🎨",
  },
];

export default function ParadisePage() {
  const [posts, setPosts] = useState<ParadisePost[]>([]);
  const [stories, setStories] = useState<ParadiseStory[]>([]);
  const [composer, setComposer] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState(EMPTY_USER_ID);
  const [currentUserName, setCurrentUserName] = useState("NOLERA User");
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [postMediaType, setPostMediaType] = useState<"image" | "video" | null>(null);
  const [storyMedia, setStoryMedia] = useState<string | null>(null);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        setCurrentUserId("");
        setPosts([]);
        setStories([]);
        setFollowing([]);
        return;
      }

      setCurrentUserId(user.id);
      setCurrentUserName(user.name || "NOLERA User");

      await refresh();
    } catch {
      setPosts([]);
      setStories([]);
      setFollowing([]);
    }
  }

  async function refresh() {
    if (!currentUserId) return;

    const [nextPosts, nextStories] = await Promise.all([
      getFeed(),
      getStories(),
    ]);

    setPosts(nextPosts);
    setStories(nextStories);
  }

  async function publishPost() {
    const text = composer.trim();
    if (!text) return;

    if (!currentUserId) return;

    await createPost({
      authorId: currentUserId,
      authorName: currentUserName,
      authorUsername: currentUserName.toLowerCase().replace(/\s+/g, "_"),
      type: postMediaType || "text",
      content: text,
      mediaUrl: postMedia || undefined,
    });

    setComposer("");
    refresh();
  }

  async function addStory() {
    createStory({
      authorId: currentUserId,
      authorName: currentUserName,
      mediaUrl: "",
      caption: "Welcome to NOLERA PARADISE",
    });

    await refresh();
  }

  async function likePost(post: ParadisePost) {
    toggleLike(post.id, currentUserId);
    refresh();
  }

  async function sharePost(post: ParadisePost) {
    await shareParadisePost(post.id);
    await refresh();
  }

  function follow(authorId: string) {
    toggleFollow(authorId);

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
            <h1 className="text-2xl font-black">PARADISE</h1>
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

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,650px)_280px]">
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

            <Link
              href="/store"
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-4 py-3 text-sm font-bold text-white"
            >
              <ShoppingBag size={18} />
              Open Store
            </Link>
          </div>
        </aside>

        <section className="min-w-0">
          {activeTab === "Market" ? (
            <MarketSection />
          ) : (
            <>
              <div className="mb-5 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex min-w-[82px] flex-col items-center gap-2">
                    <MediaCapture
                      label="Add Story"
                      accept="image/*,video/*"
                      capture="environment"
                      compact
                      onChange={(_, preview) => {
                        setStoryMedia(preview);
                        if (preview) {
                          setTimeout(() => addStory(), 50);
                        }
                      }}
                    />
                    <span className="text-xs font-semibold">Add Story</span>
                  </div>

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
                  <div className="flex items-center gap-2">
                    <MediaCapture
                      label="صورة"
                      accept="image/*"
                      compact
                      onChange={(_, preview) => {
                        setPostMedia(preview);
                        setPostMediaType(preview ? "image" : null);
                      }}
                    />

                    <MediaCapture
                      label="فيديو"
                      accept="video/*"
                      capture="environment"
                      compact
                      onChange={(_, preview) => {
                        setPostMedia(preview);
                        setPostMediaType(preview ? "video" : null);
                      }}
                    />

                    <button
                      type="button"
                      className="rounded-xl bg-slate-50 p-2 text-slate-600"
                      title="AI"
                    >
                      <Sparkles size={19} />
                    </button>
                  </div>

                  <button
                    onClick={publishPost}
                    disabled={!composer.trim() && !postMedia}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"
                  >
                    <Send size={17} />
                    Post
                  </button>
                </div>
              </div>

              <div className="mb-5 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      NOLERA MARKET
                    </p>
                    <h2 className="text-xl font-black">Featured Products</h2>
                  </div>

                  <Link
                    href="/store"
                    className="flex items-center gap-1 text-sm font-bold text-purple-600"
                  >
                    View Store
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {storeProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/store?product=${product.id}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-xl">
                        {product.icon}
                      </div>

                      <h3 className="text-sm font-black">{product.name}</h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {product.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-black text-purple-600">
                          {product.price}
                        </span>
                        <ShoppingBag size={16} className="text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {visiblePosts.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                    <Sparkles
                      className="mx-auto mb-3 text-purple-500"
                      size={34}
                    />
                    <h2 className="font-bold">Welcome to Paradise</h2>
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
                      onShare={() => sharePost(post)}
                      onFollow={() => follow(post.authorId)}
                      onCommentAdded={() => void refresh()}
                      isFollowing={following.includes(post.authorId)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Sparkles size={23} />
                </div>

                <div>
                  <h2 className="font-bold">Paradise AI</h2>
                  <p className="text-xs text-slate-500">Create with AI</p>
                </div>
              </div>

              <Link
                href="/ai"
                className="mt-4 block w-full rounded-xl bg-purple-600 py-2.5 text-center text-sm font-bold text-white"
              >
                Open AI Creator
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold">Discover</h2>
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

function MarketSection() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-purple-700 to-purple-500 p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-100">
          NOLERA X
        </p>
        <h2 className="mt-2 text-3xl font-black">Marketplace</h2>
        <p className="mt-2 max-w-lg text-sm text-purple-100">
          Discover digital products and creator offerings inside the NOLERA ecosystem.
        </p>

        <Link
          href="/store"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-purple-700"
        >
          <ShoppingBag size={18} />
          Open NOLERA Store
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {storeProducts.map((product) => (
          <Link
            key={product.id}
            href={`/store?product=${product.id}`}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
              {product.icon}
            </div>

            <h3 className="mt-4 font-black">{product.name}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {product.description}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="font-black text-purple-600">
                {product.price}
              </span>
              <span className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700">
                View Product
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PostCard({
  post,
  currentUserId,
  onLike,
  onShare,
  onFollow,
  onCommentAdded,
  isFollowing,
}: {
  post: ParadisePost;
  currentUserId: string;
  onLike: () => void;
  onShare: () => void;
  onFollow: () => void;
  onCommentAdded: () => void;
  isFollowing: boolean;
}) {
  const liked = post.liked;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ParadiseComment[]>([]);
  const [commentText, setCommentText] = useState("");

  async function loadComments() {
    setComments(await getParadiseComments(post.id));
  }

  function toggleComments() {
    if (!showComments) void loadComments();
    setShowComments((v) => !v);
  }

  async function submitComment() {
    const text = commentText.trim();
    if (!text) return;

    await addParadiseComment({
      postId: post.id,
      authorId: currentUserId,
      authorName: "NOLERA User",
      content: text,
    });

    setCommentText("");
    await loadComments();
    onCommentAdded();
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white">
            {post.authorName.charAt(0)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold">{post.authorName}</h3>

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

      {post.mediaUrl && post.type === "image" && (
        <img
          src={post.mediaUrl}
          alt="Paradise post"
          className="mt-4 max-h-[520px] w-full rounded-2xl object-cover"
        />
      )}

      {post.mediaUrl && post.type === "video" && (
        <video
          src={post.mediaUrl}
          controls
          className="mt-4 max-h-[520px] w-full rounded-2xl bg-black object-contain"
        />
      )}

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
          {post.likes}
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
            showComments
              ? "bg-purple-50 text-purple-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <MessageCircle size={18} />
          {post.comments}
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
        >
          <Share2 size={18} />
          {post.shares}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-3 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="اكتب تعليقًا..."
              className="flex-1 rounded-xl bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              onClick={submitComment}
              disabled={!commentText.trim()}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-center text-xs text-slate-400">
              لا توجد تعليقات بعد
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-bold">{comment.authorName}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function DiscoverItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
          {name.charAt(0)}
        </div>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <button className="text-xs font-bold text-purple-600">View</button>
    </div>
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
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
        active ? "bg-purple-50 text-purple-600" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

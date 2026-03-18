"use client"

import { MessageSquare, Heart, Eye, Loader } from "lucide-react"
import { useEffect, useState } from "react"

interface CommunityPost {
  id: number
  title: string
  content: string
  author_name: string
  category: string
  likes: number
  comments_count: number
  created_at: string
}

export default function CommunityContent() {
  const categories = ["General", "Trading Basics", "Market Psychology", "Q&A", "Success Stories", "Technical Analysis"]

  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/community/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const json = await response.json()
      const postsArray = Array.isArray(json) ? json : (json.data || [])
      setPosts(postsArray)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author_name: authorName.trim() || "Anonymous",
          category,
        }),
      })

      if (!response.ok) throw new Error("Failed to create post")
      
      // Refetch posts to show the new one
      await fetchPosts()
      
      // Reset form
      setShowForm(false)
      setTitle("")
      setContent("")
      setAuthorName("")
      setCategory(categories[0])
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Unknown date"
    }
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Learn, share strategies, and grow together with traders worldwide. No sign-up needed!
          </p>
        </div>

        {/* Create Post CTA */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-95 transition"
          >
            {showForm ? "Cancel" : "Create New Post"}
          </button>
        </div>

        {/* Post Form */}
        {showForm && (
          <form
            onSubmit={handleNewPost}
            className="mb-10 bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Post title"
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              placeholder="Share your insight, question, or experience..."
              className="w-full px-4 py-2 rounded-md border border-border bg-background resize-none"
            />

            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional, leave empty for Anonymous)"
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />

            <div className="text-right">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2 ml-auto"
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        )}

        {/* Feed */}
        {!loading && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No posts yet. Be the first to share your trading insights!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition"
                >
                  {/* Category */}
                  <span className="inline-block mb-3 text-xs font-semibold tracking-wide text-accent">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {post.title}
                  </h2>

                  {/* Content */}
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{post.author_name}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1">
                        <Heart size={16} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}

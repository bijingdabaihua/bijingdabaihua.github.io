import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/post-card";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold text-text-dark mb-8 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-1 after:bg-brand after:rounded">
        Latest Posts
      </h1>
      {posts.length === 0 ? (
        <p className="text-text-secondary">No posts yet.</p>
      ) : (
        <div className="space-y-5">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

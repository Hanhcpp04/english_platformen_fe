import React from "react";
import PostCard from "./PostCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

export default function PostList({ posts, loading, onPostClick }) {
  if (loading) return <LoadingSkeleton />;
  if (!posts || posts.length === 0)
    return <EmptyState message="Chưa có bài đăng nào trong diễn đàn." />;
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
      ))}
    </div>
  );
}

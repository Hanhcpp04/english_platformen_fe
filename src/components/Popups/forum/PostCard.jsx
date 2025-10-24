import React from "react";
import { ThumbsUp, MessageCircle, Eye, Bookmark, Pin, Lock } from "lucide-react";

export default function PostCard({ post, onClick }) {
  const isPinned = post.pinned || false;
  const isLocked = post.locked || false;
  const maxTags = 2;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-lg hover:scale-[1.01] group ${
        isPinned ? "border-primary-600 border-2" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header: Avatar + Author + Time + Tag */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-dark-primary font-body truncate">
                {post.author.name}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 font-body">{post.created_at}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {post.tags.slice(0, maxTags).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 font-body"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > maxTags && (
                  <span className="text-xs text-gray-400 font-body">+{post.tags.length - maxTags}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title with Pin/Lock indicators */}
        <h3 className="font-heading font-bold text-lg text-dark-primary mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {isPinned && <Pin size={18} className="inline mr-1 text-primary-600" />}
          {isLocked && <Lock size={16} className="inline mr-1 text-gray-500" />}
          {post.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-700 text-sm line-clamp-3 mb-3 font-body">
          {post.content}
          {post.content.length > 150 && (
            <span className="text-primary-600 font-medium ml-1">Read more</span>
          )}
        </p>

        {/* Image Grid Preview (max 3 images) */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {post.images.slice(0, 3).map((img, idx) => (
              <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {idx === 2 && post.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">+{post.images.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer: Stats + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-gray-500 text-sm font-body">
            <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
              <ThumbsUp size={16} /> {post.likes_count}
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
              <MessageCircle size={16} /> {post.comments_count}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={16} /> {post.views || 0}
            </span>
          </div>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle save action
            }}
          >
            <Bookmark size={18} className="text-gray-400 hover:text-primary-600 transition-colors" />
          </button>
        </div>

        {/* Locked message */}
        {isLocked && (
          <div className="mt-2 text-xs text-gray-500 italic font-body">
            🔒 Comments locked
          </div>
        )}
      </div>
    </div>
  );
}

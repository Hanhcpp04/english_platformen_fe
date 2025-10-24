import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Bookmark, Share2, Heart, Check } from "lucide-react";
import { toast } from "react-toastify";

export default function PostActions({ post, onLike, onSave, onShare }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike && onLike(!liked);
    if (!liked) {
      toast.success("Đã thích bài viết!", { autoClose: 2000 });
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave && onSave(!saved);
    if (!saved) {
      toast.success("Đã lưu vào bộ sưu tập!", { autoClose: 2000 });
    } else {
      toast.info("Đã bỏ lưu", { autoClose: 2000 });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết!", { autoClose: 2000 });
    setShowShareMenu(false);
  };

  const scrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${
            liked
              ? "bg-red-50 text-red-600 border-2 border-red-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart size={20} className={liked ? "fill-current" : ""} />
          <span className="font-body">{post.likes_count + (liked ? 1 : 0)}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={scrollToComments}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle size={20} />
          <span className="font-body">{post.comments_count}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${
            saved
              ? "bg-primary-50 text-primary-600 border-2 border-primary-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Bookmark size={20} className={saved ? "fill-current" : ""} />
          <span className="hidden sm:inline font-body">{saved ? "Đã lưu" : "Lưu"}</span>
        </button>
      </div>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all hover:scale-105 active:scale-95"
        >
          <Share2 size={20} />
          <span className="hidden sm:inline font-body">Chia sẻ</span>
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden animate-fade-in">
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm font-body"
            >
              <Check size={16} /> Copy link
            </button>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm font-body"
              onClick={() => setShowShareMenu(false)}
            >
              Share to Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-sm font-body"
              onClick={() => setShowShareMenu(false)}
            >
              Share to Twitter
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

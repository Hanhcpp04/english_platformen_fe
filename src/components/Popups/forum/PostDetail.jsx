import React, { useState, useRef } from "react";
import { MoreVertical, Edit, Trash2, Pin, Lock, Calendar, Eye, MessageSquare, ThumbsUp } from "lucide-react";
import MediaGallery from "./MediaGallery";
import PostActions from "./PostActions";

export default function PostDetail({ post, isOwner = false, isAdmin = false }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleEdit = () => {
    // Navigate to edit page
    window.location.href = `/forum/edit/${post.id}`;
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      // Handle delete
      console.log("Delete post", post.id);
    }
  };

  const handlePin = () => {
    console.log("Pin/Unpin post", post.id);
  };

  const handleLock = () => {
    console.log("Lock/Unlock post", post.id);
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="p-6">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-heading font-bold text-lg text-dark-primary">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-500 font-body">@{post.author.username}</p>
              <p className="text-xs text-gray-400 mt-1 font-body">
                Member since {post.author.memberSince} • {post.author.totalPosts} posts • {post.author.totalComments} comments
              </p>
            </div>
          </div>

          {/* Action Menu */}
          {(isOwner || isAdmin) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden animate-fade-in">
                  {isOwner && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-red-600 font-body"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handlePin}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                      >
                        <Pin size={16} /> {post.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={handleLock}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                      >
                        <Lock size={16} /> {post.locked ? "Unlock" : "Lock"} comments
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-body">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            Posted {post.created_at}
          </span>
          {post.edited_at && (
            <span className="text-xs italic">• Edited {post.edited_at}</span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {post.views} views
          </span>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 font-body"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading font-bold text-3xl text-dark-primary mb-6 leading-tight">
          {post.pinned && <Pin size={24} className="inline mr-2 text-primary-600" />}
          {post.locked && <Lock size={20} className="inline mr-2 text-gray-500" />}
          {post.title}
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-6">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line font-body">
            {post.content}
          </div>
        </div>

        {/* Media Gallery */}
        <MediaGallery images={post.images} files={post.files} />

        {/* Actions */}
        <PostActions post={post} />
      </div>
    </article>
  );
}

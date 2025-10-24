import React, { useState } from "react";
import { ThumbsUp, Reply, Edit, Trash2, MoreVertical, Flag, Heart } from "lucide-react";
import CommentInput from "./CommentInput";

export default function CommentItem({ comment, onReply, level = 0, currentUserId = null }) {
  const [showReply, setShowReply] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  
  const isMine = comment.author.id === currentUserId || comment.author.name === "Bạn";
  const maxLevel = 5;
  const marginLeft = Math.min(level, maxLevel - 1) * 32; // ml-8 = 32px per level, max 4 levels

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    // Save edited comment
    console.log("Save edit:", editContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      console.log("Delete comment:", comment.id);
    }
    setShowMenu(false);
  };

  const handleReport = () => {
    console.log("Report comment:", comment.id);
    setShowMenu(false);
  };

  return (
    <div style={{ marginLeft: `${marginLeft}px` }} className="mb-3 group">
      <div className="flex gap-3">
        {/* Avatar */}
        <img 
          src={comment.author.avatar} 
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover shrink-0" 
        />
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-dark-primary font-body">
              {comment.author.name}
            </span>
            <span className="text-xs text-gray-500 font-body">
              {comment.created_at}
            </span>
            {comment.edited && (
              <span className="text-xs text-gray-400 italic font-body">(edited)</span>
            )}
            
            {/* Action Menu */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden animate-fade-in">
                  {isMine ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-red-600 font-body"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleReport}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-body"
                    >
                      <Flag size={14} /> Báo cáo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent font-body"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors font-body"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors font-body"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg px-3 py-2 mb-2 hover:bg-gray-100 transition-colors">
              <p className="text-gray-700 text-sm font-body whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-3 text-xs text-gray-500 font-body">
            <button
              className={`flex items-center gap-1 hover:text-primary-600 transition-colors ${
                liked ? "text-red-500" : ""
              }`}
              onClick={() => setLiked((v) => !v)}
            >
              <Heart size={14} className={liked ? "fill-current" : ""} />
              {comment.likes_count + (liked ? 1 : 0)}
            </button>
            
            {level < maxLevel && (
              <button
                className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                onClick={() => setShowReply((v) => !v)}
              >
                <Reply size={14} /> Trả lời
              </button>
            )}
          </div>
          
          {/* Reply Input */}
          {showReply && (
            <div className="mt-3">
              <CommentInput
                placeholder={`Trả lời ${comment.author.name}...`}
                onSubmit={(content) => {
                  onReply(content, comment.id);
                  setShowReply(false);
                }}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}
          
          {/* Nested Children Comments */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3">
              {comment.children.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  onReply={onReply}
                  level={level + 1}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

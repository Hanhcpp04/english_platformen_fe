import React, { useState } from "react";
import { MessageCircle, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import EmptyState from "./EmptyState";

// Enhanced mock comments with nested structure
const mockComments = [
  {
    id: 1,
    post_id: 1,
    parent_id: null,
    content: "Bài viết rất hữu ích! Mình đã áp dụng các tips này và thấy cải thiện rõ rệt.",
    author: {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    created_at: "2 giờ trước",
    edited_at: null,
    likes_count: 12,
    children: [
      {
        id: 2,
        post_id: 1,
        parent_id: 1,
        content: "Đồng ý! Mình cũng thấy vậy. Đặc biệt là phần về cách luyện tập hàng ngày.",
        author: {
          id: 3,
          name: "Nguyễn Văn C",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        created_at: "1 giờ trước",
        edited_at: null,
        likes_count: 5,
        children: [
          {
            id: 3,
            post_id: 1,
            parent_id: 2,
            content: "Các bạn có thể chia sẻ thêm về lịch trình luyện tập của mình không?",
            author: {
              id: 4,
              name: "Lê Thị D",
              avatar: "https://randomuser.me/api/portraits/women/50.jpg",
            },
            created_at: "30 phút trước",
            edited_at: null,
            likes_count: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    post_id: 1,
    parent_id: null,
    content: "Cảm ơn bạn đã chia sẻ! Mình có thêm vài tips nữa: ...",
    author: {
      id: 5,
      name: "Phạm Văn E",
      avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    },
    created_at: "1 ngày trước",
    edited_at: "23 giờ trước",
    likes_count: 8,
    children: [],
  },
];

export default function CommentsSection({ postId, isLocked = false }) {
  const [comments, setComments] = useState(mockComments);
  const [sortBy, setSortBy] = useState("recent");

  const sortOptions = [
    { id: "recent", label: "Mới nhất", icon: <Clock size={14} /> },
    { id: "popular", label: "Phổ biến", icon: <TrendingUp size={14} /> },
    { id: "oldest", label: "Cũ nhất", icon: <MessageCircle size={14} /> },
  ];

  // Add new comment
  const handleAddComment = (content, parentId) => {
    const newComment = {
      id: Date.now(),
      post_id: postId,
      parent_id: parentId,
      content,
      author: {
        id: 999,
        name: "Bạn",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      },
      created_at: "Vừa xong",
      edited_at: null,
      likes_count: 0,
      children: [],
    };

    if (!parentId) {
      setComments([newComment, ...comments]);
    } else {
      // Add nested reply
      const addReply = (commentsList) => {
        return commentsList.map((c) => {
          if (c.id === parentId) {
            return { ...c, children: [...c.children, newComment] };
          }
          if (c.children.length > 0) {
            return { ...c, children: addReply(c.children) };
          }
          return c;
        });
      };
      setComments(addReply(comments));
    }
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes_count - a.likes_count;
    } else if (sortBy === "oldest") {
      return a.id - b.id;
    }
    return b.id - a.id; // recent (default)
  });

  return (
    <section id="comments-section" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-xl text-dark-primary flex items-center gap-2">
          <MessageCircle size={24} className="text-primary-600" />
          {comments.length} Bình luận
        </h3>

        {/* Sort Dropdown */}
        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-body">Sắp xếp:</span>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 font-body ${
                    sortBy === option.id
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comment Input */}
      {!isLocked && (
        <div className="mb-6">
          <CommentInput
            onSubmit={(content) => handleAddComment(content, null)}
            placeholder="Chia sẻ suy nghĩ của bạn..."
          />
        </div>
      )}

      {isLocked && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-600 font-body">
            🔒 Bình luận đã bị khóa bởi quản trị viên
          </p>
        </div>
      )}

      {/* Comments List */}
      {sortedComments.length === 0 ? (
        <EmptyState message="Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!" />
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleAddComment}
              level={0}
              currentUserId={999}
            />
          ))}
        </div>
      )}
    </section>
  );
}

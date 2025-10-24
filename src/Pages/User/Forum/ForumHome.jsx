import React, { useState, useMemo } from "react";
import { Link,useNavigate } from "react-router-dom";
import PostList from "../../../components/Popups/forum/PostCard";
import ForumHeader from "../../../components/Popups/forum/ForumHeader";
import ForumSidebar from "../../../components/Popups/forum/ForumSidebar";
import FilterBar from "../../../components/Popups/forum/FilterBar";
import Pagination from "../../../components/Popups/forum/Pagination";
import { Plus } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "How to improve IELTS Writing Task 2?",
    content:
      "I've been struggling with IELTS Writing Task 2. Can anyone share tips on how to structure essays better and improve band score? Any recommended resources?",
    author: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    created_at: "2 giờ trước",
    likes_count: 45,
    comments_count: 23,
    views: 156,
    tags: ["IELTS", "Writing"],
    images: [],
    pinned: true,
    locked: false,
  },
  {
    id: 2,
    title: "Kinh nghiệm luyện nghe tiếng Anh qua Podcast",
    content:
      "Hãy nghe podcast, xem phim không phụ đề và ghi chú lại các từ mới. Đừng ngại nghe đi nghe lại nhiều lần để quen với các giọng nói khác nhau. Mình recommend BBC Learning English và TED Talks.",
    author: {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    created_at: "5 giờ trước",
    likes_count: 32,
    comments_count: 15,
    views: 234,
    tags: ["Listening", "Tips"],
    images: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400"],
    pinned: false,
    locked: false,
  },
  {
    id: 3,
    title: "Top 10 Common Grammar Mistakes Vietnamese Learners Make",
    content:
      "After years of teaching English, I've noticed these recurring grammar mistakes. Let's discuss and learn together! Articles (a/an/the), Present Perfect vs Simple Past, Prepositions...",
    author: {
      id: 3,
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    created_at: "1 ngày trước",
    likes_count: 67,
    comments_count: 42,
    views: 589,
    tags: ["Grammar", "Tips"],
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    ],
    pinned: false,
    locked: false,
  },
  {
    id: 4,
    title: "Free Speaking Practice Session - Join us this Saturday!",
    content:
      "We're organizing a free online speaking practice session this Saturday 2PM. All levels welcome! Topics: Daily conversations, IELTS Speaking Part 1-2-3. Limited slots available!",
    author: {
      id: 4,
      name: "Lê Thị Mai",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    created_at: "3 giờ trước",
    likes_count: 89,
    comments_count: 56,
    views: 412,
    tags: ["Speaking", "Event"],
    images: [],
    pinned: false,
    locked: true,
  },
  {
    id: 5,
    title: "Best YouTube Channels for Learning English",
    content:
      "Sharing my favorite YouTube channels that helped me improve from B1 to C1 level. These are free and super effective!",
    author: {
      id: 5,
      name: "Phạm Văn C",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    created_at: "4 ngày trước",
    likes_count: 120,
    comments_count: 78,
    views: 892,
    tags: ["Resources", "Tips"],
    images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400"],
    pinned: false,
    locked: false,
  },
  {
    id: 6,
    title: "Chia sẻ bộ flashcard 3000 từ TOEIC",
    content:
      "Mình vừa tổng hợp xong bộ flashcard 3000 từ vựng TOEIC theo từng chủ đề. Ai cần thì comment bên dưới nhé!",
    author: {
      id: 6,
      name: "Đỗ Thị D",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    created_at: "10 ngày trước",
    likes_count: 234,
    comments_count: 145,
    views: 1523,
    tags: ["TOEIC", "Vocabulary", "Resources"],
    images: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400",
    ],
    pinned: false,
    locked: false,
  },
  {
    id: 7,
    title: "English Pronunciation Tips for Vietnamese Speakers",
    content:
      "Struggling with TH sounds? Can't differentiate between /l/ and /r/? Let's practice together and share techniques!",
    author: {
      id: 7,
      name: "Michael Brown",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    created_at: "15 ngày trước",
    likes_count: 78,
    comments_count: 34,
    views: 456,
    tags: ["Pronunciation", "Tips"],
    images: [],
    pinned: false,
    locked: false,
  },
  {
    id: 8,
    title: "Study Abroad Experience - UK Universities",
    content:
      "I just finished my Master's in the UK. Happy to answer questions about application process, scholarships, IELTS requirements, and student life!",
    author: {
      id: 8,
      name: "Hoàng Thị E",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    created_at: "20 ngày trước",
    likes_count: 156,
    comments_count: 89,
    views: 1234,
    tags: ["Study Abroad", "IELTS"],
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    ],
    pinned: false,
    locked: false,
  },
];

export default function ForumHome() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("new");
  const [timeFilter, setTimeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const totalPages = 3;

  // Helper function to parse time ago string to date
  const parseTimeAgo = (timeAgo) => {
    const now = new Date();
    if (timeAgo.includes("giờ trước")) {
      const hours = parseInt(timeAgo);
      return new Date(now - hours * 60 * 60 * 1000);
    } else if (timeAgo.includes("ngày trước")) {
      const days = parseInt(timeAgo);
      return new Date(now - days * 24 * 60 * 60 * 1000);
    } else if (timeAgo.includes("tuần trước")) {
      const weeks = parseInt(timeAgo);
      return new Date(now - weeks * 7 * 24 * 60 * 60 * 1000);
    } else if (timeAgo.includes("tháng trước")) {
      const months = parseInt(timeAgo);
      return new Date(now - months * 30 * 24 * 60 * 60 * 1000);
    }
    return now;
  };

  // Filter posts by time
  const filterByTime = (posts, timeFilter) => {
    if (timeFilter === "all") return posts;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    return posts.filter(post => {
      const postDate = parseTimeAgo(post.created_at);
      
      switch (timeFilter) {
        case "today":
          return postDate >= today;
        case "week":
          return postDate >= weekAgo;
        case "month":
          return postDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const posts = useMemo(() => {
    let filtered = [...mockPosts];
    
    // Apply time filter first
    filtered = filterByTime(filtered, timeFilter);
    
    // Separate pinned posts
    const pinnedPosts = filtered.filter(post => post.pinned);
    const regularPosts = filtered.filter(post => !post.pinned);
    
    // Apply sorting based on filter type
    let sortedPosts = [...regularPosts];
    
    if (filter === "hot") {
      // Hot: based on combination of likes and comments (engagement)
      sortedPosts.sort((a, b) => 
        (b.likes_count + b.comments_count * 2) - (a.likes_count + a.comments_count * 2)
      );
    } else if (filter === "top") {
      // Top: based on likes only
      sortedPosts.sort((a, b) => b.likes_count - a.likes_count);
    } else if (filter === "active") {
      // Active: based on comments (recent activity)
      sortedPosts.sort((a, b) => b.comments_count - a.comments_count);
    } else {
      // New: based on post ID (newest first)
      sortedPosts.sort((a, b) => b.id - a.id);
    }
    
    // Pin posts always on top, then sorted posts
    return [...pinnedPosts, ...sortedPosts];
  }, [filter, timeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ForumHeader /> */}

      <div className="container mx-auto px-4 py-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Sticky but respects footer, hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
                
              <ForumSidebar />
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <main className="lg:col-span-3">
            <FilterBar 
              onFilterChange={setFilter}
              onTimeChange={setTimeFilter}
            />

            <PostList 
              posts={posts} 
              loading={loading} 
              onPostClick={(id) => navigate(`/forum/${id}`)} 
            />

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
        onClick={() => navigate("/forum/create")}
        aria-label="Tạo bài mới"
      >
        <Plus size={28} />
        <span className="absolute right-full mr-3 bg-dark-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tạo bài mới
        </span>
      </button>
    </div>
  );
}

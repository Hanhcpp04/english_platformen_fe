-- ===============================================
-- ENGLISH LEARNING PLATFORM DATABASE SCHEMA
-- ===============================================
-- Hệ thống học tiếng Anh với gamification
-- Bao gồm: Từ vựng, Ngữ pháp, Viết, Diễn đàn
-- ===============================================

-- ===============================================
-- 1. BẢNG QUẢN LÝ NGƯỜI DÙNG
-- ===============================================

-- Bảng users: Lưu thông tin người dùng
-- Hỗ trợ đăng ký thường và social login (Google, Facebook)
-- Tích hợp hệ thống gamification với total_xp
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,           -- Tên đăng nhập duy nhất
    email VARCHAR(255) UNIQUE NOT NULL,              -- Email duy nhất
    password_hash VARCHAR(255) NULL,                 -- Hash password (NULL nếu social login)
    fullname VARCHAR(255) NOT NULL,                  -- Họ tên đầy đủ
    avatar VARCHAR(500) NULL,                        -- URL avatar
    role ENUM('admin', 'student', 'teacher') DEFAULT 'student', -- Vai trò trong hệ thống
    
    -- Thông tin social login
    google_id VARCHAR(255) NULL UNIQUE,              -- Google ID cho OAuth
    facebook_id VARCHAR(255) NULL UNIQUE,            -- Facebook ID cho OAuth
    
    -- Hệ thống gamification
    total_xp INT DEFAULT 0 CHECK (total_xp >= 0),   -- Tổng điểm kinh nghiệm
    
    -- Trạng thái tài khoản
    is_active BOOLEAN DEFAULT TRUE,                  -- Tài khoản có hoạt động không
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Ngày cập nhật cuối
    
    -- Indexes để tối ưu hiệu suất
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_total_xp (total_xp),
    INDEX idx_role (role)
);

-- ===============================================
-- 2. HỆ THỐNG GAMIFICATION
-- ===============================================

-- Bảng levels: Định nghĩa các cấp độ trong hệ thống
-- Không cần quan hệ trực tiếp với users, chỉ JOIN khi cần
-- Level được tính dựa trên total_xp của user
CREATE TABLE levels (
    level_number INT PRIMARY KEY,                    -- Số cấp độ (1, 2, 3...)
    level_name VARCHAR(100) NOT NULL,                -- Tên cấp độ (Beginner, Intermediate...)
    min_xp INT NOT NULL,                            -- Điểm XP tối thiểu để đạt level
    max_xp INT NULL,                                -- Điểm XP tối đa (NULL cho level cao nhất)
    description TEXT NULL,                          -- Mô tả cấp độ
    icon_url VARCHAR(500) NULL,                     -- Icon đại diện cho level
    
    -- Index để tối ưu việc tìm level dựa trên XP
    INDEX idx_xp_range (min_xp, max_xp)
);

-- Bảng badges: Định nghĩa các huy hiệu/thành tựu
-- Người dùng có thể đạt được dựa trên các điều kiện khác nhau
    CREATE TABLE badges (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,                     -- Tên huy hiệu
        description TEXT NOT NULL,                      -- Mô tả chi tiết
        icon_url VARCHAR(500) NULL,                     -- URL icon huy hiệu
        
        -- Điều kiện để đạt được huy hiệu
        condition_type ENUM(
            'vocabulary',    -- Hoàn thành từ vựng
            'grammar',       -- Hoàn thành ngữ pháp  
            'listening',     -- Kỹ năng nghe
            'reading',       -- Kỹ năng đọc
            'writing',       -- Kỹ năng viết
            'testing',       -- Làm bài test
            'forum',         -- Hoạt động forum
            'streak',        -- Học liên tục nhiều ngày
            'accuracy'       -- Độ chính xác cao
        ) NOT NULL,
        condition_value INT NOT NULL,                   -- Giá trị điều kiện (VD: 100 từ vựng)
        xp_reward INT DEFAULT 0 CHECK (xp_reward >= 0), -- Điểm thưởng khi đạt huy hiệu
        
        -- Trạng thái
        is_active BOOLEAN DEFAULT TRUE,                 -- Huy hiệu có đang hoạt động
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Index cho hiệu suất
        INDEX idx_condition (condition_type, condition_value),
        INDEX idx_active (is_active)
    );

-- Bảng user_badges: Lưu huy hiệu mà người dùng đã đạt được
-- Quan hệ nhiều-nhiều giữa users và badges
CREATE TABLE user_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm đạt được huy hiệu
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    -- Đảm bảo user không nhận trùng huy hiệu
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    -- Index để tối ưu truy vấn
    INDEX idx_user_earned (user_id, earned_at),
    INDEX idx_badge_earned (badge_id, earned_at)
);
-- ===============================================
-- 3. HỆ THỐNG TỪ VỰNG
-- ===============================================
-- Bảng vocab_topics: Chủ đề từ vựng (Animals, Food, Travel...)
CREATE TABLE vocab_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,                     -- Tên chủ đề
    description TEXT NULL,                          -- Mô tả chi tiết chủ đề
    thumbnail_url VARCHAR(500) NULL,                -- Ảnh đại diện chủ đề
    xp_reward INT DEFAULT 100 CHECK (xp_reward >= 0), -- Điểm thưởng khi hoàn thành chủ đề
    total_words INT DEFAULT 0,                      -- Tổng số từ trong chủ đề
    -- Trạng thái và thời gian
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_active (is_active)
);

-- Bảng vocab_words: Từ vựng trong từng chủ đề
CREATE TABLE vocab_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,                          -- Thuộc chủ đề nào
    
    -- Thông tin từ vựng
    english_word VARCHAR(255) NOT NULL,             -- Từ tiếng Anh
    vietnamese_meaning TEXT NOT NULL,               -- Nghĩa tiếng Việt
    pronunciation VARCHAR(255) NULL,                -- Phiên âm (IPA)
    audio_url VARCHAR(500) NULL,                    -- File âm thanh phát âm
    image_url VARCHAR(500) NULL,                    -- Ảnh minh họa
    
    -- Ví dụ sử dụng
    example_sentence TEXT NULL,                     -- Câu ví dụ tiếng Anh
    example_translation TEXT NULL,                  -- Dịch câu ví dụ
    
    -- Thông tin bổ sung
    word_type VARCHAR(100) NULL,                    -- Loại từ (noun, verb, adjective...)
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    usage_frequency ENUM('common', 'uncommon', 'rare') DEFAULT 'common',
    
    -- Gamification
    xp_reward INT DEFAULT 3 CHECK (xp_reward >= 0), -- Điểm thưởng khi học từ
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    
    -- Index để tối ưu
    INDEX idx_topic_active (topic_id, is_active),
    INDEX idx_english_word (english_word),
    INDEX idx_difficulty (difficulty_level)
);

-- Bảng exercise_type: Loại bài tập từ vựng (Multiple choice, Fill blank...)
CREATE TABLE vocab_exercise_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,                     -- Tên loại bài tập
    topic_id INT NOT NULL,                          -- Thuộc chủ đề nào
    description TEXT NULL,                          -- Mô tả loại bài tập
    instruction TEXT NULL,                          -- Hướng dẫn làm bài
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_topic_active (topic_id, is_active)
);

-- Bảng vocab_exercise_questions: Câu hỏi bài tập từ vựng
CREATE TABLE vocab_exercise_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,                           -- Thuộc loại bài tập nào
    word_id INT NULL,                               -- Liên kết với từ vựng (có thể NULL)
    
    -- Nội dung câu hỏi
    question TEXT NOT NULL,                         -- Câu hỏi
    options JSON NULL,                              -- Các lựa chọn (dạng JSON array)
    correct_answer TEXT NOT NULL,                   -- Đáp án đúng
    explanation TEXT NULL,                          -- Giải thích đáp án
    
    -- Gamification và độ khó
    xp_reward INT DEFAULT 5 CHECK (xp_reward >= 0),
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (type_id) REFERENCES vocab_exercise_types(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES vocab_words(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_type_active (type_id, is_active),
    INDEX idx_word_id (word_id),
    INDEX idx_difficulty (difficulty_level)
);

-- Bảng user_vocab_progress: Tiến độ học từ vựng của người dùng
CREATE TABLE user_vocab_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,                          -- Chủ đề đang học
    word_id INT NULL,                               -- Từ vựng cụ thể (nếu có)
    question_id INT NULL,                           -- Câu hỏi bài tập (nếu có)
    
    -- Loại hoạt động
    activity_type ENUM('flashcard', 'exercise', 'review') NOT NULL,
    
    -- Kết quả
    is_completed BOOLEAN DEFAULT FALSE,             -- Đã hoàn thành chưa
    score INT NULL CHECK (score >= 0 AND score <= 100), -- Điểm số (0-100)
    attempts INT DEFAULT 1 CHECK (attempts > 0),    -- Số lần thử
    time_spent INT NULL,                            -- Thời gian làm bài (giây)
    
    -- Thời gian
    completed_at TIMESTAMP NULL,                    -- Thời điểm hoàn thành
    last_reviewed TIMESTAMP NULL,                   -- Lần ôn tập cuối
    next_review TIMESTAMP NULL,                     -- Lần ôn tập tiếp theo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES vocab_words(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES vocab_exercise_questions(id) ON DELETE CASCADE,
    
    -- Index để tối ưu truy vấn
    INDEX idx_user_topic (user_id, topic_id),
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_next_review (next_review),
    INDEX idx_completed (is_completed, completed_at)
);

-- ===============================================
-- 4. HỆ THỐNG NGỮ PHÁP
-- ===============================================

-- Bảng grammar_topics: Chủ đề ngữ pháp (Present Tense, Passive Voice...)
CREATE TABLE grammar_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,                     -- Tên chủ đề ngữ pháp
    description TEXT NULL,                          -- Mô tả chi tiết
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    prerequisite_topics JSON NULL,                  -- Chủ đề tiên quyết (array của topic IDs)
    xp_reward INT DEFAULT 100 CHECK (xp_reward >= 0), -- Điểm thưởng hoàn thành chủ đề
    estimated_time INT NULL,                        -- Thời gian ước tính học (phút)
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_active (is_active)
);

-- Bảng grammar_lessons: Bài học lý thuyết ngữ pháp
CREATE TABLE grammar_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,                          -- Thuộc chủ đề nào
    
    -- Nội dung bài học
    title VARCHAR(255) NOT NULL,                    -- Tiêu đề bài học
    content TEXT NOT NULL,                          -- Nội dung lý thuyết (HTML/Markdown)
    summary TEXT NULL,                              -- Tóm tắt ngắn gọn
    
    -- Thứ tự và cấu trúc
    lesson_order INT DEFAULT 0,                     -- Thứ tự bài học trong chủ đề
    estimated_time INT NULL,                        -- Thời gian ước tính đọc (phút)
    
    -- Gamification
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0),
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_topic_order (topic_id, lesson_order),
    INDEX idx_topic_active (topic_id, is_active)
);

-- Bảng grammar_exercise_types: Loại bài tập ngữ pháp
CREATE TABLE grammar_exercise_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,                     -- Tên loại bài tập
    topic_id INT NOT NULL,                          -- Thuộc chủ đề nào
    description TEXT NULL,                          -- Mô tả chi tiết
    instruction TEXT NULL,                          -- Hướng dẫn làm bài
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_topic_active (topic_id, is_active)
);

-- Bảng grammar_questions: Câu hỏi bài tập ngữ pháp
CREATE TABLE grammar_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,                         -- Thuộc bài học nào
    type_id INT NOT NULL,                           -- Loại bài tập
    
    -- Nội dung câu hỏi
    question TEXT NOT NULL,                         -- Câu hỏi
    options JSON NULL,                              -- Các lựa chọn (JSON array)
    correct_answer TEXT NOT NULL,                   -- Đáp án đúng
    explanation TEXT NULL,                          -- Giải thích đáp án
    
    -- Thông tin bổ sung
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    question_order INT DEFAULT 0,                   -- Thứ tự câu hỏi
    
    -- Gamification
    xp_reward INT DEFAULT 5 CHECK (xp_reward >= 0),
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES grammar_exercise_types(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_lesson_order (lesson_id, question_order),
    INDEX idx_type_difficulty (type_id, difficulty_level),
    INDEX idx_lesson_active (lesson_id, is_active)
);

-- Bảng user_grammar_progress: Tiến độ học ngữ pháp của người dùng
CREATE TABLE user_grammar_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,                          -- Chủ đề đang học
    lesson_id INT NULL,                             -- Bài học cụ thể
    question_id INT NULL,                           -- Câu hỏi bài tập
    
    -- Loại hoạt động
    activity_type ENUM('theory', 'exercise', 'review') NOT NULL,
    
    -- Kết quả
    is_completed BOOLEAN DEFAULT FALSE,             -- Đã hoàn thành chưa
    score INT NULL CHECK (score >= 0 AND score <= 100), -- Điểm số
    attempts INT DEFAULT 1 CHECK (attempts > 0),    -- Số lần thử
    time_spent INT NULL,                            -- Thời gian (giây)
    
    -- Thời gian
    completed_at TIMESTAMP NULL,
    last_reviewed TIMESTAMP NULL,
    next_review TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES grammar_questions(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_user_topic (user_id, topic_id),
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_next_review (next_review),
    INDEX idx_completed (is_completed, completed_at)
);

-- ===============================================
-- 5. HỆ THỐNG KỸ NĂNG VIẾT
-- ===============================================

-- Bảng writing_prompts: Đề bài viết và bài làm của học viên
CREATE TABLE writing_prompts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                           -- Người viết
    
    -- Thông tin đề bài
    title VARCHAR(255) NOT NULL,                    -- Tiêu đề bài viết
    prompt TEXT NOT NULL,                           -- Đề bài/yêu cầu
    category VARCHAR(100) NULL,                     -- Loại bài viết (essay, letter, story...)
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Bài làm của học viên
    user_content TEXT NULL,                         -- Nội dung bài viết
    word_count INT DEFAULT 0,                       -- Số từ
    
    -- Đánh giá và phản hồi
    ai_feedback TEXT NULL,                          -- Phản hồi từ AI
    grammar_score INT NULL CHECK (grammar_score >= 0 AND grammar_score <= 100),
    vocabulary_score INT NULL CHECK (vocabulary_score >= 0 AND vocabulary_score <= 100),
    coherence_score INT NULL CHECK (coherence_score >= 0 AND coherence_score <= 100),
    overall_score INT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Gamification
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0),
    
    -- Trạng thái
    is_completed BOOLEAN DEFAULT FALSE,             -- Đã hoàn thành bài viết
    is_submitted BOOLEAN DEFAULT FALSE,             -- Đã nộp bài
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Thời gian
    submitted_at TIMESTAMP NULL,                    -- Thời điểm nộp bài
    graded_at TIMESTAMP NULL,                       -- Thời điểm chấm điểm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_user_category (user_id, category),
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_submitted (is_submitted, submitted_at),
    INDEX idx_completed (is_completed, created_at)
);

-- ===============================================
-- 6. HỆ THỐNG DIỄN ĐÀNG THẢO LUẬN
-- ===============================================

-- Bảng forum_categories: Danh mục diễn đàn
CREATE TABLE forum_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,                     -- Tên danh mục
    description TEXT NULL,                          -- Mô tả danh mục
    icon VARCHAR(500) NULL,                         -- Icon đại diện
    sort_order INT DEFAULT 0,                       -- Thứ tự hiển thị
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_active_order (is_active, sort_order)
);

-- Bảng forum_posts: Bài đăng trên diễn đàn
CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                           -- Người đăng
    category_id INT NULL,                           -- Danh mục (có thể NULL)
    
    -- Nội dung bài đăng
    title VARCHAR(255) NOT NULL,                    -- Tiêu đề
    content TEXT NOT NULL,                          -- Nội dung chính
    tags VARCHAR(500) NULL,                         -- Tags (phân cách bởi dấu phẩy)
    
    -- Thống kê tương tác
    views_count INT DEFAULT 0,                      -- Số lượt xem
    likes_count INT DEFAULT 0,                      -- Số lượt thích
    comments_count INT DEFAULT 0,                   -- Số bình luận
    shares_count INT DEFAULT 0,                     -- Số lượt chia sẻ
    
    -- Gamification
    xp_reward INT DEFAULT 20 CHECK (xp_reward >= 0),
    
    -- Trạng thái
    is_pinned BOOLEAN DEFAULT FALSE,                -- Được ghim lên đầu
    is_featured BOOLEAN DEFAULT FALSE,              -- Bài nổi bật
    is_active BOOLEAN DEFAULT TRUE,                 -- Có hiển thị không
    
    -- Thời gian
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_category_active (category_id, is_active),
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_featured_pinned (is_featured, is_pinned),
    INDEX idx_active_created (is_active, created_at)
);

-- Bảng forum_comments: Bình luận trên bài đăng
CREATE TABLE forum_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,                           -- Bài đăng được comment
    user_id INT NOT NULL,                           -- Người comment
    parent_id INT NULL,                             -- Comment cha (reply)
    
    -- Nội dung
    content TEXT NOT NULL,                          -- Nội dung bình luận
    likes_count INT DEFAULT 0,                      -- Số lượt thích
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_post_active (post_id, is_active),
    INDEX idx_parent_created (parent_id, created_at),
    INDEX idx_user_created (user_id, created_at)
);

-- Bảng forum_post_media: Media đính kèm bài đăng
CREATE TABLE forum_post_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,                           -- Bài đăng chứa media
    
    -- Thông tin file
    media_type ENUM('image', 'video', 'audio', 'document') NOT NULL,
    file_name VARCHAR(255) NOT NULL,                -- Tên file gốc
    file_size INT NULL,                             -- Kích thước file (bytes)
    mime_type VARCHAR(100) NULL,                    -- MIME type
    url VARCHAR(500) NOT NULL,                      -- Link đến file trên server/cloud
    thumbnail_url VARCHAR(500) NULL,                -- Thumbnail (cho video/image)
    
    -- Metadata
    width INT NULL,                                 -- Chiều rộng (image/video)
    height INT NULL,                                -- Chiều cao (image/video)
    duration INT NULL,                              -- Thời lượng (video/audio) - giây
    
    -- Trạng thái
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_post_type (post_id, media_type),
    INDEX idx_type_created (media_type, created_at)
);

-- Bảng forum_likes: Lượt thích bài đăng và comment
CREATE TABLE forum_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                           -- Người thích
    target_type ENUM('post', 'comment') NOT NULL,   -- Loại đối tượng
    target_id INT NOT NULL,                         -- ID đối tượng (post_id hoặc comment_id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Đảm bảo user chỉ like 1 lần cho mỗi đối tượng
    UNIQUE KEY unique_user_like (user_id, target_type, target_id),
    
    -- Index
    INDEX idx_target (target_type, target_id),
    INDEX idx_user_created (user_id, created_at)
);

-- ===============================================
-- 7. HỆ THỐNG THỐNG KÊ VÀ BÁO CÁO
-- ===============================================

-- Bảng user_daily_stats: Thống kê hoạt động hàng ngày của user
CREATE TABLE user_daily_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,                             -- Ngày thống kê
    
    -- Thống kê hoạt động
    vocab_learned INT DEFAULT 0,                    -- Số từ vựng đã học
    grammar_completed INT DEFAULT 0,                -- Số bài ngữ pháp hoàn thành
    exercises_done INT DEFAULT 0,                   -- Số bài tập đã làm
    writing_submitted INT DEFAULT 0,                -- Số bài viết đã nộp
    forum_posts INT DEFAULT 0,                      -- Số bài đăng forum
    forum_comments INT DEFAULT 0,                   -- Số comment forum
    
    -- Thống kê thời gian và điểm
    study_time_minutes INT DEFAULT 0,               -- Thời gian học trong ngày (phút)
    xp_earned INT DEFAULT 0,                        -- Điểm XP kiếm được trong ngày
    accuracy_rate DECIMAL(5,2) NULL,                -- Tỷ lệ chính xác (%)
    
    -- Streak tracking
    is_study_day BOOLEAN DEFAULT FALSE,             -- Có học trong ngày này không
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Đảm bảo mỗi user chỉ có 1 record/ngày
    UNIQUE KEY unique_user_date (user_id, date),
    
    -- Index
    INDEX idx_user_date (user_id, date),
    INDEX idx_date_study (date, is_study_day)
);

-- Bảng user_streaks: Theo dõi streak học liên tục của user
CREATE TABLE user_streaks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Streak hiện tại
    current_streak INT DEFAULT 0,                   -- Số ngày học liên tục hiện tại
    longest_streak INT DEFAULT 0,                   -- Streak dài nhất từng đạt được
    
    -- Thời gian
    last_activity_date DATE NULL,                   -- Ngày hoạt động cuối cùng
    streak_start_date DATE NULL,                    -- Ngày bắt đầu streak hiện tại
    longest_streak_date DATE NULL,                  -- Ngày đạt longest streak
    
    -- Thống kê tổng quan
    total_study_days INT DEFAULT 0,                 -- Tổng số ngày đã học
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Index
    UNIQUE KEY unique_user_streak (user_id),
    INDEX idx_current_streak (current_streak),
    INDEX idx_longest_streak (longest_streak)
);

-- ===============================================
-- 8. HỆ THỐNG THÔNG BÁO
-- ===============================================

-- Bảng notifications: Thông báo hệ thống gửi cho user
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                           -- Người nhận thông báo
    
    -- Nội dung thông báo
    title VARCHAR(255) NOT NULL,                    -- Tiêu đề thông báo
    message TEXT NOT NULL,                          -- Nội dung chi tiết
    type ENUM(
        'achievement',   -- Đạt thành tựu/huy hiệu
        'reminder',      -- Nhắc nhở học bài
        'social',        -- Hoạt động xã hội (like, comment)
        'system',        -- Thông báo hệ thống
        'promotion'      -- Khuyến mãi, sự kiện
    ) NOT NULL,
    
    -- Metadata bổ sung
    data JSON NULL,                                 -- Dữ liệu bổ sung (link, ID liên quan...)
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    -- Trạng thái
    is_read BOOLEAN DEFAULT FALSE,                  -- Đã đọc chưa
    is_sent BOOLEAN DEFAULT TRUE,                   -- Đã gửi chưa (dành cho queue)
    
    -- Thời gian
    scheduled_at TIMESTAMP NULL,                    -- Thời gian dự kiến gửi
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Thời gian gửi thực tế
    read_at TIMESTAMP NULL,                         -- Thời gian đọc
    expires_at TIMESTAMP NULL,                      -- Thời gian hết hạn
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_user_type (user_id, type),
    INDEX idx_scheduled (scheduled_at, is_sent),
    INDEX idx_expires (expires_at)
);

-- ===============================================
-- 9. HỆ THỐNG CÀI ĐẶT VÀ TÙY CHỈNH
-- ===============================================

-- Bảng user_settings: Cài đặt cá nhân của user
CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    
    -- Cài đặt học tập
    daily_goal_xp INT DEFAULT 100,                  -- Mục tiêu XP hàng ngày
    daily_goal_words INT DEFAULT 10,                -- Mục tiêu từ vựng/ngày
    preferred_difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    
    -- Cài đặt thông báo
    email_notifications BOOLEAN DEFAULT TRUE,       -- Nhận email thông báo
    push_notifications BOOLEAN DEFAULT TRUE,        -- Nhận push notification
    reminder_time TIME DEFAULT '19:00:00',          -- Giờ nhắc nhở học bài
    reminder_frequency ENUM('daily', 'weekdays', 'weekends', 'custom') DEFAULT 'daily',
    
    -- Cài đặt giao diện
    theme ENUM('light', 'dark', 'auto') DEFAULT 'light',
    language ENUM('vi', 'en') DEFAULT 'vi',         -- Ngôn ngữ giao diện
    font_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    
    -- Cài đặt âm thanh
    sound_effects BOOLEAN DEFAULT TRUE,             -- Hiệu ứng âm thanh
    pronunciation_auto BOOLEAN DEFAULT TRUE,        -- Tự động phát âm
    
    -- Cài đặt riêng tư
    profile_public BOOLEAN DEFAULT TRUE,            -- Hồ sơ công khai
    show_progress BOOLEAN DEFAULT TRUE,             -- Hiển thị tiến độ
    show_streaks BOOLEAN DEFAULT TRUE,              -- Hiển thị streak
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Unique constraint
    UNIQUE KEY unique_user_settings (user_id)
);

-- ===============================================
-- 10. TRIGGERS VÀ PROCEDURES
-- ===============================================

-- Trigger: Tự động cập nhật total_words khi thêm/xóa từ vựng
DELIMITER //

CREATE TRIGGER update_topic_total_words_insert 
AFTER INSERT ON vocab_words 
FOR EACH ROW
BEGIN
    UPDATE vocab_topics 
    SET total_words = (
        SELECT COUNT(*) 
        FROM vocab_words 
        WHERE topic_id = NEW.topic_id AND is_active = TRUE
    )
    WHERE id = NEW.topic_id;
END //

CREATE TRIGGER update_topic_total_words_update
AFTER UPDATE ON vocab_words
FOR EACH ROW
BEGIN
    -- Cập nhật cho topic cũ (nếu topic_id thay đổi)
    IF OLD.topic_id != NEW.topic_id THEN
        UPDATE vocab_topics 
        SET total_words = (
            SELECT COUNT(*) 
            FROM vocab_words 
            WHERE topic_id = OLD.topic_id AND is_active = TRUE
        )
        WHERE id = OLD.topic_id;
    END IF;
    
    -- Cập nhật cho topic mới
    UPDATE vocab_topics 
    SET total_words = (
        SELECT COUNT(*) 
        FROM vocab_words 
        WHERE topic_id = NEW.topic_id AND is_active = TRUE
    )
    WHERE id = NEW.topic_id;
END //

CREATE TRIGGER update_topic_total_words_delete
AFTER DELETE ON vocab_words
FOR EACH ROW
BEGIN
    UPDATE vocab_topics 
    SET total_words = (
        SELECT COUNT(*) 
        FROM vocab_words 
        WHERE topic_id = OLD.topic_id AND is_active = TRUE
    )
    WHERE id = OLD.topic_id;
END //

-- Trigger: Tự động cập nhật comments_count cho forum posts
CREATE TRIGGER update_post_comments_count_insert
AFTER INSERT ON forum_comments
FOR EACH ROW
BEGIN
    UPDATE forum_posts 
    SET comments_count = (
        SELECT COUNT(*) 
        FROM forum_comments 
        WHERE post_id = NEW.post_id AND is_active = TRUE
    )
    WHERE id = NEW.post_id;
END //

CREATE TRIGGER update_post_comments_count_update
AFTER UPDATE ON forum_comments
FOR EACH ROW
BEGIN
    UPDATE forum_posts 
    SET comments_count = (
        SELECT COUNT(*) 
        FROM forum_comments 
        WHERE post_id = NEW.post_id AND is_active = TRUE
    )
    WHERE id = NEW.post_id;
END //

CREATE TRIGGER update_post_comments_count_delete
AFTER DELETE ON forum_comments
FOR EACH ROW
BEGIN
    UPDATE forum_posts 
    SET comments_count = (
        SELECT COUNT(*) 
        FROM forum_comments 
        WHERE post_id = OLD.post_id AND is_active = TRUE
    )
    WHERE id = OLD.post_id;
END //

-- Trigger: Tự động cập nhật likes_count
CREATE TRIGGER update_likes_count_insert
AFTER INSERT ON forum_likes
FOR EACH ROW
BEGIN
    IF NEW.target_type = 'post' THEN
        UPDATE forum_posts 
        SET likes_count = (
            SELECT COUNT(*) 
            FROM forum_likes 
            WHERE target_type = 'post' AND target_id = NEW.target_id
        )
        WHERE id = NEW.target_id;
    ELSEIF NEW.target_type = 'comment' THEN
        UPDATE forum_comments 
        SET likes_count = (
            SELECT COUNT(*) 
            FROM forum_likes 
            WHERE target_type = 'comment' AND target_id = NEW.target_id
        )
        WHERE id = NEW.target_id;
    END IF;
END //

CREATE TRIGGER update_likes_count_delete
AFTER DELETE ON forum_likes
FOR EACH ROW
BEGIN
    IF OLD.target_type = 'post' THEN
        UPDATE forum_posts 
        SET likes_count = (
            SELECT COUNT(*) 
            FROM forum_likes 
            WHERE target_type = 'post' AND target_id = OLD.target_id
        )
        WHERE id = OLD.target_id;
    ELSEIF OLD.target_type = 'comment' THEN
        UPDATE forum_comments 
        SET likes_count = (
            SELECT COUNT(*) 
            FROM forum_likes 
            WHERE target_type = 'comment' AND target_id = OLD.target_id
        )
        WHERE id = OLD.target_id;
    END IF;
END //

DELIMITER ;

-- ===============================================
-- 11. DỮ LIỆU MẪU (SAMPLE DATA)
-- ===============================================

-- Dữ liệu mẫu cho levels
INSERT INTO levels (level_number, level_name, min_xp, max_xp, description) VALUES
(1, 'Newbie', 0, 99, 'Người mới bắt đầu học tiếng Anh'),
(2, 'Beginner', 100, 299, 'Đã làm quen với những kiến thức cơ bản'),
(3, 'Elementary', 300, 599, 'Có thể giao tiếp cơ bản'),
(4, 'Pre-Intermediate', 600, 999, 'Đang phát triển kỹ năng trung cấp'),
(5, 'Intermediate', 1000, 1999, 'Có thể sử dụng tiếng Anh khá tốt'),
(6, 'Upper-Intermediate', 2000, 3999, 'Sử dụng tiếng Anh thành thạo'),
(7, 'Advanced', 4000, 7999, 'Trình độ cao, gần như native'),
(8, 'Expert', 8000, NULL, 'Bậc thầy tiếng Anh');

-- Dữ liệu mẫu cho badges
INSERT INTO badges (name, description, condition_type, condition_value, xp_reward) VALUES
('First Steps', 'Hoàn thành từ vựng đầu tiên', 'vocabulary', 1, 10),
('Word Collector', 'Học được 50 từ vựng', 'vocabulary', 50, 100),
('Vocabulary Master', 'Học được 500 từ vựng', 'vocabulary', 500, 500),
('Grammar Guru', 'Hoàn thành 10 bài ngữ pháp', 'grammar', 10, 200),
('Writer', 'Viết 5 bài essay', 'writing', 5, 150),
('Social Butterfly', 'Đăng 10 bài trên forum', 'forum', 10, 100),
('Consistent Learner', 'Học 7 ngày liên tục', 'streak', 7, 200),
('Perfectionist', 'Đạt 95% độ chính xác', 'accuracy', 95, 300);

-- Dữ liệu mẫu cho forum categories
INSERT INTO forum_categories (name, description, sort_order) VALUES
('General Discussion', 'Thảo luận chung về học tiếng Anh', 1),
('Grammar Help', 'Hỏi đáp về ngữ pháp', 2),
('Vocabulary', 'Chia sẻ từ vựng và cách nhớ', 3),
('Writing Practice', 'Luyện tập viết và feedback', 4),
('Speaking Corner', 'Thực hành kỹ năng nói', 5),
('English Culture', 'Tìm hiểu văn hóa các nước nói tiếng Anh', 6),
('Study Tips', 'Mẹo học tập hiệu quả', 7),
('Off Topic', 'Trò chuyện tự do', 8);

-- ===============================================
-- 12. VIEWS HỮU ÍCH
-- ===============================================

-- View: Thông tin user kèm level hiện tại
CREATE VIEW user_with_level AS
SELECT 
    u.*,
    l.level_number,
    l.level_name,
    l.min_xp,
    l.max_xp,
    -- Tính phần trăm tiến độ trong level hiện tại
    CASE 
        WHEN l.max_xp IS NULL THEN 100
        ELSE ROUND(((u.total_xp - l.min_xp) * 100.0 / (l.max_xp - l.min_xp)), 2)
    END as level_progress_percent
FROM users u
LEFT JOIN levels l ON u.total_xp >= l.min_xp 
    AND (u.total_xp <= l.max_xp OR l.max_xp IS NULL)
ORDER BY l.level_number DESC
LIMIT 1;

-- View: Thống kê tổng quan của user
CREATE VIEW user_stats_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.total_xp,
    
    -- Thống kê từ vựng
    COUNT(DISTINCT uvp.word_id) as words_learned,
    COUNT(DISTINCT uvp.topic_id) as vocab_topics_started,
    
    -- Thống kê ngữ pháp  
    COUNT(DISTINCT ugp.lesson_id) as grammar_lessons_completed,
    COUNT(DISTINCT ugp.topic_id) as grammar_topics_started,
    
    -- Thống kê viết
    COUNT(DISTINCT wp.id) as writings_submitted,
    
    -- Thống kê forum
    COUNT(DISTINCT fp.id) as forum_posts,
    COUNT(DISTINCT fc.id) as forum_comments,
    
    -- Thống kê huy hiệu
    COUNT(DISTINCT ub.badge_id) as badges_earned,
    
    -- Streak hiện tại
    COALESCE(us.current_streak, 0) as current_streak,
    COALESCE(us.longest_streak, 0) as longest_streak

FROM users u
LEFT JOIN user_vocab_progress uvp ON u.id = uvp.user_id AND uvp.is_completed = TRUE
LEFT JOIN user_grammar_progress ugp ON u.id = ugp.user_id AND ugp.is_completed = TRUE  
LEFT JOIN writing_prompts wp ON u.id = wp.user_id AND wp.is_completed = TRUE
LEFT JOIN forum_posts fp ON u.id = fp.user_id AND fp.is_active = TRUE
LEFT JOIN forum_comments fc ON u.id = fc.user_id AND fc.is_active = TRUE
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
GROUP BY u.id, u.username, u.total_xp, us.current_streak, us.longest_streak;

-- View: Top learners (bảng xếp hạng)
CREATE VIEW leaderboard AS
SELECT 
    u.id,
    u.username,
    u.fullname,
    u.avatar,
    u.total_xp,
    l.level_name,
    us.current_streak,
    ROW_NUMBER() OVER (ORDER BY u.total_xp DESC, us.current_streak DESC) as ranking
FROM users u
LEFT JOIN levels l ON u.total_xp >= l.min_xp 
    AND (u.total_xp <= l.max_xp OR l.max_xp IS NULL)
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.is_active = TRUE
ORDER BY u.total_xp DESC, us.current_streak DESC;

-- ===============================================
-- 13. STORED PROCEDURES HỮU ÍCH
-- ===============================================

DELIMITER //

-- Procedure: Cập nhật streak của user
CREATE PROCEDURE UpdateUserStreak(IN p_user_id INT)
BEGIN
    DECLARE v_last_activity DATE;
    DECLARE v_current_streak INT DEFAULT 0;
    DECLARE v_longest_streak INT DEFAULT 0;
    
    -- Lấy thông tin streak hiện tại
    SELECT current_streak, longest_streak, last_activity_date
    INTO v_current_streak, v_longest_streak, v_last_activity
    FROM user_streaks 
    WHERE user_id = p_user_id;
    
    -- Nếu chưa có record streak, tạo mới
    IF v_current_streak IS NULL THEN
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date, total_study_days)
        VALUES (p_user_id, 1, 1, CURDATE(), CURDATE(), 1);
    ELSE
        -- Kiểm tra ngày hoạt động
        IF v_last_activity = CURDATE() THEN
            -- Đã học hôm nay rồi, không làm gì
            SELECT 'Already studied today' as message;
        ELSEIF v_last_activity = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN
            -- Học liên tục, tăng streak
            SET v_current_streak = v_current_streak + 1;
            SET v_longest_streak = GREATEST(v_longest_streak, v_current_streak);
            
            UPDATE user_streaks 
            SET current_streak = v_current_streak,
                longest_streak = v_longest_streak,
                last_activity_date = CURDATE(),
                total_study_days = total_study_days + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id;
        ELSE
            -- Đã bỏ lỡ, reset streak
            UPDATE user_streaks 
            SET current_streak = 1,
                last_activity_date = CURDATE(),
                streak_start_date = CURDATE(),
                total_study_days = total_study_days + 1,
                updated_at = NOW()
            WHERE user_id = p_user_id;
        END IF;
    END IF;
END //

-- Procedure: Kiểm tra và trao huy hiệu
CREATE PROCEDURE CheckAndAwardBadges(IN p_user_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_badge_id INT;
    DECLARE v_condition_type VARCHAR(50);
    DECLARE v_condition_value INT;
    DECLARE v_user_value INT;
    
    -- Cursor để duyệt qua các huy hiệu chưa có
    DECLARE badge_cursor CURSOR FOR
        SELECT b.id, b.condition_type, b.condition_value
        FROM badges b
        WHERE b.is_active = TRUE
        AND b.id NOT IN (
            SELECT badge_id 
            FROM user_badges 
            WHERE user_id = p_user_id
        );
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN badge_cursor;
    
    badge_loop: LOOP
        FETCH badge_cursor INTO v_badge_id, v_condition_type, v_condition_value;
        
        IF done THEN
            LEAVE badge_loop;
        END IF;
        
        -- Kiểm tra điều kiện dựa trên loại
        CASE v_condition_type
            WHEN 'vocabulary' THEN
                SELECT COUNT(DISTINCT word_id) INTO v_user_value
                FROM user_vocab_progress 
                WHERE user_id = p_user_id AND is_completed = TRUE;
                
            WHEN 'grammar' THEN
                SELECT COUNT(DISTINCT lesson_id) INTO v_user_value
                FROM user_grammar_progress 
                WHERE user_id = p_user_id AND is_completed = TRUE AND activity_type = 'theory';
                
            WHEN 'writing' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM writing_prompts 
                WHERE user_id = p_user_id AND is_completed = TRUE;
                
            WHEN 'forum' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM forum_posts 
                WHERE user_id = p_user_id AND is_active = TRUE;
                
            WHEN 'streak' THEN
                SELECT COALESCE(current_streak, 0) INTO v_user_value
                FROM user_streaks 
                WHERE user_id = p_user_id;
                
            ELSE
                SET v_user_value = 0;
        END CASE;
        
        -- Nếu đạt điều kiện, trao huy hiệu
        IF v_user_value >= v_condition_value THEN
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (p_user_id, v_badge_id);
            
            -- Cộng XP thưởng
            UPDATE users 
            SET total_xp = total_xp + (
                SELECT xp_reward FROM badges WHERE id = v_badge_id
            )
            WHERE id = p_user_id;
        END IF;
        
    END LOOP;
    
    CLOSE badge_cursor;
END //

DELIMITER ;

-- ===============================================
-- KẾT THÚC SCHEMA
-- ===============================================

-- Script hoàn thành! 
-- Các tính năng chính:
-- ✅ Quản lý user với social login
-- ✅ Hệ thống gamification (XP, levels, badges) 
-- ✅ Module từ vựng với flashcard và bài tập
-- ✅ Module ngữ pháp với lý thuyết và bài tập
-- ✅ Hệ thống viết với AI feedback
-- ✅ Diễn đàn thảo luận với media support
-- ✅ Thống kê và theo dõi tiến độ
-- ✅ Hệ thống thông báo
-- ✅ Streak tracking
-- ✅ Triggers tự động cập nhật
-- ✅ Views và procedures hữu ích
-- Bảng người dùng chính
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, -- NULL nếu đăng nhập qua social
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    
    -- Social Login
    google_id VARCHAR(255) NULL,
    facebook_id VARCHAR(255) NULL,
    
    -- Hệ thống điểm và cấp độ
    current_level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    total_points INT DEFAULT 0,
    
    -- Thống kê học tập
    study_streak INT DEFAULT 0,
    last_study_date DATE NULL,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_level_xp (current_level, total_xp),
    -- UNIQUE INDEX idx_google (google_id),
    -- UNIQUE INDEX idx_facebook (facebook_id)

);

-- Bảng cấp độ hệ thống
CREATE TABLE levels (
    level_number INT PRIMARY KEY,
    level_name VARCHAR(100) NOT NULL,
    min_xp INT NOT NULL,
    max_xp INT NULL,
    description TEXT NULL,
    INDEX idx_xp_range (min_xp, max_xp)
);
-- Insert dữ liệu cấp độ
INSERT INTO levels (level_number, level_name, min_xp, max_xp, description) VALUES
(1, 'Beginner', 0, 500, 'Người mới bắt đầu học tiếng Anh'),
(2, 'Elementary', 500, 1200, 'Trình độ sơ cấp'),
(3, 'Pre-Intermediate', 1200, 2500, 'Trước trung cấp'),
(4, 'Intermediate', 2500, 4500, 'Trung cấp'),
(5, 'Upper-Intermediate', 4500, 7500, 'Trên trung cấp'),
(6, 'Advanced', 7500, 12000, 'Nâng cao'),
(7, 'Expert', 12000, NULL, 'Chuyên gia');
-- Bảng huy hiệu
CREATE TABLE badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    -- là mã định danh duy nhất, thân thiện, dễ đọc và ổn định, dùng để tham chiếu badge trong code, API và URL.
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(500) NULL,
    condition_type ENUM('vocabulary', 'grammar', 'listening', 'reading', 'writing', 'testing', 'forum', 'streak', 'accuracy') NOT NULL,
    condition_value INT NOT NULL,
    xp_reward INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Insert dữ liệu huy hiệu
INSERT INTO badges (name, slug, description, icon_url, condition_type, condition_value, xp_reward) VALUES
('Vocabulary Master', 'vocabulary-master', 'Hoàn thành 50 topic từ vựng', NULL, 'vocabulary', 50, 500),
('Grammar Guru', 'grammar-guru', 'Hoàn thành tất cả chủ đề ngữ pháp', NULL, 'grammar', 100, 1000),
('Listening Pro', 'listening-pro', 'Đạt cấp C2 trong kỹ năng nghe', NULL, 'listening', 90, 800),
('Speed Reader', 'speed-reader', 'Hoàn thành 100 bài đọc', NULL, 'reading', 100, 600),
('Writing Expert', 'writing-expert', 'Có 10 bài viết điểm 90+', NULL, 'writing', 90, 700),
('Test Champion', 'test-champion', 'Hoàn thành 20 bài kiểm tra tổng hợp', NULL, 'testing', 20, 400),
('Daily Learner', 'daily-learner', 'Học 30 ngày liên tiếp', NULL, 'streak', 30, 300),
('Perfectionist', 'perfectionist', '100% đúng trong 10 bài tập liên tiếp', NULL, 'accuracy', 10, 250),
('Forum Helper', 'forum-helper', 'Giúp đỡ 50 câu hỏi trên diễn đàn', NULL, 'forum', 50, 200);
-- Bảng huy hiệu của người dùng
CREATE TABLE user_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    INDEX idx_user_badges (user_id)
);
-- =============================================
-- VOCABULARY SYSTEM
-- =============================================

-- Bảng chủ đề từ vựng
CREATE TABLE vocabulary_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    word_count INT DEFAULT 0,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_active_order (is_active, order_index)
);
-- Insert dữ liệu chủ đề từ vựng
INSERT INTO vocabulary_topics (name, slug, description, word_count, order_index) VALUES
('Màu sắc', 'colors', 'Các từ vựng về màu sắc cơ bản', 25, 1),
('Gia đình', 'family', 'Từ vựng về các thành viên trong gia đình', 30, 2),
('Đồ ăn', 'food-drinks', 'Từ vựng về đồ ăn và đồ uống', 40, 3),
('Quần áo', 'clothes', 'Từ vựng về trang phục và phụ kiện', 35, 4),
('Động vật', 'animals', 'Từ vựng về các loài động vật', 50, 5),
('Nghề nghiệp', 'jobs', 'Từ vựng về các nghề nghiệp', 45, 6),
('Giao thông', 'transportation', 'Từ vựng về phương tiện giao thông', 30, 7),
('Thiên nhiên', 'nature', 'Từ vựng về thiên nhiên và môi trường', 40, 8);
-- Bảng từ vựng
CREATE TABLE vocabulary_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    english_word VARCHAR(255) NOT NULL,
    vietnamese_meaning TEXT NOT NULL,
    pronunciation VARCHAR(255) NULL,
    audio_url VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    example_sentence TEXT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES vocabulary_topics(id) ON DELETE CASCADE,
    INDEX idx_topic_active (topic_id, is_active),
    INDEX idx_word_search (english_word)
);
-- Bảng tiến trình học từ vựng của user
CREATE TABLE user_vocabulary_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    word_id INT NOT NULL,
    learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    review_count INT DEFAULT 1,
    last_review_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES vocabulary_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_word (user_id, word_id),
    INDEX idx_user_topic (user_id, topic_id)
);
-- Trigger tăng word_count khi thêm từ vựng
DELIMITER $$

CREATE TRIGGER trg_vocabulary_words_after_insert
AFTER INSERT ON vocabulary_words
FOR EACH ROW
BEGIN
    UPDATE vocabulary_topics
    SET word_count = word_count + 1
    WHERE id = NEW.topic_id;
END$$

DELIMITER ;
-- Trigger giảm word_count khi xóa từ vựng
DELIMITER $$

CREATE TRIGGER trg_vocabulary_words_after_delete
AFTER DELETE ON vocabulary_words
FOR EACH ROW
BEGIN
    UPDATE vocabulary_topics
    SET word_count = word_count - 1
    WHERE id = OLD.topic_id;
END$$

DELIMITER ;
--
DELIMITER $$

CREATE TRIGGER trg_vocabulary_words_after_update
AFTER UPDATE ON vocabulary_words
FOR EACH ROW
BEGIN
    IF OLD.topic_id != NEW.topic_id THEN
        -- giảm count topic cũ
        UPDATE vocabulary_topics
        SET word_count = word_count - 1
        WHERE id = OLD.topic_id;

        -- tăng count topic mới
        UPDATE vocabulary_topics
        SET word_count = word_count + 1
        WHERE id = NEW.topic_id;
    END IF;
END$$

DELIMITER ;

-- Bảng sổ tay cá nhân (từ vựng đã lưu)
CREATE TABLE user_vocabulary_notebook (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    personal_note TEXT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved_word (user_id, word_id)
);
-- Bảng chủ đề ngữ pháp
CREATE TABLE grammar_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    category ENUM('tenses', 'parts_of_speech', 'sentence_structure', 'modal_verbs', 'advanced') NOT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active_order (is_active, order_index)
);
-- Trigger tự động tạo slug từ name
DELIMITER $$

CREATE TRIGGER trg_grammar_topics_before_insert
BEFORE INSERT ON grammar_topics
FOR EACH ROW
BEGIN
    SET NEW.slug = LOWER(REPLACE(NEW.name, ' ', '-'));
END$$
DELIMITER ;

-- Bảng nội dung lý thuyết ngữ pháp
CREATE TABLE grammar_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL, -- HTML content
    order_index INT DEFAULT 0,
    xp_reward INT DEFAULT 10,
    is_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    INDEX idx_topic_order (topic_id, order_index)
);
-- Bảng tiến trình học ngữ pháp
CREATE TABLE user_grammar_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    lesson_id INT NOT NULL,
    
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id)
);

-- =============================================
-- EXERCISES & QUIZZES SYSTEM
-- =============================================

-- Bảng bài tập
CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('vocabulary_multiple_choice', 'vocabulary_matching', 'grammar_multiple_choice', 'grammar_rearrange', 'reading_comprehension', 'reading_fill_blank') NOT NULL,
    skill_type ENUM('vocabulary', 'grammar', 'reading') NOT NULL,
    topic_id INT NULL, -- Reference to vocabulary_topics or grammar_topics
    title VARCHAR(255) NOT NULL,
    instruction TEXT NOT NULL,
    content JSON NOT NULL, -- Question data, options, correct answers
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    points_reward INT DEFAULT 10,
    xp_reward INT DEFAULT 3,
    time_limit INT NULL, -- in seconds
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type_skill (type, skill_type),
    INDEX idx_topic_difficulty (topic_id, difficulty_level)
);

-- Bảng kết quả làm bài tập
CREATE TABLE exercise_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    user_answers JSON NOT NULL,
    correct_answers JSON NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    points_earned INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    time_taken INT NULL, -- in seconds
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    INDEX idx_user_exercise (user_id, exercise_id),
    INDEX idx_completion_date (completed_at)
);

-- =============================================
-- READING SYSTEM
-- =============================================

-- Bảng chủ đề đọc
CREATE TABLE reading_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng bài đọc
CREATE TABLE reading_passages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    word_count INT DEFAULT 0,
    difficulty_level ENUM('short', 'medium', 'long') DEFAULT 'medium',
    reading_time_minutes INT DEFAULT 10,
    xp_reward INT DEFAULT 40,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (topic_id) REFERENCES reading_topics(id) ON DELETE CASCADE,
    INDEX idx_topic_difficulty (topic_id, difficulty_level)
);

-- Bảng tiến trình đọc
CREATE TABLE user_reading_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    passage_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reading_time_seconds INT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (passage_id) REFERENCES reading_passages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_passage (user_id, passage_id)
);

-- =============================================
-- WRITING SYSTEM
-- =============================================

-- Bảng chủ đề viết
CREATE TABLE writing_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('email', 'essay', 'creative', 'business') NOT NULL,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    requirements JSON NULL, -- word count, format, specific instructions
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'intermediate',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_category_difficulty (category, difficulty_level)
);

-- Bảng bài viết của học viên
CREATE TABLE user_writings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    word_count INT DEFAULT 0,
    
    -- AI Scoring (thang 100)
    ai_score DECIMAL(5,2) NULL,
    grammar_score DECIMAL(5,2) NULL,
    content_score DECIMAL(5,2) NULL,
    organization_score DECIMAL(5,2) NULL,
    language_score DECIMAL(5,2) NULL,
    
    -- AI Feedback
    ai_feedback JSON NULL,
    
    -- Rewards
    points_earned INT DEFAULT 0,
    xp_earned INT DEFAULT 0,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scored_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES writing_topics(id) ON DELETE CASCADE,
    INDEX idx_user_score (user_id, ai_score),
    INDEX idx_submission_date (submitted_at)
);

-- =============================================
-- TESTING SYSTEM
-- =============================================

-- Bảng bài kiểm tra
CREATE TABLE tests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    test_type ENUM('vocabulary', 'grammar', 'reading', 'writing', 'mixed') NOT NULL,
    question_count INT NOT NULL,
    time_limit_minutes INT NOT NULL,
    pass_score_percentage DECIMAL(5,2) DEFAULT 70.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type_active (test_type, is_active)
);

-- Bảng kết quả kiểm tra
CREATE TABLE test_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    test_id INT NOT NULL,
    answers JSON NOT NULL,
    total_questions INT NOT NULL,
    correct_answers INT NOT NULL,
    score_percentage DECIMAL(5,2) NOT NULL,
    time_taken_minutes INT NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_user_test (user_id, test_id),
    INDEX idx_completion_date (completed_at)
);

-- =============================================
-- FORUM SYSTEM
-- =============================================

-- Bảng danh mục diễn đàn
CREATE TABLE forum_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    icon VARCHAR(100) NULL,
    order_index INT DEFAULT 0,
    post_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dữ liệu categories
INSERT INTO forum_categories (name, slug, description, order_index) VALUES
('Learning Materials', 'learning-materials', 'Tài liệu học tập', 1),
('Grammar Help', 'grammar-help', 'Hỗ trợ ngữ pháp', 2),
('Vocabulary Corner', 'vocabulary-corner', 'Góc từ vựng', 3),
('Pronunciation Tips', 'pronunciation-tips', 'Mẹo phát âm', 4),
('General Discussion', 'general-discussion', 'Thảo luận chung', 5);

-- Bảng bài đăng diễn đàn
CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    attachment_url VARCHAR(500) NULL,
    view_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    upvote_count INT DEFAULT 0,
    downvote_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- Admin moderation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category_approved (category_id, is_approved),
    INDEX idx_created_date (created_at),
    FULLTEXT KEY ft_title_content (title, content)
);

-- Bảng trả lời bài đăng
CREATE TABLE forum_replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content LONGTEXT NOT NULL,
    parent_reply_id INT NULL, -- For nested replies
    upvote_count INT DEFAULT 0,
    downvote_count INT DEFAULT 0,
    is_best_answer BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
    INDEX idx_post_approved (post_id, is_approved),
    INDEX idx_created_date (created_at)
);

-- Bảng vote (upvote/downvote)
CREATE TABLE forum_votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    voteable_type ENUM('post', 'reply') NOT NULL,
    voteable_id INT NOT NULL,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vote (user_id, voteable_type, voteable_id),
    INDEX idx_voteable (voteable_type, voteable_id)
);

-- =============================================
-- GAMIFICATION & ACTIVITY TRACKING
-- =============================================

-- Bảng hoạt động của người dùng
CREATE TABLE user_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('login', 'vocabulary_learned', 'grammar_completed', 'exercise_completed', 'reading_completed', 'writing_submitted', 'test_completed', 'forum_post', 'forum_reply', 'badge_earned') NOT NULL,
    activity_data JSON NULL,
    xp_earned INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_activity_date (created_at)
);

-- Bảng xếp hạng (có thể cache từ user data)
CREATE TABLE leaderboards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    leaderboard_type ENUM('weekly_xp', 'monthly_xp', 'all_time_xp', 'weekly_points', 'monthly_points') NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL,
    rank_position INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_period_user (leaderboard_type, user_id, period_start),
    INDEX idx_type_period_rank (leaderboard_type, period_start, rank_position)
);

-- =============================================
-- SETTINGS & CONFIGURATION
-- =============================================

-- Bảng cấu hình hệ thống
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT NULL,
    description TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert một số cấu hình cơ bản
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('xp_per_vocab_word', '5', 'XP cho mỗi từ vựng học xong'),
('xp_bonus_topic_complete', '50', 'XP thưởng khi hoàn thành 1 topic từ vựng'),
('xp_per_grammar_lesson', '10', 'XP cho mỗi bài lý thuyết ngữ pháp'),
('xp_bonus_grammar_topic', '100', 'XP thưởng khi hoàn thành topic ngữ pháp'),
('forum_post_xp', '5', 'XP cho mỗi bài đăng diễn đàn'),
('forum_reply_xp', '10', 'XP cho mỗi câu trả lời'),
('forum_best_answer_xp', '20', 'XP khi câu trả lời được chọn là tốt nhất');

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Các index bổ sung cho performance
CREATE INDEX idx_users_active_level ON users(is_active, current_level);
CREATE INDEX idx_activities_recent ON user_activities(created_at DESC, user_id);
CREATE INDEX idx_exercise_attempts_recent ON exercise_attempts(completed_at DESC, user_id);
CREATE INDEX idx_forum_posts_recent ON forum_posts(created_at DESC, is_approved);

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- View thống kê tổng quan của user
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.full_name,
    u.current_level,
    u.total_xp,
    u.total_points,
    u.study_streak,
    l.level_name,
    COUNT(DISTINCT ub.badge_id) as badge_count,
    COUNT(DISTINCT uvp.word_id) as words_learned,
    COUNT(DISTINCT ugp.lesson_id) as grammar_lessons_completed,
    COUNT(DISTINCT urp.passage_id) as reading_passages_completed,
    COUNT(DISTINCT uw.id) as writings_submitted,
    COALESCE(AVG(uw.ai_score), 0) as avg_writing_score
FROM users u
LEFT JOIN levels l ON u.current_level = l.level_number
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN user_vocabulary_progress uvp ON u.id = uvp.user_id
LEFT JOIN user_grammar_progress ugp ON u.id = ugp.user_id
LEFT JOIN user_reading_progress urp ON u.id = urp.user_id
LEFT JOIN user_writings uw ON u.id = uw.user_id
WHERE u.is_active = TRUE
GROUP BY u.id, u.full_name, u.current_level, u.total_xp, u.total_points, u.study_streak, l.level_name;
-- Bảng use
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL,
    fullname VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) NULL,
    role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
    -- Social login
    google_id VARCHAR(255) NULL,
    facebook_id VARCHAR(255) NULL,
    -- Hệ thống điểm
    total_xp INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- không cần quân hệ chỉ cần khi nào join level với user lại nếu total_xp thay đổi thì level cũng thay đổi
-- Bảng cấp độ hệ thống
CREATE TABLE levels (
    level_number INT PRIMARY KEY,
    level_name VARCHAR(100) NOT NULL,
    min_xp INT NOT NULL,
    max_xp INT NULL,
    description TEXT NULL,
    INDEX idx_xp_range (min_xp, max_xp)
);
-- Bảng huy hiệu và thành tựu
CREATE TABLE badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(500) NULL,
    condition_type ENUM('vocabulary', 'grammar', 'listening', 'reading', 'writing', 'testing', 'forum', 'streak', 'accuracy') NOT NULL,
    condition_value INT NOT NULL,
    xp_reward INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Bảng huy hiệu của người dùng
CREATE TABLE user_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,

);
-- TỪ VỰNG
CREATE TABLE vocab_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    xp_reward INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
CREATE TABLE vocab_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    english_word VARCHAR(255) NOT NULL,
    vietnamese_meaning TEXT NOT NULL,
    pronunciation VARCHAR(255) NULL,
    audio_url VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    example_sentence TEXT NULL,
    example_translation TEXT NULL,
    xp_reward INT DEFAULT 3,
    word_type VARCHAR(100) NULL, -- danh từ, động từ, tính từ...
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES vocabulary_topics(id) ON DELETE CASCADE,
);
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    topic_id INT NOT NULL,
    question_id INT NULL,   -- dùng cho exercise_questions
    type ENUM('flashcard','exercise') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (word_id) REFERENCES vocab_words(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES exercise_questions(id) ON DELETE CASCADE
);
CREATE TABLE exercise_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    topic_id INT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE
);
CREATE TABLE exercise_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    question TEXT NOT NULL,
    options JSON NULL, -- Các lựa chọn dưới dạng JSON
    correct_answer TEXT NOT NULL,
    xp_reward INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES exercise_type(id) ON DELETE CASCADE
);
-- Ngữ pháp
CREATE TABLE grammar_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    xp_reward INT DEFAULT 100,
);
-- Bảng nội dung lý thuyết ngữ pháp
CREATE TABLE grammar_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    xp_reward INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE
);
-- Bảng bài tập ngữ pháp
CREATE TABLE exercise_grammar_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    topic_id INT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE
);
-- Bảng câu hỏi bài tập ngữ pháp
CREATE TABLE grammar_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    type_id INT NOT NULL,
    question TEXT NOT NULL,
    options JSON NULL, -- Các lựa chọn dưới dạng JSON
    correct_answer TEXT NOT NULL,
    xp_reward INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES exercise_grammar_type(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE
);
-- Bảng tiến độ học ngữ pháp của người dùng
CREATE TABLE user_grammar_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    question_id INT NULL,  -- dùng cho grammar_questions
    type ENUM('theory','exercise') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES grammar_questions(id) ON DELETE CASCADE
);
-- Bảng về kỹ năng viết
CREATE TABLE writing_prompts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    points INT DEFAULT 0,
    ai_feedback TEXT NULL,
    xp_reward INT DEFAULT 50,
    is_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- về diễn đàn
CREATE TABLE forum_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    comments TEXT NULL,
    comments_count INT DEFAULT 0,
    xp_reward INT DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE forum_post_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    media_type ENUM('image','file','video') NOT NULL,
    url VARCHAR(500) NOT NULL,           -- link đến file trên server/cloud
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
);





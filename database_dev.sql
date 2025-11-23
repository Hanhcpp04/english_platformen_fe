CREATE TABLE users (
     id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    fullname VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    provider VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    facebook_id VARCHAR(255) UNIQUE,
    total_xp INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_total_xp (total_xp),
    INDEX idx_role (role)
);

CREATE TABLE level (
    level_number INT PRIMARY KEY,
    level_name VARCHAR(100) NOT NULL,
    min_xp INT NOT NULL,
    max_xp INT NULL,
    description TEXT NULL,
    INDEX idx_xp_range (min_xp, max_xp)
);

CREATE TABLE badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(500) NULL,
    condition_type ENUM(
        'vocabulary', 
        'grammar', 
        'listening', 
        'reading', 
        'writing', 
        'testing', 
        'forum', 
        'streak', 
        'accuracy') NOT NULL,
    condition_value INT NOT NULL,
    xp_reward INT DEFAULT 0 CHECK (xp_reward >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_condition (condition_type, condition_value),
    INDEX idx_active (is_active)
);

CREATE TABLE user_badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    INDEX idx_user_earned (user_id, earned_at),
    INDEX idx_badge_earned (badge_id, earned_at)
);

CREATE TABLE vocab_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    icon_url VARCHAR(500) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    xp_reward INT DEFAULT 100,
    total_words INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    xp_reward INT DEFAULT 3 CHECK (xp_reward >= 0),
    word_type VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    INDEX idx_topic_active (topic_id, is_active),
    INDEX idx_english_word (english_word),
    INDEX idx_word_type (word_type)
);

CREATE TABLE vocab_exercise_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    topic_id INT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_topic_exercise_type (topic_id, name),
    INDEX idx_topic_active (topic_id, is_active)
);

CREATE TABLE vocab_exercise_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL,
    word_id INT NULL,  
    question TEXT NOT NULL,
    options JSON NULL, 
    correct_answer TEXT NOT NULL,
    xp_reward INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES vocab_exercise_type(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES vocab_words(id) ON DELETE CASCADE,
    INDEX idx_type_active (type_id, is_active),
    INDEX idx_word (word_id)
);

CREATE TABLE vocab_user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    topic_id INT NOT NULL,
    question_id INT NULL, 
    type ENUM('flashcard','exercise') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (word_id) REFERENCES vocab_words(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES vocab_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES vocab_exercise_questions(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_word_question_type (user_id, word_id, question_id, type),
    INDEX idx_user_topic (user_id, topic_id),
    INDEX idx_completed (is_completed, completed_at)
);

CREATE TABLE grammar_topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    xp_reward INT DEFAULT 100,
    INDEX idx_active (is_active)
);

CREATE TABLE grammar_lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    xp_reward INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    INDEX idx_topic_active (topic_id, is_active)
);

CREATE TABLE exercise_grammar_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    topic_id INT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_topic_grammar_type (topic_id, name),
    INDEX idx_topic_active (topic_id, is_active)
);

CREATE TABLE grammar_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lesson_id INT NOT NULL,
    type_id INT NOT NULL,
    question TEXT NOT NULL,
    options JSON NULL,
    correct_answer TEXT NOT NULL,
    xp_reward INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES exercise_grammar_type(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    INDEX idx_lesson_active (lesson_id, is_active),
    INDEX idx_type (type_id) 
);

CREATE TABLE user_grammar_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    lesson_id INT NOT NULL,
    question_id INT NULL,
    type ENUM('theory','exercise') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES grammar_lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES grammar_questions(id) ON DELETE SET NULL
    FOREIGN KEY (topic_id) REFERENCES grammar_topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson_question_type (user_id, lesson_id, question_id, type),
    INDEX idx_user_topic (user_id, topic_id),
    INDEX idx_user_activity (user_id, type),
    INDEX idx_completed (is_completed, completed_at)
);

CREATE TABLE writing_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,                    
    description TEXT NULL,                                                             
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0), 
    writing_tips TEXT NULL,                         
    sample_prompt TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

CREATE TABLE writing_prompts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    prompt TEXT NOT NULL,
    user_content TEXT NULL,                       
    word_count INT DEFAULT 0,  
    grammar_score INT NULL CHECK (grammar_score >= 0 AND grammar_score <= 100),
    vocabulary_score INT NULL CHECK (vocabulary_score >= 0 AND vocabulary_score <= 100),
    coherence_score INT NULL CHECK (coherence_score >= 0 AND coherence_score <= 100),
    overall_score INT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    ai_feedback TEXT NULL,
    grammar_suggestions JSON NULL,                  
    vocabulary_suggestions JSON NULL,
    time_spent INT NULL CHECK (time_spent >= 0),
    submitted_at TIMESTAMP NULL,
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0),
    is_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES writing_categories(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_user_category (user_id, category_id),
    INDEX idx_category_active (category_id, is_active),
    INDEX idx_completed (is_completed)
);
CREATE TABLE forum_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    xp_reward INT DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_likes (likes_count),
    INDEX idx_comments_count (comments_count)
);
CREATE TABLE forum_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,                           
    user_id INT NOT NULL,                           
    parent_id INT NULL, -- cái này nó sẽ liên kết đến cái cmt của mình để tạo ra cmt con nó là mối quan hệ đệ quy                              
    content TEXT NOT NULL,                          
    likes_count INT DEFAULT 0,                     
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    

    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    
    
    INDEX idx_post_active (post_id, is_active),
    INDEX idx_parent_created (parent_id, created_at),
    INDEX idx_user_created (user_id, created_at)
);
CREATE TABLE forum_post_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    media_type ENUM('image','file','text') NOT NULL,
    file_name VARCHAR(255) NULL,
    mime_type VARCHAR(100) NULL,
    file_size INT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    is_active BOOLEAN DEFAULT TRUE,           
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    INDEX idx_post_type (post_id, media_type),
    INDEX idx_post_created (post_id, created_at)
);
CREATE TABLE forum_post_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_viewed (post_id, viewed_at),
    INDEX idx_user_post_date (user_id, post_id, viewed_at)
);
DELIMITER $$
CREATE TRIGGER update_post_views_count_insert
AFTER INSERT ON forum_post_views
FOR EACH ROW
BEGIN
    UPDATE forum_posts 
    SET views = (
        SELECT COUNT(DISTINCT IFNULL(user_id, ip_address))
        FROM forum_post_views 
        WHERE post_id = NEW.post_id
    )
    WHERE id = NEW.post_id;
END $$

CREATE TRIGGER update_tag_post_count_insert
AFTER INSERT ON forum_post_tags
FOR EACH ROW
BEGIN
    UPDATE forum_tags 
    SET post_count = (
        SELECT COUNT(*) 
        FROM forum_post_tags 
        WHERE tag_id = NEW.tag_id
    )
    WHERE id = NEW.tag_id;
END $$

CREATE TRIGGER update_tag_post_count_delete
AFTER DELETE ON forum_post_tags
FOR EACH ROW
BEGIN
    UPDATE forum_tags 
    SET post_count = (
        SELECT COUNT(*) 
        FROM forum_post_tags 
        WHERE tag_id = OLD.tag_id
    )
    WHERE id = OLD.tag_id;
END $$

DELIMITER ;
-- 
CREATE TABLE user_daily_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,                        

    vocab_learned INT DEFAULT 0,                    
    grammar_completed INT DEFAULT 0,                
    exercises_done INT DEFAULT 0,                  
    writing_submitted INT DEFAULT 0,               
    forum_posts INT DEFAULT 0,                      
    forum_comments INT DEFAULT 0,                   

    study_time_minutes INT DEFAULT 0,              
    xp_earned INT DEFAULT 0,                        
    accuracy_rate DECIMAL(5,2) NULL,                
    is_study_day BOOLEAN DEFAULT FALSE,             
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_date (user_id, date),
    INDEX idx_date_study (date, is_study_day)
);

CREATE TABLE user_streaks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_activity_date DATE NULL,
    streak_start_date DATE NULL,
    longest_streak_date DATE NULL,
    total_study_days INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_streak (user_id),
    INDEX idx_current_streak (current_streak),
    INDEX idx_longest_streak (longest_streak)
);
CREATE TABLE user_xp_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    activity_type ENUM('vocab', 'grammar', 'writing', 'forum', 'badge', 'streak') NOT NULL,
    activity_id INT NULL,
    xp_earned INT NOT NULL CHECK (xp_earned >= 0),
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type),
    INDEX idx_user_date (user_id, created_at),
    INDEX idx_activity_type_id (activity_type, activity_id)
);

CREATE TABLE user_answer_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_type ENUM('vocab_exercise', 'grammar_exercise') NOT NULL,
    question_id INT NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent INT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_question (user_id, question_type, question_id),
    INDEX idx_user_date (user_id, answered_at),
    INDEX idx_correctness (is_correct)
);
DELIMITER $$

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
END $$

CREATE TRIGGER update_topic_total_words_update
AFTER UPDATE ON vocab_words
FOR EACH ROW
BEGIN
    IF OLD.topic_id != NEW.topic_id THEN
        UPDATE vocab_topics 
        SET total_words = (
            SELECT COUNT(*) 
            FROM vocab_words 
            WHERE topic_id = OLD.topic_id AND is_active = TRUE
        )
        WHERE id = OLD.topic_id;
    END IF;
    
    UPDATE vocab_topics 
    SET total_words = (
        SELECT COUNT(*) 
        FROM vocab_words 
        WHERE topic_id = NEW.topic_id AND is_active = TRUE
    )
    WHERE id = NEW.topic_id;
END $$

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
END $$

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
END $$

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
END $$

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
END $$

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
END $$

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
END $$

DELIMITER $$

CREATE TRIGGER update_writing_word_count_insert
BEFORE INSERT ON writing_prompts
FOR EACH ROW
BEGIN
    IF NEW.user_content IS NOT NULL THEN
        SET NEW.word_count = (
            SELECT CASE 
                WHEN TRIM(NEW.user_content) = '' THEN 0
                ELSE CHAR_LENGTH(TRIM(NEW.user_content)) - CHAR_LENGTH(REPLACE(TRIM(NEW.user_content), ' ', '')) + 1
            END
        );
    END IF;
END $$

CREATE TRIGGER update_writing_word_count_update
BEFORE UPDATE ON writing_prompts
FOR EACH ROW
BEGIN
    IF NEW.user_content IS NOT NULL AND NEW.user_content != IFNULL(OLD.user_content, '') THEN
        SET NEW.word_count = (
            SELECT CASE 
                WHEN TRIM(NEW.user_content) = '' THEN 0
                ELSE CHAR_LENGTH(TRIM(NEW.user_content)) - CHAR_LENGTH(REPLACE(TRIM(NEW.user_content), ' ', '')) + 1
            END
        );
    END IF;
END $$

CREATE TRIGGER update_user_total_xp
AFTER INSERT ON user_xp_history
FOR EACH ROW
BEGIN
    UPDATE users 
    SET total_xp = total_xp + NEW.xp_earned
    WHERE id = NEW.user_id;
END $$

CREATE TRIGGER update_daily_stats_vocab
AFTER UPDATE ON vocab_user_progress
FOR EACH ROW
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        INSERT INTO user_daily_stats (user_id, date, vocab_learned, is_study_day)
        VALUES (NEW.user_id, CURDATE(), 1, TRUE)
        ON DUPLICATE KEY UPDATE
            vocab_learned = vocab_learned + 1,
            is_study_day = TRUE;
    END IF;
END $$

CREATE TRIGGER update_daily_stats_grammar
AFTER UPDATE ON user_grammar_progress
FOR EACH ROW
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        INSERT INTO user_daily_stats (user_id, date, grammar_completed, is_study_day)
        VALUES (NEW.user_id, CURDATE(), 1, TRUE)
        ON DUPLICATE KEY UPDATE
            grammar_completed = grammar_completed + 1,
            is_study_day = TRUE;
    END IF;
END $$

CREATE TRIGGER update_daily_stats_writing
AFTER UPDATE ON writing_prompts
FOR EACH ROW
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        INSERT INTO user_daily_stats (user_id, date, writing_submitted, is_study_day)
        VALUES (NEW.user_id, CURDATE(), 1, TRUE)
        ON DUPLICATE KEY UPDATE
            writing_submitted = writing_submitted + 1,
            is_study_day = TRUE;
    END IF;
END $$

CREATE TRIGGER update_user_streak_on_stats
AFTER INSERT ON user_daily_stats
FOR EACH ROW
BEGIN
    DECLARE current_streak_count INT DEFAULT 0;
    DECLARE longest_streak_count INT DEFAULT 0;
    DECLARE last_date DATE;
    DECLARE streak_start DATE;
    
    IF NEW.is_study_day = TRUE THEN
        SELECT current_streak, longest_streak, last_activity_date, streak_start_date
        INTO current_streak_count, longest_streak_count, last_date, streak_start
        FROM user_streaks 
        WHERE user_id = NEW.user_id;
        
        IF current_streak_count IS NULL THEN
            SET current_streak_count = 0;
            SET longest_streak_count = 0;
        END IF;
        
        IF last_date IS NULL OR DATEDIFF(NEW.date, last_date) = 1 THEN
            SET current_streak_count = current_streak_count + 1;
            IF streak_start IS NULL THEN
                SET streak_start = NEW.date;
            END IF;
        ELSEIF DATEDIFF(NEW.date, last_date) > 1 THEN
            SET current_streak_count = 1;
            SET streak_start = NEW.date;
        ELSEIF NEW.date = last_date THEN
            SET current_streak_count = current_streak_count;
        END IF;
        
        IF current_streak_count > longest_streak_count THEN
            SET longest_streak_count = current_streak_count;
        END IF;
        
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date, total_study_days)
        VALUES (NEW.user_id, current_streak_count, longest_streak_count, NEW.date, streak_start, 1)
        ON DUPLICATE KEY UPDATE
            current_streak = current_streak_count,
            longest_streak = longest_streak_count,
            last_activity_date = NEW.date,
            streak_start_date = streak_start,
            total_study_days = total_study_days + 1;
    END IF;
END $$

DELIMITER ;






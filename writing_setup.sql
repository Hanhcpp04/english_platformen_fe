-- Create writing_categories table
CREATE TABLE IF NOT EXISTS writing_categories (
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

-- Create writing_prompts table
CREATE TABLE IF NOT EXISTS writing_prompts (
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

-- Insert sample categories
INSERT INTO writing_categories (name, description, xp_reward, writing_tips, sample_prompt, is_active) VALUES
('Essay Writing', 'Viết bài luận về các chủ đề khác nhau', 100, 
'1. Có câu mở đầu hấp dẫn\n2. Phát triển ý rõ ràng\n3. Sử dụng từ nối phù hợp\n4. Kết luận mạch lạc', 
'Write an essay about the importance of learning English in the modern world (250-300 words)', TRUE),

('Story Writing', 'Sáng tác truyện ngắn và kể chuyện', 80,
'1. Tạo nhân vật sinh động\n2. Có cốt truyện rõ ràng\n3. Sử dụng miêu tả chi tiết\n4. Có climax và kết thúc', 
'Write a short story about a memorable adventure (200-250 words)', TRUE),

('Letter Writing', 'Viết thư cá nhân và công việc', 70,
'1. Định dạng đúng chuẩn\n2. Ngôn ngữ phù hợp\n3. Trình bày ý rõ ràng\n4. Kết thúc lịch sự', 
'Write a formal letter applying for a job position (150-200 words)', TRUE),

('Email Writing', 'Viết email trong công việc và giao tiếp', 60,
'1. Subject line rõ ràng\n2. Lời chào phù hợp\n3. Nội dung ngắn gọn\n4. Kết thúc chuyên nghiệp', 
'Write a professional email to your manager requesting a day off (100-150 words)', TRUE),

('Descriptive Writing', 'Miêu tả người, địa điểm, sự vật', 75,
'1. Sử dụng 5 giác quan\n2. Chi tiết cụ thể\n3. Từ vựng phong phú\n4. Tạo hình ảnh sinh động', 
'Describe your favorite place in your hometown (200-250 words)', TRUE),

('Opinion Writing', 'Viết bày tỏ quan điểm cá nhân', 90,
'1. Nêu quan điểm rõ ràng\n2. Đưa ra lý lẽ thuyết phục\n3. Sử dụng ví dụ cụ thể\n4. Kết luận chắc chắn', 
'Do you agree or disagree: "Social media has more negative than positive effects"? (250-300 words)', TRUE);

-- Insert sample prompts for Essay Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'The Importance of English', 1, 'Write an essay about the importance of learning English in the modern world. Discuss at least three reasons why English is essential for personal and professional development. (250-300 words)', FALSE, TRUE),
(1, 'Technology and Education', 1, 'Write an essay discussing how technology has changed education. Include both positive and negative impacts. Support your ideas with examples. (250-300 words)', FALSE, TRUE),
(1, 'Climate Change Solutions', 1, 'Write an essay about practical solutions to climate change that individuals can implement in their daily lives. (250-300 words)', FALSE, TRUE);

-- Insert sample prompts for Story Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'A Mysterious Package', 2, 'Write a short story that begins with: "When I opened the mysterious package that arrived at my door, I couldn\'t believe what I saw..." (200-250 words)', FALSE, TRUE),
(1, 'The Time Traveler', 2, 'Write a story about someone who accidentally travels back in time to an important historical event. (200-250 words)', FALSE, TRUE),
(1, 'Lost in the Forest', 2, 'Write a story about getting lost in a forest and the adventure that follows. (200-250 words)', FALSE, TRUE);

-- Insert sample prompts for Letter Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'Job Application Letter', 3, 'Write a formal letter applying for a marketing position at a tech company. Include your qualifications and why you\'re interested in the role. (150-200 words)', FALSE, TRUE),
(1, 'Complaint Letter', 3, 'Write a formal complaint letter to a store manager about a defective product you purchased. (150-200 words)', FALSE, TRUE),
(1, 'Thank You Letter', 3, 'Write a thank you letter to a professor who helped you with your research project. (150-200 words)', FALSE, TRUE);

-- Insert sample prompts for Email Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'Meeting Request', 4, 'Write a professional email to a client requesting a meeting to discuss a new project proposal. (100-150 words)', FALSE, TRUE),
(1, 'Project Update', 4, 'Write an email to your team updating them on the progress of a current project. (100-150 words)', FALSE, TRUE),
(1, 'Leave Request', 4, 'Write a professional email to your manager requesting a day off for personal reasons. (100-150 words)', FALSE, TRUE);

-- Insert sample prompts for Descriptive Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'My Favorite Place', 5, 'Describe your favorite place in your hometown. Include sensory details (what you see, hear, smell, feel) to make it vivid. (200-250 words)', FALSE, TRUE),
(1, 'A Memorable Person', 5, 'Describe a person who has had a significant impact on your life. Focus on their appearance, personality, and what makes them special. (200-250 words)', FALSE, TRUE),
(1, 'A Perfect Day', 5, 'Describe what a perfect day would look like for you from morning to night. (200-250 words)', FALSE, TRUE);

-- Insert sample prompts for Opinion Writing
INSERT INTO writing_prompts (user_id, title, category_id, prompt, is_completed, is_active) VALUES
(1, 'Social Media Effects', 6, 'Do you agree or disagree: "Social media has more negative than positive effects"? Present your opinion with supporting arguments and examples. (250-300 words)', FALSE, TRUE),
(1, 'Online vs Traditional Learning', 6, 'Express your opinion: Is online learning better than traditional classroom learning? Support your view with reasons. (250-300 words)', FALSE, TRUE),
(1, 'Working from Home', 6, 'Share your opinion on whether companies should allow employees to work from home permanently. (250-300 words)', FALSE, TRUE);

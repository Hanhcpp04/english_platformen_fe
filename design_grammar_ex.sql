-- Topic 1: Basic Tenses - Các thì cơ bản
INSERT INTO exercise_grammar_type (name, topic_id, description, is_active) VALUES
('Multiple Choice', 1, 'Chọn đáp án đúng trong 4 lựa chọn', TRUE),
('Fill in the Blank', 1, 'Điền động từ chia đúng thì vào chỗ trống', TRUE),
-- Topic 2: Parts of Speech - Từ loại
INSERT INTO exercise_grammar_type (name, topic_id, description, is_active) VALUES
('Multiple Choice', 2, 'Chọn từ loại đúng để điền vào câu', TRUE),
('Fill in the Blank', 2, 'Điền từ loại thích hợp vào chỗ trống', TRUE);
-- Topic 3: Sentence Structure - Cấu trúc câu
INSERT INTO exercise_grammar_type (name, topic_id, description, is_active) VALUES
('Multiple Choice', 3, 'Chọn cấu trúc câu đúng', TRUE),
('Error Correction', 3, 'Tìm và sửa lỗi cấu trúc câu', TRUE);
-- Topic 4: Verbs and Sentence Patterns - Động từ và mẫu câu
INSERT INTO exercise_grammar_type (name, topic_id, description, is_active) VALUES
('Multiple Choice', 4, 'Chọn động từ hoặc mẫu câu đúng', TRUE),
('Fill in the Blank', 4, 'Điền động từ hoặc cấu trúc phù hợp', TRUE),
-- Topic 5: Advanced Grammar - Ngữ pháp nâng cao
INSERT INTO exercise_grammar_type (name, topic_id, description, is_active) VALUES
('Multiple Choice', 5, 'Chọn cấu trúc ngữ pháp nâng cao đúng', TRUE),
('Fill in the Blank', 5, 'Điền cấu trúc nâng cao vào chỗ trống', TRUE),
-- Lesson 1: Present Simple - Multiple Choice
INSERT INTO grammar_questions (lesson_id, type_id, question, options, correct_answer, xp_reward, is_active) VALUES
(1, 1, 'She _____ to school every day.', 
 '["go", "goes", "going", "gone"]', 
 'goes', 5, TRUE),
 -- Lesson 1: Present Simple - Fill in the Blank
INSERT INTO grammar_questions (lesson_id, type_id, question, options, correct_answer, xp_reward, is_active) VALUES
(1, 2, 'I _____ (play) football every weekend.', 
 NULL, 
 'play', 5, TRUE),
 
-- Bảng writing_topic:
CREATE TABLE writing_topic (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);

CREATE TABLE writing_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_id INT NOT NULL,
    question TEXT NULL,
    writing_tips TEXT NULL,
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0),
    is_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_writing_form
        FOREIGN KEY (form_id) REFERENCES writing_form(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_form (form_id),
    INDEX idx_active (is_active)
);
INSERT INTO writing_topic (id, name, is_active)
VALUES
(1, 'Code of Ethics in a Technology Company', TRUE),
(2, 'Artificial Intelligence in Daily Life', TRUE),
(3, 'Cybersecurity Awareness', TRUE),
(4, 'Remote Work Culture', TRUE),
(5, 'Environmental Responsibility in Companies', TRUE);

INSERT INTO writing_tasks (form_id, question, writing_tips, xp_reward, is_completed, is_active)
VALUES
(1,
 'Write a paragraph (120–140 words) about the rules and principles in a code of ethics in a technology company.',

 '- What are the rules and principles?
  - How can you explain those?
  - What are examples of those?
  - How do these principles influence your work?
  - Are they important?',
 50, FALSE, TRUE),

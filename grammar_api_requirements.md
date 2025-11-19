# Grammar Feature - API Requirements & Backend Logic

## Tổng quan
Tài liệu này mô tả các API endpoints và logic backend cần thiết cho chức năng học Ngữ pháp (Grammar) dựa trên database schema và yêu cầu frontend.

---

## 1. API Endpoints

### 1.1. Grammar Topics Management

#### GET `/api/grammar/topics`
**Mục đích**: Lấy danh sách tất cả các chủ đề ngữ pháp

**Query Parameters**:
- `user_id` (required): ID của người dùng
- `is_active` (optional): Lọc theo trạng thái active (default: true)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Present Tenses",
      "description": "Present Simple, Present Continuous, Present Perfect",
      "xp_reward": 100,
      "total_lessons": 5,
      "completed_lessons": 5,
      "status": "completed|in-progress|new",
      "progress_percentage": 100,
      "is_active": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Backend Logic**:
1. Lấy tất cả topics từ bảng `grammar_topics` WHERE `is_active = true`
2. Với mỗi topic, JOIN với `user_grammar_progress` để tính:
   - `total_lessons`: COUNT lessons từ bảng `grammar_lessons` WHERE `topic_id` AND `is_active = true`
   - `completed_lessons`: COUNT DISTINCT lessons mà user đã hoàn thành (type = 'theory' AND is_completed = true)
   - `status`: 
     - "completed" nếu `completed_lessons = total_lessons`
     - "in-progress" nếu `completed_lessons > 0 AND completed_lessons < total_lessons`
     - "new" nếu `completed_lessons = 0`
   - `progress_percentage`: `(completed_lessons / total_lessons) * 100`

---

#### GET `/api/grammar/topics/:topic_id`
**Mục đích**: Lấy chi tiết một chủ đề ngữ pháp

**Path Parameters**:
- `topic_id`: ID của topic

**Query Parameters**:
- `user_id` (required): ID của người dùng

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Present Tenses",
    "description": "Present Simple, Present Continuous, Present Perfect",
    "xp_reward": 100,
    "total_lessons": 5,
    "completed_lessons": 3,
    "lessons": [
      {
        "id": 1,
        "title": "Present Simple - Basic",
        "xp_reward": 20,
        "is_completed": true,
        "completed_at": "2025-01-15T10:30:00Z"
      }
    ],
    "exercise_types": [
      {
        "id": 1,
        "name": "Multiple Choice",
        "description": "Choose the correct answer"
      }
    ]
  }
}
```

---

### 1.2. Grammar Lessons

#### GET `/api/grammar/lessons/:lesson_id`
**Mục đích**: Lấy chi tiết bài học (nội dung lý thuyết)

**Path Parameters**:
- `lesson_id`: ID của bài học

**Query Parameters**:
- `user_id` (required): ID của người dùng

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "topic_id": 1,
    "title": "Present Simple - Basic",
    "content": "<html>Nội dung bài học...</html>",
    "xp_reward": 20,
    "is_completed": true,
    "completed_at": "2025-01-15T10:30:00Z",
    "next_lesson_id": 2,
    "prev_lesson_id": null,
    "total_exercises": 10,
    "completed_exercises": 7
  }
}
```

**Backend Logic**:
1. Lấy lesson từ `grammar_lessons` WHERE `id = lesson_id` AND `is_active = true`
2. JOIN với `user_grammar_progress` để check xem user đã hoàn thành chưa (type = 'theory')
3. Tính `next_lesson_id` và `prev_lesson_id` trong cùng topic
4. Đếm tổng số exercises và số exercises đã hoàn thành

---

#### POST `/api/grammar/lessons/:lesson_id/complete`
**Mục đích**: Đánh dấu bài học lý thuyết đã hoàn thành

**Path Parameters**:
- `lesson_id`: ID của bài học

**Request Body**:
```json
{
  "user_id": 1
}
```

**Response**:
```json
{
  "success": true,
  "message": "Lesson completed successfully",
  "data": {
    "xp_earned": 20,
    "new_total_xp": 300
  }
}
```

**Backend Logic**:
1. Kiểm tra lesson_id có tồn tại và active không
2. Kiểm tra user đã complete lesson này chưa
3. INSERT hoặc UPDATE vào `user_grammar_progress`:
   - `user_id`, `topic_id`, `lesson_id`
   - `type = 'theory'`
   - `is_completed = true`
   - `completed_at = NOW()`
   - `question_id = NULL`
4. Cộng XP vào tài khoản user (nếu có bảng user_xp hoặc users.total_xp)
5. Return tổng XP hiện tại

---

### 1.3. Grammar Exercises

#### GET `/api/grammar/lessons/:lesson_id/exercises`
**Mục đích**: Lấy danh sách bài tập của một bài học

**Path Parameters**:
- `lesson_id`: ID của bài học

**Query Parameters**:
- `user_id` (required): ID của người dùng
- `type_id` (optional): Lọc theo loại bài tập

**Response**:
```json
{
  "success": true,
  "data": {
    "lesson_id": 1,
    "lesson_title": "Present Simple - Basic",
    "exercise_types": [
      {
        "type_id": 1,
        "type_name": "Multiple Choice",
        "total_questions": 5,
        "completed_questions": 3
      }
    ],
    "questions": [
      {
        "id": 1,
        "type_id": 1,
        "question": "She _____ to school every day.",
        "options": ["go", "goes", "going", "gone"],
        "xp_reward": 5,
        "is_completed": true
      }
    ]
  }
}
```

**Backend Logic**:
1. Lấy tất cả questions từ `grammar_questions` WHERE `lesson_id` AND `is_active = true`
2. JOIN với `exercise_grammar_type` để lấy tên loại bài tập
3. JOIN với `user_grammar_progress` để check câu nào đã complete (type = 'exercise')
4. GROUP BY type_id để đếm số câu hỏi theo từng loại
5. **KHÔNG trả về `correct_answer`** trong response (chỉ trả về khi submit answer)

---

#### POST `/api/grammar/exercises/:question_id/submit`
**Mục đích**: Nộp bài và kiểm tra đáp án

**Path Parameters**:
- `question_id`: ID của câu hỏi

**Request Body**:
```json
{
  "user_id": 1,
  "user_answer": "goes"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "is_correct": true,
    "correct_answer": "goes",
    "explanation": "Với chủ ngữ số ít (she), động từ phải thêm 's/es'",
    "xp_earned": 5,
    "new_total_xp": 305
  }
}
```

**Backend Logic**:
1. Lấy question từ `grammar_questions` WHERE `id = question_id`
2. So sánh `user_answer` với `correct_answer`
3. Nếu đúng:
   - INSERT/UPDATE vào `user_grammar_progress`:
     - `type = 'exercise'`
     - `is_completed = true`
     - `completed_at = NOW()`
   - Cộng XP từ `grammar_questions.xp_reward`
4. Return kết quả (đúng/sai) và correct_answer
5. Kiểm tra xem user đã hoàn thành hết exercises của lesson chưa
   - Nếu có: tự động đánh dấu lesson completed

---

### 1.4. User Progress & Statistics

#### GET `/api/grammar/user/statistics`
**Mục đích**: Lấy thống kê tổng quan của user

**Query Parameters**:
- `user_id` (required): ID của người dùng

**Response**:
```json
{
  "success": true,
  "data": {
    "total_lessons_completed": 8,
    "total_topics_in_progress": 2,
    "accuracy_rate": 87,
    "total_xp_earned": 280,
    "current_streak": 5,
    "total_exercises_completed": 45,
    "total_exercises_correct": 39
  }
}
```

**Backend Logic**:
1. Query từ `user_grammar_progress`:
   - `total_lessons_completed`: COUNT DISTINCT lesson_id WHERE type = 'theory' AND is_completed = true
   - `total_topics_in_progress`: COUNT DISTINCT topic_id WHERE có lesson in-progress
   - `total_exercises_completed`: COUNT WHERE type = 'exercise' AND is_completed = true
2. Tính `accuracy_rate`:
   - Cần thêm cột `is_correct` trong bảng `user_grammar_progress` hoặc tạo bảng `user_exercise_answers`
   - `accuracy_rate = (số câu đúng / tổng số câu đã làm) * 100`
3. Tính `total_xp_earned`: SUM all XP từ lessons và exercises đã complete
4. `current_streak`: Tính số ngày liên tiếp user có hoàn thành ít nhất 1 bài

---

#### GET `/api/grammar/user/progress/:topic_id`
**Mục đích**: Lấy chi tiết tiến độ của user trong một topic

**Path Parameters**:
- `topic_id`: ID của topic

**Query Parameters**:
- `user_id` (required): ID của người dùng

**Response**:
```json
{
  "success": true,
  "data": {
    "topic_id": 1,
    "topic_name": "Present Tenses",
    "lessons_progress": [
      {
        "lesson_id": 1,
        "lesson_title": "Present Simple - Basic",
        "theory_completed": true,
        "theory_completed_at": "2025-01-15T10:30:00Z",
        "exercises_total": 10,
        "exercises_completed": 10,
        "exercises_percentage": 100
      }
    ],
    "overall_percentage": 80,
    "xp_earned": 150,
    "xp_remaining": 50
  }
}
```
httpGET /api/grammar/topics/{topicId}/lessons
Query Parameters:

user_id (required): ID của user
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": 1,
        "title": "Present Simple - Thì hiện tại đơn",
        "content": "<h2>Thì hiện tại tiếp diễn...</h2>",
        "xp_reward": 100,
        "is_active": true,
        "created_at": "2025-01-01T00:00:00Z",
       "is_completed: "false"
      },
      {
        "id": 2,
        "title": "Present Continuous - Thì hiện tại tiếp diễn",
         "content": "<h2>Thì hiện tại tiếp diễn...</h2>",
        "xp_reward": 100,
        "is_active": true,
        "created_at": "2025-01-01T00:00:00Z",
        "is_completed: "true"
      }
    ],
    "summary": {
      "in_progress": 12,
      "completed_lessons":2 ,
      "not_started": 1
    }
  }
}
---

## 2. Cải tiến Database Schema (Đề xuất)

### 2.1. Thêm bảng `user_exercise_answers`
Để tracking chi tiết hơn về câu trả lời của user:

```sql
CREATE TABLE user_exercise_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES grammar_questions(id) ON DELETE CASCADE,
    INDEX idx_user_question (user_id, question_id),
    INDEX idx_user_correct (user_id, is_correct)
);
```

**Lợi ích**:
- Lưu lịch sử các lần làm bài (user có thể làm lại)
- Dễ tính accuracy rate
- Phân tích điểm yếu của user (câu nào sai nhiều lần)

---

### 2.2. Thêm cột vào bảng hiện có

#### Bảng `grammar_topics`:
```sql
ALTER TABLE grammar_topics 
ADD COLUMN display_order INT DEFAULT 0,
ADD COLUMN icon_name VARCHAR(50) NULL,
ADD COLUMN color_theme VARCHAR(50) NULL;
```

#### Bảng `grammar_lessons`:
```sql
ALTER TABLE grammar_lessons 
ADD COLUMN display_order INT DEFAULT 0,
ADD COLUMN estimated_time INT DEFAULT 15 COMMENT 'Estimated time in minutes';
```

---

## 3. Business Logic quan trọng

### 3.1. Điều kiện mở khóa bài học
**Logic**: User phải hoàn thành bài học trước mới được học bài tiếp theo

```
- Lesson 1: Luôn mở (free access)
- Lesson 2: Mở khi complete Lesson 1 (theory + all exercises)
- Lesson 3: Mở khi complete Lesson 2
...
```

**Implementation**:
- API check điều kiện: `GET /api/grammar/lessons/:lesson_id/can-access?user_id=X`
- Return: `{ can_access: true/false, reason: "..." }`

---

### 3.2. Tính toán XP
**XP Sources**:
1. Hoàn thành lý thuyết: `grammar_lessons.xp_reward`
2. Làm đúng mỗi câu hỏi: `grammar_questions.xp_reward`
3. Hoàn thành toàn bộ topic: `grammar_topics.xp_reward` (bonus)

**XP Rules**:
- User chỉ nhận XP 1 lần cho mỗi lesson/exercise
- Làm lại bài tập không được XP (chỉ để luyện tập)
- Có thể thêm bonus XP cho streak, perfect score, etc.

---

### 3.3. Progress Tracking Rules

**Lesson Completion**:
- Lesson được coi là hoàn thành KHI:
  1. User đã đọc xong lý thuyết (click "Complete" button)
  2. User đã làm đúng >= 80% số câu hỏi của lesson đó

**Topic Completion**:
- Topic được coi là hoàn thành KHI:
  - Tất cả lessons trong topic đã completed

---

## 4. API Error Handling

### Common Error Responses:

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "User ID is required"
  }
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "LESSON_LOCKED",
    "message": "Complete previous lesson to unlock this lesson",
    "details": {
      "required_lesson_id": 1,
      "required_lesson_title": "Present Simple - Basic"
    }
  }
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Lesson not found"
  }
}
```

---

## 5. Optimization & Performance

### 5.1. Caching Strategy
- Cache danh sách topics (TTL: 1 hour)
- Cache lesson content (TTL: 24 hours)
- User progress: No cache (realtime)

### 5.2. Database Indexes
Đã có trong schema:
- `idx_active` trên các bảng chính
- `idx_user_topic`, `idx_user_activity` cho tracking
- `idx_topic_active` cho filter nhanh

### 5.3. Pagination
- Topics: Không cần (thường < 20 items)
- Lessons: Pagination nếu > 50 items per topic
- Exercises: Load theo batch (10-20 câu/lần)

---

## 6. Security Considerations

### 6.1. Authorization
- Mỗi API call phải verify `user_id` từ JWT token
- Không cho phép user access data của user khác
- Admin role để quản lý topics/lessons/questions

### 6.2. Input Validation
- Sanitize user input (đặc biệt là text answers)
- Validate question_id, lesson_id exists trước khi process
- Rate limiting cho submit answers (prevent spam)

### 6.3. Answer Security
- **KHÔNG** expose `correct_answer` trong list API
- Chỉ return correct_answer sau khi user submit
- Validate answer ở backend (không trust client)

---

## 7. Future Enhancements

### 7.1. Gamification
- Achievements (hoàn thành 10 lessons, 100 exercises, etc.)
- Leaderboard (top XP earners)
- Daily challenges

### 7.2. Adaptive Learning
- Tracking câu hỏi sai nhiều lần
- Đề xuất bài học ôn tập
- Personalized learning path

### 7.3. Analytics
- Time spent per lesson
- Most difficult questions (highest error rate)
- Learning patterns (thời gian học, frequency)

---

## 8. Testing Requirements

### 8.1. Unit Tests
- XP calculation logic
- Progress percentage calculation
- Lesson unlock conditions

### 8.2. Integration Tests
- Complete learning flow: theory → exercises → completion
- Multiple users accessing same lesson
- Progress tracking across sessions

### 8.3. Load Tests
- 1000+ concurrent users accessing topics
- Bulk exercise submissions
- Progress calculation performance

---

## Phụ lục: Sample SQL Queries

### Query 1: Lấy topics với progress của user
```sql
SELECT 
    t.id,
    t.name,
    t.description,
    t.xp_reward,
    COUNT(DISTINCT l.id) as total_lessons,
    COUNT(DISTINCT CASE 
        WHEN ugp.is_completed = true AND ugp.type = 'theory' 
        THEN ugp.lesson_id 
    END) as completed_lessons
FROM grammar_topics t
LEFT JOIN grammar_lessons l ON t.id = l.topic_id AND l.is_active = true
LEFT JOIN user_grammar_progress ugp 
    ON l.id = ugp.lesson_id 
    AND ugp.user_id = ? 
    AND ugp.type = 'theory'
WHERE t.is_active = true
GROUP BY t.id
ORDER BY t.id;
```

### Query 2: Check lesson unlock condition
```sql
SELECT 
    CASE 
        WHEN prev_lesson.id IS NULL THEN true
        WHEN prev_progress.is_completed = true THEN true
        ELSE false
    END as can_access
FROM grammar_lessons curr_lesson
LEFT JOIN grammar_lessons prev_lesson 
    ON prev_lesson.topic_id = curr_lesson.topic_id 
    AND prev_lesson.display_order = curr_lesson.display_order - 1
LEFT JOIN user_grammar_progress prev_progress 
    ON prev_progress.lesson_id = prev_lesson.id 
    AND prev_progress.user_id = ? 
    AND prev_progress.type = 'theory'
WHERE curr_lesson.id = ?;
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-30  
**Author**: Backend Development Team

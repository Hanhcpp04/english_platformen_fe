# Hệ Thống Bài Tập Ngữ Pháp

## 📚 Tổng quan

Hệ thống bài tập ngữ pháp với 3 dạng bài chính:
1. **Multiple Choice** - Trắc nghiệm 4 lựa chọn
2. **Fill in the Blank** - Điền từ vào chỗ trống
3. **Error Correction** - Tìm và sửa lỗi (có thể mở rộng sau)

## 🗂️ Cấu trúc Database

### Bảng `exercise_grammar_type`
```sql
- id: INT (Primary Key)
- name: VARCHAR (Multiple Choice, Fill in the Blank, Error Correction)
- topic_id: INT (Foreign Key -> grammar_topic)
- description: TEXT
- is_active: BOOLEAN
```

### Bảng `grammar_questions`
```sql
- id: INT (Primary Key)
- lesson_id: INT (Foreign Key -> grammar_lesson)
- type_id: INT (Foreign Key -> exercise_grammar_type)
- question: TEXT
- options: JSON (cho Multiple Choice, NULL cho Fill in the Blank)
- correct_answer: VARCHAR
- explanation: TEXT
- xp_reward: INT (mặc định 5)
- is_active: BOOLEAN
```

## 🎯 Luồng hoạt động

### 1. Học bài (Grammar Detail Page)
- User xem nội dung lý thuyết của lesson
- Hoàn thành bài học → Nhận XP
- Nút "Làm bài tập ôn tập" xuất hiện (gradient purple-pink)

### 2. Làm bài tập (Exercise Page)
**URL:** `/grammar/:topicId/exercises`

**Tính năng:**
- Hiển thị câu hỏi từng câu một
- Progress bar theo dõi tiến độ
- Kiểm tra câu trả lời ngay lập tức
- Hiển thị giải thích sau mỗi câu
- Question navigator (grid 10 câu/hàng)
- Navigation: Câu trước, Câu tiếp theo

**Màu sắc trạng thái:**
- ⚪ Chưa làm: Gray
- 🔵 Đang làm: Blue (với ring)
- ✅ Đúng: Green
- ❌ Sai: Red

### 3. Hoàn thành (Completion Screen)
**Hiển thị:**
- Tổng số câu đúng/sai
- Phần trăm chính xác
- Tổng XP nhận được
- Nút "Làm lại" và "Quay lại chủ đề"

## 💾 Mock Data Example

```javascript
const MOCK_EXERCISES = {
  1: [ // Topic ID
    {
      id: 1,
      lesson_id: 1,
      type: 'Multiple Choice',
      question: 'She _____ to school every day.',
      options: ['go', 'goes', 'going', 'gone'],
      correct_answer: 'goes',
      explanation: 'Với chủ ngữ số ít ngôi thứ 3...',
      xp_reward: 5,
    },
    {
      id: 2,
      lesson_id: 1,
      type: 'Fill in the Blank',
      question: 'I _____ (play) football every weekend.',
      correct_answer: 'play',
      explanation: 'Với chủ ngữ "I", động từ giữ nguyên...',
      xp_reward: 5,
    },
  ],
};
```

## 🎨 UI/UX Features

### Progress Tracking
- **Progress Bar:** Gradient blue to purple
- **Question Counter:** "Câu X/Y"
- **Answered Counter:** "Đã trả lời: X/Y"

### Question Display
- **Type Badge:** Purple background với tên loại bài
- **XP Badge:** Yellow với icon Zap
- **Question:** Text 2xl, bold

### Answer Options
- **Multiple Choice:** 4 buttons dạng card
- **Fill in the Blank:** Large input field
- **Hover States:** Border color change
- **Selected State:** Blue border & background
- **Correct State:** Green border & background với CheckCircle icon
- **Incorrect State:** Red border & background với XCircle icon

### Feedback Box
- **Correct:** Green background, CheckCircle icon
- **Incorrect:** Red background, XCircle icon, hiển thị đáp án đúng
- **Explanation:** Luôn hiển thị sau khi check

### Navigation
- **Prev/Next Buttons:** Disabled states rõ ràng
- **Question Grid:** 10 câu mỗi hàng, responsive
- **Sticky Header:** Progress bar + breadcrumb

## 🔧 Các API cần implement

```javascript
// Get exercises by topic
GET /api/grammar/topics/:topicId/exercises
Response: {
  code: 1000,
  result: {
    exercises: [...],
    total: 10
  }
}

// Submit exercise answer
POST /api/grammar/exercises/:exerciseId/submit
Body: {
  user_id: 4,
  answer: "goes",
  time_spent: 15 // seconds
}
Response: {
  code: 1000,
  result: {
    is_correct: true,
    xp_earned: 5,
    explanation: "..."
  }
}

// Get exercise progress
GET /api/grammar/topics/:topicId/exercises/progress?user_id=4
Response: {
  code: 1000,
  result: {
    total_exercises: 10,
    completed: 7,
    correct: 5,
    total_xp: 25
  }
}
```

## 📱 Responsive Design

- **Mobile (< 640px):** 5 câu/hàng trong grid
- **Tablet (640px - 1024px):** 8 câu/hàng
- **Desktop (> 1024px):** 10 câu/hàng

## ✨ Animations

- Progress bar: `transition-all duration-300`
- Button hover: `hover:scale-105`
- Feedback slide in: `animate-in fade-in`
- Loading spinner: `animate-spin`

## 🎯 Future Enhancements

1. **Error Correction Type:**
   - Highlight lỗi trong câu
   - Click để sửa
   - Dropdown suggestions

2. **Timed Exercises:**
   - Countdown timer
   - Bonus XP cho câu trả lời nhanh

3. **Leaderboard:**
   - Top users theo accuracy
   - Top users theo XP

4. **Achievements:**
   - Perfect score badges
   - Streak tracking
   - Special rewards

5. **Review Mode:**
   - Chỉ xem lại câu sai
   - Practice weak areas

## 🚀 How to Use

1. **Học lesson** trong Grammar Detail Page
2. **Hoàn thành lesson** → Nhận XP
3. **Click "Làm bài tập ôn tập"** (nút gradient purple-pink)
4. **Làm từng câu** và kiểm tra ngay
5. **Xem kết quả** cuối cùng
6. **Làm lại** hoặc quay lại chủ đề

## 📊 State Management

```javascript
const [exercises, setExercises] = useState([]);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [userAnswers, setUserAnswers] = useState({});
const [showFeedback, setShowFeedback] = useState({});
const [isCompleted, setIsCompleted] = useState(false);
```

## 🎨 Color Scheme

- **Primary:** Blue (#3B82F6)
- **Success:** Green (#10B981)
- **Error:** Red (#EF4444)
- **Warning:** Yellow (#F59E0B)
- **Purple:** (#9333EA)
- **Pink:** (#EC4899)

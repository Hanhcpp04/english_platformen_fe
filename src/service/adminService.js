import { request } from "./request";

// ==================== DASHBOARD ====================

/**
 * Lấy dữ liệu dashboard cho admin
 * @returns {Promise} AdminDashboardDTO
 */
export const getAdminDashboard = async () => {
  try {
    const res = await request.get('admin/dashboard');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== USER MANAGEMENT ====================

/**
 * Lấy tất cả users (có phân trang)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminUserResponse>
 */
export const getAllUsers = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-users/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật role của user
 * @param {number} id - User ID
 * @param {string} role - Role mới (USER, ADMIN)
 * @returns {Promise} APIResponse<String>
 */
export const updateUserRole = async (id, role) => {
  try {
    const res = await request.put(`admin-users/update-role/${id}/${role}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục user
 * @param {number} id - User ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreUser = async (id, status) => {
  try {
    const res = await request.put(`admin-users/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy thông tin cơ bản của user
 * @param {number} userId - User ID
 * @returns {Promise} APIResponse<AdminUserResponse>
 */
export const getUserProfile = async (userId) => {
  try {
    const res = await request.get(`admin-users/profile/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== LEVEL MANAGEMENT ====================

/**
 * Lấy tất cả levels (không phân trang)
 * @returns {Promise} APIResponse<List<LevelEntity>>
 */
export const getAllLevels = async () => {
  try {
    const res = await request.get('admin-levels/getAll');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo level mới
 * @param {Object} levelData - { levelNumber, xpRequired }
 * @returns {Promise} APIResponse
 */
export const createLevel = async (levelData) => {
  try {
    const res = await request.post('admin-levels/create', levelData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật level
 * @param {number} levelNumber - Số level
 * @param {Object} levelData - { xpRequired }
 * @returns {Promise} APIResponse
 */
export const updateLevel = async (levelNumber, levelData) => {
  try {
    const res = await request.put(`admin-levels/update/${levelNumber}`, levelData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== BADGE MANAGEMENT ====================

/**
 * Lấy tất cả badges (có phân trang)
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminBadgeResponse>
 */
export const getAllBadges = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-badges/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo badge mới
 * @param {Object} badgeData - Dữ liệu badge
 * @param {File} iconFile - File icon
 * @returns {Promise} APIResponse
 */
export const createBadge = async (badgeData, iconFile) => {
  try {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(badgeData)], { type: 'application/json' }));
    formData.append('icon', iconFile);

    const res = await request.post('admin-badges/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật badge
 * @param {number} id - Badge ID
 * @param {Object} badgeData - Dữ liệu badge
 * @param {File|null} iconFile - File icon (optional)
 * @returns {Promise} APIResponse
 */
export const updateBadge = async (id, badgeData, iconFile = null) => {
  try {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(badgeData)], { type: 'application/json' }));
    
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    const res = await request.put(`admin-badges/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục badge
 * @param {number} id - Badge ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreBadge = async (id, status) => {
  try {
    const res = await request.put(`admin-badges/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== VOCAB TOPIC MANAGEMENT ====================

/**
 * Lấy tất cả vocab topics (có phân trang)
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminVocabTopicResponse>
 */
export const getAllVocabTopics = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-vocab/topics/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo vocab topic mới
 * @param {Object} topicData - Dữ liệu topic (englishName, name, description, icon, xpReward)
 * @returns {Promise} APIResponse
 */
export const createVocabTopic = async (topicData) => {
  try {
    const res = await request.post('admin-vocab/topics/create', topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật vocab topic
 * @param {number} id - Topic ID
 * @param {Object} topicData - Dữ liệu topic (englishName, name, description, icon, xpReward)
 * @returns {Promise} APIResponse
 */
export const updateVocabTopic = async (id, topicData) => {
  try {
    const res = await request.put(`admin-vocab/topics/update/${id}`, topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục vocab topic
 * @param {number} id - Topic ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreVocabTopic = async (id, status) => {
  try {
    const res = await request.put(`admin-vocab/topics/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== VOCAB WORD MANAGEMENT ====================

/**
 * Lấy tất cả vocab words (có phân trang)
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminVocabWordResponse>
 */
export const getAllVocabWords = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-vocab/words/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy words theo topic
 * @param {number} topicId - Topic ID
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminVocabWordResponse>
 */
export const getWordsByTopic = async (topicId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-vocab/words/by-topic/${topicId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo vocab word mới
 * @param {Object} wordData - Dữ liệu word (topicId, englishWord, vietnameseMeaning, pronunciation, exampleSentence, exampleTranslation, wordType, xpReward)
 * @returns {Promise} APIResponse
 */
export const createVocabWord = async (wordData) => {
  try {
    const res = await request.post('admin-vocab/words/create', wordData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật vocab word
 * @param {number} id - Word ID
 * @param {Object} wordData - Dữ liệu word
 * @returns {Promise} APIResponse
 */
export const updateVocabWord = async (id, wordData) => {
  try {
    const res = await request.put(`admin-vocab/words/update/${id}`, wordData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục vocab word
 * @param {number} id - Word ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreVocabWord = async (id, status) => {
  try {
    const res = await request.put(`admin-vocab/words/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== DASHBOARD STATS (for Admin) ====================

/**
 * Lấy dashboard summary cho admin
 * @returns {Promise} DashboardSummaryDTO
 */
export const getAdminDashboardSummary = async () => {
  try {
    const res = await request.get('dashboard/summary');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== GRAMMAR TOPIC MANAGEMENT (for Admin) ====================

/**
 * Lấy tất cả Grammar Topics với phân trang
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminGrammarTopicResponse>
 */
export const getAllGrammarTopics = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-grammar/topics/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo Grammar Topic mới
 * @param {Object} topicData - {name, description, isActive, xpReward}
 * @returns {Promise} APIResponse
 */
export const createGrammarTopic = async (topicData) => {
  try {
    const res = await request.post('admin-grammar/topics/create', topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật Grammar Topic
 * @param {number} id - Topic ID
 * @param {Object} topicData - {name, description, isActive, xpReward}
 * @returns {Promise} APIResponse
 */
export const updateGrammarTopic = async (id, topicData) => {
  try {
    const res = await request.put(`admin-grammar/topics/update/${id}`, topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục Grammar Topic
 * @param {number} id - Topic ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreGrammarTopic = async (id, status) => {
  try {
    const res = await request.put(`admin-grammar/topics/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== GRAMMAR LESSON MANAGEMENT (for Admin) ====================

/**
 * Lấy tất cả Grammar Lessons với phân trang
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminGrammarLessonResponse>
 */
export const getAllGrammarLessons = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-grammar/lessons/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy Grammar Lessons theo topic
 * @param {number} topicId - Topic ID
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} Page<AdminGrammarLessonResponse>
 */
export const getLessonsByTopic = async (topicId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-grammar/lessons/by-topic/${topicId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo Grammar Lesson mới
 * @param {Object} lessonData - {topicId, title, content, xpReward, isActive}
 * @returns {Promise} APIResponse
 */
export const createGrammarLesson = async (lessonData) => {
  try {
    const res = await request.post('admin-grammar/lessons/create', lessonData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật Grammar Lesson
 * @param {number} id - Lesson ID
 * @param {Object} lessonData - {topicId, title, content, xpReward, isActive}
 * @returns {Promise} APIResponse
 */
export const updateGrammarLesson = async (id, lessonData) => {
  try {
    const res = await request.put(`admin-grammar/lessons/update/${id}`, lessonData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục Grammar Lesson
 * @param {number} id - Lesson ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreGrammarLesson = async (id, status) => {
  try {
    const res = await request.put(`admin-grammar/lessons/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== WRITING MANAGEMENT ====================

/**
 * Lấy tất cả Writing Topics
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} APIResponse<Page<AdminWritingTopicResponse>>
 */
export const getAllWritingTopics = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-writing/topics/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo Writing Topic mới
 * @param {Object} topicData - {name, isActive}
 * @returns {Promise} APIResponse<AdminWritingTopicResponse>
 */
export const createWritingTopic = async (topicData) => {
  try {
    const res = await request.post('admin-writing/topics/create', topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật Writing Topic
 * @param {number} id - Topic ID
 * @param {Object} topicData - {name, isActive}
 * @returns {Promise} APIResponse<AdminWritingTopicResponse>
 */
export const updateWritingTopic = async (id, topicData) => {
  try {
    const res = await request.put(`admin-writing/topics/update/${id}`, topicData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục Writing Topic
 * @param {number} id - Topic ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreWritingTopic = async (id, status) => {
  try {
    const res = await request.put(`admin-writing/topics/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy tất cả Writing Tasks
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} APIResponse<Page<AdminWritingTaskResponse>>
 */
export const getAllWritingTasks = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-writing/tasks/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy Writing Tasks theo Topic
 * @param {number} topicId - Topic ID
 * @param {number} page - Trang hiện tại
 * @param {number} size - Số lượng items mỗi trang
 * @returns {Promise} APIResponse<Page<AdminWritingTaskResponse>>
 */
export const getTasksByTopic = async (topicId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-writing/tasks/by-topic/${topicId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo Writing Task mới
 * @param {Object} taskData - {topicId, question, writingTips, xpReward, isActive}
 * @returns {Promise} APIResponse<AdminWritingTaskResponse>
 */
export const createWritingTask = async (taskData) => {
  try {
    const res = await request.post('admin-writing/tasks/create', taskData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật Writing Task
 * @param {number} id - Task ID
 * @param {Object} taskData - {topicId, question, writingTips, xpReward, isActive}
 * @returns {Promise} APIResponse<AdminWritingTaskResponse>
 */
export const updateWritingTask = async (id, taskData) => {
  try {
    const res = await request.put(`admin-writing/tasks/update/${id}`, taskData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục Writing Task
 * @param {number} id - Task ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreWritingTask = async (id, status) => {
  try {
    const res = await request.put(`admin-writing/tasks/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật tiêu chí chấm điểm cho Writing Task
 * @param {number} taskId - Task ID
 * @param {Object} criteriaData - {grammarWeight, vocabularyWeight, coherenceWeight, minWordCount, maxWordCount, customInstructions}
 * @returns {Promise} APIResponse<AdminGradingCriteriaResponse>
 */
export const updateGradingCriteria = async (taskId, criteriaData) => {
  try {
    const res = await request.put(`admin-writing/tasks/${taskId}/grading-criteria`, criteriaData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== FORUM MANAGEMENT ====================

/**
 * Lấy tất cả forum posts (có phân trang và filter)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @param {boolean} isActive - Filter theo trạng thái (null = tất cả)
 * @param {string} search - Tìm kiếm theo title/content
 * @returns {Promise} APIResponse<Page<AdminForumPostResponse>>
 */
export const getAllForumPosts = async (page = 0, size = 10, isActive = null, search = null) => {
  try {
    const params = { page, size };
    if (isActive !== null) params.isActive = isActive;
    if (search) params.search = search;
    
    const res = await request.get('admin-forum/posts', { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục forum post
 * @param {number} postId - Post ID
 * @param {string} action - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreForumPost = async (postId, action) => {
  try {
    const res = await request.put(`admin-forum/posts/${postId}/${action}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy tất cả forum comments (có phân trang và filter)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @param {boolean} isActive - Filter theo trạng thái (null = tất cả)
 * @param {number} postId - Filter theo post ID (null = tất cả)
 * @returns {Promise} APIResponse<Page<AdminForumCommentResponse>>
 */
export const getAllForumComments = async (page = 0, size = 10, isActive = null, postId = null) => {
  try {
    const params = { page, size };
    if (isActive !== null) params.isActive = isActive;
    if (postId) params.postId = postId;
    
    const res = await request.get('admin-forum/comments', { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục forum comment
 * @param {number} commentId - Comment ID
 * @param {string} action - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<String>
 */
export const deleteOrRestoreForumComment = async (commentId, action) => {
  try {
    const res = await request.put(`admin-forum/comments/${commentId}/${action}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy thống kê forum cho admin
 * @returns {Promise} APIResponse<AdminForumStatisticsResponse>
 */
export const getForumStatistics = async () => {
  try {
    const res = await request.get('admin-forum/statistics');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== REPORTS ====================

/**
 * Xuất báo cáo Excel
 * @param {Object} params - Tham số báo cáo
 * @param {string} params.reportType - Loại báo cáo (OVERALL, USER_ACTIVITY, VOCABULARY, GRAMMAR, WRITING, FORUM)
 * @param {string} params.startDate - Ngày bắt đầu (yyyy-MM-dd)
 * @param {string} params.endDate - Ngày kết thúc (yyyy-MM-dd)
 * @param {string} params.dateGrouping - Nhóm theo (DAY, MONTH, YEAR)
 * @returns {Promise<Blob>} File Excel
 */
export const exportExcelReport = async ({ reportType, startDate, endDate, dateGrouping }) => {
  try {
    const params = new URLSearchParams();
    if (reportType) params.append('reportType', reportType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (dateGrouping) params.append('dateGrouping', dateGrouping);

    const res = await request.get(`admin/reports/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy danh sách loại báo cáo
 * @returns {Promise} APIResponse<String[]>
 */
export const getReportTypes = async () => {
  try {
    const res = await request.get('admin/reports/types');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== VOCAB EXCEL IMPORT ====================

/**
 * Tải mẫu Excel để nhập từ vựng
 * @returns {Promise<Blob>} File Excel template
 */
export const downloadVocabTemplate = async () => {
  try {
    const res = await request.get('admin-vocab/excel/template', {
      responseType: 'blob'
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Import từ vựng từ file Excel
 * @param {number} topicId - ID của topic để thêm từ vựng
 * @param {File} file - File Excel
 * @returns {Promise} APIResponse<VocabImportResultDTO>
 */
export const importVocabFromExcel = async (topicId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await request.post(`admin-vocab/excel/import?topicId=${topicId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== VOCAB EXERCISE TYPE MANAGEMENT ====================

/**
 * Lấy tất cả loại bài tập từ vựng (có phân trang)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminVocabExerciseTypeResponse>
 */
export const getAllVocabExerciseTypes = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-vocab/exercise-types/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo loại bài tập từ vựng mới
 * @param {Object} data - { name, description, instruction, isActive }
 * @returns {Promise} APIResponse<AdminVocabExerciseTypeResponse>
 */
export const createVocabExerciseType = async (data) => {
  try {
    const res = await request.post('admin-vocab/exercise-types/create', data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật loại bài tập từ vựng
 * @param {number} id - Exercise Type ID
 * @param {Object} data - { name, description, instruction, isActive }
 * @returns {Promise} APIResponse<AdminVocabExerciseTypeResponse>
 */
export const updateVocabExerciseType = async (id, data) => {
  try {
    const res = await request.put(`admin-vocab/exercise-types/update/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục loại bài tập từ vựng
 * @param {number} id - Exercise Type ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<AdminVocabExerciseTypeResponse>
 */
export const deleteOrRestoreVocabExerciseType = async (id, status) => {
  try {
    const res = await request.put(`admin-vocab/exercise-types/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== VOCAB EXERCISE QUESTION MANAGEMENT ====================

/**
 * Lấy tất cả câu hỏi bài tập từ vựng (có phân trang)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminVocabExerciseQuestionResponse>
 */
export const getAllVocabExerciseQuestions = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-vocab/exercise-questions/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy câu hỏi theo loại bài tập
 * @param {number} typeId - Exercise Type ID
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminVocabExerciseQuestionResponse>
 */
export const getVocabExerciseQuestionsByType = async (typeId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-vocab/exercise-questions/by-type/${typeId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy câu hỏi theo topic
 * @param {number} topicId - Topic ID
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminVocabExerciseQuestionResponse>
 */
export const getVocabExerciseQuestionsByTopic = async (topicId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-vocab/exercise-questions/by-topic/${topicId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo câu hỏi bài tập từ vựng mới
 * @param {Object} data - { typeId, topicId, question, options, correctAnswer, explanation, xpReward, isActive }
 * @returns {Promise} APIResponse<AdminVocabExerciseQuestionResponse>
 */
export const createVocabExerciseQuestion = async (data) => {
  try {
    const res = await request.post('admin-vocab/exercise-questions/create', data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật câu hỏi bài tập từ vựng
 * @param {number} id - Question ID
 * @param {Object} data - { typeId, topicId, question, options, correctAnswer, explanation, xpReward, isActive }
 * @returns {Promise} APIResponse<AdminVocabExerciseQuestionResponse>
 */
export const updateVocabExerciseQuestion = async (id, data) => {
  try {
    const res = await request.put(`admin-vocab/exercise-questions/update/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục câu hỏi bài tập từ vựng
 * @param {number} id - Question ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<AdminVocabExerciseQuestionResponse>
 */
export const deleteOrRestoreVocabExerciseQuestion = async (id, status) => {
  try {
    const res = await request.put(`admin-vocab/exercise-questions/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== GRAMMAR EXERCISE TYPE MANAGEMENT ====================

/**
 * Lấy tất cả loại bài tập ngữ pháp (có phân trang)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminExerciseGrammarTypeResponse>
 */
export const getAllGrammarExerciseTypes = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-grammar/exercise-types/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy loại bài tập ngữ pháp theo topic
 * @param {number} topicId - Topic ID
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminExerciseGrammarTypeResponse>
 */
export const getGrammarExerciseTypesByTopic = async (topicId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-grammar/exercise-types/by-topic/${topicId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo loại bài tập ngữ pháp mới
 * @param {Object} data - { topicId, name, description, isActive }
 * @returns {Promise} APIResponse<AdminExerciseGrammarTypeResponse>
 */
export const createGrammarExerciseType = async (data) => {
  try {
    const res = await request.post('admin-grammar/exercise-types/create', data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật loại bài tập ngữ pháp
 * @param {number} id - Exercise Type ID
 * @param {Object} data - { topicId, name, description, isActive }
 * @returns {Promise} APIResponse<AdminExerciseGrammarTypeResponse>
 */
export const updateGrammarExerciseType = async (id, data) => {
  try {
    const res = await request.put(`admin-grammar/exercise-types/update/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục loại bài tập ngữ pháp
 * @param {number} id - Exercise Type ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<AdminExerciseGrammarTypeResponse>
 */
export const deleteOrRestoreGrammarExerciseType = async (id, status) => {
  try {
    const res = await request.put(`admin-grammar/exercise-types/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ==================== GRAMMAR EXERCISE QUESTION MANAGEMENT ====================

/**
 * Lấy tất cả câu hỏi bài tập ngữ pháp (có phân trang)
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminGrammarQuestionResponse>
 */
export const getAllGrammarExerciseQuestions = async (page = 0, size = 10) => {
  try {
    const res = await request.get('admin-grammar/exercise-questions/getAll', {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy câu hỏi theo loại bài tập ngữ pháp
 * @param {number} typeId - Exercise Type ID
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminGrammarQuestionResponse>
 */
export const getGrammarExerciseQuestionsByType = async (typeId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-grammar/exercise-questions/by-type/${typeId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy câu hỏi theo lesson
 * @param {number} lessonId - Lesson ID
 * @param {number} page - Trang hiện tại (mặc định: 0)
 * @param {number} size - Số lượng items mỗi trang (mặc định: 10)
 * @returns {Promise} Page<AdminGrammarQuestionResponse>
 */
export const getGrammarExerciseQuestionsByLesson = async (lessonId, page = 0, size = 10) => {
  try {
    const res = await request.get(`admin-grammar/exercise-questions/by-lesson/${lessonId}`, {
      params: { page, size }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Tạo câu hỏi bài tập ngữ pháp mới
 * @param {Object} data - { lessonId, typeId, question, options, correctAnswer, xpReward, isActive }
 * @returns {Promise} APIResponse<AdminGrammarQuestionResponse>
 */
export const createGrammarExerciseQuestion = async (data) => {
  try {
    const res = await request.post('admin-grammar/exercise-questions/create', data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Cập nhật câu hỏi bài tập ngữ pháp
 * @param {number} id - Question ID
 * @param {Object} data - { lessonId, typeId, question, options, correctAnswer, xpReward, isActive }
 * @returns {Promise} APIResponse<AdminGrammarQuestionResponse>
 */
export const updateGrammarExerciseQuestion = async (id, data) => {
  try {
    const res = await request.put(`admin-grammar/exercise-questions/update/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Xóa hoặc khôi phục câu hỏi bài tập ngữ pháp
 * @param {number} id - Question ID
 * @param {string} status - "delete" hoặc "restore"
 * @returns {Promise} APIResponse<AdminGrammarQuestionResponse>
 */
export const deleteOrRestoreGrammarExerciseQuestion = async (id, status) => {
  try {
    const res = await request.put(`admin-grammar/exercise-questions/delete-restore/${id}/${status}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

import { request } from "./request";

/**
 * Writing Service - Quản lý các API liên quan đến Writing module
 */

// ==================== WRITING TOPICS ====================

/**
 * Lấy danh sách tất cả topics
 * GET /writing/topics
 * Response: [{ id, name }]
 */
export const getAllTopics = async () => {
  try {
    const response = await request.get("/writing/topics");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

// ==================== WRITING TASKS ====================

/**
 * Lấy danh sách tasks theo topicId
 * GET /writing/topics/{topicId}/tasks
 * Response: [{ id, question, writingTips, xpReward }]
 */
export const getTasksByTopicId = async (topicId) => {
  try {
    const response = await request.get(`/writing/topics/${topicId}/tasks`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching tasks for topic ${topicId}:`, error);
    throw error;
  }
};

// ==================== WRITING PROMPTS (User Writings) ====================

/**
 * Lấy danh sách prompts/writings của user cho một task
 * GET /writing/tasks/{taskId}/prompts?userId={userId}
 * Response: [{ 
 *   id, taskId, mode, userContent, wordCount, 
 *   grammarScore, vocabularyScore, coherenceScore, overallScore,
 *   aiFeedback, grammarSuggestions, vocabularySuggestions,
 *   timeSpent, xpReward, isCompleted, submittedAt, createdAt
 * }]
 */
export const getPromptsByTaskId = async (taskId, userId) => {
  try {
    const response = await request.get(`/writing/tasks/${taskId}/prompts`, {
      params: { userId }
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching prompts for task ${taskId}:`, error);
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Parse grammar suggestions từ JSON string
 */
export const parseGrammarSuggestions = (suggestionsJson) => {
  try {
    if (!suggestionsJson) return [];
    if (typeof suggestionsJson === 'object') return suggestionsJson;
    return JSON.parse(suggestionsJson);
  } catch (error) {
    console.error("Error parsing grammar suggestions:", error);
    return [];
  }
};

/**
 * Parse vocabulary suggestions từ JSON string
 */
export const parseVocabularySuggestions = (suggestionsJson) => {
  try {
    if (!suggestionsJson) return [];
    if (typeof suggestionsJson === 'object') return suggestionsJson;
    return JSON.parse(suggestionsJson);
  } catch (error) {
    console.error("Error parsing vocabulary suggestions:", error);
    return [];
  }
};

/**
 * Format time spent (seconds) thành readable string
 */
export const formatTimeSpent = (seconds) => {
  if (!seconds) return "0 phút";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else if (minutes > 0) {
    return `${minutes} phút ${secs} giây`;
  } else {
    return `${secs} giây`;
  }
};

/**
 * Tính overall score từ các score components
 */
export const calculateOverallScore = (grammarScore, vocabularyScore, coherenceScore) => {
  const scores = [grammarScore, vocabularyScore, coherenceScore].filter(s => s != null);
  if (scores.length === 0) return 0;
  
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
};

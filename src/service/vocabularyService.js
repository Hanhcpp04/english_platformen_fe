import { request } from "./request";

/**
 * Get vocabulary words by topic ID and user ID
 * @param {number} topicId - The topic ID
 * @param {number} userId - The user ID
 * @returns {Promise} - API response with vocabulary list
 */
export const getVocabularyByTopic = async (topicId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await request.get(`vocab/topic/${topicId}/words`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching vocabulary:", err);
    throw err.response?.data || err;
  }
};

/**
 * Mark a vocabulary word as completed
 * @param {number} userId - The user ID
 * @param {number} vocabId - The vocabulary ID
 * @returns {Promise} - API response
 */
export const completeVocabulary = async (userId, wordId, topicId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const url = `vocab/complete`;
    const res = await request.post(
      `${url}?userId=${encodeURIComponent(userId)}`,
      { wordId, topicId },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      }
    );
    // toio muoons log data
    console.log("Vocabulary marked as completed:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error completing vocabulary:", err);
    throw err.response?.data || err;
  }
};

/**
 * 🩵 Step 1: Get exercise types by topic
 * @param {number} topicId - The topic ID
 * @param {number} userId - The user ID
 * @returns {Promise} - API response with exercise types list
 */
export const getExerciseTypesByTopic = async (topicId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await request.get(
      `vocab/exercise/topics/${topicId}/exercise-types`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching exercise types:", err);
    throw err.response?.data || err;
  }
};

/**
 * 🩷 Step 2: Get questions for a specific exercise type and topic
 * @param {number} typeId - The exercise type ID
 * @param {number} topicId - The topic ID
 * @param {number} userId - The user ID
 * @returns {Promise} - API response with questions list
 */
export const getExerciseQuestions = async (typeId, topicId, userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await request.get(
      `vocab/exercise/exercise-types/${typeId}/topics/${topicId}/questions`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching exercise questions:", err);
    throw err.response?.data || err;
  }
};

/**
 * 💚 Step 3: Submit answer for a question
 * @param {number} questionId - The question ID
 * @param {object} answerData - Answer data containing userId, userAnswer, exerciseType, typeId, topicId
 * @returns {Promise} - API response with result
 */
export const submitExerciseAnswer = async (questionId, answerData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await request.post(
      `vocab/exercise/questions/${questionId}/submit`,
      answerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    if (err.response?.status === 409) {
      alert("Bạn đã trả lời câu hỏi này rồi hoặc bài tập đã hoàn tất!");
    } else {
      console.error("Error submitting answer:", err);
    }
    throw err.response?.data || err;
  }
};

import { request } from "./request";

/**
 * Get vocabulary words by topic ID and user ID
 * @param {number} topicId - The topic ID
 * @param {number} userId - The user ID
 * @returns {Promise} - API response with vocabulary list
 */
export const getVocabularyByTopic = async (topicId, userId) => {
  try {
    // Token sẽ tự động được thêm bởi request interceptor
    const res = await request.get(`vocab/topic/${topicId}/words`, {
      params: { userId }
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
    // Token sẽ tự động được thêm bởi request interceptor
    const url = `vocab/complete`;
    const res = await request.post(
      `${url}?userId=${encodeURIComponent(userId)}`,
      { wordId, topicId },
      {
        headers: {
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
    // Token sẽ tự động được thêm bởi request interceptor
    const res = await request.get(
      `vocab/exercise/topics/${topicId}/exercise-types`,
      {
        params: { userId }
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching exercise types:", err);
    throw err.response?.data || err;
  }
};


export const getExerciseQuestions = async (typeId, topicId, userId) => {
  try {
    // Token sẽ tự động được thêm bởi request interceptor
    const res = await request.get(
      `vocab/exercise/exercise-types/${typeId}/topics/${topicId}/questions`,
      {
        params: { userId }
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching exercise questions:", err);
    throw err.response?.data || err;
  }
};

export const submitExerciseAnswer = async (questionId, answerData) => {
  try {
    // Token sẽ tự động được thêm bởi request interceptor
    const res = await request.post(
      `vocab/exercise/questions/${questionId}/submit`,
      answerData,
      {
        headers: {
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

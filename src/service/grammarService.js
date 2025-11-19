import { request } from './request';


export const getGrammarStats = async (userId) => {
  try {
    const response = await request.get(`/grammar/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching grammar stats:', error);
    throw error;
  }
};


export const getTopicLessons = async (topicId, userId) => {
  try {
    const response = await request.get(`/grammar/topics/${topicId}/lessons?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching topic lessons:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Complete a lesson (mark as done)
export const completeLesson = async (userId, topicId, lessonId, type = 'theory') => {
  try {
    const response = await request.post('/grammar/lessons/complete', {
      userId,
      topicId,
      lessonId,
      type
    });
    return response.data;
  } catch (error) {
    console.error('Error completing lesson:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Get exercise types for a topic/lesson
export const getExerciseTypes = async (topicId, lessonId) => {
  try {
    const response = await request.get(`/grammar/exercises/types?topic_id=${topicId || ''}&lesson_id=${lessonId || ''}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching exercise types:', error);
    throw error;
  }
};

// Get exercise questions
export const getExerciseQuestions = async (topicId, lessonId, typeId) => {
  try {
    const url = `/grammar/exercises/questions?topic_id=${topicId}&lesson_id=${lessonId}&type_id=${typeId}`;
    console.log('📝 Fetching exercise questions:', url);
    const response = await request.get(url);
    console.log('✅ Exercise questions response:', response.data);
    return response.data.result;
  } catch (error) {
    console.error('❌ Error fetching exercise questions:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Get exercise history
export const getExerciseHistory = async (userId, topicId, lessonId, typeId) => {
  try {
    const response = await request.get(`/grammar/exercises/history?user_id=${userId}&topic_id=${topicId}&lesson_id=${lessonId}&type_id=${typeId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    throw error;
  }
};

// Submit exercise answer
export const submitExerciseAnswer = async (userId, questionId, typeId, userAnswer) => {
  try {
    const response = await request.post('/grammar/exercises/submit', {
      user_id: userId,
      question_id: questionId,
      type_id: typeId,
      user_answer: userAnswer
    });
    return response.data.result;
  } catch (error) {
    console.error('Error submitting exercise answer:', error);
    throw error;
  }
};

// Reset exercise answers for a lesson
export const resetExerciseAnswers = async (userId, lessonId, typeId) => {
  try {
    const response = await request.delete(`/grammar/exercises/reset?user_id=${userId}&lesson_id=${lessonId}&type_id=${typeId}`);
    return response.data;
  } catch (error) {
    console.error('Error resetting exercise answers:', error);
    throw error;
  }
};

// Get exercise accuracy statistics
export const getExerciseAccuracy = async (userId, lessonId, typeId) => {
  try {
    const response = await request.get(`/grammar/exercises/accuracy?user_id=${userId}&lesson_id=${lessonId}&type_id=${typeId}`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching exercise accuracy:', error);
    throw error;
  }
};

import { request } from "./request";

/**
 * Lấy tổng quan dashboard cho user đang login
 * @returns {Promise} DashboardSummaryDTO
 */
export const getDashboardSummary = async () => {
  try {
    const res = await request.get('dashboard/summary');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy tổng quan dashboard cho một user cụ thể
 * @param {number} userId - ID của user
 * @returns {Promise} DashboardSummaryDTO
 */
export const getDashboardSummaryByUserId = async (userId) => {
  try {
    const res = await request.get(`dashboard/summary/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

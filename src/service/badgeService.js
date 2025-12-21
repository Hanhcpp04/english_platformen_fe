import { request } from "./request";

/**
 * Lấy tổng số huy hiệu và huy hiệu gần đây của user
 * @param {number} userId - ID của user
 * @param {number} limit - Số lượng huy hiệu gần đây cần lấy (mặc định: 5)
 * @returns {Promise} UserBadgesSummaryDTO
 */
export const getUserBadgesSummary = async (userId, limit = 5) => {
  try {
    const res = await request.get(`badge/summary/${userId}`, {
      params: { limit }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy tất cả huy hiệu của user (đã đạt và chưa đạt)
 * @param {number} userId - ID của user
 * @returns {Promise} UserBadgesSummaryDTO
 */
export const getAllUserBadges = async (userId) => {
  try {
    const res = await request.get(`badge/all/${userId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy danh sách huy hiệu gần đây
 * @param {number} userId - ID của user
 * @param {number} limit - Số lượng huy hiệu (mặc định: 5)
 * @returns {Promise} List<BadgeDTO>
 */
export const getRecentBadges = async (userId, limit = 5) => {
  try {
    const res = await request.get(`badge/recent/${userId}`, {
      params: { limit }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy progress của tất cả badges cho user đang login
 * @returns {Promise} List<BadgeProgressDTO>
 */
export const getBadgeProgress = async () => {
  try {
    const res = await request.get('badge/progress');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy progress theo loại (vocabulary, grammar, etc.)
 * @param {string} type - Loại badge
 * @returns {Promise} List<BadgeProgressDTO>
 */
export const getBadgeProgressByType = async (type) => {
  try {
    const res = await request.get(`badge/progress/${type}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Lấy summary và badges đã earned cho user đang login
 * @returns {Promise} UserBadgesSummaryDTO
 */
export const getEarnedBadges = async () => {
  try {
    const res = await request.get('badge/earned');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

/**
 * Force check tất cả badges (để test hoặc sync)
 * @returns {Promise}
 */
export const forceCheckBadges = async () => {
  try {
    const res = await request.post('badge/check');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

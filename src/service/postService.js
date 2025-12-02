import { request } from "./request";

// Get all posts with filters
export const getPosts = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = "", dateFilter = "all" } = params;
    
    const response = await request.get("/forum/posts", {
      params: {
        page,
        limit,
        search,
        dateFilter,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Get post detail by ID
export const getPostDetail = async (postId) => {
  try {
    const response = await request.get(`/forum/post/detail/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (postData, userId) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    if (postData.title) formData.append("title", postData.title);
    formData.append("content", postData.content);
    
    // Add tags - send as individual values, not JSON
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }
    
    // Add images
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image) => {
        formData.append("images", image.file);
      });
    }
    
    // Add files
    if (postData.files && postData.files.length > 0) {
      postData.files.forEach((file) => {
        formData.append("files", file.file);
      });
    }
    
    const response = await request.post(`/forum/post/create/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Like/Unlike a post
export const likePost = async (postId) => {
  try {
    const response = await request.post(`/forum/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Comment on a post
export const commentPost = async (postId, commentData) => {
  try {
    const response = await request.post(`/forum/posts/${postId}/comments`, {
      content: commentData.content,
      parentId: commentData.parentId || null,
    });
    return response.data;
  } catch (error) {
    console.error("Error commenting on post:", error);
    throw error;
  }
};

// Get comments for a post
export const getPostComments = async (postId, params = {}) => {
  try {
    const { page = 1, limit = 20 } = params;
    
    const response = await request.get(`/forum/posts/${postId}/comments`, {
      params: {
        page,
        limit,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Like/Unlike a comment
export const likeComment = async (commentId) => {
  try {
    const response = await request.post(`/forum/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await request.delete(`/forum/post/delete/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId, postData) => {
  try {
    const formData = new FormData();
    
    // Add text fields (content is required)
    formData.append("content", postData.content);
    
    // Add tags - send as individual values
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }
    
    // Add new images
    if (postData.newImages && postData.newImages.length > 0) {
      postData.newImages.forEach((image) => {
        formData.append("images", image.file);
      });
    }
    
    // Add new files
    if (postData.newFiles && postData.newFiles.length > 0) {
      postData.newFiles.forEach((file) => {
        formData.append("files", file.file);
      });
    }
    
    // Add existing media IDs to keep
    if (postData.existingMediaIds && postData.existingMediaIds.length > 0) {
      postData.existingMediaIds.forEach((id) => {
        formData.append("existingMediaIds", id);
      });
    }
    
    // Add removed media IDs
    if (postData.removedMediaIds && postData.removedMediaIds.length > 0) {
      postData.removedMediaIds.forEach((id) => {
        formData.append("removedMediaIds", id);
      });
    }

    // Log what's being sent for debugging
    console.log("Sending update request for post:", postId);
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await request.put(`/forum/post/update/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, content) => {
  try {
    const response = await request.put(`/forum/comments/${commentId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await request.delete(`/forum/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Get posts by user (for My Posts page) - using the same endpoint with search by username
export const getUserPosts = async (userId, params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await request.get("/forum/posts", {
      params: {
        page,
        limit,
        userId,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Get recent posts
export const getRecentPosts = async (limit = 10) => {
  try {
    const response = await request.get("/forum/posts/recent", {
      params: {
        limit,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    throw error;
  }
};

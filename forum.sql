CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    fullname VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    provider VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    facebook_id VARCHAR(255) UNIQUE,
    total_xp INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_total_xp (total_xp),
    INDEX idx_role (role)
);
CREATE TABLE forum_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,

    target_type ENUM('post', 'comment') NOT NULL,
    post_id INT NULL,
    comment_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES forum_comments(id) ON DELETE CASCADE,

    UNIQUE KEY unique_user_like_post (user_id, post_id),
    UNIQUE KEY unique_user_like_comment (user_id, comment_id)
);


CREATE TABLE forum_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    xp_reward INT DEFAULT 20,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_active (user_id, is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_likes (likes_count),
    INDEX idx_comments_count (comments_count)
);
CREATE TABLE forum_comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,                           
    user_id INT NOT NULL,                           
    parent_id INT NULL, -- cái này nó sẽ liên kết đến cái cmt của mình để tạo ra cmt con nó là mối quan hệ đệ quy                              
    content TEXT NOT NULL,                          
    likes_count INT DEFAULT 0,                     
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    

    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES forum_comments(id) ON DELETE CASCADE,
    
    
    INDEX idx_post_active (post_id, is_active),
    INDEX idx_parent_created (parent_id, created_at),
    INDEX idx_user_created (user_id, created_at)
);
CREATE TABLE forum_post_media (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    media_type ENUM('image','file','text') NOT NULL,
    file_name VARCHAR(255) NULL,
    mime_type VARCHAR(100) NULL,
    file_size INT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    is_active BOOLEAN DEFAULT TRUE,           
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    INDEX idx_post_type (post_id, media_type),
    INDEX idx_post_created (post_id, created_at)
);
CREATE TABLE forum_post_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NULL,
    ip_address VARCHAR(45) NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_viewed (post_id, viewed_at),
    INDEX idx_user_post_date (user_id, post_id, viewed_at)
);
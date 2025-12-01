-- 确保User_profile表支持头像字段
-- 此迁移脚本是幂等的，可以安全地多次执行

-- 1. 检查并修改avatar字段长度（如果需要）
-- 从VARCHAR(32)改为VARCHAR(255)以支持完整的URL
ALTER TABLE User_profile 
MODIFY COLUMN avatar VARCHAR(255) NULL 
COMMENT '用户头像CDN链接';

-- 2. 为avatar字段添加索引（可选，用于查询优化）
-- 注意：只有在需要频繁通过avatar查询时才需要
-- CREATE INDEX idx_avatar ON User_profile(avatar);

-- 3. 验证字段
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM 
    INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'User_profile'
    AND COLUMN_NAME = 'avatar';

-- 预期结果：
-- COLUMN_NAME: avatar
-- COLUMN_TYPE: varchar(255)
-- IS_NULLABLE: YES
-- COLUMN_COMMENT: 用户头像CDN链接

-- 4. 查看已有头像数据统计
SELECT 
    COUNT(*) as total_users,
    COUNT(avatar) as users_with_avatar,
    COUNT(*) - COUNT(avatar) as users_without_avatar,
    ROUND(COUNT(avatar) * 100.0 / COUNT(*), 2) as avatar_percentage
FROM 
    User_profile;

-- 5. 查看头像URL示例（前10个）
SELECT 
    user_id,
    nickname,
    avatar,
    CHAR_LENGTH(avatar) as url_length,
    created_at
FROM 
    User_profile
WHERE 
    avatar IS NOT NULL
ORDER BY 
    created_at DESC
LIMIT 10;

-- 迁移完成提示
SELECT 
    'User_profile表头像字段检查完成' as status,
    NOW() as timestamp;

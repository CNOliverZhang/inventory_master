-- =====================================================
-- 用户数据迁移脚本：从 inventory_master.users 迁移到 user 数据库
-- 创建时间: 2025-11-26
-- 说明: 将现有用户数据迁移到统一用户认证系统
-- 警告: 执行前请备份数据库！
-- =====================================================

-- =====================================================
-- 第一步：检查现有数据
-- =====================================================
SELECT '检查 inventory_master.users 表数据' as '步骤';
SELECT COUNT(*) as '现有用户数' FROM inventory_master.users;

SELECT '检查 user.Auth_user 表数据' as '步骤';
SELECT COUNT(*) as '已迁移用户数' FROM user.Auth_user;

-- =====================================================
-- 第二步：迁移用户主表数据
-- =====================================================
-- 注意：这里使用 INSERT IGNORE 避免重复插入
-- 如果需要重新迁移，请先清空 user 数据库的相关表

SELECT '开始迁移用户主表数据' as '步骤';

INSERT IGNORE INTO user.Auth_user (id, is_admin, created_at, last_login_at)
SELECT 
  id,
  0 as is_admin,  -- 默认非管理员
  COALESCE(created_at, DATE(NOW())) as created_at,
  NULL as last_login_at
FROM inventory_master.users;

SELECT '用户主表迁移完成' as '步骤';
SELECT COUNT(*) as '迁移后用户数' FROM user.Auth_user;

-- =====================================================
-- 第三步：迁移认证凭据（邮箱）
-- =====================================================
SELECT '开始迁移邮箱认证凭据' as '步骤';

INSERT IGNORE INTO user.Auth_credential (user_id, auth_type, identifier, credential, created_at, updated_at)
SELECT 
  u.id as user_id,
  3 as auth_type,  -- 3 = EMAIL
  u.email as identifier,
  u.password as credential,
  COALESCE(u.created_at, DATE(NOW())) as created_at,
  COALESCE(u.updated_at, DATE(NOW())) as updated_at
FROM inventory_master.users u
WHERE u.email IS NOT NULL AND u.email != '';

SELECT '邮箱认证凭据迁移完成' as '步骤';
SELECT COUNT(*) as '邮箱凭据数' FROM user.Auth_credential WHERE auth_type = 3;

-- =====================================================
-- 第四步：迁移认证凭据（用户名）
-- =====================================================
SELECT '开始迁移用户名认证凭据' as '步骤';

-- 注意：用户名凭据共享密码
INSERT IGNORE INTO user.Auth_credential (user_id, auth_type, identifier, credential, created_at, updated_at)
SELECT 
  u.id as user_id,
  1 as auth_type,  -- 1 = USERNAME
  u.username as identifier,
  u.password as credential,  -- 共享密码
  COALESCE(u.created_at, DATE(NOW())) as created_at,
  COALESCE(u.updated_at, DATE(NOW())) as updated_at
FROM inventory_master.users u
WHERE u.username IS NOT NULL AND u.username != '';

SELECT '用户名认证凭据迁移完成' as '步骤';
SELECT COUNT(*) as '用户名凭据数' FROM user.Auth_credential WHERE auth_type = 1;

-- =====================================================
-- 第五步：迁移用户资料
-- =====================================================
SELECT '开始迁移用户资料' as '步骤';

INSERT IGNORE INTO user.User_profile (user_id, nickname, avatar, intro, created_at, updated_at)
SELECT 
  u.id as user_id,
  u.username as nickname,  -- 使用用户名作为昵称
  NULL as avatar,
  NULL as intro,
  COALESCE(u.created_at, DATE(NOW())) as created_at,
  COALESCE(u.updated_at, DATE(NOW())) as updated_at
FROM inventory_master.users u;

SELECT '用户资料迁移完成' as '步骤';
SELECT COUNT(*) as '用户资料数' FROM user.User_profile;

-- =====================================================
-- 第六步：数据验证
-- =====================================================
SELECT '数据验证' as '步骤';

-- 验证用户数量一致
SELECT 
  (SELECT COUNT(*) FROM inventory_master.users) as '原表用户数',
  (SELECT COUNT(*) FROM user.Auth_user) as '新表用户数',
  (SELECT COUNT(*) FROM user.User_profile) as '资料表记录数';

-- 验证认证凭据
SELECT 
  auth_type,
  CASE auth_type
    WHEN 1 THEN '用户名'
    WHEN 2 THEN '手机号'
    WHEN 3 THEN '邮箱'
    WHEN 4 THEN '微信'
    WHEN 5 THEN 'QQ'
  END as '认证类型',
  COUNT(*) as '数量'
FROM user.Auth_credential
GROUP BY auth_type;

-- 检查是否有用户没有任何认证凭据
SELECT 
  u.id,
  COUNT(c.id) as credential_count
FROM user.Auth_user u
LEFT JOIN user.Auth_credential c ON u.id = c.user_id
GROUP BY u.id
HAVING credential_count = 0;

-- =====================================================
-- 第七步：创建索引（如果需要）
-- =====================================================
SELECT '优化索引' as '步骤';

-- 为 identifier 创建索引（如果还没有）
-- ALTER TABLE user.Auth_credential ADD INDEX idx_identifier (identifier);
-- ALTER TABLE user.Auth_credential ADD INDEX idx_user_auth_type (user_id, auth_type);

-- =====================================================
-- 完成
-- =====================================================
SELECT '迁移完成！' as '状态';
SELECT NOW() as '完成时间';

-- =====================================================
-- 回滚脚本（如果需要回滚，请单独执行）
-- =====================================================
/*
-- 警告：此操作将删除所有迁移的数据！

USE user;

-- 删除用户资料
DELETE FROM User_profile WHERE user_id IN (
  SELECT id FROM inventory_master.users
);

-- 删除认证凭据
DELETE FROM Auth_credential WHERE user_id IN (
  SELECT id FROM inventory_master.users
);

-- 删除用户
DELETE FROM Auth_user WHERE id IN (
  SELECT id FROM inventory_master.users
);

SELECT '回滚完成' as '状态';
*/

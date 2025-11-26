-- =====================================================
-- 数据库变更脚本：为 user 数据库添加时间字段
-- 创建时间: 2025-11-26
-- 说明: 非破坏性变更，仅添加新字段
-- =====================================================

USE `user`;

-- =====================================================
-- 1. Auth_user 表：添加创建时间和最后登录时间
-- =====================================================
ALTER TABLE `Auth_user` 
ADD COLUMN `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建时间' AFTER `is_admin`,
ADD COLUMN `last_login_at` DATETIME NULL DEFAULT NULL COMMENT '最后登录时间' AFTER `created_at`;

-- 为存量数据设置创建时间为今天0点
UPDATE `Auth_user` 
SET `created_at` = DATE(NOW())
WHERE `created_at` = CURRENT_TIMESTAMP;

-- =====================================================
-- 2. Auth_credential 表：添加创建时间和更新时间
-- =====================================================
ALTER TABLE `Auth_credential`
ADD COLUMN `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '凭据绑定时间' AFTER `credential`,
ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '凭据修改时间' AFTER `created_at`;

-- 为存量数据设置时间为今天0点
UPDATE `Auth_credential`
SET `created_at` = DATE(NOW()),
    `updated_at` = DATE(NOW())
WHERE `created_at` = CURRENT_TIMESTAMP;

-- =====================================================
-- 3. User_profile 表：添加更新时间
-- =====================================================
ALTER TABLE `User_profile`
ADD COLUMN `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '资料创建时间' AFTER `intro`,
ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '资料修改时间' AFTER `created_at`;

-- 为存量数据设置时间为今天0点
UPDATE `User_profile`
SET `created_at` = DATE(NOW()),
    `updated_at` = DATE(NOW())
WHERE `created_at` = CURRENT_TIMESTAMP;

-- =====================================================
-- 验证变更
-- =====================================================
SELECT 'Auth_user 表结构' as '检查项';
DESCRIBE `Auth_user`;

SELECT 'Auth_credential 表结构' as '检查项';
DESCRIBE `Auth_credential`;

SELECT 'User_profile 表结构' as '检查项';
DESCRIBE `User_profile`;

-- =====================================================
-- 回滚脚本（如需回滚，请单独执行）
-- =====================================================
/*
USE `user`;

ALTER TABLE `Auth_user` 
DROP COLUMN `created_at`,
DROP COLUMN `last_login_at`;

ALTER TABLE `Auth_credential`
DROP COLUMN `created_at`,
DROP COLUMN `updated_at`;

ALTER TABLE `User_profile`
DROP COLUMN `created_at`,
DROP COLUMN `updated_at`;
*/

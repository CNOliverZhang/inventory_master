-- =====================================================
-- 修复 Auth_credential 表 id 字段自增问题
-- 创建时间: 2025-11-26
-- 说明: 将 id 字段设置为自增主键
-- =====================================================

USE `user`;

-- 第一步：查看当前表结构
SELECT 'Auth_credential 表当前结构' as '检查项';
DESCRIBE `Auth_credential`;

-- 第二步：查看当前索引信息
SELECT 'Auth_credential 表索引信息' as '检查项';
SHOW INDEX FROM `Auth_credential`;

-- 第三步：如果 id 不是主键，先删除现有主键（如果有）并设置 id 为主键
-- 然后设置 id 为自增

-- 方案A：如果 id 已经是主键，只需添加 AUTO_INCREMENT
-- ALTER TABLE `Auth_credential` 
-- MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '凭据ID';

-- 方案B：如果 id 不是主键，需要先设置为主键
-- 注意：如果表中有其他主键，需要先删除
ALTER TABLE `Auth_credential` 
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '凭据ID';

-- 第四步：验证修改后的结构
SELECT 'Auth_credential 表修改后结构' as '检查项';
DESCRIBE `Auth_credential`;

SELECT 'Auth_credential 表修改后索引' as '检查项';
SHOW INDEX FROM `Auth_credential`;

SELECT '修复完成！' as '状态';

-- =====================================================
-- 如果上面的方案B报错，请使用以下手动步骤：
-- =====================================================
/*
-- 1. 先查看当前主键
SHOW INDEX FROM `Auth_credential` WHERE Key_name = 'PRIMARY';

-- 2. 如果主键不是 id，记录当前主键字段名
-- 假设当前主键是 identifier，则执行：
ALTER TABLE `Auth_credential` DROP PRIMARY KEY;

-- 3. 设置 id 为主键并自增
ALTER TABLE `Auth_credential` 
ADD PRIMARY KEY (`id`),
MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '凭据ID';

-- 4. 如果需要保留 identifier 的唯一性
ALTER TABLE `Auth_credential` 
ADD UNIQUE KEY `uk_identifier` (`identifier`);
*/

-- =====================================================
-- 回滚脚本（如需回滚，请单独执行）
-- =====================================================
/*
USE `user`;

ALTER TABLE `Auth_credential` 
MODIFY COLUMN `id` INT UNSIGNED NOT NULL COMMENT '凭据ID';
*/

CREATE DATABASE `admin`;

use `admin`;

CREATE TABLE `admin_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL DEFAULT '',
  `permissions` tinytext NOT NULL COMMENT '权限，使用路由名称，英文逗号分隔',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台角色表';

INSERT INTO admin_role(id, name, permissions, remark, create_time) VALUES(1, '超级管理员', 'admin', '', '2022-11-17 16:47:30');


CREATE TABLE `admin_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(15) NOT NULL,
  `password` char(32) NOT NULL,
  `role_ids` tinytext COMMENT '角色id，英文逗号分隔',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='后台管理员表';

INSERT INTO admin_user(id, `user`, password, role_ids, create_time) VALUES(1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', '1', '2022-11-14 11:34:03');
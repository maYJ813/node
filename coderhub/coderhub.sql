/*
 Navicat Premium Data Transfer

 Source Server         : why_connection
 Source Server Type    : MySQL
 Source Server Version : 80031 (8.0.31)
 Source Host           : localhost:3306
 Source Schema         : coderhub

 Target Server Type    : MySQL
 Target Server Version : 80031 (8.0.31)
 File Encoding         : 65001

 Date: 22/11/2022 16:33:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for avatar
-- ----------------------------
DROP TABLE IF EXISTS `avatar`;
CREATE TABLE `avatar`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mimetype` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `size` int NULL DEFAULT NULL,
  `user_id` int NULL DEFAULT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `filename`(`filename` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `avatar_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of avatar
-- ----------------------------
INSERT INTO `avatar` VALUES (1, 'ae0a8c7318c6a03d711ecbed88d02bb5', 'image/jpeg', 38360, 7, '2022-11-22 14:58:37', '2022-11-22 14:58:37');
INSERT INTO `avatar` VALUES (2, 'a96f2e5207609d2ba8b314c913366640', 'image/png', 36267, 7, '2022-11-22 15:07:15', '2022-11-22 15:07:15');
INSERT INTO `avatar` VALUES (3, '03faa4e939cae28885b1b12adfe8a85f', 'image/jpeg', 16154, 7, '2022-11-22 15:12:43', '2022-11-22 15:12:43');
INSERT INTO `avatar` VALUES (4, 'cf383bf3b4a113a1e5bbe3c6a85b8ed6', 'image/jpeg', 38360, 7, '2022-11-22 15:24:03', '2022-11-22 15:24:03');
INSERT INTO `avatar` VALUES (5, 'f26f8df208637fe881ce0111a5c8472d', 'image/png', 36267, 7, '2022-11-22 15:26:50', '2022-11-22 15:26:50');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `moment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_id` int NULL DEFAULT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `moment_id`(`moment_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `comment_id`(`comment_id` ASC) USING BTREE,
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`moment_id`) REFERENCES `moment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, 'kunkun打球太帅了', 2, 7, NULL, '2022-11-20 17:17:50', '2022-11-20 17:17:50');
INSERT INTO `comment` VALUES (2, '确实太帅了, 尤其是那个转身!!!', 2, 7, 1, '2022-11-20 17:25:06', '2022-11-20 17:25:06');
INSERT INTO `comment` VALUES (3, '你好啊, 李银河!', 3, 7, NULL, '2022-11-22 09:23:45', '2022-11-22 09:23:45');
INSERT INTO `comment` VALUES (4, '好好唱歌, 好好rap, 好好打篮球!', 4, 7, NULL, '2022-11-22 09:24:31', '2022-11-22 09:24:31');
INSERT INTO `comment` VALUES (5, '可以去NBA打球, 太厉害了!', 2, 7, NULL, '2022-11-22 11:53:23', '2022-11-22 11:53:23');

-- ----------------------------
-- Table structure for label
-- ----------------------------
DROP TABLE IF EXISTS `label`;
CREATE TABLE `label`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of label
-- ----------------------------
INSERT INTO `label` VALUES (1, '篮球', '2022-11-22 10:00:09', '2022-11-22 10:00:09');
INSERT INTO `label` VALUES (2, '唱歌', '2022-11-22 10:00:30', '2022-11-22 10:00:30');
INSERT INTO `label` VALUES (3, '跳舞', '2022-11-22 10:00:35', '2022-11-22 10:00:35');
INSERT INTO `label` VALUES (4, 'rap', '2022-11-22 10:00:39', '2022-11-22 10:00:39');
INSERT INTO `label` VALUES (5, '人生', '2022-11-22 10:57:50', '2022-11-22 10:57:50');
INSERT INTO `label` VALUES (6, '爱情', '2022-11-22 11:00:01', '2022-11-22 11:00:01');
INSERT INTO `label` VALUES (7, '友情', '2022-11-22 11:00:01', '2022-11-22 11:00:01');
INSERT INTO `label` VALUES (8, '哲学', '2022-11-22 11:00:01', '2022-11-22 11:00:01');

-- ----------------------------
-- Table structure for moment
-- ----------------------------
DROP TABLE IF EXISTS `moment`;
CREATE TABLE `moment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `moment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of moment
-- ----------------------------
INSERT INTO `moment` VALUES (2, 'KUNKUN勇敢飞, IKUN永相随, 哈哈哈哈~', 7, '2022-11-20 15:17:14', '2022-11-20 16:59:22');
INSERT INTO `moment` VALUES (3, '纵然再苦守数百年 我的心意 始终如一', 1, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (4, 'KUNKUN勇敢飞~', 1, '2022-11-20 15:36:04', '2022-11-20 16:09:10');
INSERT INTO `moment` VALUES (5, '不要告诉我你不需要保护，不要告诉我你不寂寞，知微，我只希望你，在走过黑夜的那个时辰，不要倔强的选择一个人。', 3, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (6, 'If you shed tears when you miss the sun, you also miss the stars.如果你因失去了太阳而流泪，那么你也将失去群星了。', 1, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (7, '在世间万物中我都发现了你，渺小时，你是阳光下一粒种子，伟大时，你隐身在高山海洋里。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (8, '某一天，突然发现，许多结果都与路径无关。', 4, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (9, '限定目的，能使人生变得简洁。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (10, '翅膀长在你的肩上，太在乎别人对于飞行姿势的批评，所以你飞不起来', 4, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (11, '一个人至少拥有一个梦想，有一个理由去坚强。心若没有栖息的地方，到哪里都是在流浪。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (12, '不乱于心，不困于情。不畏将来，不念过往。如此，安好。', 3, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (13, '如果你给我的，和你给别人的是一样的，那我就不要了。', 3, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (14, '故事的开头总是这样，适逢其会，猝不及防。故事的结局总是这样，花开两朵，天各一方。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (15, '你不愿意种花，你说，我不愿看见它一点点凋落。是的，为了避免结束，你避免了一切开始。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (16, '你如果认识从前的我，也许你会原谅现在的我。', 4, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (17, '每一个不曾起舞的日子，都是对生命的辜负。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (18, '向来缘浅，奈何情深。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (19, '心之所向 素履以往 生如逆旅 一苇以航', 3, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (20, '生如夏花之绚烂，死如秋叶之静美。', 3, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (21, '答案很长，我准备用一生的时间来回答，你准备要听了吗？', 4, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (22, '因为爱过，所以慈悲；因为懂得，所以宽容。', 4, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (23, '我们听过无数的道理，却仍旧过不好这一生。', 1, '2022-11-20 15:36:04', '2022-11-20 15:36:04');
INSERT INTO `moment` VALUES (24, '我来不及认真地年轻，待明白过来时，只能选择认真地老去。', 2, '2022-11-20 15:36:04', '2022-11-20 15:36:04');

-- ----------------------------
-- Table structure for moment_label
-- ----------------------------
DROP TABLE IF EXISTS `moment_label`;
CREATE TABLE `moment_label`  (
  `moment_id` int NOT NULL,
  `label_id` int NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`moment_id`, `label_id`) USING BTREE,
  INDEX `label_id`(`label_id` ASC) USING BTREE,
  CONSTRAINT `moment_label_ibfk_1` FOREIGN KEY (`moment_id`) REFERENCES `moment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `moment_label_ibfk_2` FOREIGN KEY (`label_id`) REFERENCES `label` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of moment_label
-- ----------------------------
INSERT INTO `moment_label` VALUES (2, 1, '2022-11-22 10:33:22', '2022-11-22 10:33:22');
INSERT INTO `moment_label` VALUES (2, 2, '2022-11-22 11:17:38', '2022-11-22 11:17:38');
INSERT INTO `moment_label` VALUES (2, 4, '2022-11-22 11:17:38', '2022-11-22 11:17:38');
INSERT INTO `moment_label` VALUES (2, 6, '2022-11-22 11:17:38', '2022-11-22 11:17:38');
INSERT INTO `moment_label` VALUES (2, 7, '2022-11-22 11:17:38', '2022-11-22 11:17:38');
INSERT INTO `moment_label` VALUES (2, 8, '2022-11-22 11:17:38', '2022-11-22 11:17:38');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'jame', 'e10adc3949ba59abbe56e057f20f883e', '2022-11-20 15:34:14', '2022-11-20 15:34:14', NULL);
INSERT INTO `user` VALUES (2, 'lilei', 'e10adc3949ba59abbe56e057f20f883e', '2022-11-20 15:35:39', '2022-11-20 15:35:39', NULL);
INSERT INTO `user` VALUES (3, 'hmm', 'e10adc3949ba59abbe56e057f20f883e', '2022-11-20 15:35:39', '2022-11-20 15:35:39', NULL);
INSERT INTO `user` VALUES (4, 'luly', 'e10adc3949ba59abbe56e057f20f883e', '2022-11-20 15:35:39', '2022-11-20 15:35:39', NULL);
INSERT INTO `user` VALUES (6, 'curry', 'e99a18c428cb38d5f260853678922e03', '2022-11-19 16:27:35', '2022-11-19 16:27:35', NULL);
INSERT INTO `user` VALUES (7, 'why', 'e10adc3949ba59abbe56e057f20f883e', '2022-11-19 16:29:00', '2022-11-22 15:24:03', 'http://localhost:8000/users/avatar/7');

SET FOREIGN_KEY_CHECKS = 1;

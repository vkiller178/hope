import {MigrationInterface, QueryRunner} from "typeorm";

export class addResume1597827627025 implements MigrationInterface {
    name = 'addResume1597827627025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `resume` (`createTime` datetime NOT NULL, `updateTime` datetime NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `nickname` varchar(255) NOT NULL COMMENT '昵称', `intro` varchar(255) NOT NULL COMMENT '一句话介绍', `detail` varchar(255) NOT NULL COMMENT '详细自我介绍', `experience` json NULL COMMENT '工作经历', `education` json NULL COMMENT '教育经历', `contact` json NULL COMMENT '联系方式', `userId` int NULL, UNIQUE INDEX `REL_6543e24d4d8714017acd1a1b39` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `userAction` DROP FOREIGN KEY `FK_aa5b1966f99b1db9b6108210abb`");
        await queryRunner.query("ALTER TABLE `userAction` CHANGE `uidId` `uidId` int NULL");
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_4ce8d043ca7ba42ee02e682408f`");
        await queryRunner.query("ALTER TABLE `post` CHANGE `uidId` `uidId` int NULL");
        await queryRunner.query("ALTER TABLE `userAction` ADD CONSTRAINT `FK_aa5b1966f99b1db9b6108210abb` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_4ce8d043ca7ba42ee02e682408f` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `resume` ADD CONSTRAINT `FK_6543e24d4d8714017acd1a1b392` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `resume` DROP FOREIGN KEY `FK_6543e24d4d8714017acd1a1b392`");
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_4ce8d043ca7ba42ee02e682408f`");
        await queryRunner.query("ALTER TABLE `userAction` DROP FOREIGN KEY `FK_aa5b1966f99b1db9b6108210abb`");
        await queryRunner.query("ALTER TABLE `post` CHANGE `uidId` `uidId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_4ce8d043ca7ba42ee02e682408f` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `userAction` CHANGE `uidId` `uidId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `userAction` ADD CONSTRAINT `FK_aa5b1966f99b1db9b6108210abb` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("DROP INDEX `REL_6543e24d4d8714017acd1a1b39` ON `resume`");
        await queryRunner.query("DROP TABLE `resume`");
    }

}

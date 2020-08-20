import {MigrationInterface, QueryRunner} from "typeorm";

export class addResumeSkills1597839806154 implements MigrationInterface {
    name = 'addResumeSkills1597839806154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `resume` ADD `skills` json NULL COMMENT '技能'");
        await queryRunner.query("ALTER TABLE `userAction` DROP FOREIGN KEY `FK_aa5b1966f99b1db9b6108210abb`");
        await queryRunner.query("ALTER TABLE `userAction` CHANGE `uidId` `uidId` int NULL");
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_4ce8d043ca7ba42ee02e682408f`");
        await queryRunner.query("ALTER TABLE `post` CHANGE `uidId` `uidId` int NULL");
        await queryRunner.query("ALTER TABLE `resume` DROP FOREIGN KEY `FK_6543e24d4d8714017acd1a1b392`");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `experience`");
        await queryRunner.query("ALTER TABLE `resume` ADD `experience` json NULL COMMENT '工作经历'");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `education`");
        await queryRunner.query("ALTER TABLE `resume` ADD `education` json NULL COMMENT '教育经历'");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `contact`");
        await queryRunner.query("ALTER TABLE `resume` ADD `contact` json NULL COMMENT '联系方式'");
        await queryRunner.query("ALTER TABLE `resume` CHANGE `userId` `userId` int NULL");
        await queryRunner.query("ALTER TABLE `userAction` ADD CONSTRAINT `FK_aa5b1966f99b1db9b6108210abb` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_4ce8d043ca7ba42ee02e682408f` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `resume` ADD CONSTRAINT `FK_6543e24d4d8714017acd1a1b392` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `resume` DROP FOREIGN KEY `FK_6543e24d4d8714017acd1a1b392`");
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_4ce8d043ca7ba42ee02e682408f`");
        await queryRunner.query("ALTER TABLE `userAction` DROP FOREIGN KEY `FK_aa5b1966f99b1db9b6108210abb`");
        await queryRunner.query("ALTER TABLE `resume` CHANGE `userId` `userId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `contact`");
        await queryRunner.query("ALTER TABLE `resume` ADD `contact` longtext COLLATE \"utf8mb4_bin\" NULL COMMENT '联系方式' DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `education`");
        await queryRunner.query("ALTER TABLE `resume` ADD `education` longtext COLLATE \"utf8mb4_bin\" NULL COMMENT '教育经历' DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `experience`");
        await queryRunner.query("ALTER TABLE `resume` ADD `experience` longtext COLLATE \"utf8mb4_bin\" NULL COMMENT '工作经历' DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `resume` ADD CONSTRAINT `FK_6543e24d4d8714017acd1a1b392` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `post` CHANGE `uidId` `uidId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_4ce8d043ca7ba42ee02e682408f` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `userAction` CHANGE `uidId` `uidId` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `userAction` ADD CONSTRAINT `FK_aa5b1966f99b1db9b6108210abb` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `resume` DROP COLUMN `skills`");
    }

}

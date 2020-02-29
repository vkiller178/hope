import {MigrationInterface, QueryRunner} from "typeorm";

export class addBaseModel1582953604878 implements MigrationInterface {
    name = 'addBaseModel1582953604878'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `createTime` datetime NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `updateTime` datetime NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `post` ADD `createTime` datetime NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `post` ADD `updateTime` datetime NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `post` DROP COLUMN `updateTime`", undefined);
        await queryRunner.query("ALTER TABLE `post` DROP COLUMN `createTime`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updateTime`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `createTime`", undefined);
    }

}

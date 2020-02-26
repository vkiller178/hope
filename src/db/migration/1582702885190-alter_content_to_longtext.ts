import {MigrationInterface, QueryRunner} from "typeorm";

export class alterContentToLongtext1582702885190 implements MigrationInterface {
    name = 'alterContentToLongtext1582702885190'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `post` DROP COLUMN `content`", undefined);
        await queryRunner.query("ALTER TABLE `post` ADD `content` longtext NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `post` DROP COLUMN `content`", undefined);
        await queryRunner.query("ALTER TABLE `post` ADD `content` varchar(255) NOT NULL DEFAULT ''", undefined);
    }

}

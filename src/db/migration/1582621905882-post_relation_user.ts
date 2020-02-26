import {MigrationInterface, QueryRunner} from "typeorm";

export class postRelationUser1582621905882 implements MigrationInterface {
    name = 'postRelationUser1582621905882'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `post` ADD `uidId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_4ce8d043ca7ba42ee02e682408f` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_4ce8d043ca7ba42ee02e682408f`", undefined);
        await queryRunner.query("ALTER TABLE `post` DROP COLUMN `uidId`", undefined);
    }

}

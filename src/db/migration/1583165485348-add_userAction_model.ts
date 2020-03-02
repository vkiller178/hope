import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserActionModel1583165485348 implements MigrationInterface {
    name = 'addUserActionModel1583165485348'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `userAction` (`createTime` datetime NOT NULL, `updateTime` datetime NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, `target` int NOT NULL, `uidId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `userAction` ADD CONSTRAINT `FK_aa5b1966f99b1db9b6108210abb` FOREIGN KEY (`uidId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `userAction` DROP FOREIGN KEY `FK_aa5b1966f99b1db9b6108210abb`", undefined);
        await queryRunner.query("DROP TABLE `userAction`", undefined);
    }

}

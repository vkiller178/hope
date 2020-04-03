import {MigrationInterface, QueryRunner} from "typeorm";

export class addSubmitTable1585902596766 implements MigrationInterface {
    name = 'addSubmitTable1585902596766'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`createTime` datetime NOT NULL, `updateTime` datetime NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `userId` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `telephone` varchar(255) NOT NULL, `province` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `county` varchar(255) NOT NULL, `address` varchar(255) NOT NULL, `price` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class init1595324524444 implements MigrationInterface {
    name = 'init1595324524444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`createTime` datetime NOT NULL, `updateTime` datetime NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user`");
    }

}

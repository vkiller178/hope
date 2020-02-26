import {MigrationInterface, QueryRunner} from "typeorm";

export class addPostTable1582620930218 implements MigrationInterface {
    name = 'addPostTable1582620930218'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `post` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `tags` varchar(255) NOT NULL, `hide` varchar(255) NOT NULL, `content` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `post`", undefined);
    }

}

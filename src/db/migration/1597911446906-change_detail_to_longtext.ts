import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeDetailToLongtext1597911446906 implements MigrationInterface {
  name = 'changeDetailToLongtext1597911446906'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `resume` DROP COLUMN `detail`')
    await queryRunner.query(
      "ALTER TABLE `resume` ADD `detail` longtext NOT NULL COMMENT '详细自我介绍'"
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `resume` DROP COLUMN `detail`')
    await queryRunner.query(
      "ALTER TABLE `resume` ADD `detail` varchar(255) NOT NULL COMMENT '详细自我介绍'"
    )
  }
}

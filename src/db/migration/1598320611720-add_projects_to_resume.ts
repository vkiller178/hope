import { MigrationInterface, QueryRunner } from 'typeorm'

export class addProjectsToResume1598320611720 implements MigrationInterface {
  name = 'addProjectsToResume1598320611720'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `resume` ADD `projects` json NULL COMMENT '项目经历'"
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `resume` DROP COLUMN `projects`')
  }
}

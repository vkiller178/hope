import { MigrationInterface, QueryRunner } from 'typeorm'

export class addAvatarToUser1597912628369 implements MigrationInterface {
  name = 'addAvatarToUser1597912628369'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `avatar` varchar(255) NOT NULL'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `avatar`')
  }
}

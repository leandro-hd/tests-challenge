import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class alterStatementAddSenderId1641256340242 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'statements',
      new TableColumn({
        name: 'sender_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'statements',
      new TableForeignKey({
        name: 'FKStatementUser',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['sender_id'],
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'statements',
      'FKStatementUser',
    );

    await queryRunner.dropColumn('statements', 'sender_id');
  }
}

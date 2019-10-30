'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'events',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          startTime: { allowNull: false, type: Sequelize.DATE },
          endTime: { allowNull: false, type: Sequelize.DATE },
          available: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
          note: { type: Sequelize.STRING(1000) },
          createdAt: { allowNull: false, type: Sequelize.DATE },
          updatedAt: { allowNull: false, type: Sequelize.DATE },
        },
        { transaction }
      );

      await queryInterface.addIndex('events', ['startTime'], { transaction });
      await queryInterface.addIndex('events', ['endTime'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('events', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

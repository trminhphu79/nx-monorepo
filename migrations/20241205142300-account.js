'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channel', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      channelName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      joinIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      ownerId: {
        type: Sequelize.INTEGER,
      },
      messageIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('channel');
  },
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_transaksi', {
      id_detail_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_transaksi: {
        type: Sequelize.INTEGER,
        references : {
          model : "transaksi",
          key : "id_transaksi"
        }
      },
      id_paket: {
        type: Sequelize.INTEGER,
        references : {
          model : "paket",
          key : "id_paket"
        }

      },
      price: {
        type: Sequelize.DOUBLE
      },
      qty: {
        type: Sequelize.DOUBLE
      },
      subtotal : {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_transaksi');
  }
};
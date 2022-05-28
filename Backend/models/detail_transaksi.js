'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ini menerima sambungan dari transaksi dgn foreign id_transaksi
      this.belongsTo(models.transaksi, {
        foreignKey: "id_transaksi",
        as: "transaksi"
      })
      //ini menerima sambungan dari paket dgn foreign id_paket
      this.belongsTo(models.paket, {
        foreignKey: "id_paket",
        as: "paket"
      })
    }
  }
  detail_transaksi.init({
    id_detail_transaksi : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false

    },
    id_transaksi: DataTypes.INTEGER,
    id_paket: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    qty: DataTypes.DOUBLE,
    subtotal : DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName : 'detail_transaksi'
  });
  return detail_transaksi;
};
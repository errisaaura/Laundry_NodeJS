'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ini menerima sambungan dr tabel member
      this.belongsTo(models.member, {
        foreignKey: "id_member",
        as: "member"

      })
      //ini menerima sambungan dr tabel admin
      this.belongsTo(models.admin, {
        foreignKey: "id_admin",
        as: "admin"
      })
      //ini menerima sambungan dr tabel outlet
      this.belongsTo(models.outlet, {
        foreignKey: "id_outlet",
        as: "outlet"
      })
      //ini disambungkan ke tabel detail.
      this.hasMany(models.detail_transaksi, {
        foreignKey: "id_transaksi",
        as: "detail_transaksi"
      })
    }
  }
  transaksi.init({
    id_transaksi : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    id_member: DataTypes.INTEGER,
    id_admin: DataTypes.INTEGER,
    id_outlet: DataTypes.INTEGER,
    tgl: DataTypes.DATE,
    batas_waktu: DataTypes.DATE,
    tgl_bayar: DataTypes.DATE,
    status: DataTypes.STRING,
    payment: DataTypes.STRING,
    total: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName : 'transaksi'
  });
  return transaksi;
};
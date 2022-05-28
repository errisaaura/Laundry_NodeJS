'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ini nyambungkan ke transaksi. jadi 1 member bisa melakukan banyak transaksi
      this.hasMany(models.transaksi, {
        foreignKey: "id_member",
        as : "transaksi_member"
      })
    }
  }
  member.init({
    id_member : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    nama: DataTypes.STRING,
    gender: DataTypes.ENUM('Laki-Laki','Perempuan'),
    phone: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'member',
    tableName: 'member',
  });
  return member;
};
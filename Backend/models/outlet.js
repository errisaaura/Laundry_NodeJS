'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class outlet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ini nyambung ke transaksi jadi 1 outlet bisa melakukan banyak transaksi
      this.hasMany(models.transaksi, {
        foreignKey: "id_outlet",
        as: "outlet"
      })
      //ini nyambung ke admin jadi 1 outlet bisa memiliki banyak admin
      this.hasMany(models.admin, {
        foreignKey: "id_outlet",
        as: "admin"
      })
    }
  }
  outlet.init({
    id_outlet : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'outlet',
    tableName: 'outlet'
  });
  return outlet;
};
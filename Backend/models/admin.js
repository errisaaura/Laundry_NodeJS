'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaksi, {
        foreignKey: "id_admin",
        as: "admin"
      })
      this.belongsTo(models.outlet, {
        foreignKey: "id_outlet",
        as: "outlet"
      })
    }
  }
  admin.init({
    id_admin : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull:false
    },
    nama: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('Admin','Kasir','Owner'),
    id_outlet: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'admin',
    tableName: 'admin'
  });
  return admin;
};
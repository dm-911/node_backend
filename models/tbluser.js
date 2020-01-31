/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbluser', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'firstname': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'lastname': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'username': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'gender': {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "null"
    },
    'country': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'state': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'city': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'role': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'password': {
      type: DataTypes.STRING(450),
      allowNull: true,
      comment: "null"
    },
    'parentid': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    },
    'salary': {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'tbluser'
  });
};

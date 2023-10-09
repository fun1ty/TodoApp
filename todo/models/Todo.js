const { DataTypes } = require("sequelize");

const Todo = function (sequelize) {
  //위 변수의 Sequelize = models/index.js에 있는 sequelize
  //DataTypes는 model/index.js에 있는 Sequalize
  const model = sequelize.define("todo", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    done: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
  });
  return model;
};

module.exports = Todo;

module.exports = (sequelize, DataTypes) => {
  var bcrypt = require("bcryptjs");

  const User = sequelize.define("users", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "username",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "password",
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "fullName",
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "email",
    },
    mobile: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "mobile",
    },
    userGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userGroupId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  // User.sync().then(() => {
  //   User.create({
  //     id: 12345678911,
  //     username: "admin",
  //     fullName: "Hà Minh Long",
  //     password: bcrypt.hashSync("admin", 8),
  //     email: "haminhlong3@gmail.com ",
  //     mobile: "0963339657",
  //     userGroupId: 12345678910,
  //     status: 1,
  //   });
  // });
  return User;
};

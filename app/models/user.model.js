module.exports = (sequelize, DataTypes) => {
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
  User.sync().then(async () => {});
  return User;
};

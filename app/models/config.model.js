module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define("configs", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "email",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "password",
    },
  });

  return Config;
};

module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define("menus", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    menuName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "menuName",
    },
    orderBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "orderBy",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "url",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "icon",
    },
    parentId: {
      type: DataTypes.BIGINT,
      hierarchy: true,
      allowNull: true,
      field: "parentId",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });

  return Menu;
};

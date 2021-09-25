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
  // Menu.sync().then(() => {
  //   Menu.create({
  //     id: 12345678910,
  //     menuName: "Hệ thống",
  //     orderBy: 1,
  //     url: "/",
  //     icon: "",
  //     parentId: null,
  //     status: 1,
  //   });
  //   Menu.create({
  //     id: 12345678921,
  //     menuName: "Cấu hình hệ thống",
  //     orderBy: 1,
  //     url: "/config",
  //     icon: "",
  //     parentId: 12345678910,
  //     status: 1,
  //   });
  //   Menu.create({
  //     id: 12345678911,
  //     menuName: "Thanh công cụ",
  //     orderBy: 2,
  //     url: "/menu",
  //     icon: "",
  //     parentId: 12345678910,
  //     status: 1,
  //   });
  //   Menu.create({
  //     id: 12345678912,
  //     menuName: "Tài khoản - Phân quyền",
  //     orderBy: 2,
  //     url: "/",
  //     icon: "",
  //     parentId: null,
  //     status: 1,
  //   });
  //   Menu.create({
  //     id: 12345678913,
  //     menuName: "Nhóm tài khoản",
  //     orderBy: 1,
  //     url: "/user-group",
  //     icon: "",
  //     parentId: 12345678912,
  //     status: 1,
  //   });
  //   Menu.create({
  //     id: 12345678920,
  //     menuName: "Tài khoản",
  //     orderBy: 2,
  //     url: "/user",
  //     icon: "",
  //     parentId: 12345678912,
  //     status: 1,
  //   });
  // });
  return Menu;
};

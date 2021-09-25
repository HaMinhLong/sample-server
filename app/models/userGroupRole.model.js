module.exports = (sequelize, DataTypes) => {
  const UserGroupRole = sequelize.define("userGroupRoles", {
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
    menuParentId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "menuParentId",
    },
    userGroupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "userGroupId",
    },
    menuId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "menuId",
    },
    isView: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isView",
    },
    isAdd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isAdd",
    },
    isUpdate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isUpdate",
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isDelete",
    },
    isBlock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isBlock",
    },
    isApprove: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "isApprove",
    },
  });
  // UserGroupRole.sync().then(() => {
  //   UserGroupRole.create({
  //     id: 12345678916,
  //     menuName: "Hệ thống",
  //     menuParentId: null,
  //     userGroupId: 12345678910,
  //     menuId: 12345678910,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  //   UserGroupRole.create({
  //     id: 12345678925,
  //     menuName: "Cấu hình hệ thống",
  //     menuParentId: 12345678910,
  //     userGroupId: 12345678910,
  //     menuId: 12345678921,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  //   UserGroupRole.create({
  //     id: 12345678917,
  //     menuName: "Thanh công cụ",
  //     menuParentId: 12345678910,
  //     userGroupId: 12345678910,
  //     menuId: 12345678911,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  //   UserGroupRole.create({
  //     id: 12345678918,
  //     menuName: "Tài khoản - Phân quyền",
  //     menuParentId: null,
  //     userGroupId: 12345678910,
  //     menuId: 12345678912,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  //   UserGroupRole.create({
  //     id: 12345678919,
  //     menuName: "Nhóm tài khoản",
  //     menuParentId: 12345678912,
  //     userGroupId: 12345678910,
  //     menuId: 12345678913,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  //   UserGroupRole.create({
  //     id: 12345678919,
  //     menuName: "Tài khoản",
  //     menuParentId: 12345678912,
  //     userGroupId: 12345678910,
  //     menuId: 12345678920,
  //     isView: true,
  //     isAdd: true,
  //     isUpdate: true,
  //     isDelete: true,
  //     isBlock: true,
  //     isApprove: true,
  //   });
  // });
  return UserGroupRole;
};

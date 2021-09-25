module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define("userGroups", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    userGroupName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "userGroupName",
    },
    userGroupDescriptions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "userGroupDescriptions",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status",
    },
  });
  // UserGroup.sync().then(() => {
  //   UserGroup.create({
  //     id: 12345678910,
  //     userGroupName: "Quản trị hệ thống",
  //     userGroupDescriptions: "",
  //     status: 1,
  //   });
  // });

  return UserGroup;
};

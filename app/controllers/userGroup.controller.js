const db = require("../models");
const UserGroup = db.userGroup;
const User = db.user;
const Menu = db.menu;
const UserGroupRole = db.userGroupRole;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "userGroupName",
        "userGroupDescriptions",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const userGroupName = filters.userGroupName || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);

  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { userGroupName: { [Op.like]: "%" + userGroupName + "%" } },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: size,
  };

  UserGroup.findAndCountAll(options)
    .then((result) => {
      res.status(200).json({
        results: {
          list: result.rows,
          pagination: {
            total: result.count,
            pageSize: size,
            current: current,
          },
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy danh sách!",
      });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  UserGroup.findOne({
    where: {
      id: id,
    },
  })
    .then((userGroup) => {
      res.status(200).json({
        results: {
          list: userGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: true,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin nhóm người dùng!",
      });
    });
};

const create = async (req, res) => {
  const { userGroupName, userGroupDescriptions, status } = req.body;
  const userGroup = await UserGroup.findOne({
    where: { userGroupName: userGroupName },
  });
  const menu = await Menu.findAll();

  if (userGroup) {
    res.status(200).json({
      success: false,
      error: "Nhóm người dùng đã tồn tại!",
      message: "Nhóm người dùng đã tồn tại!",
    });
  } else {
    UserGroup.create({
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      userGroupName,
      userGroupDescriptions,
      status,
    })
      .then((userGroup) => {
        let menuBulkCreate = [];
        for (let index = 0; index < menu.length; index++) {
          menuBulkCreate.push({
            id:
              Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
              100000000000,
            menuName: menu[index].menuName,
            menuParentId: menu[index].parentId,
            menuId: menu[index].id,
            userGroupId: userGroup.id,
            isView: false,
            isAdd: false,
            isUpdate: false,
            isDelete: false,
            isBlock: false,
            isApprove: false,
          });
        }
        UserGroupRole.bulkCreate(menuBulkCreate);
        res.status(200).json({
          results: {
            list: userGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới nhóm người dùng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới nhóm người dùng!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { userGroupName, userGroupNameOld, userGroupDescriptions, status } =
    req.body;
  const userGroup = await UserGroup.findOne({
    where: { userGroupName: userGroupName },
  });
  if (userGroup && userGroupNameOld !== userGroupName) {
    res.status(200).json({
      success: false,
      error: "Nhóm người dùng đã tồn tại!",
      message: "Nhóm người dùng đã tồn tại!",
    });
  } else {
    UserGroup.update(
      {
        status: status,
        userGroupName: userGroupName,
        userGroupDescriptions: userGroupDescriptions,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((userGroup) => {
        res.status(200).json({
          results: {
            list: userGroup,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật nhóm người dùng thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật nhóm người dùng!",
        });
      });
  }
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  UserGroup.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((userGroup) => {
      User.update(
        { status: status },
        {
          where: {
            userGroupId: id,
          },
        }
      );
      res.status(200).json({
        results: {
          list: userGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật trạng thái thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật trạng thái",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  UserGroup.destroy({
    where: {
      id: id,
    },
  })
    .then((userGroup) => {
      res.status(200).json({
        results: {
          list: userGroup,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa nhóm người dùng thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        message: err.message,
        message: "Xảy ra lôi khi xóa nhóm người dùng!",
      });
    });
};
module.exports = {
  getList,
  getOne,
  create,
  updateRecord,
  updateStatus,
  deleteRecord,
};

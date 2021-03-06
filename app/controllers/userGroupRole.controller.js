const db = require("../models");
const UserGroupRole = db.userGroupRole;
const Menu = db.menu;
const UserGroup = db.userGroup;

const moment = require("moment");

const Op = db.Sequelize.Op;

const getListRole = async (req, res) => {
  const { userGroupId } = req.params;
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 100];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "menuName",
        "menuParentId",
        "userGroupId",
        "menuId",
        "isView",
        "isAdd",
        "isUpdate",
        "isDelete",
        "isBlock",
        "isApprove",
        "createdAt",
        "updatedAt",
      ];

  const menuName = filters.menuName || "";

  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);
  var options = {
    where: {
      [Op.and]: [
        { userGroupId: { [Op.like]: "%" + userGroupId + "%" } },
        { menuName: { [Op.like]: "%" + menuName + "%" } },
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

  UserGroupRole.findAndCountAll(options)
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

const getListAuthRoutes = (req, res) => {
  const { userGroupId } = req;
  const ranges = [0, 100];
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);
  const options = {
    include: [
      {
        model: UserGroup,
        required: true,
        where: {
          [Op.and]: [
            { id: { [Op.like]: "%" + userGroupId + "%" } },
            { status: { [Op.like]: "%" + "1" + "%" } },
          ],
        },
        attributes: ["userGroupName"],
        through: {
          where: {
            isView: true,
          },
          attributes: ["isView"],
        },
      },
    ],
    order: [["orderBy", "ASC"]],
    offset: ranges[0],
    limit: size,
    hierarchy: true,
  };
  Menu.findAndCountAll(options)
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
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const userGroupId = filters.userGroupId || "";

  UserGroupRole.findOne({
    where: {
      [Op.and]: [{ menuId: id }, { userGroupId: userGroupId }],
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
        message: "Xảy ra lỗi khi lấy thông tin quyền!",
      });
    });
};
const bulkUpdate = async (req, res) => {
  const { userGroupId } = req.params;

  UserGroupRole.destroy({
    where: {
      userGroupId: userGroupId,
    },
  });
  // {
  //   updateOnDuplicate: ["id"],
  // }
  UserGroupRole.bulkCreate(req.body)
    .then((userGroupRole) => {
      res.status(200).json({
        results: {
          list: userGroupRole,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cấp quyền thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cấp quyền!",
      });
    });
};
module.exports = {
  getListRole,
  getListAuthRoutes,
  getOne,
  bulkUpdate,
};

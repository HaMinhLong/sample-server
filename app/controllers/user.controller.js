const db = require("../models");
const User = db.user;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getList = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 19];
  const order = sort ? JSON.parse(sort) : ["createdAt", "DESC"];
  const attributesQuery = attributes
    ? JSON.parse(attributes)
    : [
        "id",
        "username",
        "password",
        "fullName",
        "email",
        "userGroupId",
        "mobile",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const username = filters.username || "";
  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
        { username: { [Op.like]: "%" + username + "%" } },
      ],
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    },
    order: [order],
    attributes: attributesQuery,
    offset: ranges[0],
    limit: ranges[1],
  };

  const size = ranges[1] + 1 - ranges[0];
  const current = Math.floor((ranges[1] + 1) / size);
  User.findAndCountAll(options)
    .then((result) => {
      res.status(200).json({
        results: {
          list: result.rows,
          pagination: {
            total: result.count,
            size: size,
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
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin tài khoản!",
      });
    });
};

const create = async (req, res) => {
  const { username, password, fullName, email, mobile, userGroupId, status } =
    req.body;
  const user = await User.findOne({
    where: { username: username },
  });
  if (user) {
    res.status(400).json({
      success: false,
      error: "Tài khoản đã tồn tại!",
      message: "Tài khoản đã tồn tại!",
    });
  } else {
    User.create({
      id:
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
        100000000000,
      username,
      password,
      status,
      fullName,
      email,
      mobile,
      userGroupId,
    })
      .then((user) => {
        res.status(200).json({
          results: {
            list: user,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới tài khoản thành công!",
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới tài khoản!",
        });
      });
  }
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { username, password, fullName, email, mobile, userGroupId, status } =
    req.body;
  User.update(
    {
      status: status,
      username: username,
      password: password,
      fullName: fullName,
      email: email,
      mobile: mobile,
      userGroupId: userGroupId,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật tài khoản thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật tài khoản!",
      });
    });
};
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  User.update(
    { status: status },
    {
      where: {
        id: id,
      },
    }
  )
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Cập nhật trạng thái thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi cập nhật trạng thái!",
      });
    });
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;
  User.destroy({
    where: {
      id: id,
    },
  })
    .then((user) => {
      res.status(200).json({
        results: {
          list: user,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa tài khoản thành công!",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi xóa tài khoản!",
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

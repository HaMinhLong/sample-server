const db = require("../models");
const Menu = db.menu;
const UserGroup = db.userGroup;
const UserGroupRole = db.userGroupRole;
const moment = require("moment");

const Op = db.Sequelize.Op;

const getListParentChild = async (req, res) => {
  const { filter, range, sort, attributes } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const ranges = range ? JSON.parse(range) : [0, 20];
  const order = sort ? JSON.parse(sort) : ["orderBy", "ASC"];
  const attributesQuery = attributes
    ? attributes.split(",")
    : [
        "id",
        "menuName",
        "orderBy",
        "icon",
        "url",
        "parentId",
        "status",
        "createdAt",
        "updatedAt",
      ];
  const status = filters.status || "";
  const menuName = filters.menuName || "";

  const fromDate = filters.fromDate || "2021-01-01T14:06:48.000Z";
  const toDate = filters.toDate || moment();
  const size = ranges[1] - ranges[0];
  const current = Math.floor(ranges[1] / size);
  var options = {
    where: {
      [Op.and]: [
        { status: { [Op.like]: "%" + status + "%" } },
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

const getListParentChildOne = async (req, res) => {
  const { filter } = req.query;
  const filters = filter ? JSON.parse(filter) : {};
  const { id } = filters;
  Menu.findOne({
    where: {
      id: id,
    },
  })
    .then((menu) => {
      if (menu.parentId === null || menu.parentId === "" || !menu.parentId) {
        Menu.findAll({
          where: {
            [Op.or]: [
              { id: { [Op.like]: "%" + id + "%" } },
              { parentId: { [Op.like]: "%" + id + "%" } },
            ],
          },
          hierarchy: true,
        })
          .then((result) => {
            res.status(200).json({
              results: {
                list: result,
                pagination: [],
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
              message: "Xảy ra lỗi khi lấy thông tin thanh công cụ!",
            });
          });
      } else {
        Menu.findAll({
          where: {
            [Op.or]: [
              { id: { [Op.like]: "%" + menu.parentId + "%" } },
              { parentId: { [Op.like]: "%" + menu.parentId + "%" } },
            ],
          },
          hierarchy: true,
        })
          .then((menu) => {
            res.status(200).json({
              results: {
                list: menu,
                pagination: [],
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
              message: "Xảy ra lỗi khi lấy thông tin thanh công cụ!",
            });
          });
      }
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi lấy thông tin thanh công cụ!",
      });
    });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  Menu.findOne({
    where: {
      id: id,
    },
  })
    .then((menu) => {
      res.status(200).json({
        results: {
          list: menu,
          pagination: [],
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
        message: "Xảy ra lỗi khi lấy thông tin thanh công cụ!",
      });
    });
};

const create = async (req, res) => {
  const { id, menuName, orderBy, url, icon, parentId, status } = req.body;
  const userGroup = await UserGroup.findAll();
  const menu = await Menu.findOne({
    where: { menuName: menuName },
  });
  if (menu) {
    res.status(200).json({
      success: false,
      error: "Thanh công cụ đã tồn tại!",
      message: "Thanh công cụ đã tồn tại!",
    });
  } else {
    Menu.create({
      id:
        id ||
        Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
          100000000000,
      menuName,
      orderBy,
      url,
      icon,
      parentId: parentId || null,
      status,
    })
      .then(async (menu) => {
        res.status(200).json({
          results: {
            list: menu,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Tạo mới thanh công cụ thành công!",
        });
        for (let index = 0; index < userGroup.length; index++) {
          UserGroupRole.create({
            id:
              Math.floor(Math.random() * (100000000000 - 1000000000 + 1)) +
              100000000000,
            menuName: menuName,
            menuId: menu.id,
            userGroupId: userGroup[index].id,
            isView: false,
            isAdd: false,
            isUpdate: false,
            isDelete: false,
            isBlock: false,
            isApprove: false,
            menuParentId: parentId || null,
          });
        }
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi tạo mới thanh công cụ!",
        });
      });
  }
};
const bulkCreate = async (req, res) => {
  Menu.bulkCreate(req.body)
    .then((menu) => {
      res.status(200).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Tạo mới thanh công cụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi tạo mới thanh công cụ!",
      });
    });
};
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { menuName, menuNameOld, orderBy, url, icon, parentId, status } =
    req.body;
  const menu = await Menu.findOne({
    where: { menuName: menuName },
  });
  if (menu && menuNameOld !== menuName) {
    res.status(200).json({
      success: false,
      error: "Thanh công cụ đã tồn tại!",
      message: "Thanh công cụ đã tồn tại!",
    });
  } else {
    Menu.update(
      {
        menuName: menuName,
        orderBy: orderBy,
        url: url,
        icon: icon,
        parentId: parentId ? parentId : null,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then((menu) => {
        res.status(200).json({
          results: {
            list: menu,
            pagination: [],
          },
          success: true,
          error: "",
          message: "Cập nhật thanh công cụ thành công!",
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật thanh công cụ!",
        });
      });
  }
};
const updateOrders = async (req, res) => {
  const { orders } = req.body;
  const menuOne = orders[0] || [];
  const menuTwo = orders[1] || [];
  let success = true;
  if (menuOne !== []) {
    Menu.update(
      {
        orderBy: menuOne.orderBy,
      },
      {
        where: {
          id: menuOne.id,
        },
      }
    )
      .then((menu) => {})
      .catch((err) => {
        success = false;
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật thanh công cụ!",
        });
      });
  }
  if (menuTwo !== []) {
    Menu.update(
      {
        orderBy: menuTwo.orderBy,
      },
      {
        where: {
          id: menuTwo.id,
        },
      }
    )
      .then((menu) => {})
      .catch((err) => {
        success = false;
        res.status(200).json({
          success: false,
          error: err.message,
          message: "Xảy ra lỗi khi cập nhật thanh công cụ!",
        });
      });
  }
  if (success) {
    res.status(200).json({
      results: {
        list: [],
        pagination: [],
      },
      success: true,
      error: "",
      message: "Cập nhật thanh công cụ thành công!",
    });
  }
};
const updateStatusList = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Menu.update(
    { status: status },
    {
      where: {
        [Op.or]: [{ id: id }, { parentId: id }],
      },
    }
  )
    .then((menu) => {
      res.status(200).json({
        results: {
          list: menu,
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
        message: "Xảy ra lỗi khi cập nhật trạng thái!",
      });
    });
};
const deleteRecord = async (req, res) => {
  const { id } = req.params;
  Menu.destroy({
    where: {
      id: id,
    },
  })
    .then((menu) => {
      res.status(200).json({
        results: {
          list: menu,
          pagination: [],
        },
        success: true,
        error: "",
        message: "Xóa thanh công cụ thành công!",
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        error: err.message,
        message: "Xảy ra lỗi khi xóa thanh công cụ!",
      });
    });
};
module.exports = {
  getListParentChild,
  getListParentChildOne,
  getOne,
  create,
  bulkCreate,
  updateRecord,
  updateOrders,
  updateStatusList,
  deleteRecord,
};

import _ from "lodash";
import * as ApiErrors from "../errors";

export default {
  combineFromDateWithToDate: (filter, option, field) => {
    let whereFilter = _.assign({}, filter);

    option = option || "dateCreated";

    (field && field.length > 0) || (field = ["FromDate", "ToDate"]);

    // console.log(field);

    if (filter[field[0]] && filter[field[1]]) {
      const fromDate = new Date(filter[field[0]]);
      const toDate = new Date(filter[field[1]]);

      // console.log(fromDate.toISOString());
      // console.log(toDate.toISOString());

      if (fromDate > toDate) {
        throw new ApiErrors.BaseError({
          statusCode: 202,
          type: "getListError",
          name: "filter Date Error",
          message: "Ngày bắt đầu lớn hơn ngày kết thúc",
        });
      }
      whereFilter = _.omit(filter, field);
      const fromtoDateFilter = _.assign(
        {},
        {
          [option]: {
            [Op.between]: [fromDate.toISOString(), toDate.toISOString()],
          },
        }
      );

      whereFilter = _.assign(whereFilter, fromtoDateFilter);

      // if (filter[field[0]] > filter[field[1]]) {
      //   throw new ApiErrors.BaseError({
      //     statusCode: 202,
      //     type: 'getListError',
      //     name: 'filter Date Error',
      //     message: 'Ngày bắt đầu lớn hơn ngày kết thúc'
      //   });
      // }
      // whereFilter = _.omit(filter, field);
      // const fromtoDateFilter = _.assign({}, { [option]: { [Op.between]: [filter[field[0]], filter[field[1]]] } });

      // whereFilter = _.assign(whereFilter, fromtoDateFilter);
    } else {
      if (filter[field[0]]) {
        const fromDate = new Date(filter[field[0]]);

        whereFilter = _.omit(filter, [field[0]]);
        const fromtoDateFilter = _.assign(
          {},
          { [option]: { [Op.gte]: fromDate.toUTCString() } }
        );
        // const fromtoDateFilter = _.assign({}, { [option]: { [Op.gte]: filter[field[0]] } });

        whereFilter = _.assign(whereFilter, fromtoDateFilter);
      }
      if (filter[field[1]]) {
        const toDate = new Date(filter[field[1]]);

        whereFilter = _.omit(filter, [field[1]]);
        const fromtoDateFilter = _.assign(
          {},
          { [option]: { [Op.lte]: toDate.toISOString() } }
        );
        // const fromtoDateFilter = _.assign({}, { [option]: { [Op.lte]: filter[field[1]] } });

        whereFilter = _.assign(whereFilter, fromtoDateFilter);
      }
    }

    console.log(whereFilter);

    return whereFilter;
  },
};

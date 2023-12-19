import toNumber from "lodash/toNumber";
import { PAGINATION } from "src/constants";
import { IGETPAGINATION } from "src/interface/pagination";

const { PAGE_SIZE, PAGE } = PAGINATION;

export const getPagination = ({
  rowsPerPage = PAGE_SIZE,
  page = PAGE,
}: IGETPAGINATION) => {
  return {
    rowsPerPage: toNumber(rowsPerPage) ?? PAGE_SIZE,
    page: toNumber(page) ?? PAGE,
  };
};

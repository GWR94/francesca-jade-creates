import React, { useState } from "react";
import { Pagination as Page } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";
import useScreenWidth from "../hooks/useScreenWidth";

interface PaginationProps {
  dataLength: number;
  setPageValues: (values: { min: number; max: number }) => void;
  numPerPage: number;
  defaultPageNum?: number;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px 0 40px",
  },
});

/**
 * Pagination component used for changing pages after a search of products has been
 * completed.
 * @param {number} page - the current page that the user is on
 * @param setPage - function to set the current page
 * @param maxPages - the maximum amount of pages available based on data.
 */
const Pagination: React.FunctionComponent<PaginationProps> = ({
  dataLength,
  numPerPage = 12,
  defaultPageNum = 1,
  setPageValues,
}): JSX.Element => {
  const classes = useStyles();
  const [page, setPage] = useState(defaultPageNum);
  const maxPages = Math.ceil(dataLength / numPerPage);
  const desktop = useScreenWidth(600);
  return (
    <div className={classes.container}>
      <Page
        page={page}
        onChange={(_e: React.ChangeEvent<unknown>, value: number): void => {
          setPage(value);
          setPageValues({
            min: value === 1 ? 0 : (value - 1) * numPerPage,
            max: value === 1 ? 12 : (value - 1) * numPerPage + numPerPage,
          });
        }}
        shape="rounded"
        showFirstButton={desktop}
        showLastButton={desktop}
        count={maxPages}
      />
    </div>
  );
};

export default Pagination;

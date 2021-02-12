import React, { useState } from "react";
import { Pagination as Page } from "@material-ui/lab";
import { makeStyles, useMediaQuery } from "@material-ui/core";

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
 * @param dataLength - the maximum amount of items the user can view
 * @param numPerPage - the amount of orders that should be shown to the user
 * @param setPageValues - function to set the page min & max values
 * @param defaultPageNum? - the page to show when mounting
 */
const Pagination: React.FunctionComponent<PaginationProps> = ({
  dataLength,
  numPerPage = 12,
  defaultPageNum = 1,
  setPageValues,
}): JSX.Element => {
  const classes = useStyles();
  const [page, setPage] = useState(defaultPageNum);
  const desktop = useMediaQuery("(min-width: 600px)");
  const numPage = desktop ? numPerPage : numPerPage / 2;
  const maxPages = Math.ceil(dataLength / numPage);
  return (
    <div className={classes.container}>
      <Page
        page={page}
        onChange={(_e: React.ChangeEvent<unknown>, value: number): void => {
          setPage(value);
          setPageValues({
            min: value === 1 ? 0 : (value - 1) * numPage,
            max: value === 1 ? numPage : (value - 1) * numPage + numPage,
          });
          window.scrollTo(0, 0);
        }}
        shape="rounded"
        showFirstButton={desktop}
        showLastButton={desktop}
        count={maxPages}
        boundaryCount={1}
        size={desktop ? "medium" : "small"}
      />
    </div>
  );
};

export default Pagination;

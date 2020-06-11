import React from "react";
import { Pagination as Page } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  maxPages: number;
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
 * @param {(page: number) => void} setPage - function to set the current page
 * @param {number} maxPages - the maximum amount of pages available based on data.
 */
const Pagination: React.SFC<PaginationProps> = ({
  page,
  setPage,
  maxPages,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Page
        page={page}
        onChange={(_e: React.ChangeEvent<unknown>, value: number): void => setPage(value)}
        shape="rounded"
        showFirstButton
        showLastButton
        count={maxPages}
      />
    </div>
  );
};

export default Pagination;

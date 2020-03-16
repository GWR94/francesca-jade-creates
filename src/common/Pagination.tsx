import React from "react";
import { Pagination as Page, PaginationItem, PaginationLink } from "reactstrap";

interface Props {
  page: number;
  setPage: (page: number) => void;
  maxPages: number;
}

const Pagination = ({ page, setPage, maxPages }): JSX.Element => {
  return (
    <div className="pagination__container">
      <Page aria-label="Choose page to view">
        <PaginationItem>
          <PaginationLink first onClick={(): void => setPage(1)} />
        </PaginationItem>
        <PaginationItem disabled={page === 1}>
          <PaginationLink previous onClick={(): void => setPage(page - 1)} />
        </PaginationItem>
        <PaginationItem active={page === 1}>
          <PaginationLink onClick={(): void => setPage(page === 1 ? 1 : page - 1)}>
            {page === 1 ? 1 : page - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem active={page >= 2}>
          <PaginationLink onClick={(): void => setPage(page === 1 ? 2 : page)}>
            {page === 1 ? 2 : page}
          </PaginationLink>
        </PaginationItem>
        {page < maxPages && maxPages >= 3 && (
          <PaginationItem active={page === maxPages}>
            <PaginationLink onClick={(): void => setPage(page === 1 ? 3 : page + 1)}>
              {page === 1 ? 3 : page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink next onClick={(): void => setPage(page + 1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={(): void => setPage(maxPages)} />
        </PaginationItem>
      </Page>
    </div>
  );
};

export default Pagination;

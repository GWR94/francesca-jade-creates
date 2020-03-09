import React, { useState } from "react";
import SearchFilter from "./SearchFilter";

interface Props {
  handleSearchQuery: (query, filter) => void;
  admin?: boolean;
}

/**
 * TODO
 * [ ] Fix filters button - styling.
 */

const Filter: React.FC<Props> = ({ handleSearchQuery, admin }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter__text">
      {!open ? (
        <div
          className="filter__button animated slideInDown"
          role="button"
          tabIndex={0}
          onClick={(): void => setOpen(true)}
        >
          <p className="filter__button-text">Filters</p>
          <i className="fas fa-caret-down filter__icon" />
        </div>
      ) : (
        <SearchFilter
          admin={admin}
          setQuery={(query, filters): void => handleSearchQuery(query, filters)}
          onClose={(): void => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Filter;

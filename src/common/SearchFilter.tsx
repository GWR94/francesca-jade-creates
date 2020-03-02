import React from "react";

interface Props {
  type: string;
}

const SearchFilter: React.FC<Props> = () => {
  return (
    <div className="filter__container">
      <h4>Filter:</h4>
    </div>
  );
};

export default SearchFilter;

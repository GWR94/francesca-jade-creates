import React, { FormEvent } from "react";
import {
  InputGroup,
  ControlGroup,
  HTMLSelect,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";

interface Props {
  type?: string;
  setQuery: (query, filters) => void;
  admin?: boolean;
}

interface State {
  adminFilters: string;
  searchQuery: string;
  query: string;
  sortBy: string;
}

/**
 * TODO
 * [ ] Fix radio buttons on smaller devices (don't do inline)
 */

class SearchFilter extends React.Component<Props, State> {
  public readonly state = {
    adminFilters: "all",
    searchQuery: "all",
    query: "",
    sortBy: "createdAt",
  };

  public render(): JSX.Element {
    const { adminFilters, searchQuery, query, sortBy } = this.state;
    const { setQuery, admin } = this.props;

    return (
      <>
        <div className="filter__container animated fadeIn">
          <ControlGroup style={{ margin: "6px 0" }}>
            <InputGroup
              leftIcon="search"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                this.setState({ query: e.target.value });
                setQuery(e.target.value, {
                  searchQuery,
                  adminFilters: admin && adminFilters,
                  sortBy,
                });
              }}
              placeholder="Search query..."
              fill
            />
            <HTMLSelect
              onChange={(e): void => {
                this.setState({ searchQuery: e.target.value });
                setQuery(query, {
                  searchQuery,
                  adminFilters: admin && adminFilters,
                  sortBy,
                });
              }}
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="tags">Tags</option>
            </HTMLSelect>
          </ControlGroup>
          {admin && (
            <>
              <p className="filter__label">Include:</p>
              <RadioGroup
                onChange={(e: FormEvent<HTMLInputElement>): void => {
                  const adminFilters = e.currentTarget.value;
                  this.setState({ adminFilters });
                  setQuery(query, {
                    searchQuery,
                    adminFilters: admin && adminFilters,
                    sortBy,
                  });
                }}
                selectedValue={adminFilters}
                className="filter__radio"
              >
                <Radio inline label="All" value="all" />
                <Radio inline label="Cakes" value="cakes" />
                <Radio inline label="Creations" value="creates" />
              </RadioGroup>
              <p className="filter__label">Sort By:</p>
              <RadioGroup
                onChange={(e: FormEvent<HTMLInputElement>): void => {
                  const sortBy = e.currentTarget.value;
                  this.setState({ sortBy });
                  setQuery(query, { searchQuery, adminFilters, sortBy });
                }}
                selectedValue={sortBy}
                className="filter__radio"
              >
                <Radio inline label="Last Created" value="createdAt" />
                <Radio inline label="Last Updated" value="updatedAt" />
              </RadioGroup>
            </>
          )}
        </div>
      </>
    );
  }
}

export default SearchFilter;

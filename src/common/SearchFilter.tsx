import React, { FormEvent } from "react";
import {
  FormGroup,
  InputGroup,
  ControlGroup,
  HTMLSelect,
  Checkbox,
  Radio,
  RadioGroup,
} from "@blueprintjs/core";

interface Props {
  type?: string;
  setQuery: (query, searchQuery, filters?) => void;
  onClose: () => void;
  admin?: boolean;
}

interface State {
  adminFilters: string;
  searchQuery: string;
  query: string;
}

class SearchFilter extends React.Component<Props, State> {
  public readonly state = {
    adminFilters: "all",
    searchQuery: "all",
    query: "",
  };

  private filterRef = React.createRef<HTMLDivElement>();

  public render(): JSX.Element {
    const { adminFilters, searchQuery, query } = this.state;
    const { setQuery, onClose, admin } = this.props;

    return (
      <>
        <div className="filter__container animated slideInDown" ref={this.filterRef}>
          <i
            className="fas fa-times filter__close-icon"
            role="button"
            tabIndex={0}
            onClick={(): void => {
              const filter = this.filterRef.current;
              filter.classList.remove("slideInDown");
              filter.classList.add("slideOutUp");
              setTimeout(() => {
                onClose();
              }, 800);
            }}
          />
          <ControlGroup style={{ margin: "6px 0" }}>
            <InputGroup
              leftIcon="search"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                this.setState({ query: e.target.value });
                setQuery(e.target.value, searchQuery, admin && adminFilters);
              }}
              placeholder="Search query..."
              fill
            />
            <HTMLSelect
              onChange={(e): void => {
                this.setState({ searchQuery: e.target.value });
                setQuery(query, searchQuery, admin && adminFilters);
              }}
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="tags">Tags</option>
            </HTMLSelect>
          </ControlGroup>
          {admin && (
            <RadioGroup
              label="Include:"
              inline
              onChange={(e: FormEvent<HTMLInputElement>): void => {
                this.setState({ adminFilters: e.currentTarget.value });
                setQuery(query, searchQuery, e.currentTarget.value);
              }}
              selectedValue={adminFilters}
              className="filter__radio"
            >
              <Radio label="All" value="all" />
              <Radio label="Cakes" value="cakes" />
              <Radio label="Creations" value="creates" />
            </RadioGroup>
          )}
        </div>
      </>
    );
  }
}

export default SearchFilter;

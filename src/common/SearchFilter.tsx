import React, { useState } from "react";
import {
  FormGroup,
  InputGroup,
  Spinner,
  Button,
  ControlGroup,
  HTMLSelect,
  Checkbox,
} from "@blueprintjs/core";

interface Props {
  type?: string;
  setQuery: (query, filters) => void;
  onClose: () => void;
  admin?: boolean;
}

interface State {
  filters: {
    cakes: boolean;
    frames: boolean;
    cards: boolean;
  };
  searchQuery: string;
  query: string;
}

class SearchFilter extends React.Component<Props, State> {
  public readonly state = {
    filters: {
      cakes: true,
      frames: true,
      cards: true,
    },
    searchQuery: "all",
    query: "",
  };

  private filterRef = React.createRef<HTMLDivElement>();

  public render(): JSX.Element {
    const { filters, searchQuery, query } = this.state;
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
                setQuery(e.target.value, admin ? filters : searchQuery);
              }}
              placeholder="Search query..."
              fill
            />
            <HTMLSelect
              onChange={(e): void => {
                this.setState({ searchQuery: e.target.value });
                setQuery(query, searchQuery);
              }}
            >
              <option value="all">All</option>
              <option value="title">Title</option>
              <option value="description">Description</option>
              <option value="tags">Tags</option>
            </HTMLSelect>
          </ControlGroup>
          {admin && (
            <FormGroup label="Include:" style={{ margin: "0" }}>
              <Checkbox
                checked={filters.cakes}
                label="Cakes"
                inline
                onChange={(): void =>
                  this.setState({ filters: { ...filters, cakes: !filters.cakes } })
                }
              />
              <Checkbox
                checked={filters.frames}
                label="Frames"
                inline
                onChange={(): void =>
                  this.setState({ filters: { ...filters, frames: !filters.frames } })
                }
              />
              <Checkbox
                checked={filters.cards}
                label="Cards"
                inline
                onChange={(): void =>
                  this.setState({ filters: { ...filters, cards: !filters.cards } })
                }
              />
            </FormGroup>
          )}
        </div>
      </>
    );
  }
}

export default SearchFilter;

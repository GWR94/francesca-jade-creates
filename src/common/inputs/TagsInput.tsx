import React from "react";
import { Tag } from "@blueprintjs/core";

interface Props {
  tags: string[];
  type: "Cake" | "Creates";
}

const TagsInput = ({ tags, type }): JSX.Element => {
  return (
    <div className="tags__container">
      {tags.map(
        (tag, i): JSX.Element => (
          <Tag active key={i} className={`tags__tag${type && `--${type.toLowerCase()}`}`}>
            {tag}
          </Tag>
        ),
      )}
    </div>
  );
};

export default TagsInput;

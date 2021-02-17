import { makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../styles/popularTheme.style";

export interface ThemeTileProps {
  handleHoverChange: (id: string, isLeaving?: boolean) => void;
  title: string;
  subtitle: string;
  tileClass: string;
}

const ThemeTile: React.FC<ThemeTileProps> = ({
  handleHoverChange,
  title,
  subtitle,
  tileClass,
}): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [isHovering, setHovering] = useState<boolean>(false);
  const id = `tile-${tileClass}`;
  const history = useHistory();
  return (
    <div
      className={classes.container}
      id={id}
      onClick={(): void => history.push(`/themes?current=${title}`)}
      role="button"
      tabIndex={0}
      onMouseOver={(): void => handleHoverChange(id)}
      onFocus={(): void => handleHoverChange(id)}
      onBlur={(): void => handleHoverChange(id, true)}
      onMouseLeave={(): void => handleHoverChange(id, true)}
    >
      <div
        // @ts-ignore
        className={`${classes.wrap} ${classes[tileClass]}`}
        onMouseEnter={(): void => {
          setHovering(true);
        }}
        onFocus={(): void => setHovering(true)}
        onBlur={(): void => setHovering(false)}
        onMouseLeave={(): void => setHovering(false)}
        onTouchStart={(): void => setHovering(true)}
        onTouchCancel={(): void => setHovering(false)}
      >
        <div className={classes.text}>
          <Typography className={classes.title}>{title}</Typography>
          {isHovering && (
            <Typography
              className={`${classes.subtitle} animate__animated animate__fadeIn animate__delay-tiny`}
            >
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeTile;

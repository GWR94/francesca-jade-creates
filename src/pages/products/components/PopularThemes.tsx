import { makeStyles, useMediaQuery } from "@material-ui/core";
import React from "react";
import { breakpoints } from "../../../themes";
import styles from "../styles/popularTheme.style";
import ThemeTile from "./ThemeTile";

interface PopularThemesProps {
  switchToSearch: (theme: string) => void;
}

const PopularThemes: React.FC<PopularThemesProps> = ({ switchToSearch }): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const mobile = useMediaQuery(breakpoints.down("md"));

  const handleHoverChange = (id: string, isLeaving = false): void => {
    // if user is on an extra small mobile screen, don't change the class/show animations
    if (mobile) return;
    switch (id) {
      case "tile-brands":
        if (!isLeaving) {
          document.getElementById("tile-brands")?.classList.add(classes.containerLG);
          document.getElementById("tile-love")?.classList.add(classes.containerXS);
          document.getElementById("tile-family")?.classList.add(classes.containerXS);
          document.getElementById("tile-baby")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-brands")?.classList.remove(classes.containerLG);
          document.getElementById("tile-love")?.classList.remove(classes.containerXS);
          document.getElementById("tile-family")?.classList.remove(classes.containerXS);
          document.getElementById("tile-baby")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-love":
        if (!isLeaving) {
          document.getElementById("tile-love")?.classList.add(classes.containerLG);
          document.getElementById("tile-brands")?.classList.add(classes.containerXS);
          document.getElementById("tile-family")?.classList.add(classes.containerXS);
          document.getElementById("tile-baby")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-love")?.classList.remove(classes.containerLG);
          document.getElementById("tile-brands")?.classList.remove(classes.containerXS);
          document.getElementById("tile-family")?.classList.remove(classes.containerXS);
          document.getElementById("tile-baby")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-family":
        if (!isLeaving) {
          document.getElementById("tile-family")?.classList.add(classes.containerLG);
          document.getElementById("tile-baby")?.classList.add(classes.containerXS);
          document.getElementById("tile-love")?.classList.add(classes.containerXS);
          document.getElementById("tile-brands")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-family")?.classList.remove(classes.containerLG);
          document.getElementById("tile-baby")?.classList.remove(classes.containerXS);
          document.getElementById("tile-love")?.classList.remove(classes.containerXS);
          document.getElementById("tile-brands")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-baby":
        if (!isLeaving) {
          document.getElementById("tile-baby")?.classList.add(classes.containerLG);
          document.getElementById("tile-brands")?.classList.add(classes.containerXS);
          document.getElementById("tile-love")?.classList.add(classes.containerXS);
          document.getElementById("tile-family")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-baby")?.classList.remove(classes.containerLG);
          document.getElementById("tile-brands")?.classList.remove(classes.containerXS);
          document.getElementById("tile-love")?.classList.remove(classes.containerXS);
          document.getElementById("tile-family")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-kids":
        if (!isLeaving) {
          document.getElementById("tile-kids")?.classList.add(classes.containerLG);
          document.getElementById("tile-birthday")?.classList.add(classes.containerXS);
          document.getElementById("tile-memory")?.classList.add(classes.containerXS);
          document.getElementById("tile-friends")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-kids")?.classList.remove(classes.containerLG);
          document.getElementById("tile-birthday")?.classList.remove(classes.containerXS);
          document.getElementById("tile-memory")?.classList.remove(classes.containerXS);
          document.getElementById("tile-friends")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-birthday":
        if (!isLeaving) {
          document.getElementById("tile-birthday")?.classList.add(classes.containerLG);
          document.getElementById("tile-kids")?.classList.add(classes.containerXS);
          document.getElementById("tile-memory")?.classList.add(classes.containerXS);
          document.getElementById("tile-friends")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-birthday")?.classList.remove(classes.containerLG);
          document.getElementById("tile-kids")?.classList.remove(classes.containerXS);
          document.getElementById("tile-memory")?.classList.remove(classes.containerXS);
          document.getElementById("tile-friends")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-memory":
        if (!isLeaving) {
          document.getElementById("tile-memory")?.classList.add(classes.containerLG);
          document.getElementById("tile-birthday")?.classList.add(classes.containerXS);
          document.getElementById("tile-kids")?.classList.add(classes.containerXS);
          document.getElementById("tile-friends")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-memory")?.classList.remove(classes.containerLG);
          document.getElementById("tile-birthday")?.classList.remove(classes.containerXS);
          document.getElementById("tile-kids")?.classList.remove(classes.containerXS);
          document.getElementById("tile-friends")?.classList.remove(classes.containerXS);
        }
        break;
      case "tile-friends":
        if (!isLeaving) {
          document.getElementById("tile-friends")?.classList.add(classes.containerLG);
          document.getElementById("tile-memory")?.classList.add(classes.containerXS);
          document.getElementById("tile-kids")?.classList.add(classes.containerXS);
          document.getElementById("tile-birthday")?.classList.add(classes.containerXS);
        } else {
          document.getElementById("tile-friends")?.classList.remove(classes.containerLG);
          document.getElementById("tile-memory")?.classList.remove(classes.containerXS);
          document.getElementById("tile-kids")?.classList.remove(classes.containerXS);
          document.getElementById("tile-birthday")?.classList.remove(classes.containerXS);
        }
        break;
    }
  };

  interface TileProps {
    title: string;
    subtitle: string;
    tileClass: string;
  }

  const topTiles: TileProps[] = [
    {
      title: "Brands",
      subtitle:
        "Check out our Reese's, Kinder or Ferrero Rocher Cakes - or browse our other brand related products!",
      tileClass: "brands",
    },
    {
      title: "Love",
      subtitle:
        "Give the person that you love a gift to remember with these romance themed products!",
      tileClass: "love",
    },
    {
      title: "Family",
      subtitle:
        "Whether you would like a scrabble-themed frame, a timeline memory frame or something different - there's something for everybody!",
      tileClass: "family",
    },
    {
      title: "Baby",
      subtitle:
        "Celebrate a newborn with a baby shower frame, a Christening themed cake, or browse many more... ",
      tileClass: "baby",
    },
  ];
  const bottomTiles: TileProps[] = [
    {
      title: "Kids",
      subtitle:
        "Whether it's Minions cake, a  hand-crafted timeline frame or a Toy Story themed cake - there's a gift for everybody!",
      tileClass: "kids",
    },
    {
      title: "Birthday",
      subtitle:
        "Is there a better way to celebrate a birthday than a bespoke hand-crafted birthday cake?",
      tileClass: "birthday",
    },
    {
      title: "Memory",
      subtitle: "Commemorate a special event with a bespoke hand-crafted frame!",
      tileClass: "memory",
    },
    {
      title: "Friendship",
      subtitle:
        "Let your friends feel the love with a friendship themed cake or creation!",
      tileClass: "friends",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div className={classes.outerContainer}>
        {topTiles.map((props, i) => (
          <ThemeTile
            handleHoverChange={(id: string, isLeaving?: boolean): void =>
              handleHoverChange(id, isLeaving)
            }
            key={i}
            switchToSearch={(theme): void => switchToSearch(theme)}
            {...props}
          />
        ))}
      </div>
      <div className={classes.outerContainer}>
        {bottomTiles.map((props, i) => (
          <ThemeTile
            handleHoverChange={(id: string, isLeaving?: boolean): void =>
              handleHoverChange(id, isLeaving)
            }
            key={i}
            switchToSearch={(theme): void => switchToSearch(theme)}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(PopularThemes);

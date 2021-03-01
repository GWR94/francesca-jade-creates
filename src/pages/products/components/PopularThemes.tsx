import { makeStyles, useMediaQuery } from "@material-ui/core";
import React from "react";
import { breakpoints } from "../../../themes";
import styles from "../styles/popularTheme.style";
import ThemeTile from "./ThemeTile";

const PopularThemes: React.FC = (): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const mobile = useMediaQuery(breakpoints.down("md"));
  const xs = useMediaQuery(breakpoints.down("xs"));

  const handleHoverChange = (id: string, isLeaving = false): void => {
    // if user is on an extra small mobile screen, don't change the class/show animations
    if (xs) return;
    switch (id) {
      case "tile-brands":
        // if the user is on a regular mobile screen then add class styles/animations for 2 images
        if (mobile) {
          // add class when user hovers/focus' with div
          if (!isLeaving) {
            document
              .getElementById("tile-brands")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-love")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-brands")?.classList.add(classes.containerLarge);
            document.getElementById("tile-love")?.classList.add(classes.containerSmall);
            document.getElementById("tile-family")?.classList.add(classes.containerSmall);
            document.getElementById("tile-baby")?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-love":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-love")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-brands")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-love")?.classList.add(classes.containerLarge);
            document.getElementById("tile-brands")?.classList.add(classes.containerSmall);
            document.getElementById("tile-family")?.classList.add(classes.containerSmall);
            document.getElementById("tile-baby")?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-family":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-family")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-baby")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-family")?.classList.add(classes.containerLarge);
            document.getElementById("tile-baby")?.classList.add(classes.containerSmall);
            document.getElementById("tile-love")?.classList.add(classes.containerSmall);
            document.getElementById("tile-brands")?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-baby":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-baby")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-family")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-baby")?.classList.add(classes.containerLarge);
            document.getElementById("tile-brands")?.classList.add(classes.containerSmall);
            document.getElementById("tile-love")?.classList.add(classes.containerSmall);
            document.getElementById("tile-family")?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-baby")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-brands")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-love")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-family")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-kids":
        if (mobile) {
          // add class when user hovers/focus' with div
          if (!isLeaving) {
            document
              .getElementById("tile-kids")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-kids")?.classList.add(classes.containerLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerSmall);
            document.getElementById("tile-memory")?.classList.add(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-birthday":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-kids")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerLarge);
            document.getElementById("tile-kids")?.classList.add(classes.containerSmall);
            document.getElementById("tile-memory")?.classList.add(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-memory":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-memory")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document.getElementById("tile-memory")?.classList.add(classes.containerLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerSmall);
            document.getElementById("tile-kids")?.classList.add(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerSmall);
          }
        }
        break;
      case "tile-friends":
        if (mobile) {
          if (!isLeaving) {
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerTwoLarge);
            document
              .getElementById("tile-memory")
              ?.classList.add(classes.containerTwoSmall);
          } else {
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerTwoLarge);
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerTwoSmall);
          }
        } else {
          if (!isLeaving) {
            document
              .getElementById("tile-friends")
              ?.classList.add(classes.containerLarge);
            document.getElementById("tile-memory")?.classList.add(classes.containerSmall);
            document.getElementById("tile-kids")?.classList.add(classes.containerSmall);
            document
              .getElementById("tile-birthday")
              ?.classList.add(classes.containerSmall);
          } else {
            document
              .getElementById("tile-friends")
              ?.classList.remove(classes.containerLarge);
            document
              .getElementById("tile-memory")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-kids")
              ?.classList.remove(classes.containerSmall);
            document
              .getElementById("tile-birthday")
              ?.classList.remove(classes.containerSmall);
          }
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
        "Check out our Reese's, Kinder or Ferrero Rocher Cakes - or browse our brand related creations!",
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
        "Whether you would like a scrabble-themed frame or timeline memory frame - there's something for everybody!",
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
      title: "Friends",
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
            {...props}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularThemes;

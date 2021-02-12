import { Typography, Button, makeStyles, useMediaQuery } from "@material-ui/core";
import React, { RefObject, useRef } from "react";
import { breakpoints } from "../../../themes";
import styles from "../styles/popularTheme.style";

interface PopularThemesProps {
  handleSelectTheme: (theme: string) => void;
}

const PopularThemes: React.FC<PopularThemesProps> = ({
  handleSelectTheme,
}): JSX.Element => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const brandsRef = useRef<HTMLDivElement>(null);
  const loveRef = useRef<HTMLDivElement>(null);
  const familyRef = useRef<HTMLDivElement>(null);
  const kidsRef = useRef<HTMLDivElement>(null);
  const birthdayRef = useRef<HTMLDivElement>(null);
  const weddingRef = useRef<HTMLDivElement>(null);
  const babyRef = useRef<HTMLDivElement>(null);
  const friendsRef = useRef<HTMLDivElement>(null);

  const mobile = useMediaQuery(breakpoints.down("md"));
  const xs = useMediaQuery(breakpoints.down("xs"));

  const handleHoverChange = (ref: RefObject<HTMLDivElement>, isLeaving = false): void => {
    // if user is on an extra small mobile screen, don't change the class/show animations
    if (xs) return;
    // if the user is on a regular mobile screen then add class styles/animations for 2 images
    if (mobile) {
      switch (ref) {
        case brandsRef:
          // add class when user hovers/focus' with div
          if (!isLeaving) {
            brandsRef.current?.classList.add(classes.containerTwoLarge);
            loveRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            // remove class when user leaves/blurs with div
            brandsRef.current?.classList.remove(classes.containerTwoLarge);
            loveRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case loveRef:
          if (!isLeaving) {
            loveRef.current?.classList.add(classes.containerTwoLarge);
            brandsRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            loveRef.current?.classList.remove(classes.containerTwoLarge);
            brandsRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case familyRef:
          if (!isLeaving) {
            familyRef.current?.classList.add(classes.containerTwoLarge);
            babyRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            familyRef.current?.classList.remove(classes.containerTwoLarge);
            babyRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case babyRef:
          if (!isLeaving) {
            babyRef.current?.classList.add(classes.containerTwoLarge);
            familyRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            babyRef.current?.classList.remove(classes.containerTwoLarge);
            familyRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case kidsRef:
          if (!isLeaving) {
            kidsRef.current?.classList.add(classes.containerTwoLarge);
            birthdayRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            kidsRef.current?.classList.remove(classes.containerTwoLarge);
            birthdayRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case birthdayRef:
          if (!isLeaving) {
            birthdayRef.current?.classList.add(classes.containerTwoLarge);
            kidsRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            birthdayRef.current?.classList.remove(classes.containerTwoLarge);
            kidsRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case weddingRef:
          if (!isLeaving) {
            weddingRef.current?.classList.add(classes.containerTwoLarge);
            friendsRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            weddingRef.current?.classList.remove(classes.containerTwoLarge);
            friendsRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
        case friendsRef:
          if (!isLeaving) {
            friendsRef.current?.classList.add(classes.containerTwoLarge);
            weddingRef.current?.classList.add(classes.containerTwoSmall);
          } else {
            friendsRef.current?.classList.remove(classes.containerTwoLarge);
            weddingRef.current?.classList.remove(classes.containerTwoSmall);
          }
          break;
      }
    } else {
      // if the screen is larger than a mobile, use the 4 image classes
      switch (ref) {
        case brandsRef:
          if (!isLeaving) {
            brandsRef.current?.classList.add(classes.containerLarge);
            loveRef.current?.classList.add(classes.containerSmall);
            familyRef.current?.classList.add(classes.containerSmall);
            babyRef.current?.classList.add(classes.containerSmall);
          } else {
            brandsRef.current?.classList.remove(classes.containerLarge);
            loveRef.current?.classList.remove(classes.containerSmall);
            familyRef.current?.classList.remove(classes.containerSmall);
            babyRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case loveRef:
          if (!isLeaving) {
            loveRef.current?.classList.add(classes.containerLarge);
            brandsRef.current?.classList.add(classes.containerSmall);
            familyRef.current?.classList.add(classes.containerSmall);
            babyRef.current?.classList.add(classes.containerSmall);
          } else {
            loveRef.current?.classList.remove(classes.containerLarge);
            brandsRef.current?.classList.remove(classes.containerSmall);
            familyRef.current?.classList.remove(classes.containerSmall);
            babyRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case familyRef:
          if (!isLeaving) {
            familyRef.current?.classList.add(classes.containerLarge);
            loveRef.current?.classList.add(classes.containerSmall);
            brandsRef.current?.classList.add(classes.containerSmall);
            babyRef.current?.classList.add(classes.containerSmall);
          } else {
            familyRef.current?.classList.remove(classes.containerLarge);
            loveRef.current?.classList.remove(classes.containerSmall);
            brandsRef.current?.classList.remove(classes.containerSmall);
            babyRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case babyRef:
          if (!isLeaving) {
            babyRef.current?.classList.add(classes.containerLarge);
            familyRef.current?.classList.add(classes.containerSmall);
            loveRef.current?.classList.add(classes.containerSmall);
            brandsRef.current?.classList.add(classes.containerSmall);
          } else {
            babyRef.current?.classList.remove(classes.containerLarge);
            familyRef.current?.classList.remove(classes.containerSmall);
            loveRef.current?.classList.remove(classes.containerSmall);
            brandsRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case kidsRef:
          if (!isLeaving) {
            kidsRef.current?.classList.add(classes.containerLarge);
            birthdayRef.current?.classList.add(classes.containerSmall);
            weddingRef.current?.classList.add(classes.containerSmall);
            friendsRef.current?.classList.add(classes.containerSmall);
          } else {
            kidsRef.current?.classList.remove(classes.containerLarge);
            birthdayRef.current?.classList.remove(classes.containerSmall);
            weddingRef.current?.classList.remove(classes.containerSmall);
            friendsRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case birthdayRef:
          if (!isLeaving) {
            birthdayRef.current?.classList.add(classes.containerLarge);
            weddingRef.current?.classList.add(classes.containerSmall);
            kidsRef.current?.classList.add(classes.containerSmall);
            friendsRef.current?.classList.add(classes.containerSmall);
          } else {
            birthdayRef.current?.classList.remove(classes.containerLarge);
            weddingRef.current?.classList.remove(classes.containerSmall);
            kidsRef.current?.classList.remove(classes.containerSmall);
            friendsRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case weddingRef:
          if (!isLeaving) {
            weddingRef.current?.classList.add(classes.containerLarge);
            birthdayRef.current?.classList.add(classes.containerSmall);
            kidsRef.current?.classList.add(classes.containerSmall);
            friendsRef.current?.classList.add(classes.containerSmall);
          } else {
            weddingRef.current?.classList.remove(classes.containerLarge);
            birthdayRef.current?.classList.remove(classes.containerSmall);
            kidsRef.current?.classList.remove(classes.containerSmall);
            friendsRef.current?.classList.remove(classes.containerSmall);
          }
          break;
        case friendsRef:
          if (!birthdayRef.current || !kidsRef.current || !weddingRef.current) return;
          if (!isLeaving) {
            friendsRef.current?.classList.add(classes.containerLarge);
            birthdayRef.current.classList.add(classes.containerSmall);
            kidsRef.current.classList.add(classes.containerSmall);
            weddingRef.current?.classList.add(classes.containerSmall);
          } else {
            friendsRef.current?.classList.remove(classes.containerLarge);
            birthdayRef.current.classList.remove(classes.containerSmall);
            kidsRef.current.classList.remove(classes.containerSmall);
            weddingRef.current?.classList.remove(classes.containerSmall);
          }
          break;
      }
    }
  };
  return (
    <>
      <div className={classes.outerContainer}>
        <div
          className={classes.container}
          ref={brandsRef}
          onClick={(): void => handleSelectTheme("Food & Drink Brands")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(brandsRef)}
          onFocus={(): void => handleHoverChange(brandsRef)}
          onBlur={(): void => handleHoverChange(brandsRef, true)}
          onMouseLeave={(): void => handleHoverChange(brandsRef, true)}
        >
          <div className={`${classes.wrap} ${classes.brands}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Food & Drink Brands</Typography>
              <Button size="small">View Food & Drink</Button>
            </div>
          </div>
        </div>
        <div
          className={classes.container}
          ref={loveRef}
          onClick={(): void => handleSelectTheme("Love")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(loveRef)}
          onFocus={(): void => handleHoverChange(loveRef)}
          onBlur={(): void => handleHoverChange(loveRef, true)}
          onMouseLeave={(): void => handleHoverChange(loveRef, true)}
        >
          <div className={`${classes.wrap} ${classes.love}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Love Theme</Typography>
              <Button size="small">View Love</Button>
            </div>
          </div>
        </div>
        <div
          className={classes.container}
          ref={familyRef}
          onClick={(): void => handleSelectTheme("Family")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(familyRef)}
          onFocus={(): void => handleHoverChange(familyRef)}
          onBlur={(): void => handleHoverChange(familyRef, true)}
          onMouseLeave={(): void => handleHoverChange(familyRef, true)}
        >
          <div className={`${classes.wrap} ${classes.family}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Family Theme</Typography>
              <Button size="small">View Family</Button>
            </div>
          </div>
        </div>
        <div
          className={classes.container}
          ref={babyRef}
          onClick={(): void => handleSelectTheme("Baby")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(babyRef)}
          onFocus={(): void => handleHoverChange(babyRef)}
          onBlur={(): void => handleHoverChange(babyRef, true)}
          onMouseLeave={(): void => handleHoverChange(babyRef, true)}
        >
          <div className={`${classes.wrap} ${classes.baby}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Baby Theme</Typography>
              <Button size="small">View Baby</Button>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.outerContainer}>
        <div
          className={mobile ? classes.containerMobile : classes.container}
          ref={kidsRef}
          onClick={(): void => handleSelectTheme("Kids")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(kidsRef)}
          onFocus={(): void => handleHoverChange(kidsRef)}
          onBlur={(): void => handleHoverChange(kidsRef, true)}
          onMouseLeave={(): void => handleHoverChange(kidsRef, true)}
        >
          <div className={`${classes.wrap} ${classes.kids}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Kids Theme</Typography>
              <Button size="small">View Kids</Button>
            </div>
          </div>
        </div>
        <div
          className={mobile ? classes.containerMobile : classes.container}
          onClick={(): void => handleSelectTheme("Birthday")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(birthdayRef)}
          onFocus={(): void => handleHoverChange(birthdayRef)}
          onBlur={(): void => handleHoverChange(birthdayRef, true)}
          onMouseLeave={(): void => handleHoverChange(birthdayRef, true)}
          ref={birthdayRef}
        >
          <div className={`${classes.wrap} ${classes.birthday}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Birthday Theme</Typography>
              <Button size="small">View Birthday</Button>
            </div>
          </div>
        </div>
        <div
          className={mobile ? classes.containerMobile : classes.container}
          onClick={(): void => handleSelectTheme("Wedding")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(weddingRef)}
          onFocus={(): void => handleHoverChange(weddingRef)}
          onBlur={(): void => handleHoverChange(weddingRef, true)}
          onMouseLeave={(): void => handleHoverChange(weddingRef, true)}
          ref={weddingRef}
        >
          <div className={`${classes.wrap} ${classes.wedding}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Wedding Theme</Typography>
              <Button size="small">View Wedding</Button>
            </div>
          </div>
        </div>
        <div
          className={mobile ? classes.containerMobile : classes.container}
          onClick={(): void => handleSelectTheme("Friendship")}
          role="button"
          tabIndex={0}
          onMouseOver={(): void => handleHoverChange(friendsRef)}
          onFocus={(): void => handleHoverChange(friendsRef)}
          onBlur={(): void => handleHoverChange(friendsRef, true)}
          onMouseLeave={(): void => handleHoverChange(friendsRef, true)}
          ref={friendsRef}
        >
          <div className={`${classes.wrap} ${classes.friends}`}>
            <div className={classes.text}>
              <Typography className={classes.title}>Friends Theme</Typography>
              <Button size="small">View Friends</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularThemes;

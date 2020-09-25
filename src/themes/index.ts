import { green } from "@material-ui/core/colors";
import { createMuiTheme, createStyles } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({});

export enum COLORS {
  LightPink = "#ffa3f9",
  Pink = "#ff80f7",
  DarkPink = "#fd4ef2",
  Purple = "#9370f6",
  LightPurple = "#ae91ff",
  PaleBlue = "#b9d6f3",
  SkyBlue = "#69abec",
  LightGray = "#d3d3d3",
  OffWhite = "#ebe9e9",
  ErrorRed = "#f44336",
  BorderGray = "#C4C4C4",
  DisabledGray = "#BABABA",
  AltBorderGray = "#dadada",
  TextGray = "#828282",
  SuccessGreen = "#4caf50",
  InfoBlue = "#00b0ff",
}

export enum BREAKPOINTS {
  XL = "1690px",
  LG = "1280px",
  MD = "980px",
  SM = "740px",
  XS = "480px",
}

export enum PLACEHOLDERS {
  DisplayImage = "https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png",
}

export enum FONTS {
  Header = "Lobster Two, cursive",
  Text = "Neucha, sans-serif",
  Title = "Roboto, sans-serif",
}

export enum INTENT {
  Success = "success",
  Danger = "error",
  Info = "info",
  Warning = "warning",
}

export const defaultStyles = createStyles({
  buttonContainer: {
    display: "inline-flex",
    width: "100%",
    justifyContent: "center",
  },
});

export const nonIdealStateTheme = createMuiTheme({
  palette: {
    primary: {
      main: COLORS.DarkPink,
    },
    secondary: {
      main: COLORS.Purple,
    },
  },
  overrides: {
    MuiSvgIcon: {
      root: {
        fontSize: "4rem",
        [breakpoints.down("md")]: {
          fontSize: "3rem",
        },
        [breakpoints.down("sm")]: {
          fontSize: "2.8rem",
        },
      },
    },
    MuiButton: {
      root: {
        margin: "0 8px",
      },
      label: {
        [breakpoints.down("sm")]: {
          fontSize: "0.7rem",
        },
      },
    },
    MuiTypography: {
      h5: {
        fontSize: "1.6rem",
        fontWeight: "bold",
        [breakpoints.down("md")]: {
          fontSize: "1.4rem",
        },
      },
      subtitle2: {
        fontSize: "1.1rem",
        textAlign: "center",
        padding: "3px 5px",
        [breakpoints.down("sm")]: {
          fontSize: "0.9rem",
          marginBottom: 6,
        },
        fontWeight: "lighter",
        marginBottom: 12,
      },
    },
  },
});

export const rootTheme = createMuiTheme({
  overrides: {
    MuiInputBase: {
      root: {
        marginBottom: 4,
      },
      input: {
        "&$disabled": {
          cursor: "not-allowed",
        },
      },
    },
    MuiInputLabel: {
      formControl: {
        transform: "translate(14px, 17px) scale(1)",
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: "transparent",
      },
    },
    MuiChip: {
      labelSmall: {
        color: "#fff",
      },
      label: {
        color: "#fff",
        [breakpoints.down("md")]: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      },
    },
    MuiSelect: {
      select: {
        "&$disabled": {
          cursor: "not-allowed",
        },
      },
    },
    MuiBadge: {
      root: {
        marginRight: 4,
      },
      colorPrimary: {
        backgroundColor: COLORS.DarkPink,
      },
      badge: {
        height: 15,
        borderRadius: 4,
        minWidth: 15,
      },
      anchorOriginTopRightRectangle: {
        right: 5,
      },
    },
    MuiDivider: {
      root: {
        margin: "6px 0",
      },
    },
    MuiPopover: {
      paper: {
        overflowX: "initial",
        overflowY: "initial",
      },
    },
    MuiCardContent: {
      root: {
        padding: "8px 12px",
      },
    },
    MuiCardHeader: {
      title: {
        [breakpoints.down("md")]: {
          fontSize: "1.1rem",
        },
        [breakpoints.down("sm")]: {
          fontSize: "1rem",
        },
        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
      },
      root: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
    },
    MuiFab: {
      root: {
        transition: "background 0.8s",
        color: "#fff",
      },
    },
    // @ts-ignore
    MuiPaginationItem: {
      page: {
        "&$selected": {
          backgroundColor: COLORS.DarkPink,
          color: "#fff",
          "&:hover": {
            backgroundColor: COLORS.LightPink,
          },
        },
      },
    },
    MuiTypography: {
      subtitle1: {
        fontSize: "1.0rem",
        textAlign: "center",
        marginBottom: 8,
      },
      subtitle2: {
        textAlign: "center",
        fontSize: "0.8rem",
        fontWeight: "lighter",
        fontStyle: "italic",
        marginBottom: 20,
      },
      h4: {
        [breakpoints.down("md")]: {
          fontSize: "1.8rem",
        },
        fontSize: "2.2rem",
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",
      },
      h6: {
        margin: "14px 0 12px 5px",
      },
    },
    MuiDrawer: {
      paper: {
        margin: "0 auto",
        maxWidth: "400px",
        borderBottomRightRadius: "8px",
        borderBottomLeftRadius: "8px",
      },
    },
    MuiTabs: {
      root: {
        marginBottom: 12,
      },
      indicator: {
        backgroundColor: COLORS.DarkPink,
      },
    },

    MuiTab: {
      textColorPrimary: {
        "&$selected": {
          color: COLORS.DarkPink,
        },
      },
    },
    MuiCard: {
      root: {
        cursor: "pointer",
      },
    },
  },
});

export const greenAndRedTheme = createMuiTheme({
  palette: {
    primary: green,
  },
  overrides: {
    MuiButton: {
      label: {
        color: "#fff",
      },
    },
    MuiChip: {
      label: {
        color: "#fff",
      },
      root: {
        borderRadius: "5px",
      },
    },
  },
});

export const searchFilterTheme = createMuiTheme({
  overrides: {
    MuiSvgIcon: {
      root: {
        marginRight: -3,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    MuiFormLabel: {
      root: {
        textAlign: "center",
        "&:focus": {
          color: "black",
        },
      },
    },
    MuiCheckbox: {
      root: {
        padding: "3px 10px",
      },
    },
    MuiRadio: {
      root: {
        padding: "3px 10px",
      },
    },
  },
});

export const styles = createStyles({
  noLeftBorderInput: {
    borderLeftColor: "transparent",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginLeft: "-1px",
  },
  noRightBorderInput: {
    borderRightColor: "transparent",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: "-1px",
  },
  buttonBottom: {
    margin: "20px 4px 40px",
  },
});

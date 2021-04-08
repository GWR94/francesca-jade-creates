import { green } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

export enum COLORS {
  PalePink = "#fff2fe",
  LightPink = "#ffdbeb",
  Pink = "#FDB5D5",
  DarkPink = "#fc8bbd",
  DarkGrey = "#878787",
  Gray = "#b8b8b8",
  LightGray = "#dedede",
  PaleBlue = "#b9d6f3",
  SkyBlue = "#69abec",
  OffWhite = "#ebe9e9",
  ErrorRed = "#f44336",
  BorderGray = "#C4C4C4",
  DisabledGray = "#BABABA",
  AltBorderGray = "#dadada",
  PaleWhite = "#fcfcfc",
  TextGray = "#828282",
  SuccessGreen = "#4caf50",
  LightGreen = "#59cf5e",
  InfoBlue = "#00b0ff",
  WarningOrange = "#ff9800",
  FacebookBlue = "#4267B2",
  InstagramPurple = "#833AB4",
}

export enum PLACEHOLDERS {
  DisplayImage = "https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png",
}

export enum FONTS {
  Text = "Neucha, sans-serif",
  Title = "Roboto, sans-serif",
}

export enum INTENT {
  Success = "success",
  Danger = "error",
  Info = "info",
  Warning = "warning",
}

export const breakpoints = createBreakpoints({});

export const nonIdealStateTheme = createMuiTheme({
  palette: {
    primary: {
      main: COLORS.DarkPink,
    },
    secondary: {
      main: COLORS.DarkGrey,
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
          fontSize: "0.8rem",
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
    MuiTypography: {
      h4: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "2rem",
        [breakpoints.down("md")]: {
          fontSize: "1.8rem",
        },
        [breakpoints.down("sm")]: {
          fontSize: "1.6rem",
        },
      },
      h5: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "1.8rem",
        [breakpoints.down("md")]: {
          fontSize: "1.6rem",
        },
        [breakpoints.down("sm")]: {
          fontSize: "1.4rem",
        },
      },
      h6: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "1.5rem",
        [breakpoints.down("md")]: {
          fontSize: "1.3rem",
        },
        [breakpoints.down("sm")]: {
          fontSize: "1.2rem",
        },
      },
      subtitle1: {
        fontSize: "1rem",
        textAlign: "center",
      },
      subtitle2: {
        textAlign: "center",
        fontSize: "0.9rem",
        fontStyle: "italic",
        fontWeight: "normal",
        color: "rgba(0,0,0,0.6)",
      },
    },
    MuiBadge: {
      root: {
        marginRight: 4,
      },
      colorPrimary: {
        color: "#fff",
        marginRight: 3,
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
          backgroundColor: COLORS.Pink,
          color: "#fff",
          "&:hover": {
            backgroundColor: `${COLORS.DarkPink} !important`,
          },
          "&:focus": {
            backgroundColor: COLORS.DarkPink,
          },
          "&:active": {
            backgroundColor: COLORS.DarkPink,
          },
        },
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

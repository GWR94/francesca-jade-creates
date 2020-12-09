import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Select,
  MenuItem,
  makeStyles,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { COLORS } from "../../../themes";
import { Feature } from "../../accounts/interfaces/Variants.i";
import styles from "../styles/basketCustomOptions.style";
import { CustomOptionsProps, CustomOptionsState } from "../interfaces/Basket.i";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import RenderInput from "./RenderInput";

/**
 * TODO
 * [x] Show uploaded images when field is complete
 * [x] Add Optional to all fields which are optional (range/minNum)
 * [x] Add colour scheme to top of custom options
 * [x] Add styles to delete product dialog
 * [ ] Check the images are deleting from s3 when removing them from array
 * [ ] Notify the user images will be lost if navigating away from accordion
 * [ ] Remove ability to highlight unnecessary text
 */

/**
 * Functional component to allow a customer to enter their custom options for a
 * chosen product variant and store the result into the redux store (basket.checkout)
 * @param currentVariant - The current variant of the chosen product in the parent.
 * @param setCurrentVariant - Function to change the current variant in the parent
 * component.
 * @param customOptions - The custom options array passed down from the parent component
 * @param colorScheme - colour scheme of product
 */
const BasketCustomOptions: React.FC<CustomOptionsProps> = ({
  currentVariant,
  setCustomOptions,
  customOptions,
  colorScheme,
}) => {
  // create state and initialise with empty input values
  const [state, setState] = useState<CustomOptionsState>({
    expanded: false,
    currentNotesValue: "",
    isCompleted: false,
    currentColorScheme: "",
    imageCompleted: false,
  });

  // make styles from external styles object
  const useStyles = makeStyles(styles);
  // execute useStyles function so styles can be used in component
  const classes = useStyles();

  /**
   * Function to change the open accordion panel in the component based on the
   * index provided as "panel".
   * @param panel - The index of the panel that the user wishes to navigate to
   */
  const handlePanelChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean,
  ): void => {
    setState({
      ...state,
      // if isExpanded is true, change to the panel, otherwise close all panels with false
      expanded: isExpanded ? panel : false,
    });
  };

  // destructure state for use in component
  const {
    expanded,
    isCompleted,
    currentNotesValue,
    currentColorScheme,
    imageCompleted,
  } = state;

  // store the index of the notes & color panels so they can be referenced easily in component
  const notesIdx = (currentVariant?.features.length ?? 0) + 1;
  const colorIdx = currentVariant?.features.length ?? 0;

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {!isCompleted &&
        currentVariant!.features.map((feature: Feature, i: number) => {
          const optional =
            (feature.inputType === "number" && feature.value.number === 0) ||
            (feature.inputType === "range" && feature.value.range?.[0] === 0);
          return (
            <Accordion
              expanded={expanded === `panel${i}`}
              key={i}
              TransitionProps={{ unmountOnExit: false }}
              onChange={handlePanelChange(`panel${i}`)}
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`panel${i}-content`}
                id={`panel${i}-header`}
              >
                <Typography className={classes.heading}>{feature.name}</Typography>
                <Typography className={classes.secondaryHeading}>
                  {customOptions[i] !== undefined ||
                  (feature.featureType === "images" && imageCompleted) ? (
                    <span
                      className={classes.statusTab}
                      style={{ color: COLORS.SuccessGreen }}
                    >
                      Complete
                    </span>
                  ) : optional ? (
                    <span
                      className={classes.statusTab}
                      style={{ color: COLORS.WarningOrange }}
                    >
                      Optional
                    </span>
                  ) : (
                    <span
                      style={{ color: COLORS.ErrorRed }}
                      className={classes.statusTab}
                    >
                      Incomplete
                    </span>
                  )}
                </Typography>
              </AccordionSummary>
              <AccordionDetails classes={{ root: classes.accordionRoot }}>
                <RenderInput
                  feature={feature}
                  i={i}
                  setCustomOptions={(customOptions): void =>
                    setCustomOptions(customOptions)
                  }
                  customOptions={customOptions}
                  setExpanded={(expanded): void => setState({ ...state, expanded })}
                  featuresLength={currentVariant?.features.length ?? 0}
                  imageCompleted={imageCompleted}
                  setImageCompleted={(isCompleted: boolean): void =>
                    setState({ ...state, imageCompleted: isCompleted })
                  }
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      {!isCompleted && (
        <>
          <Accordion
            expanded={expanded === `panel-color`}
            TransitionProps={{ unmountOnExit: true }}
            onChange={handlePanelChange(`panel-color`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel-color-content"
              id="panel-color-header"
            >
              <Typography className={classes.heading}>Colour Scheme</Typography>
              <Typography className={classes.secondaryHeading}>
                {customOptions[colorIdx] === undefined ? (
                  <span className={classes.statusTab} style={{ color: COLORS.ErrorRed }}>
                    Incomplete
                  </span>
                ) : (
                  <span
                    className={classes.statusTab}
                    style={{ color: COLORS.SuccessGreen }}
                  >
                    Complete
                  </span>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionRoot }}>
              {customOptions[colorIdx] !== undefined ? (
                <>
                  <Typography>{Object.values(customOptions[colorIdx])}</Typography>
                  <div className={classes.buttonContainer}>
                    <Button
                      onClick={(): void => {
                        const updatedCustomOptions = customOptions;
                        const prevValue = customOptions[colorIdx];
                        // @ts-expect-error
                        updatedCustomOptions[colorIdx] = undefined;
                        setState({
                          ...state,
                          // @ts-expect-error
                          currentColorScheme: Object.values(prevValue),
                        });
                        setCustomOptions(updatedCustomOptions);
                      }}
                      variant="text"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(): void => {
                        const updatedCustomOptions = customOptions;
                        // @ts-expect-error
                        updatedCustomOptions[colorIdx] = undefined;
                        setCustomOptions(updatedCustomOptions);
                      }}
                      variant="text"
                      color="secondary"
                    >
                      Clear
                    </Button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <Typography variant="subtitle2">
                    Please select the colour scheme you wish to use for the frame.
                  </Typography>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      Colour Scheme
                    </InputLabel>
                    <Select
                      value={currentColorScheme}
                      label="Colour Scheme"
                      fullWidth
                      variant="outlined"
                      onChange={(e): void =>
                        setState({
                          ...state,
                          currentColorScheme: e.target.value as string,
                        })
                      }
                      style={{ minWidth: 220 }}
                    >
                      {colorScheme.map((val, i) => (
                        <MenuItem value={val} key={i}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    onClick={(): void => {
                      const updatedCustomOptions = customOptions;
                      updatedCustomOptions[colorIdx] = {
                        "Color Scheme": currentColorScheme,
                      };
                      setState({
                        ...state,
                        currentColorScheme: "",
                        expanded: `panel-color`,
                      });
                      setCustomOptions(updatedCustomOptions);
                    }}
                    color="primary"
                    disabled={!currentColorScheme}
                  >
                    Next
                  </Button>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === `panel-notes`}
            TransitionProps={{ unmountOnExit: true }}
            onChange={handlePanelChange(`panel-notes`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel-notes-content"
              id="panel-notes-header"
            >
              <Typography className={classes.heading}>Notes</Typography>
              <Typography className={classes.secondaryHeading}>
                {customOptions[notesIdx] === undefined ? (
                  <span
                    className={classes.statusTab}
                    style={{ color: COLORS.WarningOrange }}
                  >
                    Optional
                  </span>
                ) : (
                  <span
                    className={classes.statusTab}
                    style={{ color: COLORS.SuccessGreen }}
                  >
                    Complete
                  </span>
                )}
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionRoot }}>
              {customOptions[notesIdx] !== undefined ? (
                <>
                  <Typography>{Object.values(customOptions[notesIdx])[0]}</Typography>
                  <div className={classes.buttonContainer}>
                    <Button
                      onClick={(): void => {
                        const updatedCustomOptions = customOptions;
                        const prevValue = customOptions[notesIdx];
                        // @ts-expect-error
                        updatedCustomOptions[notesIdx] = undefined;
                        setState({
                          ...state,
                          // @ts-expect-error
                          currentNotesValue: Object.values(prevValue),
                        });
                        setCustomOptions(updatedCustomOptions);
                      }}
                      variant="text"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(): void => {
                        const updatedCustomOptions = customOptions;
                        // @ts-expect-error
                        updatedCustomOptions[notesIdx] = undefined;
                        setCustomOptions(updatedCustomOptions);
                      }}
                      variant="text"
                      color="secondary"
                    >
                      Clear
                    </Button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  <Typography variant="subtitle2">
                    Optionally add notes to add other bespoke customisation options or to
                    notify about the chosen image placement etc.
                  </Typography>
                  <TextField
                    value={currentNotesValue}
                    fullWidth
                    multiline
                    label="Notes"
                    variant="outlined"
                    rows={3}
                    onChange={(e): void =>
                      setState({ ...state, currentNotesValue: e.target.value })
                    }
                  />
                  <Button
                    onClick={(): void => {
                      const updatedCustomOptions = customOptions;
                      updatedCustomOptions[notesIdx] = {
                        Notes: currentNotesValue,
                      };
                      setState({
                        ...state,
                        expanded: false,
                      });
                      setCustomOptions(updatedCustomOptions);
                    }}
                    color="primary"
                    disabled={currentNotesValue?.length === 0}
                  >
                    Next
                  </Button>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};

export default BasketCustomOptions;

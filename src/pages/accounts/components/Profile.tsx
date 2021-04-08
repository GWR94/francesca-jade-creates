import React, { useEffect, useState } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import validate from "validate.js";
import { useSelector } from "react-redux";
import {
  Container,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Chip,
  Typography,
  ThemeProvider,
  InputAdornment,
  Tooltip,
  useMediaQuery,
  makeStyles,
} from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";
import { getUser } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import { ProfileProps, ProfileState } from "../interfaces/Profile.i";
import { updateUser } from "../../../graphql/mutations";
import { ImageProps, UploadedFile } from "../../products/interfaces/NewProduct.i";
// @ts-ignore
import awsExports from "../../../aws-exports";
import ImagePicker from "../../../common/containers/ImagePicker";
import PasswordChange from "./PasswordChange";
import VerificationDialog from "./VerificationDialog";
import { greenAndRedTheme, INTENT, PLACEHOLDERS } from "../../../themes";
import { openSnackbar } from "../../../utils/Notifier";
import OutlinedContainer from "../../../common/containers/OutlinedContainer";
import { AppState } from "../../../store/store";
import styles from "../styles/profile.style";

/**
 * Set the initial state to be empty/nullish values so they can be set to their correct
 * values once handleRetrieveData has been called during componentDidMount().
 */
const initialState: ProfileState = {
  username: {
    value: "",
    error: "",
  },
  email: {
    value: "",
    error: "",
    verified: false,
  },
  isLoading: true,
  isEditing: false,
  newDisplayImage: null,
  dialogOpen: {
    password: false,
    email: false,
    emailConfirm: false,
    phoneNumber: false,
  },
  phoneNumber: {
    value: "",
    verified: false,
    error: "",
    code: "",
  },
  shippingAddress: {
    city: "",
    line1: "",
    county: "",
    postcode: "",
    error: "",
  },
  displayImage: null,
  isCognitoUser: false,
};

/**
 * Functional component which allows the user to view and update their profile
 * credentials including display image, contact information, username, shipping
 * address etc.
 */
const Profile: React.FC<ProfileProps> = ({ user, userAttributes }): JSX.Element => {
  // set state to be initial state when the component mounts.
  const [state, setState] = useState<ProfileState>(initialState);
  // use the useMediaQuery hook to determine if the screen is less than 600px (returns boolean)
  const desktop = useMediaQuery("(min-width: 600px)");

  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const sub = useSelector(({ user }: AppState) => user.id);

  /**
   * Function to retrieve the users data from the database using the getUser graphQL
   * query. Once the method is has run its course (data retrieved/error), loading UI
   * effects are removed with the isLoading boolean state to be set to false.
   */
  const handleRetrieveData = async (): Promise<void> => {
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const { attributes } = await Auth.currentAuthenticatedUser();

    let isCognitoUser = false;
    if (signInUserSession?.accessToken.payload?.["cognito:groups"]?.length >= 1) {
      isCognitoUser = true;
    }
    const { username } = state;
    try {
      // execute the getUser query with the sub as the id as a parameter.
      const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
      // set res to null so it can be changed if the criteria is met.
      if (userAttributes && !userAttributes.email_verified && !isCognitoUser) {
        openSnackbar({
          severity: INTENT.Danger,
          message: `Your email address isn't verified.
          Please click the red "Unverified" button to verify your email address.`,
        });
      }

      /**
       * Place all of the data pulled from the getUser query into state, and manipulate that
       * data to fit into state if necessary.
       */
      setState({
        ...state,
        username: {
          ...state.username,
          value: data.getUser?.username ?? username,
        },
        email: {
          ...state.email,
          value: attributes.email ?? "",
          verified: attributes?.email_verified ?? false,
        },
        displayImage: data?.getUser?.profileImage ?? null,
        shippingAddress: {
          ...state.shippingAddress,
          line1: data.getUser?.shippingAddress?.address_line1 ?? "",
          line2: data.getUser?.shippingAddress?.address_line2 ?? "",
          city: data.getUser?.shippingAddress?.city ?? "",
          county: data.getUser?.shippingAddress?.address_county ?? "",
          postcode: data.getUser?.shippingAddress?.address_postcode ?? "",
        },
        isLoading: false,
        isCognitoUser,
      });
    } catch (err) {
      /**
       * If there are any errors in retrieving or manipulating the data, then notify the user
       * with an error/danger snackbar with a relevant message.
       */
      setState({ ...state, isLoading: false });
      console.error(err);
      return openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to retrieve profile information - Please try again.",
      });
    }
    // set isLoading to false so all of the loading UI effects are hidden.
  };

  /**
   * When the component mounts, retrieve the relevant data by executing the
   * handleRetrieveData function.
   */
  useEffect(() => {
    // retrieve the users data when the component mounts
    handleRetrieveData();
  }, []);

  /**
   * Method which takes all of the user inputted data from state and updates it in the database
   * using the updateUser graphQL mutation.
   */
  const onUpdateProfile = async (): Promise<void> => {
    const { newDisplayImage, shippingAddress, dialogOpen, username, email } = state;
    try {
      // initialise the file variable so the key, bucket and region can be assigned to it.
      let file;
      /**
       * if there is a new display image, then it needs to be placed into the file object
       * with the correct attributes for its use in the database.
       */
      if (newDisplayImage) {
        // get the identityId from aws-amplify's Auth package.
        const { identityId } = await Auth.currentCredentials();
        // create the filename based on the id, date and image name
        const filename = `${identityId}/${Date.now()}/${newDisplayImage.name}`;
        // put the file into aws with aws-amplify's Storage package.
        const uploadedFile = await Storage.put(
          filename,
          (newDisplayImage as ImageProps).file,
          {
            contentType: newDisplayImage.type,
          },
        );
        const { key } = uploadedFile as UploadedFile;
        // set the file to contain the correct data
        file = {
          key,
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_project_region,
        };
      }
      // use the updateUser mutation with the correct data to update it in the database.
      await API.graphql(
        graphqlOperation(updateUser, {
          input: {
            id: sub,
            profileImage: file,
            email: email.value,
            username: username.value,
            shippingAddress: shippingAddress.line1.length
              ? {
                  city: shippingAddress.city,
                  country: "United Kingdom",
                  address_line1: shippingAddress.line1,
                  address_line2: shippingAddress?.line2?.length
                    ? shippingAddress.line2
                    : null,
                  address_county: shippingAddress.county,
                  address_postcode: shippingAddress.postcode,
                }
              : null,
          },
        }),
      );
      // once completed, signify this to the user with a success snackbar.
      openSnackbar({
        severity: INTENT.Success,
        message: "Profile Successfully Updated.",
      });
      // remove all loading UI effects and close all modals on completion
      setState({
        ...state,
        dialogOpen: {
          ...dialogOpen,
          email: false,
        },
        isEditing: false,
      });
    } catch (err) {
      /**
       * if there are any errors at any point, signify this to the user with an
       * error/danger snackbar with a relevant message.
       */
      openSnackbar({
        severity: INTENT.Danger,
        message: "Error updating profile. Please try again.",
      });
    }
  };

  /**
   * Function which sends a verification code to confirm that the user is the owner
   * of the selected attribute (usually email). Once the user has retrieved the code, it
   * can be entered in the modal to confirm their identity.
   * @param {"email" | "phoneNumber"} attr - The attribute that the user is trying to
   * verify - currently only using "email" as an option but others can be used further
   * down the line.
   */
  const sendVerificationCode = async (attr: string): Promise<void> => {
    const { email, dialogOpen } = state;
    await Auth.verifyCurrentUserAttribute(attr);
    setState({
      ...state,
      dialogOpen: {
        ...dialogOpen,
        email: true,
      },
    });
    if (!email) {
      return openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to send verification email - Please try again.",
      });
    }
    openSnackbar({
      severity: INTENT.Info,
      message: `Verification code has been sent to ${email.value}`,
    });
  };

  /**
   * Method to handle the verification of an unverified email address.
   * @param {boolean} [updateProfile = false] - optional parameter to signify if the onUpdateProfile should
   * be called after the function has completed.
   */
  const handleVerifyEmail = async (updateProfile = false): Promise<void> => {
    // retrieve email from state
    const { email } = state;
    // set values to be updated into an object
    const updatedAttributes = {
      email: email.value,
    };
    /**
     * if email is verified and the input user email matches the userAttributes
     * email, notify the user that it's already verified
     */
    if (userAttributes?.email_verified && email.value === userAttributes?.email) {
      openSnackbar({
        severity: INTENT.Info,
        message: `${email.value} is already verified.`,
      });
      return;
    }
    // update the attributes by using Auth's updateUserAttributes method
    try {
      const res = await Auth.updateUserAttributes(user, updatedAttributes);
      /**
       * if the text "SUCCESS" is returned from the method, send a verification code
       * via the sendVerificationCode method
       */
      if (res === "SUCCESS") {
        sendVerificationCode("email");
      }
    } catch (err) {
      // if there was an error, notify the user of the error.
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to update email address. Please try again.",
      });
    }
    // if updateProfile boolean is true, update the profile.
    if (updateProfile) {
      onUpdateProfile();
    }
  };

  /**
   * Function to validate all of the profile's credentials, so that the onUpdateProfile method
   * doesn't have to handle any form of validation.
   */
  const checkUpdateCredentials = (): void => {
    // destructure all of the relevant pieces of state to be used in the method.
    const { email, shippingAddress } = state;
    // initialise the errors variable to be false, and only change it if there are any errors
    let errors = false;
    // check that the email is valid by using validate.js
    const invalidEmail = validate({ from: email.value }, { from: { email: true } });
    // if the email address is invalid, set the error variable to true and add the error to email state.
    if (invalidEmail) {
      errors = true;
      setState({
        ...state,
        email: {
          ...email,
          error: "Please enter a valid email address.",
        },
      });
    }

    /**
     * Validation checks for shippingAddress's values. Destructure all of the values from shippingAddress and
     * check their lengths. If any of the required attributes are too short then set errors to true and reflect
     * the errors in the shippingAddress error field.
     */
    const { line1, city, county, postcode } = shippingAddress;
    if (line1.length || city.length || county.length || postcode.length) {
      if (
        line1.length < 5 ||
        !city ||
        city.length < 1 ||
        !county ||
        county.length < 4 ||
        !postcode
      ) {
        errors = true;
        setState({
          ...state,
          shippingAddress: {
            ...shippingAddress,
            error: "Please enter a valid address.",
          },
        });
      }
    }
    // if there are any errors, return so the user can change their errors before submitting
    if (errors) return;
    // if the user hasn't verified their email address, the handleVerifyEmail method should be called.
    if (!email.verified || email.value !== userAttributes?.email) {
      handleVerifyEmail(true);
      return;
    }
    onUpdateProfile();
  };

  const {
    isLoading,
    isEditing,
    username,
    isCognitoUser,
    email,
    shippingAddress,
    displayImage,
    dialogOpen,
  } = state;
  const size = desktop ? "medium" : "small";

  return (
    <>
      <Container>
        {isLoading ? (
          <Loading size={100} />
        ) : (
          <>
            <div className={`${classes.container} animated fadeIn`}>
              <Typography variant="h4">Profile</Typography>
              <Typography className={classes.info}>
                Here is an overview of your profile. To make changes click the &quot;Edit
                Profile&quot; button at the bottom of the page.
              </Typography>
              <Typography className={classes.heading}>Login Credentials</Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={isCognitoUser ? 12 : 6}>
                  <TextField
                    label="Username"
                    value={username.value}
                    size={size}
                    variant="outlined"
                    fullWidth
                    onChange={(e): void =>
                      setState({
                        ...state,
                        username: { value: e.target.value, error: "" },
                      })
                    }
                    disabled={!isEditing || isCognitoUser}
                  />
                </Grid>
                {!isCognitoUser && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value="************"
                      label="Password"
                      type="password"
                      variant="outlined"
                      size={size}
                      disabled
                      fullWidth
                      InputProps={{
                        endAdornment: isEditing && (
                          <InputAdornment position="end">
                            <Tooltip
                              title="Click to change password"
                              placement="left"
                              arrow
                            >
                              <LockOpen
                                onClick={(): void =>
                                  setState({
                                    ...state,
                                    dialogOpen: {
                                      ...dialogOpen,
                                      password: true,
                                    },
                                  })
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <OutlinedContainer
                    label="Display Image"
                    labelWidth={80}
                    padding={0}
                    disabled={!isEditing}
                  >
                    <ImagePicker
                      savedS3Image={displayImage}
                      profile
                      savedImage={user?.picture ?? PLACEHOLDERS.DisplayImage}
                      disabled={!isEditing}
                      setImageFile={(newDisplayImage): void => {
                        if (newDisplayImage)
                          setState({
                            ...state,
                            newDisplayImage,
                          });
                      }}
                      showPreview
                    />
                  </OutlinedContainer>
                </Grid>
                <Grid item xs={12} style={{ position: "relative" }}>
                  <Typography className={classes.heading}>Contact Preferences</Typography>
                  <TextField
                    label="Email Address"
                    helperText={email.error}
                    error={!!email.error}
                    variant="outlined"
                    size={size}
                    placeholder="Enter your email address"
                    value={email.value}
                    onChange={(e): void =>
                      setState({
                        ...state,
                        email: {
                          ...email,
                          value: e.target.value,
                          error: "",
                        },
                      })
                    }
                    disabled={!isEditing}
                    fullWidth
                  />
                  <div
                    className={classes.verifiedTag}
                    onClick={(): Promise<void> | null => {
                      if (isEditing) return handleVerifyEmail();
                      else return null;
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <ThemeProvider theme={greenAndRedTheme}>
                      <Chip
                        label={
                          userAttributes?.email_verified || isCognitoUser
                            ? "Verified"
                            : "Unverified"
                        }
                        size="small"
                        color={
                          userAttributes?.email_verified || isCognitoUser
                            ? "primary"
                            : "secondary"
                        }
                        style={{
                          cursor: isEditing ? "pointer" : "not-allowed",
                        }}
                      />
                    </ThemeProvider>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.heading}>
                    Shipping Address{" "}
                    <span className={classes.optionalText}>(optional)</span>
                  </Typography>
                  <TextField
                    label="Address Line 1"
                    variant="outlined"
                    disabled={!isEditing}
                    value={shippingAddress.line1}
                    fullWidth
                    size={size}
                    error={!!shippingAddress.error}
                    placeholder="Enter Address Line 1"
                    onChange={(e): void =>
                      setState({
                        ...state,
                        shippingAddress: {
                          ...shippingAddress,
                          line1: e.target.value,
                          error: "",
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address Line 2"
                    variant="outlined"
                    disabled={!isEditing}
                    size={size}
                    fullWidth
                    value={shippingAddress.line2}
                    onChange={(e): void =>
                      setState({
                        ...state,
                        shippingAddress: {
                          ...shippingAddress,
                          line2: e.target.value,
                          error: "",
                        },
                      })
                    }
                    placeholder="Enter Address Line 2 (optional)"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="City"
                    variant="outlined"
                    disabled={!isEditing}
                    helperText={shippingAddress.error}
                    error={!!shippingAddress.error}
                    value={shippingAddress.city}
                    size={size}
                    fullWidth
                    placeholder="Enter city"
                    onChange={(e): void =>
                      setState({
                        ...state,
                        shippingAddress: {
                          ...shippingAddress,
                          city: e.target.value,
                          error: "",
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="County"
                    variant="outlined"
                    value={shippingAddress.county}
                    error={!!shippingAddress.error}
                    disabled={!isEditing}
                    placeholder="Enter county"
                    fullWidth
                    size={size}
                    onChange={(e): void =>
                      setState({
                        ...state,
                        shippingAddress: {
                          ...shippingAddress,
                          county: e.target.value,
                          error: "",
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Post Code"
                    disabled={!isEditing}
                    value={shippingAddress.postcode}
                    variant="outlined"
                    size={size}
                    fullWidth
                    type="text"
                    placeholder="Enter post code"
                    onChange={(e): void =>
                      setState({
                        ...state,
                        shippingAddress: {
                          ...shippingAddress,
                          postcode: e.target.value,
                          error: "",
                        },
                      })
                    }
                    error={!!shippingAddress.error}
                  />
                </Grid>
              </Grid>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  className={classes.buttonBottom}
                  onClick={(): void =>
                    setState({
                      ...state,
                      isEditing: !isEditing,
                    })
                  }
                  color={!isEditing ? "primary" : "secondary"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                {isEditing && (
                  <Button
                    variant="contained"
                    className={classes.buttonBottom}
                    color="primary"
                    onClick={checkUpdateCredentials}
                  >
                    Update Profile
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Container>
      <PasswordChange
        open={dialogOpen.password}
        closeDialog={(): void =>
          setState({
            ...state,
            dialogOpen: { ...dialogOpen, password: false },
          })
        }
        user={user}
      />
      <VerificationDialog
        open={dialogOpen.email}
        closeDialog={(): void =>
          setState({
            ...state,
            dialogOpen: { ...dialogOpen, email: false },
          })
        }
        email={email}
      />
      <Dialog
        open={dialogOpen.emailConfirm}
        onClose={(): void => {
          setState({
            ...state,
            dialogOpen: { ...dialogOpen, emailConfirm: false },
          });
        }}
        color="primary"
      >
        <DialogTitle>Verify Email Address</DialogTitle>
        <DialogContent>
          <p>Do you want to verify your email address?</p>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={(): void => {
              setState({
                ...state,
                dialogOpen: { ...dialogOpen, emailConfirm: false },
              });
            }}
          >
            No
          </Button>
          <Button
            onClick={(): void => {
              setState({
                ...state,
                dialogOpen: { ...dialogOpen, emailConfirm: false },
              });
              handleVerifyEmail(false);
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;

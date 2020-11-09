import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import validate from "validate.js";
import { connect } from "react-redux";
import {
  Container,
  Grid,
  TextField,
  Select,
  FormControl,
  MenuItem,
  OutlinedInput,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputLabel,
  Chip,
  Typography,
  ThemeProvider,
  withStyles,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";
import { getUser } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import {
  ProfileProps,
  ProfileState,
  PhoneNumber,
  ProfileStateProps,
} from "../interfaces/Profile.i";
import { updateUser } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
// @ts-ignore
import awsExports from "../../../aws-exports";
import euroNumbers from "../../../utils/europeanCodes";
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
  isDesktop: window.innerWidth > 600,
};

/**
 * Class component which allows the user to view and update their profile credentials
 * including display image, contact information, username, shipping address etc.
 */
class Profile extends Component<ProfileProps, ProfileState> {
  public readonly state: ProfileState = initialState;

  public componentDidMount(): void {
    // retrieve the users data when the component mounts
    this.handleRetrieveData();

    window.addEventListener("resize", this.checkWindowDimensions);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.checkWindowDimensions);
  }

  private checkWindowDimensions = (): void => {
    if (window.innerWidth > 600) return this.setState({ isDesktop: true });
    return this.setState({ isDesktop: false });
  };

  /**
   * Method to retrieve the users data from the database using the getUser graphQL
   * query. Once the method is has run its course (data retrieved/error), loading UI
   * effects are removed with the isLoading boolean state to be set to false.
   */
  private handleRetrieveData = async (): Promise<void> => {
    try {
      const { username, sub, userAttributes } = this.props;
      // get the sub (id) of the user from the user object.
      // execute the getUser query with the sub as the id as a parameter.
      const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
      console.log(data);
      // set res to null so it can be changed if the criteria is met.
      let res: PhoneNumber | null = null;
      /**
       * if the userAttributes object has a phoneNumber in it, then use the getCountryCode
       * method to extract the number and country code into separate variables (so they can be
       * used in the component). res.value = phone number res.code = country code.
       */
      if (userAttributes?.phone_number) {
        res = this.getCountryCode(userAttributes.phone_number);
      }
      /**
       * If the userAttributes object is present and the email_verified property is false
       * then the user should be notified that their email isn't verified with an error/danger
       * snackbar.
       */
      if (userAttributes && !userAttributes.email_verified) {
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
      this.setState((prevState) => ({
        ...prevState,
        username: {
          ...prevState.username,
          value: data.getUser?.username ?? username,
        },
        email: {
          ...prevState.email,
          value: userAttributes?.email ?? "",
          verified: userAttributes?.email_verified ?? false,
        },
        phoneNumber: {
          ...prevState.phoneNumber,
          value: res?.value ?? "",
          code: res?.code ?? "+44",
          verified: userAttributes?.phone_number_verified ?? false,
        },
        displayImage: data?.getUser?.profileImage ?? null,
        shippingAddress: {
          ...prevState.shippingAddress,
          line1: data.getUser?.shippingAddress?.address_line1 ?? "",
          line2: data.getUser?.shippingAddress?.address_line2 ?? "",
          city: data.getUser?.shippingAddress?.city ?? "",
          county: data.getUser?.shippingAddress?.address_county ?? "",
          postcode: data.getUser?.shippingAddress?.address_postcode ?? "",
        },
      }));
    } catch (err) {
      /**
       * If there are any errors in retrieving or manipulating the data, then notify the user
       * with an error/danger snackbar with a relevant message.
       */
      console.error(err);
      return openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to retrieve profile information - Please try again.",
      });
    }
    // set isLoading to false so all of the loading UI effects are hidden.
    this.setState({ isLoading: false });
  };

  /**
   * Method to validate all of the profile's credentials, so that the onUpdateProfile method
   * doesn't have to handle any form of validation.
   */
  private checkUpdateCredentials = (): void => {
    // destructure all of the relevant pieces of state to be used in the method.
    const { email, phoneNumber, shippingAddress } = this.state;
    const { userAttributes } = this.props;
    // initialise the errors variable to be false, and only change it if there are any errors
    let errors = false;
    // check that the email is valid by using validate.js
    const invalidEmail = validate({ from: email.value }, { from: { email: true } });
    // if the email address is invalid, set the error variable to true and add the error to email state.
    if (invalidEmail) {
      errors = true;
      this.setState({
        email: {
          ...email,
          error: "Please enter a valid email address.",
        },
      });
    }

    const ValidPhoneNumberRegex = /^[+]?[(]?[0-9]{3}[)]?[-.]?[0-9]{3}[-.]?[0-9]{4,6}$/im;
    const validPhoneNumber = ValidPhoneNumberRegex.test(
      `${phoneNumber.code}${phoneNumber.value}`,
    );
    /**
     * if there is a value in phoneNumber.value and that value doesn't pass the regexp test (validPhoneNumber
     * is false), then set the error variable to true and set the phoneNumbers error to a valid error string.
     */
    if (phoneNumber.value.length && !validPhoneNumber) {
      errors = true;
      this.setState({
        phoneNumber: {
          ...phoneNumber,
          error: "Please enter a valid phone number.",
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
        this.setState({
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
      this.handleVerifyEmail(true);
      return;
    }
    // if the phoneNumber is not verified, then handleVerifyPhone should be called.
    if (!phoneNumber.verified && phoneNumber.value) {
      this.handleVerifyPhone();
      return;
    }
    this.onUpdateProfile();
  };

  /**
   * Method to handle the verification of an unverified email address.
   * @param {boolean} [updateProfile = false] - optional parameter to signify if the onUpdateProfile should
   * be called after the function has completed.
   */
  private handleVerifyEmail = async (updateProfile = false): Promise<void> => {
    // get user and userAttribute objects from props.
    const { user, userAttributes } = this.props;
    // retrieve email from state
    const { email } = this.state;
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
        severity: "info",
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
        this.sendVerificationCode("email");
      }
    } catch (err) {
      // if there was an error, notify the user of the error.
      openSnackbar({
        severity: "error",
        message: "Unable to update email address. Please try again.",
      });
    }
    // if updateProfile boolean is true, update the profile.
    if (updateProfile) {
      this.onUpdateProfile();
    }
  };

  /**
   * Method to verify the user's phone number
   */
  private handleVerifyPhone = async (): Promise<void> => {
    // retrieve the user object from props
    const { user } = this.props;
    // retrieve the input phone number from state
    const { phoneNumber } = this.state;
    if (!phoneNumber) return;
    // place the values that need to be updated into an object
    const updatedAttributes = {
      phone_number: `${phoneNumber.code}${phoneNumber.value}`,
    };
    // try to update the user attributes via Auth's updateUserAttributes method
    try {
      await Auth.updateUserAttributes(user, updatedAttributes);
    } catch (err) {
      // if there are any errors, notify the user.
      openSnackbar({
        severity: "error",
        message: "Unable to update phone number. Please try again.",
      });
    }
    this.onUpdateProfile();
  };

  /**
   * A method which sends a verification code to confirm that the user is the owner
   * of the selected attribute (usually email). Once the user has retrieved the code, it
   * can be entered in the modal to confirm their identity.
   * @param {"email" | "phoneNumber"} attr - The attribute that the user is trying to
   * verify - currently only using "email" as an option but others can be used further
   * down the line.
   */
  private sendVerificationCode = async (attr: string): Promise<void> => {
    const { email, dialogOpen } = this.state;
    await Auth.verifyCurrentUserAttribute(attr);
    this.setState({
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
      severity: "info",
      message: `Verification code has been sent to ${email.value}`,
    });
  };

  /**
   * Method to update the state with the user input code that they have recieved from the
   * sendVerificationCode() method.
   * @param {MouseEvent<HTMLLIElement>} e - React MouseEvent containing the data which will then be
   * set into state so it can be checked against the correct code in another method.
   */
  private handlePhoneCodeChange = (e: React.MouseEvent<HTMLLIElement>): void => {
    this.setState(
      (prevState): ProfileState => ({
        ...prevState,
        phoneNumber: {
          ...prevState.phoneNumber,
          code: (e.target as HTMLInputElement).value,
        },
      }),
    );
  };

  /**
   * Method which takes all of the user inputted data from state and updates it in the database
   * using the updateUser graphQL mutation.
   */
  private onUpdateProfile = async (): Promise<void> => {
    const { sub } = this.props;
    const { newDisplayImage, shippingAddress, dialogOpen, username, email } = this.state;
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
        const uploadedFile = await Storage.put(filename, newDisplayImage.file, {
          contentType: newDisplayImage.type,
        });
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
        severity: "success",
        message: "Profile Successfully Updated.",
      });
      // remove all loading UI effects and close all modals on completion
      this.setState({
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
        severity: "error",
        message: "Error updating profile. Please try again.",
      });
    }
  };

  /**
   * A method used for splitting the num into two parts, one with the country code (if
   * there is a valid one), and the actual phone number. i.e +447930543754 would return
   * { code: "+44", value: "7930543754" } - so it can be easily translated for the country
   * code dropdown in the component
   * @param {string} num - The original number which may or may not have a country code
   * as part of the string.
   */
  private getCountryCode = (num: string): PhoneNumber => {
    // set length to be the minimum possible amount for the country code - 2.
    let length = 2;
    // set i to be 0 so it can iterate through all possible euroNumbers.
    let i = 0;
    /**
     * if the length is 4 or higher, then there is no valid countryCode, so fall back to return
     * the final object (code is null).
     */
    while (length < 4) {
      // retrieve the substring of 0 to length.
      const code = num.substring(0, length);
      // if there is a match, return it.
      if (code === euroNumbers[i].value) {
        return {
          code,
          value: num.substring(length),
        };
      }
      // iterate through all the euroNumbers
      i++;
      /**
       * if you get to the end of the array, add one to the length of the substring,
       * reset i back to zero and try again.
       */
      if (i === euroNumbers.length) {
        length++;
        i = 0;
      }
    }
    // if there isn't a match then return the whole number in value, and set code to null.
    return {
      code: null,
      value: num,
    };
  };

  public render(): JSX.Element {
    const {
      isLoading,
      isEditing,
      username,
      email,
      phoneNumber,
      shippingAddress,
      displayImage,
      dialogOpen,
      isDesktop,
    } = this.state;
    const { user, classes, admin } = this.props;
    const size = isDesktop ? "medium" : "small";
    return (
      <>
        <Container>
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <>
              <div className={`${classes.container} animated fadeIn`}>
                <Typography variant="h4" className={classes.title}>
                  Profile
                </Typography>
                <Typography className={classes.info}>
                  Here is an overview of your profile. To make changes click the
                  &quot;Edit Profile&quot; button at the bottom of the page.
                </Typography>
                <Typography className={classes.heading}>Login Credentials</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Username"
                      value={username.value}
                      size={size}
                      variant="outlined"
                      fullWidth
                      onChange={(e): void =>
                        this.setState({
                          username: { value: e.target.value, error: "" },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      disabled
                      value="************"
                      label="Password"
                      type="password"
                      variant="outlined"
                      size={size}
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
                                  this.setState({
                                    dialogOpen: { ...dialogOpen, password: true },
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
                          if (newDisplayImage) this.setState({ newDisplayImage });
                        }}
                        showPreview
                      />
                    </OutlinedContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.heading}>
                      Contact Preferences
                    </Typography>
                    <TextField
                      label="Email Address"
                      helperText={email.error}
                      error={!!email.error}
                      variant="outlined"
                      size={size}
                      placeholder="Enter your email address"
                      value={email.value}
                      onChange={(e): void =>
                        this.setState({
                          email: {
                            ...email,
                            value: e.target.value,
                            error: "",
                          },
                        })
                      }
                      className={classes.input}
                      disabled={!isEditing}
                      fullWidth
                    />
                    <div
                      className={classes.verifiedTag}
                      onClick={(): Promise<void> | null => {
                        if (isEditing) return this.handleVerifyEmail();
                        else return null;
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <ThemeProvider theme={greenAndRedTheme}>
                        <Chip
                          label={email.verified ? "Verified" : "Unverified"}
                          size="small"
                          color={email.verified ? "primary" : "secondary"}
                          style={{ cursor: isEditing ? "pointer" : "not-allowed" }}
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
                        this.setState({
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
                        this.setState({
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
                        this.setState({
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
                        this.setState({
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
                        this.setState({
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
                    onClick={(): void => this.setState({ isEditing: !isEditing })}
                    color={!isEditing ? "primary" : "secondary"}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  {isEditing && (
                    <Button
                      variant="contained"
                      className={classes.buttonBottom}
                      color="primary"
                      onClick={this.checkUpdateCredentials}
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
            this.setState({ dialogOpen: { ...dialogOpen, password: false } })
          }
          user={user}
        />
        <VerificationDialog
          open={dialogOpen.email}
          closeDialog={(): void =>
            this.setState({ dialogOpen: { ...dialogOpen, email: false } })
          }
          email={email}
        />
        <Dialog
          open={dialogOpen.emailConfirm}
          onClose={(): void => {
            this.setState({ dialogOpen: { ...dialogOpen, emailConfirm: false } });
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
                this.setState({ dialogOpen: { ...dialogOpen, emailConfirm: false } });
              }}
            >
              No
            </Button>
            <Button
              onClick={(): void => {
                this.setState({
                  dialogOpen: { ...dialogOpen, emailConfirm: false },
                });
                this.handleVerifyEmail(false);
              }}
              color="primary"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {/* <PhoneNumberChange
          open={phoneNumber.dialogOpen}
          closeDialog={(): void => 
            this.setState({ email: { ...email, dialogOpen: false } })
          }
        /> */}
      </>
    );
  }
}

const mapStateToProps = ({ user }: AppState): ProfileStateProps => ({
  sub: user.id,
  username: user.username,
});

export default connect(mapStateToProps, null)(withStyles(styles)(Profile));

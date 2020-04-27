import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import validate from "validate.js";
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
} from "@material-ui/core";
import { Toaster } from "../../../utils/index";
import { getUser } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import { ProfileProps, ProfileState } from "../interfaces/Profile.i";
import { updateUser } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
import awsExports from "../../../aws-exports";
import euroNumbers from "../../../utils/europeanCodes";
import ImagePicker from "../../../common/ImagePicker";
import PasswordChange from "./PasswordChange";
import VerificationDialog from "./VerificationDialog";
import { greenAndRedTheme, styles } from "../../../themes";

class Profile extends Component<ProfileProps, ProfileState> {
  public readonly state: ProfileState = {
    username: null,
    email: null,
    isLoading: true,
    isEditing: false,
    newDisplayImage: null,
    dialogOpen: {
      password: false,
      email: false,
      emailConfirm: false,
      phoneNumber: false,
    },
    phoneNumber: null,
    shippingAddress: null,
    displayImage: null,
  };

  public componentDidMount(): void {
    this.handleRetrieveData();
  }

  private handleRetrieveData = async (): Promise<void> => {
    try {
      const { user, userAttributes } = this.props;
      const {
        attributes: { sub },
      } = user;
      const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));
      let res = null;
      if (userAttributes?.phone_number) {
        res = this.getCountryCode(userAttributes.phone_number);
      }
      if (userAttributes && !userAttributes.email_verified) {
        Toaster.show({
          intent: "warning",
          message: `Your email address isn't verified.
          Please click the red "Unverified" button to verify your email address.`,
        });
      }

      this.setState({
        username: {
          value: data.getUser?.username ?? user.username,
          error: "",
        },
        email: {
          value: userAttributes?.email ?? "",
          verified: userAttributes?.email_verified ?? false,
          error: "",
        },
        phoneNumber: {
          value: res?.value ?? "",
          code: res?.code ?? "+44",
          verified: userAttributes?.phone_number_verified ?? false,
          error: "",
        },
        displayImage: data.getUser.profileImage,
        shippingAddress: {
          line1: data.getUser?.shippingAddress?.address_line1 ?? "",
          line2: data.getUser?.shippingAddress?.address_line2 ?? "",
          city: data.getUser?.shippingAddress?.city ?? "",
          county: data.getUser?.shippingAddress?.address_county ?? "",
          postcode: data.getUser?.shippingAddress?.address_postcode ?? "",
          error: "",
        },
      });
    } catch (err) {
      console.error("Failed handleRetrieveData()", err);
    }
    this.setState({ isLoading: false });
  };

  private checkUpdateCredentials = (): void => {
    const { email, phoneNumber, shippingAddress } = this.state;
    const { userAttributes } = this.props;
    let errors = false;
    const invalidEmail = validate({ from: email.value }, { from: { email: true } });
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
    if (phoneNumber.value.length && !validPhoneNumber) {
      errors = true;
      this.setState({
        phoneNumber: {
          ...phoneNumber,
          error: "Please enter a valid phone number.",
        },
      });
    }
    const { line1, city, county, postcode } = shippingAddress;
    if (line1.length || city.length || county.length || postcode.length) {
      if (
        line1.length < 5 ||
        !city ||
        city.length < 4 ||
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
    if (errors) return;
    if (!email.verified || email.value !== userAttributes.email) {
      this.handleVerifyEmail(true);
      return;
    }
    if (!phoneNumber.verified && phoneNumber.value) {
      this.handleVerifyPhone();
      return;
    }
    this.onUpdateProfile();
  };

  private handleVerifyEmail = async (updateProfile = false): Promise<void> => {
    const { user, userAttributes } = this.props;
    const { email } = this.state;
    const updatedAttributes = {
      email: email.value,
    };
    if (userAttributes.email_verified && email.value === userAttributes.email) {
      Toaster.show({
        intent: "primary",
        message: `${email.value} is already verified.`,
      });
      return;
    }
    try {
      const res = await Auth.updateUserAttributes(user, updatedAttributes);
      if (res === "SUCCESS") {
        this.sendVerificationCode("email");
      }
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Unable to update email address. Please try again.",
      });
    }
    if (updateProfile) {
      this.onUpdateProfile();
    }
  };

  private handleVerifyPhone = async (): Promise<void> => {
    const { user } = this.props;
    const { phoneNumber } = this.state;
    const updatedAttributes = {
      phone_number: `${phoneNumber.code}${phoneNumber.value}`,
    };
    try {
      await Auth.updateUserAttributes(user, updatedAttributes);
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Unable to update phone number. Please try again.",
      });
    }
    this.onUpdateProfile();
  };

  private sendVerificationCode = async (attr): Promise<void> => {
    const { email, dialogOpen } = this.state;
    await Auth.verifyCurrentUserAttribute(attr);
    this.setState({
      dialogOpen: {
        ...dialogOpen,
        email: true,
      },
    });
    Toaster.show({
      intent: "primary",
      message: `Verification code has been sent to ${email.value}`,
    });
  };

  private handlePhoneCodeChange = (e: React.ChangeEvent<any>): void => {
    const { phoneNumber } = this.state;
    this.setState({
      phoneNumber: {
        ...phoneNumber,
        code: e.target.value,
      },
    });
  };

  private onUpdateProfile = async (): Promise<void> => {
    const { user } = this.props;
    const { newDisplayImage, shippingAddress, dialogOpen, username, email } = this.state;
    try {
      let file;
      if (newDisplayImage) {
        const { identityId } = await Auth.currentCredentials();
        const filename = `${identityId}/${Date.now()}/${newDisplayImage.name}`;
        const uploadedFile = await Storage.put(filename, newDisplayImage.file, {
          contentType: newDisplayImage.type,
        });
        const { key } = uploadedFile as UploadedFile;
        file = {
          key,
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_project_region,
        };
      }
      await API.graphql(
        graphqlOperation(updateUser, {
          input: {
            id: user.attributes.sub,
            profileImage: file,
            email: email.value,
            username: username.value,
            shippingAddress: shippingAddress.line1.length
              ? {
                  city: shippingAddress.city,
                  country: "United Kingdom",
                  address_line1: shippingAddress.line1,
                  address_line2: shippingAddress.line2.length
                    ? shippingAddress.line2
                    : null,
                  address_county: shippingAddress.county,
                  address_postcode: shippingAddress.postcode,
                }
              : null,
          },
        }),
      );
      Toaster.show({
        intent: "success",
        message: "Profile Successfully Updated.",
      });
      this.setState({
        dialogOpen: {
          ...dialogOpen,
          email: false,
        },
        isEditing: false,
      });
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Error updating profile. Please try again.",
      });
    }
  };

  private getCountryCode = (num: string): { code: string; value: string } => {
    let length = 2;
    let i = 0;
    while (length < 4) {
      const code = num.substring(0, length);
      if (code === euroNumbers[i].value) {
        return {
          code,
          value: num.substring(length),
        };
      }
      i++;
      if (i === euroNumbers.length) {
        length++;
        i = 0;
      }
    }
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
    } = this.state;
    const { user, classes } = this.props;
    return (
      <>
        <Container className="profile__container">
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <div className="profile__container">
              <Typography variant="h4">Profile</Typography>
              <Typography variant="subtitle1">
                Here is an overview of your profile. To make changes click the &quot;Edit
                Profile&quot; button at the bottom of the page.
              </Typography>
              <Typography variant="h6">Login Credentials</Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    value={username.value}
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
                    fullWidth
                  />
                  {isEditing && (
                    <div
                      className="profile__password-button"
                      onClick={(): void =>
                        this.setState({ dialogOpen: { ...dialogOpen, password: true } })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      Click to update your password
                    </div>
                  )}
                </Grid>
              </Grid>
              <div style={{ marginTop: "8px" }}>
                <ImagePicker
                  savedS3Image={displayImage}
                  profile
                  savedImage={
                    user?.picture ??
                    "https://www.pngkey.com/png/full/230-2301779_best-classified-apps-default-user-profile.png"
                  }
                  disabled={!isEditing}
                  setImageFile={(newDisplayImage): void =>
                    this.setState({ newDisplayImage })
                  }
                  showPreview
                  showText
                />
              </div>
              <Typography variant="h6">Contact Preferences</Typography>
              <Grid container direction="row" spacing={1} className="profile__row">
                <Grid item xs={12} md={6} style={{ position: "relative" }}>
                  <TextField
                    label="Email Address"
                    helperText={email.error}
                    error={!!email.error}
                    variant="outlined"
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
                    disabled={!isEditing}
                    fullWidth
                  />
                  <div
                    className="profile__verified-tag"
                    onClick={(): Promise<void> => isEditing && this.handleVerifyEmail()}
                    role="button"
                    tabIndex={0}
                  >
                    <ThemeProvider theme={greenAndRedTheme}>
                      <Chip
                        label={email.verified ? "Verified" : "Unverified"}
                        size="small"
                        color={email.verified ? "primary" : "secondary"}
                      />
                    </ThemeProvider>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container>
                    <Grid item xs={5} sm={4}>
                      <FormControl variant="outlined" fullWidth disabled={!isEditing}>
                        <InputLabel disabled={!isEditing}>Phone Number</InputLabel>
                        <Select
                          value={phoneNumber.code}
                          fullWidth
                          variant="outlined"
                          labelWidth={100}
                          disabled={!isEditing}
                          style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }}
                        >
                          {euroNumbers.map((num, i) => (
                            <MenuItem
                              key={i}
                              value={num.value}
                              onClick={this.handlePhoneCodeChange}
                            >
                              {num.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={7} sm={8}>
                      <OutlinedInput
                        value={phoneNumber.value}
                        onChange={(e): void =>
                          this.setState({
                            phoneNumber: {
                              ...phoneNumber,
                              value: e.target.value,
                              error: "",
                            },
                          })
                        }
                        disabled={!isEditing}
                        fullWidth
                        classes={{
                          notchedOutline: classes.noLeftBorderInput,
                        }}
                        style={{ borderLeftColor: "transparent !important" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Typography variant="h6">
                  Shipping Address{" "}
                  <span
                    style={{ color: "darkgray", fontStyle: "italic", fontSize: "14px" }}
                  >
                    (optional)
                  </span>
                </Typography>
                <Grid item xs={12}>
                  <TextField
                    label="Address Line 1"
                    variant="outlined"
                    disabled={!isEditing}
                    value={shippingAddress.line1}
                    fullWidth
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
              <div className="profile__button-container">
                <ThemeProvider theme={greenAndRedTheme}>
                  <Button
                    size="large"
                    variant="contained"
                    className={classes.buttonBottom}
                    onClick={(): void => this.setState({ isEditing: !isEditing })}
                    color={!isEditing ? "primary" : "secondary"}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  {isEditing && (
                    <Button
                      size="large"
                      variant="contained"
                      className={classes.buttonBottom}
                      color="primary"
                      onClick={this.checkUpdateCredentials}
                    >
                      Update Profile
                    </Button>
                  )}
                </ThemeProvider>
              </div>
            </div>
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

export default withStyles(styles)(Profile);

import React, { Component } from "react";
import {
  H3,
  Tag,
  Button,
  InputGroup,
  FormGroup,
  ControlGroup,
  HTMLSelect,
  Alert,
  Popover,
  Tooltip,
} from "@blueprintjs/core";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { Container, Row, Col } from "reactstrap";
import validate from "validate.js";
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

export default class Profile extends Component<ProfileProps, ProfileState> {
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
      if (userAttributes.phone_number) {
        res = this.getCountryCode(userAttributes.phone_number);
      }

      console.log("image:", data.getUser.profileImage);

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
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed handleRetrieveData()", err);
    }
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
    if (shippingAddress.line1.length) {
      if (
        shippingAddress.line1.length < 5 ||
        !shippingAddress.city ||
        shippingAddress.city.length < 4 ||
        !shippingAddress.county ||
        shippingAddress.county.length < 4 ||
        !shippingAddress.postcode
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

  private handleVerifyEmail = async (updateProfile: boolean): Promise<void> => {
    const { user } = this.props;
    const { email } = this.state;
    const updatedAttributes = {
      email: email.value,
    };
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

  private onUpdateProfile = async (): Promise<void> => {
    const { user } = this.props;
    const { newDisplayImage, shippingAddress, dialogOpen, username } = this.state;
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
    const { user, userAttributes } = this.props;
    return (
      <>
        <Container className="profile__container">
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <div className="profile__container">
              <H3>Profile</H3>
              <Row className="profile__row">
                <Col md={6}>
                  <FormGroup label="Username:" className="profile__input">
                    <InputGroup
                      className="profile__input"
                      disabled={!isEditing}
                      value={username.value}
                      onChange={(e): void =>
                        this.setState({
                          username: { value: e.target.value, error: "" },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup label="Password:" className="profile__input">
                    <InputGroup
                      className="profile__input"
                      value="********"
                      type="password"
                      disabled
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
                  </FormGroup>
                </Col>
              </Row>
              <Row className="profile__row" style={{ padding: "0 15px" }}>
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
                />
              </Row>
              <Row className="profile__row">
                <Col md={6}>
                  <FormGroup
                    label="Email:"
                    helperText={email.error}
                    intent={email.error ? "danger" : "none"}
                    labelInfo={
                      <Popover position="top" className="profile__popover">
                        <Tooltip
                          content={
                            (!email.verified || email.value !== userAttributes.email) &&
                            "Click to verify your email address"
                          }
                          position="top"
                          intent="primary"
                          className="profile__tooltip"
                        >
                          <Tag
                            className="profile__tag"
                            intent={
                              email.verified && email.value === userAttributes.email
                                ? "success"
                                : "danger"
                            }
                            onClick={(): void => {
                              if (email.verified && email.value === userAttributes.email)
                                return;
                              this.setState({
                                dialogOpen: { ...dialogOpen, emailConfirm: true },
                              });
                            }}
                          >
                            {email.verified && email.value === userAttributes.email
                              ? "Verified"
                              : "Unverified"}
                          </Tag>
                        </Tooltip>
                      </Popover>
                    }
                    className="profile__input"
                  >
                    <InputGroup
                      className="profile__input"
                      disabled={!isEditing}
                      value={email.value}
                      intent={email.error ? "danger" : "none"}
                      type="email"
                      onChange={(e): void =>
                        this.setState({
                          email: {
                            ...email,
                            value: e.target.value,
                            error: "",
                          },
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup
                    label="Phone Number:"
                    labelInfo="(optional)"
                    className="profile__input"
                    intent={phoneNumber.error ? "danger" : "none"}
                    helperText={phoneNumber.error}
                  >
                    <ControlGroup className="profile__input" fill>
                      <HTMLSelect
                        disabled={!isEditing}
                        value={phoneNumber.code}
                        options={euroNumbers}
                        onChange={(e): void =>
                          this.setState({
                            phoneNumber: { ...phoneNumber, code: e.target.value },
                          })
                        }
                      />
                      <InputGroup
                        disabled={!isEditing}
                        intent={phoneNumber.error ? "danger" : "none"}
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
                      />
                    </ControlGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="profile__row">
                <FormGroup
                  label="Shipping Address:"
                  className="profile__input"
                  labelInfo="(optional)"
                  style={{ padding: "0 15px" }}
                >
                  <InputGroup
                    className="profile__input"
                    disabled={!isEditing}
                    value={shippingAddress.line1}
                    intent={shippingAddress.error ? "danger" : "none"}
                    placeholder="Address line 1..."
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
                  <InputGroup
                    className="profile__input"
                    disabled={!isEditing}
                    value={shippingAddress.line2}
                    placeholder="Address line 2... (optional)"
                    onChange={(e): void =>
                      this.setState({
                        shippingAddress: {
                          ...shippingAddress,
                          line2: e.target.value,
                          error: "",
                        },
                      })
                    }
                  />
                  <div className="profile__inputs-container">
                    <InputGroup
                      className="profile__input--small"
                      disabled={!isEditing}
                      value={shippingAddress.city}
                      intent={shippingAddress.error ? "danger" : "none"}
                      placeholder="City..."
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
                    <InputGroup
                      className="profile__input--small"
                      disabled={!isEditing}
                      value={shippingAddress.county}
                      intent={shippingAddress.error ? "danger" : "none"}
                      placeholder="County..."
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
                    <InputGroup
                      className="profile__input--small"
                      disabled={!isEditing}
                      value={shippingAddress.postcode}
                      intent={shippingAddress.error ? "danger" : "none"}
                      placeholder="Post code..."
                      onChange={(e): void =>
                        this.setState({
                          shippingAddress: {
                            ...shippingAddress,
                            postcode: e.target.value,
                            error: "",
                          },
                        })
                      }
                    />
                  </div>
                </FormGroup>
                <span className="password__error" style={{ padding: "0 15px" }}>
                  {shippingAddress.error}
                </span>
              </Row>
              <div className="profile__button-container">
                <Button
                  text={isEditing ? "Cancel" : "Edit Profile"}
                  large
                  onClick={(): void => this.setState({ isEditing: !isEditing })}
                  intent={isEditing ? "warning" : "success"}
                  style={{ margin: "0 5px 30px" }}
                />
                {isEditing && (
                  <Button
                    text="Update Profile"
                    large
                    intent="success"
                    onClick={this.checkUpdateCredentials}
                    style={{ margin: "0 5px 30px" }}
                  />
                )}
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
        <Alert
          isOpen={dialogOpen.emailConfirm}
          onCancel={(): void => {
            this.setState({ dialogOpen: { ...dialogOpen, emailConfirm: false } });
          }}
          onConfirm={(): void => {
            this.setState({
              dialogOpen: { ...dialogOpen, emailConfirm: false },
            });
            this.handleVerifyEmail(false);
          }}
          cancelButtonText="No"
          confirmButtonText="Yes"
          intent="primary"
          icon="info-sign"
        >
          <p>Do you want to verify your email address?</p>
        </Alert>
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

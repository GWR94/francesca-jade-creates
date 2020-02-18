import React, { Component } from "react";
import {
  H3,
  Tag,
  Button,
  InputGroup,
  FormGroup,
  ControlGroup,
  HTMLSelect,
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

/**
 * TODO
 * [ ] Check auth for product in schema
 * [ ] Test admin privileges work
 * [ ] Remove admin from database if cognito admin group can be used
 */
export default class Profile extends Component<ProfileProps, ProfileState> {
  public readonly state: ProfileState = {
    username: null,
    email: null,
    isLoading: true,
    isEditing: false,
    newDisplayImage: null,
    percentUploaded: null,
    dialogOpen: {
      password: false,
      email: false,
      phoneNumber: false,
    },
    phoneNumber: null,
    shippingAddress: null,
    displayImage: null,
  };

  public async componentDidMount(): Promise<void> {
    await this.handleRetrieveData();
  }

  private handleRetrieveData = async (): Promise<void> => {
    try {
      const { user, userAttributes } = this.props;
      const { username } = this.state;
      const {
        attributes: { sub },
      } = user;
      const { data } = await API.graphql(graphqlOperation(getUser, { id: sub }));

      const res = userAttributes.phone_number
        ? this.getCountryCode(userAttributes.phone_number)
        : null;

      this.setState(
        (prevState): ProfileState => ({
          ...prevState,
          username: {
            ...username,
            value: data.getUser?.username ?? user.username,
          },
          email: {
            value: this.props.userAttributes.email,
            verified: this.props.userAttributes.email_verified,
            error: "",
          },
          phoneNumber: {
            value: res?.value ?? "",
            code: res?.code ?? "+44",
            verified: userAttributes.phone_number_verified,
            error: "",
          },
          displayImage: data.getUser?.profileImage ?? userAttributes.picture,
          shippingAddress: {
            line1: data.getUser?.shippingAddress?.address_line1 ?? "",
            line2: data.getUser?.shippingAddress?.address_line2 ?? "",
            city: data.getUser?.shippingAddress?.city ?? "",
            county: data.getUser?.shippingAddress?.address_county ?? "",
            postcode: data.getUser?.shippingAddress?.address_postcode ?? "",
            error: "",
          },
          isLoading: false,
        }),
      );
    } catch (err) {
      console.error("Error with retrieval: ", err);
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
    const validPhoneNumber = /^[+]?[(]?[0-9]{3}[)]?[-.]?[0-9]{3}[-.]?[0-9]{4,6}$/im.test(
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
      this.handleVerifyEmail();
    }
    if (!phoneNumber.verified) {
      this.handleVerifyPhone();
    } else {
      this.onUpdateProfile();
    }
  };

  private handleVerifyEmail = async (): Promise<void> => {
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
      const attr = await Auth.currentAuthenticatedUser();
      console.log(attr);
      this.onUpdateProfile();
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Unable to update email address. Please try again.",
      });
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
      await Auth.currentAuthenticatedUser();
      this.onUpdateProfile();
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Unable to update phone number. Please try again.",
      });
    }
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
    const {
      displayImage,
      newDisplayImage,
      shippingAddress,
      dialogOpen,
      username,
    } = this.state;
    try {
      if (displayImage && newDisplayImage) {
        await Storage.remove(displayImage.key);
      }
      let file;
      if (newDisplayImage) {
        const { identityId } = await Auth.currentCredentials();
        const filename = `/public/${identityId}/${Date.now()}/-${newDisplayImage.name}`;
        const uploadedFile = await Storage.put(filename, newDisplayImage.file, {
          contentType: newDisplayImage.type,
          progressCallback: (progress): void => {
            const percentUploaded = progress.loaded / progress.total;
            this.setState({ percentUploaded });
          },
        });
        const { key } = uploadedFile as UploadedFile;
        file = {
          key,
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_project_region,
        };
      }
      const input = {
        id: user.attributes.sub,
        profileImage: file,
        username: username.value,
        shippingAddress: shippingAddress.line1.length
          ? {
              city: shippingAddress.city,
              country: "United Kingdom",
              address_line1: shippingAddress.line1,
              address_line2: shippingAddress.line2.length ? shippingAddress.line2 : null,
              address_county: shippingAddress.county,
              address_postcode: shippingAddress.postcode,
            }
          : null,
      };
      console.log(input);
      await API.graphql(graphqlOperation(updateUser, { input }));
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
          <H3>Profile</H3>
          {isLoading ? (
            <Loading size={100} />
          ) : (
            <div className="profile__container">
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
              <Row className="profile__row">
                <ImagePicker
                  displayImage={displayImage}
                  userImage={userAttributes.picture || null}
                  isEditing={isEditing}
                  setImageFile={(displayImage): void => this.setState({ displayImage })}
                />
              </Row>
              <Row className="profile__row">
                <Col md={6}>
                  <FormGroup
                    label="Email:"
                    helperText={email.error}
                    intent={email.error ? "danger" : "none"}
                    labelInfo={
                      <Tag
                        className="profile__tab"
                        intent={
                          email.verified && email.value === userAttributes.email
                            ? "success"
                            : "danger"
                        }
                      >
                        {email.verified && email.value === userAttributes.email
                          ? "Verified"
                          : "Unverified"}
                      </Tag>
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
                  text={isEditing ? "Cancel" : "Edit"}
                  large
                  onClick={(): void => this.setState({ isEditing: !isEditing })}
                  intent={isEditing ? "warning" : "success"}
                  style={{ margin: "0 5px" }}
                />
                {isEditing && (
                  <Button
                    text="Update Profile"
                    large
                    intent="success"
                    onClick={this.checkUpdateCredentials}
                    style={{ margin: "0 5px" }}
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
        {dialogOpen.email && (
          <VerificationDialog
            open={dialogOpen.email}
            closeDialog={(): void =>
              this.setState({ dialogOpen: { ...dialogOpen, email: false } })
            }
            email={email}
          />
        )}
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

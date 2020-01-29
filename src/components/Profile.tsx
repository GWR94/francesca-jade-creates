import React, { Component } from "react";
import { H3, Tag } from "@blueprintjs/core";
import { Container, Row, Col } from "reactstrap";
import { UserAttributeProps } from "../interfaces/Accounts.i";
import Loading from "./Loading";

interface Props {
  userAttributes: UserAttributeProps;
  user: any;
}
interface State {}

export default class Profile extends Component<Props, State> {
  public readonly state = {};

  private userData = [
    {
      name: "Username",
      value: this.props.user.username,
    },
    {
      name: "Display Image",
      value: null,
    },
    {
      name: "Email",
      value: this.props.userAttributes.email,
      verified: this.props.userAttributes.email_verified,
    },
    {
      name: "Phone Number",
      value: this.props.userAttributes.phone_number,
      verified: this.props.userAttributes.phone_number_verified,
    },
  ];

  public render(): JSX.Element {
    return (
      <Container>
        <H3>Profile</H3>
        {this.userData.map(
          (user, i): JSX.Element =>
            user.value && (
              <Row key={i} className="profile__row">
                <Col xs={4} className="profile__title">
                  {user.name}
                </Col>
                <Col xs={8} className="profile__data">
                  {user.value}
                  {user.verified !== undefined && (
                    <Tag minimal intent={user.verified ? "success" : "danger"}>
                      {user.verified ? "Verified" : "Unverified"}
                    </Tag>
                  )}
                </Col>
              </Row>
            ),
        )}
      </Container>
    );
  }
}

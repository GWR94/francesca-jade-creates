import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { searchProducts } from "../graphql/queries";

interface Props {}
interface State {}

export default class CakesPage extends Component<Props, State> {
  public readonly state: State = {
    isLoading: true,
  };

  public componentDidMount(): void {
    this.handleGetProducts();
  }

  private handleGetProducts = async (): Promise<void> => {
    const { cakes } = this.props;
    const cakesData = await API.graphql(
      graphqlOperation(searchProducts, {
        filter: {
          type: {
            ne: "Cakes",
          },
        },
      }),
    );
    console.log(cakesData);
  };

  public render(): JSX.Element {
    return <div>Cakes</div>;
  }
}

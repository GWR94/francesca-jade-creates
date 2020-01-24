import React, { Component } from "react";
import {
  H3,
  InputGroup,
  TextArea,
  RadioGroup,
  Radio,
  Label,
  FormGroup,
  Switch,
  Callout,
  Button,
  TagInput,
} from "@blueprintjs/core";
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { PhotoPicker, S3Image } from "aws-amplify-react";
import { createProduct, updateProduct } from "../graphql/mutations";
import {
  NewProductProps,
  NewProductState,
  UploadedFile,
  ImageProps,
} from "../interfaces/NewProduct.i";
import ConfirmDialog from "./ConfirmDialog";
import { getUser } from "../graphql/queries";
import awsExports from "../aws-exports";
import { S3ObjectInput } from "../API";
import { Toaster } from "../utils/index";

const initialState: NewProductState = {
  title: "",
  description: "",
  type: "Cake",
  setPrice: false,
  productCost: "",
  shippingCost: "",
  image: null,
  imagePreview: null,
  isUploading: false,
  titleError: null,
  descriptionError: null,
  imageError: null,
  confirmDialogOpen: false,
  percentUploaded: 0,
  tags: [],
};

export default class AdminDashboard extends Component<NewProductProps, NewProductState> {
  public readonly state: NewProductState = this.props.update
    ? {
        ...initialState,
        ...this.props.product,
        image: this.props.product.image,
        setPrice: this.props.product.price > 0,
        productCost: this.props.product.price.toString(),
        shippingCost: this.props.product.shippingCost.toString(),
        tags: this.props.product.tags || [],
      }
    : initialState;

  private handleFormItem = (e, type: string): void => {
    if (type === "title") this.setState({ titleError: null });
    if (type === "description") this.setState({ descriptionError: null });
    const { value } = e.target;
    this.setState(
      (state): NewProductState => ({
        ...state,
        [type]: value,
      }),
    );
  };

  private handleTagChange = (tags): void => this.setState({ tags });

  private handleProductCheck = (): void => {
    const { title, description, image } = this.state;
    const { update } = this.props;
    let errors = false;
    if (title.length < 5) {
      errors = true;
      this.setState({
        titleError: "Please enter a longer title (Minimum 5 characters).",
      });
    }
    if (description.length <= 20) {
      errors = true;
      this.setState({
        descriptionError: "Please enter a detailed description (Minimum 20 characters).",
      });
    }
    if (!image && !update) {
      errors = true;
      this.setState({
        imageError: "Please add an image for your product",
      });
    }
    if (errors) {
      Toaster.show({
        intent: "danger",
        message: "Please fix the highlighted errors before continuing",
      });
      return;
    }
    this.setState({ confirmDialogOpen: true });
  };

  private checkAuthentication = async (): Promise<boolean> => {
    const data = await Auth.currentAuthenticatedUser();
    const user = await API.graphql(
      graphqlOperation(getUser, { id: data.attributes.sub }),
    );
    if (!user.data.getUser.admin) {
      Toaster.show({
        intent: "danger",
        message: `You do not have the correct privileges to complete this action.
          Speak to an admin if you think this is a mistake.`,
      });
      return false;
    }
    return true;
  };

  private onProductCreate = async (): Promise<void> => {
    const {
      title,
      description,
      shippingCost,
      productCost,
      setPrice,
      type,
      tags,
    } = this.state;
    const { onCancel } = this.props;
    try {
      this.setState({ isUploading: true });
      const auth = this.checkAuthentication();
      if (!auth) throw new Error("Not authenticated.");
      const image = this.state.image as ImageProps;
      const { identityId } = await Auth.currentCredentials();
      const filename = `/public/${identityId}/${Date.now()}-${image.name}`;
      const uploadedFile = await Storage.put(filename, image.file, {
        contentType: image.type,
        progressCallback: (progress): void => {
          const percentUploaded = progress.loaded / progress.total;
          this.setState({ percentUploaded });
        },
      });
      const { key } = uploadedFile as UploadedFile;
      const file: S3ObjectInput = {
        key,
        bucket: awsExports.aws_user_files_s3_bucket,
        region: awsExports.aws_project_region,
      };
      const input = {
        title,
        description,
        image: file,
        price: setPrice ? parseFloat(productCost).toFixed(2) : 0.0,
        shippingCost: setPrice ? parseFloat(shippingCost).toFixed(2) : 0.0,
        type,
        tags,
      };
      await API.graphql(graphqlOperation(createProduct, { input }));
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully added!`,
      });
      this.setState({ ...initialState });
      onCancel();
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: `Error adding ${title}.
        Please try again.`,
      });
      this.setState({ isUploading: false });
      console.error(err);
    }
  };

  private onProductUpdate = async (): Promise<void> => {
    const {
      title,
      imagePreview,
      description,
      productCost,
      shippingCost,
      setPrice,
      type,
      tags,
    } = this.state;
    const {
      product: { id, image },
      onCancel,
      product,
    } = this.props;
    try {
      const auth = this.checkAuthentication();
      if (!auth) throw new Error("Not authenticated");
      let file: S3ObjectInput = null;
      console.log(image);
      if (imagePreview) {
        const { identityId } = await Auth.currentCredentials();
        const image = this.state.image as ImageProps;
        await Storage.remove(product.image.key);
        const filename = `/public/${identityId}/${Date.now()}-${image.name}`;
        const newImage = await Storage.put(filename, image.file, {
          contentType: image.type,
          progressCallback: (progress): void => {
            const percentUploaded = progress.loaded / progress.total;
            this.setState({ percentUploaded });
          },
        });
        const { key } = newImage as UploadedFile;
        file = {
          key,
          bucket: awsExports.aws_user_files_s3_bucket,
          region: awsExports.aws_project_region,
        };
      }
      const input = {
        id,
        title,
        description,
        image: imagePreview ? file : image,
        price: setPrice ? parseFloat(productCost).toFixed(2) : 0.0,
        shippingCost: setPrice ? parseFloat(shippingCost).toFixed(2) : 0.0,
        type,
        tags,
      };
      await API.graphql(graphqlOperation(updateProduct, { input }));
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully updated!`,
      });
      this.setState({ ...initialState });
      onCancel();
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: `Error updating ${title}.
        Please try again.`,
      });
      this.setState({ isUploading: false, confirmDialogOpen: false });
      console.error(err);
    }
  };

  public render(): JSX.Element {
    const {
      title,
      description,
      type,
      setPrice,
      shippingCost,
      productCost,
      imagePreview,
      titleError,
      descriptionError,
      imageError,
      tags,
    } = this.state;
    const { update, product } = this.props;

    const clearButton = (
      <Button icon="cross" minimal onClick={(): void => this.setState({ tags: [] })} />
    );

    return (
      <>
        <div className="product__container">
          <H3>{update ? "Update Product" : "Create a Product"}</H3>
          <FormGroup
            helperText={titleError}
            label="Title:"
            intent={titleError ? "danger" : "none"}
            className="product__input"
          >
            <InputGroup
              className="product__title"
              placeholder="Enter a product title..."
              onChange={(e): void => this.handleFormItem(e, "title")}
              value={title}
              intent={titleError ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            helperText={descriptionError}
            label="Description:"
            intent={descriptionError ? "danger" : "none"}
            className="product__input"
          >
            <TextArea
              className="product__description"
              placeholder="Enter a product description..."
              onChange={(e): void => this.handleFormItem(e, "description")}
              value={description}
              rows={5}
            />
          </FormGroup>
          <div className="product__input">
            <Label style={{ marginBottom: "5px" }}>Product Type:</Label>
            <RadioGroup
              inline
              onChange={(e): void => {
                this.handleFormItem(e, "type");
              }}
              selectedValue={type}
              className="product__radio"
            >
              <Radio label="Cake" value="Cake" />
              <Radio label="Canvas" value="Canvas" />
              <Radio label="Card" value="Card" />
              <Radio label="Frame" value="Frame" />
            </RadioGroup>

            <Callout
              title="Is there a set price?"
              intent="primary"
              className="product__callout"
            >
              You can set a price if there is one set, or turn the switch off to set no
              price, where the customer can contact you for an estimated price.
              <Switch
                checked={setPrice}
                large
                className="text-center"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({ setPrice: e.target.checked })
                }
              />
            </Callout>
            {setPrice && (
              <>
                <FormGroup className="product__form" label="Pricing:">
                  <InputGroup
                    leftIcon="euro"
                    placeholder="Product price..."
                    min={0.5}
                    type="number"
                    value={productCost}
                    className="product__form-item"
                    onChange={(e): void => this.handleFormItem(e, "productCost")}
                  />
                  <InputGroup
                    leftIcon="envelope"
                    placeholder="Shipping cost..."
                    min={0.5}
                    type="number"
                    className="product__form-item"
                    value={shippingCost}
                    onChange={(e): void => this.handleFormItem(e, "shippingCost")}
                  />
                </FormGroup>
              </>
            )}
            <FormGroup label="Tags:" labelInfo="(optional)" className="product__form">
              <TagInput
                leftIcon="tag"
                onChange={this.handleTagChange}
                rightElement={clearButton}
                placeholder="Add tags by clicking enter..."
                values={tags}
              />
            </FormGroup>

            {imagePreview && (
              <img
                className="product__image-preview"
                src={imagePreview}
                alt="Product Preview"
              />
            )}
            {!imagePreview && update && (
              <S3Image
                imgKey={product.image.key}
                theme={{
                  photoImg: { width: "100%" },
                }}
              />
            )}

            <PhotoPicker
              title={imagePreview || update ? "Change Image" : "Product Image"}
              preview="hidden"
              headerHint="You can add multiple images once the product has been created."
              headerText="Add a photo of your product"
              onLoad={(url): void =>
                this.setState({ imagePreview: url, imageError: null })
              }
              onPick={(file): void => this.setState({ image: file })}
              theme={{
                formContainer: {
                  margin: 0,
                  padding: "0.8em",
                },
                formSection: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  boxShadow: imageError
                    ? "1px 1px 4px 0 rgba(240, 24, 24, 0.65)"
                    : "1px 1px 4px 0 rgba(0, 0, 0, 0.35)",
                  marginBottom: 0,
                  minWidth: "220px",
                },
                sectionBody: {
                  display: "none",
                },
                sectionHeader: {
                  padding: "0.2em",
                  color: "#fd4ef2",
                  textAlign: "center",
                },
                photoPickerButton: {
                  background: "#ff80f7",
                },
              }}
            />
            {imageError && (
              <p style={{ color: "#c23030", fontSize: "12px" }}>{imageError}</p>
            )}
          </div>

          <div>
            <Button
              text="Cancel"
              icon="cross"
              large
              intent="danger"
              onClick={(): void => {
                const { onCancel } = this.props;
                this.setState({ ...initialState });
                onCancel();
              }}
              style={{ margin: "30 4px" }}
            />
            <Button
              text={update ? "Update Product" : "Create Product"}
              icon="tick"
              large
              intent="success"
              onClick={this.handleProductCheck}
              style={{ margin: "30px 4px" }}
            />
          </div>
        </div>
        <ConfirmDialog
          {...this.state}
          product={product}
          update={update}
          onProductCreate={update ? this.onProductUpdate : this.onProductCreate}
          closeModal={(): void => this.setState({ confirmDialogOpen: false })}
        />
      </>
    );
  }
}

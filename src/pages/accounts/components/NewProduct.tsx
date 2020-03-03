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
import { createProduct } from "../../../graphql/mutations";
import {
  NewProductProps,
  NewProductState,
  UploadedFile,
  ImageProps,
} from "../interfaces/NewProduct.i";
import ConfirmDialog from "./ConfirmDialog";
import awsExports from "../../../aws-exports";
import { S3ObjectInput } from "../../../API";
import { Toaster } from "../../../utils/index";
import ImagePicker from "../../../common/ImagePicker";

const initialState: NewProductState = {
  title: {
    value: "",
    error: "",
  },
  description: {
    value: "",
    error: "",
  },
  type: "Cake",
  setPrice: false,
  productCost: "",
  shippingCost: "",
  image: {
    value: null,
    error: "",
    preview: null,
  },
  isUploading: false,
  confirmDialogOpen: false,
  percentUploaded: 0,
  tags: [],
  newImage: null,
};

export default class AdminDashboard extends Component<NewProductProps, NewProductState> {
  public readonly state: NewProductState = initialState;

  private handleFormItem = (e, type: string): void => {
    const { value } = e.target;
    this.setState(
      (prevState): NewProductState => ({
        ...prevState,
        [type]: {
          value,
          error: "",
        },
      }),
    );
  };

  private handleTagChange = (tags): void => this.setState({ tags });

  private handleProductCheck = (): void => {
    const { title, description, image, newImage } = this.state;
    const { update } = this.props;
    console.log(image);
    let errors = false;
    if (title.value.length < 5) {
      errors = true;
      this.setState({
        title: {
          ...title,
          error: "Please enter a longer title (Minimum 5 characters).",
        },
      });
    }
    if (description.value.length <= 20) {
      errors = true;
      this.setState({
        description: {
          ...description,
          error: "Please enter a detailed description (Minimum 20 characters).",
        },
      });
    }
    if (!image.value && !update && !newImage) {
      errors = true;
      this.setState({
        image: {
          ...image,
          error: "Please add an image for your product",
        },
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

  private onProductCreate = async (): Promise<void> => {
    const {
      title,
      description,
      shippingCost,
      productCost,
      setPrice,
      type,
      tags,
      image,
      newImage,
    } = this.state;
    const { onCancel, admin } = this.props;
    try {
      this.setState({ isUploading: true });
      if (!admin) {
        Toaster.show({
          intent: "danger",
          message: `You do not have the correct privileges to complete this action.
          Speak to an admin if you think this is a mistake.`,
        });
        return;
      }
      const current = (newImage || image.value) as ImageProps;
      const { identityId } = await Auth.currentCredentials();
      const filename = `/public/${identityId}/${Date.now()}-${current.name}`;
      const uploadedFile = await Storage.put(filename, current.file, {
        contentType: current.type,
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
        title: title.value,
        description: description.value,
        image: [file],
        price: setPrice ? parseFloat(productCost).toFixed(2) : 0.0,
        shippingCost: setPrice ? parseFloat(shippingCost).toFixed(2) : 0.0,
        type,
        tags: tags.length === 0 ? null : tags,
      };
      await API.graphql(graphqlOperation(createProduct, { input }));
      Toaster.show({
        intent: "success",
        message: `${title.value} has been successfully added!`,
      });
      this.setState({ ...initialState });
      onCancel();
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: `Error adding ${title.value}.
        Please try again.`,
      });
      this.setState({ isUploading: false });
    }
  };

  // private onProductUpdate = async (): Promise<void> => {
  //   const {
  //     title,
  //     description,
  //     productCost,
  //     shippingCost,
  //     setPrice,
  //     type,
  //     tags,
  //     image,
  //     newImage,
  //   } = this.state;
  //   const { product, onCancel, admin } = this.props;
  //   try {
  //     if (!admin) throw new Error("Not authenticated");
  //     console.log(image);
  //     let file: S3ObjectInput = null;
  //     if (image.preview) {
  //       const { identityId } = await Auth.currentCredentials();
  //       const image = newImage as ImageProps;
  //       const filename = `/public/${identityId}/${Date.now()}-${image.name}`;
  //       const uploadedImage = await Storage.put(filename, image.file, {
  //         contentType: image.type,
  //         progressCallback: (progress): void => {
  //           const percentUploaded = progress.loaded / progress.total;
  //           this.setState({ percentUploaded });
  //         },
  //       });
  //       const { key } = uploadedImage as UploadedFile;
  //       file = {
  //         key,
  //         bucket: awsExports.aws_user_files_s3_bucket,
  //         region: awsExports.aws_project_region,
  //       };
  //     }
  //     console.log({ file });
  //     const input = {
  //       id: product.id,
  //       title: title.value,
  //       description: description.value,
  //       image: [...product.image, image.preview && file],
  //       price: setPrice ? parseFloat(productCost).toFixed(2) : 0.0,
  //       shippingCost: setPrice ? parseFloat(shippingCost).toFixed(2) : 0.0,
  //       type,
  //       tags,
  //     };
  //     console.log(input);

  //     await API.graphql(graphqlOperation(updateProduct, { input }));
  //     Toaster.show({
  //       intent: "success",
  //       message: `${title} has been successfully updated!`,
  //     });
  //     this.setState({ ...initialState });
  //     onCancel();
  //   } catch (err) {
  //     console.error(err);
  //     Toaster.show({
  //       intent: "danger",
  //       message: `Error updating ${title}.
  //       Please try again.`,
  //     });
  //     this.setState({ isUploading: false, confirmDialogOpen: false });
  //   }
  // };

  public render(): JSX.Element {
    const {
      title,
      description,
      type,
      setPrice,
      shippingCost,
      productCost,
      image,
      tags,
      percentUploaded,
      isUploading,
      confirmDialogOpen,
    } = this.state;
    const { update, product } = this.props;

    const clearButton = (
      <Button icon="cross" minimal onClick={(): void => this.setState({ tags: [] })} />
    );

    return (
      <>
        <div className="new-product__container">
          <H3>{update ? "Update Product" : "Create a Product"}</H3>
          <FormGroup
            helperText={title.error}
            label="Title:"
            intent={title.error ? "danger" : "none"}
            className="new-product__input"
          >
            <InputGroup
              className="new-product__title"
              placeholder="Enter a product title..."
              onChange={(e): void => this.handleFormItem(e, "title")}
              value={title.value}
              intent={title.error ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            helperText={description.error}
            label="Description:"
            intent={description.error ? "danger" : "none"}
            className="new-product__input"
          >
            <TextArea
              className="new-product__description"
              intent={description.error ? "danger" : "none"}
              placeholder="Enter a product description..."
              onChange={(e): void => this.handleFormItem(e, "description")}
              value={description.value}
              rows={5}
            />
          </FormGroup>
          <div className="new-product__input">
            <Label style={{ marginBottom: "5px" }}>Product Type:</Label>
            <RadioGroup
              inline
              onChange={(e): void => {
                this.handleFormItem(e, "type");
              }}
              selectedValue={type}
              className="new-product__radio"
            >
              <Radio label="Cake" value="Cake" />
              <Radio label="Canvas" value="Canvas" />
              <Radio label="Card" value="Card" />
              <Radio label="Frame" value="Frame" />
            </RadioGroup>

            <Callout
              title="Is there a set price?"
              intent="primary"
              className="new-product__callout"
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
                <FormGroup className="new-product__form" label="Pricing:">
                  <InputGroup
                    leftIcon="euro"
                    placeholder="Product price..."
                    min={0.5}
                    type="number"
                    value={productCost}
                    className="new-product__form-item"
                    onChange={(e): void => this.handleFormItem(e, "productCost")}
                  />
                  <InputGroup
                    leftIcon="envelope"
                    placeholder="Shipping cost..."
                    min={0.5}
                    type="number"
                    className="new-product__form-item"
                    value={shippingCost}
                    onChange={(e): void => this.handleFormItem(e, "shippingCost")}
                  />
                </FormGroup>
              </>
            )}
            <FormGroup label="Tags:" labelInfo="(optional)" className="new-product__form">
              <TagInput
                leftIcon="tag"
                onChange={this.handleTagChange}
                rightElement={clearButton}
                placeholder="Add tags by clicking enter..."
                values={tags}
              />
            </FormGroup>
            <ImagePicker
              savedS3Image={product?.image[0]}
              disabled={false}
              setImageFile={(file): void =>
                this.setState({
                  newImage: file,
                })
              }
              setImagePreview={(preview): void =>
                this.setState({ image: { ...image, preview } })
              }
              showPreview
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
                  boxShadow: image.error ? "none" : "1px 1px 4px 0 rgba(0, 0, 0, 0.35)",
                  marginBottom: 0,
                  minWidth: "220px",
                  border: image.error ? "1px solid #c23030" : "none",
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
            {image.error && (
              <p style={{ color: "#c23030", fontSize: "12px" }}>{image.error}</p>
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
          title={title.value}
          description={description.value}
          type={type}
          setPrice={setPrice}
          productCost={productCost}
          shippingCost={shippingCost}
          isUploading={isUploading}
          imagePreview={image.preview}
          percentUploaded={percentUploaded}
          tags={tags}
          product={product}
          update={update}
          isOpen={confirmDialogOpen}
          onProductCreate={this.onProductCreate}
          closeModal={(): void => this.setState({ confirmDialogOpen: false })}
        />
      </>
    );
  }
}

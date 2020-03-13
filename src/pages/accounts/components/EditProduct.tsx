import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import {
  // Dialog,
  Button,
  FormGroup,
  InputGroup,
  TextArea,
  Label,
  RadioGroup,
  Radio,
  Callout,
  Switch,
  TagInput,
  H3,
} from "@blueprintjs/core";
import { Col, Row } from "reactstrap";
import Compress from "client-compress";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import ImagePicker from "../../../common/ImagePicker";
import { updateProduct, createProduct } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
import awsExports from "../../../aws-exports";
import { Toaster } from "../../../utils";
import { UpdateProps, UpdateState } from "../interfaces/EditProduct.i";
import ConfirmDialog from "./ConfirmDialog";
import ImageCarousel from "../../../common/ImageCarousel";

/**
 * TODO
 * [ ] Test
 * [ ] Create private route for sensitive pages in router
 * [ ] Add tag when clicking new radio button to change type.
 * [x] Fix create product
 * [x] Fix image not removing after clicking x
 */

export default class UpdateProduct extends Component<UpdateProps, UpdateState> {
  public readonly state: UpdateState = {
    isLoading: true,
    product: null,
    imageConfirmOpen: false,
    confirmDialogOpen: false,
    isUploading: false,
    errors: {
      title: null,
      description: null,
      tags: null,
      image: null,
    },
    percentUploaded: 0,
  };

  public async componentDidMount(): Promise<void> {
    const { update } = this.props;
    if (update) {
      const {
        match: {
          params: { id },
        },
      } = this.props;
      try {
        const { data } = await API.graphql(graphqlOperation(getProduct, { id }));
        const product = data.getProduct;
        this.setState({
          product: {
            ...product,
            setPrice: product.price > 0,
          },
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      this.setState({
        product: {
          id: null,
          title: "",
          description: "",
          image: [],
          price: 0,
          shippingCost: 0,
          type: "Cake",
          tags: [],
          setPrice: false,
        },
      });
    }
    this.setState({ isLoading: false });
  }

  private handleFormItem = (e, type: string): void => {
    const { value } = e.target;
    const { product, errors } = this.state;
    this.setState(
      (prevState): UpdateState => ({
        ...prevState,
        product: {
          ...product,
          [type]: value,
        },
        errors: {
          ...errors,
          [type]: null,
        },
      }),
    );
  };

  private handleTagChange = (tags): void => {
    const { product, errors } = this.state;
    this.setState({
      product: { ...product, tags },
      errors: { ...errors, tags: null },
    });
  };

  private handleImageCompress = (fileToUpload): Blob => {
    const compressor = new Compress({
      quality: 0.6,
      maxHeight: 720,
    });

    let image: Blob;
    compressor.compress([fileToUpload.file]).then((conversions) => {
      const { photo } = conversions[0];
      fileToUpload.file = photo.data;
      this.handleImageUpload(fileToUpload);
    });
    return image;
  };

  private handleImageUpload = async (fileToUpload): Promise<void> => {
    const { product } = this.state;
    const { update } = this.props;
    try {
      this.setState({ isUploading: true });
      const { identityId } = await Auth.currentCredentials();
      const filename = `/public/${identityId}/${Date.now()}-${fileToUpload.name}`;
      const uploadedImage = await Storage.put(filename, fileToUpload.file, {
        contentType: fileToUpload.file.type,
      });
      const { key } = uploadedImage as UploadedFile;
      const file = {
        key,
        bucket: awsExports.aws_user_files_s3_bucket,
        region: awsExports.aws_project_region,
      };

      update &&
        (await API.graphql(
          graphqlOperation(updateProduct, {
            input: {
              id: product.id,
              image: [...product.image, file],
            },
          }),
        ));
      this.setState({
        product: { ...product, image: [...product.image, file] },
        imageConfirmOpen: false,
        isUploading: false,
      });
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Unable to upload image. Please try again.",
      });
      console.error(err);
    }
  };

  private handleProductErrors = (): void => {
    const {
      product: { title, description, tags, image },
    } = this.state;

    let anyErrors = false;
    const error = {
      title: false,
      description: false,
      image: false,
      tags: false,
    };

    if (title.length < 5) {
      anyErrors = true;
      error.title = true;
    }
    if (description.length <= 20) {
      anyErrors = true;
      error.description = true;
    }
    if (!tags.length) {
      anyErrors = true;
      error.tags = true;
    }
    if (!image.length) {
      anyErrors = true;
      error.image = true;
    }
    if (anyErrors) {
      this.setState({
        errors: {
          title: error.title && "Please enter a longer title (Minimum 5 characters).",
          description:
            error.description &&
            "Please enter a detailed description (Minimum 20 characters).",
          tags: error.tags && "Please enter at least one tag for your product.",
          image: error.image && "Please add at least one image for your product.",
        },
      });
      Toaster.show({
        intent: "danger",
        message: "Please fix the highlighted errors before continuing",
      });
      return;
    }
    this.setState({ confirmDialogOpen: true });
  };

  private handleProductUpdate = async (): Promise<void> => {
    const { product } = this.state;
    const { id, title, description, price, shippingCost, type, tags, setPrice } = product;
    const { setCurrentTab } = this.props;
    this.setState({ isUploading: true });
    try {
      const input = {
        id,
        title,
        description,
        price: setPrice ? price : 0.0,
        shippingCost: setPrice ? shippingCost : 0.0,
        type,
        tags,
      };
      await API.graphql(graphqlOperation(updateProduct, { input }));
      Toaster.show({
        intent: "success",
        message: `Successfully updated ${title}.`,
      });
      this.setState({ isUploading: false, confirmDialogOpen: false });
      setCurrentTab("products");
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: `Unable to updated ${title}. Please try again.`,
      });
    }
  };

  private handleProductCreate = async (): Promise<void> => {
    const {
      product: { title, description, image, price, shippingCost, type, tags, setPrice },
    } = this.state;
    const { setCurrentTab, history } = this.props;
    this.setState({ isUploading: true });
    try {
      await API.graphql(
        graphqlOperation(createProduct, {
          input: {
            title,
            description,
            image,
            price: setPrice ? price : 0.0,
            shippingCost: setPrice ? shippingCost : 0.0,
            type,
            tags,
          },
        }),
      );
      Toaster.show({
        intent: "success",
        message: `${title} has been successfully created!`,
      });
      this.setState({ isUploading: false, confirmDialogOpen: false });
      setCurrentTab("products");
      history.push("/account");
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: `Error adding ${title}. Please try again.`,
      });
    }
  };

  public render(): JSX.Element {
    const {
      product,
      isLoading,
      // imageConfirmOpen,
      isUploading,
      errors,
      confirmDialogOpen,
      percentUploaded,
    } = this.state;
    const { history, update } = this.props;

    const clearButton = (
      <Button
        icon="cross"
        minimal
        onClick={(): void =>
          this.setState({
            product: {
              ...product,
              tags: [],
            },
          })
        }
      />
    );

    return isLoading ? (
      <Loading size={100} />
    ) : (
      <>
        <div className="new-product__container">
          <H3 className="accounts__title" style={update && { marginTop: "20px" }}>
            {update ? "Update Product" : "Create Product"}
          </H3>
          <FormGroup
            helperText={errors.title}
            label="Title:"
            intent={errors.title ? "danger" : "none"}
            className="new-product__input"
          >
            <InputGroup
              className="new-product__title"
              placeholder="Enter a product title..."
              onChange={(e): void => this.handleFormItem(e, "title")}
              value={product.title}
              intent={errors.title ? "danger" : "none"}
            />
          </FormGroup>
          <FormGroup
            helperText={errors.description}
            label="Description:"
            intent={errors.description ? "danger" : "none"}
            className="new-product__input"
          >
            <TextArea
              className="new-product__description"
              intent={errors.description ? "danger" : "none"}
              placeholder="Enter a product description..."
              onChange={(e): void => this.handleFormItem(e, "description")}
              value={product.description}
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
              selectedValue={product.type}
              className="new-product__radio"
            >
              <Radio label="Cake" value="Cake" />
              <Radio label="Creates" value="Creates" />
            </RadioGroup>

            <Callout
              title="Is there a set price?"
              intent="primary"
              className="new-product__callout"
            >
              You can set a price if there is one set, or turn the switch off to set no
              price, where the customer can contact you for an estimated price.
              <Switch
                checked={product.setPrice}
                large
                className="text-center"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({
                    product: { ...product, setPrice: e.target.checked },
                  })
                }
              />
            </Callout>
            {product.setPrice && (
              <>
                <FormGroup className="new-product__form" label="Pricing:">
                  <Row>
                    <Col sm={6}>
                      <InputGroup
                        leftIcon="euro"
                        placeholder="Product price..."
                        min={0.5}
                        type="number"
                        value={product.price.toString()}
                        className="new-product__form-item"
                        onChange={(e): void => this.handleFormItem(e, "price")}
                        style={{ marginBottom: "5px" }}
                      />
                    </Col>
                    <Col sm={6}>
                      <InputGroup
                        leftIcon="envelope"
                        placeholder="Shipping cost..."
                        min={0.5}
                        type="number"
                        className="new-product__form-item"
                        value={product.shippingCost.toString()}
                        onChange={(e): void => this.handleFormItem(e, "shippingCost")}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </>
            )}
            <FormGroup
              label="Tags:"
              className="new-product__form"
              helperText={errors.tags}
              intent={errors.tags ? "danger" : "none"}
            >
              <TagInput
                leftIcon="tag"
                onChange={this.handleTagChange}
                intent={errors.tags ? "danger" : "none"}
                rightElement={clearButton}
                placeholder="Add tags by clicking enter..."
                values={product.tags || []}
              />
            </FormGroup>
            <FormGroup
              label={product.image.length === 1 ? "Display Image:" : "Display Images:"}
              className="new-product__form"
            >
              {product.image.length > 0 && (
                <div className="update__carousel-container">
                  <ImageCarousel
                    images={product.image}
                    deleteImages
                    update={update}
                    id={product.id}
                    handleUpdateImages={(image): void =>
                      this.setState({ product: { ...product, image } })
                    }
                  />
                </div>
              )}
              {errors.image && (
                <p className="password__error text-center">{errors.image}</p>
              )}
              <ImagePicker
                disabled={false}
                setImageFile={(file): void => {
                  console.log("original:", file);
                  const image = this.handleImageCompress(file);
                  console.log(image);
                  // this.handleImageUpload(file);
                  this.setState({ errors: { ...errors, image: null } });
                }}
                update={update}
              />
              <div className="dialog__button-container" style={{ marginBottom: "40px" }}>
                <Button
                  text="Cancel"
                  onClick={(): void => history.push("/")}
                  intent="danger"
                  style={{ margin: "0 10px" }}
                  large
                />
                <Button
                  text="Confirm"
                  onClick={this.handleProductErrors}
                  intent="success"
                  style={{ margin: "0 10px" }}
                  large
                />
              </div>
            </FormGroup>
          </div>
        </div>
        {/* <Dialog
          isOpen={imageConfirmOpen}
          icon="info-sign"
          title="Are you sure this is correct?"
          onClose={(): void => this.setState({ imageConfirmOpen: false })}
        >
          <div style={{ padding: "8px 12px" }}>
            <p className="text-center">Are you sure you want to add this image?</p>
          </div>
          <img
            src={imagePreviews[imagePreviews.length - 1]}
            className="confirm__image"
            alt="Image upload preview"
            style={{ marginBottom: "20px" }}
          />
          <div className="dialog__button-container">
            <Button
              intent="danger"
              text="Cancel"
              onClick={(): void => this.setState({ imageConfirmOpen: false })}
              style={{ margin: "0 5px" }}
            />
            <Button
              intent="success"
              text="Confirm"
              onClick={this.handleImageUpload}
              style={{ margin: "0 5px" }}
              loading={isUploading}
            />
          </div>
        </Dialog> */}
        <ConfirmDialog
          isOpen={confirmDialogOpen}
          {...product}
          isUploading={isUploading}
          image={product.image}
          shippingCost={product.shippingCost.toString()}
          productCost={product.price.toString()}
          setPrice={product.setPrice}
          percentUploaded={percentUploaded}
          onProductCreate={update ? this.handleProductUpdate : this.handleProductCreate}
          closeModal={(): void => this.setState({ confirmDialogOpen: false })}
          update
        />
      </>
    );
  }
}

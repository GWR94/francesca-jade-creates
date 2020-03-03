import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators } from "reactstrap";
import { S3Image } from "aws-amplify-react";
import {
  Dialog,
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
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import ImagePicker from "../../../common/ImagePicker";
import { updateProduct } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
import awsExports from "../../../aws-exports";
import { Toaster } from "../../../utils";
import { S3ObjectInput } from "../../../API";
import { UpdateProps, UpdateState } from "../interfaces/UpdateProduct.i";
import ConfirmDialog from "./ConfirmDialog";

/**
 * TODO
 * [ ] Complete update component with uploading
 * [ ] Test
 */

export default class UpdateProduct extends Component<UpdateProps, UpdateState> {
  public readonly state: UpdateState = {
    isLoading: true,
    product: null,
    isAnimating: false,
    currentIndex: 0,
    imageConfirmOpen: false,
    confirmDialogOpen: false,
    deleteAlertOpen: false,
    imagePreview: null,
    fileToUpload: null,
    isUploading: false,
    errors: {
      title: null,
      description: null,
    },
    percentUploaded: 0,
    keyToDelete: null,
  };

  public async componentDidMount(): Promise<void> {
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
    this.setState({ isLoading: false });
  }

  private handleFormItem = (e, type: string): void => {
    const { value } = e.target;
    const { product } = this.state;
    this.setState(
      (prevState): UpdateState => ({
        ...prevState,
        product: {
          ...product,
          [type]: value,
        },
      }),
    );
  };

  private handleDeleteImage = async (): Promise<void> => {
    const {
      keyToDelete,
      product: { image, id },
      product,
    } = this.state;
    try {
      const updatedImages = image.filter((img) => img.key !== keyToDelete);
      this.setState({ product: { ...product, image: updatedImages }, currentIndex: 0 });
      await Storage.remove(keyToDelete);
      await API.graphql(
        graphqlOperation(updateProduct, { input: { id, image: updatedImages } }),
      );
      Toaster.show({
        intent: "success",
        message: "Successfully removed image.",
      });
      this.setState({ deleteAlertOpen: false });
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: "Failed to removed image. Please try again.",
      });
    }
  };

  private next = (): void => {
    const {
      isAnimating,
      currentIndex,
      product: { image },
    } = this.state;
    if (isAnimating) return;
    const nextIndex = currentIndex === image.length - 1 ? 0 : currentIndex + 1;
    this.setState({
      currentIndex: nextIndex,
    });
  };

  private previous = (): void => {
    const {
      isAnimating,
      currentIndex,
      product: { image },
    } = this.state;
    if (isAnimating) return;
    const prevIndex = currentIndex === 0 ? image.length - 1 : currentIndex - 1;
    this.setState({
      currentIndex: prevIndex,
    });
  };

  private goToIndex = (currentIndex: number): void => {
    const { isAnimating } = this.state;
    if (isAnimating) return;
    this.setState({ currentIndex });
  };

  private handleTagChange = (tags): void => {
    const { product } = this.state;
    this.setState({ product: { ...product, tags } });
  };

  private handleImageUpload = async (): Promise<void> => {
    const { product, fileToUpload } = this.state;
    try {
      this.setState({ isUploading: true });
      const { identityId } = await Auth.currentCredentials();
      const filename = `/public/${identityId}/${Date.now()}-${fileToUpload.name}`;
      const uploadedImage = await Storage.put(filename, fileToUpload.file, {
        contentType: fileToUpload.type,
      });
      const { key } = uploadedImage as UploadedFile;
      const file = {
        key,
        bucket: awsExports.aws_user_files_s3_bucket,
        region: awsExports.aws_project_region,
      };
      await API.graphql(
        graphqlOperation(updateProduct, {
          input: {
            id: product.id,
            image: [...product.image, file],
          },
        }),
      );
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
      product: { title, description },
      errors,
    } = this.state;
    let error = false;
    if (title.length < 5) {
      error = true;
      this.setState({
        errors: {
          ...errors,
          title: "Please enter a longer title (Minimum 5 characters).",
        },
      });
    }
    if (description.length <= 20) {
      error = true;
      this.setState({
        errors: {
          ...errors,
          description: "Please enter a detailed description (Minimum 20 characters).",
        },
      });
    }
    if (error) {
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
    const { id, title, description, price, shippingCost, type, tags } = product;
    const { history } = this.props;
    this.setState({ isUploading: true });
    try {
      const input = {
        id,
        title,
        description,
        price,
        shippingCost,
        type,
        tags: tags || [],
      };
      console.log(input);
      const res = await API.graphql(graphqlOperation(updateProduct, { input }));
      console.log(res);
      Toaster.show({
        intent: "success",
        message: `Successfully updated ${title}.`,
      });
      this.setState({ isUploading: false, confirmDialogOpen: false });
      history.push("/account");
    } catch (err) {
      console.error(err);
      Toaster.show({
        intent: "danger",
        message: `Unable to updated ${title}. Please try again.`,
      });
    }
  };

  public render(): JSX.Element {
    const {
      product,
      isLoading,
      currentIndex,
      imageConfirmOpen,
      imagePreview,
      isUploading,
      errors,
      confirmDialogOpen,
      percentUploaded,
      deleteAlertOpen,
      keyToDelete,
    } = this.state;
    const { history } = this.props;

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
        <div className="content-container">
          <div className="new-product__container">
            <H3 style={{ padding: "20px 0 5px" }}>Update Product</H3>
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
                    <InputGroup
                      leftIcon="euro"
                      placeholder="Product price..."
                      min={0.5}
                      type="number"
                      value={product.price.toString()}
                      className="new-product__form-item"
                      onChange={(e): void => this.handleFormItem(e, "price")}
                    />
                    <InputGroup
                      leftIcon="envelope"
                      placeholder="Shipping cost..."
                      min={0.5}
                      type="number"
                      className="new-product__form-item"
                      value={product.shippingCost.toString()}
                      onChange={(e): void => this.handleFormItem(e, "shippingCost")}
                    />
                  </FormGroup>
                </>
              )}
              <FormGroup
                label="Tags:"
                labelInfo="(optional)"
                className="new-product__form"
              >
                <TagInput
                  leftIcon="tag"
                  onChange={this.handleTagChange}
                  rightElement={clearButton}
                  placeholder="Add tags by clicking enter..."
                  values={product.tags || []}
                />
              </FormGroup>
              <FormGroup
                label={product.image.length === 1 ? "Display Image:" : "Display Images:"}
                className="new-product__form"
              >
                <div className="update__carousel-container">
                  <Carousel
                    activeIndex={currentIndex}
                    next={this.next}
                    previous={this.previous}
                  >
                    <CarouselIndicators
                      items={product.image}
                      activeIndex={currentIndex}
                      onClickHandler={this.goToIndex}
                    />
                    {product.image.map((image, i) => (
                      <CarouselItem
                        onExiting={(): void => this.setState({ isAnimating: true })}
                        onExited={(): void => this.setState({ isAnimating: false })}
                        key={i}
                      >
                        <i
                          className="fas fa-times update__delete-icon"
                          role="button"
                          tabIndex={0}
                          onClick={(): void =>
                            this.setState({
                              deleteAlertOpen: true,
                              keyToDelete: image.key,
                            })
                          }
                        />
                        <div className="update__image-container">
                          <S3Image
                            imgKey={image.key}
                            theme={{
                              photoImg: {
                                maxWidth: "100%",
                                maxHeight: "100%",
                              },
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                    <CarouselControl
                      direction="prev"
                      directionText="Previous"
                      onClickHandler={this.previous}
                    />
                    <CarouselControl
                      direction="next"
                      directionText="Next"
                      onClickHandler={this.next}
                    />
                  </Carousel>
                </div>
                <ImagePicker
                  disabled={false}
                  setImageFile={(file): void =>
                    this.setState({
                      fileToUpload: file,
                      imageConfirmOpen: true,
                    })
                  }
                  setImagePreview={(imagePreview): void =>
                    this.setState({ imagePreview })
                  }
                  update
                />
                <div
                  className="dialog__button-container"
                  style={{ marginBottom: "40px" }}
                >
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
        </div>
        <Dialog
          isOpen={deleteAlertOpen}
          icon="trash"
          onClose={(): void =>
            this.setState({ deleteAlertOpen: false, keyToDelete: null })
          }
          title="Are you sure?"
        >
          <div className="update__alert-container">
            <p className="text-center">Are you sure you want to delete this image?</p>
            <p className="text-center">Other images can be added at a later date.</p>

            <S3Image
              imgKey={keyToDelete}
              theme={{
                photoImg: { maxWidth: "100%", marginBottom: "20px" },
              }}
            />
            <div className="dialog__button-container">
              <Button
                intent="danger"
                text="Cancel"
                onClick={(): void =>
                  this.setState({ keyToDelete: null, deleteAlertOpen: false })
                }
                style={{ margin: "0 5px" }}
              />
              <Button
                intent="success"
                text="Confirm"
                onClick={this.handleDeleteImage}
                style={{ margin: "0 5px" }}
              />
            </div>
          </div>
        </Dialog>
        <Dialog
          isOpen={imageConfirmOpen}
          icon="info-sign"
          title="Are you sure this is correct?"
          onClose={(): void => this.setState({ imageConfirmOpen: false })}
        >
          <div style={{ padding: "8px 12px" }}>
            <p className="text-center">Are you sure you want to add this image?</p>
          </div>
          <img
            src={imagePreview}
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
        </Dialog>
        <ConfirmDialog
          isOpen={confirmDialogOpen}
          {...product}
          isUploading={isUploading}
          image={product.image}
          shippingCost={product.shippingCost.toString()}
          productCost={product.price.toString()}
          setPrice={product.setPrice}
          percentUploaded={percentUploaded}
          onProductCreate={this.handleProductUpdate}
          closeModal={(): void => this.setState({ confirmDialogOpen: false })}
          update
        />
      </>
    );
  }
}

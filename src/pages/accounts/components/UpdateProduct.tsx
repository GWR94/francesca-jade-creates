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
} from "@blueprintjs/core";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import { ProductProps } from "../../../common/interfaces/Product.i";
import ImagePicker from "../../../common/ImagePicker";
import { updateProduct } from "../../../graphql/mutations";
import { UploadedFile, ImageProps } from "../interfaces/NewProduct.i";
import awsExports from "../../../aws-exports";
import { Toaster } from "../../../utils";
import { S3ObjectInput } from "../../../API";

/**
 * TODO
 * [ ] Complete update component with uploading
 * [ ] Test
 */

interface UpdateProps {
  match: {
    params: {
      id: string;
    };
  };
}
interface UpdateState {
  isLoading: boolean;
  product: ProductProps;
  isAnimating: boolean;
  currentIndex: number;
  confirmDialogOpen: boolean;
  imagePreview: string;
  fileToUpload: ImageProps;
  isUploading: boolean;
  errors: {
    title: boolean;
    description: boolean;
  };
}

export default class UpdateProduct extends Component<UpdateProps, UpdateState> {
  public readonly state: UpdateState = {
    isLoading: true,
    product: null,
    isAnimating: false,
    currentIndex: 0,
    confirmDialogOpen: false,
    imagePreview: null,
    fileToUpload: null,
    isUploading: false,
    errors: {
      title: false,
      description: false,
    },
  };

  private slides;

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
      this.handleSlideUpdate(product.image);
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
    console.log(this.state.product);
  };

  private handleSlideUpdate = (images: S3ObjectInput[]): void => {
    this.slides = images.map((image, i) => {
      return (
        <CarouselItem
          onExiting={(): void => this.setState({ isAnimating: true })}
          onExited={(): void => this.setState({ isAnimating: false })}
          key={i}
        >
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
      );
    });
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
            image: file,
          },
        }),
      );
      this.setState({
        product: { ...product, image: [...product.image, file] },
        confirmDialogOpen: false,
        isUploading: false,
      });
      this.handleSlideUpdate([...product.image, file]);
    } catch (err) {
      Toaster.show({
        intent: "danger",
        message: "Unable to upload image. Please try again.",
      });
      console.error(err);
    }
  };

  public render(): JSX.Element {
    const {
      product,
      isLoading,
      currentIndex,
      confirmDialogOpen,
      imagePreview,
      isUploading,
      errors,
    } = this.state;

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
          <div className="update__container">
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
                  checked={product.price > 0}
                  large
                  className="text-center"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({ setPrice: e.target.checked })
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
                      onChange={(e): void => this.handleFormItem(e, "productCost")}
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
                  values={product.tags}
                />
              </FormGroup>

              {product?.image.length && (
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
                    {this.slides}
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
              )}
              <ImagePicker
                disabled={false}
                setImageFile={(file): void =>
                  this.setState({
                    fileToUpload: file,
                    confirmDialogOpen: true,
                  })
                }
                setImagePreview={(imagePreview): void => this.setState({ imagePreview })}
                update
              />
            </div>
            <Dialog
              isOpen={confirmDialogOpen}
              icon="info-sign"
              title="Are you sure this is correct?"
              onClose={(): void => this.setState({ confirmDialogOpen: false })}
            >
              <div style={{ padding: "8px 12px" }}>
                <p className="text-center">Are you sure you want to add this image?</p>
                <p className="text-center">
                  This action cannot be undone in this version of the site.
                </p>
              </div>
              <img
                src={imagePreview}
                className="confirm__image"
                alt="Image upload preview"
              />
              <div className="dialog__button-container">
                <Button
                  intent="danger"
                  text="Cancel"
                  onClick={(): void => this.setState({ confirmDialogOpen: false })}
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
          </div>
        </div>
      </>
    );
  }
}

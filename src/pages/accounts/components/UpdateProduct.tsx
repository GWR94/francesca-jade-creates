import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import ChipInput from "material-ui-chip-input";
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { Alert, AlertTitle } from "@material-ui/lab";
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
 *![ ] Fix tag input
 *![ ] Fix scrollbar on delete confirm dialog
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
    console.log(fileToUpload);
    const compressor = new Compress({
      targetSize: 0.5,
    });

    let image: Blob;
    compressor.compress([fileToUpload]).then((conversions) => {
      const { photo } = conversions[0];
      fileToUpload.file = photo.data;
      console.log(photo, fileToUpload);
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
      invalidTitle: false,
      description: false,
      image: false,
      tags: false,
    };

    if (title.length < 5) {
      anyErrors = true;
      error.title = true;
    }
    if (title.length > 20 && !title.includes(" ")) {
      anyErrors = true;
      error.invalidTitle = true;
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
          title:
            (error.invalidTitle && "Please don't add excessively long words to title") ||
            (error.title && "Please enter a valid title (Minimum 5 characters)."),
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

    return isLoading ? (
      <Loading size={100} />
    ) : (
      <>
        <div className="new-product__container">
          <h3 className="accounts__title" style={update && { marginTop: "20px" }}>
            {update ? "Update Product" : "Create Product"}
          </h3>
          <TextField
            variant="outlined"
            value={product.title}
            onChange={(e): void => this.handleFormItem(e, "title")}
            error={!!errors.title}
            helperText={errors.title}
            label="Title"
            fullWidth
            placeholder="Enter a product title"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            variant="outlined"
            value={product.description}
            onChange={(e): void => this.handleFormItem(e, "description")}
            error={!!errors.description}
            helperText={errors.description}
            label="Description"
            fullWidth
            multiline
            placeholder="Enter a product description"
            style={{ marginBottom: "10px" }}
          />
          <FormControl component="fieldset" className="new-product__radio-container">
            <FormLabel component="legend" style={{ margin: 0 }}>
              Product Type
            </FormLabel>
            <RadioGroup
              aria-label="Product Type"
              name="ProductType"
              value={product.type}
              onChange={(e): void => this.handleFormItem(e, "type")}
              row
              style={{ justifyContent: "space-around" }}
            >
              <FormControlLabel value="Cake" control={<Radio />} label="Cake" />
              <FormControlLabel value="Creates" control={<Radio />} label="Creates" />
            </RadioGroup>
          </FormControl>
          <Alert
            severity="info"
            className="new-product__callout"
            style={{ marginTop: "-5px" }}
          >
            <AlertTitle>Is there a set price?</AlertTitle>
            You can set a price if there is one set, or turn the switch off to set no
            price, where the customer can contact you for an estimated price.
            <Switch
              checked={product.setPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                this.setState({
                  product: { ...product, setPrice: e.target.checked },
                })
              }
              color="primary"
              name="setPrice"
              inputProps={{ "aria-label": "primary checkbox" }}
              className="new-product__switch"
            />
          </Alert>
          {product.setPrice && (
            <>
              <Grid
                container
                direction="row"
                spacing={1}
                style={{ marginBottom: "10px" }}
              >
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Product Cost
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      value={product.price}
                      onChange={(e): void => this.handleFormItem(e, "price")}
                      startAdornment={<InputAdornment position="start">£</InputAdornment>}
                      labelWidth={90}
                    />
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Shipping Cost
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-shipping"
                      value={product.shippingCost}
                      onChange={(e): void => this.handleFormItem(e, "shippingCost")}
                      startAdornment={<InputAdornment position="start">£</InputAdornment>}
                      labelWidth={95}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
          <ChipInput
            value={product.tags || []}
            fullWidth
            variant="outlined"
            label="Tags"
            placeholder="Add tags by clicking enter..."
            onAdd={(chip): void =>
              this.setState({ product: { ...product, tags: [...product.tags, chip] } })
            }
            onDelete={(chip): void => {
              const idx = product.tags.findIndex(chip);
              const newTags = [
                ...product.tags.slice(0, idx),
                ...product.tags.slice(idx + 1),
              ];
              this.setState({
                product: { ...product, tags: newTags },
              });
            }}
          />
          <div className="new-product__form" style={{ marginTop: "10px" }}>
            <FormLabel component="legend" style={{ margin: 0 }}>
              {product.image.length <= 1 ? "Product Image:" : "Product Images:"}
            </FormLabel>
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
              setImageFile={(file): void => {
                this.handleImageCompress(file);
                this.setState({ errors: { ...errors, image: null } });
              }}
              update={update}
            />
          </div>
          <div className="dialog__button-container" style={{ marginBottom: "40px" }}>
            <ThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: green,
                },
              })}
            >
              <Button
                onClick={(): void => history.push("/")}
                style={{ margin: "0 10px" }}
                size="large"
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleProductErrors}
                color="primary"
                variant="contained"
                style={{ margin: "0 10px", color: "#fff" }}
                size="large"
              >
                Confirm
              </Button>
            </ThemeProvider>
          </div>
        </div>
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

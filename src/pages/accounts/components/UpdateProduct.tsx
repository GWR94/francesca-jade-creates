import React, { Component } from "react";
import { API, graphqlOperation, Auth, Storage } from "aws-amplify";
import ChipInput from "material-ui-chip-input";
import {
  TextField,
  FormControl,
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
  Typography,
  withStyles,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { Alert, AlertTitle } from "@material-ui/lab";
import Compress from "client-compress";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import ImagePicker from "../../../common/containers/ImagePicker";
import { updateProduct, createProduct } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
// @ts-ignore
import awsExports from "../../../aws-exports";
import { openSnackbar } from "../../../utils/Notifier";
import { UpdateProps, UpdateState, FileToUpload } from "../interfaces/EditProduct.i";
import ConfirmDialog from "../../../common/alerts/ConfirmDialog";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import OutlinedContainer from "../../../common/containers/OutlinedContainer";
import styles from "../styles/updateProduct.style";
import { defaultStyles } from "../../../themes/index";

/**
 * TODO
 *![ ] Fix scrollbar on delete confirm dialog
 * [ ] Test
 * [ ] Put tags in center of input
 * [ ] Add tag when clicking new radio button to change type.
 * [x] Fix colors for chips
 */

class UpdateProduct extends Component<UpdateProps, UpdateState> {
  public readonly state: UpdateState = {
    isLoading: true,
    product: {
      id: "",
      title: "",
      description: "",
      image: [],
      price: 0,
      shippingCost: 0,
      tagline: "",
      type: "Cake",
      tags: [],
      setPrice: false,
      customisedOptions: {
        images: 0,
        text: 0,
        colorScheme: false,
      },
    },
    imageConfirmOpen: false,
    confirmDialogOpen: false,
    isUploading: false,
    errors: {
      title: null,
      description: null,
      tags: null,
      image: null,
      tagline: null,
    },
    percentUploaded: 0,
    customOptions: false,
  };

  public async componentDidMount(): Promise<void> {
    const { update } = this.props;
    /**
     * If the update prop is true, get all of the product's data from the database,
     * and set it into state so it can be edited by the user.
     */
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
            tagline: product.tagline || "",
            customisedOptions: product?.customisedOptions ?? {
              images: 0,
              text: 0,
              colorTheme: null,
            },
          },
        });
        const { customisedOptions } = product;
        /**
         * If any of the customisable options are truthy then set customOptions to be
         * true so they can be edited in the product editor.
         */
        if (
          customisedOptions?.images > 0 ||
          customisedOptions?.text > 0 ||
          customisedOptions?.colorTheme
        ) {
          this.setState({ customOptions: true });
        }
      } catch (err) {
        console.error(err); //FIXME
      }
    }
    /**
     * Set isLoading to true, as the rest of the component can be rendered with the correct
     * data.
     */
    this.setState({ isLoading: false });
  }

  /**
   * A function which sets the value from the "e" parameter into the products' state named
   * as the type value.
   * @param {React.ChangeEvent} e - React ChangeEvent holding the user inputted data to be
   * set into state.
   * @param {string} type - The name of the state which is going to be updated with the value
   * from the e parameter.
   */
  private handleFormItem = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
  ): void => {
    const { value } = e.target;
    const { product, errors } = this.state;
    this.setState(
      (prevState): UpdateState => ({
        ...prevState,
        /**
         * Set the value to be intended target
         */
        product: {
          ...product,
          [type]: value,
        },
        errors: {
          /**
           * Set any previous errors from the type to be null, as they will potentially have
           * now been updated to the "correct" state. If not, the errors will be triggered again
           * later.
           */
          ...errors,
          [type]: null,
        },
      }),
    );
  };

  /**
   * A function which compressed the input image to a preferred size if necessary.
   * @param {File} fileToUpload: The image which the user wishes to compress.
   */
  private handleImageCompress = (blobToUpload: File): void => {
    console.log(blobToUpload);
    const compressor = new Compress({
      targetSize: 0.5, // target size in MB
    });
    // ! If errors compressing -> Remove try catch !! CHECK !!
    try {
      compressor
        .compress([blobToUpload])
        .then((conversions: { photo: { data: File } }[]) => {
          /**
           * Compress the image via the compressor, then set the fileToUpload.file
           * to be the compressed file (photo.data);
           */
          const { photo } = conversions[0];
          const fileToUpload: FileToUpload = blobToUpload;
          fileToUpload.file = photo.data;
          console.log(photo.data, "Data");
          console.log(fileToUpload);
          /**
           * If everything else was successful, then attempt to upload it to S3 with
           * the handleImageUpload function.
           */
          return this.handleImageUpload(fileToUpload);
        });
    } catch (err) {
      // console log errors -> Should be removed before production // FIXME
      console.error(err);
    }
  };

  /**
   * Function to upload a compressed image into the cloud (S3).
   * @param {File} fileToUpload - The compressed image to upload to S3 (Usually
   * returned file from handleImageCompress function.)
   */
  private handleImageUpload = async (fileToUpload: FileToUpload): Promise<void> => {
    console.log("fileTOUpload", fileToUpload);
    const { product } = this.state;
    const { update } = this.props;
    try {
      /**
       * Set isUploading to true so the UI can show loading spinners on buttons etc.
       */
      this.setState({ isUploading: true });
      /**
       * Get the identityId from the current auth user, and create the filename from
       * all of the relevant parts of data.
       */
      const { identityId } = await Auth.currentCredentials();
      const filename = `/public/${identityId}/${Date.now()}-${fileToUpload.name}`;
      /**
       * Create uploadedImage file using AWS's Storage API, which puts the selected
       * image into the cloud (S3).
       */
      let uploadedImage;
      if (fileToUpload.file) {
        uploadedImage = await Storage.put(filename, fileToUpload.file, {
          contentType: fileToUpload?.file.type,
        });
      }
      /**
       * Retrieve the key from uploadedImage, as it will be used as a reference for
       * the created product to retrieve the image from - so therefore place in the
       * product which is being created/updated.
       */
      const { key } = uploadedImage as UploadedFile;
      const file = {
        key,
        bucket: awsExports.aws_user_files_s3_bucket,
        region: awsExports.aws_project_region,
      };
      /**
       * If the update prop is true, then update that product with the new S3Image data
       * (file).
       */
      update &&
        (await API.graphql(
          graphqlOperation(updateProduct, {
            input: {
              id: product.id,
              image: [...product.image, file],
            },
          }),
        ));
      /**
       * Set the current products image data into state by merging old photos (if any) with
       * the new image. Also close image dialog and set isUploading to false as these operations
       * should be completed by now.
       */
      this.setState({
        product: { ...product, image: [...product.image, file] },
        imageConfirmOpen: false,
        isUploading: false,
      });
    } catch (err) {
      /**
       * If there is an error, visualise it to the user by using the snackbar alert system.
       */
      openSnackbar({
        severity: "error",
        message: "Unable to upload image. Please try again.",
      });
      console.error(err);
    }
  };

  /**
   * Function which checks all the input fields have the correct data, and if not it
   * will show the user where there are errors in the UI.
   */
  private handleProductErrors = (): void => {
    const {
      product: { title, description, tags, image, tagline },
    } = this.state;

    // set errors for each field to be false, so they can be tracked if there are changes.
    const error: { [key: string]: string } = {
      title: "",
      invalidTitle: "",
      description: "",
      image: "",
      tags: "",
      tagline: "",
    };

    if (title.length < 5) {
      // set title error if the title is less than 5 characters.
      error.title = "Please enter a valid title (Minimum 5 characters).";
    }
    if (title.length > 15 && !title.includes(" ")) {
      // set title error if the title is under 20 characters without a space.
      error.title = "Please don't add excessively long words to title";
    }
    if (title.length > 25) {
      // if the title is longer than 25 characters, set title error to true
      error.title = "Please add a smaller title (25 chars max)";
    }
    if (description.length <= 20) {
      // if the description is less than 20 characters set description error to true.
      error.description = "Please enter a detailed description (Minimum 20 characters).";
    }
    if (tags.length <= 0) {
      // if there are no tags, set the tag error to true.
      error.tags = "Please enter at least one tag for your product.";
    }
    if (tags.length > 5) {
      // if there are more than 5 tags, set tag error to true.
      error.tags = "Please enter a maximum of 5 tags.";
    }
    if (!image.length) {
      // if there is no image set the image error to true.
      error.image = "Please enter at least one image for your product.";
    }
    if (tagline && tagline.length <= 0) {
      // if there is no tagline, set tagline error to true.
      error.tagline = "Please enter a tagline - 50 characters max.";
    }

    /**
     * If any of the errors in the errors object are true, then update the
     * state to show any errors in the UI.
     */
    if (Object.values(error).some((val) => val.length > 0)) {
      const { title, description, tags, image, tagline } = error;
      this.setState({
        errors: {
          title,
          description,
          tags,
          image,
          tagline,
        },
      });
      /**
       * Open the snackbar error component if there are any errors, notifying the
       * user that there are errors and how to fix them.
       */
      openSnackbar({
        severity: "error",
        message: "Please fix the highlighted errors before continuing",
      });
      return;
    }
    /**
     * If there are no errors then open the confirm dialog which will ask the user
     * to check the product details before confirming it and saving it to the database.
     */
    this.setState({ confirmDialogOpen: true });
  };

  /**
   * Function which stores the updated product into the database. All fields
   * should already be validated from the handleProductErrors function, so no validation
   * is needed.
   */
  private handleProductUpdate = async (): Promise<void> => {
    // destructure product and its values so they can be used in the graphQL input.
    const { product } = this.state;
    const {
      id,
      title,
      description,
      price,
      shippingCost,
      type,
      tags,
      setPrice,
      tagline,
    } = product;
    const { setCurrentTab, history } = this.props;
    // set uploading to true so loading spinners and ui changes will show to user.
    this.setState({ isUploading: true });
    try {
      /**
       * add all of the products values to the input variable for use in the updateProduct
       * graphql mutation
       */
      await API.graphql(
        graphqlOperation(updateProduct, {
          input: {
            id,
            title,
            description,
            price: setPrice ? price : 0.0,
            shippingCost: setPrice ? shippingCost : 0.0,
            tagline,
            type,
            tags,
          },
        }),
      );
      /**
       * Open the success snackbar to notify the user that the product has been
       * successfully updated
       */
      openSnackbar({
        severity: "success",
        message: `Successfully updated ${title}.`,
      });
      // set isUploading to stop loading UI effects, and close the confirm dialog.
      this.setState({ isUploading: false, confirmDialogOpen: false });
      /**
       * Set accounts tab to be products, so it goes to the correct tab when using
       * history to push back to the accounts page.
       */
      setCurrentTab("products");
      history.push("/account");
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with an error snackbar.
      openSnackbar({
        severity: "error",
        message: `Unable to updated ${title}. Please try again.`,
      });
    }
  };

  /**
   * Function to add a newly created product into the database.
   */
  private handleProductCreate = async (): Promise<void> => {
    // destructure product and all of its properties for use in the graphql operation
    const {
      product: {
        title,
        description,
        image,
        price,
        shippingCost,
        type,
        tags,
        setPrice,
        tagline,
      },
    } = this.state;
    const { setCurrentTab, history } = this.props;
    this.setState({ isUploading: true });
    try {
      const input = {
        title,
        description,
        image,
        price: setPrice ? price : 0.0,
        tagline,
        shippingCost: setPrice ? shippingCost : 0.0,
        type,
        tags,
      };
      console.log(input);
      await API.graphql(
        /**
         * add all of the products values to the input variable for use in the createProduct
         * graphql mutation
         */
        graphqlOperation(createProduct, {
          input,
        }),
      );
      // If successful then show this to the user by showing the success snackbar.
      openSnackbar({
        severity: "success",
        message: `${title} has been successfully created!`,
      });
      // set isUploading to false to stop loading ui effects, and close confirm dialog
      this.setState({ isUploading: false, confirmDialogOpen: false });
      /**
       * Set accounts tab to be products, so it goes to the correct tab when using
       * history to push back to the accounts page.
       */
      setCurrentTab("products");
      history.push("/account");
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with an error snackbar.
      openSnackbar({
        severity: "error",
        message: `Error adding ${title}. Please try again.`,
      });
    }
  };

  public render(): JSX.Element {
    const {
      isLoading,
      product,
      // imageConfirmOpen,
      isUploading,
      errors,
      confirmDialogOpen,
      percentUploaded,
      customOptions,
    } = this.state;
    const { history, update, classes } = this.props;

    return isLoading ? (
      <Loading size={100} />
    ) : (
      <>
        <div className={classes.mainContainer}>
          <Typography variant="h4" style={{ marginTop: update ? 20 : 0 }}>
            {update ? "Update Product" : "Create Product"}
          </Typography>
          {!update && (
            <Typography variant="subtitle1">
              Create your product by filling out all of the fields. Products can be
              changed and/or deleted at a later stage.
            </Typography>
          )}
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
            value={product.tagline}
            onChange={(e): void => this.handleFormItem(e, "tagline")}
            error={!!errors.tagline}
            helperText={errors.tagline}
            label="Tag line"
            fullWidth
            placeholder="Enter a brief tagline for the product"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            variant="outlined"
            value={product.description}
            rows={3}
            rowsMax={5}
            onChange={(e): void => this.handleFormItem(e, "description")}
            error={!!errors.description}
            helperText={errors.description}
            label="Description"
            fullWidth
            multiline
            placeholder="Enter a product description"
          />
          <OutlinedContainer label="Product Type" labelWidth={78} padding={10}>
            <RadioGroup
              aria-label="Product Type"
              name="ProductType"
              value={product.type}
              onChange={(e): void => this.handleFormItem(e, "type")}
              row
              style={{ justifyContent: "space-around", margin: 0 }}
            >
              <FormControlLabel
                value="Cake"
                classes={{
                  root: classes.root,
                }}
                control={<Radio />}
                label="Cake"
              />
              <FormControlLabel
                value="Creates"
                classes={{ root: classes.root }}
                control={<Radio />}
                label="Creates"
              />
            </RadioGroup>
          </OutlinedContainer>
          <Alert
            severity="info"
            className={classes.callout}
            style={{ margin: "0 0 10px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AlertTitle style={{ fontSize: "18px" }}>Is there a set price?</AlertTitle>
              <Typography variant="body1">
                To set a price for the product, turn the switch on and input the price and
                shipping cost in the inputs below. To set a variable price where the
                customer requests a quote based on their preferences, leave the switch
                off.
              </Typography>
            </div>
            <div className={classes.switch}>
              <Switch
                checked={product.setPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({
                    product: { ...product, setPrice: e.target.checked },
                  })
                }
                style={{ display: "flex", justifyContent: "center" }}
                color="primary"
                name="setPrice"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
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
          <OutlinedContainer
            label={product.image.length <= 1 ? "Product Image" : "Product Images"}
            labelWidth={product.image.length <= 1 ? 84 : 90}
            padding={12}
            error={!!errors.image}
          >
            {product.image.length > 0 && (
              <div className={classes.carouselContainer}>
                <ImageCarousel
                  images={product.image}
                  deleteImages
                  update={update}
                  id={product.id}
                  type={product.type}
                  handleUpdateImages={(image): void =>
                    this.setState({ product: { ...product, image } })
                  }
                />
              </div>
            )}
            <ImagePicker
              setImageFile={(file): void => {
                console.log(file);
                this.handleImageCompress(file);
                this.setState({ errors: { ...errors, image: null } });
              }}
              cropImage
              update={update}
              type={product.type}
            />
          </OutlinedContainer>
          {errors.image && <p className={classes.errorText}>{errors.image}</p>}
          <ChipInput
            value={product.tags || []}
            fullWidth
            variant="outlined"
            label="Tags"
            classes={{
              inputRoot: classes.chipInput,
              // label: classes.chipLabel,
              chip: product.type === "Cake" ? classes.chipCake : classes.chipCreates,
            }}
            error={!!errors.tags}
            helperText={errors.tags}
            placeholder="Add up to 5 tags - confirm by clicking enter..."
            onAdd={(chip): void => {
              this.setState(
                (prevState): UpdateState => {
                  if (prevState.product.tags.length < 5) {
                    return {
                      ...prevState,
                      product: {
                        ...prevState.product,
                        tags: [...prevState.product.tags, chip],
                      },
                      errors: { ...errors, tags: null },
                    };
                  } else {
                    openSnackbar({
                      severity: "error",
                      message: `Please only add up to 5 tags.`,
                    });
                    return prevState;
                  }
                },
              );
            }}
            onDelete={(chip): void => {
              const idx = product.tags.findIndex((name) => name === chip);
              const newTags = [
                ...product.tags.slice(0, idx),
                ...product.tags.slice(idx + 1),
              ];
              this.setState({
                product: { ...product, tags: newTags },
                errors: { ...errors, tags: null },
              });
            }}
            style={{ paddingBottom: 6, marginBottom: 14 }}
          />
          <Alert
            severity="warning"
            className={classes.callout}
            style={{ marginBottom: 10 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AlertTitle style={{ fontSize: "18px" }}>
                Are the customisable options?
              </AlertTitle>
              <Typography variant="body1">
                If there are any customisable options, please turn on the switch and input
                the maximum amount of customisable options for the product.
              </Typography>
            </div>
            <div className={classes.switch}>
              <Switch
                checked={customOptions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  this.setState({
                    customOptions: e.target.checked,
                  })
                }
                style={{ display: "flex", justifyContent: "center" }}
                color="secondary"
                name="customisedOptions"
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </Alert>
          {customOptions && (
            <OutlinedContainer label="Customisable Options" labelWidth={120} padding={8}>
              <div className={classes.customisableContainer}>
                <Typography>Images</Typography>
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <i
                    className={`fas fa-minus ${classes.icon}`}
                    onClick={(): void => {
                      const {
                        customisedOptions: { images },
                      } = product;
                      if (images >= 1) {
                        this.setState((prevState) => ({
                          product: {
                            ...prevState.product,
                            customisedOptions: {
                              ...prevState.product.customisedOptions,
                              images: images - 1,
                            },
                          },
                        }));
                      }
                    }}
                    style={{
                      cursor:
                        product.customisedOptions.text >= 1 ? "pointer" : "not-allowed",
                    }}
                    role="button"
                    tabIndex={0}
                  />
                  <Typography className={classes.customNumber}>
                    {product.customisedOptions.images}
                  </Typography>
                  <i
                    className={`fas fa-plus ${classes.icon}`}
                    onClick={(): void => {
                      const {
                        customisedOptions: { images },
                      } = product;
                      if (images <= 9) {
                        this.setState((prevState) => ({
                          ...prevState,
                          product: {
                            ...prevState.product,
                            customisedOptions: {
                              ...prevState.product.customisedOptions,
                              images: images + 1,
                            },
                          },
                        }));
                      }
                    }}
                    style={{
                      cursor:
                        product.customisedOptions.images <= 9 ? "pointer" : "not-allowed",
                    }}
                    role="button"
                    tabIndex={0}
                  />
                </div>
              </div>
              <div className={classes.customisableContainer}>
                <Typography>Text</Typography>
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <i
                    className={`fas fa-minus ${classes.icon}`}
                    onClick={(): void => {
                      const {
                        customisedOptions: { text },
                      } = product;
                      if (text >= 1) {
                        this.setState((prevState) => ({
                          product: {
                            ...prevState.product,
                            customisedOptions: {
                              ...prevState.product.customisedOptions,
                              text: text - 1,
                            },
                          },
                        }));
                      }
                    }}
                    style={{
                      cursor:
                        product.customisedOptions.text >= 1 ? "pointer" : "not-allowed",
                    }}
                    role="button"
                    tabIndex={0}
                  />
                  <Typography className={classes.customNumber}>
                    {product.customisedOptions.text}
                  </Typography>
                  <i
                    className={`fas fa-plus ${classes.icon}`}
                    onClick={(): void => {
                      const {
                        customisedOptions: { text },
                      } = product;
                      if (text <= 9) {
                        this.setState((prevState) => ({
                          product: {
                            ...prevState.product,
                            customisedOptions: {
                              ...prevState.product.customisedOptions,
                              text: text + 1,
                            },
                          },
                        }));
                      }
                    }}
                    style={{
                      cursor:
                        product.customisedOptions.text <= 9 ? "pointer" : "not-allowed",
                    }}
                    role="button"
                    tabIndex={0}
                  />
                </div>
              </div>
              <div className={classes.customisableContainer}>
                <Typography>Colour Scheme</Typography>
                <div style={{ display: "flex", justifyContent: "flex-start", width: 65 }}>
                  <Switch
                    value={product.customisedOptions.colorScheme}
                    onChange={(): void => {
                      this.setState((prevState) => ({
                        product: {
                          ...prevState.product,
                          customisedOptions: {
                            ...prevState.product.customisedOptions,
                            colorScheme: !prevState.product.customisedOptions.colorScheme,
                          },
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </OutlinedContainer>
          )}
          <div className={classes.buttonContainer} style={{ marginBottom: "40px" }}>
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

const merged = { ...styles, defaultStyles };

export default withStyles(merged)(UpdateProduct);

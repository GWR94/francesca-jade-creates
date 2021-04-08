import React, { useState, useEffect } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Button,
  ThemeProvider,
  createMuiTheme,
  Typography,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { Alert, AlertTitle, Autocomplete } from "@material-ui/lab";
import { useDispatch } from "react-redux";
import Compress from "client-compress";
import { useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { getProduct } from "../../../graphql/queries";
import Loading from "../../../common/Loading";
import ImagePicker from "../../../common/containers/ImagePicker";
import { updateProduct, createProduct } from "../../../graphql/mutations";
import { UploadedFile } from "../interfaces/NewProduct.i";
// @ts-ignore
import awsExports from "../../../aws-exports";
import { openSnackbar } from "../../../utils/Notifier";
import { UpdateProps, UpdateState, FileToUpload } from "../interfaces/UpdateProduct.i";
import ConfirmDialog from "../../../common/alerts/ConfirmDialog";
import ImageCarousel from "../../../common/containers/ImageCarousel";
import OutlinedContainer from "../../../common/containers/OutlinedContainer";
import styles from "../styles/updateProduct.style";
import { S3ImageProps } from "../../accounts/interfaces/Product.i";
import Variants from "./Variants";
import { Variant } from "../interfaces/Variants.i";
import * as actions from "../../../actions/user.actions";
import { ImageFile } from "../../../common/containers/interfaces/ImagePicker.i";
import { cakeFeatures, createsFeatures, themes } from "../../../utils/data";
import ChipInput from "../../../common/inputs/ChipInput";
import { INTENT } from "../../../themes";

const UpdateProduct: React.FC<UpdateProps> = ({ update, id }): JSX.Element => {
  const [state, setState] = useState<UpdateState>({
    isLoading: true,
    product: {
      id: "",
      title: "",
      description: "",
      images: {
        cover: 0,
        collection: [],
      },
      customOptions: [], // colour scheme/cake variants
      tagline: "",
      type: "Cake",
      tags: [],
      setPrice: false,
      variants: [],
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
      customOptions: null,
    },
    percentUploaded: 0,
    customSwitch: false,
  });

  const history = useHistory();
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const dispatch = useDispatch();

  const isDesktop = useMediaQuery("(min-width: 600px)");

  useEffect((): void => {
    /**
     * If the update prop is true, get all of the product's data from the database,
     * and set it into state so it can be edited by the user.
     */
    async function fetchProduct(): Promise<void> {
      const { data } = await API.graphql(
        graphqlOperation(getProduct, {
          id,
        }),
      );
      const product = data.getProduct;
      setState({
        ...state,
        product: {
          ...product,
          setPrice:
            product.variants.some((variant: Variant) => variant.price.item > 0) ?? false,
          customOptions: product?.customOptions ?? [],
        },
        isLoading: false,
      });
    }
    if (update) {
      fetchProduct();
    } else setState({ ...state, isLoading: false });
  }, []);

  /**
   * A function which sets the value from the "e" parameter into the products' state named
   * as the type value.
   * @param {React.ChangeEvent} e - React ChangeEvent holding the user inputted data to be
   * set into state.
   * @param {string} type - The name of the state which is going to be updated with the value
   * from the e parameter.
   */
  const handleFormItem = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
  ): void => {
    const { value } = e.target;
    const { product, errors } = state;
    setState(
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
   * Function to upload a compressed image into the cloud (S3).
   * @param {File} fileToUpload - The compressed image to upload to S3 (Usually
   * returned file from handleImageCompress function.)
   */
  const handleImageUpload = async (
    fileToUpload: FileToUpload,
    blobToUpload: FileToUpload,
  ): Promise<void> => {
    const { product } = state;
    try {
      /**
       * Set isUploading to true so the UI can show loading spinners on buttons etc.
       */
      setState({
        ...state,
        isUploading: true,
      });
      /**
       * Get the identityId from the current auth user, and create the filename from
       * all of the relevant parts of data.
       */
      const compressedFileName = `products/compressed-${Date.now()}-${fileToUpload.name}`;
      const originalFileName = `products/${Date.now()}-${fileToUpload.name}`;
      /**
       * Upload images using AWS's Storage API, which puts the compressed and uncompressed
       * images into the cloud (S3).
       */
      let originalFile;
      if (fileToUpload.file) {
        // upload the compressed file to s3
        await Storage.put(compressedFileName, fileToUpload.file, {
          contentType: fileToUpload?.file.type,
        });
      }
      if (blobToUpload) {
        // upload the original file to s3
        originalFile = await Storage.put(originalFileName, blobToUpload, {
          contentType: blobToUpload.type,
        });
      }
      /**
       * Retrieve the key from originalFile, as it will be used as a reference for
       * the created product to retrieve the image from - so therefore place in the
       * product which is being created/updated.
       */
      const { key: originalKey } = originalFile as UploadedFile;
      const originalS3 = {
        key: originalKey,
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
              images: {
                collection: [...product.images.collection, originalS3],
                cover: product.images?.cover ?? 0,
              },
            },
          }),
        ));
      /**
       * Set the current products image data into state by merging old photos (if any) with
       * the new image. Also close image dialog and set isUploading to false as these operations
       * should be completed by now.
       */
      setState({
        ...state,
        product: {
          ...product,
          images: {
            ...product.images,
            collection: [...product.images.collection, originalS3],
          },
        },
        imageConfirmOpen: false,
        isUploading: false,
      });
    } catch (err) {
      /**
       * If there is an error, visualise it to the user by using the snackbar alert system.
       */
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to upload image. Please try again.",
      });
      console.error(err);
    }
  };

  /**
   * A function which compressed the input image to a preferred size if necessary.
   * @param {File} fileToUpload: The image which the user wishes to compress.
   */
  const handleImageCompress = (blobToUpload: ImageFile): void => {
    const compressor = new Compress({
      targetSize: 0.3, // target size in MB
      quality: 0.5,
      autoRotate: false,
    });
    const originalImage = blobToUpload;
    try {
      compressor.compress([blobToUpload]).then(
        (
          conversions: {
            photo: {
              data: File;
            };
          }[],
        ) => {
          /**
           * Compress the image via the compressor, then set the fileToUpload.file
           * to be the compressed file (photo.data);
           */
          const { photo } = conversions[0];
          const compressedImage: {
            file?: File;
          } = {};
          compressedImage.file = photo.data;
          Object.defineProperty(compressedImage, "name", {
            writable: true,
            value: blobToUpload.name,
          });
          /**
           * If everything else was successful, then attempt to upload it to S3 with
           * the handleImageUpload function.
           */
          handleImageUpload(compressedImage, originalImage);
        },
      );
    } catch (err) {
      openSnackbar({
        severity: INTENT.Danger,
        message: "Unable to compress image. Please try again.",
      });
    }
  };

  /**
   * Function which checks all the input fields have the correct data, and if not it
   * will show the user where there are errors in the UI.
   */
  const handleProductErrors = (): void => {
    const {
      product: { title, description, tags, images, tagline, customOptions, type },
    } = state;

    // set errors for each field to be false, so they can be tracked if there are changes.
    const error: {
      [key: string]: string;
    } = {
      title: "",
      invalidTitle: "",
      description: "",
      image: "",
      tags: "",
      tagline: "",
      customOptions: "",
    };

    if (title.length < 5) {
      // set title error if the title is less than 5 characters.
      error.title = "Please enter a valid title (Minimum 5 characters).";
    }
    if (title.length > 15 && !title.includes(" ")) {
      // set title error if the title is under 20 characters without a space.
      error.title = "Please don't add excessively long words to title";
    }
    if (title.length > 50) {
      // if the title is longer than 50 characters, set title error to true
      error.title = "Please add a smaller title (50 chars max)";
    }
    if (description.length <= 20) {
      // if the description is less than 20 characters set description error to true.
      error.description = "Please enter a detailed description (Minimum 20 characters).";
    }
    if (tags.length <= 0) {
      // if there are no tags, set the tag error to true.
      error.tags = "Please enter at least one theme for your product.";
    }
    if (tags.length > 5) {
      // if there are more than 5 tags, set tag error to true.
      error.tags = "Please enter a maximum of 5 tags.";
    }
    if (!images.collection.length) {
      // if there is no image set the image error to true.
      error.image = "Please enter at least one image for your product.";
    }
    if (tagline && tagline.length <= 0) {
      // if there is no tagline, set tagline error to true.
      error.tagline = "Please enter a tagline - 50 characters max.";
    }
    if (customOptions.length <= 0) {
      error.customOptions = `Please enter at least one ${
        type === "Cake" ? "feature." : "colour scheme."
      }`;
    }

    /**
     * If any of the errors in the errors object are true, then update the
     * state to show any errors in the UI.
     */
    if (Object.values(error).some((val) => val.length > 0)) {
      const { title, description, tags, image, tagline, customOptions } = error;
      setState({
        ...state,
        errors: {
          title,
          description,
          tags,
          image,
          tagline,
          customOptions,
        },
      });
      /**
       * Open the snackbar error component if there are any errors, notifying the
       * user that there are errors and how to fix them.
       */
      openSnackbar({
        severity: INTENT.Danger,
        message: "Please fix the highlighted errors before continuing",
      });
      return;
    }
    /**
     * If there are no errors then open the confirm dialog which will ask the user
     * to check the product details before confirming it and saving it to the database.
     */
    setState({
      ...state,
      confirmDialogOpen: true,
    });
  };

  /**
   * Function which stores the updated product into the database. All fields
   * should already be validated from the handleProductErrors function, so no validation
   * is needed.
   */
  const handleProductUpdate = async (): Promise<void> => {
    // destructure product and its values so they can be used in the graphQL input.
    const { product } = state;
    const {
      id,
      title,
      description,
      type,
      tags,
      tagline,
      variants,
      customOptions,
      setPrice,
    } = product;
    // set uploading to true so loading spinners and ui changes will show to user.
    setState({
      ...state,
      isUploading: true,
    });
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
            tagline,
            description,
            customOptions,
            setPrice,
            type,
            tags,
            variants,
          },
        }),
      );
      /**
       * Open the success snackbar to notify the user that the product has been
       * successfully updated
       */
      openSnackbar({
        severity: INTENT.Success,
        message: `Successfully updated ${title}.`,
      });

      setTimeout(() => {
        // set isUploading to stop loading UI effects, and close the confirm dialog.
        setState({
          ...state,
          isUploading: false,
          confirmDialogOpen: false,
        });
      }, 1000);
      /**
       * Set accounts tab to be products, so it goes to the correct tab when using
       * history to push back to the accounts page.
       */
      dispatch(actions.setCurrentTab("products"));
      history.push("/account");
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with an error snackbar.
      openSnackbar({
        severity: INTENT.Danger,
        message: `Unable to updated ${title}. Please try again.`,
      });
    }
  };

  /**
   * Function to add a newly created product into the database.
   */
  const handleProductCreate = async (): Promise<void> => {
    // destructure product and all of its properties for use in the graphql operation
    const {
      product: {
        title,
        description,
        images,
        type,
        tags,
        tagline,
        customOptions,
        variants,
        setPrice,
      },
    } = state;
    setState({
      ...state,
      isUploading: true,
    });
    try {
      await API.graphql(
        /**
         * add all of the products values to the input variable for use in the createProduct
         * graphql mutation
         */
        graphqlOperation(createProduct, {
          input: {
            title,
            tagline,
            description,
            images,
            customOptions,
            type,
            tags,
            variants,
            setPrice,
          },
        }),
      );
      // If successful then show this to the user by showing the success snackbar.
      openSnackbar({
        severity: INTENT.Success,
        message: `${title} has been successfully created!`,
      });
      // set isUploading to false to stop loading ui effects, and close confirm dialog
      setTimeout(() => {
        setState({
          ...state,
          isUploading: false,
          confirmDialogOpen: false,
        });
      }, 1000);
      /**
       * Set accounts tab to be products, so it goes to the correct tab when using
       * history to push back to the accounts page.
       */
      dispatch(actions.setCurrentTab("products"));
      history.push("/account");
    } catch (err) {
      console.error(err);
      // if there are any errors, notify the user with an error snackbar.
      openSnackbar({
        severity: INTENT.Danger,
        message: `Error adding ${title}. Please try again.`,
      });
    }
  };

  /**
   * Method to update the description state to whatever has been input by the
   * user inside the TinyMCE editor.
   * @param {React.ChangeEvent} e - event containing the data which shows
   * the updated information from the TinyMCE editor.
   */
  const handleEditorChange = (e: React.ChangeEvent<{ getContent(): string }>): void => {
    const { product } = state;
    setState({
      ...state,
      product: {
        ...product,
        description: e.target.getContent() as string,
      },
    });
  };

  const {
    isLoading,
    product,
    isUploading,
    errors,
    confirmDialogOpen,
    percentUploaded,
  } = state;
  const {
    title,
    description,
    images,
    tagline,
    type,
    tags,
    setPrice,
    customOptions,
  } = product;

  const features: string[] = type === "Cake" ? cakeFeatures : createsFeatures;

  return isLoading ? (
    <Loading size={100} />
  ) : (
    <>
      <div className={classes.mainContainer}>
        <Typography
          variant="h4"
          style={{
            marginTop: update ? 20 : 0,
          }}
          gutterBottom
        >
          {update ? "Update Product" : "Create Product"}
        </Typography>
        {!update && (
          <Typography variant="subtitle1">
            Create your product by filling out all of the fields. Products can be changed
            and/or deleted at a later stage.
          </Typography>
        )}
        <TextField
          variant="outlined"
          value={title}
          onChange={(e): void => handleFormItem(e, "title")}
          error={!!errors.title}
          helperText={errors.title}
          label="Title"
          fullWidth
          size={!isDesktop ? "small" : "medium"}
          placeholder="Enter a product title"
          style={{
            marginBottom: "10px",
          }}
        />
        <TextField
          variant="outlined"
          value={tagline}
          onChange={(e): void => handleFormItem(e, "tagline")}
          error={!!errors.tagline}
          helperText={errors.tagline}
          label="Tag line"
          fullWidth
          size={!isDesktop ? "small" : "medium"}
          placeholder="Enter a brief tagline for the product"
          style={{
            marginBottom: "10px",
          }}
        />
        <Editor
          initialValue={description}
          apiKey={process.env.TINY_API_KEY}
          init={{
            height: 300,
            width: "100%",
            marginBottom: 10,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignjustify | \
                bullist numlist outdent indent | removeformat | help",
          }}
          onChange={handleEditorChange}
        />
        <div
          style={{
            margin: "10px 0",
            width: "100%",
          }}
        >
          <OutlinedContainer label="Product Type" labelWidth={78} padding={10}>
            <RadioGroup
              aria-label="Product Type"
              name="ProductType"
              value={type}
              onChange={(e): void => handleFormItem(e, "type")}
              row
              style={{
                justifyContent: "space-around",
                margin: 0,
              }}
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
                classes={{
                  root: classes.root,
                }}
                control={<Radio />}
                label="Creates"
              />
            </RadioGroup>
          </OutlinedContainer>
        </div>
        <ChipInput
          label={type === "Cake" ? "Cake Features" : "Colour Scheme"}
          value={customOptions || []}
          options={features}
          onChange={(_event, customOptions): void => {
            setState((prevState) => ({
              ...state,
              product: {
                ...prevState.product,
                customOptions: customOptions as string[],
              },
              errors: {
                ...errors,
                customOptions: "",
              },
            }));
          }}
          tagClass={product.type === "Cake" ? classes.chipCake : classes.chipCreates}
          errors={errors.customOptions}
          fullWidth
          freeSolo
        />
        <Alert
          severity="info"
          className={classes.callout}
          style={{
            margin: "10px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AlertTitle
              style={{
                fontSize: "18px",
              }}
            >
              Is there a set price?
            </AlertTitle>
            <Typography variant="body1">
              To set a price for the product, turn the switch on and input the price and
              shipping cost in the inputs below. To set a variable price where the
              customer requests a quote based on their preferences, leave the switch off.
            </Typography>
          </div>
          <div className={classes.switch}>
            <Switch
              checked={setPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setState({
                  ...state,
                  product: {
                    ...product,
                    setPrice: e.target.checked,
                  },
                })
              }
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              color="primary"
              name="setPrice"
              size={!isDesktop ? "small" : "medium"}
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </div>
        </Alert>
        <div
          style={{
            margin: "10px 0",
            width: "100%",
          }}
        >
          <OutlinedContainer
            label={images.collection.length <= 1 ? "Product Image" : "Product Images"}
            labelWidth={images.collection.length <= 1 ? 84 : 90}
            padding={12}
            error={!!errors.image}
          >
            {images.collection.length > 0 && (
              <div>
                <ImageCarousel
                  images={images.collection}
                  cover={images.cover}
                  deleteImages
                  update={update}
                  id={product.id}
                  type={type}
                  handleUpdateImages={(collection: S3ImageProps[]): void => {
                    setState({
                      ...state,
                      product: {
                        ...product,
                        images: {
                          ...product.images,
                          collection,
                        },
                      },
                    });
                  }}
                />
              </div>
            )}
            <ImagePicker
              setImageFile={(file): void => {
                handleImageCompress(file);
                setState({
                  ...state,
                  errors: {
                    ...errors,
                    image: null,
                  },
                });
              }}
              cropImage
              update={update}
              type={product.type}
            />
          </OutlinedContainer>
        </div>
        {errors.image && <p className={classes.errorText}>{errors.image}</p>}
        <Autocomplete
          multiple
          id="collections-input"
          options={themes.sort((a, b) => -b.slice(0, 1).localeCompare(a.slice(0, 1)))}
          filterSelectedOptions
          fullWidth
          autoComplete
          value={tags || []}
          onChange={(_event, tags, reason): void => {
            setState(
              (prevState): UpdateState => {
                if (reason === "remove-option") {
                  return {
                    ...prevState,
                    product: {
                      ...prevState.product,
                      tags,
                    },
                    errors: {
                      ...errors,
                      tags: null,
                    },
                  };
                } else if (prevState.product.tags.length > 5) {
                  openSnackbar({
                    severity: INTENT.Danger,
                    message: `Please only add up to 5 collections.`,
                  });
                  return prevState;
                } else {
                  return {
                    ...prevState,
                    product: {
                      ...prevState.product,
                      tags,
                    },
                    errors: {
                      ...errors,
                      tags: null,
                    },
                  };
                }
              },
            );
          }}
          classes={{
            tag: product.type === "Cake" ? classes.chipCake : classes.chipCreates,
          }}
          renderInput={(params): JSX.Element => (
            <TextField
              {...params}
              variant="outlined"
              label="Themes"
              fullWidth
              error={!!errors.tags}
              helperText={errors.tags}
            />
          )}
        />
        <Variants
          variants={product.variants}
          type={type}
          size={!isDesktop ? "small" : "medium"}
          setPrice={product.setPrice}
          updateVariants={(variants: Variant[]): void => {
            setState({
              ...state,
              product: {
                ...product,
                variants,
              },
            });
          }}
        />
        <div
          className={classes.buttonContainer}
          style={{
            marginBottom: "40px",
          }}
        >
          <ThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: green,
              },
            })}
          >
            <Button
              onClick={(): void => {
                dispatch(actions.setCurrentTab("products"));
                history.push("/account");
              }}
              style={{
                margin: "0 10px",
              }}
              size="large"
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProductErrors}
              color="primary"
              variant="contained"
              style={{
                margin: "0 10px",
                color: "#fff",
              }}
              size="large"
            >
              Confirm
            </Button>
          </ThemeProvider>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        product={product}
        isUploading={isUploading}
        percentUploaded={percentUploaded}
        onProductCreate={update ? handleProductUpdate : handleProductCreate}
        closeModal={(): void =>
          setState({
            ...state,
            confirmDialogOpen: false,
          })
        }
        update
      />
    </>
  );
};

export default UpdateProduct;

import React from "react";
import { FormGroup } from "@blueprintjs/core";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import { ImagePickerProps } from "./interfaces/ImagePicker.i";

/**
 * TODO
 * [ ] Fix onPick not working when removing and adding an image
 */

const ImagePicker: React.FC<ImagePickerProps> = ({
  savedS3Image,
  disabled = false,
  setImageFile,
  savedImage,
  theme,
  setImagePreview,
  showPreview,
  update,
  profile,
  showText,
}): JSX.Element => {
  const [imagePreview, setPreview] = React.useState(null);
  const styles = theme || {
    formContainer: {
      margin: 0,
      padding: "5px",
    },
    formSection: {
      width: "200px",
      minWidth: "200px",
      boxShadow: "none",
      padding: 0,
    },
    sectionBody: {
      display: "none",
    },
    sectionHeader: {
      display: "none",
    },
    photoPickerButton: {
      background: "#ff80f7",
      marginTop: "10px",
      borderRadius: "5px",
      border: "1px solid #ff52f4",
      textTransform: "none",
      fontSize: "16px",
      padding: "8px",
    },
  };

  return (
    <>
      <FormGroup
        label={showText && "Display Image:"}
        className="profile__input"
        labelInfo={(!update || profile) && "(optional)"}
      >
        <div
          className={
            profile ? "image__profile-container" : "image__placeholder-container"
          }
        >
          {/* Show image preview if one exists */}
          {imagePreview ? (
            <img className="image__image" src={imagePreview} alt="Product Preview" />
          ) : // Show saved S3 image if passed through via props
          savedS3Image ? (
            <S3Image
              imgKey={savedS3Image.key}
              theme={{
                photoImg: { maxWidth: "100%" },
              }}
            />
          ) : (
            // else show the placeholder/savedImage if profile boolean prop is true.
            profile && <img src={savedImage} alt="Profile" className="image__image" />
          )}
        </div>
        {/* only show PhotoPicker if the disabled prop is not true/defined */}
        {!disabled && (
          <PhotoPicker
            title={update ? "Add another image" : "Select an image"}
            preview="hidden"
            headerHint="This can be changed anytime."
            headerText="Add a display image"
            onLoad={(url): void => {
              showPreview && setPreview(url);
              setImagePreview && setImagePreview(url);
            }}
            onPick={(file): void => {
              console.log("picked");
              setImageFile(file);
            }}
            theme={styles}
          />
        )}
      </FormGroup>
    </>
  );
};

export default ImagePicker;

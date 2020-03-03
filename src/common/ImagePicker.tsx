import React, { useState } from "react";
import { FormGroup } from "@blueprintjs/core";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import { ImagePickerProps } from "./interfaces/ImagePicker.i";

/**
 * TODO
 * [ ] Add delete button to remove image from db
 */

const ImagePicker: React.FC<ImagePickerProps> = ({
  savedS3Image,
  disabled,
  setImageFile,
  savedImage,
  theme,
  setImagePreview,
  showPreview,
  update,
  profile,
}): JSX.Element => {
  const [imagePreview, setPreview] = useState(null);
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
        label={!update && "Display Image:"}
        className="profile__input"
        labelInfo={(!update || profile) && "(optional)"}
      >
        {imagePreview ? (
          <div className="image__container">
            <img className="image__image" src={imagePreview} alt="Product Preview" />
          </div>
        ) : savedS3Image ? (
          <div className="image__container">
            <S3Image
              imgKey={savedS3Image.key}
              theme={{
                photoImg: { maxWidth: "100%" },
              }}
            />
          </div>
        ) : (
          savedImage && (
            <div className="image__container">
              <img src={savedImage} alt="Profile" className="image__image" />
            </div>
          )
        )}
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
            onPick={(file): void => setImageFile(file)}
            theme={styles}
          />
        )}
      </FormGroup>
    </>
  );
};

export default ImagePicker;

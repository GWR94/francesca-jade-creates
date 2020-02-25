import React, { useState } from "react";
import { FormGroup } from "@blueprintjs/core";
import { S3Image, PhotoPicker } from "aws-amplify-react";
import { S3ObjectInput } from "../API";

interface Props {
  displayImage: S3ObjectInput;
  isEditing: boolean;
  setImageFile: (image) => void;
  userImage: string;
}

const ImagePicker: React.FC<Props> = ({
  displayImage,
  isEditing,
  setImageFile,
  userImage,
}): JSX.Element => {
  const [imagePreview, setImagePreview] = useState(null);
  return (
    <>
      <FormGroup
        label="Display Image:"
        className="profile__input"
        labelInfo="(optional)"
        style={{ padding: "0 15px" }}
      >
        {imagePreview ? (
          <div className="profile__image-container">
            <img className="profile__image" src={imagePreview} alt="Product Preview" />
          </div>
        ) : (
          <div className="profile__image-container">
            {displayImage ? (
              <S3Image
                imgKey={displayImage.key}
                theme={{
                  photoImg: { maxWidth: "100%" },
                }}
              />
            ) : (
              <img src={userImage} alt="Profile" className="profile__image" />
            )}
          </div>
        )}
        {isEditing && (
          <PhotoPicker
            title="Select an image"
            preview="hidden"
            headerHint="This can be changed anytime."
            headerText="Add a display image"
            onLoad={(url): void => setImagePreview(url)}
            onPick={(file): void => setImageFile(file)}
            theme={{
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
              },
            }}
          />
        )}
      </FormGroup>
    </>
  );
};

export default ImagePicker;

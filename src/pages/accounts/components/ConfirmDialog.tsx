import React, { useState } from "react";
import { Dialog, Classes, Button, Tag, ProgressBar } from "@blueprintjs/core";
import { S3Image } from "aws-amplify-react";
import { Carousel, CarouselIndicators, CarouselControl, CarouselItem } from "reactstrap";
import { ConfirmDialogProps } from "../interfaces/ConfirmDialog.i";

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  type,
  setPrice,
  productCost,
  shippingCost,
  isUploading,
  imagePreview,
  onProductCreate,
  closeModal,
  percentUploaded,
  tags,
  image,
  product,
  update,
}): JSX.Element => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNextImage = (): void => {
    if (animating) return;
    setIndex(index === image.length - 1 ? 0 : index + 1);
  };

  const handlePreviousImage = (): void => {
    if (animating) return;
    setIndex(index === 0 ? image.length - 1 : index - 1);
  };

  return (
    isOpen && (
      <Dialog
        isOpen={isOpen}
        icon="info-sign"
        title="Are you sure this is correct?"
        onClose={closeModal}
      >
        <div className={Classes.DIALOG_BODY}>
          <p>
            <strong>Title: </strong>
            {title}
          </p>
          <p>
            <strong>Description: </strong>
            {description}
          </p>
          <p>
            <strong>Type: </strong>
            {type}
          </p>
          {setPrice ? (
            <>
              <p>
                <strong>Product price:</strong> £{parseFloat(productCost).toFixed(2)}
              </p>
              <p>
                <strong>Shipping cost:</strong> £{parseFloat(shippingCost).toFixed(2)}
              </p>
            </>
          ) : (
            <p>
              <strong>Prices: </strong>
              No set price - customer requests a quote.
            </p>
          )}
          <p>
            <strong>Tags: </strong>
            {tags?.length > 0
              ? tags.map(
                  (tag, i): JSX.Element => (
                    <Tag active key={i} style={{ marginRight: "4px" }}>
                      {tag}
                    </Tag>
                  ),
                )
              : "No tags"}
          </p>
          <p>
            <strong>Cover image:</strong>
          </p>
          {imagePreview ? (
            <img src={imagePreview} alt={`${title} Preview`} className="confirm__image" />
          ) : update && Array.isArray(image) ? (
            <Carousel
              activeIndex={index}
              next={handleNextImage}
              previous={handlePreviousImage}
            >
              <CarouselIndicators
                items={image}
                activeIndex={index}
                onClickHandler={(idx): void => setIndex(idx)}
              />
              {image.map((image, i) => (
                <CarouselItem
                  onExiting={(): void => setAnimating(true)}
                  onExited={(): void => setAnimating(false)}
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
              ))}
              <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={handlePreviousImage}
              />
              <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={handleNextImage}
              />
            </Carousel>
          ) : (
            <S3Image
              imgKey={product.image.key}
              theme={{
                photoImg: {
                  display: "block",
                  width: "340px",
                  margin: "0 auto",
                },
              }}
            />
          )}
        </div>
        <div className="new-product__button-container">
          <Button
            text="Edit"
            intent="warning"
            onClick={closeModal}
            style={{ margin: "6px 4px" }}
          />
          <Button
            text="Looks good!"
            intent="success"
            loading={isUploading}
            onClick={onProductCreate}
            style={{ margin: "6px 4px" }}
          />
        </div>
        {isUploading && <ProgressBar intent="primary" value={percentUploaded} />}
      </Dialog>
    )
  );
};

export default ConfirmDialog;

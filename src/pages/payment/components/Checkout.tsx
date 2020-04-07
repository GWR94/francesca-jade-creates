import React from "react";
import { Callout } from "@blueprintjs/core";

interface Props {}

const Checkout = (props: Props) => {
  return (
    <div>
      <Callout
        className="basket__infoF"
        intent="warning"
        title="COVID-19 Update"
        icon="info-sign"
      >
        <p className="basket__info-text">
          Due to the COVID-19 pandemic there may be minor delays in production of
          Francesca Jade Creates products, however the products are still going to be
          processed and delivered as soon as possible.
        </p>
      </Callout>
    </div>
  );
};

export default Checkout;

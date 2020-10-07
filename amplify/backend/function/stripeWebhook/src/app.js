/* eslint-disable prettier/prettier */
/* Amplify Params - DO NOT EDIT
	API_FRANCESCAJADECREATES_GRAPHQLAPIENDPOINTOUTPUT
	API_FRANCESCAJADECREATES_GRAPHQLAPIIDOUTPUT
	API_FRANCESCAJADECREATES_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const AWS = require("aws-sdk");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config("./.env");
}

AWS.config.update({
  region: "eu-west-2",
});

const sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "eu-west-1",
  adminEmail: "contact@francescajadecreates.co.uk",
};

const ses = new AWS.SES(sesConfig);
const ddb = new AWS.DynamoDB.DocumentClient();

// declare a new express app
const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());

let stripe;
let endpointSecret;
if (process.env.NODE_ENV === "production") {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
} else {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);
  endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_TEST;
}
const paymentTable = process.env.PAYMENT_TABLE;

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

const emailHandler = (req, res) => {
  const { data, stripe } = req;
  ses.sendEmail(
    {
      Source: sesConfig.adminEmail,
      ReturnPath: sesConfig.adminEmail,
      Destination: {
        ToAddresses: [sesConfig.adminEmail, stripe.customer_email],
      },
      Message: {
        Subject: {
          Data: "Order Confirmation - Francesca Jade Creates",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <div style="color: black">
            <div style="margin-bottom: 16px">
              <h2>Thank you for your order!</h2>
              <div style="display: inline-flex; justify-content: space-evenly">
                <img src="https://francescajadecreatesimages113437-prod.s3.eu-west-2.amazonaws.com/public/logo.png" style="width: 80px; height=80px; margin: 20px"/>
              <div>
                <h3>Order Confirmation</h3>
                <p style="margin: 0">
                Thank you for your purchase! Your order has been processed, and payment has been received.
                </p>
                <p style="margin: 0">
                  You will receive a follow-up email when your order has been dispatched.
                </p>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 16px">
            <h4 style="text-decoration: underline">Order Details</h4>
            <h4>Your order number is ${stripe.metadata.orderId}</h5>
            <p style="margin: 0">You can view that status of your order by signing in to <a href="https://www.francescajadecreates.co.uk/">Francesca Jade Creates</a> and checking your orders in your Profile page</p>
            <div style="display: inline-flex; flex-direction: row;  width: 100%; flex-wrap: wrap">
              ${data.Attributes.products.map(
                (product) =>
                  `<div style="width: 200px">
                    <p style="margin: 0"><span style="font-weight: bold"">Product:</span> ${
                      product.title
                    }</p>
                    <p style="margin: 0"><span style="font-weight: bold"">Product Price:</span> £${product.price.toFixed(
                      2,
                    )}</p>
                    <p style="margin: 0"><span style="font-weight: bold"">Shipping Cost:</span> £${product.shippingCost.toFixed(
                      2,
                    )}</p>
                  </div>`,
              )}
            </div>
            <p style="margin-top: 20"><span style="font-weight: bold"">Total paid:</span> £${(
              stripe.amount_total / 100
            ).toFixed(2)}</p>
            <div style="margin-bottom: 16px">
              <h4 style="text-decoration: underline">Mailing Address</h4>
              <p style="margin: 0">${stripe.shipping.name}</p>
              <p style="margin: 0">${stripe.shipping.address.line1},</p>
              <p style="margin: 0">${
                stripe.shipping.address.line2 !== null
                  ? `${stripe.shipping.address.line2} , `
                  : ""
              }${stripe.shipping.address.city}, ${stripe.shipping.address.postal_code}</p>
            </div>
            <p style="margin: 0">
              If any of this information is incorrect please contact me <a href="mailto:contact@francescajadecreates.co.uk?subject=Order details update [${
                stripe.metadata.orderId
              }]">
                here
              </a>
            </p>
            <p style="margin-top: 40; font-size: 12px">Please note - due to COVID-19 orders may take longer to process - but rest assured, all products are still being produced, delivery just may take a bit longer.</p>
          </div>`,
          },
        },
      },
    },
    (err, data) => {
      if (err) res.status(500).json({ error: err });
      else {
        res.status(200).json({
          message: "Order processed successfully",
          stripe,
          data,
        });
      }
    },
  );
};

const checkoutHandler = (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      try {
        const data = event.data.object;
        const paramsPayment = {
          TableName: paymentTable,
          Key: {
            id: data.metadata.orderId,
          },
          ExpressionAttributeValues: {
            ":p": data.payment_intent,
            ":s": data.payment_status,
            ":ci": data.shipping.address.city,
            ":co": data.shipping.address.country,
            ":lo": data.shipping.address.line1,
            ":lt": data.shipping.address.line2,
            ":pc": data.shipping.address.postal_code,
          },
          UpdateExpression:
            "SET stripePaymentIntent = :p, paymentStatus = :s, shippingAddress.city = :ci, shippingAddress.country = :co, shippingAddress.address_line1 = :lo, shippingAddress.address_line2 = :lt, shippingAddress.address_postcode = :pc",
          ReturnValues: "ALL_NEW",
        };
        ddb.update(paramsPayment, function (err, db) {
          if (err) return res.status(400).send(err);
          req.data = db;
          req.stripe = data;
          next();
        });
      } catch (err) {
        return res.status(400).send(err);
      }
      break;
    }
    default:
      return res.status(400).end();
  }
};

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  checkoutHandler,
  emailHandler,
);

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;

/*
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

// declare a new express app
const app = express();

let stripe;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(".env");
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);
} else {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

const ddb = new AWS.DynamoDB.DocumentClient();

const sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
  region: "eu-west-1",
  adminEmail: "contact@francescajadecreates.co.uk",
};

const ses = new AWS.SES(sesConfig);

const url =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://www.francescajadecreates.co.uk";

app.post("/orders/create-checkout-session", async (req, res) => {
  const { products, email, orderId } = req.body;
  const items = [];
  try {
    products.map((product) => {
      items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.title,
            description: product.tagline,
            images: [product.image],
          },
          unit_amount: (product.price + product.shippingCost) * 100,
        },
        quantity: 1,
      });
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/cancel`,
      customer_email: email,
      metadata: {
        orderId,
      },
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(502).json({ error: err });
  }
});

app.post("/orders/retrieve-session", async (req, res) => {
  const { id } = req.body;
  const session = await stripe.checkout.sessions.retrieve(id);
  return res.status(200).json({ session });
});

app.post("/orders/set-order-processing", (req, res) => {
  try {
    const { orderId, isProcessed } = req.body;
    const params = {
      TableName: process.env.ORDERS_TABLE,
      Key: { id: orderId },
      ExpressionAttributeValues: {
        ":p": isProcessed,
      },
      UpdateExpression: "SET orderProcessed = :p",
      ReturnValues: "ALL_NEW",
    };
    ddb.update(params, (err) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(true);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.post("/orders/send-shipping-information", (req, res) => {
  const { order, trackingInfo } = req.body;
  try {
    const params = {
      TableName: process.env.ORDERS_TABLE,
      Key: { id: order.id },
      ExpressionAttributeValues: {
        ":s": JSON.stringify(trackingInfo),
        ":d": true,
        ":p": true,
      },
      UpdateExpression: "SET trackingInfo = :s, shipped = :d, orderProcessed = :p",
      ReturnValues: "ALL_NEW",
    };
    ddb.update(params, (err) => {
      if (err) return res.status(400).send(err);
    });

    const getTrackingData = () => {
      if (trackingInfo === null) return null;
      if (Array.isArray(trackingInfo)) {
        return `
        <div>
          <h3>Tracking Information</h3>
            ${trackingInfo
              .map((info) => {
                const title = Object.keys(info)[0];
                const tracking = Object.values(info)[0];
                return `
                <p>${title} - ${tracking}</p>
                <p>To check the status of your shipment, please click <a href="http://www.royalmail.com/portal/rm/track?trackNumber=${tracking}">here</a></p>
              </div>`;
              })
              .join("")}`;
      } else {
        return `<div>
                  <h3>Tracking Number</h3>
                  <p style="margin: 0">The tracking number for your package(s) is ${trackingInfo}</p>
                  <p>To check the status of your shipment, please click <a href="http://www.royalmail.com/portal/rm/track?trackNumber=${trackingInfo}">here</a></p>
                </div>`;
      }
    };

    ses.sendEmail(
      {
        Source: sesConfig.adminEmail,
        ReturnPath: sesConfig.adminEmail,
        Destination: {
          ToAddresses: [sesConfig.adminEmail, order.userInfo.email],
        },
        Message: {
          Subject: {
            Data: "Shipping Confirmation - Francesca Jade Creates",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
              <div style="color: black">
                <div style="margin-bottom: 16px">
                  <h2>Shipping Confirmation</h2>
                  <div style="display: inline-flex; justify-content: space-evenly">
                    <img
                      src="https://francescajadecreatesimages113437-prod.s3.eu-west-2.amazonaws.com/public/logo.png"
                      style="width: 80px; height: 80px; margin: 20px"
                    />
                    <div>
                      <h3>Your order has been successfully dispatched.</h3>
                      <p style="margin: 0">
                        Thank you for your purchase! Your order has been dispatched, and
                        will be delivered to you as soon as possible.
                      </p>
                      <p style="margin: 0">
                        You will receive a follow-up email when your order has been
                        dispatched.
                      </p>
                    </div>
                  </div>
                </div>
                ${getTrackingData()}
              </div>`,
            },
          },
        },
      },
      (err) => {
        if (err) return res.status(400).json({ error: err });
        return res.status(200).send(true);
      },
    );
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;

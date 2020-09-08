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

// declare a new express app
const app = express();

require("dotenv").config(".env");
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiFrancescajadecreatesGraphQLAPIIdOutput = process.env.API_FRANCESCAJADECREATES_GRAPHQLAPIIDOUTPUT
var apiFrancescajadecreatesGraphQLAPIEndpointOutput = process.env.API_FRANCESCAJADECREATES_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT *
/* eslint-disable func-names */
const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AWS = require("aws-sdk");

const config = {
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "eu-west-2",
  adminEmail: "jamesgower1994@gmail.com",
};

const ses = AWS.SES(config);

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

const chargeHandler = async (req, res, next) => {
  const { token, product } = req.body;
  const { currency, amount, description } = req.body.charge;
  try {
    const charge = await stripe.charges.create({
      source: token.id,
      amount,
      currency,
      description,
    });
    if (charge.status === "succeeded") {
      req.charge = charge;
      req.description = description;
      req.email = req.body.email;
      req.product = product;
      next();
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

const emailHandler = (req, res) => {
  const {
    charge,
    email: { customerEmail },
    product: { title, price, shippingCost },
  } = req;
  ses.sendMail(
    {
      Source: config.adminEmail,
      ReturnPath: config.adminEmail,
      Destination: {
        ToAddresses: [config.adminEmail, customerEmail],
      },
      Message: {
        Subject: {
          Data: "Order Confirmation - Francesca Jade Creates",
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
          <h3>Order Processed</h3>
          <p>Your order of "${title}" has been processed.</p>

          <p>You will receive a follow-up email when your order has been dispatched.</p>

          <h4 style="text-decoration: underline">Order Details</h4>
          <p><span style={{Product Cost: £${price}</p>
          <p>Shipping Cost: £${shippingCost}</p>

          <h4 style="text-decoration: underline">Mailing Address</h4>
          <p>${charge.source.name}</p>
          <p>${charge.source.address_line1}</p>
          <p>${charge.source.address_city}, ${charge.source.address_state}, ${charge.source.address_zip}</p>
          `,
          },
        },
      },
    },
    (err, data) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "Order processed successfully",
        charge,
        data,
      });
    },
  );
};

app.post("/charge", chargeHandler, emailHandler);

app.listen(3000, function() {
  console.log("App started!");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;

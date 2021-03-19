/* eslint-disable @typescript-eslint/camelcase */
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
const dayjs = require("dayjs");
const localized = require("dayjs/plugin/localizedFormat");

dayjs.extend(localized);

// declare a new express app
const app = express();

AWS.config.update({
  region: "eu-west-2",
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
  signatureVersion: "v4",
});

let stripe;
let url;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config("./.env");
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);
  url = "http://localhost:3000";
} else {
  url = "https://www.francescajadecreates.co.uk";
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST); //FIXME - Change after test
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

const getPublicS3URL = (s3Image) => {
  const { key, bucket, region } = s3Image;
  return `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
};

const getProducts = (products) => {
  return products
    .map(
      ({ image, title, tagline, variant }) => `
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;padding-bottom:10px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td
               class="" style="width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;background-color:#b8b8b8;">
                <!--[if mso | IE]>
        <table
           bgcolor="#dedede" border="0" cellpadding="0" cellspacing="0" role="presentation"
        >
          <tr>
              <td
                 style="vertical-align:middle;width:240px;"
              >
              <![endif]-->
                <div class="mj-column-per-40 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:35%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                          <tbody>
                            <tr>
                              <td style="width:190px;"> <img height="auto" src="${getPublicS3URL(
                                image,
                              )}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                  width="190" /> </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
                <!--[if mso | IE]>
              </td>
              
              <td
                 style="vertical-align:middle;width:360px;"
              >
              <![endif]-->
                <div class="mj-column-per-60 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:65%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:Roboto, sans-serif;font-size:14px;line-height:1;text-align:left;color:rgba(0,0,0,0.7);">
                          <p>${title}</p>
                          <p>${tagline}</p>
                          <p>£${variant.price.item.toFixed(
                            2,
                          )} + £${variant.price.postage.toFixed(2)}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
                <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:60%">
                      </p>
                <!--[if mso | IE]>
              </td>
              
          </tr>
          </table>
        <![endif]-->
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->`,
    )
    .join("")
    .toString();
};

app.post("/orders/create-checkout-session", async (req, res) => {
  const { products, email, orderId } = req.body;
  const items = [];
  try {
    await products.map((product) => {
      items.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: product.title,
            description: product.tagline || "",
            images: [product.image],
          },
          unit_amount: Math.round(
            (product.variant.price.item + product.variant.price.postage) * 100,
          ),
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
      success_url: `${url}/basket?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/basket?cancel=true`,
      customer_email: email,
      metadata: {
        orderId,
      },
    });
    return res.json({ id: session.id });
  } catch (err) {
    return res.status(502).send(err);
  }
});

app.post("/orders/retrieve-session", async (req, res) => {
  const { id } = req.body;
  const session = await stripe.checkout.sessions.retrieve(id);
  return res.status(200).json({ session });
});

app.post("/orders/set-order-processing", (req, res) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

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

app.post("/orders/send-shipping-information", async (req, res) => {
  const { order, trackingInfo, cost } = req.body;
  const { shippingAddress } = order;
  const {
    address_line1,
    address_line2,
    address_postcode,
    city,
    country,
  } = shippingAddress;

  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_KEY_AWS,
  };

  let customerName;
  try {
    const session = await stripe.checkout.sessions.retrieve(order.stripeOrderId);
    customerName = session.shipping.name;
  } catch (err) {
    return res.json({ error: err, orderId: order.id });
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const ses = new AWS.SES(sesConfig);

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
  } catch (err) {
    res.status(400).send({ error: err, dynamodb: "error" });
  }

  try {
    ses.sendEmail(
      {
        Source: sesConfig.adminEmail,
        ReturnPath: sesConfig.adminEmail,
        Destination: {
          ToAddresses: [sesConfig.adminEmail],
        },
        Message: {
          Subject: {
            Data: "Shipping Confirmation - Francesca Jade Creates",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
              <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>
  </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
    @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
</head>

<body style="background-color:#FEB5D5;">
  <div style="background-color:#FEB5D5;">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:100px;">
                              <img height="auto" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                        <p style="font-weight: bold; margin: 0; color: #b8b8b8">Francesca Jade Creates</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                        <p style="font-weight: bold; font-size: 14px">HELLO</p>
                        <p style="font-size: 18px">${customerName}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:60%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:310px;" role="presentation" width="310px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:rgba(0,0,0,0.7);">
                        <p style="font-size:18px; padding-bottom: 10px">Great News!</p>
                        <p style="font-size: 16px">Your order is complete and has been dispatched.</p>
                        <p style="padding: 10px 0">You can find the shipping information below.</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:0;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:60%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:360px;" role="presentation" width="360px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:rgba(0,0,0,0.7);">
                        <p style="text-align: center; text-decoration: underline">Shipping Information</p>
                        <p>${customerName}</p>
                        <p>${address_line1}</p> ${
                address_line2 !== null ? ` <p>${address_line2},</p> ` : ""
              } <p>${city},</p>
                        <p>${address_postcode},</p>
                        <p>${country}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:rgba(0,0,0,0.7);">
                        <p style="text-decoration:underline; text-align:center;">Tracking Information</p>
                        ${
                          Array.isArray(trackingInfo)
                            ? trackingInfo.map((info) => {
                                const title = Object.keys(info)[0];
                                const tracking = Object.values(info)[0];
                                return ` <p>${title} - ${tracking}</p>
                        <p>To check the status of your shipment, please click <a href="http://www.royalmail.com/portal/rm/track?trackNumber=${tracking}">here</a></p> `;
                              })
                            : trackingInfo !== null
                            ? `<div> 
                  <p style="margin: 0">The tracking number for your package(s) is ${trackingInfo}</p>
                  <p>To check the status of your shipment, please click <a href="http://www.royalmail.com/portal/rm/track?trackNumber=${trackingInfo}">here</a></p>
                  </div>`
                            : `<div>
                            <p>There is no tracking information for your order.</p>
                            <p>Your item should be with you within a couple of days!</p>
                            </div>`
                        }
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  ${getProducts(order.products)}
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:15px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:200px;"
            >
          <![endif]-->
              <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:rgba(0,0,0,0.7);">
                        <p style="font-weight:bold;">Order Number</p>
                        <p>${order.id}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:200px;"
            >
          <![endif]-->
              <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:rgba(0,0,0,0.7);">
                        <p style="font-weight:bold;">Order Date</p>
                        <p>${dayjs().format("LLLL")}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:200px;"
            >
          <![endif]-->
              <div class="mj-column-per-33-333333333333336 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-bottom:0px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:rgba(0,0,0,0.7);">
                        <p style="font-weight:bold;">Total Price</p>
                        <p>${cost.toFixed(2)}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
  </div>
</body>

</html>`,
            },
          },
        },
      },
      (err, data) => {
        if (err) return res.status(400).json({ error: err, mjml: "error" });
        return res.status(200).json({
          message: "Order processed successfully",
          data,
        });
      },
    );
  } catch (err) {
    return res.status(400).json({ error: err, mjml: "error" });
  }
});

app.post("/orders/send-message", (req, res) => {
  const { credentials, firstName, lastName, email, message } = req.body;
  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    credentials,
  };
  const ses = new AWS.SES(sesConfig);
  try {
    ses.sendEmail(
      {
        Source: sesConfig.adminEmail,
        ReturnPath: sesConfig.adminEmail,
        Destination: {
          ToAddresses: ["jamesgower1994@gmail.com"], //FIXME - Change to Franki's email
        },
        Message: {
          Subject: {
            Data: "Contact Form Message - Francesca Jade Creates",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
              Hi Franki,

              A message has been received from the contact form on Francesca Jade Creates.

              This message was sent by ${firstName} ${
                lastName.length > 0 ? lastName : ""
              }.

              "${message}".

              The email address ${firstName} has left to receive a reply from is ${email}.

              The request was made at ${dayjs().format("LLLL")}.
              `,
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

app.post("/orders/send-quote-email", (req, res) => {
  const { user, params, credentials } = req.body;
  const { sponge, size, buttercream, drip, jam, toppings, requests, cake } = params;
  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    credentials,
  };
  const ses = new AWS.SES(sesConfig);
  try {
    ses.sendEmail(
      {
        Source: sesConfig.adminEmail,
        ReturnPath: sesConfig.adminEmail,
        Destination: {
          ToAddresses: ["jamesgower1994@gmail.com"], //FIXME - Change to Franki's email
        },
        Message: {
          Subject: {
            Data: "Cake Request - Francesca Jade Creates",
          },
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>
  </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
    @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-50 {
        width: 50% !important;
        max-width: 50%;
      }
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width:480px) {
      table.mj-full-width-mobile {
        width: 100% !important;
      }

      td.mj-full-width-mobile {
        width: auto !important;
      }
    }
  </style>
</head>

<body style="background-color:#FEB5D5;">
  <div style="background-color:#FEB5D5;">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:100px;">
                              <img height="auto" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                        <p style="font-weight: bold; margin: 0; color: #b8b8b8">Francesca Jade Creates</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;">
                        <p style="font-weight: bold; font-size: 14px">HELLO</p>
                        <p style="font-size: 18px">Franki</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:60%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:310px;" role="presentation" width="310px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:rgba(0,0,0,0.7);">
                        <p style="font-size:18px; padding-bottom: 10px">A Cake request has been sent!</p>
                        <p style="font-size: 16px">${user.name} has requested a quote.</p>
                        <p style="padding: 10px 0">They requested the quote while browsing ${cake}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:0;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:60%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:360px;" role="presentation" width="360px"
        >
          <tr>
            <td style="height:0;line-height:0;">
              &nbsp;
            </td>
          </tr>
        </table>
      <![endif]-->
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#dedede;background-color:#dedede;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#dedede;background-color:#dedede;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                        <p style="text-align:center; text-decoration:underline;font-size:17px">Requested Cake Details</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Sponge: </span>${sponge}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Cake Size: </span>${size}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Buttercream: </span>${buttercream}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Ganache Drip: </span>${drip}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Jam: </span>${jam}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Toppings: </span>${toppings}</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Bespoke Requests: </span>${requests}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                        <p style="text-align:center; text-decoration:underline;font-size:17px">Contact Details</p>
                        <p style="font-size:14px"><span style="font-weight:bold;padding-right:5px">Email: </span>${
                          user.email
                        }</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#b8b8b8;background-color:#b8b8b8;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#b8b8b8;background-color:#b8b8b8;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;">
                        <p style="text-align:center;font-style:italic">This request was mate on ${dayjs().format(
                          "LLLL",
                        )}</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
  </div>
</body>

</html>
`,
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

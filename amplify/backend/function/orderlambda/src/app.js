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
  const { credentials } = req.body;
  const ddb = new AWS.DynamoDB.DocumentClient({
    credentials,
  });
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
  const { order, trackingInfo, credentials } = req.body;

  const ddb = new AWS.DynamoDB.DocumentClient({
    credentials,
  });

  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  };

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

app.post("/orders/send-quote-email", (req, res) => {
  const { user, params } = req.body;
  const { sponge, size, buttercream, drip, jam, toppings, requests, cake } = params;
  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
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
  <title> Hello world </title>
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
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,500" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Roboto:300,500);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-80 {
        width: 80% !important;
        max-width: 80%;
      }

      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }

      .mj-column-per-55 {
        width: 55% !important;
        max-width: 55%;
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

<body>
  <div style="">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:480px;"
            >
          <![endif]-->
              <div class="mj-column-per-80 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:430px;">
                              <a href="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/birthday.png" target="_blank">
                                <img height="auto" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/birthday.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="430" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
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
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:330px;"
            >
          <![endif]-->
              <div class="mj-column-per-55 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:60px;">
                              <img height="60" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:60px;width:100%;font-size:13px;" width="60" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:18px;font-weight:500;line-height:24px;text-align:center;color:#616161;">${
                        user.username
                      } has requested a quote</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 2px #616161;font-size:1px;margin:0px auto;width:100%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #616161;font-size:1px;margin:0px auto;width:280px;" role="presentation" width="280px"
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
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 2px #616161;font-size:1px;margin:0px auto;width:45%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #616161;font-size:1px;margin:0px auto;width:98.5px;" role="presentation" width="98.5px"
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
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px;padding-top:30px;text-align:center;">
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
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:left;color:#616161;">
                        <p>Hi Franki,</p>
                        <p>${
                          user.email
                        } has requested a quote for a cake while browsing ${cake}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:100%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px"
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
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
                        <h4 style="padding: 0; margin: 0">Requested Cake Details</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Sponge:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${sponge}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Cake Size:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${size}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Buttercream:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${buttercream}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Ganache Drip:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${drip}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Jam:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${jam}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Toppings:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${toppings}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Bespoke Requests:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${requests}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:100%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px"
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
          
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
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
    <div style="margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:0px;padding-bottom:100px;text-align:center;">
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
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
                        <h4 style="padding: 0; margin: 0">Contact Information</h4>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Email Address:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${
                          user.email
                        }</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Phone Number:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${
                          user.phoneNumber
                        }</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <p style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:100%;">
                      </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E0E0E0;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px"
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
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, Helvetica, sans-serif;font-size:14px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
                        <p>The request was made on ${dayjs().format("LLLL")}</p>
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

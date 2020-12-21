/* eslint-disable @typescript-eslint/camelcase */
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * TODO
 * [ ] Make checkAdmin function to quickly check if the user is admin or not
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
});

let stripe;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config("./.env");
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);
} else {
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
      ({ image, title, tagline, price, shippingCost }) => `
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
            <td style="direction:ltr;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="width:600px;"
            >
          <![endif]-->
              <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;background-color:#9370f6;">
                <!--[if mso | IE]>
        <table
           bgcolor="#9370f6" border="0" cellpadding="0" cellspacing="0" role="presentation"
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
                        <div style="font-family:Roboto, sans-serif;font-size:14px;line-height:1;text-align:left;color:#fff;">
                          <p>${title}</p>
                          <p>${tagline}</p>
                          <p>£${price.toFixed(2)} + £${shippingCost.toFixed(2)}</p>
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
            description: product.tagline || "",
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
      success_url: `${url}/basket?session_id={CHECKOUT_SESSION_ID}`,
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
    res.status(400).send({ err, dynamodb: "error" });
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
              <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <title>Your order is on the way!</title>
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
      border-radius: 5px
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
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
      .mj-column-per-33-333333333333336 {
        width: 33.333333333333336% !important;
        max-width: 33.333333333333336%;
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

<body style="background-color:#ccd3e0;">
  <div style="background-color:#ccd3e0;">
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
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
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
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:0px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:100px;"> <img alt="Francesca Jade Creates" height="auto" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/logo.png" style="border:none;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;"
                                width="100" /> </td>
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
    <div style="background:#9370f6;background-color:#9370f6;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#9370f6;background-color:#9370f6;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0;text-align:center;">
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
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:28px;padding-right:25px;padding-bottom:18px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:center;color:#ABCDEA;">HELLO
                        <p style="font-size:16px; color:white">${customerName}</p>
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
    <div style="background:#9370f6;background-color:#9370f6;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#9370f6;background-color:#9370f6;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:5px;padding-top:0;text-align:center;">
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
                    <td style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:20px;padding-bottom:0px;padding-left:20px;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:100%;"> </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:560px;" role="presentation" width="560px"
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
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:28px;padding-right:25px;padding-bottom:28px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">
                        <p style="font-size:20px; font-weight:bold">Great News!</p>
                        <p style="font-size:20px; font-weight:bold">Your order is complete and on it's way!</p> 
                        <br /> 
                        <p style="font-size:15px">Thank you for choosing Francesca Jade Creates.</p>
                        <p style="font-size:15px">We hope you enjoy your purchase!</p>
                        <br />
                        <p style="font-size:15px">Tracking and shipping information is listed below</p></div>
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

      <div style="">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ae91ff;background-color:#ae91ff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ae91ff;background-color:#ae91ff;width:100%;">
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
          ${
            trackingInfo !== null &&
            `
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:#ffffff;">
                        <h3 align="center">Tracking Info</h3>
                        ${
                          Array.isArray(trackingInfo)
                            ? trackingInfo
                                .map(
                                  (track) =>
                                    `<p style="font-weight:bold;">${
                                      Object.keys(track)[0]
                                    }</p>
                                    <p style="padding-left:5px">${
                                      Object.values(track)[0]
                                    }</p>`,
                                )
                                .join("")
                            : `<div>
                            <p>There is one tracking number for all products.</p>
                            <p style="text-align: center">${trackingInfo}</p>
                            </div>`
                        }
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
                 `
          }
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
                      <div style="font-family:Roboto, sans-serif;font-size:13px;line-height:1;text-align:left;color:#ffffff;">
                        <h3 align="center">Shipping Address</h3>
                        <p>${customerName},</p> 
                        <p>${address_line1},</p>
                        ${address_line2 !== null ? `<p>${address_line2},</p>` : ""}
                        <p>${city},</p>
                        <p>${address_postcode},</p>
                        <p>${country}</p>
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
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
    <div style="background:#ae91ff;background-color:#ae91ff;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ae91ff;background-color:#ae91ff;width:100%;">
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
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:#FFFFFF;"><strong>Order ID</strong></div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-right:25px;padding-bottom:20px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">${
                        order.id
                      }</div>
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
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:#FFFFFF;"><strong>Order Date</strong></div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-right:25px;padding-bottom:20px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">${dayjs(
                        order.createdAt,
                      ).format("LLLL")}</div>
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
                      <div style="font-family:Roboto, sans-serif;font-size:15px;line-height:1;text-align:center;color:#FFFFFF;"><strong>Total Price</strong></div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:10px;padding-right:25px;padding-bottom:20px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">£${cost.toFixed(
                        2,
                      )}</div>
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
    ${getProducts(order.products)}
    <div style="background:#9370f6;background-color:#9370f6;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#9370f6;background-color:#9370f6;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;">
              <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
              <!--[if mso | IE]>
            </td>
          
            <td
               class="" style="vertical-align:top;width:300px;"
            >
          <![endif]-->
              <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tr>
                    <td align="center" vertical-align="middle" style="font-size:0px;padding:15px 30px;padding-right:25px;padding-bottom:12px;padding-left:25px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                        <tr>
                          <td align="center" bgcolor="#ff80f7" role="presentation" style="border:none;border-radius:10px;cursor:auto;mso-padding-alt:10px 25px;background:#ff80f7;" valign="middle"> <a href="https://mjml.io" style="display:inline-block;background:#ff80f7;color:#FFFFFF;font-family:Roboto;font-size:14px;font-weight:bold;line-height:120%;margin: 0 auto;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:10px;"
                              target="_blank">
              Track My Order
            </a> </td>
                        </tr>
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
    <div style="background:#9370f6;background-color:#9370f6;margin:0px auto;max-width:600px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#9370f6;background-color:#9370f6;width:100%;">
        <tbody>
          <tr>
            <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:5px;padding-top:0;text-align:center;">
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
                    <td style="font-size:0px;padding:10px 25px;padding-top:0;padding-right:20px;padding-bottom:0px;padding-left:20px;word-break:break-word;">
                      <p style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:100%;"> </p>
                      <!--[if mso | IE]>
        <table
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px auto;width:560px;" role="presentation" width="560px"
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
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;padding-right:25px;padding-bottom:20px;padding-left:25px;word-break:break-word;">
                      <div style="font-family:Roboto;font-size:15px;line-height:1;text-align:center;color:#FFFFFF;">Best, <br /> <span style="font-size:15px">Francesca Jade</span></div>
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
  <title> New Quote Received </title>
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
      border-radius: 5px;
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

<body style="background-color:#ccd3e0;height:100%">
  <div style="background-color:#ccd3e0;">
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
                              <img height="60" src="https://francescajadecreatesimages102644-staging.s3.eu-west-2.amazonaws.com/public/logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:60px;width:100%;font-size:13px;padding-top:20px;" width="60" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:18px;font-weight:500;line-height:24px;text-align:center;color:#616161;">${
                        user.name
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
                      <div style="font-family:Roboto, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:left;color:#616161;">
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
                      <div style="font-family:Roboto, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
                        <h4 style="padding: 0; margin: 0">Requested Cake Details</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Sponge:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${sponge}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Cake Size:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${size}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Buttercream:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${buttercream}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Ganache Drip:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${drip}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Jam:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${jam}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Toppings:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${toppings}</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
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
                      <div style="font-family:Roboto, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
                        <h4 style="padding: 0; margin: 0">Contact Information</h4>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0;padding-bottom:0;padding-left:10px;word-break:break-word;">
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:bold;line-height:24px;text-align:left;color:#616161;">
                        <p style="display: inline-block">Email Address:</p>
                        <p style="display: inline-block; font-weight: normal; margin-left: 5px">${
                          user.email
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
                      <div style="font-family:Roboto, sans-serif;font-size:14px;font-weight:300;line-height:24px;text-align:center;color:#616161;">
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

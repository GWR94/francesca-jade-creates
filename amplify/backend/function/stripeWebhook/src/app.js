/* eslint-disable @typescript-eslint/camelcase */
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
const dayjs = require("dayjs");
const localized = require("dayjs/plugin/localizedFormat");

dayjs.extend(localized);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config("./.env");
}

AWS.config.update({
  region: "eu-west-2",
});

const ddb = new AWS.DynamoDB.DocumentClient();

// declare a new express app
const app = express();

app.use(awsServerlessExpressMiddleware.eventContext());

let stripe;
let endpointSecret;
let url;
if (process.env.NODE_ENV === "production") {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  url = "http://localhost:3000";
} else {
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY_TEST);
  endpointSecret = process.env.STRIPE_ENDPOINT_SECRET_TEST;
  url = "https://www.francescajadecreates.co.uk";
}
const ordersTable = process.env.ORDERS_TABLE;

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
    .map(({ image, title, customOptions: options, price, shippingCost }) => {
      const customOptions = options.map((option) => JSON.parse(option));
      return `
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
                          <h3 align="center">${title}</h3>
                          <p>£${price.toFixed(2)} + £${shippingCost.toFixed(2)}</p>

                          <h3 align="center">Custom Options</h3>
                          ${customOptions
                            .filter((option) => option !== null)
                            .map((option) => {
                              const key = Object.keys(option)[0];
                              const value = Object.values(option)[0];
                              return `<p><span style="font-weight:bold">${key}: </span>${
                                key === "Images" ? `${value.length} added` : value
                              }</p>`;
                            })
                            .join("")
                            .toString()}
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
      <![endif]-->`;
    })
    .join("")
    .toString();
};

const emailHandler = (req, res) => {
  const sesConfig = {
    region: "eu-west-1",
    adminEmail: "contact@francescajadecreates.co.uk",
    accessKeyId: process.env.ACCESS_KEY_AWS,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  };

  const ses = new AWS.SES(sesConfig);
  const { data, stripe } = req;
  const {
    shipping: { address, name: customerName },
    metadata: { orderId },
    amount_total,
  } = stripe;
  const { city, country, line1, line2, postal_code } = address;

  const products = data.Attributes.products;

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
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>Thank You For Your Order</title>
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
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;"><p style="font-size:20px; font-weight:bold">Thank you very much for your purchase.</p> <br /> <p style="font-size:15px">Please find the receipt below.</p></div>
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
                        <p style="color:#fff">${customerName},</p> 
                        <p style="color:#fff">${line1},</p>
                        ${line2 !== null ? `<p style="color:#fff">${line2},</p>` : ""}
                        <p style="color:#fff">${city},</p>
                        <p style="color:#fff">${postal_code},</p>
                        <p style="color:#fff">${country}</p>
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
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">${orderId}</div>
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
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">${dayjs().format(
                        "LLLL",
                      )}</div>
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
                      <div style="font-family:Roboto;font-size:13px;line-height:1;text-align:center;color:#FFFFFF;">£${(
                        amount_total / 100
                      ).toFixed(2)}</div>
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
    ${getProducts(products)}
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
                          <td align="center" bgcolor="#ff80f7" role="presentation" style="border:none;border-radius:10px;cursor:auto;mso-padding-alt:10px 25px;background:#ff80f7;" align="middle"> <a href="${url}/account?page=orders" style="display:inline-block;background:#ff80f7;color:#FFFFFF;font-family:Roboto;font-size:14px;font-weight:bold;line-height:120%;margin: 0 auto;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:10px;"
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
           align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 2px #ffffff;font-size:1px;margin:0px;width:560px;" role="presentation" width="560px"
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
          TableName: ordersTable,
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

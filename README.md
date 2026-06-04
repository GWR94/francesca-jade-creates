# Francesca Jade Creates

> **Project status:** This repository documents a production e-commerce build for **Francesca Jade Creates**, a small creative business that is **no longer trading**. The live storefront and AWS backend are **not maintained**; the code is preserved as a reference implementation of a serverless retail platform.

**A serverless e-commerce platform for bespoke handmade creations and custom cakes, with Stripe checkout, Cognito auth, and admin order fulfilment.**

Former production URL: [francescajadecreates.co.uk](https://www.francescajadecreates.co.uk) (may be offline)

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 16, TypeScript, Material-UI, Redux + Redux Thunk, Redux Persist, React Router |
| **Build** | Webpack 4, Babel, ESLint, Prettier, Stylelint |
| **Backend** | AWS Amplify — AppSync (GraphQL), Amazon Cognito, DynamoDB, S3 |
| **Compute** | AWS Lambda (Express via `aws-serverless-express`), API Gateway |
| **Payments** | Stripe Checkout Sessions, Stripe webhooks, `@stripe/stripe-js` |
| **Email** | Amazon SES (order confirmation, shipping, contact, cake quotes) |
| **Testing** | Jest, React Testing Library, Enzyme, `redux-mock-store` |

```
React SPA ──► AppSync GraphQL ──► DynamoDB (@model)
     │              │
     │              └── Cognito (User Pools + Admin group)
     │
     ├── S3 (product / custom-option images)
     │
     └── API Gateway ──► orderlambda (Checkout Sessions, order updates, SES)
                      └── stripeWebhook (signed webhooks → DynamoDB + SES)
```

---

## Overview

Francesca Jade Creates is a full-stack e-commerce application built for a small creative business selling personalised products and made-to-order cakes. The business has since closed; this codebase is **archived and unmaintained** and should not be used as a drop-in production deployment without reviewing dependencies, secrets, and AWS/Stripe configuration.

The frontend is a single-page React application; the backend is entirely serverless on AWS, provisioned and deployed through **AWS Amplify**. At launch, the platform supported public product browsing, authenticated customer accounts, a persistent shopping basket, customisable product options (text and image uploads to S3), Stripe-hosted checkout, and an admin workflow for catalogue management, order processing, and shipping notifications.

---

## Key Features

### Product catalogue & discovery

- Products are stored in **AppSync/DynamoDB** with variants, pricing, tags, and searchable metadata (`@searchable` on the GraphQL `Product` model).
- The storefront exposes themed listings (`/themes`), category routes (`/creates`, `/cakes`), and product detail pages with variant selection and custom feature inputs (images, text fields).
- Admin users in the Cognito **Admin** group can create and update products via protected routes; non-admins are redirected.

### Shopping basket & checkout

- Basket state lives in **Redux** and is persisted to `sessionStorage` via **redux-persist**, so line items survive page refreshes during a session.
- Checkout creates a **Stripe Checkout Session** through the `orderlambda` function: line items are built from basket products (item + postage), billing/shipping are collected in Stripe, and `orderId` is attached as session metadata.
- On success, the client retrieves the session and reflects payment status in the UI.

### Stripe webhooks & order lifecycle

- `stripeWebhook` verifies events with `stripe.webhooks.constructEvent` and handles `checkout.session.completed`.
- Payment intent ID, payment status, and shipping address fields are written back to the **Order** record in DynamoDB.
- A transactional **order confirmation email** (HTML via SES) is sent to the customer and admin, including line items, custom options, and shipping details.

### Authentication & authorization

- **Amazon Cognito User Pools** power sign-up, sign-in, and OAuth redirects (localhost vs production URLs resolved at runtime in `src/index.tsx`).
- On first sign-in, users are synced into the GraphQL `User` model via the `registerUser` mutation.
- **Role-based access**: JWT `cognito:groups` includes `Admin` for protected admin routes and GraphQL auth rules (`@auth` with `groups: ["Admin"]`).

### Admin operations & fulfilment

- Admins manage orders (filter, mark processed, dispatch) and products from the account area.
- Shipping updates trigger **SES** emails with carrier-specific tracking links (Royal Mail, DPD, Yodel, Hermes).
- Contact form and bespoke **cake quote** requests are handled through Lambda + SES endpoints.

### Engineering quality

- **Jest** unit tests cover Redux async actions (mocked AppSync `API.graphql`) and component behaviour (RTL / Enzyme).
- **Webpack** splits dev (HMR, `webpack-dev-server` on port `3000`) and prod (compression, CSS extraction, S3 deploy plugin) builds.
- TypeScript interfaces and ESLint/Prettier enforce consistency across pages, actions, and GraphQL clients.

---

## Architecture & Data Flow

### GraphQL schema (AppSync)

Core models (see `amplify/backend/api/francescajadecreates/schema.graphql`):

| Model | Purpose |
| --- | --- |
| `Product` | Catalogue items with variants, tags, images (`S3Object`), custom option definitions |
| `User` | Profile, saved products, shipping address; linked to orders |
| `Order` | Basket snapshot at purchase time, Stripe IDs, payment/shipping state, fulfilment flags |

Auth rules combine **owner-based** access, **Cognito private** read, **API key** public product read, and **Admin group** full CRUD where required.

### Checkout data flow

```text
1. Client creates Order (GraphQL) with products + userInfo
2. Client POST /orders/create-checkout-session → orderlambda → Stripe Session
3. User completes payment on Stripe-hosted page
4. Stripe POST /webhook → stripeWebhook
5. Webhook updates Order in DynamoDB (payment + address)
6. SES sends order confirmation to customer + admin
7. Admin marks shipped → orderlambda updates DynamoDB + sends tracking email
```

### Amplify backend resources

| Resource | Service |
| --- | --- |
| `francescajadecreates` | AppSync GraphQL API |
| `francescajadecreatesf155220b` | Cognito User Pool |
| `francescajadecreatesimages` | S3 bucket (public product assets) |
| `orderlambda` | Lambda + API Gateway (checkout, orders, SES) |
| `stripeWebhook` | Lambda + API Gateway (Stripe events) |
| `api` | Lambda + API Gateway (shared utilities) |

---

## Prerequisites

- **Node.js** 14+ and npm
- **AWS account** with Amplify CLI configured (`npm install -g @aws-amplify/cli`)
- **Stripe** account (test keys for local development)
- Optional: **TinyMCE** API key for rich-text product descriptions in admin

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/jamesgower/francesca-jade-creates.git
cd francesca-jade-creates
npm install
```

### 2. Configure AWS Amplify

Amplify generates `src/aws-exports.js` (not committed). Link or pull the backend for your environment:

```bash
amplify configure   # one-time AWS profile setup
amplify pull        # or amplify init + amplify push for a new env
```

Ensure Cognito callback URLs include `http://localhost:3000/` for local OAuth.

### 3. Environment variables

Create a `.env` file in the project root (loaded by `dotenv` in dev):

```env
# Stripe (client — injected via webpack EnvironmentPlugin in dev)
STRIPE_PUBLIC_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# S3 (client uploads)
IMAGE_S3_BUCKET=your-amplify-bucket-name

# Optional — admin product editor
TINY_API_KEY=your-tinymce-key
```

Lambda functions (`orderlambda`, `stripeWebhook`) receive secrets from **Amplify environment configuration**, including:

| Variable | Used by |
| --- | --- |
| `STRIPE_SECRET_KEY_TEST` | Checkout + webhook handlers |
| `STRIPE_ENDPOINT_SECRET_TEST` | Webhook signature verification |
| `ORDERS_TABLE` | DynamoDB order updates |
| `ACCESS_KEY_AWS` / `SECRET_KEY_AWS` | SES and DynamoDB from Lambda |

Set these with `amplify env add` / the Amplify console, or in each function’s `.env` for local Lambda emulation.

### 4. Run locally

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) with `webpack-dev-server` and client-side routing (`historyApiFallback`).

### 5. Production build

```bash
npm run build
```

Outputs an optimized bundle under `dist/` (see `webpack.prod.js` for S3 upload and env injection).

### 6. Tests

```bash
npm test
```

Runs Jest in watch mode with `jsdom`, RTL matchers (`setupTests.js`), and GraphQL mocks in action tests.

---

## Project Structure

```text
src/
  actions/          Redux thunks (products, user, basket)
  reducers/         Redux state slices
  pages/            Route-level UI (home, products, payment, accounts, policies)
  graphql/          Amplify-generated queries, mutations, subscriptions
  routes/           App router, Cognito Hub auth listener, admin guards
  common/           Shared components (carousel, image picker, dialogs)
amplify/
  backend/          CloudFormation, GraphQL schema, Lambda source
public/             Static assets
webpack.*.js        Dev/prod bundler config
```

---

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Development server (port 3000) |
| `npm run build` | Production Webpack build |
| `npm test` | Jest unit tests (watch mode) |

---

## Deployment

> **Note:** Deployment steps are documented for historical context only. Do not deploy without rotating credentials and confirming the business domain and Stripe/SES resources are still appropriate.

Backend infrastructure is deployed with the Amplify CLI:

```bash
amplify push
```

Frontend static assets are built with `npm run build` and published to S3 (configured in `webpack.prod.js` via `webpack-s3-plugin`). Stripe webhook endpoints must point to the deployed `stripeWebhook` API Gateway URL in the Stripe Dashboard.

---

## Security Notes

- Never commit `.env`, `aws-exports.js`, or AWS/Stripe secrets.
- GraphQL access is enforced with Cognito JWTs, API keys (read-only public catalogue), and Admin group rules.
- Stripe webhooks require valid signing secrets; raw body parsing is used only on the webhook route.
- Review production Stripe keys and SES sender verification before go-live (some handlers still reference test keys in source — update before production cutover).

---

## License

ISC — see [package.json](./package.json).

---

## Author

**James Gower** — [GitHub](https://github.com/jamesgower)

For questions about the codebase, open an issue in this repository. The former business website may no longer be available.

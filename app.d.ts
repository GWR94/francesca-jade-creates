/** Allows importing of images through webpack */
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";
declare module "*.png";
declare module "*.wav";
declare module "*.mp3";
declare module "client-compress";
declare module "aws-exports.js";

import * as ts from "typescript";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_SECRET_KEY: string;
      STRIPE_PUBLIC_KEY: string;
    }
  }
}

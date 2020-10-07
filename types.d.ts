declare module "client-compress";
declare module "@splidejs/react-splide";

//@ts-expect-error
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_KEY_AWS: string;
      SECRET_KEY_AWS: string;
      BUCKET_REGION: string;
      BUCKET_NAME: string;
      STRIPE_PUBLIC_KEY_TEST: string;
      STRIPE_SECRET_KEY_TEST: string;
      STRIPE_PUBLIC_KEY: string;
      STRIPE_SECRET_KEY: string;
      TINY_API_KEY: string;
    }
  }
}

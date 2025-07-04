import ImageKit from "imagekit";
import { confEnv } from "./env";

export const imagekit = new ImageKit({
  publicKey: confEnv.IMAGE_KIT_PUBLIC_KEY,
  privateKey: confEnv.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: confEnv.URL_ENDPOINT,
});

import { Platform } from "@/interfaces/platform.interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import darazLogo from "@/public/daraz.png";
import amazonLogo from "@/public/amazon.png";
import shopifyLogo from "@/public/shopify.png";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum SUPPORTED_PLATFORMS {
  SHOPIFY = "shopify",
  DARAZ = "daraz",
  AMAZON = "amazon",
}

// add type
export const SUPPORTED_PLATFORMS_INFO: Record<SUPPORTED_PLATFORMS, Platform> = {
  [SUPPORTED_PLATFORMS.SHOPIFY]: {
    id: SUPPORTED_PLATFORMS.SHOPIFY,
    name: "Shopify",
    icon: shopifyLogo,
    oauthUrl: `https://kkcugt-ef.myshopify.com/admin/oauth/authorize?client_id=94e7b64f38db08be7ec1bbf626d624fd&scope=read_products,write_products,read_orders&redirect_uri=https://evolvebitx.netlify.app/callback&state=xyz1234`,
    description: "Connect your Shopify store to sync products",
  },
  [SUPPORTED_PLATFORMS.DARAZ]: {
    id: SUPPORTED_PLATFORMS.DARAZ,
    name: "Daraz",
    icon: darazLogo,
    oauthUrl:
      `https://api.daraz.pk/oauth/authorize?spm=a2o9m.11193531.0.0.97802891wGBXMU&response_type=code&force_auth=true&redirect_uri=https://evolvebitx.netlify.app/callback&client_id=504082`,
    description: "List products on Daraz marketplace",
  },
  [SUPPORTED_PLATFORMS.AMAZON]: {
    id: SUPPORTED_PLATFORMS.AMAZON,
    name: "Amazon",
    icon: amazonLogo,
    oauthUrl: "https://www.amazon.com/ap/oa",
    description: "Coming soon - Amazon marketplace integration",
  },
};

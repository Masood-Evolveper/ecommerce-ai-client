import { SUPPORTED_PLATFORMS } from "@/lib/utils";
import { StaticImageData } from "next/image";

export interface Platform {
  id: SUPPORTED_PLATFORMS;
  name: string;
  description: string;
  icon: StaticImageData;
  oauthUrl: string;
  connected?: boolean;
  apiKey?: string;
}
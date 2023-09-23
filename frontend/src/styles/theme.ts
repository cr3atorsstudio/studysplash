import { extendTheme } from "@chakra-ui/react";
import { Outfit } from "next/font/google";

const Outfit_normal = Outfit({
  subsets: ["latin"],
});

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: Outfit_normal.style.fontFamily,
      },
    },
  },
  colors: {
    brand: {
      student: "#FF7777",
      teacher: "#4B88A2",
      primaryText: "#252627",
    },
  },
});

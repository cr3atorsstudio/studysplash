import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import { M_PLUS_1 } from "next/font/google";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { globalStore } from "@/store/global";

export const M_PLUS_1_bold = M_PLUS_1({
  weight: "900",
  subsets: ["latin"],
});

const WithSubnavigation = () => {
  const isConnected = useRecoilValue(globalStore.isConnected);

  return (
    <Box position="fixed" w="100%" as="header" zIndex={9999} bg={"#FFF9FB"}>
      <Flex h={"80px"} py={{ base: 2 }} px={{ base: 4 }} align={"center"}>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align={"center"}
        >
          <Link href={"/"}>
            <Image src="/StudySplash.png" w={"180px"} />
          </Link>
        </Flex>

        <ConnectButton isConnected={isConnected} />
      </Flex>
    </Box>
  );
};

export default WithSubnavigation;

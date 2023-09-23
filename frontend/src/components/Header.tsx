import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useBreakpointValue,
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
    <Box position="fixed" w="100%" as="header" zIndex={9999}>
      <Flex
        bg={"white"}
        color={"white"}
        h={"80px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        align={"center"}
      >
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align={"center"}
        >
          <Link href={"/"}>
            <Text
              textAlign={useBreakpointValue({ base: "center", md: "left" })}
              color={"brand.student"}
              fontFamily={"'Bukhari Script', sans-serif"}
              fontSize={{ md: "3xl", base: "xl" }}
              ml={{ md: 0, base: 2 }}
            >
              StudySplash
            </Text>
          </Link>
        </Flex>

        <ConnectButton
          isConnected={isConnected}
          label={isConnected ? "Launch App" : "Connect Wallect"}
        />
      </Flex>
    </Box>
  );
};

export default WithSubnavigation;

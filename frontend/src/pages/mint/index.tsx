import SharedModal from "@/components/SharedModal";
import Layout from "@/layout";
import {
  Button,
  ModalBody,
  Stack,
  Text,
  Flex,
  Image,
  HStack,
} from "@chakra-ui/react";
import type { NextPageWithLayout } from "../_app";
import Link from "next/link";
import { ReactElement, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Mint: NextPageWithLayout = () => {
  const { address, isConnecting, isDisconnected } = useAccount();

  const router = useRouter();

  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, isConnecting, isDisconnected]);
  return (
    <Flex flexDir={"column"} alignItems={"center"} mb={5} mt={40}>
      <Flex flexDir={"column"} alignItems={"center"}>
        <Text
          mb={10}
          textAlign={"center"}
          fontSize={"4xl"}
          color={"#252627"}
          fontWeight={500}
        >
          Welcome to StudySplash!
          <br />
          Do you want to register as...
        </Text>
        <Flex justify={"center"} mb={5}>
          <Stack direction={"row"} gap={2}>
            <Link href={"/mint/teacher"}>
              <Button
                bg={"brand.teacher"}
                size={"lg"}
                w={"150px"}
                color={"white"}
              >
                Teacher
              </Button>
            </Link>

            <Link href={"/mint/student"}>
              <Button
                bg={"brand.student"}
                size={"lg"}
                w={"150px"}
                color={"white"}
              >
                Student
              </Button>
            </Link>
          </Stack>
        </Flex>
        <HStack>
          <Image src="/avatars/Group 3.png" />
          <Image src="/avatars/Group 1.png" />
        </HStack>
      </Flex>
    </Flex>
  );
};

Mint.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Mint;

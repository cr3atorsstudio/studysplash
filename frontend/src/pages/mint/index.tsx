import SharedModal from "@/components/SharedModal";
import Layout from "@/layout";
import { Button, ModalBody, Stack, Text, Flex } from "@chakra-ui/react";
import type { NextPageWithLayout } from "../_app";
import Link from "next/link";
import { ReactElement } from "react";

const Mint: NextPageWithLayout = () => {
  return (
    <SharedModal size="md">
      <ModalBody>
        <Text
          mb={10}
          textAlign={"center"}
          fontSize={"2xl"}
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
      </ModalBody>
    </SharedModal>
  );
};

Mint.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Mint;

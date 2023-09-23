import { Flex, Heading } from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "@/layout";

const Home: NextPageWithLayout = () => {
  return (
    <Flex justify={"center"}>
      <Heading mt={10} color={"white"}>
        Landing Page!!
      </Heading>
    </Flex>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

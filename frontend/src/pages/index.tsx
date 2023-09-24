import { Flex, Heading, Spinner } from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";
import { ReactElement, useEffect } from "react";
import Layout from "@/layout";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address && !isConnecting && !isDisconnected) {
      router.push("/mint");
    }
  }, [address, isConnecting, isDisconnected]);
  return (
    <Flex justify={"center"}>
      {isConnecting && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.teacher"
          size="xl"
        />
      )}
    </Flex>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

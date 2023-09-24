import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";
import { ReactElement, useEffect } from "react";
import Layout from "@/layout";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/mint");
    }
  }, [address]);

  return (
    <Flex justify={"center"} mt={20}>
      <Card>
        <CardBody display={"flex"} flexDir={"column"} alignItems={"center"}>
          <Text fontSize={"3xl"} m={20} px={20}>
            <Text as={"span"} fontSize={"6xl"}>
              StudySplash{" "}
            </Text>
            is a groundbreaking cohort-based learning platform <br />
            where users are uniquely identified by ERC6551. <br /> <br /> To get
            started, please connect your wallet from clicking wallet icon on the
            top left corner 👆
          </Text>
          <Image w={"80%"} src="/avatars/top.png" />
        </CardBody>
      </Card>
    </Flex>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

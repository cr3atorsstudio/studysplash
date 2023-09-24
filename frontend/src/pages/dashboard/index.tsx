import DashboardLayout from "@/layout/dashboard";
import { globalStore } from "@/store/global";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/navigation";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  Accordion,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Tag,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ActivityLog from "@/components/ActivityLog";
import Messages from "@/components/Messages";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import useSendNotification from "@/hooks/useSendNotification";
import {
  useSignMessage,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useQuery } from "@airstack/airstack-react";
import Link from "next/link";
import { setTimeout } from "timers";
import { APE_ABI } from "@/config/ape";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;
const STUDENT_WALLET_ADDRESS = "0x15BC88b803aCB95BAEca7C549B20A72b1cC5dD25";

const query = `query MyQuery {
  TokenBalances(
    input: {filter: {tokenAddress: {_in: "0xbA92164aC188621c9F67F4aB8C9a28bD7Bfd19f0"}}, blockchain: polygon}
  ) {
    TokenBalance {
      tokenNfts {
        tokenId
        tokenURI
      }
      owner {
        addresses
      }
    }
  }
}`;

const Dashboard: NextPageWithLayout = () => {
  const hasNft = useRecoilValue(globalStore.hasNft);
  const router = useRouter();
  const walletAddress = useRecoilValue(globalStore.userAddress);
  const [tokenUri, setTokenUri] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    image: "",
    description: "",
    attributes: [
      {
        value: "",
      },
    ],
  });
  const [userInfo, setUserInfo] = useState({
    image: "",
    role: "",
    name: "",
  });
  const [pastGroup, setPastGroup] = useState([
    "BlockBustersStudy /",
    "MintMindset /",
    "BitBrains /",
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [point, setPoint] = useState(100);
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(query, { cache: false });
  const toast = useToast();

  const nfts = data?.TokenBalances?.TokenBalance;

  function pullJson() {
    if (tokenUri === "") return;
    fetch(tokenUri, {})
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setUserInfo({
          image: data?.image,
          role: data?.attributes[0].value,
          name: data?.name,
        });
      });
  }

  useEffect(() => {
    nfts?.forEach((nft: any) => {
      const isOwner = nft?.owner.addresses.includes(walletAddress);

      // TODO: delete ! after testing
      if (!isOwner) {
        setTokenUri(nft?.tokenNfts.tokenURI);
      }
    });

    if (tokenUri === "") return;

    pullJson();
  }, [tokenUri, nfts]);

  const color = userInfo.role === "teacher" ? "brand.teacher" : "brand.student";

  useEffect(() => {
    if (!hasNft) {
      router.push("/mint");
    }
  }, []);

  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const {
    subscribe,
    unsubscribe,
    isSubscribed,
    isUnsubscribing,
    isSubscribing,
  } = useManageSubscription(account);

  const { signMessageAsync } = useSignMessage();
  const { handleSendNotification, isSending } = useSendNotification();

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
  });

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  useEffect(() => {
    if (!Boolean(address)) return;
    setAccount(`eip155:1:${address}`);
  }, [signMessage, address, setAccount]);

  useEffect(() => {
    if (!identityKey) {
      handleRegistration();
    }
  }, [handleRegistration, identityKey]);
  const { config, error } = usePrepareContractWrite({
    address: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
    abi: APE_ABI,
    functionName: "transfer",
    chainId: 5,
    args: [STUDENT_WALLET_ADDRESS, 100],
  });
  console.log("config", config);
  //@ts-ignore
  const {
    data: writeData,
    isError: isWriteError,
    isLoading: isContractWriteLoading,
    write,
  } = useContractWrite(config);

  const onCloseGroup = useCallback(() => {
    onClose();

    setLoading(true);
    console.log("transfer ape coin");
    write?.();
  }, [write]);

  const { isLoading: isWaitContractLoading, isSuccess: isWaitContractSuccess } =
    useWaitForTransaction({
      hash: writeData?.hash,
    });

  useEffect(() => {
    //TODO: 失敗したとき
    if (isWaitContractSuccess) {
      toast({
        title: `Sent point to students successfully!`,
        status: "success",
        duration: 2000,
      });
      setPastGroup([...pastGroup, `StudySplash /`]);
      setUserData(null);
      setPoint(150);
      setLoading(false);
    }
  }, [isWaitContractSuccess]);
  console.log(isWaitContractSuccess);
  console.log("writeData", writeData);

  const handleTestNotification = useCallback(async () => {
    if (isSubscribed) {
      handleSendNotification({
        title: "Student registered!",
        body: "A new student has registered to your group!",
        icon: "https://studysplash.s3.us-east-1.amazonaws.com/assets/students_1.png",
        url: "https://studysplash.vercel.app",
        type: "promotional",
      });
    }
  }, [handleSendNotification, isSubscribed]);

  console.log(pastGroup);
  return (
    <Box display={"relative"} height={"100vh"}>
      <Spinner display={loading ? "absolute" : "none"} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose a groun to close</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Select>
              <option>TokenThinkers</option>
              <option>StudySplash</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button bg={"red.500"} color="white" onClick={onCloseGroup}>
              Close the group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex flexDir={"column"} p={10} w={"100%"}>
        <Flex w="full">
          <VStack w="800px">
            {userInfo?.image && (
              <Image
                src={userInfo?.image}
                w={"300px"}
                h={"300px"}
                rounded={"32px"}
                align={"top"}
              />
            )}

            <Card w="80%" rounded={"20px"} mt={2}>
              <CardBody>
                <HStack justify={"space-between"} mx={5}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="17.75"
                      fill="#78B4CE"
                      stroke="#4B88A2"
                      strokeWidth="0.5"
                    />
                    <circle cx="18" cy="18" r="12" fill="#4B88A2" />
                    <path
                      d="M15.61 19.14V17.664H19.012C19.48 17.664 19.894 17.568 20.254 17.376C20.626 17.184 20.914 16.914 21.118 16.566C21.334 16.218 21.442 15.804 21.442 15.324C21.442 14.844 21.334 14.43 21.118 14.082C20.914 13.734 20.626 13.464 20.254 13.272C19.894 13.08 19.48 12.984 19.012 12.984H15.61V11.508H19.12C19.888 11.508 20.572 11.664 21.172 11.976C21.784 12.288 22.264 12.732 22.612 13.308C22.972 13.872 23.152 14.544 23.152 15.324C23.152 16.092 22.972 16.764 22.612 17.34C22.264 17.904 21.784 18.348 21.172 18.672C20.572 18.984 19.888 19.14 19.12 19.14H15.61ZM14.476 24V11.508H16.168V24H14.476Z"
                      fill="white"
                    />
                  </svg>
                  <Text fontSize={"4xl"} fontWeight={700}>
                    {point}
                  </Text>
                </HStack>
              </CardBody>
            </Card>

            <Card w="80%" rounded={"20px"} mt={2}>
              <CardHeader>
                <Text fontSize={"xl"}>Currently enrolled students</Text>
              </CardHeader>
              <CardBody>
                <HStack justify={"space-between"} mx={5}>
                  <Image
                    w={12}
                    h={12}
                    rounded={"full"}
                    src="https://studysplash.s3.us-east-1.amazonaws.com/assets/students_1.png"
                  />
                  <Image
                    w={12}
                    h={12}
                    rounded={"full"}
                    src="https://studysplash.s3.us-east-1.amazonaws.com/assets/students_2.png"
                  />
                  <Image
                    w={12}
                    h={12}
                    rounded={"full"}
                    src="https://studysplash.s3.us-east-1.amazonaws.com/assets/students_3.png"
                  />
                  <Image
                    w={12}
                    h={12}
                    rounded={"full"}
                    src="https://studysplash.s3.us-east-1.amazonaws.com/assets/students_4.png"
                  />
                </HStack>
              </CardBody>
            </Card>
          </VStack>

          <VStack w="full" ml={5} mt={1} align={"start"}>
            <Flex align={"center"}>
              <Tag
                color={"white"}
                bg={color}
                rounded={"full"}
                size={"lg"}
                h="20px"
                mr={2}
              >
                {userInfo?.role}
              </Tag>
              <Text fontSize={"5xl"} fontWeight={500}>
                {userInfo?.name}
              </Text>
            </Flex>

            <Card rounded={"2xl"} px={2} w="full">
              <HStack justify={"space-between"}>
                <CardHeader
                  fontSize={"xl"}
                  fontWeight={500}
                  color={"brand.teacher"}
                >
                  Currently Hosting Groups
                </CardHeader>
                <Text fontWeight={500} color={"#FF7777"}>
                  More Details
                </Text>
              </HStack>

              <CardBody justifyContent={"center"} pt={0}>
                <Flex flexDir={"column"}>
                  <Link href={"/study"} target="_blank">
                    <Text
                      fontWeight={500}
                      cursor={"pointer"}
                      fontSize={"xl"}
                      _hover={{
                        color: "blue.500",
                      }}
                    >
                      {userData?.description.slice(0, 16)}
                    </Text>
                  </Link>

                  <Text p={3} fontSize={"md"} color={"gray.500"}>
                    {userData?.description}
                  </Text>
                </Flex>

                <Flex flexDir={"column"}>
                  <Text fontWeight={500} fontSize={"xl"}>
                    TokenThinkers
                  </Text>
                  <Text p={3} fontSize={"md"} color={"gray.500"}>
                    Dive deep into the world of cryptocurrency with us! We're a
                    passionate group of crypto enthusiasts dedicated to
                    understanding the intricacies of blockchain technology and
                    the future of digital currencies. From Bitcoin to Ethereum
                    and beyond, join us in our quest to demystify the token
                    universe.
                  </Text>
                </Flex>
              </CardBody>
            </Card>

            <Card rounded={"2xl"} h={"160px"} px={2} w="full">
              <HStack justify={"space-between"}>
                <CardHeader fontSize={"xl"} fontWeight={500} color={"gray.600"}>
                  Past Hosted Groups
                </CardHeader>{" "}
                <Text fontWeight={500} color={"#FF7777"} cursor={"pointer"}>
                  More Details
                </Text>
              </HStack>

              <CardBody justifyContent={"center"}>
                <HStack>
                  {pastGroup.map((course) => (
                    <Text>{course}</Text>
                  ))}
                </HStack>
              </CardBody>
            </Card>
            <Flex ml="auto">
              <Button
                w={"200px"}
                onClick={onOpen}
                bg={"red.500"}
                color={"white"}
              >
                Close group
              </Button>
            </Flex>
          </VStack>
        </Flex>

        <Accordion defaultIndex={[1]} allowToggle mt={10} rounded="xl">
          {isSubscribed ? (
            <Messages />
          ) : (
            <Tooltip
              label={
                !Boolean(address)
                  ? "Connect your wallet first."
                  : "Register your account."
              }
              hidden={Boolean(account)}
            >
              <Button
                onClick={subscribe}
                borderColor={"brand.teacher"}
                color="brand.teacher"
                rounded="full"
                variant="outline"
                w="fit-content"
                alignSelf="center"
                isLoading={isSubscribing}
                loadingText="Subscribing..."
                isDisabled={!Boolean(address) || !Boolean(account)}
              >
                Subscribe Notification from Students
              </Button>
            </Tooltip>
          )}
        </Accordion>

        {isSubscribed && (
          <Flex mt={3}>
            <Button
              onClick={unsubscribe}
              variant="outline"
              isDisabled={!isW3iInitialized || !account}
              colorScheme="red"
              isLoading={isUnsubscribing}
              loadingText="Unsubscribing..."
              rounded="full"
            >
              Unsubscribe
            </Button>
            <Button
              onClick={handleTestNotification}
              variant="outline"
              isDisabled={!isW3iInitialized || !account}
              colorScheme="red"
              isLoading={isUnsubscribing}
              loadingText="Unsubscribing..."
              rounded="full"
            >
              Test Notification
            </Button>
          </Flex>
        )}

        <Heading mt={10} mb={3} as={"h6"}>
          Activity Log
        </Heading>
        <ActivityLog />
      </Flex>
    </Box>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;

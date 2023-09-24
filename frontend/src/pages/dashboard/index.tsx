import DashboardLayout from "@/layout/dashboard";
import { globalStore } from "@/store/global";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/navigation";
import { ReactElement, useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Image,
  Tag,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import ActivityLog from "@/components/ActivityLog";
import Messages from "@/components/Messages";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useW3iAccount,
} from "@web3inbox/widget-react";
import useSendNotification from "@/hooks/useSendNotification";
import { useSignMessage, useAccount } from "wagmi";
import { useQuery } from "@airstack/airstack-react";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const query = `query MyQuery {
  Accounts(
    input: {filter: {tokenAddress: {_in: ["0x26727ed4f5ba61d3772d1575bca011ae3aef5d36"]}}, blockchain: ethereum, limit: 200}
  ) {
    Account {
      address {
        addresses
        domains {
          name
          isPrimary
        }
        socials {
          dappName
          profileName
        }
      }
    }
  }
}`;

const Dashboard: NextPageWithLayout = () => {
  const hasNft = useRecoilValue(globalStore.hasNft);
  const router = useRouter();

  const { data, loading, error } = useQuery(query, { cache: false });

  // TODO: get from contract
  const role = "teacher";
  const color = role === "teacher" ? "brand.teacher" : "brand.student";

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

  const { messages, deleteMessage } = useMessages(account);

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
  return (
    <>
      {hasNft && (
        <Flex flexDir={"column"} p={10} w={"100%"}>
          <Flex w="full">
            <VStack w="800px">
              <Image
                src="https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_1.png"
                w={"300px"}
                h={"300px"}
                rounded={"32px"}
                align={"top"}
              />
              <Card w="full" rounded={"20px"} mt={2}>
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
                      100
                    </Text>
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
                  Teacher
                </Tag>
                <Text fontSize={"5xl"} fontWeight={500}>
                  Alice
                </Text>
              </Flex>

              <Card rounded={"2xl"} h={"160px"} px={2} w="full">
                <HStack justify={"space-between"}>
                  <CardHeader fontWeight={500}>
                    Currently Perticipating
                  </CardHeader>
                  <Text fontWeight={500} color={"#FF7777"}>
                    More Details
                  </Text>
                </HStack>

                <CardBody justifyContent={"center"}>
                  <HStack>
                    <Text fontSize={"2xl"}>🐼</Text>
                    <Text fontWeight={500} cursor={"pointer"} fontSize={"xl"}>
                      Creating and Managing Crypto Wallets
                    </Text>
                  </HStack>
                </CardBody>
              </Card>

              <Card rounded={"2xl"} h={"160px"} px={2} w="full">
                <HStack justify={"space-between"}>
                  <CardHeader fontWeight={500}>Past Groups</CardHeader>
                  <Text fontWeight={500} color={"#FF7777"} cursor={"pointer"}>
                    More Details
                  </Text>
                </HStack>

                <CardBody justifyContent={"center"}>
                  <HStack>
                    <Text fontSize={"2xl"}>☘️</Text>
                    <Text fontWeight={500} cursor={"pointer"} fontSize={"xl"}>
                      Creating and Managing Crypto Wallets
                      Building B2B Marketing
                    </Text>
                  </HStack>
                </CardBody>
              </Card>
            </VStack>
          </Flex>

          {isSubscribed && (
            <Accordion defaultIndex={[1]} allowToggle mt={10} rounded="xl">
              <Messages />
            </Accordion>
          )}
          {isSubscribed ? (
            <HStack mt={3}>
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
            </HStack>
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
                Subscribe
              </Button>
            </Tooltip>
          )}

          <Heading textAlign={"center"} as={"h3"} color={"white"}>
            Activity Log
          </Heading>
          <ActivityLog />
        </Flex>
      )}
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;

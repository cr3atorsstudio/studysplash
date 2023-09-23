import {
  Flex,
  Button,
  Text,
  Stack,
  Input,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Grid,
  useRadioGroup,
} from "@chakra-ui/react";
import {
  CredentialType,
  IDKitWidget,
  ISuccessResult,
  useIDKit,
} from "@worldcoin/idkit";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { globalStore } from "@/store/global";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "@/pages/_app";
import Layout from "@/layout";
import { ReactElement, useCallback } from "react";
import Registration from "@/components/Registration";
import CustomRadio from "@/components/CustomRadio";

const RoleMint: NextPageWithLayout = () => {
  const { open, setOpen } = useIDKit();
  const setProof = useSetRecoilState(globalStore.proof);
  const proof = useRecoilValue(globalStore.proof);

  const setNft = useSetRecoilState(globalStore.hasNft);

  const router = useRouter();
  const role = router.query.role;

  const color = role === "teacher" ? "brand.teacher" : "brand.student";

  const disableFrom = role === "teacher" && proof === "";

  const onSuccess = (result: ISuccessResult) => {
    setProof(result.proof);
  };

  const onMint = useCallback(() => {
    setNft(true);
    router.push("/dashboard");
  }, []);

  const onWorldcoin = useCallback(() => {
    setProof("ok");
    // setOpen(true);
    router.push("/mint/teacher/register");
  }, []);

  const handleChange = useCallback((value: any) => {}, []);

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: "avatar1",
    onChange: handleChange,
  });

  const students = [
    {
      name: "avatar1",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/students_1.png",
    },
    {
      name: "avatar2",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/students_2.png",
    },
    {
      name: "avatar3",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/students_3.png",
    },
    {
      name: "avatar4",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/students_4.png",
    },
  ];

  return (
    <>
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID ?? ""}
        action="verify"
        onSuccess={onSuccess}
        walletConnectProjectId={
          process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
        }
        credential_types={[CredentialType.Phone]}
      />
      <Registration role={role as string}>
        {role === "teacher" && (
          <Flex flexDir={"column"} alignItems={"center"} mb={5} mt={5}>
            <Text align={"center"}>Please verify with worldcoin first</Text>
            <Button bg={color} color={"white"} onClick={onWorldcoin} my={3}>
              Verify with worldcoin
            </Button>
          </Flex>
        )}

        {role === "student" && (
          <Flex flexDir={"column"} alignItems={"center"} mb={5} mt={5}>
            <Flex justify={"center"} mb={5}>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Username"
                    size="md"
                    disabled={disableFrom}
                  />

                  <FormLabel as="legend" mt={5}>
                    Choose image
                  </FormLabel>
                  <RadioGroup defaultValue="Itachi">
                    <Grid templateColumns="repeat(2, 1fr)">
                      {students.map((avatar) => {
                        return (
                          <CustomRadio
                            key={avatar.name}
                            image={avatar.image}
                            {...getRadioProps({ value: avatar.name })}
                          />
                        );
                      })}
                    </Grid>
                  </RadioGroup>

                  <Button
                    bg={color}
                    color={"white"}
                    isDisabled={disableFrom}
                    mt={5}
                    onClick={onMint}
                    w={"full"}
                  >
                    Mint NFT
                  </Button>
                </FormControl>
              </Stack>
            </Flex>
          </Flex>
        )}
        <Button
          color={color}
          bg={"transparent"}
          _hover={{
            bg: "transparent",
          }}
          onClick={() => router.push("/mint")}
        >
          Cancel
        </Button>
      </Registration>
    </>
  );
};
RoleMint.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default RoleMint;

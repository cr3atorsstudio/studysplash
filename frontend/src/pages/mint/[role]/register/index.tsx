import { NextPageWithLayout } from "../../../_app";
import { ReactElement, useCallback, useState } from "react";
import Layout from "@/layout";
import Registration from "@/components/Registration";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  RadioGroup,
  Stack,
  useRadioGroup,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import CustomRadio from "@/components/CustomRadio";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { globalStore } from "@/store/global";

const Register: NextPageWithLayout = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const setIsLoading = useSetRecoilState(globalStore.isLoading);
  const isLoading = useRecoilValue(globalStore.isLoading);
  const role = router.query.role;
  const color = "brand.teacher";
  const toast = useToast();

  const teachers = [
    {
      name: "avatar1",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_1.png",
    },
    {
      name: "avatar2",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_2.png",
    },
    {
      name: "avatar3",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_3.png",
    },
    {
      name: "avatar4",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_4.png",
    },
  ];

  const handleChange = (value: any) => {
    toast({
      title: `The image changed to ${value}!`,
      status: "success",
      duration: 2000,
    });
  };

  const onMint = useCallback(() => {
    // mintNFTを呼び出す
    setIsLoading(true);
    console.log("mintNFT");
    setIsLoading(false);

    router.push("/mint/teacher/group");
  }, []);

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: "avatar1",
    onChange: handleChange,
  });

  const canMint = username !== "" && value !== "";

  return (
    <Registration role={"teacher"}>
      <Divider my={5} borderColor={"brand.teacher"} />

      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Username"
          size="md"
          onChange={(e) => setUsername(e.currentTarget.value)}
          value={username}
        />

        <FormLabel as="legend" mt={5}>
          Choose image
        </FormLabel>
        <RadioGroup defaultValue="Itachi">
          <Grid templateColumns="repeat(2, 1fr)">
            {teachers.map((avatar) => {
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
          isDisabled={!canMint}
          bg={color}
          color={"white"}
          mt={5}
          w={"full"}
          isLoading={isLoading}
          onClick={onMint}
        >
          Mint NFT
        </Button>
      </FormControl>
    </Registration>
  );
};

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Register;

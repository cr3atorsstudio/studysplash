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
import { uploadUserMetadataToS3 } from "@/lib/s3upload";

const Register: NextPageWithLayout = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const setIsLoading = useSetRecoilState(globalStore.isLoading);
  const isLoading = useRecoilValue(globalStore.isLoading);
  const role = router.query.role;
  const color = "brand.teacher";
  const toast = useToast();

  const teachers = [
    {
      name: "1",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_1.png",
    },
    {
      name: "2",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_2.png",
    },
    {
      name: "3",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_3.png",
    },
    {
      name: "4",
      image:
        "https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_4.png",
    },
  ];

  const handleChange = (value: any) => {
    setImageUrl(
      `https://studysplash.s3.us-east-1.amazonaws.com/assets/teacher_${value}.png`
    );
    toast({
      title: `The image changed to avatar${value}!`,
      status: "success",
      duration: 2000,
    });
  };
  console.log("imageUrl", imageUrl);

  const uploadToS3 = async (jsonData: any) => {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jsonContent: jsonData }),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Uploaded successfully:", result.url);
    } else {
      console.error("Error uploading:", result.error);
    }
  };

  const onMint = useCallback(async () => {
    // mintNFTを呼び出す
    setIsLoading(true);
    const json = {
      name: username,
      description:
        "StudySplash🌊📚 is the cutting-edge cohort-based learning platform in the web3 space. Leveraging ERC6551, it records user interactions and course participations on the blockchain, fostering vibrant communication within cohorts and maintaining consistent learning motivation.",
      image: imageUrl,
      attributes: [
        {
          trait_type: "user_type",
          value: "teacher",
        },
      ],
    };
    await uploadToS3(json);
    setIsLoading(false);

    router.push("/mint/teacher/group");
  }, [username, imageUrl]);

  const { value, getRadioProps } = useRadioGroup({
    defaultValue: "1",
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

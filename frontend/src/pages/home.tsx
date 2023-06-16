import { Box, Button, Container, Flex, Stack, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { useState } from "react";
import { HomeSideMenu } from "../components/HomeSideMenu";
import { useCurrentData } from "../utils/useCurrentDate";

const HomePage: NextPage = () => {
  const currentData = useCurrentData();
  const [diary, setDiary] = useState("");
  const [checkedDiary, setCheckedDiary] = useState("");

  const onClickCheck = async () => {
    const response = await axios
      .post("/api/gpt/check", {
        message: diary,
      })
      .then((res) => res.data);

    console.log(response);

    if (!response.data.content) return;
    setCheckedDiary(response.data.content);
  };

  const onClickStartTalk = async () => {
    const response = await axios.get("/api/chat/create").then((res) => res.data);
    console.log(response);
  };

  return (
    <Container maxW="container.lg">
      <Flex gap="8">
        <Box w="30%">
          <HomeSideMenu />
        </Box>

        <Stack w="70%">
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="semibold">
              Diary
            </Text>
            <Text bgColor="gray.50" borderRadius="4" px="4" py="2">
              {currentData}
            </Text>
          </Flex>
          <Textarea minH="200px" onChange={(e) => setDiary(e.target.value)} />

          <Flex gap="4" justifyContent="flex-end">
            <Button onClick={onClickCheck}>添削する</Button>
            <Button onClick={onClickStartTalk}>AIとTalkする</Button>
          </Flex>

          <Stack>
            <Text>{checkedDiary}</Text>
          </Stack>
        </Stack>
      </Flex>
    </Container>
  );
};

export default HomePage;

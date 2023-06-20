import { Box, Container, Flex, Text, Image, Center, Button, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  const onClickDiaryTalk = () => {
    router.push("/dashboard");
  };

  const onClickFreeTalk = () => {
    localStorage.removeItem("diary");
    router.push("/talk");
  };

  return (
    <Box h="100vh">
      <Box backgroundColor="messenger.400" h="100%">
        <Container h="100%" maxW="container.lg">
          <Center h="100%">
            <Flex alignItems="center" gap="16">
              <Box w="80%">
                <Text color="whiteAlpha.900" fontSize="6xl" fontWeight="black">
                  Your Personal <br />
                  English AI Tutor
                </Text>
                <Text color="whiteAlpha.700" fontWeight="semibold">
                  あなたの身近な出来事を日記にして、AIと英語で会話しよう
                </Text>
                <Stack gap="4" py="8">
                  <Button borderRadius="full" onClick={onClickDiaryTalk} py="6">
                    日記を書いてからトークする
                  </Button>
                  <Button
                    bgColor="transparent"
                    borderColor="white"
                    borderRadius="full"
                    borderWidth="2px"
                    color="white"
                    onClick={onClickFreeTalk}
                    py="6"
                  >
                    AIとフリートークする
                  </Button>
                </Stack>
              </Box>

              <Box position="relative" w="50%">
                <Image
                  alt=""
                  h="606px"
                  position="relative"
                  src="/iphone-demo.png"
                  sx={{ transform: "rotate(6deg)" }}
                  width="300px"
                  zIndex="10"
                />
                <Image
                  alt=""
                  h="606px"
                  left="20"
                  position="absolute"
                  src="/iphone-demo2.png"
                  sx={{ transform: "rotate(24deg)" }}
                  top="0"
                  width="300px"
                  zIndex="1"
                />
              </Box>
            </Flex>
          </Center>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

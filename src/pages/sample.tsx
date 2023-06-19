// pages/index.tsx
import { VStack, Box, Input, Button, Text, Stack } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
    <Stack h="100vh">
      <Box
        borderRadius="lg"
        borderWidth={1}
        flex="1"
        maxW="md"
        mt={8}
        mx="auto"
        overflowY="auto"
        p={8}
      >
        <Heading mb={4}>Chat Room</Heading>
        <VStack align="stretch" mb={4} spacing={4}>
          {messages.map((message, index) => (
            <Box borderRadius="md" borderWidth={1} key={index} p={4}>
              <Text>{message}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
      <Box
        bg="white"
        borderRadius="lg"
        borderWidth={1}
        bottom={0}
        maxW="md"
        mx="auto"
        p={4}
        position="fixed"
        width="100%"
      >
        <Input
          onChange={handleNewMessageChange}
          placeholder="Type your message..."
          type="text"
          value={newMessage}
        />
        <Button
          colorScheme="teal"
          mt={4}
          onClick={handleSendMessage}
          variant="outline"
        >
          Send
        </Button>
      </Box>
    </Stack>
  );
}

import { Box, Button, Stack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useCheckDiary } from "../hooks/useCheckDiary";

type Props = {
  diary: string;
};

export const EnglishModeLayout: FC<Props> = (props) => {
  const { diary } = props;
  const { checkDiary } = useCheckDiary();
  const [checkedDiary, setCheckedDiary] = useState<string>("");

  const onClickTranslateDiary = async () => {
    await checkDiary(diary, {
      handleLLMNewToken(token) {},
      async handleLLMEnd(text) {},
    });
  };

  return (
    <Box>
      <Stack py="4">
        <Button colorScheme="green" isDisabled={!diary} onClick={onClickTranslateDiary} py="6">
          ✏️ 英語に直す
        </Button>
      </Stack>
    </Box>
  );
};

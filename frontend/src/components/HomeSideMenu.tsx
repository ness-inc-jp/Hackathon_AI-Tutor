import { Button, Stack } from "@chakra-ui/react";
import { FC } from "react";

export const HomeSideMenu: FC = () => {
  return (
    <Stack>
      <Button>Diary</Button>
      <Button>Talk</Button>
    </Stack>
  );
};

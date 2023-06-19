import { Box, Button, Container, Flex, Heading, Icon, Input, Stack, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Unity, { UnityContext } from "react-unity-webgl";
import { useEffect, useState } from "react";
import Audio from "../components/Audio";
//unity インスタンス生成
const unityContext = new UnityContext({
  loaderUrl: "/BuildUnity/Build.loader.js",
  dataUrl: "/BuildUnity/Build.data",
  frameworkUrl: "/BuildUnity/Build.framework.js",
  codeUrl: "/BuildUnity/Build.wasm",
  webglContextAttributes: {
    alpha: true,
    premultipliedAlpha: true,
  },
});

type Voice = {
  id: number;
  file: string;
};

const Home: NextPage = () => {
  const voices: Voice[] = [
    {
      id: 0,
      file: "/Voice/01.mp3",
    },
    {
      id: 1,
      file: "/Voice/02.mp3",
    },
    {
      id: 2,
      file: "Voice/03.wav",
    },
  ];

  const manVoice: Voice[] = [
    {
      id: 0,
      file: "/Voice/04man.mp3",
    },
    {
      id: 0,
      file: "/Voice/05man.mp3",
    },
  ];
  // Unity AnimationCommand Input
  const [inputKey, setInputKey] = useState("");
  const [trackPlaying, setTrackPlaying] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  //inputでSceneの名前を代入
  const [sceneName, setSceneName] = useState<string>("");
  const [currentScene, setCurrentScene] = useState<string>("");
  //男女二人が話すとき
  const [isManPlaying, setIsManPlaying] = useState<boolean>(false);
  const [isWomanPlaying, setIsWomanPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaying) {
      startTalk();
    } else {
      stopTalk();
    }
    if (isManPlaying) {
      startManTalk();
    } else {
      stopManTalk();
    }
    if (isWomanPlaying) {
      startWomanTalk();
    } else {
      stopWomanTalk();
    }
  });

  const ChangeAnimation = (key: string) => {
    unityContext.send("unitychan_hw", "AniSituation", key);
  };

  const startTalk = () => {
    unityContext.send("MTH_DEF", "MouthAction", 1);
  };
  const stopTalk = () => {
    unityContext.send("MTH_DEF", "MouthAction", 0);
  };

  const handleChangeScene = (scene: string) => {
    unityContext.send("ChangeScene", "HandleChangeScene", scene);
    setCurrentScene(scene);
  };

  //男性の声(two)の場合
  const startManTalk = () => {
    unityContext.send("MAN_MTH_DEF", "MouthAction", 1);
  };
  const stopManTalk = () => {
    unityContext.send("MAN_MTH_DEF", "MouthAction", 0);
  };
  //女性の声(TWO)の場合
  const startWomanTalk = () => {
    unityContext.send("WOMAN_MTH_DEF", "MouthAction", 1);
  };
  const stopWomanTalk = () => {
    // unityContext.send("MTH_DEF", "PlaySound", 0)
    unityContext.send("WOMAN_MTH_DEF", "MouthAction", 0);
  };

  return (
    <Container maxW="container.md">
      <Unity
        unityContext={unityContext}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0)",
        }}
      />
      <br />
      <Flex gap="4" justifyContent="flex-end">
        <Input h="44px" onChange={(e) => setInputKey(e.target.value)} />
        <Button onClick={() => ChangeAnimation(inputKey)}>ChangePage</Button>
      </Flex>
      <br />
      <h3>Command</h3>
      <p>success : 了解</p>
      <p>shy：悩む</p>
      <p>amasing：大喜びからのピース</p>
      <p>worry：ダメージを受ける</p>
      <p>byebye：大きく手を振ってバイバイ</p>
      <p>Reset：defaultの動きに戻す</p>
      <br />
      {currentScene == "two" ? (
        <>
          <Flex>
            <p>男性の声：</p>
            <Audio
              currentScene={currentScene}
              isPlaying={isManPlaying}
              setIsPlaying={setIsManPlaying}
              voices={manVoice}
              trackPlaying={trackPlaying}
              setTrackPlaying={setTrackPlaying}
            />
          </Flex>
          <Flex>
            <p>女性の声：</p>
            <Audio
              currentScene={currentScene}
              isPlaying={isWomanPlaying}
              setIsPlaying={setIsWomanPlaying}
              voices={voices}
              trackPlaying={trackPlaying}
              setTrackPlaying={setTrackPlaying}
            />
          </Flex>
        </>
      ) : (
        <Audio
          currentScene={currentScene}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          voices={voices}
          trackPlaying={trackPlaying}
          setTrackPlaying={setTrackPlaying}
        />
      )}

      <Flex gap="4" justifyContent="flex-end">
        <Input h="44px" onChange={(e) => setSceneName(e.target.value)} />
        <Button onClick={() => handleChangeScene(sceneName)}>ChangePage</Button>
      </Flex>
      <h3>Change Scene</h3>
      <p>HWUnitychan：デフォルトのUnityChan</p>
      <p>Yuji：男性(音ハメはまだ)</p>
      <p>two：二人で登場</p>
    </Container>
  );
};

export default Home;

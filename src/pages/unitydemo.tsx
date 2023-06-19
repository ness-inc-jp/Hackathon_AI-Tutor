import { Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
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

//Viuce Sample

// export const getStaticProps = async () => {
//   const allVoices: Voice[] = VOICE;
//   return {
//     props: {
//       voices: allVoices
//     },
//     revalidata: 3600
//   }
// }

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
  // Unity AnimationCommand Input
  const [inputKey, setInputKey] = useState<string>("");
  //Unity Current Animation
  const [animation, setAnimation] = useState("");
  // Whether Animation act
  const [isSituation, setIsSituation] = useState(0);
  //Whether Sound act
  const [isSoundStart, setIsSoundStart] = useState(0);

  const [trackPlaying, setTrackPlaying] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [sceneName, setSceneName] = useState<string>("");

  useEffect(() => {
    unityContext.on("AnimationCallback", function (animation, isSituation) {
      setAnimation(animation);
      setIsSituation(isSituation);
    });
  }, []);

  useEffect(() => {
    console.log(isPlaying);
    if (isPlaying) {
      startTalk();
    } else {
      stopTalk();
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
  };

  const ChangeAnimation = (key: string) => {
    unityContext.send("unitychan_hw", "AniSituation", key);
  };

  const startTalk = () => {
    // unityContext.send("MTH_DEF", "PlaySound", 1);
    unityContext.send("MTH_DEF", "MouthAction", 1);
  };
  const stopTalk = () => {
    // unityContext.send("MTH_DEF", "PlaySound", 0)
    unityContext.send("MTH_DEF", "MouthAction", 0);
  };

  const handleChangeScene = (scene: string) => {
    unityContext.send("ChangeScene", "HandleChangeScene", scene);
  };

  console.log(inputKey);
  return (
    <Container maxW="container.md">
      <Unity
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0)",
          backgroundImage: "url(/images/unitychan.png)",
        }}
        unityContext={unityContext}
      />

      <Text pt="4">Command</Text>

      <Flex gap="4" justifyContent="flex-end">
        <Input
          h="44px"
          onChange={(e) => {
            setInputKey(e.target.value);
            console.log(e.target.value);
          }}
          value={inputKey}
        />
        <Button onClick={() => ChangeAnimation(inputKey)}>ChangePage</Button>
      </Flex>
      <br />
      <h3>Command</h3>
      <p>Success : 了解</p>
      <p>Shy : 悩む</p>
      <p>Amasing : 大喜びからのピース</p>
      <p>Worry : ダメージを受ける</p>
      <p>ByeBye : 大きく手を振ってバイバイ</p>
      <p>Reset : defaultの動きに戻す</p>
      <br />
      <Audio
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setTrackPlaying={setTrackPlaying}
        trackPlaying={trackPlaying}
        voices={voices}
      />

      <Flex gap="4" justifyContent="flex-end">
        <Input h="44px" onChange={(e) => setSceneName(e.target.value)} />
        <Button onClick={() => handleChangeScene(sceneName)}>ChangePage</Button>
      </Flex>
      <h3>Change Scene</h3>
      <p>HWUnitychan：デフォルトのUnityChan</p>
      <p>Yuji：男性(音ハメはまだ)</p>
    </Container>
  );
};

export default Home;

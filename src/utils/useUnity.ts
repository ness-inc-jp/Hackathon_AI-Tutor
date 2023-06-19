import { useEffect, useState } from "react";
import { UnityContext } from "react-unity-webgl";

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

export const useUnity = () => {
  //Unity Current Animation
  const [animation, setAnimation] = useState<string>("");
  // Whether Animation act
  const [isSituation, setIsSituation] = useState<number>(0);

  useEffect(() => {
    unityContext.on("loaded", () => {
      console.log("loaded");
    });

    unityContext.on("AnimationCallback", function (animation, isSituation) {
      setAnimation(animation);
      setIsSituation(isSituation);
    });
  }, []);

  const talkStart = () => {
    unityContext.send("MTH_DEF", "MouthAction", 1);
  };

  const talkStop = () => {
    unityContext.send("MTH_DEF", "MouthAction", 0);
  };

  return {
    unityContext,
    talkStart,
    talkStop,
  };
};

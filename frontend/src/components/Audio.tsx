import { Flex } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { SyntheticEvent } from "react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillSkipBackwardFill,
  BsFillSkipForwardFill,
} from "react-icons/bs";

type Voice = {
  id: number;
  file: string;
};

const Audio = (props: {
  isPlaying: boolean;
  setIsPlaying: Function;
  voices: Voice[];
  trackPlaying: number;
  setTrackPlaying: Function;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (): void => {
    props.setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = (): void => {
    props.setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handlePreviousOrNext = (arg: string): void => {
    let thisTrackPlaying = getNumberNextOrPreviousTrack(arg);
    props.setTrackPlaying(thisTrackPlaying);
  };

  const getNumberNextOrPreviousTrack = (arg: string): number => {
    let thisTrackPlaying = props.trackPlaying;
    let numberTracks = props.voices.length;
    if (arg === "previous") {
      thisTrackPlaying--;
      if (thisTrackPlaying < 0) {
        thisTrackPlaying = numberTracks - 1;
      }
    }
    if (arg === "next") {
      thisTrackPlaying++;
      if (thisTrackPlaying >= numberTracks) {
        thisTrackPlaying = 0;
      }
    }
    return thisTrackPlaying;
  };

  useEffect(() => {
    if (props.isPlaying) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [props.trackPlaying]);

  const handleTimeUpdate = (e: SyntheticEvent<EventTarget>): void => {
    const current = (e.target as HTMLMediaElement).currentTime;
    const duration = (e.target as HTMLMediaElement).duration;

    if (current == duration) {
      handlePreviousOrNext("next");
    } else {
      // let timeSongInfo = {
      //     currentTime: current,
      //     duration: duration
      // }
    }
  };

  return (
    <div>
      <Flex>
        <BsFillSkipBackwardFill onClick={() => handlePreviousOrNext("previous")} size={24} />
        <audio
          controls
          onTimeUpdate={handleTimeUpdate}
          src={props.voices[props.trackPlaying].file}
          onLoadedMetadata={handleTimeUpdate}
          // className={classes.controls__flex__audio__player}
          ref={audioRef}
        ></audio>
        {props.isPlaying ? (
          <BsFillPauseFill onClick={() => handlePause()} size={32} />
        ) : (
          <BsFillPlayFill onClick={() => handlePlay()} size={32} />
        )}
        <BsFillSkipForwardFill onClick={() => handlePreviousOrNext("next")} size={24} />
      </Flex>
    </div>
  );
};

export default Audio;

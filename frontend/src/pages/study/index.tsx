import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useHuddle01 } from "@huddle01/react";
import {
  useAudio,
  useEventListener,
  useLobby,
  usePeers,
  useRoom,
  useVideo,
} from "@huddle01/react/hooks";

import axios from "axios";
import { Box, Button, VStack } from "@chakra-ui/react";
import { IPeers } from "@huddle01/react/dist/declarations/src/atoms/peers.atom";
import { useAccount } from "wagmi";

const Study: NextPageWithLayout = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { initialize, isInitialized } = useHuddle01();
  const [roomId, setRoomId] = useState<string>("");
  const { joinLobby } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();

  useEffect(() => {
    initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECT_KEY || "");
  }, []);

  const { address } = useAccount();

  useEffect(() => {
    if (isInitialized) {
      const getRoomId = async () => {
        const response = await axios.post(
          "https://api.huddle01.com/api/v1/create-room",
          {
            title: "Huddle01-Test",
            hostWallets: [address],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.NEXT_PUBLIC_HUDDLE_API_KEY || "",
            },
          }
        );
        setRoomId(response.data.data.roomId);
      };
      getRoomId();
    }
  }, [isInitialized]);

  // Event Listner
  useEventListener("app:cam-on", () => {
    console.log("room:cam-produce-start", camStream, videoRef);
    if (camStream && videoRef.current) videoRef.current.srcObject = camStream;
  });

  return (
    <>
      <Box w={"400px"} h={"200px"} border={"solid 2px black"}>
        <video ref={videoRef} autoPlay></video>
      </Box>
      <VStack>
        {!isInitialized && "Please initialize"}
        RoomID is: {roomId}
        <Button
          disabled={joinLobby.isCallable}
          onClick={() => joinLobby(roomId)}
        >
          Join Lobby
        </Button>
        {/* Mic */}
        <Button
          disabled={!fetchAudioStream.isCallable}
          onClick={fetchAudioStream}
        >
          FETCH_AUDIO_STREAM
        </Button>
        {/* Webcam */}
        <Button
          disabled={!fetchVideoStream.isCallable}
          onClick={fetchVideoStream}
        >
          FETCH_VIDEO_STREAM
        </Button>
        <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
          JOIN_ROOM
        </Button>
        <Button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
          LEAVE_ROOM
        </Button>
        <Button
          disabled={!produceVideo.isCallable}
          onClick={() => produceVideo(camStream)}
        >
          Produce Cam
        </Button>
        <Button
          disabled={!produceAudio.isCallable}
          onClick={() => produceAudio(micStream)}
        >
          Produce Mic
        </Button>
        <Button
          disabled={!stopProducingVideo.isCallable}
          onClick={stopProducingVideo}
        >
          Stop Producing Cam
        </Button>
        <Button
          disabled={!stopProducingAudio.isCallable}
          onClick={stopProducingAudio}
        >
          Stop Producing Mic
        </Button>
        Me Video:
      </VStack>
    </>
  );
};

Study.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Study;

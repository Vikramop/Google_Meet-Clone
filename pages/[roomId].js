import { useSocket } from '@/context/socket';
import usePeer from '@/hooks/usePeer';
import { useEffect } from 'react';
import useMediaStream from '@/hooks/useMediaStream';
import Player from '@/component/Player';

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      console.log(`user connected in room with ${newUser}`);

      const call = peer.call(newUser, stream);

      call.on('stream', (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);
      });
    };
    socket.on('user-connected', handleUserConnected);
    return () => {
      socket.off('user-connected', handleUserConnected);
    };
  }, [peer, stream, socket]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on('call', (call) => {
      const { peer: callerId } = call; //renaming cuz we already have a name peer used
      call.answer(stream); // Answer the call with our own video / audio. and send back their stream

      call.on('stream', (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
      });
    });
  }, [peer, stream]);

  return (
    <div>
      <Player url={stream} muted playing playerid={myId} />
    </div>
  );
};

export default Room;

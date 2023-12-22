import { useSocket } from '@/context/socket';
import usePeer from '@/hooks/usePeer';
import { useEffect } from 'react';
import useMediaStream from '@/hooks/useMediaStream';
import Player from '@/component/Player';
import usePlayer from '@/hooks/usePlayer';
import styles from '@/styles/room.module.css';

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const { players, setPlayers, playerHighlighted, nonHighlightedPlayers } =
    usePlayer();

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      console.log(`user connected in room with ${newUser}`);

      const call = peer.call(newUser, stream);

      call.on('stream', (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
      });
    };
    socket.on('user-connected', handleUserConnected);
    return () => {
      socket.off('user-connected', handleUserConnected);
    };
  }, [peer, stream, socket, setPlayers]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on('call', (call) => {
      const { peer: callerId } = call; //renaming cuz we already have a name peer used
      call.answer(stream); // Answer the call with our own video / audio. and send back their stream

      call.on('stream', (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!myId || !stream) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>
      {/* now itterating through players and nonHighlightedPlayers object */}
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
    </>
  );
};

export default Room;

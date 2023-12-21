import { useSocket } from '@/context/socket';
import { useRouter } from 'next/router';

const { useState, useEffect, useRef } = require('react');

const usePeer = () => {
  const roomId = useRouter().query.roomId;
  const socket = useSocket();
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState('');

  //This is for the id logging 2 times in the dev mode
  // so to log it only once
  const isPeerSet = useRef(false);

  // Now if we default import the peer lib it will give
  //error - navigator error in nextjs
  // so we import in usestate to get rid of that error
  // by using iife

  //peer js is an intermediate servers b/w webrtc that handles
  //all the calls and requests
  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return; // return nothing
    isPeerSet.current = true;
    (async function initPeer() {
      const myPeer = new (await import('peerjs')).default(); // default is for to import the default version
      setPeer(myPeer);

      myPeer.on('open', (id) => {
        console.log('peer id:', id);
        setMyId(id);
        socket?.emit('join-room', roomId, id);
      });
    })();
  }, [roomId, socket]);

  return {
    peer,
    myId,
  };
};

export default usePeer;

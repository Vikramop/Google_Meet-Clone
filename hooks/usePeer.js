const { useState, useEffect, useRef } = require('react');

const usePeer = () => {
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
    if (isPeerSet.current) return;
    isPeerSet.current = true;
    (async function initPeer() {
      const myPeer = new (await import('peerjs')).default(); // default is for to import the default version
      setPeer(myPeer);

      myPeer.on('open', (id) => {
        console.log('peer id:', id);
        setMyId(id);
      });
    })();
  }, []);

  return {
    peer,
    myId,
  };
};

export default usePeer;

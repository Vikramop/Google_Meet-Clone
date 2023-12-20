import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import styles from '@/styles/home.module.css'; // we changed config file at this point so we need to stop and restart the server(postcssconfig not the tailwindcss config)
import { useState } from 'react';

export default function Home() {
  // This is for demonstration how to connect to peer service
  // useEffect(() => {
  //   socket?.on('connect', () => {
  //     console.log(socket.id);
  //   });
  // }, [socket]);

  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const CreateAndJoin = () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`);
    else {
      alert('Please provide a valid room id');
    }
  };
  return (
    <div className={styles.homeContainer}>
      <h1>Google Meet Clone</h1>
      <div className={styles.enterRoom}>
        <input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e?.target?.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <span className={styles.separatorText}> -----------OR-----------</span>
      <button onClick={CreateAndJoin}>Create a new room</button>
    </div>
  );
}

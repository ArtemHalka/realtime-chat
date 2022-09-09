import React, { useRef, useState} from 'react';

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const socket = useRef();

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000/');
    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message));
      console.log('Connected...');
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log('Socket closed');
      setConnected(false);
    };
    socket.current.onerror = () => {
      console.log('Socket error');
    };
  }

  const sendMessage = async () => {
    const message = {
      event: 'message',
      username,
      id: Date.now(),
      message: value
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  }

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={connect}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className='center'>
      <div>
        <div className="form">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="messages">
          {
            messages.map(mess => <div key={mess.id}>{
              mess.event === 'connection'
                ? <div className="connection_message">User {mess.username} has entered the chat</div>
                : <div className="message">{mess.username}: {mess.message}</div>
            }</div>)
          }
        </div>
      </div>
    </div>
  );
};

export default WebSock;

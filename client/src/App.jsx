// import React from 'react'
import { useState } from "react";
import ChatMesagges from "./components/ChatMesagges";


const App = () => {
  const [chatActive, setChatActive] = useState(false);

  return (
    <div className=" w-full min-h-screen flex items-center justify-center">
      {chatActive ? (
        <>
          <ChatMesagges />
        </>
      ) : (
        <>
          <button className="bg-green-600 text-white p-2 px-3 rounded-lg font-medium" onClick={() => setChatActive(true)}>Start chatting</button>
        </>
      )}
    </div>
  );
};

export default App;

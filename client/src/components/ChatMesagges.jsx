import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { CiFaceSmile } from "react-icons/ci";
import { RiSendPlaneFill } from "react-icons/ri";

const socket = io("http://localhost:8000");

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiBoxRef = useRef();

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setInputText(inputText + emoji);
  };

  useEffect(() => {
    const id = uuidv4();
    setUserId(id);

    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
    };
  }, []);

  const sendMessage = () => {
    const msgData = {
      message: inputText,
      time: `${new Date(Date.now()).getHours()}:${new Date(
        Date.now()
      ).getMinutes()}`,
      userId: userId,
    };

    socket.emit("message", msgData);
    setInputText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiBoxRef.current && !emojiBoxRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiBoxRef]);

  return (
    <div className="w-[700px] shadow-md bg-white p-4 rounded-lg">
      <h1 className="w-full text-center text-xl font-semibold text-gray-800">
        Chatting App
      </h1>
      <div className="w-full border mt-4 mb-4 h-[550px] rounded-md p-3 overflow-y-auto flex flex-col-reverse relative">
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div
              key={index}
              className={`box w-fit max-w-[45%] flex flex-col mb-3 ${
                userId === message?.userId && "ml-auto"
              }`}
            >
              <p
                className={` w-full flex flex-wrap break-words  p-1 px-2   rounded-md ${
                  userId === message?.userId
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {message?.message}
              </p>
              <span
                className={` px-2 text-[12px] text-gray-500 ${
                  userId === message?.userId && "text-end"
                }`}
              >
                {message?.time}
              </span>
            </div>
          ))}

        {showEmojiPicker && (
          <div ref={emojiBoxRef} className="absolute bottom-1 left-1">
            <Picker
              data={data}
              emojiSize={20}
              emojiButtonSize={28}
              onEmojiSelect={addEmoji}
              maxFrequentRows={0}
              previewPosition={"none"}
              theme={"light"}
            />
          </div>
        )}
      </div>
      <div className=" w-full flex items-center gap-1 ">
        {/* ------------ Emoji----------- */}
        <div className="">
          <button
            className="focus:outline-none outline-none"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <CiFaceSmile size={20} />
          </button>
        </div>
        {/* ------------ Emoji----------- */}
        <input
          className="w-full border p-1 px-3 text-[17px] rounded-md"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-green-600 text-white p-1 px-3 rounded-md focus:outline-none outline-none flex items-center gap-1"
          onClick={sendMessage}
        >
          <RiSendPlaneFill /> Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;

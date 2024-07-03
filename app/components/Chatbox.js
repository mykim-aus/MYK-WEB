"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import myPicture from "../images/me.jpeg";

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, user: "You" },
      ]);
      setInput("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a bot response", user: "MINYEONG KIM" },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 text-white rounded-lg">
      <div
        ref={chatContainerRef}
        className="h-64 overflow-y-scroll mb-4 border border-gray-600 p-2 rounded-lg flex flex-col"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src={myPicture.src}
              alt="My Picture"
              width={100}
              height={100}
              className="rounded-full object-cover mb-4"
            />
            <p className="text-2xl font-bold text-gray-400">
              Ask anything about me
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 flex items-center ${
                msg.user === "You" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.user === "MINYEONG KIM" && (
                <Image
                  src={myPicture.src}
                  alt="Bot Picture"
                  width={40}
                  height={40}
                  className="rounded-full object-cover mr-2"
                />
              )}
              <div>
                <p className="font-bold">{msg.user}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="p-2 bg-blue-500 rounded-lg" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

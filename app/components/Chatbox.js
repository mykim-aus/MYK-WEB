"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import myPicture from "../images/me.jpeg";

export default function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState([
    "Can you tell me about you?",
    "How did you start programming?",
    "What technologies do you specialize in?",
  ]);
  const chatContainerRef = useRef(null);

  const handleSend = async (message = input) => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, user: "You" },
        { text: "", user: "MINYEONG KIM", loading: true }, // Placeholder for bot response
      ]);
      setInput("");
      setIsLoading(true);

      try {
        const storedThreadId = localStorage.getItem("thread_id");
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            thread_id: storedThreadId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (!storedThreadId) {
            localStorage.setItem("thread_id", data.thread_id);
          }

          setMessages((prevMessages) =>
            prevMessages.map((msg, index) => {
              if (msg.loading) {
                return { text: data.message, user: "MINYEONG KIM" };
              }
              return msg;
            })
          );

          if (data.recommend) {
            setRecommendedQuestions(data.recommend);
          }
        } else {
          setMessages((prevMessages) =>
            prevMessages.map((msg, index) => {
              if (msg.loading) {
                return {
                  text: data.error || "Error occurred",
                  user: "MINYEONG KIM",
                };
              }
              return msg;
            })
          );
        }
      } catch (error) {
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) => {
            if (msg.loading) {
              return { text: "Failed to send message", user: "MINYEONG KIM" };
            }
            return msg;
          })
        );
      } finally {
        setIsLoading(false);
      }

      if (!firstMessageSent) {
        setFirstMessageSent(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 text-white rounded-lg transition-all duration-500 ease-in-out">
      <div
        ref={chatContainerRef}
        className={`overflow-y-scroll scrollbar-thin scrollbar-thumb-white mb-4 border border-gray-600 p-2 rounded-lg flex flex-col h-96`}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src={myPicture.src}
              alt="My Picture"
              width={100}
              height={100}
              className={`rounded-full object-cover mb-4 transition-transform duration-500 ease-in-out ${
                firstMessageSent ? "transform -translate-y-8 scale-150" : ""
              }`}
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
                <>
                  <Image
                    src={myPicture.src}
                    alt="Bot Picture"
                    width={40}
                    height={40}
                    className="rounded-full object-cover mr-2"
                  />
                </>
              )}
              <div>
                <p className="font-bold">{msg.user}</p>
                {msg.loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mb-4">
        {!isLoading && recommendedQuestions.length > 0 && (
          <div className="flex flex-col mb-4">
            {recommendedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSend(question)}
                className="mt-2 p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className="p-2 bg-blue-500 rounded-lg"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}

"use client";
import { TypeAnimation } from "react-type-animation";

export default function Typing({ text }) {
  return (
    <TypeAnimation
      sequence={[
        "I am a fast learner.",
        1000,
        "I am providing various options and pros and cons.",
        1000,
        "I am the person who does what you want, not what I want.",
        1000,
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: "1em", display: "inline-block" }}
      repeat={Infinity}
    />
  );
}

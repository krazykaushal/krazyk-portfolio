import React from "react";

import python from "../assets/python.svg";
import javascript from "../assets/javascript.png";
import reactImage from "../assets/react.svg";
import nextjs from "../assets/nextjs.svg";
import github from "../assets/github.png";
import tailwind from "../assets/tailwind.png";
import node from "../assets/nodejs.svg";
import express from "../assets/express.png";
import mongodb from "../assets/mongodb.png";
import postgresql from "../assets/postgresql.svg";
import postman from "../assets/postman.svg";
import cplusplus from "../assets/cplusplus.svg";
const Skills = () => {
  const techs = [
    {
      id: 1,
      src: reactImage,
      title: "React",
      style: "shadow-blue-600",
    },
    {
      id: 2,
      src: node,
      title: "NodeJs",
      style: "shadow-green-400",
    },
    {
      id: 3,
      src: nextjs,
      title: "Next JS",
      style: "shadow-white",
    },
    {
      id: 4,
      src: javascript,
      title: "JavaScript",
      style: "shadow-yellow-500",
    },
    {
      id: 5,
      src: python,
      title: "Python",
      style: "shadow-orange-500",
    },
    {
      id: 6,
      src: github,
      title: "GitHub",
      style: "shadow-gray-400",
    },
    {
      id: 7,
      src: tailwind,
      title: "Tailwind",
      style: "shadow-sky-400",
    },
    {
      id: 8,
      src: express,
      title: "Express",
      style: "shadow-white",
    },
    {
      id: 9,
      src: mongodb,
      title: "MongoDB",
      style: "shadow-green-500",
    },
    {
      id: 10,
      src: postgresql,
      title: "PostgreSQL",
      style: "shadow-sky-300",
    },
    {
      id: 11,
      src: postman,
      title: "Postman",
      style: "shadow-orange-300",
    },
    {
      id: 11,
      src: cplusplus,
      title: "C++",
      style: "shadow-blue-400",
    },
  ];

  return (
    <div
      name="skills"
      className="bg-gradient-to-b from-gray-800 to-black w-full skills"
    >
      <div className="max-w-screen-lg mx-auto px-4 py-24 flex flex-col justify-center w-full h-full text-white">
        <div>
          <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
            Skills
          </p>
          <p className="py-6">
            These are the technologies I've worked with and used them in my
            projects.
          </p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-8 text-center py-8 px-12 sm:px-0">
          {techs.map(({ id, src, title, style }) => (
            <div
              key={id}
              className={`shadow-md hover:scale-105 duration-500 py-2 rounded-lg ${style}`}
            >
              <img src={src} alt="" className="w-20 mx-auto" />
              <p className="mt-4">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;

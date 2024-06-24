import React from "react";
import dash from "../assets/portfolio/dash.png";
import purvey from "../assets/portfolio/purveyingfee.png";
import anime from "../assets/portfolio/anime.png";
import zoobdb from "../assets/portfolio/zoobdb.png";
import promptopia from "../assets/portfolio/promptopia.png";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import { Link } from "react-scroll";

const Portfolio = () => {
  const portfolios = [
    {
      id: 1,
      src: anime,
      name: "Krazy-Anime",
      link: "https://krazy-anime-stream.vercel.app/",
      repo: "https://github.com/krazykaushal/krazy_anime_stream"
    },
    {
      id: 2,
      src: dash,
      name: "DA-SH",
      link: "https://da-sh.vercel.app/",
      repo: "https://github.com/krazykaushal/Educational-Networking-Tools-for-Students",
    },
    {
      id: 3,
      name: "Purveying-F.E.E",
      src: purvey,
      repo: "https://github.com/krazykaushal/Purveying-Fee-KrazyK",
    },
    {
      id: 4,
      name: "Zoo-B-DB",
      src: zoobdb,
      repo: "https://github.com/krazykaushal/Zoo-B-DB",
    },
    {
      id: 5,
      name: "Promptopia",
      src: promptopia,
      repo: "https://github.com/krazykaushal/Promptopia",
    },
  ];

  return (
    <div
      name="portfolio"
      className="bg-gradient-to-b from-black to-gray-800 w-full text-white  portfolio"
    >
      <div className="max-w-screen-lg px-4 py-24 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Portfolio
          </p>
          <p className="py-6 text-lg">Check out some of my work right here</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0">
          {portfolios.map(({ id, name, src, link, repo }) => (
            <div key={id} className="shadow-md shadow-gray-600 rounded-lg">
              <div className="flex justify-center py-1 text-2xl">{name}</div>
              <img
                src={src}
                alt="projects"
                className="rounded-md duration-200 hover:scale-105 object-cover h-48 w-full"
              />
              <div className="flex items-even justify-center">
                {link && (
                  <Link
                    className=" p-4 duration-200 hover:scale-125 cursor-pointer "
                    onClick={() => window.open(link, "_blank")}
                  >
                    <FaArrowUpRightFromSquare size={24} />
                  </Link>
                )}
                <Link
                  className=" p-4 duration-200 hover:scale-125 cursor-pointer"
                  onClick={() => window.open(repo, "_blank")}
                >
                  <FaGithub size={24} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

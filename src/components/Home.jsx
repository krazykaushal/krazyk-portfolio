import React from "react";
import HeroImage from "../assets/heroImage.png";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-scroll";

const Home = () => {
  return (
    <div
      name="home"
      className=" w-full bg-gradient-to-b from-black via-black to-gray-800 home py-36"
    >
      <div className=" mx-auto flex flex-col items-center justify-center px-10 md:flex-row bg-violet-500 rounded-2xl w-[80%] z-50">
        <div className="small-screen hidden mt-10">
          <img
            src={HeroImage}
            alt="profile"
            className="rounded-2xl mx-auto w-2/3 md:w-full"
          />
        </div>
        <div className="flex flex-col justify-center md:ml-10 w-2/3 py-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white ">
            {" "}
            <code>Hello; </code>
          </h2>
          <h2 className="text-4xl md:text-7xl font-bold text-white py-4">
            I'm{" "}
            <span className="text-teal-300 text-4xl md:text-7xl">
              Kaushal Patel
            </span>
          </h2>
          <p className="text-gray-800 font-bold py-4 max-w-m text-2xl md:text-5xl">
            {" "}
            A Web Developer
          </p>

          <div className="portfolio-btn">
            <Link
              to="portfolio"
              smooth
              duration={500}
              className="group text-white w-fit px-6 py-3 my-2 font-bold flex items-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer"
            >
              See my Portfolio
              <span className="group-hover:rotate-90 duration-300">
                <MdOutlineKeyboardArrowRight size={25} className="ml-1" />
              </span>
            </Link>
          </div>
        </div>
        <div className="big-screen">
          <img
            src={HeroImage}
            alt="profile"
            className="rounded-2xl mx-auto w-2/3 md:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

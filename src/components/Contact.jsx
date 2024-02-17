import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

//function for form reset
function handleSubmit(e) {
  setTimeout(() => {
    e.target.reset();
  }, 3000);
}

const Contact = () => {
  return (
    <div
      name="contact"
      className="contact w-full bg-gradient-to-b from-black to-gray-800 p-4 text-white"
    >
      <div className="flex flex-col px-4 pt-24 justify-center max-w-screen-lg mx-auto h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Contact
          </p>
          <p className="py-6">Submit the form below to get in touch with me</p>
        </div>

        <div className=" flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            name="contact"
            method="POST"
            action="https://getform.io/f/mbkGE5bz "
            className=" flex flex-col w-full md:w-1/2"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="my-4 p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Enter your message"
              rows="10"
              required
              className="p-2 bg-transparent border-2 rounded-md text-white focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="text-white bg-gradient-to-b from-cyan-500 to-blue-500 px-6 py-3 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <div className="md:hidden">
        <div>
          <h3 className="text-3xl my-4">Social Media Links</h3>
        </div>
        <div>
          <ul className="flex gap-6 justify-center mt-2">
            <li className="hover:scale-110">
              <a href="https://www.linkedin.com/in/kaushal-patel-7b3b3b1b3/" target="_blank" rel="noreferrer" >
                <FaLinkedin size={30} />
                </a>
            </li>
            <li className="hover:scale-110">
              <a href="https://www.github.com/krazykaushal" target="_blank" rel="noreferrer">
                <FaGithub size={30} />
              </a>
            </li>
            <li  className="hover:scale-110">
              <a href="mailto:kaushal290902@gmail.com" target="_blank" rel="noreferrer">
                <HiOutlineMail size={30}/>
              </a>
            </li>
          </ul>
          <div className="p-3">

          Made with ❤ by Kaushal Patel
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

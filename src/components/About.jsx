import React from "react";

const About = () => {
  return (
    <div
      name="about"
      className="w-full h-full bg-gradient-to-b from-gray-800 to-black text-white about"
    >
      <div className="max-w-screen-lg px-4 py-24 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            About
          </p>
        </div>
        <div className="flex flex-col lg:flex-row ">
          <div className="lg:w-1/2">
            <p className="text-xl mt-5">
              I am a Software Engineer, working in both, <b>Backend</b> and{" "}
              <b>Frontend </b>
              technology. I have created Websites using <b>MERN </b> stack and{" "}
              <b>Next.js</b>. I consider myself a self-taught developer, a quick
              learner, a community helper, and a coder driven by curiosity and
              passion.
            </p>
            <br />
            <p className="text-xl mt-5">
              Diving into the realm of <b>Machine Learning</b> with{" "}
              <b>Python</b> and its libraries, I'm currently actively exploring
              this endless possibilities of data-driven innovation.
            </p>

            <br />
          </div>
          <div className="p-2 lg:w-1/2 flex flex-col gap-6">
            <div class="block rounded-lg p-6 bg-neutral-700 ">
              <h5 class="mb-2 text-2xl font-bold text-neutral-50">
                Experience
              </h5>
              <p class="mb-2 font-medium text-neutral-200 text-lg">
                Software Engineer{" "}
                <a
                  href="https://www.infoanalytica.com/"
                  className="text-blue-400"
                >
                  @infoAnalytica{" "}
                </a>{" "}
                <br />
                <span className="font-light ">January 2024 - Present </span>
              </p>
            </div>
            <div class="block rounded-lg p-6 bg-neutral-700">
              <h5 class="mb-2 text-2xl font-bold text-neutral-50">
                Graduation
              </h5>
              <p class="mb-2 font-medium text-neutral-200 text-lg">
                B.Tech in ICT (DA-IICT 2024)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

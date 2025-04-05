"use client";
import React, { useState } from "react";
import { Atom, Mail, Star, Zap, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

function LandingPage() {
  const [imageUrl, setImageUrl] = useState("default.jpg");

  const router = useRouter(); // Initialize router

  const handleGetStarted = () => {
    router.push("/sign-in"); // Navigate to sign-in page
  };
  return (
    <div className=" min-h-screen  w-screen bg-gradient-to-br from-purple-950 to-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <img src="flow.png" alt="Logo" className="w-40 h-10 rounded-full" />
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#features"
            className="hover:text-purple-400 transition-colors"
          >
            Features
          </a>
          <button
            onClick={handleGetStarted}
            className="cursor-pointer text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
          >
            My Inbox
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center ">
        <div className="flex text-start rounded-xl relative xl:max-w-[1094px] justify-center items-start mx-auto  ">
          <div className="flex items-start">
            <img
              src="logo.webp"
              className="inline-block rounded-md md:rounded-xl wow animate__animated animate__fadeInUp"
              data-wow-delay=".1s"
              alt="logo"
            />
          </div>
          <div className="flex items-end">
            <h1
              suppressHydrationWarning={true}
              className="font-black justify-center items-center text-white text-[20px] md:text-[30px] ml-8 lg:text-[40px] xl:text-[50px] mb-12 md:mb-15 lg:mb-20 "
            >
              Revolutionize your Inbox
              <p suppressHydrationWarning={true}>
                with{" "}
                <span className="bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent ">
                  Atom Mail
                </span>
              </p>
            </h1>
          </div>
        </div>

        <p className="text-xl text-gray-400 mb-8">
          AI-driven email tools that adapt to your needs and streamline your
          communication
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white cursor-pointer text-blue-400 px-12 py-4 rounded-4xl text-lg font-semibold transition-all duration-300 hover:shadow-[0_6px_15px_rgba(255,255,255,0.7)]"
        >
          Get Started for Free
        </button>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-t from-gray-900 to-transparent absolute inset-0 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Dashboard Preview"
            className="rounded-2xl shadow-2xl border-white border-16 "
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 ">
            AI-driven email tools that adapt to your needs
          </h2>
          <p className="bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent text-3xl font-bold">
            Stay Ahead of the Curve
          </p>
        </div>

        {/* Image Switcher Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-12">
          {/* Left Image Section */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Feature Image"
              className="rounded-lg shadow-lg transition-all duration-500 w-[700px] h-[400px] object-cover"
            />
          </div>

          {/* Right Buttons Section */}
          <div className="flex flex-col gap-4 justify-centerc">
            <button
              className="btn hover:scale-110 flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-purple-700 to-black rounded-lg hover:bg-gray-700 transition-all font-bold"
              onMouseOver={() => setImageUrl("mountain.jpg")}
            >
              📦 Multiple Domains & Accounts
            </button>
            <button
              className="btn flex hover:scale-110 items-center gap-2 px-8 py-4 bg-gradient-to-br from-purple-800 to-black rounded-lg hover:bg-gray-700 transition-all font-bold"
              onMouseOver={() => setImageUrl("build.jpg")}
            >
              🌍 AI Powered Automatic Drafting
            </button>
            <button
              className="btn flex hover:scale-110 items-center gap-2 px-8 py-4 bg-gradient-to-br from-purple-900 to-black rounded-lg hover:bg-gray-700 transition-all font-bold"
              onMouseOver={() => setImageUrl("building.jpg")}
            >
              💻 Compatible with all Apps
            </button>
          </div>
        </div>
      </div>

      {/* Features Cards Section */}
      <div className="text-white flex justify-center items-center  min-h-screen">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">
            Secure and Standard way of communicating with your customers
          </h2>

          <div className="flex justify-center gap-4 bg-gray-900 p-4 rounded-xl">
            <div className="flex items-center bg-white text-black rounded-full px-6 py-3">
              <span className="bg-purple-500 text-white rounded-full p-2">
                ✔️
              </span>
              <p className="ml-2 font-medium">White Label Solution Available</p>
            </div>
            <div className="flex items-center bg-white text-black rounded-full px-6 py-3">
              <span className="bg-purple-500 text-white rounded-full p-2">
                ✔️
              </span>
              <p className="ml-2 font-medium">100 MB + of Attachment Size</p>
            </div>
            <div className="flex items-center bg-white text-black rounded-full px-6 py-3">
              <span className="bg-purple-500 text-white rounded-full p-2">
                ✔️
              </span>
              <p className="ml-2 font-medium">Email Migration Available</p>
            </div>
          </div>

          {/* <button className="px-6 py-3 rounded-full bg-white text-purple-600 font-bold shadow-lg hover:bg-gray-200 transition-all">
            See all Pricing Plans
          </button> */}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Use Business Email - Increase your business visibility and stand out
            among competition
          </h2>
          <button
            onClick={handleGetStarted}
            className="bg-white hover:scale-120 text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Start Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 px-4 md:px-12 lg:px-32 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <img src="atomai.webp" alt="Logo" className="w-28 mb-2" />
            <h2 className="text-lg font-semibold">atom•ai</h2>
          </div>

          <div className="flex  gap-16">
            <div>
              <h3 className="font-bold mb-3 text-2xl text-black">Compare</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#">Google Workspace</a>
                </li>
                <li>
                  <a href="#">Zoho Mail</a>
                </li>
                <li>
                  <a href="#">Outlook</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-2xl text-black">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Blogs</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>

                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Download Apps</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-2xl text-black">Contact Us</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  📞 Call Us:{" "}
                  <span className="text-black font-semibold">
                    +91 8879138857
                  </span>
                </li>
                <li>
                  📍 Address: 1202, Gera Imperium Rise,
                  <br />
                  Hinjewadi Phase 2, Pune - 411057
                </li>
                <li>
                  📧 Mail Us:{" "}
                  <a
                    href="mailto:mishralucky074@gmail.com"
                    className="text-purple-600"
                  >
                    mishralucky074@gmail.com
                  </a>
                </li>
              </ul>
              <div className="flex  gap-6 mt-3">
                <a href="#">
                  <img src="facebook.png" className="w-8 h-8" />
                </a>
                <a href="#">
                  <img src="twitter.png" className="w-8 h-8" />
                </a>
                <a href="#">
                  <img src="linkedin.png" className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
          <p className="bg-gradient-to-br from-green-400 to-blue-600 bg-clip-text text-transparent ">
            ©2025 Floww APIs Pvt. Ltd.
          </p>
          <div className="flex space-x-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Refund Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

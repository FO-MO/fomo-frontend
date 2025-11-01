"use client";

import React from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignUpClick = () => {
    const userData = {
      email,
      password,
      timestamp: new Date().toISOString(),
    };

    console.log("Sign up triggered with user data:", userData);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Link href="/">
        <div className="w-full border-b border-gray-300 py-4 px-12">
          <h1 className="text-black text-3xl font-bold">FOOMO</h1>
        </div>
      </Link>
      {/* Centered login form */}
      <div className="flex flex-1 scale-90 sm:scale-100 justify-center items-center ">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-6">
            Login
          </h2>
          <p className="text-sm text-gray-400 mt-2 mb-1">
            Enter your credentials to access your account
          </p>

          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-teal-900 font-semibold hover:text-teal-800"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-700 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              onClick={handleSignUpClick}
              className="w-full flex justify-center rounded-md bg-teal-900 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Login
            </button>
          </form>
          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">
              Don't have an account?
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link
            href="/auth/signup"
            className="mt-4 w-full inline-block text-center border border-teal-900 text-teal-700 bg-white py-2 rounded-md hover:bg-teal-900 hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useNavigate } from "react-router-dom";
import { signOut } from "../actions/userActions";
import axiosInstance from "../utils/API/API";
import urls from "../utils/API/endpoint";
import logo from "../assets/img/brand/logo.svg";

const Label = tw.label`block font-bold`;
const Input = tw.input`py-1 px-2 border w-full`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState("");
  const [errorCode, setErrorCode] = useState({ stack: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    signOut();
    const host = new URL(window.location.href.split("#/")[0]);
    setHostname(host.origin + "/" + (host.searchParams.get("ip") || ""));
  }, []);

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleHostname = (e) => setHostname(e.target.value);

  const onSubmit = (e) => {
    if (e) e.preventDefault();

    // This gives false sense of security. In a perfect world
    // a backend would have set the key as a cookie with both
    // the Secure & Http-only flags enabled
    const auth = window.btoa(`${username}:${password}`);
    window.localStorage.setItem("authKey", auth);
    window.localStorage.setItem("ipAddress", hostname);

    axiosInstance
      .post(urls.noopAuth)
      .then((data) => {
        console.log("Connection successful.");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setErrorCode(error);
        setError(
          "Error connecting. Please check your username password and make sure rclone is working properly at the specified IP."
        );
      });
  };

  return (
    <div className="flex">
      <div className="mx-auto">
        <div className="flex justify-center pt-20 mb-10">
          <img src={logo} alt="rclone" className="w-40" />
        </div>

        <form onSubmit={onSubmit} className="border w-96 p-10">
          {error && (
            <details className="bg-red-100 text-red-600 p-3 mb-3">
              <>
                <summary>{error}</summary>
                <p className="pt-1 text-xs text-red-900 font-normal break-all">
                  {errorCode && errorCode?.stack}
                </p>
              </>
            </details>
          )}
          <div className="mb-3">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              type="text"
              autoComplete=""
              onChange={handleHostname}
              value={hostname}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="host">Username</Label>
            <Input
              type="text"
              autoComplete="username"
              onChange={handleUsername}
              value={username}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="host">Password</Label>
            <Input
              type="password"
              autoComplete="current-password"
              onChange={handlePassword}
              value={password}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-black text-white font-bold uppercase"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

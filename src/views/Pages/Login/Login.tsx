import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import { useNavigate } from "react-router-dom";
import { UncontrolledAlert } from "reactstrap";
import { connect, useDispatch } from "react-redux";
import {
  changeAuthKey,
  changeIPAddress,
  changeUserNamePassword,
  signOut,
} from "../../../actions/userActions";
import axiosInstance from "../../../utils/API/API";
import urls from "../../../utils/API/endpoint";
import logo from "../../../assets/img/brand/logo.svg";
import { LOGIN_TOKEN } from "../../../utils/Constants";

const Label = tw.label`block font-bold`;
const Input = tw.input`py-1 px-2 border w-full`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hostname, setHostname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //@todo: what does this do
  useEffect(() => {
    setHostname(window.location.href.split("#/")[0]);

    if (hostname?.indexOf("?") !== -1) {
      setHostname(window.location.href.split("?")[0]);
    }
  }, []);

  useEffect(() => {
    signOut();

    let url = new URL(window.location.href);
    let loginToken = url.searchParams.get(LOGIN_TOKEN);
    if (url.searchParams.get("ip_address")) {
      setHostname(url.searchParams.get("ip_address") || "");
    }

    if (loginToken) {
      Promise.all([changeAuthKey(loginToken), changeIPAddress(hostname)]);
      redirectToDashboard();
    }
  }, []);

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleHostname = (e) => setHostname(e.target.value);
  const redirectToDashboard = () => navigate("/dashboard");

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    if (e) e.preventDefault();

    Promise.all([
      dispatch(changeUserNamePassword(username, password)),
      dispatch(changeIPAddress(hostname)),
    ]).then(() => {
      axiosInstance.post(urls.noopAuth).then(
        (data) => {
          console.log("Connection successful.");
          redirectToDashboard();
        },
        (error) => {
          console.log(error);
          setError(
            "Error connecting. Please check your username password and make sure rclone is working properly at the specified IP."
          );
        }
      );
    });
  };

  return (
    <div className="flex" data-test="loginComponent">
      <div className="mx-auto">
        <div className="flex justify-center pt-20 mb-10">
          <img src={logo} alt="rclone" className="w-40" />
        </div>

        <form onSubmit={onSubmit} className="border w-96 p-10">
          {error && (
            <div
              className="bg-red-100 text-red-600 p-3 mb-3"
              children={error}
            />
          )}
          <div className="mb-3">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              type="text"
              autoComplete="url"
              onChange={handleHostname}
              defaultValue={hostname}
              data-testid="LoginForm-ipAddress"
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="host">Username</Label>
            <Input
              type="text"
              autoComplete="username"
              data-testid="LoginForm-userName"
              onChange={handleUsername}
              value={username}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="host">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              data-testid="LoginForm-password"
              autoComplete="current-password"
              onChange={handlePassword}
              value={password}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-black text-white font-bold uppercase"
              type="submit"
              data-testid="LoginForm-BtnLogin"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default connect(null, {})(Login);

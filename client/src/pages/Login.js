import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Label, Input, Button } from "@windmill/react-ui";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useState, useEffect } from "react";
import LoginImage from "../assets/image.png";

function Login() {
  const clientId =
    "329607877296-qvr7df27pu766m1qjuvp6hdlcv6j3gf1.apps.googleusercontent.com";
  const history = useHistory(); 
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const onSuccess = async (res) => {
    console.log("LOGIN SUCCESS!", res.profileObj.email);
    try {
      const response = await fetch(
        `http://localhost:5555/getstudentdetails/${res.profileObj.email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      const { name, email, rollno, department, role, semester } =
        userData;

      sessionStorage.setItem("name", name);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("rollno", rollno);
      sessionStorage.setItem("department", department);
      sessionStorage.setItem("role", role.toString());
      sessionStorage.setItem("semester", semester);
      history.push("/app");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const onFailure = (res) => {
    console.log("Login failed", res);
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={LoginImage}
              alt="Office"
            />

            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={LoginImage}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="sharmilaa@gmail.com"
                />
              </Label>

              <Label className="mt-4">
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  placeholder="***************"
                />
              </Label>

              <Button className="mt-4" block tag={Link} to="/app">
                Log in
              </Button>

              <hr className="my-8" />

              <div className="flex justify-center">
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Continue with Google"
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                  cookiePolicy={"single_host_origin"}
                  isSignedIn={true}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;

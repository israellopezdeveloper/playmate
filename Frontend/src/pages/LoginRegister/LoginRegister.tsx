import "./styles.css";

import React, { Component, useState, useEffect } from "react";

import { Tab } from "@headlessui/react";

import { PageView } from "layout/PageView";
import InputComponent from "components/InputComponent";
import { UploadAvatar } from "components/UploadAvatar/UploadAvatar";
import { Switch } from "components/Switch";
import { useAccount, useChainId, useDisconnect } from 'wagmi';

function Login() {
  const { address, isConnected } = useAccount();
  const chain = useChainId();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address && chain) {
      fetch("http://127.0.0.1:5000/login-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          chainId: chain,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            window.localStorage.setItem("token", data.data);
            window.localStorage.setItem("loggedIn", true);
            window.localStorage.setItem("chainId", chain.toString());
            window.location.href = "./../..";
          } else {
            console.log("Error logging in:", data.error);
            disconnect();
          }
        });
    }
  }, [isConnected, address, chain, disconnect]);

  return (
    <section className="flex justify-center items-center h-full">
      <p className="text-white text-xl">
        Please connect your wallet to log in.
      </p>
    </section>
  );
}

function Register({
  onSubmit,
  onUsernameChange,
  onPasswordChange,
  onFnameChange,
  onLnameChange,
  onUserTypeChange,
  isConnected
}: any) {
  return (
    <section>
      <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-6'>
        <InputComponent label="First Name" onChange={onFnameChange} type="text" placeholder='First Name' style="w-full md:w-80" />
        <InputComponent label="Last Name" onChange={onLnameChange} type="text" placeholder='Last Name' style="w-full md:w-80" />
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-6'>
        <InputComponent label="Username" onChange={onUsernameChange} type="text" placeholder='Username' style="w-full md:w-80" />
      </div>

      <div className='mt-6'>
        <InputComponent label="Password" onChange={onPasswordChange} type="password" placeholder='Password' style="w-full md:w-80" />
      </div>

      <button
        onClick={() => onSubmit()}
        disabled={!isConnected}
        className={`mt-12 flex w-full items-center justify-center rounded-half px-20 py-3 text-dim-black md:w-auto ${isConnected
          ? 'bg-blue-high hover:bg-blue-high/80'
          : 'bg-grey-high cursor-not-allowed'
          }`}
      >
        Register
      </button>

      {!isConnected && (
        <p className="mt-4 text-red-500 text-center">
          Please connect your wallet before continuing.
        </p>
      )}
    </section>
  );
}

export function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [userType, setUserType] = useState("");

  const [loginBtnColor, setLoginBtnColor] = useState("bg-dark");

  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const closePopup = function() {
    setPopupVisible(false);
  }

  useEffect(() => {
    if (popupMessage != "" && popupMessage != undefined && popupMessage != null) {
      console.log("popupMessage: ", popupMessage);

      setPopupVisible(true);
      window.localStorage.removeItem("message");

      setTimeout(() => {
        setPopupVisible(false);
      }
        , 5000);

      console.log("popupVisible: ", popupVisible);
    } else {
      setPopupVisible(false);
    }
  }, [popupMessage]);

  useEffect(() => {
    setPopupMessage(window.localStorage.getItem("message"));
    setPopupVisible(false);
  }, []);

  useEffect(() => {
    if (email && password) {
      setLoginBtnColor("bg-current");
    } else {
      setLoginBtnColor("bg-dark");
    }
  }, [email, password]);

  function login() {
    fetch("http://127.0.0.1:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
        walletAddress: address,
        chainId: chainId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);

          window.location.href = "./../..";
        } else {
          window.localStorage.setItem("messageType", "danger");
          setPopupMessage(data.error);
        }
      });
  }

  function register() {
    fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        lname,
        userType,
        email,
        password,
        walletAddress: address,
        chainId: chainId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);

          window.location.href = "./../..";
        } else {
          window.localStorage.setItem("messageType", "danger");
          setPopupMessage(data.error);
        }
      });
  }

  return (
    <PageView title='Login'>
      <Tab.Group manual defaultIndex={0}>

        <Tab.List className='mb-12 flex max-w-full gap-x-2 overflow-x-scroll'>
          <Tab className='app-tab shrink-0 whitespace-nowrap !px-7'>
            Login
          </Tab>
          <Tab className='app-tab shrink-0 whitespace-nowrap !px-7'>
            Register
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <Login
              onSubmit={login}
              onUsernameChange={setEmail}
              onPasswordChange={setPassword}
              isConnected={isConnected}
            />
          </Tab.Panel>
          <Tab.Panel>
            <Register
              onSubmit={register}
              onUsernameChange={setEmail}
              onPasswordChange={setPassword}
              onFnameChange={setFname}
              onLnameChange={setLname}
              onUserTypeChange={setUserType}
              isConnected={isConnected}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </PageView>
  );
}


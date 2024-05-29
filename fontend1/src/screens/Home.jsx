import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";
import {signinChecker} from "../state/atoms/signinChecker.jsx"
import {useRecoilState} from "recoil"
const Home = () => {
  const navigate = useNavigate();
  const [signedIn,setSignedIn]=useRecoilState(signinChecker)

  const ref = useRef(null);
  async function check() {
    ref.current.continuousStart();

    var token = localStorage.getItem("auth");
    if (token !== null) {
      var data = await axios.get("http://localhost:8787/user/validation", {
        headers: { auth: token },
      });
      if (data.status === 200) {
        ref.current.complete();
        setSignedIn(true)
        setTimeout(() => {
          navigate("/user/blogs");
        }, 1000);
      } else if (data.status === 202) {
        ref.current.complete();
        setTimeout(() => {
          navigate("/user/signin");
        }, 1000);
      } else {
        console.log("error");
        ref.current.complete();
      }
    } else {
      ref.current.complete();
      setTimeout(() => {
        navigate("/user/signin");
      }, 1000);
    }
  }
  return (
    <div className="grid grid-row h-screen">
      <LoadingBar color="red" ref={ref} />

      <div className="flex flex-cols justify-between pl-4 pr-4 ">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>{" "}
          </a>
        </div>

        <div>
          <button
            className="bg-red-400 text-xs pl-1 pr-1 pt-0.5 pb-0.5 rounded-lg text-white bg-zinc-800"
            onClick={check}
          >
            Sign In
          </button>
        </div>
      </div>
      <div className="h-80 bg-amber-400 flex flex-col items-center justify-center">
        <p className="text-3xl font-black">Stay Curious.</p>
        <p className="font-light mb-2 ">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
        <div>
          <button
            className="border border-slate-600 text-xs p-1 rounded hover:bg-slate-600  transition delay-150 "
            onClick={() => navigate("/user/blogs")}
          >
            Start Reading
          </button>
        </div>
      </div>
      <div className="row-span-1 flex items-center justify-center pb-1">
        Contact Us
      </div>
    </div>
  );
};

export default Home;

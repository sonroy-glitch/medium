import React, { useState ,useEffect,useRef} from "react";
import { signupSchema, typeSignup } from "@sr1435/common-medium-app";
import LoadingBar from "react-top-loading-bar"
import axios from "axios";
import { useRecoilState } from "recoil";
import {useNavigate} from "react-router-dom"
import {signinChecker} from "../state/atoms/signinChecker.jsx"

const Signup = () => {
  var timeoutClock1, timeoutClock2, timeoutClock3;
  const navigate =useNavigate()
  const [type, setType] = useState("password");
  const [message, setMessage] = useState("");
  const [button, setButton] = useState("Show Password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn,setSignedIn]=useRecoilState(signinChecker)

  const ref=useRef(null)
  useEffect(()=>{
   setTimeout(() => {
    setMessage("")
   }, 10000);
  },[message])
  function nameDebounced(e) {
    clearTimeout(timeoutClock1);
    timeoutClock1 = setTimeout(() => {
      setName(e);
    }, 200);
  }
  function emailDebounced(e) {
    clearTimeout(timeoutClock2);
    timeoutClock2 = setTimeout(() => {
      setEmail(e);
    }, 200);
  }
  function passwordDebounced(e) {
    clearTimeout(timeoutClock3);
    timeoutClock3 = setTimeout(() => {
      setPassword(e);
    
    }, 200);
  }
  async function run() {
    ref.current.continuousStart()

    var check = signupSchema.safeParse({
      name,
      email,
      password
    });
    console.log(check);
     if(!(check.success)){
      setMessage("Incorrect format of Email or Password")
      ref.current.complete()
     }
     else{
      try{
        var data = await axios.post("https://medium.rsounak55.workers.dev/user/signup",{
          name,
          email,
          password
        })
        console.log(data)
       if(data.status===200){
        localStorage.setItem("auth",data.data)
        setSignedIn(true)
        ref.current.complete()
         navigate("/user/blogs")
        }
        else if(data.status===202){
          setMessage(data.data)
          ref.current.complete()
        }
        else{
          setMessage("Server Error")
          ref.current.complete()
        }
      }
      catch(err){
        console.log(err)
      }
     }
  }
  return (
    <div className="grid grid-cols-2 items-center justify-center w-screen h-screen">
        <LoadingBar color="red" ref={ref}/>

      <div className="flex flex-col items-center justify-center h-screen ">
        <p className="text-2xl font-black">Create an account</p>
        <p className="text-xs mb-2">
          Already have an account?
          <a className="underline" href="/user/signin">
            Log in
          </a>
        </p>
        <p className="w-48 text-xs font-semibold mb-1">Name</p>
        <input
          className="w-48 border border-slate-600 text-xs p-0.5 rounded mb-2"
          placeholder="Enter your name"
          onChange={(e) => nameDebounced(e.target.value)}
        />
        <p className="w-48 text-xs font-semibold mb-1"> Email</p>
        <input
          className="w-48 border border-slate-600 text-xs p-0.5 rounded mb-2"
          placeholder="m@example.com"
          onChange={(e) => emailDebounced(e.target.value)}
        />
        <p className="w-48 text-xs font-semibold mb-1">Password</p>
        <input
          className="w-48 border border-slate-600 text-xs p-0.5 rounded mb-2 "
          type={type}
          onChange={(e) => passwordDebounced(e.target.value)}
        />
        <button
          onClick={() => {
            if (type === "password") {
              setType("text");
              setButton("Hide Password");
            } else if (type === "text") {
              setType("password");
              setButton("Show Password");
            }
          }}
          className="w-48 border border-slate-600 bg-black text-white text-xs p-0.5 rounded mb-1 "
        >
          {button}
        </button>
        <button
          className="w-48 border border-slate-600 bg-black text-white text-xs p-0.5 rounded mb-1 "
          onClick={() => {
            
            run();
          }}
        >
          Sign Up
        </button>
        <p className="text-xs font-light">{message}</p>
      </div>
      <div className="bg-stone-200  items-center justify-center flex flex-col h-screen ">
        <div className="text-md text-wrap font-bold w-72 ">
          "The customer service I received was exceptional. The support team
          went above and beyond to address my concerns."
        </div>
        <div className="text-sm font-semibold w-72 text-left">
          Jules Winnfield
        </div>
        <div className="text-xs w-72 font-normal">CEO,Acme Inc.</div>
      </div>
    </div>
  );
};

export default Signup;

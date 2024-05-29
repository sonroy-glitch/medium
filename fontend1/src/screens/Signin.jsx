import React,{useState,useEffect,useRef} from 'react'
//revoke token first
import {signinSchema} from "@sr1435/common-medium-app"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import LoadingBar from "react-top-loading-bar"


const Signin = () => {
  var timeoutCounter;

  const [type1,setType1]=useState("password")
  const [message,setMessage]=useState("")
  const [button,setButton]=useState("Show Password")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const ref= useRef(null)
  const navigate=useNavigate()
  //message clearing
  useEffect(() => {
  setTimeout(() => {
    setMessage("")
  }, 10000);
  }, [message])
  //signin direct token
  // useEffect(()=>{
  //   var token = localStorage.getItem("auth");
  //   if(token!==null){
  //     async function call(){
  //       var data= await axios.get("http://localhost:8787/user/validation",
  //        { headers:{auth:token}}
  //       )
  //       console.log("hi")
  //       if(data.status===202){
  //         navigate("/user/blogs")
  //       }
  //      }
  //      call();
  //   }
   
  // },[])
  
  function emailDebounced(e){
    clearTimeout(timeoutCounter)
    timeoutCounter=setTimeout(() => {
      setEmail(e)
    }, 200);
  }
  function passwordDebounced(e){
    clearTimeout(timeoutCounter)
    timeoutCounter=setTimeout(() => {
      setPassword(e)
    }, 200);
  }
  async function run(){
    ref.current.continuousStart()
    localStorage.removeItem("auth")
    const check=signinSchema.safeParse({
      email,
      password
    })
    if(!(check.success)){
      setMessage("Invalid format of email or password")
      ref.current.complete();

    }
    else{
      var data = await axios.post("http://localhost:8787/user/signin",{
        email,
        password
      })
      if(data.status===200){
        localStorage.setItem("auth",data.data)
        ref.current.complete();
        navigate("/user/blogs")
      }
      else if (data.status ===202){
        setMessage(data.data)
        ref.current.complete();

      }
      else{
        setMessage("Server Error")
        ref.current.complete();

      }
    }
  }
  return (
    <div><div className="grid grid-cols-2 items-center justify-center w-screen h-screen">
        <LoadingBar color="red" ref={ref}/>

    <div className="flex flex-col items-center justify-center h-screen ">
    
 
    <p className="text-2xl font-black mb-2">Login</p>
    <p className="text-xs mb-2">Don't have an account?  
            <a className="underline" href="/user/signup">Sign Up</a>
          </p>

      <p className="w-48 text-xs font-semibold mb-1"> Email</p>
      <input className="w-48 border border-slate-600 text-xs p-0.5 rounded mb-2" placeholder="m@example.com" onChange={(e)=>emailDebounced(e.target.value)}/>
      <p className="w-48 text-xs font-semibold mb-1">Password</p>
      <input className="w-48 border border-slate-600 text-xs p-0.5 rounded mb-2 " type={type1} onChange={(e)=>passwordDebounced(e.target.value)}/>
      <button onClick={()=>{
          if(type1==="password"){
            setType1("text")
            setButton("Hide Password")
          }
          else if (type1==="text"){
            setType1  ("password")
            setButton("Show Password")

          }
        }} className="w-48 border border-slate-600 bg-black text-white text-xs p-0.5 rounded mb-1 ">{button}</button>
      <button className="w-48 border border-slate-600 bg-black text-white text-xs p-0.5 rounded mb-1 " onClick={run}>Login</button>
     <p className="text-xs font-light">{message}</p>
      
    </div>
    <div className="bg-stone-200  items-center justify-center flex flex-col h-screen ">
      <div className="text-md text-wrap font-bold w-72 ">"The customer service I received was exceptional. The support team went above and beyond to address my concerns."</div>
      <div className="text-sm font-semibold w-72 text-left">Jules Winnfield</div>
      <div className="text-xs w-72 font-normal">CEO,Acme Inc.</div>
    </div>

  </div></div>
  )
}

export default Signin
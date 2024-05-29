import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { signinChecker } from "../state/atoms/signinChecker.jsx";
import { useRecoilState, useRecoilValue } from "recoil";
import { blogsHolder } from "../state/atoms/blogsHolder.jsx";
import LoadingBar from "react-top-loading-bar";
import { useNavigate } from "react-router-dom";
import { profileDiv } from "../state/atoms/profileDiv.jsx";
import { singleBlog } from "../state/atoms/singleBlog.jsx";
import { userName } from "../state/atoms/userName.jsx";
import { privateBlog } from "../state/atoms/privateBlog.jsx";

import ProfileContainer from "../components/ProfileContainer.jsx";
import "./blogs.css";
const Profile = () => {
  const signedIn = useRecoilValue(signinChecker);
  const name = useRecoilValue(userName);
  const navigate = useNavigate();
  const [profile, setProfile] = useRecoilState(profileDiv);
  var token = localStorage.getItem("auth");
  const [userBlog, setUserBlog] = useRecoilState(privateBlog);
  const [state,setState]= useState("home")
  const [blog,setBlog ]=useRecoilState(singleBlog)
  const [aboutData,setAboutData]=useState("")
  const [aboutHolder,setAboutHolder]=useState("")//holds the about value from the text area 
  const ref= useRef(null)
  useEffect(() => {
    setProfile(false);
  }, []);
  useEffect(() => {
    async function call() {
      ref.current.continuousStart()
      var data = await axios.get("https://medium.rsounak55.workers.dev/user/api/fetch", {
        headers: { auth: token },
      });
      setUserBlog(data.data);
      ref.current.complete()
     
    }
    call();
  }, []);
  useEffect(() => {
    async function call() {
      var data =await axios.get("https://medium.rsounak55.workers.dev/user/api/about",{
        headers:{auth:token}
      })
      setAboutData(data.data)
      
    }
    call()
  }, [])
  
  function run (e){
   var data = userBlog[e]
   setBlog(data)
   navigate("/user/api/blog")
  }
  async function updateAbout(){
    ref.current.continuousStart()

  if(aboutHolder==null){
    setAboutHolder(aboutData)
  }

  var data = await axios.post("https://medium.rsounak55.workers.dev/user/api/about",{
    about:aboutHolder
  },{
    headers:{auth:token}
  })
  setAboutData(data.data)
  ref.current.complete()

  }
  return (
    <div className="flex flex-col h-screen w-screen">
      <LoadingBar color="red" ref={ref}/>
      <ProfileContainer className="z-10 flex " />

      <div className="flex flex-cols justify-between pl-4 pr-4 border-b border-slate-200">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>{" "}
          </a>
        </div>

        <div className="pb-1">
          {signedIn ? (
            <button
              className="mr-2 text-xs hover:bg-slate-200 transition delay-150  pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg"
              onClick={() => navigate("/user/write")}
            >
              Write
            </button>
          ) : null}

          <button
            className=" text-xs pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg text-white bg-zinc-800"
            onClick={() => {
              signedIn ? setProfile(true) : navigate("/user/signin");
            }}
          >
            {signedIn ? name : "Sign In"}
          </button>
        </div>
      </div>
      {/* body part */}
      <div className="grid grid-cols-3 h-screen ">
        <div className="flex h-80% flex-col col-span-2 border-r border-slate-200 pl-14 justify-start  pt-12 ">
          {userBlog.map((item,index)=>{
          if(index===0){
            return(
              <div className="w-96 text-sm mb-3" key={index}>{item.name}</div>
            )
          }
          else{
            return
          }
          })}
          <div className="flex flex-cols w-96 text-xs border-b border-slate-200 pb-1">
          <div className="mr-2 text-slate-500 hover:text-slate-950 transition delay-100 " onClick={()=>setState("home")}>Home</div>
          <div className="text-slate-500 hover:text-slate-950 transition delay-100" onClick={()=>setState("about")}>About</div>
          </div>
          {(state==="home")?
          userBlog.map((item,index)=>{
          var arr =item.time.split("T")

            return(
              <div className="flex flex-col  mt-2 border-b border-slate-200 mr-6 pr-2 pb-1" key={index} data-id={index} onClick={(e)=>run(e.currentTarget.dataset.id)}>
              <div className="flex flex-row mb-2">
                <div className="size mr-2  items-center justify-center rounded-full p-1 pr-1.5 pl-1.5 bg-slate-200 font-light">{item.nameTag}</div>
                <div className=" size  items-center justify-center pt-1 ">{item.name} ·</div>
                <div className="size1 items-center justify-center pt-1.5 font-light text-slate-900"> {arr[0]}</div>
              </div>
              <div className="flex flex-row  ">
                <div className="mr-3">
                <div className=" text-xs w-72 mb-2 font-bold">{item.title}</div>
                <div className="description-wrap  w-80 text-slate-500 mb-2" >{(item.description)}</div>
  
                </div>
                <div>
                  <img className="h-16 w-auto items-center justify-center" src={item.image}/>
                </div>
  
              </div>
              <div className="size2 mb-2 text-slate-500">2 min read</div>
            </div>
            )}): 
            <div>
              <p className="size5 mt-1">Tell the world about yourself</p>
              <textarea onChange={(e)=>setAboutHolder(e.target.value)} className=" mt-2 w-96 resize-none rounded border border-slate-200 font-noto-serif placeholder:text-gray-400 text-xs tracking-wide placeholder:font-light text-black outline-none block  py-1">{aboutData}</textarea>
              <button className="bg-green-600 text-white mt-2 text-xs pl-1 pr-1 pt-0.5 pb-0.5 rounded" onClick={updateAbout}>Save</button>
            </div>
          }
        </div>
        {userBlog.map((item,index)=>{
          if(index===0){
            return(
              <div className="mt-4 pl-3.5" key={index}>
                <div  className="flex bg-slate-300 w-8 text-xs rounded-full p-2 items-center justify-center mb-2">{userBlog[0].nameTag}</div>
                <div className="text-xs text-slate-700 font-bold mb-1">{userBlog[0].name}</div>
                <div className="text-xs font-light">{aboutData}</div>
              </div>
                )
          }
          else{
            return
          }
        
        })}
        
      </div>
    </div>
  );
};

export default Profile;

import React,{useState,useEffect,useRef} from 'react'
import {userName} from "../state/atoms/userName.jsx"
import {useRecoilValue} from "recoil"
import {profileDiv} from "../state/atoms/profileDiv.jsx"
import {useRecoilState} from "recoil"
import axios from "axios"
import {postSchema} from "@sr1435/common-medium-app"
import {singleBlog} from "../state/atoms/singleBlog.jsx"
import ProfileContainer from "../components/ProfileContainer.jsx"
import {useNavigate} from "react-router-dom"
import LoadingBar from "react-top-loading-bar"

const Bookmark = () => {
  const name=useRecoilValue(userName)
  const navigate=useNavigate()
  const [title,setTitle]=useState()
  const [titleRows,setTitleRows]=useState(1)
  const [profile,setProfile]=useRecoilState(profileDiv)
  const [descriptionRows,setDescriptionRows]=useState(1)
  const [description,setDescription]=useState()
  const [holder,setHolder] =useState("Write")
  var token =localStorage.getItem("auth")
  const  [blog,setBlog]=useRecoilState(singleBlog)
  const ref=useRef(null)
  useEffect(() => {
   setProfile(false)
  }, [])
  
  return (
    <div>
      <LoadingBar color="red" ref={ref} />
          <ProfileContainer className="z-10 flex "/> 

      <div className="flex flex-cols justify-between pl-4 pr-4 border-b border-slate-200">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>{" "}
          </a>
        </div>
        

        <div className="pb-1">  
        
          <button className="mr-2 text-xs bg-green-500 hover:bg-green-600 text-white  transition delay-150  pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg"
          onClick={()=>navigate("/user/write")}
          >{holder}</button>
        
        
          <button
            className=" text-xs pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg text-white bg-zinc-800"
            onClick={()=>{
               setProfile(true)
            }}
          >
           {name}
          </button>
        </div>
      </div>
      {/* body part */}
      <div className="flex flex-col ">
      <div>Bookmarks</div>
      <div></div>
    </div>
    </div>
    
    
  )
}

export default Bookmark
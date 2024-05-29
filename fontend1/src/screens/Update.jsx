import React,{useState,useEffect,useRef} from 'react'
import {userName} from "../state/atoms/userName.jsx"
import {useRecoilValue} from "recoil"
import {profileDiv} from "../state/atoms/profileDiv.jsx"
import {useRecoilState} from "recoil"
import axios from "axios"
import LoadingBar from "react-top-loading-bar"
import {updateSchema} from "@sr1435/common-medium-app"
import {updateHolder} from "../state/atoms/updateHolder.jsx"
import {singleBlog} from "../state/atoms/singleBlog.jsx"
import ProfileContainer from "../components/ProfileContainer.jsx"
import {useNavigate} from "react-router-dom"
//before sending the decription be sure to add / before the " for the string obtained
//also do a json stringfy to compensate the gaps
const Update = () => {
  const name=useRecoilValue(userName)
  const navigate=useNavigate()
  const update = useRecoilValue(updateHolder)
  var id =update.id
  const [title,setTitle]=useState(update.title)
  const [titleRows,setTitleRows]=useState(2)
  const [profile,setProfile]=useRecoilState(profileDiv)
  const [descriptionRows,setDescriptionRows]=useState(20)
  const [description,setDescription]=useState(update.description)
  const [holder,setHolder] =useState("Finish Edit")
  var token =localStorage.getItem("auth")
  const  [blog,setBlog]=useRecoilState(singleBlog)
  const ref=useRef(null)
   useEffect(() => {
   setProfile(false)
   }, [])
  async function run (){
     ref.current.continuousStart()
      var update = await axios.put("https://medium.rsounak55.workers.dev/user/api/update",{
        id,
        title:title,
        description:description,
      },{
        headers:{auth:token}
      })
      if(update.status===200){
        setHolder("Blog Updated")
        setBlog(update.data)
        localStorage.setItem("blog",JSON.stringify(update.data))
     ref.current.complete()
        
       navigate("/user/api/blog")

      
      
    }
    

  }
  function append(){
   setTitleRows(titleRows+1)
  }
  function append1() {
    setDescriptionRows(descriptionRows+1)
  }
  return (
    <div >
        
        <LoadingBar color="red" ref={ref}/>
          <ProfileContainer className="z-10 flex "/> 

      <div className="flex flex-cols justify-between pl-4 pr-4 border-b border-slate-200">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>
          </a>
        </div>
        

        <div className="pb-1">  
        
          <button className="mr-2 text-xs bg-green-500 hover:bg-green-600 text-white  transition delay-150  pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg"
          onClick={run}
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
      <div className="flex justify-center align-center flex-col ">
        <div className="flex justify-center align-center   ">
        <textarea id="title" rows={titleRows} onScroll={append} onChange={(e)=>{setTitle(e.target.value)}} placeholder="title" className="border-b border-slate-200 resize-none font-noto-serif font-bold placeholder:text-gray-400 text-3xl tracking-wide placeholder:font-light text-black outline-none block  py-2">{update.title}</textarea>

        </div>
        <div className="flex justify-center align-center ">
        <textarea id="title" rows={descriptionRows} onScroll={append1} onChange={(e)=>{setDescription(e.target.value)}} placeholder="what's on your mind?" className="resize-none font-noto-serif text-md text-wrap placeholder:text-gray-400 text-3xl tracking-wide placeholder:font-light text-black outline-none block  py-4">{update.description}</textarea>

        </div>


      </div>
    </div>
  )
}

export default Update

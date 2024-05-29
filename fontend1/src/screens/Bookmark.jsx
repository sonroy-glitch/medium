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
import {bookmarkHolder} from "../state/atoms/bookmarkHolder.jsx"


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
  const [bookmark,setBookmark]=useRecoilState(bookmarkHolder)
  useEffect(() => {
   setProfile(false)
  }, [])
  useEffect(() => {
    async function call(){
      ref.current.continuousStart()
      var data = await axios.get("http://localhost:8787/user/api/bookmarks",{
      headers:{auth:token}
    })
    setBookmark(data.data)
    ref.current.complete()

    }
   call()
  }, [])
  function run(e){
    var data = bookmark[e];
    setBlog(data);
    navigate("/user/api/blog")
  }  
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
      <div className="pl-5 p-5">Bookmarks</div>
      {
        bookmark.map((item,index)=>{
          var arr =item.time.split("T")

          return(
            <div className="flex items-center justify-center w-screen bg-slate-100 mb-1 pb-1">
            <div className="flex flex-col mt-2 border-b border-slate-200 pl-2 pr-2 pb-1 bg-white p-2 rounded" key={index} data-id={index} onClick={(e)=>run(e.currentTarget.dataset.id)}>
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
          </div>
          )
        })
      }
      <div></div>
    </div>
    </div>
    
    
  )
}

export default Bookmark
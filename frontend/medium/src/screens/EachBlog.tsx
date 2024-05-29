import React,{useState,useEffect,useRef} from 'react'
import {singleBlog} from "../state/atoms/singleBlog.tsx"
import {blogsHolder} from "../state/atoms/blogsHolder.tsx"
import {profileDiv} from "../state/atoms/profileDiv.tsx"
import {userName} from "../state/atoms/userName.tsx"
import "./blogs.css"
import LoadingBar from "react-top-loading-bar"
import clap from "../assets/clap.svg"
import update from "../assets/update.svg"
import deleteBlog from "../assets/delete.svg"
import ProfileContainer from "../components/ProfileContainer.tsx"
import bookmarktrue from "../assets/bookmarktrue.svg"
import bookmarkfalse from "../assets/bookmarkfalse.svg"
import {useNavigate} from 'react-router-dom'
import {useRecoilState,useRecoilValue,useSetRecoilState} from "recoil"
import {updateHolder} from "../state/atoms/updateHolder.tsx"
import axios from "axios"
const EachBlog = () => {
  const [blog,setBlog]=useRecoilState(singleBlog)
  const [holder,setHolder]=useRecoilState(blogsHolder)
  const [profile,setProfile]=useRecoilState(profileDiv)
  const name=useRecoilValue(userName)
  const [bookmark,setBookmark]=useState(bookmarkfalse)
  const [check,setCheck]=useState(false)//checks the email of the user to that of the token
  const navigate=useNavigate()
  const ref=useRef(null)
  const setUpdate=useSetRecoilState(updateHolder)
  var data=blog
  const [claps,setClaps]=useState(data.claps)
   var [id,setId ]=useState(data.id)
  var arr =data.time.split("T")
  var token= localStorage.getItem("auth")
  useEffect(() => {
    async function call(){
      var data1 = await axios.get("http://localhost:8787/user/api/check",{
        headers:{auth:token}
      })
      
      if( data1.data==data.author.email){
        setCheck(true)
      }
    }
    call()
  }, [])
  
  async function run (){
 
     var data=await axios.get("http://localhost:8787/user/api/claps",{
      headers:{
        auth:token,
        id
      }
     })
     setClaps(data.data)
  }
  useEffect(() => {
  setProfile(false)

    var bookmark=data.author.bookmarks
    bookmark.map((item)=>{
      if(item === data.id){
        setBookmark(bookmarktrue)
      }
    })
  }, [])
  
  async function bookmarkAdd(){
    console.log(id)
    var data = await axios.get("http://localhost:8787/user/api/bookmarks",{
      headers:{
        auth:token,
        id
      }
    })
    setBookmark(bookmarktrue) 
  }
  function updatefn(){
    setUpdate(data);
    navigate("/user/api/update")
  }
  async function deleteBlogs(){
    ref.current.continuousStart()
    var data =await axios.post("http://localhost:8787/user/api/delete",{
      id
    },{
      headers:{auth:token}
    }
  )
  ref.current.complete()

  navigate("/user/blogs")
  }

  return (
    <div>
      <LoadingBar color="red" ref={ref}/>
          <ProfileContainer className="z-10 flex "/> 

      <div >

      <div className="flex flex-cols justify-between pl-4 pr-4 border-b border-slate-200">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>{" "}
          </a>
        </div>
        

        <div className="pb-1">  
        
          <button className="mr-2 text-xs hover:bg-slate-200 transition delay-150  pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg"
          onClick={()=>navigate("/user/write")}
          >Write</button>
        
        
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
      <div className="flex  flex-col  text-wrap  items-center justify-center ">
      <div className="flex text-md text-wrap w-72 font-bold mt-2  items-center justify-center">{data.title}</div>
      <div className="flex flex-row mt-3 pb-2 w-72 border-slate-200 border-b pl-2">
        <div className="size mr-2  items-center justify-center rounded-full p-1 pr-1.5 pl-1.5 bg-slate-200 font-light" >{data.nameTag}</div>
        <div >
        <div className="size1 font-bold">{data.name}</div>
        <div className="  flex flex-row">
        <div className="size1">{data.author.about}</div>
        <div className="size4 pt-0.5 ml-0.5 text-slate-500"> ·{arr[0]}</div>

        </div>

        </div>

      </div>
      <div className="flex flex-row justify-between w-72 pl-1 pr-1 mt-1 pb-1 border-b border-slate-200  ">
      
        <div onClick={run} className="flex flex-row items-center justify-center  ">
        <img className=" w-2   h-2 mr-1 items-center justify-center"src={clap}/>
        <div className="size4 items-center justify-center ">{claps}</div>
        </div>
      
        <div  className="flex flex-row">
        <div onClick={bookmarkAdd} className="flex flex-row items-center justify-center mr-1 ">
          <img  className="w-2 h-2"src ={bookmark}/>
        </div>
        {check? (
          <div className="flex flex-row">
          <div className="mr-1" onClick={updatefn}>
            <img className="w-2.5 h-2.5 " src={update}/>
          </div>
          <div onClick={deleteBlogs}>
          <img className="w-2.5 h-2.5 " src={deleteBlog}/>

          </div>
          </div>
        ): null}
        </div>
      </div>
      <div>
        <pre className="size3  w-72 text-wrap">{data.description}</pre>
      </div>
      
      </div>
    

    </div>
    </div>
    
  )
}

export default EachBlog
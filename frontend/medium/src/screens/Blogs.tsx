import React,{useEffect,useState,useRef} from 'react'
import axios from "axios"
import {signinChecker} from "../state/atoms/signinChecker.tsx"
import {useRecoilState} from "recoil"
import {blogsHolder} from "../state/atoms/blogsHolder.tsx"
import LoadingBar from "react-top-loading-bar"
import {useNavigate} from "react-router-dom"
import {profileDiv} from "../state/atoms/profileDiv.tsx"
import {singleBlog} from "../state/atoms/singleBlog.tsx"
import {userName} from "../state/atoms/userName.tsx"
import ProfileContainer from "../components/ProfileContainer.tsx"
import "./blogs.css"
const Blogs = () => {
  const [data,setData]=useState("Sign In")
  const [signedIn,setSignedIn]=useRecoilState(signinChecker)
  const [holder,setHolder]=useRecoilState(blogsHolder)
  const [profile,setProfile]=useRecoilState(profileDiv)
  const ref=useRef(null)
  const navigate =useNavigate()
  const [name,setName]=useRecoilState(userName)
  const [blog,setBlog]=useRecoilState(singleBlog)
  //fetching all the blogs
  useEffect(() => {
    var token=localStorage.getItem("auth")
    async function call(){
      ref.current.continuousStart()
    var data = await axios.post("http://localhost:8787/user/fetch/all")
      if(token!==null){
        var data1 = await axios.get("http://localhost:8787/user/api/name",{
          headers:{auth:token}
        })
        setName(data1.data)
      }
      setHolder(data.data)
      // console.log(data.data)
      ref.current.complete()
    }
    call();
   }, [signedIn])

   useEffect(()=>{
    setProfile(false)
    var token= localStorage.getItem("auth");
    if(token!==null){
      async function call(){
       var data = await axios.get("http://localhost:8787/user/validation", {
        headers: { auth: token },
      })
      if(data.status===200){
        setSignedIn(true)
      }
      }
      call()
    }
   },[])
   function run (index){
    if(signedIn){
      setBlog(holder[index]);
      navigate("/user/api/blog")
    }
    else{
      navigate("/user/signin")
    }
   }
   
  return (
    
      <div className="z-0">
          <ProfileContainer className="z-10 flex "/> 

        <LoadingBar color="red" ref={ref}/>
    
      <div className="flex flex-cols justify-between pl-4 pr-4 border-b border-slate-200">
        <div>
          <a href="/user/blogs">
            <p className="font-md">Medium</p>{" "}
          </a>
        </div>
        

        <div className="pb-1">  
        {signedIn ? (
          <button className="mr-2 text-xs hover:bg-slate-200 transition delay-150  pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg"
          onClick={()=>navigate("/user/write")}
          >Write</button>
        ) : null}
        
          <button
            className=" text-xs pl-1.5 pr-1.5 pt-0.5 pb-0.5 rounded-lg text-white bg-zinc-800"
            onClick={()=>{
              signedIn? setProfile(true):navigate("/user/signin")
            }}
          >
           {signedIn?name:"Sign In"}
          </button>
        </div>
      </div>
     {/* starting div foe the blogs component */}
      <div className="flex flex-col justify-center items-center w-screen ">
        {holder.map((item,index)=>{
          var arr =item.time.split("T")
          return(
            <div className="flex flex-col  mt-2 border-b border-slate-200 pl-2 pr-2 pb-1" key={index} data-id={index} onClick={(e)=>run(e.currentTarget.dataset.id)}>
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
          )
        })}
         
         
      </div>
      </div>
    
  )
}

export default Blogs
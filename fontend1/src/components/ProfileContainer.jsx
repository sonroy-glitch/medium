import React from 'react'
import {useNavigate} from "react-router-dom"
import {profileDiv} from "../state/atoms/profileDiv.jsx"
import {useRecoilState,useSetRecoilState} from "recoil"
import {signinChecker} from "../state/atoms/signinChecker.jsx"

import "./profile.css"
const ProfileContainer = () => {
    const  navigate=useNavigate()
    const [profile,setProfile]=useRecoilState(profileDiv)
    const setSignin =useSetRecoilState(signinChecker)
    function signout(){
         localStorage.removeItem("auth")
         setSignin(false)
         setProfile(false)
         navigate("/")
    }
    if(profile){
        return (
            <div className="bg-slate-200 absolute flex flex-col top-7 right-1  rounded">
                <div className="size4  hover:bg-slate-500 pr-1 pl-1 rounded transition delay-150" onClick={()=>{navigate("/user/api/profile")}}>Profile</div>
                <div className="size4  hover:bg-slate-500 pr-1 pl-1 rounded transition delay-150" onClick={()=>{navigate("/user/api/bookmark")}}>Bookmarks</div>
                <div className="size4 hover:bg-slate-500 pr-1 pl-1 rounded transition delay-150" onClick={signout}>Signout</div>
            </div>
          )
    }
    else{
        return null
    }
  
}

export default ProfileContainer
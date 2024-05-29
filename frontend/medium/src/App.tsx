import { useState ,Suspense} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Write from "./screens/Write.tsx"
import Signin from "./screens/Signin.tsx"
import Signup from "./screens/Signup.tsx"
import Blogs from "./screens/Blogs.tsx"
import Home from "./screens/Home.tsx"
import NotFound from "./screens/NotFound.tsx"
import EachBlog from "./screens/EachBlog.tsx"
import Profile from "./screens/Profile.tsx"
import Bookmark from "./screens/Bookmark.tsx"
import Update from "./screens/Update.tsx"
import {Routes,Route} from "react-router-dom"
function App() {
  const [count, setCount] = useState(0)

  return (
    <Suspense fallback={"loading...."}>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/user/signin" element={<Signin/>}/>
      <Route path="/user/signup" element={<Signup/>}/>
      <Route path="/user/blogs" element={<Blogs/>}/>
      <Route path="/user/write" element={<Write/>}/>
      <Route path="/user/api/blog" element={<EachBlog/>}/>
      <Route path="/user/api/profile" element={<Profile/>}/>
      <Route path="/user/api/bookmark" element={<Bookmark/>}/>
      <Route path="/user/api/update" element={<Update/>}/>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  )
}

export default App

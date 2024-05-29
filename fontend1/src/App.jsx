import { useState ,Suspense} from 'react'
import './App.css'
import Write from "./screens/Write.jsx"
import Signin from "./screens/Signin.jsx"
import Signup from "./screens/Signup.jsx"
import Blogs from "./screens/Blogs.jsx"
import Home from "./screens/Home.jsx"
import NotFound from "./screens/NotFound.jsx"
import EachBlog from "./screens/EachBlog.jsx"
import Profile from "./screens/Profile.jsx"
import Bookmark from "./screens/Bookmark.jsx"
import Update from "./screens/Update.jsx"
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

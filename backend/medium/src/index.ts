import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import bcrypt from "bcryptjs";
import { cors } from "hono/cors";
import { z } from "zod";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { verify, sign, decode } from "@tsndr/cloudflare-worker-jwt";
import { Context, Next } from "hono";
import {
  signupSchema,
  typeSignup,
  signinSchema,
  typeSignin,
  postSchema,
  typePost,
  updateSchema,
  typeUpdate,
} from "@sr1435/common-medium-app";
import axios from "axios";
const app = new Hono();
app.use("/*", cors());
var prisma;
// endpoint for medium
//signup,signin,fetch,add,update,delete
//db connection endpoint
app.use(async (c: Context, next: Next) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());
  await next();
});
//signup endpoint
app.post("/user/signup", async (c: Context) => {
  const { JWT_PASSCODE } = env<{ JWT_PASSCODE: string }>(c);
  const body: typeSignup = await c.req.json();
  const search = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (search !== null) {
    return new Response("User already exist, Signin", { status: 202 });
  }
  const check = signupSchema.safeParse(body);
  if (!check.success) {
    return new Response("Invalid format of email or password", { status: 202 });
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      bookmarks: [],
      about: "Persistent, not perfect.",
    },
  });
  const token = await sign(
    { email: body.email },
    { JWT_PASSCODE }.JWT_PASSCODE
  );
  return new Response(token, { status: 200 });
});
//signin endpoint
app.post("/user/signin", async (c: Context) => {
  const { JWT_PASSCODE } = env<{ JWT_PASSCODE: string }>(c);

  const body: typeSignin = await c.req.json();
  const search = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (search === null) {
    return new Response("User doesnt exist,Signup first", { status: 202 });
  }
  const check = signinSchema.safeParse(body);
  if (!check.success) {
    return new Response("Provide proper inputs", { status: 202 });
  }
  const check1 = await bcrypt.compare(body.password, search.password);
  if (!check1) {
    return new Response("Wrong Password", { status: 202 });
  }
  var token = await sign(
    { email: search.email },
    { JWT_PASSCODE }.JWT_PASSCODE
  );
  return new Response(token, { status: 200 });
});
app.use("/user/api/*", async (c: Context, next: Next) => {
  const { JWT_PASSCODE } = env<{ JWT_PASSCODE: string }>(c);
  const auth = c.req.header("auth");
  const check = await verify(auth, { JWT_PASSCODE }.JWT_PASSCODE);
  if (!check) {
    return new Response("Unauthorized", { status: 403 });
  }
  await next();
});
//add a post
app.post("/user/api/post", async (c: Context) => {
  const body: typePost = await c.req.json();
  var arr = [];
  var tag;
  const decoded = await decode(c.req.header("auth"));
  var search = await prisma.user.findFirst({
    where: {
      email: decoded.payload.email,
    },
  });
  if (search !== null) {
    var check = postSchema.safeParse(body);
    if (!check.success) {
      return new Response("Kindly provide proper inputs");
    }
    const randomNumber = parseInt(Math.random() * 10000);
    const url = `https://picsum.photos/800/600?random=${randomNumber}`;
    arr = search.name.split(" ");

    var arr1 = arr.filter((item) => item.trim());

    tag = arr1.map((item) => {
      return item[0].toUpperCase();
    });
    var final = tag.join("");

    var data = await prisma.blog.create({
      data: {
        user_id: search.id,
        name: search.name,
        title: body.title,
        description: body.description,
        tags: [],
        claps: 0,
        image: url,
        nameTag: final,
      },
    });
    var store = data.id;
    var finalData = await prisma.blog.findFirst({
      where: { id: store },
      select: {
        id: true,
        user_id: true,
        name: true,
        nameTag: true,
        title: true,
        description: true,
        tags: true,
        claps: true,
        time: true,
        image: true,
        author: true,
      },
    });
    return c.json(finalData, { status: 200 });
  }
});
//fetch all posts
app.post("/user/fetch/all", async (c: Context) => {
  const data = await prisma.blog.findMany({
    where: {},
    select: {
      id: true,
      user_id: true,
      name: true,
      nameTag: true,
      title: true,
      description: true,
      tags: true,
      claps: true,
      time: true,
      image: true,
      author: true,
    },
  });
  return c.json(data);
});
//fetch the post of a user
app.get("/user/api/fetch", async (c: Context) => {
  const decoded = await decode(c.req.header("auth"));
  const data1 = await prisma.user.findFirst({
    where: { email: decoded.payload.email },
  });
  const data = await prisma.blog.findMany({
    where: { user_id: data1.id },
    select:{
        id: true,
        user_id: true,
        name: true,
        nameTag: true,
        title: true,
        description: true,
        tags: true,
        claps: true,
        time: true,
        image: true,
        author: true,
    }
  });
  return c.json(data);
});
//update a post

app.put("/user/api/update", async (c: Context) => {
  const body: typeUpdate = await c.req.json();
  const decoded = await decode(c.req.header("auth"));
  //doing a zod check here although it is useless
  const check = updateSchema.safeParse(body);
  if (!check) {
    return new Response("Wtf have u done there is no blog id");
  }
  const data1 = await prisma.user.findFirst({
    where: { email: decoded.payload.email },
  });
  const data = await prisma.blog.update({
    where: { user_id: data1.id, id: body.id },
    data: {
      title: body.title,
      description: body.description,
    },
  });
  const data2=await prisma.blog.findFirst({
    where:{id:body.id},
    select:{
        id: true,
        user_id: true,
        name: true,
        nameTag: true,
        title: true,
        description: true,
        tags: true,
        claps: true,
        time: true,
        image: true,
        author: true,
    }
  })
  return c.json(data2, { status: 200 });
});
//token verification for direct validation
app.get("/user/validation", async (c: Context) => {
  const { JWT_PASSCODE } = env<{ JWT_PASSCODE: string }>(c);
  const verify1 = await verify(
    c.req.header("auth"),
    { JWT_PASSCODE }.JWT_PASSCODE
  );
  if (!verify1) {
    return new Response("Invalid token", { status: 202 });
  }
  return new Response("Valid token", { status: 200 });
});
//delete a post
app.post("/user/api/delete", async (c: Context) => {
  const body: { id: number } = await c.req.json();
  const decode1 = await decode(c.req.header("auth"));
  try {
    const data = await prisma.blog.delete({
      where: { id: body.id },
    });
    return new Response("Deleted Suceessfully", { status: 200 });
  } catch (err) {
    return c.json(err, { status: 202 });
  }
});
//update the number of claps
//id of the blog
app.get("/user/api/claps", async (c: Context) => {
  const id = Number(c.req.header("id"));
  const data = await prisma.blog.findFirst({
    where: { id },
    select: { claps: true },
  });
  const data1 = await prisma.blog.update({
    where: { id },
    data: { claps: data.claps + 1 },
  });
  return new Response(data.claps + 1, { status: 200 });
});
//adding bookmarks and returning bookmarks
app.post("/user/api/bookmarks", async (c: Context) => {
  const body:{
    id:number,
    title?:string,
    description?:string,
  } = await c.req.json();
  const token =await decode (c.req.header("auth"))
  const data = await prisma.user.findFirst({

  })
});
//endpoint just to fetch the bookmarks
app.get("/user/api/bookmarks",async (c:Context)=>{
  const token = await decode(c.req.header("auth"));
  var finalarr=[]
  var data= await prisma.user.findFirst({
    where:{email:token.payload.email},
    select:{bookmarks:true}
  })
  const data1= await prisma.blog.findMany({
    where:{}
  })
  data1.filter((item)=>{
   finalarr=data.bookmarks.map((item1)=>{
    if(item.id===item1){
      return item
    }
    else{
      return
    }
   })
  })
  return c.json(finalarr,{status:200})
})
//deletion of bookmarks
app.get("/user/api/bookmarks/delete", async (c: Context) => {
  const id = Number(c.req.header("id"));
  const token = await decode(c.req.header("auth"));
  var arr = [];
  const data = await prisma.user.findFirst({
    where: { email: token.payload.email },
    select: {
      bookmarks: true,
    },
  });
  data.bookmarks.map((item) => {
    if (item !== id) {
      arr.push(item);
    }
  });
  const data1 = await prisma.user.update({
    where: { email: token.payload.email },
    data: { bookmarks: arr },
  });
  return c.json(arr);
});
//about update and returning about
app.post("/user/api/about", async (c: Context) => {
  const token = await decode(c.req.header("auth"));
  const body: {
    about?: string;
  } = await c.req.json();
  const data = await prisma.user.update({
    where: { email: token.payload.email },
    data: { about: body.about },
  });
  const data1 = await prisma.user.findFirst({
    where: { email: token.payload.email },
    select: { about: true },
  });
  return new Response(data1.about, { status: 200 });
});
//just returning about
app.get("/user/api/about", async (c: Context) => {
    const token = await decode(c.req.header("auth"));
    
   
    const data1 = await prisma.user.findFirst({
      where: { email: token.payload.email },
      select: { about: true },
    });
    return new Response(data1.about, { status: 200 });
  });
//work on the tags
//returning the name of the user
app.get("/user/api/name", async (c: Context) => {
  const token = await decode(c.req.header("auth"));
  var arr = [];
  var tag = "";
  const data = await prisma.user.findFirst({
    where: { email: token.payload.email },
    select: { name: true },
  });

  arr = data.name.split(" ");

  var arr1 = arr.filter((item) => item.trim());

  tag = arr1.map((item) => {
    return item[0].toUpperCase();
  });
  var final = tag.join("");
  return new Response(final, { status: 200 });
});

app.get("/user/api/check", async (c: Context) => {
  const token = c.req.header("auth");
  try {
    const decoded = await decode(token);
    return new Response(decoded.payload.email, { status: 200 });
  } catch (error) {
    return new Response(error);
  }
});

export default app;

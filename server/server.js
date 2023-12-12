import fastify from "fastify";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "@fastify/cors"
import cookies from '@fastify/cookie'


// loading the env valuse
dotenv.config();





const app = fastify();
// 
app.register(sensible);


app.register(cookies, {secret:process.env.COOKIE_SECRET})
// create prisma client 
const prisma = new PrismaClient();


// cors to accept http request from our client 
app.register(cors, {
  origin: (origin, callback) => {
    callback(null, true); // allow all origins
  },
  credentials: true
});

// faking a user here as kyle
//TODO: later i want to bring an array of all users and each time i will make a different fake user for commenting part only !!
const FAKE_USER_ID = (await prisma.user.findFirst({where:{name:"Kyle"}})).id

app.addHook("onRequest", (req,res,done)=>{
  let userId = req.cookies.userId
  console.log("the current user is in this id ", userId )
  console.log("the fake user is  " , FAKE_USER_ID)
  if(userId !== FAKE_USER_ID){
    userId = FAKE_USER_ID
    res.clearCookie("userId")
    res.setCookie("userId",FAKE_USER_ID)
  }
  done()
})




app.get("/", async (req, res) => {
  const htmlResponse = "<h1>I am the nested comment server hi !!</h1>";
  res.header("Content-Type", "text/html");
  res.status(200).send(htmlResponse);
});

app.get("/posts", async (req, res) => {
  console.log("i am called")
  let queryResult = await commitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
  return queryResult
});


const COMMENT_SELECT_FIELDS ={
  id:true,
  message:true,
  parentId:true,
  createdAt:true,
  user:{
    select:{
      id:true,
      name:true
    }
  }
}

app.get("/posts/:id", async (req, res) => {
  let postId = req.params.id;
  console.log("this is the post id from route /posts/:id" , postId);
  return await commitToDb(
    prisma.post.findUnique({
      where: {id:postId},
      select:{
        body:true,
        title:true,
        comments:{
          orderBy:{
            createdAt: "desc"
          },
          select:COMMENT_SELECT_FIELDS
        }
      }
    })
    )
});

app.post("/posts/:id/comments", async(req,res)=>{
  const bodyMessage = req.body.message
  const bodyUserId = req.cookies.userId
  const bodyParentId = req.body.parentId
  const paramsPostId =  req.params.id 


  console.log("this is the req body " , req.body)
  if(bodyMessage == null || bodyMessage == ""){
    return res.send(app.httpErrors.badRequest("Message is required"));
  }

  let queryResult =  await commitToDb(
    prisma.comment.create({
      data:{
        message: bodyMessage,
        userId: bodyUserId,
        parentId: bodyParentId,
        postId: paramsPostId
      },
      select:COMMENT_SELECT_FIELDS
    })
  )

  return queryResult
})


//Simple  custom function error handling
async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error){
    console.log("error in the commitToDb function " , error)
    return app.httpErrors.internalServerError(error.message);}
  return data;
}

app.listen(process.env.PORT, (err, address) => {
  if (err) {
    console.error(`Can't listen on port ${address}, Something went wrong`, err);
  } else {
    console.log(`Listening on  ${address}`);
    // the output of the console.log will be the following
    //Listening on port http://[::1]:3000
    // http = using http protocol
    // [::1] = using an IPV6 loopback address like
    // if it was 127.0.01 = using an IPV4 loopback address
    //:3000 your port
  }
});

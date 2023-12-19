import fastify from "fastify";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "@fastify/cors"
import cookies from '@fastify/cookie'
import addCommentToPost from "./prisma/commentSeed.js";

// loading the env valuse
dotenv.config();







const app = fastify();
// 
app.register(sensible);


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
const allUsers = await prisma.user.findMany();
let FAKE_USER_ID

function createRandomUser(){
  const randomUserIndex = Math.floor(Math.random() * allUsers.length);
  const randomUser = allUsers[randomUserIndex];
  // Assign the random user's id as FAKE_USER_ID
  console.log(randomUser)
  FAKE_USER_ID = randomUser.id;
}

if(allUsers === 0){
  console.error("No users in the database ")
}else{
  createRandomUser()
}
//TODO: later i want to bring an array of all users and each time i will make a different fake user for commenting part only !!
app.addHook("onRequest", (req, res, done) => {
  createRandomUser();
  done();
});






app.get("/", async (req, res) => {
  const htmlResponse = "<h1>I am the nested comment server hi !!</h1>";
  res.header("Content-Type", "text/html");
  res.status(200).send(htmlResponse);
});

app.post("/temp", async (req, res) => {
  // Extracting values from the JSON body of the request
  const { postId, parentId, userId, message } = req.body;

  try {
    await addCommentToPost(postId, parentId, userId, message); // Make sure addCommentToPost is an async function or returns a promise
    const htmlResponse = "<h1>Comment was added successfully</h1>";
    res.header("Content-Type", "text/html");
    res.status(200).send(htmlResponse);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).send("An error occurred while adding the comment");
    console.error(error);
  }
});


app.get("/posts", async (req, res) => {

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

  let result =  await commitToDb(
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
    if(!result){
        // Post not found, return a 404 error
        return res.send(app.httpErrors.notFound("Post not found"));
    }
    return result
});

app.post("/posts/:id/comments", async(req,res)=>{
  const bodyMessage = req.body.message
  const bodyUserId = FAKE_USER_ID
  const bodyParentId = req.body.parentId
  const paramsPostId =  req.params.id 



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


app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message === "" || req.body.message == null) {
    return res.send(app.httpErrors.badRequest("Message is required"))
  }
  
  const { comment } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  })



  let result =  await commitToDb(
    prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    })
  )

  return result;
})


app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  
  const { comment } = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  })


  let result =  await commitToDb(
    prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    })
  )

  return result;
})



//Simple  custom function error handling
async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error){

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
 
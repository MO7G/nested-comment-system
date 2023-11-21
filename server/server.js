import fastify from "fastify";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import { Prisma, PrismaClient } from "@prisma/client";
import cors from "@fastify/cors"

dotenv.config();

const app = fastify();
app.register(sensible);
const primsa = new PrismaClient();


app.register(cors,{
  origin: process.env.CLIENT_URL,
  credentials:true
})

app.get("/posts", async (req, res) => {
  console.log("i am here ");
  return await commitToDb(
    primsa.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});


app.get("/", async (req, res) => {
  console.log("hii i am the main server " )
  const htmlResponse = "<h1>The server is working hello !!</h1>";
  res.header("Content-Type", "text/html");
  res.status(200).send(htmlResponse);
});


app.get("/posts/:id", async (req, res) => {
  let postId = req.params.id;
  console.log("this is the post id " , postId);
  return await commitToDb(
    primsa.post.findUnique({
      where: {id:postId},
      select:{
        body:true,
        title:true,
        comment:{
          orderBy:{
            createdAt: "desc"
          },
          select:{
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
        }
      }
    })
    )
});

//Simple  custom function error handling
async function commitToDb(promise) {
  const [error, data] = await app.to(promise);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
}

app.listen(process.env.PORT, (err, address) => {
  if (err) {
    console.error("The listening error is ", err);
  } else {
    console.log(`Listening on port ${address}`);
    // the output of the console.log will be the following
    //Listening on port http://[::1]:3000
    // http = using http protocol
    // [::1] = using an IPV6 loopback address like
    // if it was 127.0.01 = using an IPV4 loopback address
    //:3000 your port
  }
});

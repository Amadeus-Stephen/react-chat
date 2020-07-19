
const mongoose = require("mongoose");
const Chatrooms = require('./models/Chatrooms')
const User = require("./models/Users.js");
const DirectMessages = require("./models/DirectMessages.js");
const chatroom = require('./routes/Chatrooms.js')
const users = require('./routes/Users')
const direct = require('./routes/DirectMessages')
const express = require("express")
const app = express()
const server = require("http").Server(app);
const io = require('socket.io')(server)
const cors = require("cors");
const PORT = process.env.PORT || 5050;

require("dotenv").config();


app.use("/chatroom" , chatroom)
app.use("/users", users)
app.use("/direct", direct)
//app.use(express.json());
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));


async function run() {
  try {
    await mongoose.connect("mongodb://mongo/chatData", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    console.log("Connected correctly to server");
  } catch (err) {
    console.log(err.stack);
  }
}

run().catch(console.dir);


io.on("connection", socket => {
  let currentsocket;
  socket.join('Home');
  io.sockets.in('Home').emit('init' , "connected to server" )
  const { id } = socket.client;


  socket.on("connect_to", (data) => {
    socket.leave(currentsocket)
    currentsocket = data.socket
    socket.join(currentsocket)
    if (data.type ==="chatrooms") {
      Chatrooms.findById(currentsocket)
      .then((chatroom) => {
        io.to(id).emit("connect_to",chatroom.logs)
      })
    }
    if (data.type === "direct") {
      DirectMessages.findById(currentsocket)
      .then((chatroom) => {
        io.to(id).emit("connect_to",chatroom.logs)
      })
    }
  })

  socket.on("create_chat", (data) => {
    Chatrooms.create({chatroom: data.chatroom , owner:data.owner , log:[]})
    .then(() => {io.to(id).emit("create_chat", "created chat room succusfully");})
  })

  socket.on("get_chat", () => {
    Chatrooms.find()
    .then((chatroom) => {
      io.sockets.in("Home").emit("get_chat", chatroom)
    })
  })

  socket.on("chat_message", (data) => {
    if (data.type ==="chatrooms") {
      Chatrooms.findById(currentsocket)
      .then((chatroom) => {
        chatroom.logs.push({msg:data.msg , user:data.user})
        chatroom.save()
       
      })
      .catch(() => {
        io.to(id).emit("failed_to_recive_message")
      })
      io.in(currentsocket).emit("chat_message",{ user:data.user, msg:data.msg })
    }
    if (data.type === "direct") {
      DirectMessages.findById(currentsocket)
      .then((chatroom) => {
        chatroom.logs.push({msg:data.msg , user:data.user})
        chatroom.save()
      })
      .catch(() => {
        io.to(id).emit("failed_to_recive_message")
      })
      io.to(id).emit("chat_message", { user:data.user, msg:data.msg });
    }
  });

  socket.on("signin_user", (data) => {
    User.find({username:data.user , password:data.password})
    .then((user) => {
      if (data) {
        io.to(id).emit("signin_user",user)
      }
      else {
        io.to(id).emit("sign_in_error")
      }
    })
    .catch(() => {
      io.to(id).emit("sign_in_error")
    })
  })

  socket.on("create_user", (data) => {
    User.create({username:data.username , password:data.password})
    .then((data) => {
      io.to(id).emit("create_user", data)
    })
    .catch(() => {
      io.to(id).emit("create_user_faild")
    })
  })

  socket.on("get_direct", (user) => {
    DirectMessages.find()
    .then((data) => {
      const prom = new Promise((resolve) => {
        const datalist = []
        data.map(i => {
          if (i.users.includes(user)) {
            datalist.push(i)
          }
        })
        resolve(datalist)
      })
      prom.then((data) => {
        io.to(id).emit("get_direct", data)
      })
    })
  })

  socket.on("create_direct", (data) => {
    DirectMessages.create({users:data.users , logs:[]})
    .then(() => {io.to(id).emit("create_direct", "created direct succusfully");})
  })
});

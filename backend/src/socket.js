const main = require("./server");
const server = require("http").createServer(main.app);
const io = require("socket.io")(server);

const Chatroom = require("./database/models/chatroom");
const Message = require("./database/models/message");
io.on("connection", (socket) => {
  let currentsocket;
  socket.join("Home");
  io.sockets.in("Home").emit("init", "connected to server");
  const { id } = socket.client;

  socket.on("connect_to", (data) => {
    socket.leave(currentsocket);
    currentsocket = data.socket;
    socket.join(currentsocket);
    console.log(data);
    Chatroom.findById(currentsocket).then((chatroom) => {
      if (chatroom) {
        Message.find({ chat: currentsocket })
          .then((data) => {
            io.to(id).emit("connect_to", data);
          })
          .catch((err) => {
            console.log(err);
            io.to(id).emit("connect_to", {
              error: { msg: "Unexpected error please try again later" },
            });
          });
      } else {
        io.to(id).emit("connect_to", { error: { msg: "no chatroom found" } });
      }
    });
  });

  socket.on("get_chats", () => {
    Chatroom.find().then((chatrooms) => {
      io.to(id).emit("get_chats", chatrooms);
    });
  });

  socket.on("message", (data) => {
    console.log(data);
    if (data.msg && data.user.id && data.user.username && currentsocket) {
      Message.create({
        chat: currentsocket,
        user: data.user,
        msg: data.msg,
      })
        .then(() => {
          io.in(currentsocket).emit("message", {
            user: data.user,
            msg: data.msg,
          });
        })
        .catch(() => {
          io.to(id).emit("user_not_signed_in");
        });
    } else {
      io.to(id).emit("user_not_signed_in");
    }
  });
});

exports.io = io;
exports.server = server;

const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { connectDB, getDB } = require("./config/db");
const { ExpressPeerServer } = require("peer");
const io = require("socket.io")(server);
const fs = require("fs");

// Middleware setup
app.use(express.static("public"));
app.set("view engine", "ejs");

// Connect to MongoDB
connectDB().then(() => {
  server.listen(process.env.PORT || 8080, () => {
    console.log("Server is running on port", process.env.PORT || 8080);
  });
});

// Routes
app.get("/", (req, res) => {
  res.render("frontpage");
});

app.get("/newroom", async (req, res) => {
  const un = req.query.username;
  const pc = req.query.passcode;

  const roomId = uuidv4();

  try {
    const hash = await bcrypt.hash(pc, saltRounds);
    const db = getDB();

    await db.collection("meetings").insertOne({
      roomId,
      username: un,
      passcode: hash,
    });

    res.redirect(`/${roomId}`);
  } catch (err) {
    console.error("Error creating new room:", err);
    res.status(500).send("Server error. Please try again.");
  }
});

app.get("/joinroom", async (req, res) => {
  const unJ = req.query.username;
  const inJ = req.query.invitation;
  const pcJ = req.query.passcode;

  try {
    const db = getDB();
    const meeting = await db.collection("meetings").findOne({ roomId: inJ });

    if (!meeting) {
      res.send("Invalid invitation. Please <a href='/'>go back</a>");
      return;
    }

    const isMatch = await bcrypt.compare(pcJ, meeting.passcode);

    if (isMatch) {
      res.redirect(`/${inJ}?username=${encodeURIComponent(unJ)}`);
    } else {
      res.send("Invalid password. Please <a href='/'>go back</a>");
    }
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).send("Server error. Please try again.");
  }
});

app.get("/:room", async (req, res) => {
  const roomId = req.params.room;
  const db = getDB();

  try {
    const meeting = await db.collection("meetings").findOne({ roomId });

    if (!meeting) {
      res.send("Meeting not found. Please <a href='/'>go back</a>");
      return;
    }

    const username = req.query.username;

    res.render("meeting-room", {
      roomId,
      username: username || meeting.username,
    });
  } catch (err) {
    console.error("Error loading meeting room:", err);
    res.status(500).send("Server error. Please try again.");
  }
});

// PeerJS server setup
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);

// Socket.IO setup
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId);

    socket.on("stop-screen-share", (peerId) => {
      io.to(roomId).emit("no-share", peerId);
    });

    socket.on("message", (message, sender, color, time) => {
      io.to(roomId).emit("createMessage", message, sender, color, time);
    });

    socket.on("leave-meeting", (peerId, peerName) => {
      io.to(roomId).emit("user-leave", peerId, peerName);
    });
  });
});

// File upload handler
app.post("/upload", (req, res) => {
  const fileName = req.headers["file-name"];
  req.on("data", (chunk) => {
    fs.appendFileSync(__dirname + "/public/uploaded-files/" + fileName, chunk);
  });
  res.end("uploaded");
});

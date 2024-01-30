const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const cors = require('cors')


const users = [];

function verifyExistsUsername(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(400).json({ error: "User already exists! " });
  }
  request.user = user;
  return next();
}

app.use(cors())
app.use(express.json());



app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const usersAlreadyExists = users.find((user) => user.username === username);
  if (usersAlreadyExists) {
    return response.status(400).json({ error: "User already exists! " });
  }
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });
  return response.status(201).send();
});

app.get("/todos", verifyExistsUsername, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", verifyExistsUsername, (request, response) => {
  
})


app.listen(3333, () => {
  console.log("localhost:3333");
});

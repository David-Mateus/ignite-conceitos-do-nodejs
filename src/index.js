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
  const {user} = request;
  const {title, deadline} = request.body;
  
  const todoOperation ={
    id:uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todoOperation)
  return response.status(201).send();
})

app.put("/todos/:id", verifyExistsUsername, (request, response) => {
  const {user} = request;
  const {title, deadline } = request.body;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  if(!todo){
    return response.status(404).json({error:'Todo not found'})
  }
  todo.title = title;
  todo.deadline = new Date(deadline);
  return response.status(201).json(todo);
})
app.patch("/todos/:id/done", verifyExistsUsername, (request, response) => {
  const {user} = request;
  const {done} = request.body
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  if(!todo){
    return response.status(404).json({error:'Todo not found'})
  }
  todo.done = done;
  return response.status(201).json(todo);
})


app.listen(3333, () => {
  console.log("localhost:3333");
});

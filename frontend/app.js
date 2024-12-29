const BASE_URL = "https://coherent-sassy-flute.glitch.me";

// Signup/Login
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${BASE_URL}/users`);
  const users = await response.json();

  const userExists = users.find((user) => user.email === email);

  if (!userExists) {
    await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    alert("Signup successful!");
  } else if (userExists.password === password) {
    alert("Login successful!");
    window.location.href = "todos.html";
  } else {
    alert("Invalid password!");
  }
});

// Todos
if (window.location.pathname.includes("todos.html")) {
  const todoList = document.getElementById("todoList");
  const addTodoForm = document.getElementById("addTodoForm");

  // Fetch Todos
  const fetchTodos = async () => {
    const response = await fetch(`${BASE_URL}/todos`);
    const todos = await response.json();
    todoList.innerHTML = todos
      .map(
        (todo) => `
        <div>
          <input type="checkbox" ${todo.completed ? "checked" : ""} onchange="toggleTodo(${todo.id})">
          <span>${todo.title}</span>
          <button onclick="deleteTodo(${todo.id})">Delete</button>
        </div>`
      )
      .join("");
  };

  // Add Todo
  addTodoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTodo = document.getElementById("newTodo").value;
    await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo, completed: false }),
    });
    fetchTodos();
  });

  // Delete Todo
  window.deleteTodo = async (id) => {
    await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  // Toggle Todo
  window.toggleTodo = async (id) => {
    const todo = await (await fetch(`${BASE_URL}/todos/${id}`)).json();
    await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  };

  fetchTodos();
}

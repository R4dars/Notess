import { useState, useEffect } from 'react';

import Todo from "./components/Todo";
import TodoForm from './components/TodoForm';
import Search from "./components/Search";
import Filter from './components/filter';

import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc");
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/Objects/')
      .then(response => response.json())
      //.then(data => setTodos(data))
      //.catch(error => console.log(error));
  }, []);

  const addTodo = (text, category) => {
    if (text.trim() === '') {
      setShowError(true);
      return;
    }

    const newTodo = {
      id: Math.floor(Math.random() * 1000),
      text,
      category,
      isCompleted: false,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    saveTodoToDatabase(newTodo);
    setShowMessage(true);
    setShowError(false);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  }

  const removeTodo = (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    removeTodoFromDatabase(id);
  };

  const completeTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
    updateTodoInDatabase(id, updatedTodos.find(todo => todo.id === id));
  };

  const saveTodoToDatabase = (todo) => {
    console.log('Salvando no banco de dados:', todo);
  };

  const removeTodoFromDatabase = (id) => {
    console.log('Removendo do banco de dados:', id);
  };

  const updateTodoInDatabase = (id, updatedTodo) => {
    console.log('Atualizando no banco de dados:', updatedTodo);
  };

  return (
    <div className="app">
      <h1>To do List</h1>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
      {showMessage && <p className="success-message">Anotação criada!</p>}
      {showError && <p className="error-message">Por favor, preencha o campo de tarefa.</p>}
      <div className="todo-list">
        {todos
          .filter((todo) =>
            filter === "All"
              ? true
              : filter === "Completed"
              ? todo.isCompleted
              : !todo.isCompleted
          )
          .filter((todo) =>
            todo.text.toLocaleLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) =>
            sort === "Asc"
              ? a.text.localeCompare(b.text)
              : b.text.localeCompare(a.text)
          )
          .map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              completeTodo={completeTodo}
            />
          ))}
      </div>
      <TodoForm addTodo={addTodo} />
    </div>
  );
}

export default App;

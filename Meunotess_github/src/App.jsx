import { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      //Usando o metodo GET
      const response = await axios.get('http://localhost:3000/Objects/');
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (text, category) => {
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

    try {
      //Usando o metodo POST
      const response = await axios.post('http://localhost:3000/Objects/', newTodo);
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.log('Erro ao enviar o todo:', error);
    }

    setShowMessage(true);
    setShowError(false);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const removeTodo = async (id) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);

    try {
      const response = await axios.delete(`http://localhost:3000/Objects/${id}`);
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.log('Erro ao remover o todo:', error);
    }

    setShowDeleteMessage(true);
    setTimeout(() => {
      setShowDeleteMessage(false);
    }, 3000);
  };

  const completeTodo = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);

    const updatedTodo = updatedTodos.find(todo => todo.id === id);

    try {
      //Usando o método PUT
      const response = await axios.put(`http://localhost:3000/Objects/${id}`, updatedTodo);
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.log('Erro ao atualizar o todo:', error);
    }
  };

  return (
    <div className="app">
      <h1>To do List</h1>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
      {showMessage && <p className="success-message">Anotação criada!</p>}
      {showError && <p className="error-message">Por favor, preencha o campo de tarefa.</p>}
      {showDeleteMessage && <p className="delete-message">Notação apagada!</p>}
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
            todo.text.toLowerCase().includes(search.toLowerCase())
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

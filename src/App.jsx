import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: '',
      description: '',
      priority: '', 
      todos: [],
      showIncomplete: false,
      hoverIndex: null,
      editingIndex: null,
      searchTerm: '',
      selectedPriorities: {
        срочно: false,
        средне: false,
        неСрочно: false,
      },
    };
  }

  // Генерация уникального идентификатора
  generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  handleChangeTodo = (e) => {
    this.setState({ todo: e.target.value });
  };

  handleChangeDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  handleChangePriority = (priority) => {
    this.setState({ priority });
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleCheckboxChange = (priority) => {
    this.setState(prevState => ({
      selectedPriorities: {
        ...prevState.selectedPriorities,
        [priority]: !prevState.selectedPriorities[priority],
      }
    }));
  };

  handleAddTodo = () => {
    const trimmedTodo = this.state.todo.trim();

    if (this.state.todo !== trimmedTodo) {
      alert('Пожалуйста, уберите лишние пробелы в начале и конце названия задачи.');
      return;
    }

    if (trimmedTodo === '') {
      alert('Введите название задачи');
      return; 
    }

    if (!this.state.priority) {
      alert('Введите важность');
      return;
    }

    const newTodo = { 
      id: this.generateUniqueId(), // Генерация уникального идентификатора
      text: trimmedTodo,
      description: this.state.description,
      priority: this.state.priority,
      completed: false,
      time: new Date().toLocaleString()
    };

    this.setState((prevState) => ({
      todos: [...prevState.todos, newTodo],
      todo: '',
      description: '',
      priority: '',
    }));
  };

  toggleTodoCompletion = (id) => {
    this.setState((prevState) => {
      const todos = prevState.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed }; 
        }
        return todo;
      });
      return { todos };
    });
  };

  toggleShowIncomplete = () => {
    this.setState((prevState) => ({ showIncomplete: !prevState.showIncomplete }));
  };

  handleDeleteTodo = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter(todo => todo.id !== id),
    }));
  };

  handleEditTodo = (id) => {
    const todoToEdit = this.state.todos.find(todo => todo.id === id);
    this.setState({
      todo: todoToEdit.text,
      description: todoToEdit.description,
      priority: todoToEdit.priority,
      editingIndex: id,
    });
  };

  handleUpdateTodo = () => {
    const { editingIndex, todo, description, priority } = this.state;
    const trimmedTodo = todo.trim();

    if (todo !== trimmedTodo) {
      alert('Пожалуйста, уберите лишние пробелы в начале и конце названия задачи.');
      return;
    }

    if (editingIndex !== null && trimmedTodo !== '') {
      const updatedTodos = this.state.todos.map((todoItem) => {
        if (todoItem.id === editingIndex) {
          return { ...todoItem, text: trimmedTodo, description, priority };
        }
        return todoItem;
      });

      this.setState({
        todos: updatedTodos,
        todo: '',
        description: '',
        priority: '',
        editingIndex: null,
      });
    } else if (trimmedTodo === '') {
      alert('Введите название задачи');
    }
  };

  generateRandomTodos = () => {
    const randomTodos = [];
    const priorities = ['срочно', 'средне', 'не срочно'];

    for (let i = 1; i <= 15; i++) {
      const randomIndex = Math.floor(Math.random() * priorities.length);
      const randomPriority = priorities[randomIndex];
      const randomTodo = {
        id: this.generateUniqueId(), // Генерация уникального идентификатора
        text: `Заметка ${i}`,
        description: `Описание для заметки ${i}`,
        priority: randomPriority,
        completed: false,
        time: new Date().toLocaleString()
      };
      randomTodos.push(randomTodo);
    }

    this.setState((prevState) => ({
      todos: [...prevState.todos, ...randomTodos],
    }));
  };

  render() {
    const filteredTodos = this.state.showIncomplete
      ? this.state.todos.filter(todo => !todo.completed)
      : this.state.todos;

    const searchedTodos = filteredTodos.filter(todo =>
      todo.text.toLowerCase().includes(this.state.searchTerm.toLowerCase())
    );

    const anyPrioritySelected = Object.values(this.state.selectedPriorities).some(Boolean);
    const filteredByPriority = searchedTodos.filter(todo => 
      !anyPrioritySelected || this.state.selectedPriorities[todo.priority]
    );

    const sortedTodos = filteredByPriority.sort((a, b) => a.completed - b.completed);

    return (
      <>
      <div className="controls">
        <h1>TODO LIST</h1>

        <input
          type="text"
          value={this.state.todo}
          onChange={this.handleChangeTodo}
          placeholder="Введите задачу"
        />
        <textarea
          value={this.state.description}
          onChange={this.handleChangeDescription}
          placeholder="Введите описание"
        />

        <div className='add'>
          <div className="priority-buttons">
            <button onClick={() => this.handleChangePriority('срочно')} className={this.state.priority === 'срочно' ? 'active' : ''}>
              Срочно
            </button>
            <button onClick={() => this.handleChangePriority('средне')} className={this.state.priority === 'средне' ? 'active' : ''}>
              Средне
            </button>
            <button onClick={() => this.handleChangePriority('не срочно')} className={this.state.priority === 'не срочно' ? 'active' : ''}>
              Не срочно
            </button>
          </div>

          {this.state.editingIndex !== null ? (
            <button onClick={this.handleUpdateTodo} className="button button-update">
              Обновить
            </button>
          ) : (
            <button onClick={this.handleAddTodo} className="button button-add">
              Добавить
            </button>
          )}
        </div>
        
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleSearch}
          placeholder="Поиск по задачам"
        />

        <div className="filter-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={this.state.selectedPriorities['срочно']}
              onChange={() => this.handleCheckboxChange('срочно')}
            />
            Срочно
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.selectedPriorities['средне']}
              onChange={() => this.handleCheckboxChange('средне')}
            />
            Средне
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.state.selectedPriorities['не срочно']}
              onChange={() => this.handleCheckboxChange('не срочно')}
            />
            Не срочно
          </label>
        </div>
        
        <button onClick={this.generateRandomTodos} className="button button-generate">
          Сгенерировать 15 случайных заметок
        </button>

        <button onClick={this.toggleShowIncomplete} className="fixed-button">
          {this.state.showIncomplete ? 'Показать все' : 'Показать только невыполненные'}
        </button>
      </div>

      <ul>
        {sortedTodos.length === 0 ? (
          <li className="no-notes">Нет заметок</li>
        ) : (
          sortedTodos.map((todo) => (
            <li 
              key={todo.id}
              onMouseEnter={() => this.setState({ hoverIndex: todo.id })}
              onMouseLeave={() => this.setState({ hoverIndex: null })}
            >
              <label className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => this.toggleTodoCompletion(todo.id)} // Передаем уникальный идентификатор
                />
                <span className="todo-text" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text} <em className="todo-time">{todo.time}</em> - <strong>{todo.priority}</strong>
                </span>
                <div className="todo-description">{todo.description}</div>
                <button 
                  onClick={() => this.handleEditTodo(todo.id)} 
                  className="edit-button"
                >
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/259/259450.png" 
                    alt="edit"
                  />
                </button>
                {this.state.hoverIndex === todo.id && (
                  <button 
                    onClick={() => this.handleDeleteTodo(todo.id)} 
                    className="delete-button"
                  >
                    Удалить
                  </button>
                )}
              </label>
            </li>
          ))
        )}
      </ul>
      </>
    );
  }
}

export default App;
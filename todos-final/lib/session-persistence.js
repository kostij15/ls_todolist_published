const SeedData = require("./seed-data");
const deepCopy = require("./deep-copy");
const { sortTodoLists, sortTodos } = require("./sort");
const { sort } = require("./seed-data");
const nextId = require("./next-id");

module.exports = class SessionPersistence {
  constructor(session) {
    this._todoLists = session.todoLists || deepCopy(SeedData);
    session.todoLists = this._todoLists;
  }

  //private class methods
  // returns actual value so we can update the session store in real time
  _findTodoList(todoListId) {
    let todoList = this._todoLists.find(todoList => todoList.id === todoListId);
    if (!todoList) return undefined;
    return todoList;
  }

  _findTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId)
    let todo = todoList.todos.find(todo => todo.id === todoId);
    return todo;
  }

  // Toggle a todo between the done and not done state. Returns `true` on
  // success, `false` if the todo or todo list doesn't exist. The id arguments
  // must both be numeric.

  toggleDoneTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);
    if (!todo) return false;

    todo.done = !todo.done;
    return true;
  }

  deleteTodo(todoListId, todoId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    let todoIndex = todoList.todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) return false;

    todoList.todos.splice(todoIndex, 1);
    return true;
  }

  toggleDoneAllTodos(todoListId) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    let todos = todoList.todos;
    console.log(todos);
    if (!todos || todos.length === 0) return false;

    todos.map(todo => todo.done = true);
    return true;
  }

  // Are all of the todos in the todo list done? If the todo list has at least
  // one todo and all of its todos are marked as done, then the todo list is
  // done. Otherwise, it is undone.
  isDoneTodoList(todoList) {
    return todoList.todos.length > 0 && todoList.todos.every(todo => todo.done);
  }

  // Returns a copy of the list of todo lists sorted by completion status and
  // title (case-insensitive).
  sortedTodoLists() {
    let todoLists = deepCopy(this._todoLists);
    let undone = todoLists.filter(todoList => !this.isDoneTodoList(todoList));
    let done = todoLists.filter(todoList => this.isDoneTodoList(todoList));
    return sortTodoLists(undone, done);
  }

  loadTodoList(todoListId) {
    let todoList = this._findTodoList(todoListId);
    return deepCopy(todoList);
  }

  sortedTodos(todoList) {
    let todos = todoList.todos;
    let undone = todos.filter(todo => !todo.done);
    let done = todos.filter(todo => todo.done);
    return deepCopy(sortTodos(undone, done));
  }

  hasUndoneTodos(todoList) {
    return todoList.todos.some(todo => !todo.done);
  }

  //Todo Specific
  loadTodo(todoListId, todoId) {
    let todo = this._findTodo(todoListId, todoId);

    return deepCopy(todo);
  };

  createTodo(todoListId, title) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    todoList.todos.push({
      title,
      id: nextId(),
      done: false,
    });

    return true;
  }

  //Edit TodoList

  editTodoList(todoListId, title) {
    let todoList = this._findTodoList(todoListId);
    if (!todoList) return false;

    todoList.title = title;
    return true;
  }

  //Find TodoList
  existsTodoListTitle(title) {
    return this._todoLists.some(todoList => todoList.title === title);
  }

  //Create New TodoList
  createTodoList(title) {
    if (this.existsTodoListTitle(title)) return false;
    this._todoLists.push({
      id: nextId(),
      title: title,
      todos: [],
    });

    return true;
  }

  // Returns `true` if `error` seems to indicate a `UNIQUE` constraint
  // violation, `false` otherwise.
  isUniqueConstraintViolation(_error) {
    return false;
  }

}
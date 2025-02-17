import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../context/TodosContext';
import { postTodo, renewTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    todos,
    setTodos,
    loading,
    setLoading,
    setError,
    showError,
    setTempTodo,
    isEditingId,
  } = useContext(TodosContext);

  const allTodoCompleted = todos.every(todo => todo.completed);

  const focus = useRef<HTMLInputElement>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const addTodo = (todoTitle: string) => {
    setLoading(1);
    setTempTodo({
      id: 0,
      userId: 2215,
      title: todoTitle,
      completed: false,
    });

    postTodo(title.trim())
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setError('');
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setLoading(0);
        setTempTodo(null);
      });
  };

  const toggleAllTodos = () => {
    const areAllTodosCompleted = todos.every(todo => todo.completed);

    const todosToToggle = areAllTodosCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    Promise.all(
      todosToToggle.map(todo =>
        renewTodo(todo.id, { ...todo, completed: !areAllTodosCompleted })
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(t =>
                t.id === todo.id
                  ? { ...t, completed: !areAllTodosCompleted }
                  : t,
              ),
            );
          })
          .catch(() => showError(`Unable to toggle todo with id ${todo.id}`)),
      ),
    ).finally(() => setLoading(0));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      showError('Title should not be empty');

      return;
    }

    addTodo(title);
  };

  useEffect(() => {
    if (loading === 0 && !isEditingId) {
      focus.current?.focus();
    }
  }, [loading, isEditingId]);

  return (
    <header className="todoapp__header">
      {loading === 0 && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodoCompleted && todos.length > 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInput}
          disabled={loading !== 0}
          ref={focus}
        />
      </form>
    </header>
  );
};

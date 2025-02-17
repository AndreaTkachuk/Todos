import React, { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodosContext } from '../context/TodosContext';
import { removeTodo, renewTodo } from '../api/todos';

type Props = {
  propsTodo: Todo;
};

export const TodoItem: React.FC<Props> = ({ propsTodo }) => {
  const {
    todos,
    setTodos,
    loading,
    setLoading,
    setError,
    isEditingId,
    setIsEditingId,
    showError,
  } = useContext(TodosContext);
  const [editingTitle, setEditingTitle] = useState('');

  const updateTodoCheck = (id: number) => {
    setLoading(id);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setLoading(0);

      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    renewTodo(id, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
        setLoading(0);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => setLoading(0));
  };

  const updateTodoTitle = (id: number, value: string): Promise<void> | void => {
    if (loading === id) {
      return;
    }

    setLoading(id);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setLoading(0);

      return;
    }

    if (value === todoToUpdate.title) {
      setIsEditingId(null);
      setLoading(0);

      return;
    }

    const updatedTodo = {
      ...todoToUpdate,
      title: value,
    };

    return renewTodo(id, updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, title: value } : todo,
          ),
        );
        setLoading(0);
      })
      .catch(nextError => {
        setLoading(0);
        showError('Unable to update a todo');
        throw nextError;
      });
  };

  const deleteTodo = (id: number): Promise<void> | void => {
    setLoading(id);

    removeTodo(id)
      .then(() => {
        setTodos(todos.filter(item => item.id !== id));
        setLoading(0);
      })
      .catch(() => {
        showError('Unable to delete a todo');
        setLoading(0);
      });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
    setError('');
  };

  const handleDoubleClick = (id: number, value: string) => {
    setIsEditingId(id);
    setEditingTitle(value);
  };

  const handleSubmit = () => {
    if (editingTitle.trim() === '') {
      deleteTodo(propsTodo.id)
        ?.then(() => setIsEditingId(null))
        .catch(() => {
          setIsEditingId(propsTodo.id);
        });
    }

    updateTodoTitle(propsTodo.id, editingTitle.trim())
      ?.then(() => setIsEditingId(null))
      .catch(() => {
        setIsEditingId(propsTodo.id);
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditingId(null);
      setEditingTitle('');
    }
  };

  const titleEditField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingId === propsTodo.id && loading === 0) {
      titleEditField.current?.focus();
    }
  }, [isEditingId, loading, propsTodo.id]);

  return (
    <div
      key={propsTodo.id}
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: propsTodo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label
        className="todo__status-label"
        htmlFor={`todo__status-${propsTodo.id}`}
      >
        <input
          id={`todo__status-${propsTodo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={propsTodo.completed}
          onChange={() => updateTodoCheck(propsTodo.id)}
        />
      </label>

      {isEditingId === propsTodo.id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            ref={titleEditField}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editingTitle}
            placeholder={
              editingTitle === '' ? 'Empty todo will be deleted' : ''
            }
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={handleInput}
            disabled={loading !== 0}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            const { id, title: todoTitle } = propsTodo;

            handleDoubleClick(id, todoTitle);
          }}
        >
          {propsTodo.title}
        </span>
      )}
      {isEditingId !== propsTodo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(propsTodo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading === propsTodo.id || propsTodo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

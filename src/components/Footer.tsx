import React, { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../utils/enamFilter';
import { TodosContext } from '../context/TodosContext';
import { removeTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const { todos, setTodos, filter, setFilter, setLoading, showError } =
    useContext(TodosContext);
  const leftItems = todos.filter(todo => !todo.completed).length;

  const clearCompleted = () => {
    const todosCompleted = todos.filter(todo => todo.completed);
    const successIds: number[] = [];

    Promise.all(
      todosCompleted.map(todo => {
        setLoading(todo.id);

        return removeTodo(todo.id)
          .then(() => successIds.push(todo.id))
          .catch(() => showError('Unable to delete a todo'));
      }),
    )
      .then(() => {
        setTodos(todos.filter(todo => !successIds.includes(todo.id)));
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setLoading(0));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.keys(Filter).map(key => (
          <a
            key={key}
            href={`#/${key}`}
            className={classNames('filter__link', {
              selected: filter === key.toLowerCase(),
            })}
            data-cy={`FilterLink${key}`}
            onClick={() => setFilter(key.toLowerCase() as Filter)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

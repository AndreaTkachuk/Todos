import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { getFilteredItems } from '../utils/getFilteredItems';
import { TodosContext } from '../context/TodosContext';

export const TodoList: React.FC = () => {
  const { todos, filter, tempTodo } = useContext(TodosContext);
  const filteredTodos = getFilteredItems(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} propsTodo={todo} />
      ))}
      {tempTodo && <TodoItem key={tempTodo.id} propsTodo={tempTodo} />}
    </section>
  );
};

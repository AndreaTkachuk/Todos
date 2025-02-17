/* eslint-disable @typescript-eslint/indent */
import { createContext, ReactNode, useState } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../utils/enamFilter';

export const TodosContext = createContext<{
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  loading: number | null;
  setLoading: React.Dispatch<React.SetStateAction<number | null>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  isEditingId: number | null;
  setIsEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  showError: (message: string) => void;
}>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loading: null,
  setLoading: () => {},
  error: '',
  setError: () => {},
  filter: Filter.All,
  setFilter: () => {},
  isEditingId: null,
  setIsEditingId: () => {},
  showError: () => {},
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isEditingId, setIsEditingId] = useState<number | null>(null);
  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        tempTodo,
        setTempTodo,
        loading,
        setLoading,
        error,
        setError,
        filter,
        setFilter,
        isEditingId,
        setIsEditingId,
        showError,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

import React, { useContext, useEffect } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { ErrorComponent } from './components/ErrorComponent';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { TodosContext } from './context/TodosContext';

export const App: React.FC = () => {
  const { todos, setTodos, setLoading, showError } = useContext(TodosContext);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setLoading(0));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header />
        <TodoList />
        {todos.length > 0 && <Footer />}
      </div>
      <ErrorComponent />
    </div>
  );
};

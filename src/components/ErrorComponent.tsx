import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';

export const ErrorComponent: React.FC = () => {
  const { error, setError } = useContext(TodosContext);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !error },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setError('')}
      />
      {error}
    </div>
  );
};

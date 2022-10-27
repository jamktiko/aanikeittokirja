import React from 'react';

const UserLoginPage = () => {
  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div>
        <h1>Kirjautuminen</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          Sähköposti <input type="text" />
          Salasana <input type="password" />
        </div>
        <div>
          <button type="submit">Kirjaudu</button>
        </div>
      </form>
    </div>
  );
};

export default UserLoginPage;

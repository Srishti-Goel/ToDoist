import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-4">Welcome to the To-Do App</h1>
          <p className="lead mb-4">
            Organize your tasks, stay productive, and manage your day efficiently.
          </p>
          <a href="/signup" className="btn btn-primary me-2">Sign Up</a>
          <a href="/login" className="btn btn-outline-secondary">Log In</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
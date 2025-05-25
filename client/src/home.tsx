import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
const Home: React.FC = () => {
  const {user, setUser} = useUser();
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-4">Welcome to the To-Do App</h1>
          <p className="lead mb-4">
            Organize your tasks, stay productive, and manage your day efficiently.
          </p>
          {!user && <div>
            <Link to="/signup" className="btn btn-primary me-2">Sign Up</Link>
            <Link to="/login" className="btn btn-primary me-2">Log In</Link>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import DragAndDrop from './DrapAndDrop/dragAndDrop';
const Home: React.FC = () => {
  const {user, setUser} = useUser();
  let mainContent = <div></div>;
  if (user) {
    mainContent = <div>
        <p className="lead mb-4">Welcome back, {user.name}!</p>
        <DragAndDrop />
      </div>;
  } else {
    mainContent = <div>
        <p className="lead mb-4">Please log in or sign up to continue.</p>
        <Link to="/signup" className="btn btn-primary me-2">Sign Up</Link>
        <Link to="/login" className="btn btn-primary me-2">Log In</Link>
      </div>;
  }
  return (
    <div className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-11 text-center">
          <h1 className="mb-4">Welcome to the To-Do App</h1>
          <p className="lead mb-4">
            Organize your tasks, stay productive, and manage your day efficiently.
          </p>
          {mainContent}
        </div>
      </div>
    </div>
  );
};

export default Home;
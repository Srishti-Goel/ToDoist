import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
const Home: React.FC = () => {
  const {user} = useUser();
  let mainContent = <div></div>;
  if (user) {
    mainContent = <div>
        <p className="lead mb-4">Welcome back, {user.name}! You can start managing your tasks now.</p>
        <Link
          to="/taskChart"
          className="btn me-2"
          style={{ backgroundColor: "var(--palette-4)", borderColor: "var(--palette-4)", color: "#fff" }}
        >
          Go to Task Chart
        </Link>
      </div>;
  } else {
    mainContent = <div>
          <p className="lead mb-4">
            Organize your tasks, stay productive, and manage your day efficiently.
          </p>
        <p className="lead mb-4">Please log in or sign up to continue.</p>
        <Link
          to="/signup"
          className="btn me-2"
          style={{ backgroundColor: "var(--palette-4)", borderColor: "var(--palette-4)", color: "#fff" }}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="btn me-2"
          style={{ backgroundColor: "var(--palette-4)", borderColor: "var(--palette-4)", color: "#fff" }}
        >
          Log In
        </Link>
      </div>;
  }
  return (
    <div className="py-5" style={{ color: "var(--palette-4)" }}>
      <div className="row justify-content-center">
        <div className="col-md-11 text-center">
          <h1 className="mb-4">Welcome to the To-Do App</h1>
          {mainContent}
        </div>
      </div>
    </div>
  );
};

export default Home;
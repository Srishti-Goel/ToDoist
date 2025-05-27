import React from 'react';
// This component is used to display a 404 Not Found page when a user navigates to a non-existent route.
const NotFound: React.FC = () => (
  <div>
    <div className="d-flex justify-content-center 
					align-items-center flex-column 
					text-center w-100"
        style={{background: 'url(https://media.geeksforgeeks.org/wp-content/uploads/20240226131034/2142357.jpg)',
          backgroundSize: 'cover',
          height: '50vh',
          width: '100%',}}/>
      <div className="d-flex justify-content-center 
					align-items-center flex-column 
					text-center w-100 p-4" >
			<div className="bg_img w-50">
			</div>
			<div>
				<p className="display-4">Looks Like You're Lost</p>
				<p>The page you are looking for not available...</p>
				<a href="/"
				className="text-white text-decoration-none px-4 py-3 
						bg-success d-inline-block mt-2 rounded">
					Go to Home
				</a>
			</div>
		</div>
  </div>
);

export default NotFound;
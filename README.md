# To-Do App

A simple full-stack To-Do application with user authentication and a modern, responsive UI.

## Features

- **User Registration:**  
  Users can sign up with their name, email, and password. Duplicate emails are not allowed. Passwords must match and meet minimum requirements.

- **User Login:**  
  Registered users can log in with their email and password. Error messages are shown for invalid credentials.

- **Global User State:**  
  The app uses React Context to manage the logged-in user globally, so authentication state is available throughout the app.

- **Logout:**  
  Users can log out from anywhere, which clears their session and updates the navigation instantly.

- **Responsive Sidebar Navigation:**  
  A collapsible sidebar with icons (using react-icons) for navigation. The sidebar auto-collapses on route change or outside click, and its content updates based on authentication state.

- **Profile & Conditional Navigation:**  
  The sidebar shows "Profile" and "Logout" when logged in, and "Log-In" and "Sign-Up" when logged out.

- **Reusable Auth Form:**  
  Both Sign Up and Log In pages use a unified, reusable form component for consistency and maintainability.

- **Bootstrap Styling:**  
  All pages use Bootstrap for a modern, responsive design.

- **Server-Side Validation:**  
  The backend validates all fields and checks for existing emails before creating a user.

- **MongoDB Integration:**  
  User data is stored securely in a MongoDB database.

- **404 Page:**  
  Any unknown route displays a friendly 404 Not Found page.

## Getting Started

1. **Install dependencies**  
   Run `npm install` in both the `client` and `server` folders.

2. **Start the backend**  
   ```
   cd server
   node index.js
   ```

3. **Start the frontend**  
   ```
   cd client
   npm start
   ```

4. **Open in browser**  
   Visit `http://localhost:3000` (or your configured port).

## Folder Structure

- `/client` – React frontend
- `/server` – Node.js/Express backend

## Notes

- Make sure MongoDB is running locally or update the connection string as needed.
- Sensitive files like `node_modules` and `package-lock.json` are excluded via `.gitignore`.

---

Feel free to contribute or customize!
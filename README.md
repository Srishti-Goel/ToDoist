# To-Do App

A simple full-stack To-Do application with user authentication.

## Features

- **User Registration:**  
  Users can sign up with their name, email, and password. Passwords must be at least 6 characters. Duplicate emails are not allowed.

- **User Login:**  
  Registered users can log in with their email and password. Error messages are shown for invalid credentials.

- **Responsive Auth Pages:**  
  Both Sign Up and Log In pages use Bootstrap for a modern, responsive design. Error handling and loading states are included.

- **Reusable Auth Form:**  
  The authentication pages share a unified, reusable form component for consistency and maintainability.

- **Server-Side Validation:**  
  The backend validates all fields and checks for existing emails before creating a user.

- **MongoDB Integration:**  
  User data is stored securely in a MongoDB database.

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
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

import App from "./routes/App";
import TasksPage from "./routes/TasksPage";
import { tasksLoader, createTaskAction } from "./routes/tasks.loaders";
import UsersPage from "./routes/UsersPage";
import { usersLoader } from "./routes/users.loaders";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";

// Set document title
document.title = "CI/CD Demo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        ),
        loader: tasksLoader,
        action: createTaskAction,
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        ),
        loader: usersLoader,
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Blog from "./pages/Blog";
import { Toaster } from "react-hot-toast";
import Blogs from "./pages/Blogs";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute, { PublicRoute } from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>} />

          <Route path="/signin" element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/" element={<Blogs />} />

          {/* private route  */}
          <Route
            path="/create_post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create_post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

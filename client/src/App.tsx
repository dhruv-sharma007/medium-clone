import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Blog from "./pages/Blog";
import { Toaster } from "react-hot-toast";
import Blogs from "./pages/Blogs";
import { useAuthStore } from './store/auth';
import CreatePost from "./pages/CreatePost";
import AppBar from './components/AppBar';

function App() {
  const { isLoggedIn } = useAuthStore()

  return (
    <>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      {/* <AppBar /> */}
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/" element={<Blogs />} />

          {/* private route  */}
          <Route path="/create_post" element={isLoggedIn ? <CreatePost /> : <SignIn />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

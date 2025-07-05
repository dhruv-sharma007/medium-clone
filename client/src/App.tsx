import { Toaster } from "react-hot-toast";
import Routing from "./routes/Routing";

function App() {
  return (
    <div>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <Routing />
    </div>
  );
}

export default App;

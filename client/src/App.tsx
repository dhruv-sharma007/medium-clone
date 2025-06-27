import { Toaster } from "react-hot-toast";
import Routing from './routes/Routing';

function App() {
  return (
    <div className="overflow-hidden">
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Routing />
    </div>
  );
}

export default App;

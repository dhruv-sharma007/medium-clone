import { Toaster } from "react-hot-toast";
import Routing from './routes/Routing';

function App() {
  return (
    <>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Routing />
    </>
  );
}

export default App;

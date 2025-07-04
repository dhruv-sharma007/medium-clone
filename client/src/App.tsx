import { Toaster } from "react-hot-toast";
import Routing from "./routes/Routing";
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <Routing />
    </div>
  );
}

export default App;

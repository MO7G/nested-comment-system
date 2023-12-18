
import { PostList } from "./components/PostList";
import MainRoutes from "./routes/routes";
import { useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">

      <div className="container">
        <MainRoutes isAuthenticated={isAuthenticated} />
      </div>
    </SkeletonTheme>
  );
}

export default App;

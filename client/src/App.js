
import { PostList } from "./components/PostList";
import MainRoutes from "./routes/routes";
import { useState } from "react";
function App() {
  const [isAuthenticated , setIsAuthenticated] = useState(true);
  return (
    
    <div className="container">
      <MainRoutes isAuthenticated={isAuthenticated}/>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import RecipePage from "./components/RecipePage/RecipePage";
import CreateRecipePage from "./components/RecipePage/CreateRecipePage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipe/:id" element={<RecipePage />} />
                <Route path="/create-recipe" element={<CreateRecipePage />} />
            </Routes>
        </Router>
    );
}

export default App;

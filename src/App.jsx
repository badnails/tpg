import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentGateway from "./pages/PaymentGateway";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/gateway' element={<PaymentGateway/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
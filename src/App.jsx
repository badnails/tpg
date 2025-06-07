import PaymentGateway from "./PaymentGateway";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

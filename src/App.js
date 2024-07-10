import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './tailwind.css';
import EventPage from './Component/Main/EventPage';
import CreateId from './Component/Main/CreateId';




function App() {
  return (
    <div className=" ">
      <Router>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/create-id" element={<CreateId />} />
           



          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

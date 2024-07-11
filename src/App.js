import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './tailwind.css';
import EventPage from './Component/Main/EventPage';
import CreateId from './Component/Main/CreateId';
import BulkCreateID from './Component/Main/BulkCreateID';




function App() {
  return (
    <div className=" ">
      <Router>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<EventPage />} />
            <Route path="/create-id" element={<CreateId />} />
            <Route path="/bulk-create-id" element={<BulkCreateID />} />
           



          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

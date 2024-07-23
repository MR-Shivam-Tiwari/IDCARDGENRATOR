import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './tailwind.css';
import EventPage from './Component/Main/EventPage';
import CreateId from './Component/Main/CreateId';
import BulkCreateID from './Component/Main/BulkCreateID';
import DataCheck from './Component/Main/DataCheck';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ArchiveEvent from './Component/Main/Archive/ArchiveEvent';
import BulkUploadForm from './Component/Main/BulkUploadForm';
import Approved from './Component/Main/Approved';
import Login from './Component/Auth/Login';


function App() {
  return (
    <div className=" ">
       <ToastContainer />
      <Router>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/create-id" element={<CreateId />} />
            <Route path="/bulk-create-id" element={<BulkUploadForm />} />
            <Route path="/archive-event" element={<ArchiveEvent />} />
            <Route path="/approve/:participantId" element={<Approved />} />

            {/* <Route path="/ceck" element={<DataCheck />} /> */}
           



          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

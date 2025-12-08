import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './auth/SignUp';
import LogIn from './auth/LogIn';
import PageTest from './pages/PageTest';
import SavedEvent from './pages/SavedEvent';
import LikedEvent from './pages/LikedEvent';
import EventPage from './pages/EventPage';
import ReminderList from './pages/ReminderList';
import RequireAuth from './components/RequireAuth';
import Contact from './pages/Contact';
import About from './pages/About';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);
  const [activeNav, setActiveNav] = useState("home");


  return (
    <Router>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
      <Routes>
        <Route path="/" element={<PageTest />} />
        <Route path="/PageTest" element={<PageTest />} />
        <Route path="/auth/SignUp" element={<SignUp />} />
        <Route path="/auth/LogIn" element={<LogIn />} />
        <Route path="/events/:eventId" element={<RequireAuth><EventPage /></RequireAuth>} />
        <Route path="/saved" element={<SavedEvent />} />
        <Route path="/liked" element={<LikedEvent />} />
        <Route path="/reminders" element={<ReminderList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;

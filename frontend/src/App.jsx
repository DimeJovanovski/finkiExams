import { useState, useEffect, useRef } from 'react';
import './App.css';
import Schedule from './Schedule';
import Calendar from './Calendar';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { fetchDataForExamDialog, addExam } from './api/api';
import headerLogo from './assets/finki_mk.png';
import Login from './Login';  // Import the Login component
import Register from './Register'; // Import the Register component
import { useNavigate } from 'react-router-dom';
import Legend from './Legend';

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('jwt'));  // Check if the user is already logged in
  const [showRegister, setShowRegister] = useState(false); // State to toggle between login and register
  const [startDate, setStartDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [examDialogData, setExamDialogData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const scheduleRef = useRef(null);
  const navigate = useNavigate(); // For navigating programmatically

  // Effect to fetch data after login
  useEffect(() => {
    if (authenticated) {
      fetchDataForExamDialog()
        .then(response => {
          setExamDialogData(response.data);
          refreshEvents(); // Fetch events after login
        })
        .catch(error => {
          console.error("Error fetching exam dialog data:", error);
          handleLogout();
        });
    }
  }, [authenticated]);

  const refreshEvents = async () => {
    try {
      const examsResponse = await fetchExams();
      const examEvents = examsResponse.data.map(exam => ({
        id: exam.id,
        text: exam.subjectName,
        start: exam.fromTime,
        end: exam.toTime,
        // Add other properties as needed
      }));
      setEvents(examEvents);
      if (scheduleRef.current) {
        scheduleRef.current.refreshEvents();
      }
    } catch (error) {
      console.error("Error refreshing events:", error);
    }
  };

  const userRole = localStorage.getItem('role');
  const hasAccess = (role) => {
    // Define access control logic
    if (role === 'ADMIN') return true;
    return false;
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    setAuthenticated(false);
    navigate('/login');
  };

  // Function to toggle to the Register component
  const handleToggleRegister = () => {
    setShowRegister(true);
  };

  // Function to toggle back to the Login component
  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  // Open modal dialog for adding an exam
  const openModalDialog = async () => {
    if (!examDialogData) {
      alert("Loading exam dialog data, please wait...");
      return;
    }

    const form = [
      { type: 'title', name: "Внеси термин" },
      {
        name: "Предмет",
        id: "subjectId",
        type: "searchable",
        options: examDialogData.subjects.map(subject => ({
          id: subject.id,
          name: `${subject.name} (${subject.abbreviation})`
        }))
      },
      {
        name: "Сесија",
        id: "sessionId",
        type: "searchable",
        options: examDialogData.sessions.map(session => ({
          id: session,
          name: session
        }))
      },
      {
        name: "Од",
        id: "fromTime",
        type: "datetime",
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
      },
      {
        name: "До",
        id: "toTime",
        type: "datetime",
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
      },
      {
        name: "Коментар",
        id: "comment",
        type: "text"
      },
      ...examDialogData.rooms.map(room => ({
        type: 'checkbox',
        id: room,
        name: room
      }))
    ];

    const data = {
      subjectId: "",
      sessionId: "",
      fromTime: DayPilot.Date.today(),
      toTime: DayPilot.Date.today().addHours(1),
      comment: "",
      ...examDialogData.rooms.reduce((acc, room) => {
        acc[room] = false;
        return acc;
      }, {})
    };

    const modal = await DayPilot.Modal.form(form, data);

    if (!modal.canceled) {
      const { subjectId, sessionId, fromTime, toTime, comment } = modal.result;
      console.log("modal.result: ", modal.result);

      // Normalize the room selection from modal.result
      const roomNames = [];

      for (const [key, value] of Object.entries(modal.result)) {
        if (typeof value === 'boolean' && value) {
          roomNames.push(key); // Add the exact room key without trimming
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            if (nestedValue) {
              roomNames.push(`${key}.${nestedKey}`);
            }
          }
        }
      }

      console.log("Room names: ", roomNames);

      const requestBody = {
        subjectId,
        sessionId,
        fromTime,
        toTime,
        comment,
        roomNames  // Send the selected room strings
      };

      addExam(requestBody)
        .then(() => {
          console.log("Exam added successfully.");
          // Call refreshEvents from the Schedule component using the ref
          if (scheduleRef.current) {
            scheduleRef.current.refreshEvents();  // Call refreshEvents via ref
          }
        })
        .catch((error) => {
          console.error("Error adding exam:", error);
        });
    }
  };

  // Conditional rendering for Login and Register components
  if (!authenticated) {
    return showRegister ? (
      <Register onBack={handleBackToLogin} /> // Render Register component
    ) : (
      <Login setAuthenticated={setAuthenticated} onRegisterClick={handleToggleRegister} /> // Render Login component
    );
  }

  return (
    <div className="container">
      <div className="dpw-header">
      <div className="dpw-header-inner">
          <img src={headerLogo} style={{ height: "50px", padding: "5px 0 0 20px", margin: "0px" }} alt="FINKI logo" />
          <button onClick={handleLogout} className="logout-button">Одјава</button>
        </div>
      </div>
      <div className="content-container">
        <div className="calendar-wrapper">
          <Calendar 
            onDateSelect={setStartDate} 
            events={events} 
            selectedDate={startDate}  // Pass the selected date to Calendar
          />
        </div>
        <br />
        <div className="schedule-wrapper" style={{ overflowX: 'auto', textAlign: 'start' }}>
          {hasAccess(userRole) && (
            <button className="add-exam-button" onClick={openModalDialog} style={{ marginBottom: '10px' }}>
              Додади испит
            </button>
          )}
          <Schedule
            startDate={startDate}
            onEventsChange={setEvents}
            ref={scheduleRef}
          />
        </div>
      </div>
      <Legend />
    </div>
  );
}

export default App;

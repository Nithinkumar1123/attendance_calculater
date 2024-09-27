import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AttendanceCalculator = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', present: '', total: '', percentage: 75 },
  ]);
  const [output, setOutput] = useState('');
  const [quote, setQuote] = useState('');

  const quotes = [
    "Don't stop until you're proud!",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Push yourself because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream big and dare to fail.",
    "Believe you can and you're halfway there.",
    "Your limitation—it's only your imagination.",
    "Success doesn't just find you, you have to go out and get it.",
    "You don't want to look back and know you could've done better.",
    "Wake up with determination, go to bed with satisfaction."
  ];

  // Display one random quote when the component is mounted
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { id: subjects.length + 1, name: '', present: '', total: '', percentage: 75 },
    ]);
  };

  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const handleCalculate = () => {
    let outputText = '';
    subjects.forEach(subject => {
      const presentValue = parseInt(subject.present);
      const totalValue = parseInt(subject.total);
      const percentageValue = parseInt(subject.percentage);

      if (presentValue < 0 || totalValue <= 0 || presentValue > totalValue) {
        outputText += `<p>${subject.name || `Subject ${subject.id}`}: Proper values please ¯\\_(ツ)_/¯</p>`;
        return;
      }

      if (presentValue / totalValue >= percentageValue / 100) {
        const daysAvailableToBunk = daysToBunk(presentValue, totalValue, percentageValue);
        outputText += `<p>${subject.name || `Subject ${subject.id}`}: ${daysToBunkText(daysAvailableToBunk, presentValue, totalValue)}</p>`;
      } else {
        const attendanceNeeded = reqAttendance(presentValue, totalValue, percentageValue);
        outputText += `<p>${subject.name || `Subject ${subject.id}`}: ${daysToAttendClassText(attendanceNeeded, presentValue, totalValue, percentageValue)}</p>`;
      }
    });

    setOutput(outputText);
  };

  const reqAttendance = (present, total, percentage) => {
    return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
  };

  const daysToBunk = (present, total, percentage) => {
    return Math.floor((100 * present - percentage * total) / percentage);
  };

  const daysToBunkText = (daysAvailableToBunk, present, total) =>
    `You can bunk for <strong>${daysAvailableToBunk}</strong> more days.<br>Current Attendance: <strong>${present}/${total}</strong> -> <strong>${(
      (present / total) * 100
    ).toFixed(2)}%</strong><br>Attendance Then: <strong>${present}/${
      daysAvailableToBunk + total
    }</strong> -> <strong>${(
      (present / (daysAvailableToBunk + total)) * 100
    ).toFixed(2)}%</strong>`;

  const daysToAttendClassText = (attendanceNeeded, present, total, percentage) =>
    `You need to attend <strong>${attendanceNeeded}</strong> more classes to attain ${percentage}% attendance<br>Current Attendance: <strong>${present}/${total}</strong> ->  <strong>${(
      (present / total) * 100
    ).toFixed(2)}%</strong><br>Attendance Required: <strong>${
      attendanceNeeded + present
    }/${attendanceNeeded + total}</strong> -> <strong>${(
      ((attendanceNeeded + present) / (attendanceNeeded + total)) * 100
    ).toFixed(2)}%</strong>`;

  return (
    <div className="container mt-4">
      <div className="position-relative text-center mb-4">
        <h1 className="text-light">Attendance Calculator</h1>
        <p className="text-light">for 75%</p>
      </div>

      {subjects.map((subject, index) => (
        <div key={subject.id} className="mb-4 card bg-dark text-light p-4">
          <h3>{`Subject ${index + 1}`}</h3>

          <div className="mb-3">
            <label htmlFor={`subject-name-${subject.id}`} className="form-label">Subject Name:</label>
            <input
              type="text"
              id={`subject-name-${subject.id}`}
              className="form-control"
              value={subject.name}
              onChange={(e) => handleInputChange(subject.id, 'name', e.target.value)}
              placeholder="Enter subject name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor={`present-input-${subject.id}`} className="form-label">Present Hours:</label>
            <input
              type="number"
              id={`present-input-${subject.id}`}
              className="form-control"
              value={subject.present}
              onChange={(e) => handleInputChange(subject.id, 'present', e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor={`total-input-${subject.id}`} className="form-label">Total Hours:</label>
            <input
              type="number"
              id={`total-input-${subject.id}`}
              className="form-control"
              value={subject.total}
              onChange={(e) => handleInputChange(subject.id, 'total', e.target.value)}
              min="1"
              required
            />
          </div>

          {subjects.length > 1 && (
            <button className="btn btn-danger mb-3" onClick={() => handleRemoveSubject(subject.id)}>
              <i className="fas fa-trash-alt"></i> Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-primary" onClick={handleAddSubject}>
        <i className="fas fa-plus"></i> Add Another Subject
      </button>

      <button className="btn btn-success ms-3" onClick={handleCalculate}>
        <i className="fas fa-calculator"></i> Calculate
      </button>

      <div
        id="output-div"
        className="mt-3 text-light"
        dangerouslySetInnerHTML={{ __html: output }}
      ></div>

      <footer id="footer" className="mt-5 text-center">
        <h4 className="text-light">Motivational Quote:</h4>
        <p className="text-info"><em>{quote}</em></p>
      </footer>

      <style jsx="true">{`
        body {
          background-color: #343a40;
        }

        .form-control, .btn {
          border-radius: 5px;
        }

        .card {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        #output-div {
          font-size: 18px;
          font-weight: bold;
          color: #E94E77;
        }

        footer {
          margin-top: 20px;
          font-style: italic;
          color: #4A90E2;
        }
      `}</style>
    </div>
  );
};

export default AttendanceCalculator;

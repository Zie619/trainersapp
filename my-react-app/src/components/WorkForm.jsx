import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc,setDoc , deleteDoc  } from 'firebase/firestore';
import { firestore } from './firebase';

const WorkForm = ({ selectedCollection, username , onSelectionChange }) => {
  const [exercise, setExercise] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState({
    sets: '',
    repetitions: '',
  });
  const [header, setHeader] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [workoutNumbers, setWorkoutNumbers] = useState([]);
  const [selectedWorkoutNum, setSelectedWorkoutNum] = useState('אימון ראשון'); // Fixed: Use state to track selected workout number
  const [NewWorkoutName, setNewWorkoutName] = useState('');



  useEffect(() => {
    const fetchWorkoutNumbers = async () => {
      try {
        setSelectedWorkoutNum(workoutNumbers[0]); // Set the default value to the first number in the list
      } catch (error) {
        console.error('Error fetching workout numbers:', error);
      }
    };

    fetchWorkoutNumbers();
  }, [username, selectedCollection]); // Make sure to include dependencies


  
  useEffect(() => {
    const fetchWorkoutNumbers = async () => {
      try {
        const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans');
        const querySnapshot = await getDocs(workoutPlansCollection);
        const numbers = querySnapshot.docs.map(doc => doc.id);
        setWorkoutNumbers(numbers);
      } catch (error) {
        console.error('Error fetching workout numbers:', error);
      }
    };

    fetchWorkoutNumbers();
  }, [firestore, username, selectedCollection , selectedWorkoutNum ,workoutNumbers ]);

  const handleWorkoutNumChange = (event) => {
    const selectedNum = event.target.value;
    onSelectionChange(selectedNum)
    setSelectedWorkoutNum(selectedNum); // Fixed: Update the selected workout number
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleAddExerciseClick = async () => {
    // Check if all fields are filled
    if (!exercise || !workoutPlan.sets || !workoutPlan.repetitions) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum, 'workouts'); // Fixed: Use selectedWorkoutNum
      const newWorkoutPlan = {
        exercise,
        ...workoutPlan,
        timestamp: new Date(),
      };

      await addDoc(workoutPlansCollection, newWorkoutPlan);

      setExercise('');
      setWorkoutPlan({
        sets: '',
        repetitions: '',
      });
      setErrorMessage(''); // Clear the error message after successful submission
    } catch (error) {
      console.error('Error adding workout plan:', error);
      setErrorMessage('Error adding workout plan. Please try again.');
    }
  };

  const handleAddHeaderClick = async () => {
    // Check if the input field is filled
    if (!header) {
      setErrorMessage('Please fill in the header field.');
      return;
    }

    try {
      const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum, 'workouts'); // Fixed: Use selectedWorkoutNum
      const newWorkoutPlan = {
        split: header,
        timestamp: new Date(),
      };

      await addDoc(workoutPlansCollection, newWorkoutPlan);

      setHeader('');
      setErrorMessage(''); // Clear the error message after successful submission
    } catch (error) {
      console.error('Error adding workout plan:', error);
      setErrorMessage('Error adding workout plan. Please try again.');
    }
  };




  /////////////////////////////


  const isValidWorkoutName = (name) => /^[a-zA-Z0-9\u0590-\u05FF]+$/u.test(name.replace(/\s/g, ''));


  const handleNewWorkoutNameChange = (event) => {
    const newName = event.target.value;
    setNewWorkoutName(newName);
    setErrorMessage(newName.replace(/\s/g, '').length < 3 ? 'Collection name must be at least 3 characters' : '');
  };

  const handleCreateNewWorkout = async () => {
    if (NewWorkoutName && isValidWorkoutName(NewWorkoutName) && NewWorkoutName.replace(/\s/g, '').length >= 3) {
      try {
        const existingCollections = workoutNumbers.map((workoutNames) => workoutNames.toLowerCase());
        if (existingCollections.includes(NewWorkoutName.toLowerCase())) {
          setErrorMessage('Collection already exists.');
          return;
        }

        // Add the new workout plan to the 'collections' document
        const collectionsDocRef = doc(firestore, username, selectedCollection, 'workoutPlans', NewWorkoutName);
        await setDoc(collectionsDocRef, {});

        // Update the state after the document has been updated
        setSelectedWorkoutNum(NewWorkoutName);
        onSelectionChange(NewWorkoutName)
        setNewWorkoutName('');
        setErrorMessage('');

        // Navigate to the new URL
      } catch (error) {
        console.error('Error creating new collection:', error);
      }
    } else {
      setErrorMessage('Collection name must be at least 3 characters and contain only letters or numbers');
    }
  };


  const handleRemoveNewWorkout = async () => {
    try {
      
      const workoutPlansCollectionRef = collection(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum, 'workouts');

      // Delete documents within the collection
      const querySnapshot = await getDocs(workoutPlansCollectionRef);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete the collection
      await deleteDoc(doc(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum));
      // Set the default collection to the first collection if available
      
      updatecollectionsnames();
    } catch (error) {
      console.error('Error removing collection:', error);
    }
  };
  const updatecollectionsnames = async () => {
    if (selectedWorkoutNum === workoutNumbers[0]) {
    setSelectedWorkoutNum(workoutNumbers[1]);
    onSelectionChange(workoutNumbers[1])}
    else if (selectedWorkoutNum === workoutNumbers[1]) {
      setSelectedWorkoutNum(workoutNumbers[0]);
      onSelectionChange(workoutNumbers[0])
    }
    else {
      setSelectedWorkoutNum(workoutNumbers[0]);
      onSelectionChange(workoutNumbers[0])
    }

  }



  return (
    <div>
      <div>
        <div className="button-section ">
          <button id='test2'  className="action-button create " onClick={handleCreateNewWorkout}>
            הוספת תכנית אימונים חדשה
          </button>
          <br/>
          <button id='test2' className="action-button remove" onClick={handleRemoveNewWorkout}>
            מחיקת תכנית אימונים
          </button>
          <br/> 
        </div>
  
        <input
          type="text"
          placeholder="Enter new workout name"
          value={NewWorkoutName}
          onChange={handleNewWorkoutNameChange}
          className="text-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>


      <div>
        <label>תכנית מספר:</label>
        <select
          value={selectedWorkoutNum} // Fixed: Use selectedWorkoutNum for value
          onChange={handleWorkoutNumChange}
        >
          {workoutNumbers.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div>
        <form>
          <label>תרגיל:</label>
          <input type="text" name="exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} />
          <label>מספר סטים:</label>
          <input type="text" name="sets" value={workoutPlan.sets} onChange={handleChange} />
          <label>כמות חזרות:</label>
          <input type="text" name="repetitions" value={workoutPlan.repetitions} onChange={handleChange} />
          <button type="button" onClick={handleAddExerciseClick}>
            הוספת תרגיל למתאמן
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px' }}>
        <form>
          <label>(A / B / C) פיצול תכנית למתאמן (אופציונלי)</label>
          <input type="text" name="header" value={header} onChange={(e) => setHeader(e.target.value)} />
          <button type="button" onClick={handleAddHeaderClick}>
            הוסף פיצול לתכנית
          </button>
        </form>
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default WorkForm;

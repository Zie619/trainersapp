import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { firestore } from './firebase';


const WorkShowForAdmin = ({ selectedCollection, onAddWorkoutPlan, username , selectedWorkoutNum  }) => {
  const databasename = username + '/' + selectedCollection;
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [workoutnum, setworkoutnum] = useState('workoutPlans2');
  
  useEffect(() => {
    try {
      if (!selectedWorkoutNum) {
        // Handle the case where selectedWorkoutNum is null or undefined
        return;
      }
  
      const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum, 'workouts');
      const orderedQuery = query(workoutPlansCollection, orderBy('timestamp', 'asc'));
  
      const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
        const plansData = [];
        querySnapshot.forEach((doc) => {
          plansData.push({ id: doc.id, ...doc.data() });
        });
  
        setWorkoutPlans(plansData);
      });
  
      return () => {
        // Cleanup function to unsubscribe when component unmounts or when selectedCollection changes
        unsubscribe();
      };
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  }, [username, selectedCollection, selectedWorkoutNum]);
  

  const handleDelete = async (id) => {
    try {
      const workoutPlansCollection =  collection(firestore, username, selectedCollection, 'workoutPlans', selectedWorkoutNum , 'workouts');
      await deleteDoc(doc(workoutPlansCollection, id));

      // Filter out the deleted workout plan from the state
      const updatedWorkoutPlans = workoutPlans.filter((plan) => plan.id !== id);
      setWorkoutPlans(updatedWorkoutPlans);
      onAddWorkoutPlan(updatedWorkoutPlans);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  };

  return (
    
    <div className="workout-table ">
    
      <h2>תכנית האימונים</h2>
      <table>
        <thead>
          <tr>
            <th>תרגיל</th>
            <th>סטים</th>
            <th>חזרות</th>
            <th>פיצול</th>
            <th>שינוי או מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {workoutPlans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.exercise}</td>
              <td>{plan.sets}</td>
              <td>{plan.repetitions}</td>
              <td>{plan.split}</td>
              <td>
                <button id='test2' className="div" onClick={() => handleDelete(plan.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkShowForAdmin;

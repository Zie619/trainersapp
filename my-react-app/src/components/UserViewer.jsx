import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, orderBy ,getDocs} from 'firebase/firestore';
import { firestore } from './firebase';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import bg from './model/gym.hdr';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import dumb from './model/weight.glb';
import './UserView.css';
import {TailSpin} from 'react-loader-spinner';
import { Table } from 'antd';


const RotationStars = ({ starsRef }) => {
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.00001;
      starsRef.current.rotation.y += 0.00001;
      starsRef.current.rotation.z += 0.0001;
    }
  });

  return <Stars ref={starsRef} />;
};

const RotationModel = ({ modelRef }) => {
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
    }
  });

  return null;
};

const CameraRotation = ({ modelRef, cameraRef }) => {
  useFrame(({ clock }) => {
    if (modelRef.current && cameraRef.current) {
      const elapsedTime = clock.getElapsedTime();
      const radius = 3;
      const speed = 0.2;

      cameraRef.current.position.x = modelRef.current.position.x + 5 + radius * Math.sin(speed * elapsedTime) *2 ;
      cameraRef.current.position.z = modelRef.current.position.z + radius * Math.cos(speed * elapsedTime) * 4 + 3.5;
      cameraRef.current.position.y = modelRef.current.position.z + radius * Math.cos(speed /4 * elapsedTime) * 2;
      cameraRef.current.lookAt(modelRef.current.position);
    }
  });

  return null;
};

const UserViewer = ({ selectedCollection, username }) => {
  const [loading, setLoading] = useState(true);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [renderDelayedResult, setRenderDelayedResult] = useState(false); // State for delaying result
  const [workoutNumbers, setWorkoutNumbers] = useState([]);
  const [traineeData, setTraineeData] = useState([]);
  const [selectedWorkoutNum, setSelectedWorkoutNum] = useState('אימון ראשון');
  const modelRef = useRef();
  const starsRef = useRef();
  const cameraRef = useRef();












  
  useEffect(() => {
    // Load glTF model
    const loader = new GLTFLoader();
    loader.load(dumb, (gltf) => {
      modelRef.current = gltf.scene;
      modelRef.current.position.set(0, 0, 0);
      modelRef.current.scale.set(2, 2, 2);
      setLoading(false);
      setTimeout(() => {
        setRenderDelayedResult(true);
      }, 2000);
    });
  }, []);


  useEffect(() => {
    const fetchWorkoutNumbers = async () => {
      try {
        const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans');
        const querySnapshot = await getDocs(workoutPlansCollection);
        const numbers = querySnapshot.docs.map(doc => doc.id);
        setWorkoutNumbers(numbers);
  
        // Use workoutNumbers[0] here
        const workoutPlansCollection2 = collection(firestore, username, selectedCollection, 'workoutPlans', numbers[0], 'workouts');
        const orderedQuery = query(workoutPlansCollection2, orderBy('timestamp', 'asc'));
  
        const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
          const plansData = [];
          querySnapshot.forEach((doc) => {
            plansData.push({ id: doc.id, ...doc.data() });
          });
  
          setWorkoutPlans(plansData);
        });
  
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching workout numbers:', error);
      }
    };
  



    fetchWorkoutNumbers();
  }, [selectedCollection, username]);



  const handleWorkoutNumberChange = (number) => {

    setSelectedWorkoutNum(number);
    fetchWorkoutPlans(number);
  };


  const handleOtherFunction= (number) => {

    setSelectedWorkoutNum("profile");
    fetchWorkoutPlans("profile");
  };


  const fetchWorkoutPlans = async (selectedWorkoutNum) => {
    if (!selectedWorkoutNum) return; // Return if selectedWorkoutNum is null

    try {
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
        unsubscribe();
      };
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const linkHashCollection2 = collection(firestore, username, selectedCollection, 'traineedata');
        const querySnapshot = await getDocs(linkHashCollection2);
        const data = querySnapshot.docs.map(doc => doc.data());
        setTraineeData(data);
      } catch (error) {
        console.error('Error fetching trainee data:', error);
      }
    };

    fetchData();
  }, [username, selectedCollection]);



  return (
    
    <div id="workout-table" className="workout-container">

        {loading ? (
          // Render loader while the model is loading
          <TailSpin />
        ) : (
          <Canvas
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
          onCreated={({ gl, camera }) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.setSize(window.innerWidth, window.innerHeight);
            cameraRef.current = camera;
          }}
        >
          <ambientLight />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Environment files={bg} background />
          <OrbitControls />
          <Stars ref={starsRef} />
          {modelRef.current && <primitive object={modelRef.current} rotation-y={155} />}
          <RotationStars starsRef={starsRef} />
          <RotationModel modelRef={modelRef} />
          <CameraRotation modelRef={modelRef} cameraRef={cameraRef} />
        </Canvas>
        
      )}
          <div className={` table-container fade-container ${renderDelayedResult ? 'hidden' : 'visible'}`}><h1> היי  {selectedCollection}  <br/>!שיהיה בהצלחה באימון </h1></div>
          <div className={`table-container tab fade-container ${renderDelayedResult ? 'visible' : 'hidden'}`}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
    {/* Render button for the new function */}
    {/* <button
      onClick={handleOtherFunction}
      style={{
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: selectedWorkoutNum === 'profile' ? '#a0c00f' : '#131', // Dark purple if selected, dark red otherwise
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      פרופיל מתאמן
    </button> */}
    
    {/* Render buttons for each workout number */}
    {workoutNumbers.map((number) => (
      <button
        key={number}
        onClick={() => handleWorkoutNumberChange(number)}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: selectedWorkoutNum === number ? '#6a0dad' : '#333', // Dark purple if selected, dark gray otherwise
          color: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        {number}
      </button>
    ))}
  </div>
          <h2>תכנית האימונים של <br/>
              <span style={{ color: 'red' }}>{selectedCollection}</span>  
          </h2>

          {selectedWorkoutNum === 'profile' ? (
          
          
                  <div>
          <img src={traineeData.userPhoto} alt="User" style={{ width: '100px', height: '100px' }} />
          <br/><br/><br/>
          <table className="workout-table2" style={{ textAlign: 'center', margin: 'auto' }}>
            <thead>
              <tr>
                <th>משקל</th>
                <th>גובה</th>
                <th>bmi</th>
                <th>משקל יעד</th>
                <th>מבנה גוף</th>
                <th>שומן</th>
              </tr>
            </thead>
            <tbody>
            {traineeData.map((tra, index) => (
            <React.Fragment key={tra.id || index}>
              {tra.split ? (
                <tr key={(tra.id || index) + "_split"}>
                  <th colSpan="6">{tra.split}</th>
                </tr>
              ) : (
                <tr key={(tra.id || index) + "_data"}>
                  <td>{tra.height}</td>
                  <td>{tra.weight}</td>
                  <td>{tra.bmi}</td>
                  <td>{tra.desiredweight}</td>
                  <td>{tra.bodytype}</td>
                  <td>{tra.fat}</td>
                </tr>
              )}
            </React.Fragment>
          ))}

            </tbody>
          </table>
        </div>
          
          
          ) : (
            <table className="workout-table2" style={{ textAlign: 'center', margin: 'auto' }}>
            <thead>
              <tr>
                <th>חזרות</th>
                <th>סטים</th>
                <th>תרגיל</th>
              </tr>
            </thead>
            <tbody>
              {workoutPlans.map((plan) => (
                <React.Fragment key={plan.id}>
                  {plan.split ? (
                    <tr>
                      <th colSpan="3">{plan.split}</th>
                    </tr>
                  ) : (
                    <tr>
                      <td>{plan.repetitions}</td>
                      <td>{plan.sets}</td>
                      <td>{plan.exercise}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          ) }
        </div>
    </div>
  );
};

export default UserViewer;

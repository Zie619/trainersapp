import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate  } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { firestore } from './firebase';
import WorkoutTable from './WorkShowForAdmin';
import WorkoutForm from './WorkForm';
import CollectionToHash from './UserHashMaker'; 

const WorkCombineFormAndTable = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [collections, setCollections] = useState(['demo']);
  const [selectedCollection, setSelectedCollection] = useState('demo'); // Default collection
  const [newCollectionName, setNewCollectionName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedURL, setGeneratedURL] = useState('');
  const [selectedWorkoutNum, setSelectedWorkoutNum] = useState('אימון ראשון');

  const { User } = useParams();
  const username = User;
  const domain = window.location.hostname;



  const handleSelectionChange = (newSelection) => {
    setSelectedWorkoutNum(newSelection);
  };
  useEffect(() => {
    const fetchWorkoutNumbers = async () => {
      try {
        const workoutPlansCollection = collection(firestore, username, selectedCollection, 'workoutPlans');
        const querySnapshot = await getDocs(workoutPlansCollection);
        const numbers = querySnapshot.docs.map(doc => doc.id);
        setSelectedWorkoutNum(numbers[0]); // Set the default value to the first number in the list
      } catch (error) {
        console.error('Error fetching workout numbers:', error);
      }
    };

    fetchWorkoutNumbers();
  }, [username, selectedCollection]); // Make sure to include dependencies


  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsSnapshot = await getDocs(collection(firestore, username));
        const collectionNames = collectionsSnapshot.docs.map((doc) => doc.id);
        setCollections(collectionNames);

        // Listen for changes in the 'collections' document
        const collectionsDocRef = doc(firestore, username, selectedCollection);
        const unsubscribeCollections = onSnapshot(collectionsDocRef, (doc) => {
          if (doc.exists()) {
            const updatedCollectionNames = doc.data().workoutPlans || [];
            setWorkoutPlans(updatedCollectionNames);
          }
        });

        return () => {
          unsubscribeCollections();
        };
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, [firestore, selectedCollection]);

  const isValidCollectionName = (name) => /^[a-zA-Z0-9\u0590-\u05FF]+$/u.test(name.replace(/\s/g, ''));


  const handleCollectionChange = (event) => {
    setSelectedCollection(event.target.value);
  };

  const handleNewCollectionNameChange = (event) => {
    const newName = event.target.value;
    setNewCollectionName(newName);
    setErrorMessage(newName.replace(/\s/g, '').length < 3 ? 'Collection name must be at least 3 characters' : '');
  };

  const handleCreateNewCollection = async () => {
    if (newCollectionName && isValidCollectionName(newCollectionName) && newCollectionName.replace(/\s/g, '').length >= 3) {
      try {
        const existingCollections = collections.map((collectionName) => collectionName.toLowerCase());
        if (existingCollections.includes(newCollectionName.toLowerCase())) {
          setErrorMessage('Collection already exists.');
          return;
        }

        // Generate a random hash using uuidv4()
        const linkHash = uuidv4();

        // Add the random hash to the 'linkhash' collection
        const linkHashCollection = collection(firestore, username, newCollectionName, 'linkhash');
        await addDoc(linkHashCollection, { hash: linkHash });



        // Add the new workout plan to the 'collections' document
        const collectionsDocRef = doc(firestore, username, newCollectionName);
        await setDoc(collectionsDocRef, {});

        const collectionsDocRef2 = doc(firestore, username, newCollectionName, 'workoutPlans', 'אימון ראשון');
        await setDoc(collectionsDocRef2, {});

        

        // Add the firs bmi test to the collection
        const linkHashCollection2 = collection(firestore, username, newCollectionName, 'traineedata');
        await addDoc(linkHashCollection2, { 
          height: "0 cm",
          weight: "0 kg", 
          bmi: "0", 
          desiredweight: "0 kg",
          bodytype: "morpius",
          fat: "0 %" ,
          userphoto: "https://example.com/photo.jpg", 

        });
        


        // Update the state after the document has been updated
        setSelectedCollection(newCollectionName);
        setNewCollectionName('');
        setErrorMessage('');

        // Generate the URL
        const url = `/${username}/${linkHash}`;
        setGeneratedURL(url);

        // Navigate to the new URL
      } catch (error) {
        console.error('Error creating new collection:', error);
      }
    } else {
      setErrorMessage('Collection name must be at least 3 characters and contain only letters or numbers');
    }
  };

  const handleRemoveCollection = async () => {
    try {
      const defaultCollection = 'demo'; // Replace 'Default' with your desired default collection name

      if (selectedCollection === defaultCollection) {
        console.warn('Cannot delete the default collection.');
        return;
      }

      const workoutPlansCollectionRef = collection(firestore, username, selectedCollection, 'workoutPlans');

      // Delete documents within the collection
      const querySnapshot = await getDocs(workoutPlansCollectionRef);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete the collection
      await deleteDoc(doc(firestore, username, selectedCollection));

      // Set the default collection to the first collection if available
      const updatedCollections = collections.filter((collectionName) => collectionName !== selectedCollection);
      if (updatedCollections.length > 0) {
        setSelectedCollection(updatedCollections[0]);
      }
    } catch (error) {
      console.error('Error removing collection:', error);
    }
  };


  const hashlinker = () => {
    const hash = CollectionToHash({ collectionName: selectedCollection, User: username });
    return hash;
  };
  
  const linkeer = `/${username}/${hashlinker()}`;

  return (
    <div  className=" workout-planner-container ">
      <h1 className="main-heading ">
  {username}'s <br />
  <span  style={{ color: "red" }}>Workout Planner</span>
</h1>

  
      <div className="collection-section  ">
        <h2 className="label">
          :בחר מתאמן
          <img src='/weight.png' alt="Sticker" className="sticker" />
          <select
            value={selectedCollection}
            onChange={handleCollectionChange}
            className="select-input">
            {collections.map((collectionName) => (
              <option key={collectionName} value={collectionName}>
                {collectionName}
              </option>
            ))}
          </select>
        </h2>
  
        <div className="button-section ">
          <button id='test2'  className="test3 " onClick={handleCreateNewCollection}>
            הוספת מתאמן חדש למאגר
          </button>
          <br/>
          <button id='test2' className="test3" onClick={handleRemoveCollection}>
            מחיקת מתאמן מן המאגר
          </button>
          <br/>
        </div>
  
        <input
          type="text"
          placeholder="Enter new collection name"
          value={newCollectionName}
          onChange={handleNewCollectionNameChange}
          className="text-input"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
  
      {/* Display the link when a collection is chosen */}
      {selectedCollection && (
        <div className="link-section">
          <div>
      {hashlinker() === "Collection not found" ? (
       null
      ) : (
        <h2>
          <span className="selected-collection">{selectedCollection}</span> קישור אישי עבור<br></br> 
          <a href={`${linkeer}`} className="generated-link" target="_blank" rel="noopener noreferrer">
          {`${domain}${linkeer}/`}
          </a>
        </h2>
      )}
    </div>
          
        </div>
      )}
  
      <WorkoutForm selectedCollection={selectedCollection} username={username} onSelectionChange={handleSelectionChange}/>
      <WorkoutTable selectedCollection={selectedCollection} onAddWorkoutPlan={setWorkoutPlans} username={username} selectedWorkoutNum={selectedWorkoutNum} />
    </div>
  );
};

export default WorkCombineFormAndTable;

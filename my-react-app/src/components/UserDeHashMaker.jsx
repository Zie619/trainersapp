import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { firestore } from './firebase';
import View from './UserViewer';
import {TailSpin} from 'react-loader-spinner';

const UserDeHashMaker = () => {
  const [resultMessage, setResultMessage] = useState('');
  const [foundCollection, setFoundCollection] = useState(null);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const { User, hashedUserId } = useParams();
  const [renderDelayedResult, setRenderDelayedResult] = useState(false); // State for delaying result

  useEffect(() => {
    const findHash = async () => {
      try {
        if (!queryExecuted) {
          // Loop through all collections to find the hash
          const collectionsSnapshot = await getDocs(collection(firestore, User));

          for (const collectionDoc of collectionsSnapshot.docs) {
            const collectionName = collectionDoc.id;
            const linkHashCollection = collection(firestore, User, collectionName, 'linkhash');
            const linkHashQuery = query(linkHashCollection, where('hash', '==', hashedUserId));
            const linkHashQuerySnapshot = await getDocs(linkHashQuery);

            // Check if a matching document is found in the current collection
            if (!linkHashQuerySnapshot.empty) {
              setResultMessage('');
              setFoundCollection(collectionName);
              setQueryExecuted(true);
              return;
            }
          }

          setResultMessage('Hash not found in any collection.');
          setFoundCollection(null); // Reset foundCollection if no match is found
          setQueryExecuted(true);
        }
      }
      
      catch (error) {
        console.error('Error finding hash:', error);
        setResultMessage('Error finding hash. Please try again.');
        setFoundCollection(null); // Reset foundCollection in case of an error
      }
    };
    // Run the findHash function only once when the component mounts
    findHash();
    setTimeout(() => {
      setRenderDelayedResult(true);
    }, 500);
    
  }, [User, hashedUserId, queryExecuted]);

  // Render the View component if a match is found
  return (
    <div>
      {!renderDelayedResult && <TailSpin />}
      {renderDelayedResult && (
        <div>
          {foundCollection && <View selectedCollection={foundCollection} username={User} />}
          {resultMessage && <p>{resultMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default UserDeHashMaker;

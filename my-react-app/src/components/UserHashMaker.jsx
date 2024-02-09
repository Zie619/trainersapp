import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';

const UserHashMaker = ({collectionName ,User}) => {
  const [hash, setHash] = useState('');
  useEffect(() => {
    
    const fetchHash = async () => {
      try {
        // Check if the collection exists
        const collectionsSnapshot = await getDocs(collection(firestore, User));
        const collectionExists = collectionsSnapshot.docs.some((doc) => doc.id === collectionName);

        if (!collectionExists) {
          setHash('Collection not found');
          return;
        }

        // Query the 'linkhash' collection to get the hash
        const linkHashCollection = collection(firestore, User, collectionName, 'linkhash');
        const linkHashQuery = query(linkHashCollection);
        const linkHashQuerySnapshot = await getDocs(linkHashQuery);

        // Assuming there's only one document in 'linkhash' for simplicity
        const linkHashDocument = linkHashQuerySnapshot.docs[0];

        if (linkHashDocument) {
          const hashValue = linkHashDocument.data().hash;
          setHash(hashValue);
        } else {
          setHash('Hash not found for the collection');
        }
        
      } catch (error) {
        console.error('Error fetching hash:', error);
        setHash('Error fetching hash. Please try again.');
      }
    };
    fetchHash();
  }, [User, collectionName]);

  return  (hash);
};

export default UserHashMaker;

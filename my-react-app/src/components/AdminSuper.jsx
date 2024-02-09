import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, collection, getDocs, query, where} from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { firestore ,firebaseApp ,authInstance ,functionsInstance} from './firebase';

const SignUpForm = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [email2, setEmail2] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    // Password validation
    const isPasswordValid = password.length >= 6;

    const handleSignUp = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const usersCollection = collection(firestore, 'users');
        const newErrors = [];
        setErrors([]);
        setSuccessMessage('');
        try {
            if (!displayName || !email || !password) {
                setErrors(['Please fill in all fields.']);
                return;
            }
    
            if (!isPasswordValid) {
                console.log('Password must be at least 6 characters long.');
                newErrors.push('Password must be at least 6 characters long.')
            }

            // Check for existing display name
            const collectionsSnapshot = await getDocs(collection(firestore, "users"));
            const collectionNames = collectionsSnapshot.docs.map((doc) => doc.id);
            const existingCollections = collectionNames.map((collectionName) => collectionName.toLowerCase());


            if (existingCollections.includes(displayName.toLowerCase())) {
                newErrors.push('Display name is already exists.')
            }
            if (newErrors.length > 0) {
                setErrors(newErrors);
                return;
            }
            // Proceed with account creation if display name is unique
            const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
            const user = userCredential.user;

            // Update user profile with display name
            await updateProfile(user, { displayName: displayName });

            // Create user document in Firestore
            const collectionsDocRef = doc(firestore, 'users', displayName.toLowerCase());
            await setDoc(collectionsDocRef, {});

            const collectionRef = collection(firestore, displayName.toLowerCase());
            const createDemoDocument = doc(collectionRef, "demo");
            await setDoc(createDemoDocument, {});

            setSuccessMessage('Signed up successfully!');
            setDisplayName('');
            setEmail('');
            setPassword('');
            // Redirect or show success message
        } catch (errors) {
            if (errors.code === 'auth/email-already-in-use') {
                newErrors.push('The email address is already in use.');
            }
                setErrors(newErrors);
                return;
        }
        
    };


    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="username"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);}}
                    autoComplete="new-password"
                />

                 {errors.map((error, index) => (
                    <p key={index} style={{ color: 'red' }}>{error}</p>
                ))}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Sign Up</button>
                
            </form>

        </div>
    );
};

export default SignUpForm;

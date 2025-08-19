import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { db } from './firebase'; // Make sure your firebase initialization is exported from here

const auth = getAuth();

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // You can access the user's information via result.user
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signInWithApple = async () => {
  const provider = new OAuthProvider('apple.com');
  try {
    const result = await signInWithPopup(auth, provider);
    // You can access the user's information via result.user
    return result.user;
  } catch (error) {
    console.error("Error signing in with Apple: ", error);
    throw error;
  }
};

    
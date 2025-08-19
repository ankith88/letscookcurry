
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { app } from './firebase'; // Make sure your firebase initialization is exported from here

const auth = getAuth(app);

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) must be authorized
  // in the Firebase Console.
  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/login`,
  // This must be true.
  handleCodeInApp: true,
};


export const doSendSignInLinkToEmail = async (email: string) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    console.error("Error sending sign in link: ", error);
    throw error;
  }
};

export const handleSignInWithEmailLink = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the email again. For example:
          email = window.prompt('Please provide your email for confirmation');
        }
        if (!email) return null;

        try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            return result.user;
        } catch (error) {
            console.error("Error signing in with email link: ", error);
            throw error;
        }
    }
    return null;
}

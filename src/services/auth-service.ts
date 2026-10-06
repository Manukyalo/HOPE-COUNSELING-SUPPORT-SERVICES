import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

/**
 * Maps raw Firebase auth errors to professional clinical messaging.
 */
export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address is improperly formatted.";
    case "auth/user-disabled":
      return "This practitioner account has been deactivated.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/too-many-requests":
      return "Access temporarily blocked due to repeated failed attempts. Please wait or reset password.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Authentication error. Please try again or use your PIN fallback.";
  }
}

/**
 * Sign in practitioner using email and password.
 */
export async function signInPractitioner(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

/**
 * Register practitioner account.
 */
export async function registerPractitioner(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

/**
 * Send password reset email.
 */
export async function resetPractitionerPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign out current practitioner session.
 */
export async function signOutPractitioner(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribes to real-time auth state changes.
 */
export function onPractitionerAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

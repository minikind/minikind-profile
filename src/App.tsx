import React, { useEffect, useState } from "react";
import { SignInForm } from "@minikind/core";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "./api/firebase";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        setAuthUser(user);
      } else {
        setIsSignedIn(false);
        setAuthUser(null);
      }

      setIsInitialized(true);
    });
  }, []);

  const handleSignInSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {}
  };

  if (!isInitialized) {
    return <div>Loading</div>;
  }

  if (!isSignedIn) {
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <div>
          <SignInForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSignInSubmit}
          />
        </div>
      </div>
      // <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      //   <div className="max-w-md w-full space-y-8">

      //   </div>
      // </div>
    );
  }

  return <div>Hello</div>;
}

export default App;

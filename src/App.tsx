import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Header,
  Input,
  Logo,
  SignInForm,
  Typography,
} from "@minikind/core";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth, db } from "./api/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { DISPLAY_NAME, USERS } from "./constants/db";

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!authUser) return;

    const userDoc = doc(db, USERS, authUser.uid);
    getDoc(userDoc).then((snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      setDisplayName(data[DISPLAY_NAME] ?? "");
    });
  }, [authUser]);

  const handleSignInSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {}
  };

  const handleSaveSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      if (!authUser || loading) {
        return;
      }
      setLoading(true);
      await updateDoc(doc(db, USERS, authUser.uid), {
        [DISPLAY_NAME]: displayName,
      });
      setLoading(false);
    } catch (e) {
      console.log("Error updating profile: ", e);
    }
  };

  if (!isInitialized) {
    return <div>Loading</div>;
  }

  if (!isSignedIn) {
    return (
      <Container>
        <SignInForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSignInSubmit}
        />
      </Container>
    );
  }

  return (
    <>
      <Header>
        <Logo />
      </Header>
      <Container>
        <Typography variant="h2">Update your profile</Typography>
        <Box
          as="form"
          spaceBetweenY={2}
          noValidate
          onSubmit={handleSaveSubmit}
          style={{ marginTop: 32 }}
        >
          <Input
            id="display-name"
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            label="Display Name"
          />
          <Button fullWidth type="submit" disabled={loading}>
            Save
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default App;

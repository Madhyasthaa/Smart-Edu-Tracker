import { useCallback, useEffect, useState } from "react";
import { RoleEnum } from "./common";
import { AdminPanel, StudentPanel, TeacherPanel } from "./screens";

function LoginForm({ updateLoginState }: { updateLoginState: () => void }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [wrongCreds, setWrongCreds] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", email);
        // console.log(data.token, data.role);
        setWrongCreds(false);
        updateLoginState();
      } else {
        setWrongCreds(true);
        setTimeout(() => setWrongCreds(false), 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setWrongCreds(true);
      setTimeout(() => setWrongCreds(false), 3000);
    }
  };

  return (
    <div className="items-center justify-center flex flex-col gap-7">
      <h1 className="text-4xl text-amber-900">Login to continue</h1>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="px-5 p-3 rounded-full text-2xl accent-amber-700"
      />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="px-5 p-3 rounded-full text-2xl accent-amber-700"
      />
      <button
        onClick={handleLogin}
        className="rounded-2xl bg-gradient-to-b from-amber-700 via-amber-900 text-white hover:via-amber-600 px-5 p-3 text-lg to-amber-800"
      >
        Sign In
      </button>
      {wrongCreds && (
        <p className="text-red-500">Wrong credentials, please try again!</p>
      )}
      <p>
        Based on your email address, you would be logged in as either admin,
        teacher or student.
      </p>
    </div>
  );
}

const ROLES_TO_PANELS: Record<RoleEnum, JSX.Element> = {
  a: <AdminPanel />,
  s: <StudentPanel />,
  t: <TeacherPanel />,
};

function App() {
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [role, setRole] = useState<RoleEnum>();
  const updateLoginState = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setHasLoggedIn(true);
    } else {
      return;
    }
    const role = localStorage.getItem("role");
    setRole(role as RoleEnum);
  }, []);

  const signOut = () => {
    setHasLoggedIn(false);
    setRole(undefined);
    localStorage.clear();
  };

  useEffect(() => {
    updateLoginState();
  }, [updateLoginState]);

  return (
    <div className="flex flex-col items-start justify-start h-screen bg-gradient-to-br from-orange-50 via-orange-300 to-orange-100 p-8 min-h-full">
      <div className="w-full justify-between flex flex-row">
        <div className="flex flex-row items-end gap-2">
          <h1 className="font-bold text-amber-700 text-5xl cursor-pointer animate-pulse">
            Paathshala
          </h1>
          <h5 className="font-bold text-amber-900 text-2xl cursor-pointer animate-pulse">
            for the next gen!
          </h5>
        </div>
        {hasLoggedIn && (
          <button
            onClick={signOut}
            className="rounded-xl bg-black text-white hover:bg-gray-800 px-4 p-2 text-sm font-semibold"
          >
            Log Out
          </button>
        )}
      </div>
      <div className="h-8" />
      {!hasLoggedIn && (
        // @ts-ignore
        <div className="text-white font-semibold text-lg bg-gradient-to-r p-2 rounded-xl animate-bounce from-amber-700 via-amber-950 to-amber-800">
          Created by: Nidhi R M (1JS20IS064), Sannidhi S (1JS20IS096),
          Shastishree Madhyastha (1JS20IS100) and Yashaswi B A (1JS20IS124)
        </div>
      )}
      <div className="h-4" />
      <div className="flex flex-1 flex-col justify-center items-center w-full">
        {hasLoggedIn && role ? (
          ROLES_TO_PANELS[role]
        ) : (
          <LoginForm updateLoginState={updateLoginState} />
        )}
      </div>
    </div>
  );
}

export default App;

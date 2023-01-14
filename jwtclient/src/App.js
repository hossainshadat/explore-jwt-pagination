import { useEffect } from "react";
import Login from "./Login";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;

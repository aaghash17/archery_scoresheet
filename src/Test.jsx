import { useState } from "react";
import App from "./firebase/firebaseConfig";
import { getDatabase, ref, set, push, get } from "firebase/database";

function Test() {
  //Write
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const handleInputChange1 = (e) => setInputValue1(e.target.value);
  const handleInputChange2 = (e) => setInputValue2(e.target.value);

  const saveData = async () => {
    const db = getDatabase(App);
    const newDocref = push(ref(db, "nature/fruit"));
    set(newDocref, {
      fruitName: inputValue1,
      fruitDef: inputValue2,
    })
      .then(() => {
        alert("DataSaved");
      })
      .catch((error) => {
        alert("error:", error.message);
      });
  };

  //Read
  let [fruitArray, setFruitArray] = useState([]);

  const fetchData = async () => {
    const db = getDatabase(App);
    const dbRef = ref(db, "nature/fruit");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      setFruitArray(Object.values(snapshot.val()));
    } else {
      alert("Error");
    }
  };

  return (
    <div>
      <h2>Write Test</h2>
      <input type="text" value={inputValue1} onChange={handleInputChange1} />
      <input type="text" value={inputValue2} onChange={handleInputChange2} />
      <button onClick={saveData}>SAVEDATA</button>
      <h2>Read Test</h2>
      <button onClick={fetchData}>Display Data</button>
      <ul>
        {fruitArray.map((item, index) => (
          <li key={index}>
            {item.fruitName}: {item.fruitDef}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;

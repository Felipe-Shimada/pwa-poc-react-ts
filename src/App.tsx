import { useEffect, useState } from "react";
import "./App.css";
import { addFish, fetchFish } from "./api/fishApi";
import { Fishing } from "./types/fishing";

function App() {
  const [newWeight, setNewWeight] = useState(0);
  const [fishingList, setFishingList] = useState<Fishing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFish();
      setFishingList(data);
    };

    fetchData();
  }, []);

  console.log(fishingList);

  const search = async (e: { key: string }) => {
    if (e.key === "Enter") {
      const data = await addFish({
        date: new Date().toISOString(),
        weight: newWeight,
      });
      setFishingList([...fishingList, data]);
    }
  };

  return (
    <div className="App">
      <input
        type="number"
        placeholder="Peso"
        value={newWeight}
        onChange={(e) => setNewWeight(Number(e.target.value))}
        onKeyDown={search}
      />
    </div>
  );
}

export default App;

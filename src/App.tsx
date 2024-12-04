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

  const search = async (e: { key: string }) => {
    if (e.key === "Enter") {
      const newFish = {
        date: new Date().toISOString(),
        weight: newWeight,
      };

      try {
        const addedFish = await addFish(newFish);
        setFishingList((prev) => [...prev, addedFish]);
      } catch (error) {
        console.error("Erro ao adicionar peixe:", error);
      }

      setNewWeight(0);
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <label htmlFor="newWeight">Peso</label>
        <input
          type="number"
          placeholder="Peso"
          value={newWeight}
          onChange={(e) => setNewWeight(Number(e.target.value))}
          onKeyDown={search}
        />
      </div>

      <div style={{ padding: "10px", textAlign: "center" }}>
        <h3>Lista de Pesos</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {fishingList.map((fishing) => (
            <li
              key={fishing.id}
              style={{
                padding: "8px",
                margin: "5px auto",
                maxWidth: "300px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <strong>Data:</strong>{" "}
              {new Date(fishing.date).toLocaleDateString()} <br />
              <strong>Peso:</strong> {fishing.weight} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import { Fishing } from "./types/fishing";
import generatePDF from "./services/reportGenerator";

import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

initializeFirestore(app, { localCache: persistentLocalCache() });

function App() {
  const [newWeight, setNewWeight] = useState(0);
  const [fishingList, setFishingList] = useState<Fishing[]>([]);

  const db = getFirestore(app);
  const fishingCollectionRef = collection(db, "fishing");

  useEffect(() => {
    console.log("Setting up Firestore listener...");

    const unsubscribe = onSnapshot(
      fishingCollectionRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const updatedFishingList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Fishing[];

        setFishingList(updatedFishingList);

        const source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log(`Fishing data came from ${source}`);
      }
    );

    return () => {
      console.log("Cleaning up Firestore listener...");
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (e: { key: string }) => {
    if (e.key === "Enter") {
      const newFish = {
        date: new Date().toISOString(),
        weight: newWeight,
      };

      try {
        await addDoc(fishingCollectionRef, newFish);
        setNewWeight(0);
      } catch (error) {
        console.error("Erro ao adicionar pescaria:", error);
      }
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

        <button onClick={() => generatePDF(fishingList)}>
          Gerar Relatório PDF
        </button>
      </div>
    </div>
  );
}

export default App;

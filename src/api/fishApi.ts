import axios from "axios";
import { Fishing } from "../types/fishing";

const API_URL = process.env.REACT_APP_MOCK_API_URL + "/fishing";

export const fetchFish = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const addFish = async (data: Partial<Fishing>) => {
  try {
    const { data: newFish } = await axios.post(API_URL, {
      date: data.date,
      weight: data.weight,
    });
    return newFish;
  } catch (error: any) {
    if (
      !navigator.onLine ||
      error.message.includes("Network Error") ||
      error.code === "ERR_NETWORK"
    ) {
      console.warn(
        "Você está offline. O item será adicionado localmente e enviado quando a internet voltar."
      );

      const tempId = crypto.randomUUID();

      return {
        id: tempId,
        date: data.date,
        weight: data.weight,
      };
    }

    throw error;
  }
};

import axios from "axios";
import { Fishing } from "../types/fishing";

const API_URL = process.env.REACT_APP_MOCK_API_URL + "/fishing";

export const fetchFish = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const addFish = async (data: Partial<Fishing>) => {
  const { data: newFish } = await axios.post(API_URL, {
    date: data.date,
    weight: data.weight,
  });

  return newFish;
};

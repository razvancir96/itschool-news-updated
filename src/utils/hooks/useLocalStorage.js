import { useState } from "react";

export function useLocalStorage(key, value) {
  const localStorageItem = localStorage.getItem(key);
  const initialState = JSON.parse(localStorageItem) || value;
  const [state, setState] = useState(initialState);

  function setStateAndLocalStorage(value) {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  }

  return [state, setStateAndLocalStorage];
}

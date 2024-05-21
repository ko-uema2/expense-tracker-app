/**
 * Represents the data structure for token and credentials.
 */
type Data = {
  token: string;
  credentials: string;
};

type DataKey = keyof Data;

/**
 * Custom hook for reading, writing, and removing data from local storage.
 * @param key - The key to identify the data in local storage.
 * @returns An object with read, write, and remove functions.
 */
export const useLocalStorage = <Key extends DataKey>(key: Key) => {
  return {
    /**
     * Reads the data from local storage.
     * @returns The data stored in local storage, or null if the data does not exist.
     */
    read: (): Data[Key] | null => {
      const value = localStorage.getItem(key);
      if (!value) {
        return null;
      }

      return value;
    },

    /**
     * Writes the data to local storage.
     * @param data - The data to be stored in local storage.
     */
    write: (data: Data[Key]) => {
      typeof data === "string"
        ? localStorage.setItem(key, data)
        : localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Removes the data from local storage.
     */
    remove: (): void => localStorage.removeItem(key),
  };
};

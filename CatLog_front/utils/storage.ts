import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async <T>(key: string, value: T) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (err) {
    console.error(err);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      console.log("Stored data:", JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
    console.log("No data found");
    return null;
  } catch (e) {
    console.error("Error reading value:", e);
  }
};

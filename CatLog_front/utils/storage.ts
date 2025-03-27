import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async <T>(key: string, value: T) => {
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
      console.log(JSON.parse(jsonValue));
      return JSON.parse(jsonValue);
    }
    console.log(key + " 데이터가 없습니다.");
    return null;
  } catch (err) {
    console.error(err);
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("데이터가 삭제되었습니다.");
  } catch (err) {
    console.error(err);
  }
};

import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyCat() {
  const [catName, setCatName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [owner, setOwner] = useState("");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getData("userData");
      setToken(userData?.accessToken || null);
    };
    fetchUserData();
  }, []);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleChange = (event: object, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await apiRequest(
        "cat",
        "POST",
        {
          name: catName,
          birthDate: formatDate(birthDate),
          owner: (await getData("userData"))?.userId,
        },
        token || undefined,
      );

      if (data) {
        console.log("고양이가 등록되었습니다:", data);
        router.back();
      }
    } catch (error) {
      console.error("고양이 등록 실패:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="mx-6 ">
        <View className="flex flex-row items-center mt-2 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="items-center flex-1 mr-7">
            <Text className="text-xl font-semibold">고양이 추가</Text>
          </View>
        </View>
        <View className="mt-6 mb-2">
          <Text className="mb-4 font-bold">이름</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="이름을 입력해주세요"
            value={catName}
            onChangeText={setCatName}
          />
        </View>
        <Text className="mb-4 font-bold">생일</Text>

        <TextInput
          className="p-4 border-2 border-[#ddd] rounded-xl"
          placeholder={formatDate(birthDate)}
          value={formatDate(birthDate)}
          onFocus={() => {
            setShow(true);
          }}
          onChangeText={() => {}}
        />

        <View>
          {show && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
        </View>
        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={handleSubmit}>
            <Text className="text-snow">확인</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

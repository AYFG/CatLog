import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyCat() {
  const queryClient = useQueryClient();
  const [catName, setCatName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [show, setShow] = useState(false);
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

  const mutation = useMutation({
    mutationFn: async (newCat: CatData) => {
      const userData = await getData("userData");
      return apiRequest("cat", "POST", newCat, userData?.accessToken || "");
    },
    onSuccess: (data) => {
      console.log("고양이가 등록되었습니다:", data);
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      router.back();
    },
    onError: (error) => {
      console.error("고양이 등록 실패:", error);
    },
  });

  const handleSubmit = async () => {
    const userData = await getData("userData");
    mutation.mutate({
      name: catName,
      birthDate: formatDate(birthDate),
      owner: userData?.userId || "",
    });
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
            onChangeText={(text) => setCatName(text)}
            value={catName}
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
          <Pressable onPress={handleSubmit} disabled={mutation.isPending}>
            <Text className="text-snow">{mutation.isPending ? "처리 중..." : "확인"}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

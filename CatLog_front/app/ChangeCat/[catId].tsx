import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CatData } from "@/types/cat";

export default function ChangeCat() {
  const { catId, nameParams, birthDay } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [catName, setCatName] = useState(nameParams as CatData["name"]);
  const [birthDate, setBirthDate] = useState(birthDay as CatData["birthDate"]);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getData("userData");
      setUserData(data);
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    if (userData) {
      setToken(userData.accessToken || null);
    }
  }, [userData]);
  const formatDate = (date: string) => date?.split("T")[0];

  const handleChange = (event: object, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setBirthDate(selectedDate.toISOString());
    }
  };

  const mutation = useMutation({
    mutationFn: async (updateCat: { name: CatData["name"]; birthDate: CatData["birthDate"] }) => {
      const userData = await getData("userData");
      return apiRequest(`cat/${catId}`, "PUT", updateCat, token || "");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cats"], refetchType: "all" });
      router.back();
    },
    onError: (error) => {
      console.error("고양이 등록 실패:", error);
    },
  });

  const validate = () => {
    if (catName === "") {
      newErrors.name = "이름을 입력해주세요";
    }

    if (birthDate === "") {
      newErrors.birthDate = "생일을 입력해주세요";
    }

    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const userData = await getData("userData");
    mutation.mutate({
      name: catName,
      birthDate: formatDate(birthDate),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="mx-6 ">
        <View className="flex flex-row items-center mt-8 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="items-center flex-1 mr-7">
            <Text className="text-xl font-semibold">반려묘 정보 수정</Text>
          </View>
        </View>
        <View className="mt-6 mb-2">
          <Text className="mb-4 font-bold">이름</Text>
          <TextInput
            className={`p-4 border-2 ${
              checkValidation.name ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder="이름을 입력해주세요"
            onChangeText={(text) => setCatName(text)}
            value={catName}
          />
          {checkValidation.name && <Text className="text-[#ff0000]">{checkValidation.name}</Text>}
        </View>
        <Text className="mb-4 font-bold">생일</Text>

        <TextInput
          className={`p-4 border-2 ${
            checkValidation.birthDate ? `border-[#ff0000]` : `border-[#ddd]`
          } rounded-xl`}
          placeholder={formatDate(birthDate)}
          value={formatDate(birthDate)}
          onFocus={() => {
            setShow(true);
          }}
          onChangeText={() => {}}
        />
        {checkValidation.birthDate && (
          <Text className="text-[#ff0000]">{checkValidation.birthDate}</Text>
        )}

        <View>
          {show && (
            <DateTimePicker
              value={new Date(birthDate)}
              mode="date"
              display="default"
              onChange={handleChange}
            />
          )}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={mutation.isPending}
          android_ripple={{ color: "#f5d4e0" }}
          className="flex items-center justify-center p-4 mt-10 rounded-lg bg-wePeep h-14"
        >
          <Text className="text-snow">
            {mutation.isPending ? <ActivityIndicator size="large" color="#c9e6ee" /> : "확인"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

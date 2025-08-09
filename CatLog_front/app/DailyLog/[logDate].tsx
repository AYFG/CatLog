import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import { DailyLogData } from "@/types/dailyLog";
import { CatData } from "@/types/cat";
import BackButton from "@/components/button/BackButton";
cssInterop(Ionicons, { className: "style" });

export default function DailyLog() {
  const router = useRouter();
  const {
    catIdParams,
    catNameParams,
    logDate,
    defecationParams,
    vitaminParams,
    weightParams,
    etcParams,
  } = useLocalSearchParams<{
    catIdParams: string;
    catNameParams: string;
    logDate: string;
    defecationParams: string;
    vitaminParams: string;
    weightParams: string;
    etcParams: string;
  }>();

  const [token, setToken] = useState("");
  const [defecation, setDefecation] = useState<boolean>(
    defecationParams === "false" ? false : true,
  );
  const [vitamin, setVitamin] = useState<boolean>(vitaminParams === "false" ? false : true);
  const [weight, setWeight] = useState(weightParams || "");
  const [etc, setEtc] = useState(etcParams || "");
  const [selectedCat, setSelectedCat] = useState({
    name: catNameParams || "",
    id: catIdParams || "",
  });
  const pickerRef = useRef<Picker<{ name: string; id: string }>>(null);
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};
  const { cats } = useCatStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const userData = getData("userData");
    userData.then((data) => {
      if (data) {
        setToken(data.accessToken);
      }
    });
  }, []);

  function open() {
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  }

  function close() {
    if (pickerRef.current) {
      pickerRef.current.blur();
    }
  }

  const mutation = useMutation({
    mutationFn: (dailyLog: DailyLogData) =>
      apiRequest(`dailyLog/${selectedCat.id}`, "POST", dailyLog, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dailyLog"], refetchType: "all" });
      router.back();
    },
  });
  const handleWeightInput = (text: string) => {
    const formatted = text.replace(/[^0-9.]/g, "");
    const parts = formatted.split(".");
    if (parts.length > 2) return;
    setWeight(formatted);
  };
  const validate = () => {
    if (selectedCat.name == "") {
      newErrors.name = "기록할 반려묘를 선택해주세요.";
    }

    if (!weight || weight === "0") {
      newErrors.weight = "반려묘의 체중을 기록해주세요";
    }

    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    mutation.mutate({
      cat: { catId: selectedCat.id, catName: selectedCat.name },
      defecation: defecation,
      vitamin: vitamin,
      weight: weight,
      logDate: logDate,
      etc: etc,
    });
  };

  return (
    <ScrollView className="flex-1 bg-snow">
      <View className="mx-6 mt-2 ">
        <SafeAreaView className="flex flex-row items-center mt-8 mb-6">
          <BackButton />
          <View className="items-center flex-1 mr-7">
            <Text className="text-xl font-bold ">{logDate}</Text>
            <Text className="text-xl font-bold "> 건강 기록</Text>
          </View>
        </SafeAreaView>

        <View className="mb-2">
          <Text className="mb-4 font-bold">기록할 반려묘</Text>
          <View
            className={`flex flex-row items-center  justify-between p-4 border-2 ${
              checkValidation.name ? `border-[#ff0000]` : ` border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="w-full text-xl"
              placeholder="반려묘를 선택해주세요"
              placeholderTextColor="#777777"
              value={catNameParams || selectedCat.name}
              onFocus={() => {
                open();
              }}
            />

            <Picker
              ref={pickerRef}
              selectedValue={selectedCat}
              onValueChange={(value: { name: string; id: string }) => setSelectedCat(value)}
            >
              {cats?.map((cat: CatData) => (
                <Picker.Item
                  key={cat._id}
                  label={cat.name}
                  value={{ name: cat.name, id: cat._id }}
                />
              ))}
            </Picker>
          </View>
          {checkValidation.name && <Text className="text-[#ff0000]">{checkValidation.name}</Text>}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">대변 상태</Text>

          <Pressable
            className={`border-[#ddd] border-2 p-4 rounded-lg ${
              defecation ? "bg-[#62ca4d]" : "bg-[#ff0000]"
            }`}
            onPress={() => {
              setDefecation(!defecation);
            }}
          >
            <View>
              {defecation ? (
                <View className="flex flex-row items-center ">
                  <Ionicons name="checkmark-circle-outline" size={24} className="text-snow" />
                  <Text className="ml-2 font-bold text-snow">좋았어요</Text>
                </View>
              ) : (
                <View className="flex flex-row items-center">
                  <Ionicons name="close-circle-outline" size={24} className=" text-snow" />
                  <Text className="ml-2 font-bold text-snow">좋지 않았어요</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">영양제</Text>
          <Pressable
            className={`border-[#ddd] border-2 p-4 rounded-lg ${
              vitamin ? "bg-[#62ca4d]" : "bg-[#ff0000]"
            }`}
            onPress={() => {
              setVitamin(!vitamin);
            }}
          >
            <View>
              {vitamin ? (
                <View className="flex flex-row items-center ">
                  <Ionicons name="checkmark-circle-outline" size={24} className="text-snow" />
                  <Text className="ml-2 font-bold text-snow">먹었어요</Text>
                </View>
              ) : (
                <View className="flex flex-row items-center">
                  <Ionicons name="close-circle-outline" size={24} className=" text-snow" />
                  <Text className="ml-2 font-bold text-snow">안먹었어요</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        <Text className="mb-4 font-bold ">체중</Text>
        <View
          className={` p-4 border-2 ${
            checkValidation.weight ? `border-[#ff0000]` : ` border-[#ddd]`
          } rounded-xl`}
        >
          <View className="flex flex-row w-full">
            <TextInput
              className="w-1/4 pl-5 text-xl border-b-2"
              placeholder="예: 4.5"
              placeholderTextColor="#777777"
              value={weight.toString()}
              keyboardType="numeric"
              maxLength={4}
              onChangeText={handleWeightInput}
            />
            <Text className="mt-2 ml-2 font-bold">kg</Text>
          </View>
        </View>
        {checkValidation.weight && <Text className="text-[#ff0000]">{checkValidation.weight}</Text>}

        <View className="mb-2">
          <Text className="mb-4 font-bold">기타 특이사항</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="다른 특이사항을 적어보세요"
            placeholderTextColor="#777777"
            className="py-4 pl-6 border-2 border-[#ddd] rounded-xl text-lg"
            value={etc}
            onChangeText={setEtc}
          />
        </View>

        <Pressable
          android_ripple={{ color: "#f5d4e0" }}
          className="flex items-center justify-center p-4 mt-10 rounded-lg h-15 bg-wePeep"
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator size="large" color="#c9e6ee" />
          ) : (
            <Text className="text-lg text-snow">저장하기</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

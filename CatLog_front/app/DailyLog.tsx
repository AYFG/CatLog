import { useCatStore } from "@/store/useCatStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/splash-Image.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";

export default function DailyLog() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [defecation, setDefecation] = useState(true);
  const [vitaminTime, setVitaminTime] = useState<Date>(new Date());
  const [weight, setWeight] = useState(0);
  const [etc, setEtc] = useState("");
  const [logDate, setLogDate] = useState("2024-04-15");
  const [show, setShow] = useState(false);
  const [selectedCat, setSelectedCat] = useState({ name: "", id: "" });
  const pickerRef = useRef<Picker<{ name: string; id: string }>>(null);
  const { cats } = useCatStore();
  const queryClient = useQueryClient();
  const formattedTime = vitaminTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  console.log(formattedTime);

  console.log(selectedCat.name);
  useEffect(() => {
    const userData = getData("userData");
    userData.then((data) => {
      if (data) {
        setToken(data.accessToken);
      }
    });
  }, []);

  const handleTimeInput = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setVitaminTime(selectedDate);
    }
  };

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
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      router.back();
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      cat: { catId: selectedCat.id, catName: selectedCat.name },
      defecation: defecation,
      vitamin: vitaminTime,
      weight: weight,
      logDate: logDate,
      etc: etc,
    });
  };

  return (
    <ScrollView className="flex-1 bg-snow">
      <View className="mx-6">
        <SafeAreaView className="flex flex-row items-center mt-2 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="items-center flex-1 mr-7">
            <Image className="" source={logo} style={{ width: 60, height: 60 }} />
          </View>
        </SafeAreaView>

        <View className="mb-8">
          <Text className="mb-4 text-xl font-bold">데일리로그</Text>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">기록할 반려묘</Text>
          <View className="flex flex-row items-center  justify-between p-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-full"
              placeholder="반려묘를 선택해주세요"
              value={selectedCat.name}
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
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">대변 상태</Text>
          <View className="flex flex-row items-center justify-center gap-24 p-4 border-2 border-[#ddd] rounded-xl">
            <Pressable
              className={`p-4 border rounded-lg ${defecation ? "bg-wePeep" : ""}`}
              onPress={() => {
                setDefecation(true);
              }}
            >
              <Text>좋았어요</Text>
            </Pressable>
            <Pressable
              className={`p-4 border rounded-lg ${!defecation ? "bg-wePeep" : ""}`}
              onPress={() => {
                setDefecation(false);
              }}
            >
              <Text>좋지 않았어요</Text>
            </Pressable>
          </View>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">영양제</Text>
          <TextInput
            className="py-4 pl-6 border-2 border-[#ddd] rounded-xl"
            placeholder="이름을 입력해주세요"
            value={formattedTime}
            onFocus={() => {
              setShow(true);
            }}
            onChangeText={() => {}}
          />
          <View>
            {show && (
              <DateTimePicker
                value={vitaminTime}
                mode="time"
                display="spinner"
                onChange={handleTimeInput}
              />
            )}
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">체중</Text>
          <TextInput
            className="py-4 pl-6 border-2 border-[#ddd] rounded-xl"
            placeholder=""
            value={weight.toString()}
            onChangeText={(text) => setWeight(Number(text))}
          />
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">기타 특이사항</Text>
          <TextInput
            className="py-4 pl-6 border-2 border-[#ddd] rounded-xl"
            placeholder=""
            value={etc}
            onChangeText={setEtc}
          />
        </View>

        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={handleSubmit}>
            <Text className="text-snow">저장하기</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

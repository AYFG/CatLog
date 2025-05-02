import SubmitButton from "@/components/SubmitButton";
import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  console.log(catNameParams, typeof defecationParams, vitaminParams, weightParams, etcParams);
  const [token, setToken] = useState("");
  const [defecation, setDefecation] = useState<boolean>(defecationParams === "true" || true);
  const [vitaminTime, setVitaminTime] = useState<Date>(new Date());
  const [weight, setWeight] = useState(weightParams || "");
  const [etc, setEtc] = useState(etcParams || "");
  const [show, setShow] = useState(false);
  const [selectedCat, setSelectedCat] = useState({
    name: catNameParams || "",
    id: catIdParams || "",
  });
  const pickerRef = useRef<Picker<{ name: string; id: string }>>(null);
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};
  const { cats } = useCatStore();
  const queryClient = useQueryClient();

  const formattedTime = vitaminTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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
    if (!vitaminTime) {
      newErrors.vitaminTime = "반려묘의 영양제 먹은 시간을 기록해주세요";
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
      vitamin: formattedTime,
      weight: weight,
      logDate: logDate,
      etc: etc,
    });
  };

  return (
    <ScrollView className="flex-1 bg-snow">
      <View className="mx-6 mt-2 ">
        <SafeAreaView className="flex flex-row items-center mt-8 mb-6">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
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
              className="w-full"
              placeholder="반려묘를 선택해주세요"
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
          <View className="flex flex-row items-center justify-center gap-24 p-4 border-2 border-[#ddd] rounded-xl">
            <Pressable
              className={`border-[#ddd] border-2 p-4 rounded-lg ${
                defecation ? " bg-prelude " : ""
              }`}
              onPress={() => {
                setDefecation(true);
              }}
            >
              <Text className={`${defecation && "text-snow font-extrabold"}`}>좋았어요</Text>
            </Pressable>
            <Pressable
              className={`border-[#ddd] border-2 p-4 rounded-lg ${
                !defecation ? " bg-prelude " : ""
              }`}
              onPress={() => {
                setDefecation(false);
              }}
            >
              <Text className={`${!defecation && "text-snow font-extrabold"}`}>좋지 않았어요</Text>
            </Pressable>
          </View>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">영양제</Text>
          <TextInput
            className={`flex flex-row items-center  justify-between p-4 border-2 ${
              checkValidation.vitaminTime ? `border-[#ff0000]` : ` border-[#ddd]`
            } rounded-xl`}
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
          {checkValidation.vitaminTime && (
            <Text className="text-[#ff0000]">{checkValidation.vitaminTime}</Text>
          )}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">체중</Text>
          <TextInput
            className={`flex flex-row items-center  justify-between p-4 border-2 ${
              checkValidation.weight ? `border-[#ff0000]` : ` border-[#ddd]`
            } rounded-xl`}
            placeholder={weight.toString()}
            value={weight.toString()}
            keyboardType="numeric"
            onChangeText={handleWeightInput}
          />
          {checkValidation.weight && (
            <Text className="text-[#ff0000]">{checkValidation.weight}</Text>
          )}
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

        <Pressable
          className="flex items-center p-4 mt-10 rounded-lg bg-wePeep"
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <View className="">
              <ActivityIndicator size="large" color="#c9e6ee" />
            </View>
          ) : (
            <Text className="text-lg text-snow">저장하기</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

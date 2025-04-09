import { useCatStore } from "@/store/useCatStore";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/splash-Image.png";

export default function MedicalLog() {
  const router = useRouter();
  const { cats } = useCatStore();
  const queryClient = useQueryClient();
  const pickerRef = useRef<Picker<{ name: string; id: string }>>(null);
  const [token, setToken] = useState("");

  const [selectedCat, setSelectedCat] = useState({ name: "", id: "" });

  const [healthCheckupDate, setHealthCheckupDate] = useState(new Date());
  console.log(healthCheckupDate.toISOString().split("T")[0]);
  const [healthCycle, setHealthCycle] = useState(0);
  const [healthCalendar, setHealthCalendar] = useState(false);

  const [heartWorm, setHeartWorm] = useState(new Date());
  console.log(heartWorm.toISOString().split("T")[0]);
  const [heartWormCycle, setHeartWormCycle] = useState(0);
  const [heartWormCalendar, setHeartWormCalendar] = useState(false);

  useEffect(() => {
    const userData = getData("userData");
    userData.then((data) => {
      if (data) {
        setToken(data.accessToken);
      }
    });
  }, []);

  const healthCheckUpInput = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setHealthCalendar(false);
    if (selectedDate) {
      setHealthCheckupDate(selectedDate);
    }
  };

  const heartWormInput = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setHeartWormCalendar(false);
    if (selectedDate) {
      setHeartWorm(selectedDate);
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
    mutationFn: (medicalLog: MedicalLogData) =>
      apiRequest(`medicalLog/${selectedCat.id}`, "POST", medicalLog, token),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      router.back();
    },
  });
  console.log(selectedCat.name);
  const handleSubmit = () => {
    mutation.mutate({
      cat: { catId: selectedCat.id, catName: selectedCat.name },
      healthCheckupDate: healthCheckupDate.toISOString().split("T")[0],
      healthCycle: healthCycle,
      heartWorm: heartWorm.toISOString().split("T")[0],
      heartWormCycle: heartWormCycle,
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
          <Text className="mb-4 text-xl font-bold">메디컬 로그</Text>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">기록할 반려묘</Text>
          <View className="flex flex-row items-center pl-4 border-2 border-[#ddd] rounded-xl">
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
          <Text className="mb-4 font-bold">건강검진 다녀온 날</Text>
          <View className="flex flex-row items-center pl-4 py-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className=""
              value={healthCheckupDate.toISOString().split("T")[0]}
              onFocus={() => {
                setHealthCalendar(true);
              }}
              onChangeText={() => {}}
            />
            {healthCalendar && (
              <RNDateTimePicker
                value={healthCheckupDate}
                mode="date"
                display="calendar"
                onChange={healthCheckUpInput}
              />
            )}
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">건강검진 주기</Text>
          <View className="flex flex-row items-center pl-4 py-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-full"
              placeholder="몇 일 뒤에 건강검진을 갈지 작성해주세요"
              keyboardType="number-pad"
              value={healthCycle.toString()}
              onChangeText={(cycle) => {
                setHealthCycle(parseInt(cycle) || 0);
              }}
              maxLength={3}
            />
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">심장사상충 약</Text>
          <View className="flex flex-row items-center pl-4 py-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              value={heartWorm.toISOString().split("T")[0]}
              onFocus={() => {
                setHeartWormCalendar(true);
              }}
              onChangeText={() => {}}
            />
            {heartWormCalendar && (
              <RNDateTimePicker
                value={heartWorm}
                mode="date"
                display="calendar"
                onChange={heartWormInput}
              />
            )}
          </View>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">심장사상충 약 주기</Text>
          <View className="flex flex-row items-center pl-4 py-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-full"
              placeholder="몇 일 뒤에 심장사상충 약을 도포할지 작성해주세요"
              keyboardType="number-pad"
              value={heartWormCycle.toString()}
              onChangeText={(cycle) => setHeartWormCycle(Number(cycle) || 0)}
              maxLength={3}
            />
          </View>
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

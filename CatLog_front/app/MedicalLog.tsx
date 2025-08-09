import BackButton from "@/components/button/BackButton";
import { useCatStore } from "@/store/useCatStore";
import { CatData } from "@/types/cat";
import { MedicalLogData } from "@/types/medicalLog";
import { apiRequest } from "@/utils/fetchApi";
import {
  healthCheckupNotificationHandler,
  heartwormNotificationHandler,
} from "@/utils/notifications";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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

export default function MedicalLog() {
  const router = useRouter();
  const { cats } = useCatStore();
  const queryClient = useQueryClient();
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const newErrors: { [key: string]: string } = {};

  const {
    catId,
    nameParams,
    healthDateParams,
    healthCycleParams,
    heartWormParams,
    heartWormCycleParams,
  } = useLocalSearchParams();

  const pickerRef = useRef<Picker<{ name: string; id: string }>>(null);
  const [token, setToken] = useState("");

  const [selectedCat, setSelectedCat] = useState({
    name: (nameParams && nameParams.toString()) || "",
    id: (catId && catId.toString()) || "",
  });

  const [healthCheckupDate, setHealthCheckupDate] = useState(
    (healthDateParams && new Date(healthDateParams.toString())) || new Date(),
  );
  const [healthCycle, setHealthCycle] = useState(
    (healthCycleParams && healthCycleParams.toString()) || "",
  );
  const [healthDatePickerOpen, setHealthDatePickerOpen] = useState(false);

  const [heartWorm, setHeartWorm] = useState(
    (heartWormParams && new Date(heartWormParams.toString())) || new Date(),
  );
  const [heartWormCycle, setHeartWormCycle] = useState(
    (heartWormCycleParams && heartWormCycleParams.toString()) || "",
  );
  const [heartWormDatePickerOpen, setHeartWormDatePickerOpen] = useState(false);

  useEffect(() => {
    const userData = getData("userData");
    userData.then((data) => {
      if (data) {
        setToken(data.accessToken);
      }
    });
  }, []);

  const healthCheckUpInput = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setHealthDatePickerOpen(false);
    if (selectedDate) {
      setHealthCheckupDate(selectedDate);
    }
  };

  const heartWormInput = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setHeartWormDatePickerOpen(false);
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
      queryClient.invalidateQueries({ queryKey: ["cats"] });
      router.back();
    },
  });
  const validate = () => {
    if (selectedCat.name === "") {
      newErrors.name = "기록할 반려묘를 선택해주세요.";
    }
    if (!healthCheckupDate) {
      newErrors.healthCheckupDate = "건강검진 다녀온 날을 입력해주세요.";
    }
    if (!healthCycle || healthCycle === "0") {
      newErrors.healthCycle = "다음 건강검진을 갈 주기를 입력해주세요.";
    }
    if (!heartWorm) {
      newErrors.heartWorm = "약을 바른 날을 입력해주세요.";
    }
    if (!heartWormCycle || heartWormCycle === "0") {
      newErrors.heartWormCycle = "다음 심장사상충 약을 바를 주기를 입력해주세요.";
    }
    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    mutation.mutate({
      cat: { catId: selectedCat.id, catName: selectedCat.name.toString() },
      healthCheckupDate: healthCheckupDate.toISOString().split("T")[0],
      healthCycle: healthCycle,
      heartWorm: heartWorm.toISOString().split("T")[0],
      heartWormCycle: heartWormCycle,
    });
    healthCheckupNotificationHandler(healthCheckupDate, healthCycle, selectedCat.name);
    heartwormNotificationHandler(heartWorm, heartWormCycle, selectedCat.name.toString());
  };

  return (
    <ScrollView className="flex-1 bg-snow">
      <View className="mx-6">
        <SafeAreaView className="flex flex-row items-center mt-8 mb-6">
          <BackButton />
          <View className="items-center flex-1 mr-7">
            <Text className="mb-4 text-xl font-bold">메디컬 로그</Text>
          </View>
        </SafeAreaView>

        <View className="mb-2">
          <Text className="mb-4 font-bold">기록할 반려묘</Text>
          <View
            className={`flex flex-row items-center pl-4 py-4 border-2 ${
              checkValidation.name ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="w-full text-xl"
              placeholder="반려묘를 선택해주세요"
              placeholderTextColor="#777777"
              value={selectedCat.name.toString()}
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
          <Text className="mb-4 font-bold">건강검진 다녀온 날</Text>
          <View
            className={`flex flex-row items-center pl-4 py-4 border-2 ${
              checkValidation.healthCheckupDate ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="text-xl"
              placeholder={healthCheckupDate.toISOString().split("T")[0]}
              placeholderTextColor="#777777"
              value={healthCheckupDate.toISOString().split("T")[0]}
              onFocus={() => {
                setHealthDatePickerOpen(true);
              }}
            />
            {healthDatePickerOpen && (
              <RNDateTimePicker
                value={healthCheckupDate}
                mode="date"
                display="calendar"
                onChange={healthCheckUpInput}
              />
            )}
          </View>
          {checkValidation.healthCheckupDate && (
            <Text className="text-[#ff0000]">{checkValidation.healthCheckupDate}</Text>
          )}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">건강검진 주기</Text>
          <View
            className={`flex flex-row items-center pl-4 py-4 border-2 ${
              checkValidation.healthCycle ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="w-1/4 pl-5 text-xl border-b-2"
              placeholder="예: 120"
              placeholderTextColor="#777777"
              keyboardType="number-pad"
              value={healthCycle.toString()}
              onChangeText={(cycle) => {
                setHealthCycle(cycle);
              }}
              maxLength={3}
            />
            <Text className="mt-2 ml-2 font-bold">일 후에 건강검진 갈게요</Text>
          </View>
          {checkValidation.healthCycle && (
            <Text className="text-[#ff0000]">{checkValidation.healthCycle}</Text>
          )}
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">심장사상충 약</Text>
          <View
            className={`flex flex-row items-center pl-4 py-4 border-2 ${
              checkValidation.heartWorm ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="text-xl"
              placeholder={heartWorm.toISOString().split("T")[0]}
              placeholderTextColor="#777777"
              value={heartWorm.toISOString().split("T")[0]}
              onFocus={() => {
                setHeartWormDatePickerOpen(true);
              }}
              onChangeText={() => {}}
            />

            {heartWormDatePickerOpen && (
              <RNDateTimePicker
                value={heartWorm}
                mode="date"
                display="calendar"
                onChange={heartWormInput}
              />
            )}
          </View>
          {checkValidation.heartWorm && (
            <Text className="text-[#ff0000]">{checkValidation.heartWorm}</Text>
          )}
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold ">심장사상충 약 주기</Text>
          <View
            className={`flex flex-row items-center pl-4 py-4 border-2 ${
              checkValidation.heartWormCycle ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
          >
            <TextInput
              className="w-1/4 pl-5 text-xl border-b-2"
              keyboardType="number-pad"
              value={heartWormCycle.toString()}
              placeholder="예: 30"
              placeholderTextColor="#777777"
              onChangeText={(cycle) => setHeartWormCycle(cycle || "")}
              maxLength={4}
            />
            <Text className="mt-2 ml-2 font-bold">일 후에 심장사상충 약 바를게요</Text>
          </View>
          {checkValidation.heartWormCycle && (
            <Text className="text-[#ff0000]">{checkValidation.heartWormCycle}</Text>
          )}
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={mutation.isPending}
          className="flex items-center justify-center h-16 p-4 mt-10 rounded-lg bg-wePeep"
          android_ripple={{ color: "#f5d4e0" }}
        >
          <Text className="text-xl text-snow">
            {mutation.isPending ? <ActivityIndicator size="large" color="#c9e6ee" /> : "저장하기"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

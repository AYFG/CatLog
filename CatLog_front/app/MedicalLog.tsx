import { useCatStore } from "@/store/useCatStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/splash-Image.png";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function MedicalLog() {
  const router = useRouter();
  const { cats } = useCatStore();
  const pickerRef = useRef<Picker<string> | null>(null);

  const [selectedCat, setSelectedCat] = useState<string | undefined>();

  const [healthCheckupDate, setHealthCheckupDate] = useState(new Date());
  const [healthCycle, setHealthCycle] = useState(0);
  const [healthCalendar, setHealthCalendar] = useState(false);

  const [heartWorm, setHeartWorm] = useState(new Date());
  const [heartWormCycle, setHeartWormCycle] = useState(0);
  const [heartWormCaledar, setHeartWormCalendar] = useState(false);

  const [memo, setMemo] = useState("");

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
          <View className="flex flex-row items-center  pl-2 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-1/2"
              placeholder="반려묘를 선택해주세요"
              value={selectedCat}
              onChangeText={(cat) => setSelectedCat(cat)}
              onFocus={() => {
                open();
              }}
            />

            <Picker
              ref={pickerRef}
              selectedValue={selectedCat}
              onValueChange={(cat) => setSelectedCat(cat)}
            >
              {cats?.map((cat: CatData) => (
                <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">건강검진 다녀온 날</Text>
          <View className="flex flex-row items-center pl-2 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className=""
              value={healthCheckupDate.toLocaleDateString()}
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
          <View className="flex flex-row items-center pl-2 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-full"
              placeholder="몇 일 뒤에 건강검진을 갈지 작성해주세요"
              keyboardType="number-pad"
              value={healthCycle.toString()}
              onChangeText={(cycle) => {
                setHealthCycle(parseInt(cycle));
              }}
            />
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">심장사상충 맞은 날</Text>
          <View className="flex flex-row items-center pl-2 border-2 border-[#ddd] rounded-xl">
            <TextInput
              value={heartWorm.toLocaleDateString()}
              onFocus={() => {
                setHeartWormCalendar(true);
              }}
              onChangeText={() => {}}
            />
            {heartWormCaledar && (
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
          <Text className="mb-4 font-bold">심장사상충 주기</Text>
          <View className="flex flex-row items-center pl-2 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-full"
              placeholder="몇 일 뒤에 심장사상충 약을 도포할지 작성해주세요"
              keyboardType="number-pad"
              value={heartWormCycle.toString()}
              onChangeText={(cycle) => setHeartWormCycle(parseInt(cycle))}
            />
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">기타 특이사항</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="메모할 내용을 입력해주세요"
            value={memo}
            onChangeText={setMemo}
          />
        </View>

        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={() => {}}>
            <Text className="text-snow">저장하기</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

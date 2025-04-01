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

export default function DailyLog() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [show, setShow] = useState(false);
  const [vitaminTime, setVitaminTime] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
  const pickerRef = useRef<Picker<string> | null>(null);
  const { cats } = useCatStore();

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
          <Text className="mb-4 font-bold">어떤 고양이</Text>
          <View className="flex flex-row items-center  justify-between p-4 border-2 border-[#ddd] rounded-xl">
            <TextInput
              className="w-1/2"
              placeholder="이름을 입력해주세요"
              value={selectedLanguage}
              onChangeText={(text) => setSelectedLanguage(text)}
              onFocus={() => {
                open();
              }}
            />

            <Picker
              ref={pickerRef}
              selectedValue={selectedLanguage}
              onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            >
              {cats?.map((cat: CatData) => (
                <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">화장실</Text>
          <View className="flex flex-row items-center  justify-between p-4 border-2 border-[#ddd] rounded-xl">
            <Text>true</Text>
            <Text>false</Text>
          </View>
        </View>
        <View className="mb-2">
          <Text className="mb-4 font-bold">영양제</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder="이름을 입력해주세요"
            value={vitaminTime.toLocaleTimeString()}
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
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder=""
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="mb-2">
          <Text className="mb-4 font-bold">기타 특이사항</Text>
          <TextInput
            className="p-4 border-2 border-[#ddd] rounded-xl"
            placeholder=""
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        {passwordMismatch && (
          <Text style={{ color: "red", marginBottom: 10 }}>비밀번호가 일치하지 않습니다.</Text>
        )}
        <View className="flex items-center p-4 mt-10 rounded-lg bg-wePeep">
          <Pressable onPress={() => {}}>
            <Text className="text-snow"></Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

import { CAT_TYPE_ARRAY } from "@/assets/images/catImages";
import BackButton from "@/components/button/BackButton";
import RiveCatAnimation, { BasicMovement } from "@/components/Rive/RiveCatAnimation";
import { CatData } from "@/types/cat";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateCat() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [catName, setCatName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [catType, setCatType] = useState("WhiteCat");
  const [show, setShow] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [checkValidation, setCheckValidation] = useState<{ [key: string]: string }>({});
  const [catIndex, setCatIndex] = useState(0);
  const newErrors: { [key: string]: string } = {};
  CAT_TYPE_ARRAY;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cats"], refetchType: "all" });
      router.back();
    },
  });
  const validate = () => {
    if (catName === "") {
      newErrors.catName = "반려묘 이름을 입력해주세요.";
    }

    if (!birthDate) {
      newErrors.birthDate = "반려묘의 생일을 입력해주세요.";
    }

    setCheckValidation(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const prevChangeCatButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCatIndex((prevIdx) => {
      const newIndex = prevIdx === 0 ? CAT_TYPE_ARRAY.length - 1 : prevIdx - 1;
      setCatType(CAT_TYPE_ARRAY[newIndex]);
      console.log(catType);
      return newIndex;
    });
  };

  const nextChangeCatButton = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCatIndex((prevIdx) => {
      const newIndex = prevIdx === CAT_TYPE_ARRAY.length - 1 ? 0 : prevIdx + 1;
      setCatType(CAT_TYPE_ARRAY[newIndex]);
      return newIndex;
    });
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    const userData = await getData("userData");

    const payload = {
      name: catName,
      catType: catType,
      birthDate: formatDate(birthDate),
      owner: userData?.userId || "",
    };

    console.log("📤 요청 데이터:", payload);
    mutation.mutate(payload);

    // mutation.mutate({
    //   name: catName,
    //   catType: catType,
    //   birthDate: formatDate(birthDate),
    //   owner: userData?.userId || "",
    // });
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="mx-6 ">
        <View className="flex flex-row items-center mt-8 mb-6">
          <BackButton />
          <View className="items-center flex-1 mr-7">
            <Text className="text-xl font-semibold ">반려묘 정보 저장</Text>
          </View>
        </View>
        <View className="">
          <View className="flex flex-row items-center mt-4">
            <Pressable
              className=""
              onPress={prevChangeCatButton}
              android_ripple={{ color: "gray", radius: 25 }}
            >
              <AntDesign name="leftcircleo" size={48} color="black" />
            </Pressable>

            <RiveCatAnimation catTypeProp={catType} movementState={BasicMovement} />

            <Pressable
              className=""
              onPress={nextChangeCatButton}
              android_ripple={{ color: "gray", radius: 25 }}
            >
              <AntDesign name="rightcircleo" size={48} color="black" />
            </Pressable>
          </View>

          <View className="mt-6 mb-2 ">
            <Text className="mb-4 font-bold">이름</Text>
            <TextInput
              className={`p-4 border-2 ${
                checkValidation.catName ? `border-[#ff0000]` : `border-[#ddd]`
              } rounded-xl`}
              placeholder="이름을 입력해주세요"
              placeholderTextColor="#777777"
              onChangeText={(text) => setCatName(text)}
              value={catName}
            />
            {checkValidation.catName && (
              <Text className="text-[#ff0000]">{checkValidation.catName}</Text>
            )}
          </View>
          <Text className="mb-4 font-bold">생일</Text>

          <TextInput
            className={`p-4 border-2 ${
              checkValidation.birthDate ? `border-[#ff0000]` : `border-[#ddd]`
            } rounded-xl`}
            placeholder={formatDate(birthDate)}
            placeholderTextColor="#777777"
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
                value={birthDate}
                mode="date"
                display="default"
                onChange={handleChange}
              />
            )}
          </View>

          <Pressable
            android_ripple={{ color: "#f5d4e0" }}
            onPress={handleSubmit}
            disabled={mutation.isPending}
            className="flex items-center justify-center p-4 mt-10 rounded-lg h-14 bg-wePeep"
          >
            <Text className="text-snow">
              {mutation.isPending ? <ActivityIndicator size="large" color="#c9e6ee" /> : "확인"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function CalendarScreen() {
  LocaleConfig.locales["ko"] = {
    monthNames: [
      "01월",
      "02월",
      "03월",
      "04월",
      "05월",
      "06월",
      "07월",
      "08월",
      "09월",
      "10월",
      "11월",
      "12월",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  };
  LocaleConfig.defaultLocale = "ko";

  const [selected, setSelected] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await getData("userData");
      setUserData(storedUserData);
    };
    fetchUserData();
  }, []);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["dailyLog", logDate],
    queryFn: () =>
      apiRequest(`dailyLog?logDate=${logDate}`, "GET", undefined, userData?.accessToken || ""),
    enabled: userData !== null,
  });
  console.log(data);

  return (
    <ScrollView className="p-4 ">
      <Calendar
        onDayPress={(day) => {
          setLogDate(day.dateString);
        }}
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true },
          "2025-04-05": { marked: true, selectedColor: "orange" },
          selected: { marked: true, selectedColor: "orange" },
        }}
        style={{
          height: 350,
          borderRadius: 10,
        }}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#dd99ee",
        }}
      />
      <View className="flex items-center justify-center p-4 mt-5 bg-white bg-gray-100 rounded-lg ">
        <Text className="text-lg font-bold text-purple-700">{logDate}</Text>

        {isSuccess &&
          data?.dailyLogs?.length > 0 &&
          data?.dailyLogs?.map((dailyLog: DailyLogData) => (
            <View
              key={dailyLog.cat.catId}
              className="flex flex-row flex-wrap items-center justify-center gap-2 p-3 mt-2 bg-white rounded-md "
            >
              <Text className="w-full text-lg font-bold text-gray-800">
                {dailyLog.cat.catName}의 건강 기록
              </Text>
              <Text className="w-full text-lg font-bold text-gray-800">
                대변상태: {dailyLog.defecation ? "좋았어요" : "좋지 않았어요"}
              </Text>
              <Text className="w-full text-lg font-bold text-gray-800">
                영양제 먹는 시간: {dailyLog.vitamin}
              </Text>
              <Text className="w-full text-lg font-bold text-gray-800">
                체중: {dailyLog.weight}
              </Text>
              <Text className="w-full text-lg font-bold text-gray-800">
                특이사항 : {dailyLog.etc}
              </Text>
              <Link
                className="p-3 mt-12 bg-purple-100 border-2 border-purple-500 rounded-lg"
                href={{ pathname: "/DailyLog/[logDate]", params: { logDate } }}
              >
                <Text className="text-lg font-bold ">추가 등록</Text>
              </Link>
              <Link
                className="p-3 mt-12 bg-purple-100 border-2 border-purple-500 rounded-lg"
                href={{ pathname: "/DailyLog/[logDate]", params: { logDate } }}
              >
                <Text className="text-lg font-bold ">수정하기</Text>
              </Link>
            </View>
          ))}
        {data?.dailyLogs?.length === 0 && (
          <Link
            href={{ pathname: "/DailyLog/[logDate]", params: { logDate } }}
            className="p-3 my-12 bg-purple-100 border-2 border-purple-500 rounded-lg"
          >
            <Text className="text-lg font-bold ">반려묘 건강 기록하기</Text>
          </Link>
        )}

        {isLoading && (
          <View className="">
            <ActivityIndicator size="large" color="#dbc0e7" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

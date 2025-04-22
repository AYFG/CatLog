import RouteButton from "@/components/RouteButton";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueries } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
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
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [markedDates, setMarkedDates] = useState({});
  console.log(userData);
  useEffect(() => {
    const fetchData = async () => {
      const storedUserData = await getData("userData");
      if (storedUserData == null) {
        router.replace("/Login");
      } else {
        setUserData(storedUserData);
      }
    };
    fetchData();
  }, []);

  const [getDailyLog, getEveryDate] = useQueries({
    queries: [
      {
        queryKey: ["dailyLog", logDate],
        queryFn: () =>
          apiRequest(`dailyLog?logDate=${logDate}`, "GET", undefined, userData?.accessToken || ""),
        enabled: userData !== null,
      },
      {
        queryKey: ["dailyLog"],
        queryFn: () =>
          apiRequest(`dailyLog/everyLogDates`, "GET", undefined, userData?.accessToken || ""),
        enabled: userData !== null,
      },
    ],
  });

  const [date, setDate] = useState<string[]>([]);
  useEffect(() => {
    if (getEveryDate.isSuccess) {
      setDate(getEveryDate.data.everyLogDates);
    }
  }, [getEveryDate]);

  useEffect(() => {
    const updatedMarkedDates: Record<string, { marked: boolean }> = {};
    date?.forEach((v) => {
      updatedMarkedDates[v] = { marked: true };
    });
    setMarkedDates(updatedMarkedDates);
  }, [date]);

  return (
    <ScrollView className="p-4 bg-snow">
      <Calendar
        onDayPress={(day) => {
          setLogDate(day.dateString);
          setSelected(day.dateString);
        }}
        markedDates={{
          ...markedDates,
          [selected]: { selected: true, disableTouchEvent: true },
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
          textDisabledColor: "#d9e1e8",
        }}
      />
      <View className="flex items-center justify-center p-4 mt-5 bg-white bg-gray-100 rounded-lg ">
        <Text className="mt-5 mb-5 text-lg font-bold text-purple-700">{logDate}</Text>

        <View className="items-center">
          {getDailyLog.isSuccess &&
            getDailyLog?.data?.dailyLogs?.length > 0 &&
            getDailyLog?.data?.dailyLogs?.map((dailyLog: DailyLogData) => (
              <View
                key={dailyLog.cat.catId}
                className="flex flex-row flex-wrap items-center justify-center gap-3 p-3 mt-2 mb-4 bg-white border-2 border-[#ddd] rounded-md"
              >
                <View className="flex flex-row flex-wrap items-center justify-between w-full mb-2">
                  <View className="flex flex-row flex-wrap items-center ">
                    <Text className="text-2xl font-bold ">{dailyLog.cat.catName}</Text>
                    <Text className="text-2xl font-medium">의 건강 기록</Text>
                  </View>
                  {/* 
                  <Link
                    className="p-2 rounded-lg bg-prelude"
                    href={{
                      pathname: "/DailyLog/[logDate]",
                      params: {
                        logDate,
                        catIdParams: dailyLog.cat.catId,
                        catNameParams: dailyLog.cat.catName,
                        defecationParams: dailyLog.defecation ? "true" : "false",
                        vitaminParams: dailyLog.vitamin,
                        weightParams: dailyLog.weight,
                        etcParams: dailyLog.etc,
                      },
                    }}
                  >
                    <Text className="text-lg font-semiBold text-snow">수정하기</Text>
                  </Link> */}
                  <Link
                    href={{
                      pathname: "/EditCalendarModal",
                      params: {
                        logDate,
                        catIdParams: dailyLog.cat.catId,
                        catNameParams: dailyLog.cat.catName,
                        defecationParams: dailyLog.defecation ? "true" : "false",
                        vitaminParams: dailyLog.vitamin,
                        weightParams: dailyLog.weight,
                        etcParams: dailyLog.etc,
                      },
                    }}
                  >
                    <Ionicons name={"ellipsis-vertical"} size={24} color="black" />
                  </Link>

                  <View className="flex flex-col items-center justify-center w-full mt-2 mb-2 pl-">
                    <Text className="w-full text-lg font-bold ">
                      대변상태: {dailyLog.defecation ? "좋았어요" : "좋지 않았어요"}
                    </Text>
                    <Text className="w-full text-lg font-bold ">
                      영양제 먹는 시간: {dailyLog.vitamin}
                    </Text>
                    <Text className="w-full text-lg font-bold ">체중: {dailyLog.weight}kg</Text>
                    <Text className="w-full text-lg font-bold ">
                      특이사항 : {dailyLog.etc ? dailyLog.etc : "없었어요"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          {getDailyLog?.data?.dailyLogs?.length === 0 ? (
            <>
              <Text className="mb-6">오늘의 반려묘 건강을 기록해보세요</Text>

              <RouteButton
                routeHref="/DailyLog/[logDate]"
                param={{}}
                children="반려묘 건강 기록하기"
              />
            </>
          ) : (
            <Link
              className="flex items-center w-full p-4 my-10 rounded-lg bg-wePeep"
              href={{ pathname: "/DailyLog/[logDate]", params: { logDate } }}
            >
              <Text className="text-snow">건강 기록 추가하기</Text>
            </Link>
          )}
        </View>

        {getDailyLog.isLoading && (
          <View className="absolute">
            <ActivityIndicator size="large" color="#dbc0e7" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

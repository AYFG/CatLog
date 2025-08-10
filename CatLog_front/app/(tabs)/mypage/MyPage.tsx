import images from "@/assets/images/catImages";
import RouteButton from "@/components/button/RouteButton";
import { useCatStore } from "@/store/useCatStore";
import { UserData } from "@/types/auth";
import { CatData } from "@/types/cat";
import { calculateAge } from "@/utils/calculateAge";
import { calculateNextDate } from "@/utils/calculateNextDate";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { cats, setCats } = useCatStore();
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ["cats"],
    queryFn: () =>
      apiRequest(`cat/${userData?.userId}`, "GET", undefined, userData?.accessToken || ""),
    enabled: userData !== null,
  });
  useEffect(() => {
    if (isSuccess && data) {
      setCats(data.cats);
    }
  }, [data]);
  useEffect(() => {
    const getUserData = async () => {
      const data = await getData("userData");
      if (!data) {
        router.replace("/Login");
      } else {
        setUserData(data);
      }
    };
    getUserData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="bg-white"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="m-4">
        <View className="flex flex-row justify-between p-4 mb-5 ">
          <Text className="text-xl font-medium ">{userData && userData.name}님의 반려묘</Text>
          <Link href="/CreateCat" asChild>
            <Pressable android_ripple={{ color: "lightgray", borderless: true }}>
              <Ionicons name="add" size={24} />
            </Pressable>
          </Link>
        </View>
        <View className="flex flex-col gap-6 ">
          {cats.length > 0 ? (
            cats?.map((v: CatData) => (
              <View className="flex flex-row py-4 shadow-md bg-snow rounded-xl" key={v._id}>
                <View className="pt-4 h-[120] ml-2 mr-3">
                  <Image
                    source={v.catType ? images[v.catType as keyof typeof images] : images.WhiteCat}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                    }}
                  />
                </View>

                <View className="flex flex-col flex-1">
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-row items-center gap-3">
                      <Text className="text-lg font-bold">{v.name}</Text>
                      <Text className="">{calculateAge(v.birthDate)}살</Text>
                    </View>

                    <Link
                      className="mr-2"
                      href={{
                        pathname: "/EditCatModal",
                        params: {
                          catId: v._id,
                          birthDay: v.birthDate,
                          nameParams: v?.name,
                          healthDateParams: v.medicalLogs?.healthCheckupDate,
                          healthCycleParams: v.medicalLogs?.healthCycle,
                          heartWormParams: v.medicalLogs?.heartWorm,
                          heartWormCycleParams: v.medicalLogs?.heartWormCycle,
                        },
                      }}
                      asChild
                    >
                      <Pressable android_ripple={{ color: "lightgray", borderless: true }}>
                        <Ionicons name={"ellipsis-vertical"} size={24} color="black" />
                      </Pressable>
                    </Link>
                  </View>
                  {v.medicalLogs ? (
                    <View className="gap-0.5 pt-2">
                      <Text>건강검진 다녀온 날 : {v.medicalLogs.healthCheckupDate}</Text>
                      <Text
                        style={
                          calculateNextDate(
                            v.medicalLogs.healthCheckupDate,
                            v.medicalLogs.healthCycle,
                          ) > 0
                            ? { color: "black" }
                            : { color: "red" }
                        }
                      >
                        다음 건강검진 :
                        {calculateNextDate(
                          v.medicalLogs.healthCheckupDate,
                          v.medicalLogs.healthCycle,
                        ) > 0 ? (
                          <Text className="">
                            {" "}
                            D-
                            {calculateNextDate(
                              v.medicalLogs.healthCheckupDate,
                              v.medicalLogs.healthCycle,
                            )}
                          </Text>
                        ) : (
                          " 예정일이 지났습니다"
                        )}
                      </Text>
                      <Text>심장사상충 약 바른 날 : {v.medicalLogs.heartWorm}</Text>
                      <Text
                        style={
                          calculateNextDate(v.medicalLogs.heartWorm, v.medicalLogs.heartWormCycle) >
                          0
                            ? { color: "black" }
                            : { color: "red" }
                        }
                      >
                        다음 심장사상충 :{" "}
                        {calculateNextDate(v.medicalLogs.heartWorm, v.medicalLogs.heartWormCycle) >
                        0 ? (
                          <Text className="">
                            D-
                            {calculateNextDate(
                              v.medicalLogs.heartWorm,
                              v.medicalLogs.heartWormCycle,
                            )}
                          </Text>
                        ) : (
                          " 예정일이 지났습니다"
                        )}
                      </Text>
                    </View>
                  ) : (
                    <View className="flex items-center">
                      <Text className="mt-3 mb-2 text-center ">건강검진 기록이 없습니다.</Text>

                      <View className="">
                        <RouteButton
                          children={`건강검진 기록하러가기  〉`}
                          routeHref="/MedicalLog"
                          param={{
                            catId: v._id || "",
                            nameParams: v.name,
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className="flex flex-col items-center gap-4">
              <Text>등록된 반려묘가 없습니다.</Text>
              <RouteButton children="반려묘를 등록해주세요" routeHref="/CreateCat" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

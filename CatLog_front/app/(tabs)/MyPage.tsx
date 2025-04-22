import RouteButton from "@/components/RouteButton";
import { useCatStore } from "@/store/useCatStore";
import { calculateAge } from "@/utils/calculateAge";
import { calculateNextDate } from "@/utils/calculateNextDate";
import { apiRequest } from "@/utils/fetchApi";
import { getData } from "@/utils/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats } = useCatStore();

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

  return (
    <ScrollView className="bg-snow">
      <View className="m-4">
        <View className="flex flex-row justify-between p-4 ">
          <Text className="mb-5 text-xl font-medium ">{userData && userData.name}님의 반려묘</Text>
          <Link href="/CreateCat">
            <Ionicons name="add" size={24} />
          </Link>
        </View>
        <View className="flex flex-col gap-6 ">
          {cats.length > 0 ? (
            cats?.map((v: CatData) => (
              <View className="flex flex-row py-4 bg-white shadow-md rounded-xl" key={v._id}>
                <View className="pt-4 rounded-full h-[120] bg-linen mr-4">
                  <Image
                    source={require("@/assets/images/whiteCat.png")}
                    style={{ width: 100, height: 100, objectFit: "contain" }}
                  />
                </View>

                {/* <Button title="삭제" onPress={() => deleteCatHandler(v._id)} /> */}
                {/* <View className="mb-3">
                  <Link
                    href={{
                      pathname: "/ChangeCat/[catId]",
                      params: { catId: v._id || "", name: v.name, birthDay: v.birthDate },
                    }}
                  >
                    <Text>정보 수정</Text>
                  </Link>
                </View> */}

                <View className="flex flex-col flex-1">
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-lg font-bold">{v.name}</Text>
                      <Text className="">{calculateAge(v.birthDate)}살</Text>
                    </View>

                    <Link
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
                    >
                      <Ionicons name={"ellipsis-vertical"} size={24} color="black" />
                    </Link>
                  </View>
                  {v.medicalLogs ? (
                    <View className="">
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
                        다음 건강검진 : D -{" "}
                        {calculateNextDate(
                          v.medicalLogs.healthCheckupDate,
                          v.medicalLogs.healthCycle,
                        ) > 0
                          ? calculateNextDate(
                              v.medicalLogs.healthCheckupDate,
                              v.medicalLogs.healthCycle,
                            )
                          : "예정일이 지났습니다"}
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
                        다음 심장사상충 : D -{" "}
                        {calculateNextDate(v.medicalLogs.heartWorm, v.medicalLogs.heartWormCycle) >
                        0
                          ? calculateNextDate(v.medicalLogs.heartWorm, v.medicalLogs.heartWormCycle)
                          : "예정일이 지났습니다"}
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
            <View className="flex flex-col items-center bg-">
              <Text>등록된 반려묘가 없습니다.</Text>
              <RouteButton children="반려묘를 등록해주세요" routeHref="/MyCat" />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

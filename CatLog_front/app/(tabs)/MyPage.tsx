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
import { Button, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { cats } = useCatStore();
  useEffect(() => {
    const getUserData = async () => {
      const data = await getData("userData");
      setUserData(data);
    };
    getUserData();
  }, []);

  const mutation = useMutation({
    mutationFn: (catId: CatData["_id"]) =>
      apiRequest(`cat/${catId}`, "DELETE", undefined, userData?.accessToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cats"] });
    },
  });
  const deleteCatHandler = (catId: CatData["_id"]) => {
    mutation.mutate(catId);
    console.log("고양이가 삭제되었습니다:", catId);
  };

  return (
    <ScrollView>
      <View className="m-10">
        <Text className="w-full mb-5 text-center">{userData && userData.name}님의 반려묘</Text>
        <View className="flex flex-row flex-wrap gap-10 ">
          {cats.length > 0 ? (
            cats?.map((v: CatData) => (
              <View className="flex flex-col w-full " key={v._id}>
                <View className="flex items-center justify-center">
                  <Image
                    source={require("@/assets/images/testCat.png")}
                    style={{ width: 100, height: 100 }}
                  />
                  <View className="mb-3">
                    <Link
                      href={{
                        pathname: "/ChangeCat/[catId]",
                        params: { catId: v._id || "", name: v.name, birthDay: v.birthDate },
                      }}
                    >
                      <Text>정보 수정</Text>
                    </Link>
                  </View>
                  <Button title="삭제" onPress={() => deleteCatHandler(v._id)} />
                </View>
                <Text className="mb-4 text-center">{v.name}</Text>
                <Text className="mb-4 text-center">{calculateAge(v.birthDate)}살</Text>
                {v.medicalLogs ? (
                  <View className="flex items-center gap-2">
                    <Text>건강검진 다녀온 날 :{v.medicalLogs.healthCheckupDate}</Text>
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
                      다음 건강검진까지 : D-{" "}
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
                        calculateNextDate(v.medicalLogs.heartWorm, v.medicalLogs.heartWormCycle) > 0
                          ? { color: "black" }
                          : { color: "red" }
                      }
                    >
                      다음 심장사상충 약 바를 날 : D-{" "}
                      {calculateNextDate(
                        v.medicalLogs.healthCheckupDate,
                        v.medicalLogs.heartWormCycle,
                      ) > 0
                        ? calculateNextDate(
                            v.medicalLogs.healthCheckupDate,
                            v.medicalLogs.heartWormCycle,
                          )
                        : "예정일이 지났습니다"}
                    </Text>
                  </View>
                ) : (
                  <RouteButton
                    children={`${v.name}의 건강검진 기록 등록하기`}
                    routeHref="/MedicalLog"
                  />
                )}
              </View>
            ))
          ) : (
            <RouteButton children="반려묘를 등록해주세요" routeHref="/MyCat" />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

import React, { useState } from "react";
import { Text, View } from "react-native";
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
    today: "오늘",
  };
  LocaleConfig.defaultLocale = "ko";

  const [selected, setSelected] = useState("");

  return (
    <View>
      <Calendar
        onDayPress={(day: object) => {
          console.log("selected day", day);
        }}
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: "orange" },
        }}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          height: 350,
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
    </View>
  );
}

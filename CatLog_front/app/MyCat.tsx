import { TextInput, View } from "react-native";

export default function MyCat() {
  return (
    <View>
      <TextInput placeholder="이름" value="" onChangeText={() => {}} />
      <TextInput placeholder="생년월일" value="" onChangeText={() => {}} />
      <TextInput placeholder="몸무게" value="" onChangeText={() => {}} />
      <TextInput placeholder="성별" value="" onChangeText={() => {}} />
      <TextInput placeholder="종류" value="" onChangeText={() => {}} />
      <TextInput placeholder="색상" value="" onChangeText={() => {}} />
      <TextInput placeholder="특징" value="" onChangeText={() => {}} />
      <TextInput placeholder="사료" value="" onChangeText={() => {}} />
      <TextInput placeholder="간식" value="" onChangeText={() => {}} />
    </View>
  );
}

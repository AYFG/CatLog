import { useState } from "react";
import { Text, TextInput, View, Button } from "react-native";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  console.log(email, password, name);
  const handleSignup = async () => {
    try {
      const response = await fetch("http://192.168.200.146:8080/auth/signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View className="items-center justify-center flex-1">
      <Text>회원가입</Text>
      <TextInput placeholder="id" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput placeholder="name" value={name} onChangeText={setName} />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}

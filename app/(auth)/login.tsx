import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { isLoading, signIn } = useAuthStore();
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlelogin = async () => {
    setEmailError("");
    setPasswordError("");
    if (!email) {
      setEmailError("email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("please enter a valid email");
      return;
    }
    if (!password) {
      setPasswordError("password is required");
      return;
    }
    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.message.includes("invalid login credentials")) {
        setPasswordError("invalid email or password");
      } else {
        Alert.alert("login error", error.message);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />
      <KeyboardAvoidingView>
        <ScrollView>
        <View className="items-center justify-center m-10 p-4 ">
          <Text className="text-3xl font-bold text-center text-text">
            Study App
          </Text>
        </View>
        <View className="p-4 ">
          <Text className="text-xl text-text">
            Welcome! Please Login to continue
          </Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#a4a49c"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            className="border border-border rounded-xl p-2 mt-4 h-16 w-full text-text "
          />
          {emailError ? (
            <Text className="text-red-500 ">{emailError}</Text>
          ) : null}
          <TextInput
            placeholder="password"
            placeholderTextColor="#a4a49c"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            secureTextEntry={!showPassword}
            autoCorrect={false}
            className="border border-border rounded-xl p-2 mt-4 h-16 w-full text-text "
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-8 bottom-9"
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#a4a49c"
            />
          </TouchableOpacity>
          {passwordError ? (
            <Text className="text-red-500 ">{passwordError}</Text>
          ) : null}
        </View>
        <View className="px-4">
          <TouchableOpacity
            className="bg-primary rounded-xl p-4 mt-4  "
            onPress={handlelogin}
          >
            <Text className="text-center text-text ">Login</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row m-4 justify-center">
          <Text className="text-text ">dont have an account </Text>
          <Link href="/(auth)/register" className="underline text-primary">
            register
          </Link>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

import { signIn, signUp, subscribeToAuthChanges } from "../AuthManager";
import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "@rneui/themed";

import { useDispatch } from "react-redux";
import { addUser } from "../features/authSlice";

function SigninBox({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign In</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter email"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter password"
            autoCapitalize="none"
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              await signIn(email, password);
            } catch (error) {
              Alert.alert(
                "You Were Unable to Get in",
                `The robot said: ${error.message}`,
                [{ text: "OK" }]
              );
            }
          }}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}

function SignupBox({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const dispatch = useDispatch(); // make sure it's in SignupBox()!!!

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeaderText}>Sign Up</Text>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Name: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter name"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setDisplayName(text)}
            value={displayName}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Email: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter email"
            autoCapitalize="none"
            spellCheck={false}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <View style={styles.loginLabelContainer}>
          <Text style={styles.loginLabelText}>Password: </Text>
        </View>
        <View style={styles.loginInputContainer}>
          <TextInput
            style={styles.loginInputBox}
            placeholder="enter password"
            autoCapitalize="none"
            spellCheck={false}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
      </View>
      <View style={styles.loginRow}>
        <Button
          onPress={async () => {
            try {
              const newUser = await signUp(displayName, email, password);
              console.log("newUser", newUser);
              dispatch(addUser(newUser));
            } catch (error) {
              Alert.alert("Sign Up Error", error.message, [{ text: "OK" }]);
            }
          }}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [loginMode, setLoginMode] = useState(true);

  useEffect(() => {
    subscribeToAuthChanges(navigation);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, textAlign: "center", flex: 1 }}>
          Welcome
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        {loginMode ? (
          <SigninBox navigation={navigation} />
        ) : (
          <SignupBox navigation={navigation} />
        )}

        <View styles={styles.modeSwitchContainer}>
          {loginMode ? (
            <Text>
              New user?
              <Text
                onPress={() => {
                  setLoginMode(!loginMode);
                }}
                style={{ color: "blue" }}
              >
                {" "}
                Sign up{" "}
              </Text>
              instead!
            </Text>
          ) : (
            <Text>
              Returning user?
              <Text
                onPress={() => {
                  setLoginMode(!loginMode);
                }}
                style={{ color: "blue" }}
              >
                {" "}
                Sign in{" "}
              </Text>
              instead!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    justifyContent: "center",
    backgroundColor: "#ADD8E6",
    width: "100%",
    height: "18%",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: "15%",
  },
  bodyContainer: {
    height: "82%",
    width: "100%",
    paddingHorizontal: "5%",
    paddingTop: "5%",
    overflow: "scroll",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flex: 0.6,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  loginHeader: {
    width: "100%",
    padding: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginHeaderText: {
    fontSize: 24,
    color: "black",
    paddingBottom: "5%",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "3%",
  },
  loginLabelContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  loginLabelText: {
    fontSize: 18,
  },
  loginInputContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  loginInputBox: {
    width: "100%",
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 18,
    padding: "2%",
  },
  modeSwitchContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 30
  },
  loginButtonRow: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 0.7,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
export default LoginScreen;

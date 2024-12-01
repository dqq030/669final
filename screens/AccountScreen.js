import { signOut, getAuthUser } from "../AuthManager";
import { Button } from "@rneui/themed";
import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import { subscribeToUserUpdates } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "../features/authSlice";

function AccountScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    subscribeToUserUpdates(dispatch);
    dispatch(loadUser(getAuthUser()));
  }, []);

  const authUser = useSelector((state) => state.authSlice.authUser);
  const currentAuthUser = getAuthUser();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 25, flex: 0.6, textAlign: "center" }}>
          Account
        </Text>
      </View>
      <View style={styles.body}>
        <View
          style={{
            flex: 0.3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, margin: 20 }}>
            Name: {authUser?.name}
          </Text>
          <Text style={{ fontSize: 20 }}>Email: {authUser?.email}</Text>
        </View>
        <View
          style={{
            flex: 0.6,
            width: "40%",
            display: "flex",
            justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Button
            color={"red"}
            onPress={async () => {
              try {
                await signOut();
              } catch (error) {
                Alert.alert("Sign Out Error", error.message, [{ text: "OK" }]);
              }
            }}
          >
            Sign out
          </Button>
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
  body: {
    height: "82%",
    width: "100%",
    paddingHorizontal: "5%",
    paddingTop: "5%",
    overflow: "scroll",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  block: {
    marginBottom: 20,
    flexDirection: "row",
    display: "flex",
  },
});
export default AccountScreen;

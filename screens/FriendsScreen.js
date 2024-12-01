import { signOut, getAuthUser } from "../AuthManager";
import { Button } from "@rneui/themed";
import { Input, Icon } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { subscribeToUserUpdates } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser, updateUser } from "../features/authSlice";
import { Ionicons } from "@expo/vector-icons";

function FriendsScreen({ navigation }) {
  const dispatch = useDispatch();
  useEffect(() => {
    subscribeToUserUpdates(dispatch);
    dispatch(loadUser(getAuthUser()));
  }, []);

  const users = useSelector((state) => state.authSlice.users);
  const authUser = useSelector((state) => state.authSlice.authUser);
  const currentAuthUser = getAuthUser();
  const friends = useSelector((state) => state.authSlice.authUser?.friends);

  const [input, setInput] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24 }}>Add Friends</Text>
      </View>
      <View style={styles.body}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 0.8, marginLeft: 16 }}>
            <Input
              placeholder="Search user name"
              value={input}
              onChangeText={setInput}
            />
          </View>
          <TouchableOpacity style={{ flex: 0.2 }}>
            <Icon name="search" size={36} style={{ margin: 5 }} />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 25, marginVertical: 0 }}>
          <FlatList
            data={users
              .filter((user) =>
                user.name.toLowerCase().includes(input.toLowerCase())
              )
              .filter((user) => user.key !== currentAuthUser.uid)}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: 10,
                    // borderColor: "lightgray",
                    // borderBottomWidth: 1,
                  }}
                >
                  <Icon
                    name="person"
                    size={30}
                    style={{ flex: 2, margin: 10 }}
                  />
                  <View
                    style={{ marginHorizontal: 10, marginBottom: 4, flex: 4 }}
                  >
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ fontSize: 18 }}>{item.email}</Text>
                  </View>
                  {friends?.includes(item.key) ? (
                    <View style={{ flex: 1, margin: 10 }}>
                      <Ionicons name="checkmark-outline" size={30}></Ionicons>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{ flex: 1, margin: 10 }}
                      onPress={() => {
                        const updatedFriends = [...authUser.friends, item.key];
                        dispatch(
                          updateUser({
                            ...authUser,
                            friends: updatedFriends,
                          })
                        );
                      }}
                    >
                      <Ionicons name="add-circle-outline" size={30}></Ionicons>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    justifyContent: "center",
    backgroundColor: "#ADD8E6",
    width: "100%",
    height: "18%",
    // flex: 18,
    alignItems: "center",
    flexDirection: "row",
    paddingTop: "15%",
  },
  body: {
    height: "82%",
    // flex: 82,
    width: "100%",
    paddingHorizontal: "5%",
    paddingTop: "6%",
  },

  listContainer: {
    flex: 0.5,
    width: "100%",
  },
});
export default FriendsScreen;

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
import { updateDayThunk } from "../features/daySlice";

function ShareScreen(props) {
  const { navigation, route } = props;
  const { day, setOwners } = route.params;


  const dispatch = useDispatch();
  useEffect(() => {
    subscribeToUserUpdates(dispatch);
    dispatch(loadUser(getAuthUser()));
  }, []);

  const users = useSelector((state) => state.authSlice.users);
  const currentAuthUser = getAuthUser();
  const friends = useSelector((state) => state.authSlice.authUser?.friends);

  const [input, setInput] = useState("");

  const [ownersSon, setOwnersSon] = useState(
    day.owners || [currentAuthUser.uid]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, { flex: 0.2 }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "blue", fontSize: 20, paddingLeft: 9 }}>
            {"< Back"}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 25, flex: 0.6, textAlign: "center" }}>
          Share with
        </Text>

        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.body}>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 0.8, marginLeft: 16 }}>
            <Input
              placeholder="Search friend name"
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
            extraData={ownersSon}
            data={users
              .filter((user) => user.name.includes(input))
              .filter((user) => user.key !== currentAuthUser.uid)
              .filter((user) => friends?.includes(user.key))}
            renderItem={({ item }) => {
              return (
                <View
                  key={item.key}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginVertical: 0,
                    // borderColor: "lightgray",
                    // borderBottomWidth: 1,
                  }}
                >
                  <View
                    style={{ marginHorizontal: 10, marginBottom: 4, flex: 4 }}
                  >
                    <Text style={{ fontSize: 20, margin: 8 }}>{item.name}</Text>
                  </View>
                  {ownersSon?.includes(item.key) ? (
                    <TouchableOpacity
                      style={{ flex: 1, margin: 10 }}
                      onPress={() => {
                        const newOwners = ownersSon.filter(
                          (owner) => owner !== item.key
                        );
                        setOwners(newOwners);
                        setOwnersSon(newOwners);
                        dispatch(updateDayThunk({ ...day, owners: newOwners }));
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={30}
                      ></Ionicons>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ flex: 1, margin: 10 }}
                      onPress={() => {
                        const newOwners = [...ownersSon, item.key];
                        setOwners(newOwners);
                        setOwnersSon(newOwners);
                        dispatch(updateDayThunk({ ...day, owners: newOwners }));
                      }}
                    >
                      <Ionicons name="ellipse-outline" size={30}></Ionicons>
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
export default ShareScreen;

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { Input, Button, Icon } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import {
  updateDayThunk,
  addDayThunk,
  getDaysThunk,
} from "../features/daySlice";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { getAuthUser } from "../AuthManager";

function EditScreen(props) {
  const dispatch = useDispatch();

  const { navigation, route } = props;
  const { item } = route.params;

  const defaultImage =
      "https://firebasestorage.googleapis.com/v0/b/finalproj-d2c1b.firebasestorage.app/o/images%2Fdefault-ui-image-placeholder-wireframes-600nw-1037719192.webp?alt=media&token=931856bb-343a-475f-847a-a37da865e9ac";

  const currentAuthUser = getAuthUser();

  const [title, setTitle] = useState(item.title || "");
  const [date, setDate] = useState(item.date || new Date().toISOString());
  const [description, setDescription] = useState(item.description || "");
  const [owners, setOwners] = useState(item.owners || [currentAuthUser.uid]);
  const [picture, setPicture] = useState(item.picture || "");

  const friends = useSelector((state) => state.authSlice.authUser?.friends);
  const users = useSelector((state) => state.authSlice.users);

  const friendsNames = friends.map((friend) => {
    return users.find((user) => user.key === friend).name
  });

  const ownersNames = owners.map((owner) => {
    return users.find((user) => user.key === owner).name
  });

  useEffect(() => {
    // 请求相册权限
    const requestPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access gallery is required!");
      }
    };
    requestPermission();
  }, []);

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate.toISOString() || date;
    setDate(currentDate);
  };

  const saveDay = () => {
    const newDay = {
      key: item.key,
      title,
      date,
      description,
      owners,
      picture
    };
    if (item.key === -1) {
      const { key, ...day } = newDay;
      dispatch(addDayThunk(day));
    } else {
      dispatch(updateDayThunk(newDay));
    }
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(getDaysThunk());
  }, [dispatch]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, { flex: 0.2 }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: "blue", fontSize: 20, paddingLeft: 4 }}>
            {"Cancel"}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 25, flex: 0.6, textAlign: "center" }}>
          {item.key == -1 ? "Add" : "Edit"} Day
        </Text>
        <TouchableOpacity
          style={[styles.button, { flex: 0.2 }]}
          onPress={() => {
            saveDay();
          }}
        >
          <Text
            style={{
              color: "blue",
              fontSize: 20,
              textAlign: "right",
              padding: 4,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.block}>
          <Text style={styles.title}>Title:</Text>
          <View style={styles.inputBlock}>
            <Input value={title} onChangeText={setTitle} placeholder="Title" />
          </View>
        </View>
        <View style={styles.block}>
          <Text style={styles.title}>Date:</Text>
          <View style={styles.inputBlock}>
            {/* <Input value={date} placeholder="Date" /> */}
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display="default"
              onChange={onChange}
              style={{ marginBottom: 10, marginTop: 0, width: "100%" }}
            />
          </View>
        </View>
        <View style={styles.block}>
          <Text style={styles.title}>Description:</Text>
          <View style={styles.inputBlock}>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
            />
          </View>
        </View>
        <View style={styles.block}>
          <Text style={styles.title}>Share:</Text>
          <View
            style={{
              flex: 0.6,
              flexDirection: "row",
              display: "flex",
              margin: 10,
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 18, flex: 5 }}>
              {ownersNames.slice(1).join(", ").slice(0, 15)}
              {ownersNames.slice(1).join(", ").length > 15 ? "..." : ""}
            </Text>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                navigation.navigate("Share", {
                  day: item,
                  setOwners,
                });
              }}
            >
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                size={27}
                style={{ flex: 1 }}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.block}>
          <Text style={styles.title}>Picture:</Text>
          <View style={styles.inputBlock}>
            <Button title="Choose Image" onPress={chooseImage} />
            {picture && (
              <Image
                source={{ uri: item.picture }}
                style={{ width: 200, aspectRatio: 1, marginTop: 10 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
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
  },
  button: {
    paddingHorizontal: 10,
  },
  block: {
    // marginBottom: 15,
    // borderBottomWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
  },
  title: {
    flexDirection: "row",
    alignItems: "top",
    fontSize: 22,
    flex: 0.4,
    marginTop: 8,
  },
  inputBlock: {
    alignItems: "center",
    justifyContent: "left",
    flex: 0.6,
  },
});

export default EditScreen;

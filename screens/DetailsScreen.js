import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { Input, Button, Icon } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { getDaysThunk, deleteDayThunk } from "../features/daySlice";

function DetailsScreen(props) {
  const dispatch = useDispatch();

  const { navigation, route } = props;
  const { item: initialItem } = route.params;

  const [item, setItem] = useState(initialItem);

  useEffect(() => {
    dispatch(getDaysThunk());
  }, [dispatch]);

  const days = useSelector((state) => state.day.value);

  const formattedDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const dayOfMonth = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${dayOfMonth}`;
  };

  useEffect(() => {
    const updatedItem = days.find((elem) => elem.key === initialItem.key);
    setItem(updatedItem);
  }, [days]);

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
            {"< Back"}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 0.6 }}>
          <Text style={{ fontSize: 24, textAlign: "center", fontWeight: 600 }}>
            {item.title.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { flex: 0.2 }]}
          onPress={() => {
            navigation.navigate("Edit", { item });
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
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        <View style={styles.block}>
          <View style={{ flex: 0.35, flexDirection: "row" }}>
            <Text style={{ fontSize: 19, paddingLeft: 5 }}>Date: </Text>
          </View>
          <View style={{ flex: 0.65 }}>
            <Text style={{ fontSize: 18 }}>{formattedDate(item.date)}</Text>
          </View>
        </View>
        {item.description && (
          <View style={styles.block}>
            <View style={{ flex: 0.35, flexDirection: "row" }}>
              <Text style={{ fontSize: 19, paddingLeft: 5 }}>
                Description:{" "}
              </Text>
            </View>

            <View style={{ flex: 0.65 }}>
              <Text style={{ fontSize: 18 }}>{item.description}</Text>
            </View>
          </View>
        )}
        {item.owners.length > 1 && (
          <View style={styles.block}>
            <Text style={{ fontSize: 19, paddingLeft: 5 }}>
              Shared with {item.owners.length - 1} other people
            </Text>
          </View>
        )}
        {item.picture && (
          <View style={styles.block}>
            <View style={{ flex: 0.35, flexDirection: "row" }}>
              <Text style={{ fontSize: 19, paddingLeft: 5 }}>Picture: </Text>
            </View>
            <View style={{ flex: 0.65 }}>
              <Image
                source={{ uri: item.picture }}
                style={{ width: 200, aspectRatio: 1 }}
              />
            </View>
          </View>
        )}
        {/* delete button */}
        <View style={{ display: "flex" }}>
          <Button
            color={"red"}
            style={{ width: "30%", alignSelf: "center", fontWeight: 600 }}
            onPress={() => {
              dispatch(deleteDayThunk(item.key));
              navigation.goBack();
            }}
          >
            Delete
          </Button>
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
  input: {
    width: "80%",
    margin: 10,
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
    paddingTop: "7%",
  },
  button: {
    paddingHorizontal: 10,
  },
  block: {
    marginBottom: 20,
    flexDirection: "row",
  },
});

export default DetailsScreen;

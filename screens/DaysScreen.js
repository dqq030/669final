import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ImageBackground,
} from "react-native";
import { Input, Button, Overlay, Icon } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { getDaysThunk } from "../features/daySlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState, useMemo } from "react";
import { subscribeToUserUpdates } from "../features/authSlice";
import { loadUser, updateUser } from "../features/authSlice";
import { getAuthUser } from "../AuthManager";

function DaysScreen(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDaysThunk());
    subscribeToUserUpdates(dispatch);
    dispatch(loadUser(getAuthUser()));
  }, []);

  const { navigation, route } = props;

  const authUser = useSelector((state) => state.authSlice.authUser);
  console.log("authUser", authUser);

  // const [overlayVisible, setOverlayVisible] = useState(false);
  const [sort, setSort] = useState(authUser?.sort);
  const [layout, setLayout] = useState(authUser?.layout);

  const initialListItemsAll = useSelector((state) => state.day.value);
  const initialListItems = useMemo(() => {
    return initialListItemsAll.filter((item) =>
      item.owners.includes(authUser?.key)
    );
  }, [initialListItemsAll, authUser]);
  const [listItems, setListItems] = useState(initialListItems);

  const sortedListItems = useMemo(() => {
    if (sort === "longevity") {
      return [...listItems].sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (sort === "upcoming") {
      const now = new Date();
      return [...listItems].sort(
        (a, b) =>
          Math.abs(new Date(a.date) - now) - Math.abs(new Date(b.date) - now)
      );
    }
    return listItems;
  }, [listItems, sort]);

  const formattedDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const dayOfMonth = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${dayOfMonth}`;
  };

  useEffect(() => {
    setListItems(initialListItems);
  }, [initialListItems]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 0.33, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setSort(sort === "longevity" ? "upcoming" : "longevity");
              dispatch(
                updateUser({
                  ...authUser,
                  sort: sort === "longevity" ? "upcoming" : "longevity",
                })
              );
            }}
          >
            <Icon
              name="sort"
              size={28}
              color="black"
              style={{
                paddingLeft: 9,
                transform: [{ scaleY: sort === "longevity" ? -1 : 1 }],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLayout(layout === "list" ? "gallery" : "list");
              dispatch(
                updateUser({
                  ...authUser,
                  layout: layout === "list" ? "gallery" : "list",
                })
              );
            }}
          >
            <Ionicons
              name={layout === "list" ? "list" : "grid-outline"}
              size={26}
              color="black"
              style={{ paddingLeft: 14, paddingTop: 1 }}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            textAlign: "left",
            fontSize: 26,
            flex: 0.6,
            fontWeight: 600,
          }}
        >
          YOUR DAYS
        </Text>
        <TouchableOpacity
          style={[styles.button, { flex: 0.1, paddingRight: 9 }]}
          onPress={() => {
            navigation.navigate("Edit", {
              item: { key: -1, text: "" },
            });
          }}
        >
          <Ionicons name="add-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {layout === "list" ? (
          <FlatList
            data={sortedListItems}
            keyExtractor={(item, idx) => item.key + idx}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  navigation.navigate("Details", { item });
                }}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{formattedDate(item.date)}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <FlatList
              data={sortedListItems}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
              keyExtractor={(item, idx) => item.key + idx}
              renderItem={({ item }) => {
                const defaultImage =
                  "https://firebasestorage.googleapis.com/v0/b/finalproj-d2c1b.firebasestorage.app/o/images%2Fblue-sky-1505848_1280.jpg?alt=media&token=931856bb-343a-475f-847a-a37da865e9ac";
                const imageUri = item.picture ? item.picture : defaultImage;
                return (
                  <TouchableOpacity
                    // style={styles.item}
                    style={{
                      marginBottom: 18,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                      width: "47%",
                    }}
                    onPress={() => {
                      navigation.navigate("Details", { item });
                    }}
                  >
                    <ImageBackground
                      source={{ uri: imageUri }}
                      style={styles.imageBackground}
                      imageStyle={{ borderRadius: 8 }}
                    >
                      <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>
                          {formattedDate(item.date)}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>
      {/* <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={styles.overlayView}
      >
        <Text
          style={{ marginHorizontal: 70, marginVertical: 10, fontSize: 20 }}
        >
          Sort By:
        </Text>
        <Button
          title="Longevity"
          style={{ marginVertical: 10 }}
          onPress={() => {
            setSort("longevity");
            setOverlayVisible(false);
          }}
          buttonStyle={
            sort === "longevity"
              ? styles.selectedButton
              : styles.unSelectedButton
          }
          titleStyle={
            sort === "longevity" ? styles.selectedText : styles.unselectedText
          }
        />
        <Button
          title="Upcoming"
          onPress={() => {
            setSort("upcoming");
            setOverlayVisible(false);
          }}
          buttonStyle={
            sort === "upcoming"
              ? styles.selectedButton
              : styles.unSelectedButton
          }
          titleStyle={
            sort === "upcoming" ? styles.selectedText : styles.unselectedText
          }
        />
      </Overlay> */}
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
  unSelectedButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
  },
  selectedButton: {
    backgroundColor: "#007FFF",
  },
  selectedText: {
    color: "white",
  },
  unselectedText: {
    color: "grey",
  },
  overlayView: {
    padding: 25,
  },
  item: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 9,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    // padding: 7,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
    flex: 1.5,
    margin: 15,
  },
  date: {
    fontSize: 16,
    // color: "#666",
    flex: 1,
    margin: 15,
  },
  imageBackground: {
    height: 145,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  textContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 8,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DaysScreen;

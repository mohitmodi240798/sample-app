import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type RootStackParamList = {
  DetailsScreen: { data: any };
};

export default function Home() {
  const [loader, setLoader] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isListEnd, setIsListEnd] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    console.log(offset);
    if (!loader && !isListEnd) {
      console.log("getData");
      setLoader(true);
      // Service to get the data from the server to render
      fetch(
        "http://hn.algolia.com/api/v1/search_by_date?tags=story&page=" + offset
      )
        .then((response) => response.json())
        .then((responseJson: any) => {
          if (responseJson.hits.length > 0) {
            setOffset(offset + 1);
            setDataSource([...dataSource, ...responseJson.hits]);
            setLoader(false);
          } else {
            setIsListEnd(true);
            setLoader(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {loader ? (
          <ActivityIndicator
            size={"large"}
            color="black"
            style={{ margin: 15 }}
          />
        ) : null}
      </View>
    );
  };

  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.tableData}
        onPress={() => navigation.navigate("DetailsScreen", { data: item })}
      >
        <View style={[styles.borderView]}>
          <Text style={false ? styles.forTableheader : styles.pricingTableText}>
            {item.author}
          </Text>
        </View>

        <View style={styles.pricingTableContainer}>
          <Text style={false ? styles.forTableheader : styles.pricingTableText}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(item.url)}
          style={[styles.borderView]}
        >
          <Text style={false ? styles.forTableheader : styles.pricingTableText}>
            {item.url}
          </Text>
        </TouchableOpacity>

        <View style={styles.pricingTableContainer}>
          <Text style={false ? styles.forTableheader : styles.pricingTableText}>
            {item.created_at}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 22 }}>
      <FlatList
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ListFooterComponent={renderFooter}
        onEndReached={getData}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pricingTableText: {
    marginHorizontal: 20,
    fontSize: 12,
    lineHeight: 14,
    textAlign: "left",
  },
  forTableheader: {
    fontSize: 12,
    lineHeight: 21,
    marginHorizontal: 20,
    textAlign: "left",
  },
  borderView: {
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#00000029",
    width: "25%",
    height: "100%",
    // marginBottom:10,
  },
  tableData: {
    flexDirection: "row",
    width: "100%",
    // height: 120,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  pricingTableContainer: {
    paddingVertical: 8,
    width: "25%",
    height: "100%",
    // marginBottom:10,
    borderWidth: 1,
    borderColor: "#00000029",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

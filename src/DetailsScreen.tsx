import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function DetailsScreen(props: any) {
  const data = props.route?.params.data;

  return (
    <SafeAreaView style={styles.container}>
      <Text>{JSON.stringify(data)}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

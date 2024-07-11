import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CustomInput from "../../Global/Components/CustomInput";
import Feather from "@expo/vector-icons/Feather";

const leadStatus = [
  { id: 1, content: "All Leads" },
  { id: 2, content: "Just Now" },
  { id: 3, content: "My Leads" },
  { id: 4, content: "Site Visit" },
  { id: 5, content: "Pipeline" },
  { id: 6, content: "Reminders" },
];

function LeadStatus() {
  const [selectedCard, setSelectedCard] = useState<number>(1);

  const handleCardPress = (id: number) => {
    setSelectedCard(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {leadStatus.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCardPress(item.id)}
          >
            <View
              style={[
                styles.card,
                selectedCard === item.id && styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  styles.cardText,
                  selectedCard === item.id && styles.selectedCardText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.searchContainer}>
        <CustomInput placeHolder="Search..." style={styles.searchInput} />
        <TouchableOpacity style={styles.sliderIcon}>
          <Feather
            name="sliders"
            size={24}
            color="black"
            style={styles.feather}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  horizontalScroll: {
    // marginLeft: 10,
    flexDirection: "row",
  },
  card: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
    height: 50,
    width: 125,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "blue",
  },
  cardText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedCardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    marginTop: 10,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  sliderIcon: {
    marginLeft: 10,
  },
  feather: {
    position: "absolute",
    bottom: 15,
    right: 15,
    padding: 5,
  },
});

export default LeadStatus;

import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface LeadStatusProps {
  selectedCard: number;
  setSelectedCard: (id: number) => void;
  onSearchChange: (query: string) => void; 
}

const leadStatus = [
  { id: 1, content: "All Leads" },
  { id: 2, content: "Just Now" },
  { id: 3, content: "My Leads" },
  { id: 4, content: "Site Visit" },
  { id: 5, content: "Pipeline" },
  { id: 6, content: "Reminders" },
];

function LeadStatus({ selectedCard, setSelectedCard ,onSearchChange }: LeadStatusProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { leadData } = useSelector((state: RootState) => state.auth);
  const { privileges } = useSelector((state: RootState) => state.auth);
  const [dashboardView, setDashboardView] = useState<any>([
    "HR",
    "CRM",
    "MY-Dashboard",
    "ADMIN",
  ]);

  const handleCardPress = (id: number) => {
    setSelectedCard(id);
  };

  useEffect(() => {
    const index = leadStatus.findIndex(item => item.id === selectedCard);
    if (index === -1) {
      return;
    }
    const cardWidth =5; 
    const margin = 10; 
    const offset = (cardWidth + margin) * index;
    console.log('Scrolling to offset::::::::', offset);
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: offset, animated: true });
      }, 100);
    }
  }, [selectedCard]);

  const getPermissionForView = () => {
    const permissionObj: Record<string, boolean> = {};
    dashboardView?.forEach((view: string) => {
      const currVal = privileges[view];
      permissionObj[view] = currVal?.length ? true : false || false;
    });
    return permissionObj;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            const index = leadStatus.findIndex(item => item.id === selectedCard);
            if (index !== -1) {
              const cardWidth = 5;
              const margin = 10;
              const offset = (cardWidth + margin) * index;
              scrollViewRef.current.scrollTo({ x: offset, animated: true });
            }
          }
        }}
      >
        {leadStatus.map((item,index) => (
          //  item.id !== 1 &&  privileges['All Lead'].length === 0 &&
          item.id == 1 ? 
           privileges['All Lead'].length > 0 ?  <TouchableOpacity
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
                  selectedCard === item.id && styles.selectedCardText, globalStyles.h7,globalStyles.fs3
                ]}  allowFontScaling={false}
              >
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
          :""
          :
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
                  selectedCard === item.id && styles.selectedCardText,  globalStyles.h7,globalStyles.fs3
                ]}  allowFontScaling={false}
              >
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search..."
          style={styles.textInput}
          onChangeText={(text) => onSearchChange(text)} 
        />
        {/* <Image
          source={require("../../assets/filter_icon.png")}
          style={styles.filterIcon}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  card: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
    height: 38,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "#3D48E5",
  },
  cardText: {
    color: "black",
  },
  selectedCardText: {
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  filterIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default LeadStatus;

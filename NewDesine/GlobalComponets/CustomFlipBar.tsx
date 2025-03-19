import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface LeadStatusProps {
  selectedCard: number;
  setSelectedCard: (id: number) => void;
  leadData: any[];
  dataMyLead:any[];
  teamLeadData:any[];
  myLeadProspect:any[]
  myLeadStageOpportunity :any[]
  myLeadStageClosure :any[]
  allContect :any[]
  userType :string
  myleadSatgeShow :[]
}

const CustomFlipBar: React.FC<LeadStatusProps> = ({ selectedCard, setSelectedCard, leadData,dataMyLead,teamLeadData,myLeadProspect,myLeadStageOpportunity,myLeadStageClosure,allContect,userType,myleadSatgeShow }) => {
  const listRef = useRef<FlatList>(null);
  const itemWidths = useRef<{ [key: number]: number }>({});
  const { privileges } = useSelector((state: RootState) => state.auth);
console.log(myleadSatgeShow,'myleadSatgeShowmyleadSatgeShow::::::::::::::::');

  
  const defaultWidth = 80;
  const data = useMemo(
    () => [
      { id: 1, title: "All Leads", count: leadData?.length || 0 },
      { id: 3, title: "All", count: dataMyLead?.length || 0 },
      {id:7, title: "Leads", count: myleadSatgeShow?.length || 0 },
      { id: 2, title: "Contact", count: allContect?.length || 0 },
      { id: 4, title: "Prospect", count: myLeadProspect?.length || 0 },
      { id: 5, title: "Opportunity", count: myLeadStageOpportunity?.length || 0 },
      { id: 6, title: "Closure", count: myLeadStageClosure?.length || 0 },
   
     
    ],
    [leadData,dataMyLead,teamLeadData,myLeadProspect,myLeadStageOpportunity,myLeadStageClosure,myleadSatgeShow]
  );

  const filteredLeadStatus = useMemo(
    () =>
      data.filter(
        (item) =>
          (item.id !== 1 || privileges["All Lead"]?.length > 0) && 
          (userType !== "1" || item.id !== 2) && 
          (userType !== "0" || (item.id !== 5 && item.id !== 6)) 
      ),
    [data, privileges, userType]
  );
  

  const scrollToSelectedCard = (selectedCardId: number) => {
    if (selectedCardId === 1 || !listRef.current) return;
    const index = filteredLeadStatus.findIndex((item) => item.id === selectedCardId);
    if (index !== -1) {
      listRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
    }
  };

  useEffect(() => {
    scrollToSelectedCard(selectedCard);
  }, [selectedCard]);

  const handleCardPress = (id: number) => {
    setSelectedCard(id);
    scrollToSelectedCard(id);
  };

  const renderItem = ({ item }: { item: { id: number; title: string; count: number } }) => {
    const isSelected = selectedCard === item.id;
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleCardPress(item.id)}
        onLayout={(event) => (itemWidths.current[item.id] = event.nativeEvent.layout.width)}
      >
        <Text
          style={[
            globalStyles.h7,
            globalStyles.fs3,
            globalStyles.tc,
            { color: isSelected ? "#fff" : "#000" },
          ]}
          allowFontScaling={false}
        >
          {item.title}
        </Text>
        <View style={[styles.countContainer, isSelected && styles.selectedCount]}>
          <Text
            style={[
              globalStyles.h8,
              globalStyles.fs3,
              globalStyles.tc,
              { color: isSelected ? "#3F8CFF" : "#000" },
            ]}
            allowFontScaling={false}
          >
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={filteredLeadStatus}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        getItemLayout={(data, index) => ({
          length: itemWidths.current[data[index]?.id] || defaultWidth,
          offset: (itemWidths.current[data[index]?.id] || defaultWidth) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedItem: {
    backgroundColor: "#3F8CFF",
  },
  countContainer: {
    marginLeft: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectedCount: {
    backgroundColor: "#fff",
  },
});

export default CustomFlipBar;

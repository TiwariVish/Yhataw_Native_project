import React, { useEffect, useRef, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import FlipButtonBar from "../../Global/Components/FlipButtonBar";
import { RootState } from "../../utils/store";

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

const LeadStatus: React.FC<LeadStatusProps> = ({
  selectedCard,
  setSelectedCard,
  onSearchChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { privileges } = useSelector((state: RootState) => state.auth);

  const handleCardPress = (id: number) => {
    setSelectedCard(id);
  };

  const scrollToSelectedCard = (selectedCardId: number) => {
    const index = leadStatus.findIndex((item) => item.id === selectedCardId);
    if (index !== -1 && scrollViewRef.current) {
      const buttonWidth = 50; 
      const offset = index * buttonWidth; 
      console.log(offset, "offset"); 
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  useEffect(() => {
    if (selectedCard) {
      scrollToSelectedCard(selectedCard);
    }
  }, [selectedCard]);

  const filteredLeadStatus = useMemo(() => {
    return leadStatus.filter(
      (item) => item.id !== 1 || privileges["All Lead"].length > 0
    );
  }, [privileges]);

  return (
    <View>
      <FlipButtonBar
        segments={filteredLeadStatus.map((item) => item.content)}
        showSearch={true}
        selectedSegment={leadStatus[selectedCard - 1]?.content}
        onSegmentChange={(segment: string) => {
          const selectedStatus = leadStatus.find((item) => item.content === segment);
          if (selectedStatus) {
            handleCardPress(selectedStatus.id);
          }
        }}
        onSearchChange={onSearchChange}
        scrollViewRef={scrollViewRef} 
        style={{ padding: 10 }}
      />
    </View>
  );
};

export default LeadStatus;

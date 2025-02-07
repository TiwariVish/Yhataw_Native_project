import React, { useRef, useState } from "react";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FlipBarItemProps {
  item: { id: number; title: string; count: number };
  selectedCard: number;
  onSelect: (id: number) => void;
  itemWidths: React.MutableRefObject<{ [key: number]: number }>;
}

const FlipBarItem: React.FC<FlipBarItemProps> = ({ item, selectedCard, onSelect, itemWidths }) => {
  return (
    <TouchableOpacity
      style={[styles.item, selectedCard === item.id && styles.selectedItem]}
      onPress={() => onSelect(item.id)}
      onLayout={(event) => {
        itemWidths.current[item.id] = event.nativeEvent.layout.width;
      }}
    >
      <Text style={[styles.itemText, selectedCard === item.id && styles.selectedText]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

interface CustomFlipBarButtonProps {
  data: { id: number; title: string; count: number }[];
}

const CustomFlipBarButton: React.FC<CustomFlipBarButtonProps> = ({ data }) => {
  // Default to the first item's ID if data is available
  const [selectedCard, setSelectedCard] = useState<number | null>(data.length > 0 ? data[0].id : null);
  const itemWidths = useRef<{ [key: number]: number }>({});
  const listRef = useRef<FlatList<any>>(null);

  // Handle item selection and update the selected card
  const handleSelect = (id: number) => {
    setSelectedCard(id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={data}
        renderItem={({ item }) => (
          <FlipBarItem
            item={item}
            selectedCard={selectedCard!}
            onSelect={handleSelect}
            itemWidths={itemWidths}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        getItemLayout={(data, index) => ({
          length: itemWidths.current[data[index]?.id] || 100,
          offset: (itemWidths.current[data[index]?.id] || 100) * index,
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
    backgroundColor: "#3F8CFF", // Highlight color for selected item
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
  selectedText: {
    color: "#fff", // Text color when item is selected
  },
});

export default CustomFlipBarButton;

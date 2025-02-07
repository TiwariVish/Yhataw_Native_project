import React, { useRef } from "react";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FlipBar = ({ data, selectedItem, onSelect, containerStyle, itemStyle }) => {
  const listRef = useRef(null);
  const itemWidths = useRef({});

  const handleCardPress = (id) => {
    onSelect(id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        itemStyle,
        selectedItem === item.id && styles.selectedItem,
      ]}
      onPress={() => handleCardPress(item.id)}
      onLayout={(event) => {
        itemWidths.current[item.id] = event.nativeEvent.layout.width;
      }}
    >
      <Text style={[styles.text, selectedItem === item.id && styles.selectedText]}>
        {item.title}
      </Text>
      <View style={[styles.countContainer, selectedItem === item.id && styles.selectedCount]}>
        <Text style={[styles.countText, selectedItem === item.id && styles.selectedText]}>
          {item.count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
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
    backgroundColor: "#3F8CFF",
  },
  text: {
    fontSize: 14,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
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
  countText: {
    fontSize: 12,
  },
});

export default FlipBar;

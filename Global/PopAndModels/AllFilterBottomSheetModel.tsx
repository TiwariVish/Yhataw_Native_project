import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Checkbox } from "react-native-paper";
import { getStage } from "../../Components/Screens/LeadInfoScreenService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

const { height: screenHeight } = Dimensions.get("window");

const FilterBottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);
  const [selectedCategory, setSelectedCategory] = useState("Stage");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [allData, setAllData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState<any>([]);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  useEffect(() => {
    getLeadStage();
  }, []);

  useEffect(() => {
    const newData =
      selectedCategory === "Stage"
        ? allData.filter((item) => item.stage_Name)
        : selectedCategory === "Form"
        ? allData.filter((item) => item.form_Name)
        : allData.filter((item) => item.dateRange_Name);

    setFilteredData(newData);
  }, [selectedCategory, allData]);

  const getLeadStage = async () => {
    try {
      const resData = await getStage();
      setAllData(resData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterOptions = [
    { label: "Stage", key: "Stage" },
    { label: "Form", key: "Form" },
    { label: "Date Range", key: "DateRange" },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
      {visible && (
        <BlurView intensity={100} tint="dark" style={styles.blurView}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.header}>
              <Text
                style={[globalStyles.h5, globalStyles.fs1, globalStyles.tc]}
                allowFontScaling={false}
              >
                Filters
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedFilters([]);
                }}
              >
                <Text
                  style={[globalStyles.h7, globalStyles.fs3, globalStyles.tc5]}
                  allowFontScaling={false}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
              {/* Left Section */}
              <View style={styles.leftColumn}>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterItem,
                      selectedCategory === option.key &&
                        styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedCategory === option.key && { color: "white" },
                      ]}
                      allowFontScaling={false}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Right Section */}
              <ScrollView style={styles.rightColumn}>
                {/* Select All Checkbox */}
                {filteredData.length > 0 && (
                  <View style={styles.selectAllRow}>
                    <Checkbox
                      status={
                        selectedFilters.length ===
                        filteredData.flatMap(
                          (item) => item.sub_Stage_name || []
                        ).length
                          ? "checked"
                          : selectedFilters.length > 0
                          ? "indeterminate"
                          : "unchecked"
                      }
                      onPress={() => {
                        const allIds = filteredData.flatMap((item) =>
                          item.sub_Stage_name
                            ? item.sub_Stage_name.map((sub) => sub._id)
                            : []
                        );
                        setSelectedFilters(
                          selectedFilters.length === allIds.length ? [] : allIds
                        );
                      }}
                      color="#3F8CFF"
                    />
                    <Text
                      style={[
                        globalStyles.h7,
                        globalStyles.fs1,
                        globalStyles.tc,
                      ]}
                      allowFontScaling={false}
                    >
                      Select All
                    </Text>
                  </View>
                )}

                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <View key={item._id} style={{ marginTop: 10 }}>
                      <Text
                        style={[
                          globalStyles.h7,
                          globalStyles.fs1,
                          globalStyles.tc,
                        ]}
                        allowFontScaling={false}
                      >
                        {item.stage_Name ||
                          item.form_Name ||
                          item.dateRange_Name}
                      </Text>

                      {item.sub_Stage_name?.length > 0 && (
                        <View>
                          {item.sub_Stage_name.map((subItem) => (
                            <View key={subItem._id} style={styles.checkboxRow}>
                              <Checkbox
                                status={
                                  selectedFilters.includes(subItem._id)
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() =>
                                  setSelectedFilters((prev) =>
                                    prev.includes(subItem._id)
                                      ? prev.filter((id) => id !== subItem._id)
                                      : [...prev, subItem._id]
                                  )
                                }
                                color="#3F8CFF"
                              />
                              <Text
                                style={[
                                  globalStyles.h8,
                                  globalStyles.fs3,
                                  globalStyles.tc,
                                ]}
                                allowFontScaling={false}
                              >
                                {subItem.stage_Name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text>No data available</Text>
                )}
              </ScrollView>
            </View>
            <View style={styles.footer}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <TouchableOpacity onPress={onClose}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fs3, globalStyles.tc]}
                    allowFontScaling={false}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <TouchableOpacity>
                  <Text
                    style={[
                      globalStyles.h7,
                      globalStyles.fs3,
                      globalStyles.tc5,
                    ]}
                    allowFontScaling={false}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </BlurView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    elevation: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowContainer: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
  },
  leftColumn: {
    width: "35%",
    backgroundColor: "#f7f7f7",
  },
  filterItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedCategory: {
    backgroundColor: "#3F8CFF",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
  },
  rightColumn: {
    width: "65%",
    padding: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "10%",
    flexDirection: "row",
    justifyContent: "space-between", // Distributes items left and right
    alignItems: "center", // Ensures vertical alignment
    paddingHorizontal: 20, // Adjust spacing from the edges
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

export default FilterBottomSheet;

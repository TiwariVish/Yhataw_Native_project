import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
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
import { getAllForms } from "../../Components/Screens/DashboardService";
import Feather from "react-native-vector-icons/Feather";

const { height: screenHeight } = Dimensions.get("window");

const FilterBottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const translateY = useSharedValue(screenHeight);
  const [selectedCategory, setSelectedCategory] = useState("Stage");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [allFormData, setAllFormData] = useState<any[]>([]);
  const [value, setValue] = useState<string>(""); 
  const [filteredData, setFilteredData] = useState<any[]>();
  console.log(filteredData,'filteredDatafilteredDatafilteredData');
  
  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  useEffect(() => {
    getLeadStage();
  }, []);

  const getLeadStage = async () => {
    try {
      const [stageData, formData] = await Promise.all([
        getStage(),
        getAllForms(),
      ]);
      setAllData(stageData.data);
      setAllFormData(formData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const memoizedFilteredData  = useMemo(() => {
    switch (selectedCategory) {
      case "Stage":
        return allData.filter((item) => item.stage_Name);
      case "form":
        return allFormData.filter((item) => item.form_Name);
      case "dateRange":
        return allData.filter((item) => item.dateRange_Name);
      default:
        return [];
    }
  }, [selectedCategory, allData, allFormData]);

  const getAllIds = useMemo(() => {
    return [
      ...memoizedFilteredData.flatMap(
        (item) => item.sub_Stage_name?.map((sub) => sub._id) || []
      ),
      ...(selectedCategory === "form"
        ? allFormData.map((form) => form._id)
        : []),
    ];
  }, [memoizedFilteredData, selectedCategory, allFormData]);

  const handleSelectAll = () => {
    setSelectedFilters((prev) =>
      prev.length === getAllIds.length ? [] : getAllIds
    );
  };

  const isAllSelected =
    selectedFilters.length > 0 && selectedFilters.length === getAllIds.length;
  const isPartialSelected =
    selectedFilters.length > 0 && selectedFilters.length < getAllIds.length;

  const filterOptions = [
    { label: "Stage", key: "Stage" },
    { label: "Form", key: "form" },
    { label: "Date Range", key: "dateRange" },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSearch = (text: string) => {
    setValue(text);
    
    console.log("Search Query:", text);
    console.log("Selected Category:", selectedCategory);
  
    let filteredItems = [];
  
    if (selectedCategory === "Stage") {
      filteredItems = allData.filter((item) =>
        item.sub_Stage_name?.some((sub) =>
          sub.stage_Name?.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else if (selectedCategory === "form") {
      filteredItems = allFormData.filter((form) =>
        form.form_name?.toLowerCase().includes(text.toLowerCase())
      );
    }
  
    setFilteredData(filteredItems.length > 0 ? filteredItems : []);
  };
  
  
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
                <View style={styles.searchContainer}>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="search"
                      size={15}
                      color="#888"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Search..."
                      placeholderTextColor="#888"
                      value={value}
                      onChangeText={handleSearch}
                    />
            
                  </View>
                </View>

                {/* Select All Checkbox */}
                {(memoizedFilteredData.length > 0 ||
                  (selectedCategory === "form" && allFormData.length > 0)) && (
                  <View style={styles.selectAllRow}>
                    <Checkbox
                      status={
                        isAllSelected
                          ? "checked"
                          : isPartialSelected
                          ? "indeterminate"
                          : "unchecked"
                      }
                      onPress={handleSelectAll}
                      color={
                        isAllSelected || isPartialSelected
                          ? "#3F8CFF"
                          : undefined
                      }
                      uncheckedColor="#A0A0A0"
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

                {/* Main List Rendering */}
                {memoizedFilteredData.length > 0 &&
                  memoizedFilteredData.map((item) => (
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
                          item.form_name ||
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
                                uncheckedColor="#A0A0A0"
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
                  ))}

                {memoizedFilteredData.length === 0 && (
                  <View>
                    {selectedCategory === "dateRange" ? (
                      <Text>Date Picker</Text>
                    ) : selectedCategory === "form" ? (
                      allFormData.length > 0 ? (
                        <View>
                          {allFormData.map((subItem) => (
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
                                uncheckedColor="#A0A0A0"
                              />
                              <Text
                                style={[
                                  globalStyles.h8,
                                  globalStyles.fs3,
                                  globalStyles.tc,
                                ]}
                                allowFontScaling={false}
                              >
                                {subItem.form_name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text>No Forms Available</Text>
                      )
                    ) : (
                      <Text>No data available</Text>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
            <View style={styles.footer}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <TouchableOpacity onPress={onClose}>
                  <Text
                    style={[globalStyles.h7, globalStyles.fs3, globalStyles.tc]}
                    allowFontScaling={false}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
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
    // position: "absolute",
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
    height: screenHeight - 80
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRow: {
    marginBottom: 10,
    paddingRight: 5,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    height: 60,
    paddingHorizontal: 20,
  },
  searchContainer: {
 
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,  
  borderColor: "#ccc",  
    borderRadius: 5,
 
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  icon: {
    marginLeft: 5,
  },
});

export default FilterBottomSheet;

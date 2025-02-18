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
import store from "../../utils/store";
import { getAllUsersMyLead } from "../../Components/Screens/LeadsService";

const { height: screenHeight } = Dimensions.get("window");

const FilterBottomSheet: React.FC<{
  visible: boolean;
  selectedStagesLocal:any[]
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}> = ({ visible, onClose,onApplyFilters,selectedStagesLocal  }) => {
  const translateY = useSharedValue(screenHeight);
  const [selectedCategory, setSelectedCategory] = useState("Stage");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [allFormData, setAllFormData] = useState<any[]>([]);
  const [value, setValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>();

  const [selectedStages, setSelectedStages] = useState([]);
  const [localSelectedStages, setLocalSelectedStages] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  // useEffect(() => {
  //   if (selectedCategory === "form" && allFormData.length > 0) {
  //     setSelectedFilters(allFormData.map((item) => item._id));
  //   }
  // }, [allFormData, selectedCategory]);
  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  useEffect(() => {
    console.log("Updated Filters: ", selectedFilters);
    console.log("Updated Stages: ", selectedStages);
  }, [selectedFilters, selectedStages]);


  useEffect(() => {
    setLocalSelectedStages(selectedStagesLocal); 
  }, [selectedStagesLocal]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const payload = {
        pageNo: paginationModel.page,
        pageSize: paginationModel.pageSize,
        search: selectedCategory === "form" ? value : "",
      };

      if (selectedCategory === "Stage") {
        const stageData = await getStage();
        setAllData(stageData.data);
      } else if (selectedCategory === "form") {
        const formData = await getAllForms(payload);
        setAllFormData(formData.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const memoizedFilteredData = useMemo(() => {
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
    const allIds = getAllIds; 
    setSelectedFilters((prev) => 
      prev.length === allIds.length ? [] : allIds
    );
    setSelectedStages((prev) => 
      prev.length === allIds.length ? [] : allIds
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
    let filteredItems = [];
    if (selectedCategory === "Stage") {
    } else if (selectedCategory === "form") {
      fetchData();
    }

    setFilteredData(filteredItems.length > 0 ? filteredItems : []);
  };

  const handleFilterSelectionStage = (subItem) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.includes(subItem._id);
      const updatedFilters = isSelected
        ? prev.filter((id) => id !== subItem._id)
        : [...prev, subItem._id];
  
      setSelectedStages((prevStages) => {
        const updatedStages = isSelected
          ? prevStages.filter((stageName) => stageName !== subItem.stage_Name)
          : [...prevStages, subItem.stage_Name];
        setLocalSelectedStages(updatedStages);
        return updatedStages;
      });
  
      return updatedFilters;
    });
  };
 

  const handleFilterData = async () => {
  setTimeout(() => { 
    let formId;
    let stage = selectedStages.join(",");

    if (selectedCategory === "form") {
      formId = selectedFilters.length === getAllIds.length ? getAllIds : selectedFilters;
    } else if (selectedCategory === "Stage") {
      stage = selectedStages.join(",");
    }

    const filters = {
      formId,
      stage,
      selectedFilters,
    };

    console.log("Applying Filters: ", filters);
    onApplyFilters(filters);
    onClose();
  }, 0);
};
  return (
    <>
      {visible && (
        <BlurView intensity={100}  style={styles.blurView}>
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
                        globalStyles.h7,
                        globalStyles.fs1,
                        globalStyles.tc,
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
                  <View>
                   <TouchableOpacity onPress={handleSelectAll}  style={styles.selectAllRow}>
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
                   </TouchableOpacity>
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
                              <View style={{ transform: [{ scale: 0.7 }] }}>
                              <Checkbox
                                status={
                                  (selectedFilters.includes(subItem._id) || localSelectedStages.includes(subItem.stage_Name))
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() =>
                                  handleFilterSelectionStage(subItem)
                                }
                                // onPress={() =>
                                //   setSelectedFilters((prev) =>
                                //     prev.includes(subItem._id)
                                //       ? prev.filter((id) => id !== subItem._id)
                                //       : [...prev, subItem._id]
                                //   )
                                // }
                                color="#3F8CFF"
                                uncheckedColor="#A0A0A0"
                              />
                                 </View>
                                 <TouchableOpacity   onPress={() =>
                                  handleFilterSelectionStage(subItem)
                                }>
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
                      </TouchableOpacity>
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
                          {allFormData.map((item) => (
                            <View key={item._id} style={styles.checkboxRow}>
                              <View style={{ transform: [{ scale: 0.7 }]}}>
                              <Checkbox
                                status={
                                  selectedFilters.includes(item._id)
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() =>
                                  setSelectedFilters((prev) =>
                                    prev.includes(item._id)
                                      ? prev.filter((id) => id !== item._id)
                                      : [...prev, item._id]
                                  )
                                }
                                color="#3F8CFF"
                                uncheckedColor="#A0A0A0"
                              />
                              </View>
                              <TouchableOpacity     onPress={() =>
                                  setSelectedFilters((prev) =>
                                    prev.includes(item._id)
                                      ? prev.filter((id) => id !== item._id)
                                      : [...prev, item._id]
                                  )
                                }>

                              <Text
                                style={[
                                  globalStyles.h8,
                                  globalStyles.fs3,
                                  globalStyles.tc,
                                ]}
                                allowFontScaling={false}
                              >
                                {item.form_name}
                              </Text>
                              </TouchableOpacity>
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
                <TouchableOpacity onPress={handleFilterData}>
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
    textAlign: "left",
  },
  rightColumn: {
    width: "65%",
    padding: 10,
    height: screenHeight - 80,
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

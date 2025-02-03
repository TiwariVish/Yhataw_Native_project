import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { getTeamList } from "../../Components/Screens/DashboardService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface MemberPopOverProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string[]) => void;
}

interface DropdownItem {
  id: string;
  team_name: string;
  checked: boolean;
}

const MemberPopOver: React.FC<MemberPopOverProps> = ({
  visible,
  onClose,
  onStatusSelect,
}) => {
  const [memberdropdownItems, setMemberDropdownItems] = useState<
    DropdownItem[]
  >([]);
  const { leadData } = useSelector((state: RootState) => state.auth);

  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8, {
      damping: 20,
      stiffness: 150,
    });
    opacity.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
    if (visible) {
      getMemberLeadStage();
    }
  }, [visible]);

  const getMemberLeadStage = async () => {
    try {
      const res = await getTeamList();
      setMemberDropdownItems(res.data);
      handleCheckboxChange(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (items: DropdownItem[]) => {
    const updatedItems = items.map((item) => {
      const isChecked = leadData.AssignTo.some(
        (assignItem) => assignItem.team_name === item.team_name
      );
      return { ...item, checked: isChecked };
    });
    setMemberDropdownItems(updatedItems);
    const selectedTeams = updatedItems
      .filter((item) => item.checked)
      .map((item) => item.team_name);
    onStatusSelect(selectedTeams);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <BlurView style={styles.blurView} intensity={200}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <ScrollView contentContainerStyle={styles.dropdownMenu}>
                {memberdropdownItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checkboxItem}
                    // onPress={() => toggleCheckbox(item.id)}
                  >
                    {/* <View style={styles.checkboxContainer}>
                      <View
                        style={[
                          styles.checkbox,
                          item.checked && styles.checkboxChecked,
                        ]}
                      />
                      <Text style={[globalStyles.h5,globalStyles.fontfm]} allowFontScaling={false}>{item.team_name}</Text>
                    </View> */}
                    <View style={styles.checkboxContainer}>
                      {item.checked ? (
                        <MaterialCommunityIcons
                          name="checkbox-marked"
                          size={24}
                          color="#3D48E5"
                        />
                      ) : (
                        <MaterialIcons
                          name="check-box-outline-blank"
                          size={24}
                          color="#565F6C"
                        />
                      )}
                      <Text
                        style={[globalStyles.h5, globalStyles.fontfm,styles.checkboxChecked,{ color: item.checked ? "#3D48E5" : "#565F6C" },]}
                        allowFontScaling={false}
                      >
                        {item.team_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </BlurView>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    width: 300,
    maxHeight: 500,
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownMenu: {
    width: "100%",
  },
  checkboxItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  checkboxChecked: {
    // backgroundColor: "#000",
    paddingLeft:10
  },
});

export default MemberPopOver;

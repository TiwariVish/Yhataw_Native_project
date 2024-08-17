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
import { getAllTeamMembersData } from "../../Components/Screens/LeadInfoScreenService";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AssignedMemberPop {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}

interface DropdownItem {
  id: string;
  team_name: string;
  checked: boolean;
}

const AssignedMemberPop: React.FC<AssignedMemberPop> = ({
  visible,
  onClose,
  onStatusSelect,
}) => {
  const [memberdropdownItems, setMemberDropdownItems] = useState<
    DropdownItem[]
  >([]);
  const [isteamMembers, setIsteamMembers] = useState<any>([]);
  const [isuserData,setisuserData] = useState<any>([])
  const { leadData } = useSelector((state: RootState) => state.auth);
  const assignToIds = leadData.AssignTo.map((item) => item._id);

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
    if (assignToIds.length > 0) {
      getMemberLeadStage(assignToIds);
    }
  }, [visible]);

  const getMemberLeadStage = async (ids: any) => {
    try {
      const payload = {
        team_id: ids,
      };
      const res = await getAllTeamMembersData(payload);
      setIsteamMembers(res.data);
    } catch (error) {
      console.error('API Error:', error); 
    }
  };
  console.log(isteamMembers,'====isteamMembersisteamMembers================================');


  const userNames = isteamMembers.team_members?.map((member: any) => member);

  console.log(userNames, 'teamMembers');
  

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleCheckboxChange = (id: string) => {
    const updatedItems = memberdropdownItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setMemberDropdownItems(updatedItems);
  };

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        >
          <BlurView style={styles.blurView} intensity={200}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <ScrollView contentContainerStyle={styles.dropdownMenu}>
                {userNames?.map((name, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxItem}
                    onPress={() => handleCheckboxChange(name)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View style={styles.checkbox} />
                      <Text style={styles.checkboxText}>{name}</Text>
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
    justifyContent: "center",
    alignItems: "center",
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
    width: screenWidth * 0.8, // Adjust width as needed
    maxHeight: screenHeight * 0.6, // Adjust height as needed
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
    backgroundColor: "#000",
  },
  checkboxText: {
    fontSize: 16,
    color: "black",
  },
});

export default AssignedMemberPop;

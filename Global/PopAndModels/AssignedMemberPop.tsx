import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { assignToMembers, getAllTeamMembersData } from "../../Components/Screens/LeadInfoScreenService";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AssignedMemberPopProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (selectedItems: any[]) => void; 
}

const AssignedMemberPop: React.FC<AssignedMemberPopProps> = ({
  visible,
  onClose,
  onStatusSelect,
}) => {
  const [userData, setUserData] = useState<any[]>([]); 
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
    if (visible) {
      fetchMemberLeadStage(assignToIds);
    }
  }, [visible]);

  const fetchMemberLeadStage = async (ids: string[]) => {
    try {
      const payload = { team_id: ids };
      const res = await getAllTeamMembersData(payload);
      const members = res.data.flatMap((team) =>
        team.team_members.flatMap((member) => member.users)
      );
      const updatedMembers = members.map((item) => ({ ...item, checked: false }));
      setUserData(updatedMembers);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const toggleCheckbox = useCallback((id: string) => {
    setUserData((prevData) => {
      const updatedItems = prevData.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      );
      const selectedItems = updatedItems.filter((item) => item.checked);
      if (selectedItems.length > 0) {
        onStatusSelect(selectedItems);
      }
      return updatedItems;
    });
  }, [onStatusSelect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const renderCheckboxItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.checkboxItem}
      onPress={() => toggleCheckbox(item._id)}
    >
      <View style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            item.checked && styles.checkboxChecked,
          ]}
        />
        <Text style={[globalStyles.h5, globalStyles.fontfm]} allowFontScaling={false}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    visible && (
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <BlurView style={styles.blurView} intensity={200}>
          <Animated.View style={[styles.modal, animatedStyle]}>
            <FlatList
              data={userData}
              keyExtractor={(item) => item._id || item.id}
              renderItem={renderCheckboxItem}
              contentContainerStyle={styles.dropdownMenu}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    )
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
    width: screenWidth * 0.8,
    maxHeight: screenHeight * 0.6,
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
});

export default AssignedMemberPop;

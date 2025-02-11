import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface AssignedMemberPopProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (selectedItems: any[]) => void;
  selectedMembers: any[];
}

const AssignedMemberPop: React.FC<AssignedMemberPopProps> = ({
  visible,
  onClose,
  onStatusSelect,
  selectedMembers,
}) => {
  const [userData, setUserData] = useState<any[]>([]);
  const { leadData } = useSelector((state: RootState) => state.auth);
  const assignToIds = useMemo(() => leadData.AssignTo.map((item) => item._id), [leadData]);

  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8, { damping: 20, stiffness: 150 });
    opacity.value = withSpring(visible ? 1 : 0, { damping: 20, stiffness: 150 });

    if (visible && leadData?._id) {
      fetchMemberLeadStage(assignToIds, leadData._id);
    }
  }, [visible, leadData]);

  const fetchMemberLeadStage = async (ids: string[], id: string) => {
    try {
      const payload = { team_id: ids, lead_id: id };
      const res = await getAllTeamMembersData(payload);

      if (!res?.data || !Array.isArray(res.data)) {
        console.error("Invalid data structure returned from the API");
        return;
      }
      const members = res.data
        .flatMap((team) =>
          team.team_members.map((member) => ({
            ...member,
            name: member.users?.[0]?.name || "Unknown",
            checked: member.is_available === 1,
          }))
        )
        .filter((member, index, self) => self.findIndex((m) => m._id === member._id) === index); 

      setUserData(members);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const toggleCheckbox = useCallback(
    (id: string) => {
      setUserData((prevData) => {
        const updatedItems = prevData.map((item) =>
          item._id === id ? { ...item, checked: !item.checked } : item
        );
        onStatusSelect(updatedItems.filter((item) => item.checked));
        return updatedItems;
      });
    },
    [onStatusSelect]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    visible && (
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <BlurView style={styles.blurView} intensity={200}>
          <Animated.View style={[styles.modal, animatedStyle]}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
              {userData.map((item) => (
                <TouchableOpacity key={item._id} style={styles.checkboxItem} onPress={() => toggleCheckbox(item._id)}>
                  <View style={styles.checkboxContainer}>
                    {item.checked ? (
                      <MaterialCommunityIcons name="checkbox-marked" size={24} color="#3D48E5" />
                    ) : (
                      <MaterialIcons name="check-box-outline-blank" size={24} color="#565F6C" />
                    )}
                    <Text style={[globalStyles.h5, globalStyles.fontfm, styles.text, { color: item.checked ? "#3D48E5" : "#565F6C" }]}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    borderRadius: 8,
    padding: 16,
    width: 320,
    maxHeight: 500,
    elevation: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scrollView: {
    maxHeight: 400,
  },
  checkboxItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    paddingLeft: 10,
  },
});

export default AssignedMemberPop;

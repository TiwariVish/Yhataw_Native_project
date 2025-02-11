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
import { getAllTeamMembersData } from "../../Components/Screens/LeadInfoScreenService";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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

    if (visible && leadData?._id) {
      fetchMemberLeadStage(assignToIds, leadData._id);
    }
  }, [visible, leadData]);

  const fetchMemberLeadStage = async (ids: string[], id: string) => {
    try {
      const payload = {
        team_id: ids,
        lead_id: id,
      };
      const res = await getAllTeamMembersData(payload);
      if (!res.data || !Array.isArray(res.data)) {
        console.error("Invalid data structure returned from the API");
        return;
      }
      const members = res.data.map((team) =>
        team.team_members.map((member) => ({
          ...member,
          name : member.users[0].name,
          checked: member.is_available === 1, 
        }))
      ).flat(); 

      console.log(members, 'flattened members:', members);

      setUserData(members);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const toggleCheckbox = useCallback(
    (id: string) => {
      setUserData((prevData) => {
        const updatedItems = prevData.map((item) => {
          if (item._id === id) {
            return { ...item, checked: !item.checked };
          }
          return item;
        });
        console.log(updatedItems.filter((item) => item.checked), 'selected items');
        const selectedItems = updatedItems.filter((item) => item.checked);
        onStatusSelect(selectedItems);

        return updatedItems;
      });
    },
    [onStatusSelect]
  );

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
        {item.checked ? (
          <Animated.View
            style={{ opacity: withSpring(item.checked ? 1 : 0.5) }}
          >
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={24}
              color="#3D48E5"
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={{ opacity: withSpring(item.checked ? 0.5 : 1) }}
          >
            <MaterialIcons
              name="check-box-outline-blank"
              size={24}
              color="#565F6C"
            />
          </Animated.View>
        )}
        <Text
          style={[
            globalStyles.h5,
            globalStyles.fontfm,
            styles.textPadding,
            { color: item.checked ? "#3D48E5" : "#565F6C" },
          ]}
          allowFontScaling={false}
          accessibilityLabel={`Checkbox for ${item.name}`}
          accessibilityHint={`Tap to ${item.checked ? 'deselect' : 'select'} ${item.name}`}
        >
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
    borderRadius: 5,
    padding: 16,
    width: 320,
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
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textPadding: {
    paddingLeft: 10,
  },
});

export default AssignedMemberPop;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { getTeamList } from "../../Components/Screens/DashboardService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

interface MemberPopOverProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string[]) => void;
}

interface DropdownItem {
  id: string;
  team_name: string;
  checked: boolean;
  sub_teams?: DropdownItem[];
}

const MemberPopOver: React.FC<MemberPopOverProps> = ({
  visible,
  onClose,
  onStatusSelect,
}) => {
  const [memberDropdownItems, setMemberDropdownItems] = useState<DropdownItem[]>([]);
  const { leadData } = useSelector((state: RootState) => state.auth);

  // Animated values
  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 150 });
      opacity.value = withSpring(1, { damping: 20, stiffness: 150 });
      fetchTeams();
    } else {
      scale.value = withSpring(0.8, { damping: 20, stiffness: 150 });
      opacity.value = withSpring(0, { damping: 20, stiffness: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const fetchTeams = async () => {
    try {
      const res = await getTeamList();
      const updatedItems = res.data.map((team: DropdownItem) => ({
        ...team,
        checked: leadData.AssignTo.some(
          (assigned) => assigned.team_name === team.team_name
        ),
        sub_teams: team.sub_teams?.map((subTeam) => ({
          ...subTeam,
          checked: leadData.AssignTo.some(
            (assigned) => assigned.team_name === subTeam.team_name
          ),
        })),
      }));
      setMemberDropdownItems(updatedItems);
      handleSelection(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSubTeamCheckbox = (parentId: string, subId: string) => {
    const updatedItems = memberDropdownItems.map((item) => {
      if (item.id === parentId) {
        const updatedSubTeams = item.sub_teams?.map((subTeam) =>
          subTeam.id === subId ? { ...subTeam, checked: !subTeam.checked } : subTeam
        );
        return { ...item, sub_teams: updatedSubTeams };
      }
      return item;
    });
    setMemberDropdownItems(updatedItems);
    handleSelection(updatedItems);
  };

  const handleSelection = (items: DropdownItem[]) => {
    const selectedTeams = items.flatMap((item) =>
      item.checked
        ? [item.team_name, ...(item.sub_teams?.filter((st) => st.checked).map((st) => st.team_name) || [])]
        : item.sub_teams?.filter((st) => st.checked).map((st) => st.team_name) || []
    );
    onStatusSelect(selectedTeams);
  };

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <BlurView style={styles.blurView} intensity={200}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <ScrollView contentContainerStyle={styles.dropdownMenu}>
                {memberDropdownItems.map((item) => (
                  <View key={item.id}>
                    <TouchableOpacity style={styles.checkboxItem}>
                      <View style={styles.checkboxContainer}>
                        {item.checked ? (
                          <MaterialCommunityIcons name="checkbox-marked" size={24} color="#3D48E5" />
                        ) : (
                          <MaterialIcons name="check-box-outline-blank" size={24} color="#565F6C" />
                        )}
                        <Text
                          style={[
                            globalStyles.h5,
                            globalStyles.fontfm,
                            styles.checkboxText,
                            { color: item.checked ? "#3D48E5" : "#565F6C" },
                          ]}
                          allowFontScaling={false}
                        >
                          {item.team_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {item.sub_teams?.length > 0 && (
                      <View style={styles.subTeamContainer}>
                        {item.sub_teams.map((subTeam) => (
                          <TouchableOpacity
                            key={subTeam.id}
                            style={styles.subCheckboxItem}
                          >
                            <View style={styles.checkboxContainer}>
                              {subTeam.checked ? (
                                <MaterialCommunityIcons name="checkbox-marked" size={24} color="#3D48E5" />
                              ) : (
                                <MaterialIcons name="check-box-outline-blank" size={24} color="#565F6C" />
                              )}
                              <Text
                                style={[
                                  globalStyles.h6,
                                  globalStyles.fontfm,
                                  { color: subTeam.checked ? "#3D48E5" : "#565F6C" },
                                ]}
                                allowFontScaling={false}
                              >
                                {subTeam.team_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
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
  subCheckboxItem: {
    paddingVertical: 8,
    paddingLeft: 30, 
  },
  subTeamContainer: {
    paddingLeft: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    paddingLeft: 10,
  },
});

export default MemberPopOver;

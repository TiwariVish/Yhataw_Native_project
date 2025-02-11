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
      const updatedItems = res.data.map((team: DropdownItem) => markChecked(team));
      setMemberDropdownItems(updatedItems);
      handleSelection(updatedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const markChecked = (team: DropdownItem): DropdownItem => ({
    ...team,
    checked: leadData.AssignTo.some((assigned) => assigned.team_name === team.team_name),
    sub_teams: team.sub_teams?.map(markChecked),
  });

  const handleSelection = (items: DropdownItem[]) => {
    const selectedTeams: string[] = [];
    
    const collectCheckedTeams = (team: DropdownItem) => {
      if (team.checked) selectedTeams.push(team.team_name);
      team.sub_teams?.forEach(collectCheckedTeams);
    };

    items.forEach(collectCheckedTeams);
    onStatusSelect(selectedTeams);
  };

  const renderTeamItem = (item: DropdownItem, level = 0) => (
    <View key={item.id} style={{ paddingLeft: level * 20 }}>
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
      {item.sub_teams?.map((subTeam) => renderTeamItem(subTeam, level + 1))}
    </View>
  );

  return (
    visible && (
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <BlurView style={styles.blurView} intensity={200}>
          <Animated.View style={[styles.modal, animatedStyle]}>
            <ScrollView contentContainerStyle={styles.dropdownMenu}>
              {memberDropdownItems.map((item) => renderTeamItem(item))}
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
  checkboxText: {
    paddingLeft: 10,
  },
});

export default MemberPopOver;
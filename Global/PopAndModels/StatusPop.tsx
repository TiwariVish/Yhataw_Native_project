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
import {
  getAllStage,
  getStage,
} from "../../Components/Screens/LeadInfoScreenService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface StatusPopProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}

const StatusPop: React.FC<StatusPopProps> = ({
  visible,
  onClose,
  onStatusSelect,
}) => {
  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  const [dropdownData, setDropdownData] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8, {
      damping: 20,
      stiffness: 150,
    });
    opacity.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
    getLeadStage();
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getLeadStage = async () => {
    try {
      // const res = await getAllStage();
      const resData = await getStage();
      console.log(resData, "resDataresDataresDataresDataresData");

      setDropdownData(resData.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(dropdownData, "dropdownDatadropdownDatadropdownData");

  const handleDropdownItemPress = (statusName: string) => {
    onStatusSelect(statusName);
    onClose();
  };

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <BlurView style={styles.blurView} intensity={200}>
            <Animated.View style={[styles.modal, animatedStyle]}>
              <ScrollView contentContainerStyle={styles.dropdownMenu}>
                {dropdownData.map((item) => (
                  <View key={item._id}>
                    <TouchableOpacity
                      // onPress={() => handleDropdownItemPress(item.stage_Name)}
                    >
                      <Text
                        style={[
                          globalStyles.h5,
                          globalStyles.fontfm,
                          styles.dropdownItem,
                        ]}
                        allowFontScaling={false}
                      >
                        {item.stage_Name}
                      </Text>
                    </TouchableOpacity>
                    {item.sub_Stage_name.length > 0 && (
                      <View style={styles.subStageContainer}>
                        {item.sub_Stage_name.map((subItem) => (
                          <TouchableOpacity
                            key={subItem._id}
                            onPress={() =>
                              handleDropdownItemPress(subItem.stage_Name)
                            }
                          >
                            <Text style={styles.subDropdownItem}>
                              {subItem.stage_Name}
                            </Text>
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
  dropdownItem: {
    paddingVertical: 10,
  },
  subStageContainer: {
    paddingLeft: 20, 
  },
  subDropdownItem: {
    paddingVertical: 6,
    fontSize: 14,
    color: "black",
  },
});

export default StatusPop;

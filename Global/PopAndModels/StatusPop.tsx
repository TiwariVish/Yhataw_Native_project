import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import {
  getAllStage,
  getOfficeDetails,
  getStage,
} from "../../Components/Screens/LeadInfoScreenService";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import store from "../../utils/store";

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
  const [userType, setUserType] = useState<string>("0");

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8, {
      damping: 20,
      stiffness: 150,
    });
    opacity.value = withSpring(visible ? 1 : 0, {
      damping: 20,
      stiffness: 150,
    });
    getStageDataNew();
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // const getLeadStage = async () => {
  //   try {
  //     // const res = await getAllStage();
  //     const resData = await getStage();
  //     setDropdownData(resData.data);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const filterStagesByIsSale = (stages: any[], isSale: number): any[] => {
    return stages
      .map((stage) => {
        const subStages = filterStagesByIsSale(stage.sub_Stage_name || [], isSale);

        if (stage.isSale === isSale || stage.isSale === -1 || subStages.length > 0) {
          return {
            ...stage,
            sub_Stage_name: subStages,
          };
        }

        return null;
      })
      .filter((stage) => stage !== null);
  };



  const getStageDataNew = async () => {
    try {
      const resData = await getStage();
      const userData = store.getState().auth.userId;
      const response = await getOfficeDetails(userData);
      console.log(response, 'responseresponse');
      const teamRoleName = response.data.teamRoleName.toLowerCase();
      let filteredStageData;

      if (teamRoleName.includes("presales")) {
        filteredStageData = filterStagesByIsSale(resData.data, 0);
        setUserType("0")
      } else if (teamRoleName.includes("sales")) {
        filteredStageData = filterStagesByIsSale(resData.data, 1);
        setUserType("1")

      } else {
        filteredStageData = resData.data;
      }

      setDropdownData(filteredStageData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleDropdownItemPress = (statusName: string) => {
    console.log(statusName,'statusNamestatusNamestatusNamestatusNamestatusNamestatusNamestatusNamestatusName')
    onStatusSelect(statusName);
    onClose();
  };

  return (
    <>
    {visible && (
      <View style={styles.overlay}>
        <BlurView style={styles.blurView} intensity={200}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View >
              <Animated.View style={[styles.modal, animatedStyle]}>
                <ScrollView 
                  contentContainerStyle={styles.dropdownMenu}
                  keyboardShouldPersistTaps="handled"  
                >
                  {dropdownData.map((item) => (
                    <View key={item._id}>
                      <TouchableOpacity
                        onPress={() => handleDropdownItemPress(item.stage_Name)} 
                      >
                        <Text
                          style={[
                            globalStyles.h7,
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
                              onPress={() => handleDropdownItemPress(subItem.stage_Name)}
                            >
                              <Text
                                style={[
                                  globalStyles.h8,
                                  globalStyles.fontfm,
                                  styles.dropdownItem,
                                ]}
                                allowFontScaling={false}
                              >
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
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </View>
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
    paddingVertical: 8,
  },
  subStageContainer: {
    paddingLeft: 20, 
  },
 
});

export default StatusPop;

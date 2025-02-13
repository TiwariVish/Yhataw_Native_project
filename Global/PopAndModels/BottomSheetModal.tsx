import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "../../Components/type";

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
}

const data = [
  {
    id: 1,
    name: "My\nLeads",
    image: require("../../assets/myLeads.png"),
    color: { backgroundColor: "#FFF3DF" },
  },
  {
    id: 2,
    name: "Planned\nSite Visit",
    color: { backgroundColor: "#D4F5FF" },
    image: require("../../assets/plannedSiteVisit.png"),
  },
  {
    id: 3,
    name: "Walk-in\nSite Visit",
    color: { backgroundColor: "#FFEFEC" },
    image: require("../../assets/customericon.png"),
  },
  {
    id: 4,
    name: "Customer\nFeedback",
    color: { backgroundColor: "#D4FFEA" },
    image: require("../../assets/customericon.png"),
  },
];



const { height: screenHeight } = Dimensions.get("window");

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
}) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);

  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15, 
      stiffness: 100, 
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleCardPress = (id: number) => {
    if (id === 4) { 
      navigation.navigate("CustomerFeedback");
    }
  };
  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <BlurView intensity={100}  tint="dark"  style={styles.blurView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View style={[styles.container, animatedStyle]}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  <Text
                    style={[
                      globalStyles.h1,
                      globalStyles.fs1,
                      globalStyles.fontfm,
                      styles.title,
                    ]}
                  >
                    Browse Category
                  </Text>
                  {data.map((item) => (
                    <TouchableOpacity   onPress={() => handleCardPress(item.id)}
                      key={item.id}
                      style={[styles.card, item.color]}
                    >
                      <Image source={item.image} style={styles.image} />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            globalStyles.h3,
                            globalStyles.fs1,
                            globalStyles.fontfm,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.forwardaline}>
                        <Image
                          source={require("../../assets/forword_icon.png")}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  blurView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    width: "100%",
    height: "75%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    height: 125,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 95,
    borderRadius: 10,
    marginLeft: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 16,
  },
  forwardaline: {
    marginRight: 30,
  },
});

export default BottomSheetModal;

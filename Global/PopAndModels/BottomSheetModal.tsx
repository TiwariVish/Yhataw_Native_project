import React, { useEffect } from "react";
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
    name: "Add Leads",
    image: require("../../assets/myLeads.png"),
    color: { backgroundColor: "#FFF3DF" },
  },
];

const { height: screenHeight } = Dimensions.get("window");

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
}) => {
  const translateY = useSharedValue(visible ? 0 : screenHeight);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : screenHeight, {
      damping: 15,
      stiffness: 100,
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleCardPress = (id: number) => {
    if (id === 1) {
      navigation.navigate("AddLeadManual");
    }
  };

  return visible ? (
    <TouchableWithoutFeedback onPress={onClose}>
      <BlurView intensity={100} tint="dark" style={styles.blurView}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.header} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, item.color]}
                  onPress={() => handleCardPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text
                      style={[globalStyles.h3, globalStyles.fs1, globalStyles.fontfm]}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={styles.forwardIcon}>
                    <Image source={require("../../assets/forword_icon.png")} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </BlurView>
    </TouchableWithoutFeedback>
  ) : null;
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
    height: "30%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    paddingTop: 15,
  },
  header: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    height: 120,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  forwardIcon: {
    marginRight: 15,
  },
});

export default BottomSheetModal;

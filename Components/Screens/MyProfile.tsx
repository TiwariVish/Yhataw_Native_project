import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import CustomButton from "../../Global/Components/CustomButton";
import { globalStyles } from "../../GlobalCss/GlobalStyles";
import { logOutAction } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";
import { getPerosnalDetails } from "./MyProfileService";
import store from "../../utils/store";
import { MyProfileSkeleton } from "../../Global/Components/SkeletonStructures";

const Profile = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getPerosnalDetails(store.getState().auth?.userId);
      setUserData(response.data);
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setModalVisible(true);
  };

  const logout = () => {
    dispatch(logOutAction());
    navigation.navigate("Login");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {loading ? (
        <MyProfileSkeleton />
      ) : (
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <Image
                source={
                  userData?.profile_image
                    ? { uri: userData.profile_image }
                    : require("../../assets/user_icon.png")
                }
                style={styles.profileImage}
              />
              {userData && (
                <>
                  <Text style={styles.name}>{userData.name}</Text>
                  <Text style={styles.position}>
                    {userData.position || "Team Leader"}
                  </Text>
                </>
              )}
            </View>
            {userData && (
              <>
                {[
                  {
                    label: "Employee ID",
                    value: userData.employee_id || "N/A",
                  },
                  { label: "Email", value: userData.email },
                  { label: "Date of Birth", value: userData.dob },
                  { label: "City", value: userData.city },
                  { label: "State", value: userData.state_name },
                  { label: "Country", value: userData.country_name },
                ].map((item, index) => (
                  <View key={index} style={styles.infoContainer}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                    <View style={styles.border}></View>
                  </View>
                ))}
              </>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              label="Logout"
              buttonType="iconBtn"
              labelStyle={styles.logoutButtonText}
              onClick={handleLogout}
              customStyles={styles.logoutButton}
            />
          </View>
        </View>
      )}

      {/* Modal section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.imageContainer}>
                <Image source={require("../../assets/quesMark_icon.png")} />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    globalStyles.h6,
                    globalStyles.fs1,
                    globalStyles.fontfm,
                  ]}
                >
                  Are You Sure you want to logout?
                </Text>
              </View>
              <View style={styles.buttonContainerModal}>
                <CustomButton
                  label="Logout"
                  buttonType="iconBtn"
                  labelStyle={styles.logoutButtonText}
                  onClick={logout}
                  customStyles={styles.buttonAdj}
                />
                <CustomButton
                  label="Cancel"
                  buttonType="primaryBtn"
                  onClick={closeModal}
                  customStyles={styles.buttonCanl}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  border: {
    position: "absolute",
    bottom: -9,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#ccc",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  position: {
    fontSize: 16,
    color: "gray",
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: "gray",
    width: "50%",
  },
  value: {
    fontSize: 16,
    color: "blue",
    width: "50%",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 5,
    padding: 10,
  },
  logoutButtonText: {
    color: "red",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  buttonContainerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
  buttonAdj: {
    borderWidth: 2,
    borderColor: "red",
    borderRadius: 5,
    padding: 10,
    height: 45,
    width: 110,
  },
  buttonCanl: {
    borderRadius: 5,
    padding: 10,
    height: 45,
    width: 110,
  },
});

export default Profile;

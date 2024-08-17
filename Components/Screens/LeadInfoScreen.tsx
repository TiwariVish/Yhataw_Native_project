import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import BottomSheetModal from "../../Global/PopAndModels/BottomSheetModal";
import ReminderBottomSheetModal from "../../Global/PopAndModels/ReminderBottomSheetModal";
import {
  getAllStage,
  getAllTeamMembersData,
  getTeamList,
} from "./LeadInfoScreenService";
import StatusPop from "../../Global/PopAndModels/StatusPop";
import MemberPopOver from "../../Global/PopAndModels/MemberPopOver";
import AssignedMemberPop from "../../Global/PopAndModels/AssignedMemberPop";

const leadInfoStatus = [
  { id: 1, content: "Lead Info" },
  { id: 2, content: "Contact" },
  { id: 3, content: "Reminder" },
  { id: 4, content: "Site Visit" },
];

const reminders = [
  {
    date: "2024-03-14 12:42 PM",
    title: "Call Back",
    description:
      "Customer asked to call back tomorrow. He is busy today. However, he said he is interested.",
  },
  {
    date: "2024-03-14 12:42 PM",
    title: "Make Call",
    description: "Message",
  },
];

const LeadInfoScreen = () => {
  const { leadData } = useSelector((state: RootState) => state.auth);
  const [selectedCards, setSelectedCards] = useState<number[]>([1]);
  const [isVisible, setIsVisible] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownData, setDropdownData] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTeams, setselectedTeams] = useState<string | null>(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMemberModalVisible, setMemberModalVisible] = useState(false);
  const [isassineMemberModalVisible, setisassineMemberModalVisible] = useState(false);

 

  useEffect(() => {
    getLeadStage();
  }, []);

  const getLeadStage = async () => {
    try {
      const res = await getAllStage();
      setDropdownData(res.data);

      const res2 = await getTeamList();
      setDropdownItems(res2.data);
    } catch {}
  };
  // const getAssineToMember = async (ids: any) => {
  //   try {
  //     const payload = {
  //       team_id: ids,
  //       lead_id: dynamicGridValue?.id,
  //     };
  //     const response1 = await getAllTeamMembersData(payload);
  //     setLeadOptionMembersas(response1.data);
  //   } catch {}
  // };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setModalVisible(true);
  };

  const handleMemberStatusSelect = () => {
    setMemberModalVisible(true);
  };

  const onselectMember = () =>{
    setisassineMemberModalVisible(true)

  }

  const handleCardPress = (id: number) => {
    setSelectedCards([id]);
  };

  const handleCare_Reminder = () => {
    setIsVisible(true);
  };

  const renderContent = () => {
    return (
      <>
        {selectedCards.includes(1) && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Lead ID</Text>
            <Text style={styles.value}>{leadData.uid}</Text>

            <Text style={styles.label}>Campaign</Text>
            <Text style={styles.value}>FB-ADS-947</Text>

            <Text style={styles.label}>Project</Text>
            <Text style={styles.value}>{leadData.project_name}</Text>

            <Text style={styles.label}>Source</Text>
            <Text style={styles.value}>{leadData.source}</Text>

            <Text style={styles.label}>Action</Text>
            <Text style={styles.label}>Assigned To</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => handleMemberStatusSelect()}
            >
              <Text style={styles.dropdownText}>
                {selectedTeams ? selectedTeams : "Select Team"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                style={[
                  styles.dropdownIcon,
                  openDropdown === 1 && styles.dropdownIconOpen,
                ]}
              />
            </TouchableOpacity>
            <>
              <Text style={styles.label}>Assigned To Member</Text>
              <TouchableOpacity style={styles.dropdown}  onPress={() => onselectMember()}>
                <Text style={styles.dropdownText}>
                  {selectedTeams ? selectedTeams : "Assigned To Member"}
                </Text>
                <Icon
                  name="chevron-down-outline"
                  size={20}
                  style={[
                    styles.dropdownIcon,
                    openDropdown === 2 && styles.dropdownIconOpen,
                  ]}
                />
              </TouchableOpacity>
            </>

            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => handleStatusSelect("")}
            >
              <Text style={styles.dropdownText}>
                {" "}
                {selectedStatus ? selectedStatus : "Select Status"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                style={[
                  styles.dropdownIcon,
                  openDropdown === 3 && styles.dropdownIconOpen,
                ]}
              />
            </TouchableOpacity>
          </View>
        )}

        {selectedCards.includes(2) && (
          <View style={styles.contactContainer}>
            <Text style={styles.value}>Contact Info</Text>
            <View>
              <Text style={styles.label}>{leadData.leadPhone}</Text>
              <Text style={styles.label}>{leadData.leadEmail}</Text>
            </View>
          </View>
        )}
        {selectedCards.includes(3) && (
          <View style={styles.containerRem}>
            <View style={styles.headerRem}>
              <Text style={styles.headerText}>Reminders</Text>
              <TouchableOpacity onPress={() => handleCare_Reminder()}>
                <Text style={styles.addNew}>Add New</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.remindersList}>
              {reminders.map((reminder, index) => (
                <View key={index} style={styles.reminderItem}>
                  <Text style={styles.dateText}>{reminder.date}</Text>
                  <Text style={styles.titleText}>{reminder.title}</Text>
                  <Text style={styles.descriptionText}>
                    {reminder.description}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{leadData.leadName}</Text>
              <Text style={styles.date}>19 Mar, 2024</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Just Now</Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/blue_call_icon.png")}
                style={styles.icon}
              />
              <Image
                source={require("../../assets/whatsapp_icon.png")}
                style={styles.icon}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            style={styles.buttonContainer}
            showsHorizontalScrollIndicator={false}
          >
            {leadInfoStatus.map((label) => (
              <TouchableOpacity
                key={label.id}
                onPress={() => handleCardPress(label.id)}
              >
                <View
                  style={[
                    styles.card,
                    selectedCards.includes(label.id) && styles.selectedCard,
                  ]}
                >
                  <Text
                    style={[
                      styles.cardText,
                      selectedCards.includes(label.id) &&
                        styles.selectedCardText,
                    ]}
                  >
                    {label.content}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {renderContent()}
        </ScrollView>

        {selectedCards.includes(1) && (
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedCards.length > 1 && styles.activeSubmitButton,
              ]}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <AssignedMemberPop  visible={isassineMemberModalVisible}
        onClose={() => setisassineMemberModalVisible(false)}
        onStatusSelect={onselectMember} />
      <MemberPopOver
        visible={isMemberModalVisible}
        onClose={() => setMemberModalVisible(false)}
        onStatusSelect={handleMemberStatusSelect}
      />
      <StatusPop
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onStatusSelect={handleStatusSelect}
      />
      <ReminderBottomSheetModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  date: {
    color: "#888",
  },
  statusBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
  },
  icon: {
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    margin: 5,
    borderRadius: 5,
    height: 50,
    width: 125,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "blue",
  },
  cardText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedCardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 20,
  },
  contactContainer: {
    marginBottom: 20,
  },
  containerRem: {
    marginBottom: 20,
  },
  headerRem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  remindersList: {
    maxHeight: 200,
  },
  reminderItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    color: "black",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },
  dropdownIcon: {
    marginLeft: 10,
    transform: [{ rotate: "0deg" }],
  },
  dropdownIconOpen: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownMenu: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "black",
  },
  submitButtonContainer: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: "#C4C4C4",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  activeSubmitButton: {
    backgroundColor: "blue",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addNew: {
    color: "blue",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
  },
  checkboxDropdownMenu: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "blue",
  },
  checkboxText: {
    fontSize: 16,
    color: "black",
  },
});

export default LeadInfoScreen;

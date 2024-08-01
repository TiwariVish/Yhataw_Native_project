import React, { useState } from "react";
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

const leadInfoStatus = [
  { id: 1, content: "Lead Info" },
  { id: 2, content: "Contact" },
  { id: 3, content: "Reminder" },
  { id: 4, content: "Site Visit" },
];

const reminders = [
  {
    date: '2024-03-14 12:42 PM',
    title: 'Call Back',
    description: 'Customer asked to call back tomorrow. He is busy today. However, he said he is interested.',
  },
  {
    date: '2024-03-14 12:42 PM',
    title: 'Make Call',
    description: 'Message',
  },
];

const LeadInfoScreen = () => {
  const { leadData } = useSelector((state: RootState) => state.auth);
  const [selectedCards, setSelectedCards] = useState<number[]>([1]);
  const [isVisible, setIsVisible] = useState(false);

  const handleCardPress = (id: number) => {
    setSelectedCards([id]);
  };

  const handleCare_Reminder = () =>{
    setIsVisible(true)
    
  }

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
            <Text style={styles.value}>Assigned To</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Vivek</Text>
              <Icon name="chevron-down-outline" size={20} />
            </TouchableOpacity>

            <Text style={styles.label}>Status</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>Just Now</Text>
              <Icon name="chevron-down-outline" size={20} />
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
        {selectedCards.includes(3)&&(
           <View style={styles.containerRem}>
           <View style={styles.headerRem}>
             <Text style={styles.headerText}>Reminders</Text>
             <TouchableOpacity  onPress={() => handleCare_Reminder()}>
               <Text style={styles.addNew}>Add New</Text>
             </TouchableOpacity>
           </View>
           <ScrollView style={styles.remindersList}>
             {reminders.map((reminder, index) => (
               <View key={index} style={styles.reminderItem}>
                 <Text style={styles.dateText}>{reminder.date}</Text>
                 <Text style={styles.titleText}>{reminder.title}</Text>
                 <Text style={styles.descriptionText}>{reminder.description}</Text>
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
                    selectedCards.includes(label.id) && styles.selectedCardText,
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
     <ReminderBottomSheetModal  visible={isVisible} onClose={() => setIsVisible(false)}></ReminderBottomSheetModal>
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
  label: {
    fontSize: 14,
    color: "#888",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#FFF",
  },
  submitButton: {
    backgroundColor: "#A0A0A0",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeSubmitButton: {
    backgroundColor: "blue",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerRem: {
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
  },
  headerRem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addNew: {
    fontSize: 14,
    color: '#007BFF',
  },
  remindersList: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  reminderItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
  },
});

export default LeadInfoScreen;

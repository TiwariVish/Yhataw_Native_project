import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image  } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { globalStyles } from '../../GlobalCss/GlobalStyles';

type CardProps = {
  id: string;
  title: string;
  createdDate: string;
  projectData: {
    tasks: string | number;
    activeTasks: string | number;
    assignees: Array<{ id: number; imageUrl: any }>;
  };
  onPress?: () => void;
  style?: object;
};

const CustomBigCard: React.FC<CardProps> = ({ id, title, createdDate , projectData, onPress, style }) => {
  const { assignees } = projectData;

  return (
    <TouchableOpacity style={[styles.cardContainer, style]} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.leftSection}>
          <View style={styles.initialCircle}>
            <Text style={[styles.initialText,globalStyles.h5,globalStyles.fs2]} allowFontScaling={false}> {title ? title.charAt(0).toUpperCase() : ''}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.idText ,globalStyles.h6,globalStyles.fs4]}>{id}</Text>
            <Text style={[styles.titleText,globalStyles.h5,globalStyles.fs2]} allowFontScaling={false}>{title}</Text>
          </View>
        </View>
      </View>
      <View style={styles.datePriorityRow}>
        <View style={styles.dateRow}>
          <Feather name="calendar" size={14} color="#666" />
          <Text style={[styles.dateText,globalStyles.h8]} allowFontScaling={false}>Created {createdDate}</Text>
        </View>
      </View>
      <View style={styles.borderBottom} />
      <View style={styles.projectTitleContainer}>
        <Text style={[styles.titleText,globalStyles.h5,globalStyles.fs2]} allowFontScaling={false}>Project</Text>
      </View>
      <View style={styles.projectData}>
        <View style={styles.dataRow}>
          <Text style={[styles.label,globalStyles.h7,globalStyles.fs3]} allowFontScaling={false}>Residential</Text>
          <Text style={[styles.value,globalStyles.h6,globalStyles.fs2]} allowFontScaling={false}>{projectData.tasks}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text  style={[styles.label,globalStyles.h7,globalStyles.fs3]}allowFontScaling={false}>Commercial</Text>
          <Text  style={[styles.value,globalStyles.h6,globalStyles.fs2]} allowFontScaling={false}>{projectData.activeTasks}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text  style={[styles.label,globalStyles.h7,globalStyles.fs3]}allowFontScaling={false}>Assignees</Text>
          <View style={styles.assigneesContainer}>
            {assignees.slice(0, 3).map((assignee) => (
              <Image 
                key={assignee.id}
                style={styles.assigneeImage}
                source={assignee.imageUrl}
              />
            ))}
            {assignees.length > 3 && (
              <View style={styles.additionalAssigneesContainer}>
                <Text style={styles.additionalAssigneesText}>+{assignees.length - 3}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    minWidth: 320, 
    minHeight: 268, 
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation:5
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#666',
  },
  titleContainer: {
    marginLeft: 12,
  },
  idText: {
    color: '#666',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePriorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#999',
    marginLeft: 4,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    marginTop: 20, 
  },
  projectData: {
    marginTop: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#666',
  },
  value: {
    color: '#333',
    marginTop:10
  },
  assigneesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  assigneeImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -5,
  },
  additionalAssigneesContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -5,
  },
  additionalAssigneesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  projectTitleContainer: {
   marginTop:10
  },
});

export default CustomBigCard;

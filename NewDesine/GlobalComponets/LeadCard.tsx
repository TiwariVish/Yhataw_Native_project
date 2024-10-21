import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '../../GlobalCss/GlobalStyles';

interface CustomCardProps {
  name: string;
  location: string;
  status: string;
  projectName: string;
  onCallPress?: () => void;
  onTextPress?: () => void;
  imageUrl?: any;
}

const LeadCard: React.FC<CustomCardProps> = ({ 
  name, 
  location, 
  status, 
  onCallPress, 
  onTextPress, 
  imageUrl, 
  projectName 
}) => {
  const firstLetter = name.charAt(0).toUpperCase();
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.leftColumn}>
        {imageUrl ? (
            <View style={styles.circleOutline}>
              <Image
                source={{ uri: imageUrl }} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.circleOutline}>
              <Text  style={[globalStyles.h2, globalStyles.fs3]} allowFontScaling={false}>{firstLetter}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onTextPress} style={styles.middleColumn}>
          <View style={styles.nameRow}>
            {status && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText} allowFontScaling={false}>{status}</Text>
              </View>
            )}
            <Text style={styles.nameText} allowFontScaling={false}>{name}</Text>
          </View>
          <Text style={styles.locationText} allowFontScaling={false}>{location}</Text>
          <Text style={styles.locationText} allowFontScaling={false}>{projectName}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCallPress} style={styles.rightColumn}>
          <View style={styles.callIconCircle}>
            <Feather name="phone-call" size={24} color="#00C853" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    width: '100%',
    height: 135,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'flex-start', 
  },
  middleColumn: {
    flex: 3,
    justifyContent: 'flex-start',
    width: '75%', 
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    top:30
  },
  circleOutline: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 25,
  },
  nameRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  statusBadge: {
    backgroundColor: '#FF808B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 3,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    color: '#757575',
  },
  callIconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00C853',
  },
});

export default LeadCard;

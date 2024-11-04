import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import { globalStyles } from '../../GlobalCss/GlobalStyles';

interface CustomCardProps {
  title: string;
  count: string;
  iconName?: string;
  iconBackgroundColor?: string;
  imageUrl?: any; 
  style?: object; 
  post?: string; 
  id 
  postCounter?: string;
  onCardPress?: (arg:any) => void; 
}

const CustomCardNew: React.FC<CustomCardProps> = ({ 
  title, 
  count, 
  iconName, 
  iconBackgroundColor = '#ff6f61', 
  imageUrl, 
  style, 
  post, 
  postCounter,
  id ,
  onCardPress 
}) => {
  const showInitial = !imageUrl && !iconName; 

  // Handler for card press
  const handleCardPress = () => {
      if (onCardPress) {
      onCardPress({ title, count, id }); 
    }
  };

  return (
    <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
      <View style={[styles.card, style]}>
        {/* Conditional rendering of the image or first letter */}
        {imageUrl ? (
          <View style={styles.circleOutLine}>
            <Image 
              source={{ uri: imageUrl }}
              style={styles.image} 
              resizeMode="contain" 
            /> 
          </View>
        ) : showInitial ? (
          <View style={styles.circleOutLine}>
            <View style={styles.circleInner}>
              <Text style={[globalStyles.h2, globalStyles.fs3]} allowFontScaling={false}>
                {title ? title.slice(0,2).toUpperCase() : ''}
              </Text>
            </View>
          </View>
        ) : null}
        {iconName && (
          <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
            <AntDesign name="calendar" size={25} color="white" />
          </View>
        )}

        {/* Title and other content */}
        <Text style={[globalStyles.h7, globalStyles.fs1,globalStyles.tc]} allowFontScaling={false}>{title}</Text>
        {post && <Text style={[globalStyles.tc2,globalStyles.h7]} allowFontScaling={false}>{post}</Text>} 
        {count && <Text style={[styles.count,globalStyles.tc2,globalStyles.h8,globalStyles.fs3]} allowFontScaling={false}>{count}</Text>}
      
        {postCounter && (
          <View style={styles.countContainer}>
            <Text allowFontScaling={false}>{postCounter}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 143, 
    minHeight: 154, 
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000000', 
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10},
    justifyContent: 'flex-start', 
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },

  count: {
    marginTop: 6,
  },
  countContainer: {
    width: 100,
    height: 25,
    borderWidth: 1, 
    borderColor: '#DADADA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 10,
  },
  circleOutLine: {
    width: 70, 
    height: 70, 
    borderWidth: 2, 
    borderColor: '#C5C8F7', 
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    marginBottom: 10,
    position: 'relative', 
  },
  circleInner: {
    backgroundColor: '#EEEEEE', 
    width: '85%', 
    height: '85%', 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    top: '7.5%', 
    left: '7.5%', 
  },
  image: {
    width: '85%', 
    height: '85%', 
    borderRadius: 35, 
    position: 'absolute', 
    top: '7.5%', 
    left: '7.5%', 
  },
  
});

export default CustomCardNew;

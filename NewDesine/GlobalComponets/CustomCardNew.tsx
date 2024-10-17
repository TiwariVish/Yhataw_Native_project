import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AntDesign } from "@expo/vector-icons"; 
import { globalStyles } from '../../GlobalCss/GlobalStyles';

interface CustomCardProps {
  title: string;
  count:string;
  iconName: string;
  iconBackgroundColor?: string;
  imageUrl?: any; 
  style?: object; 
  post?: string; 
  postCounter?: string;
}

const CustomCardNew: React.FC<CustomCardProps> = ({ 
  title, 
  count, 
  iconName, 
  iconBackgroundColor = '#ff6f61', 
  imageUrl, 
  style, 
  post, 
  postCounter 
}) => {
  return (
    <View style={[styles.card, style]}>
      {imageUrl && ( 
        <View style={styles.circleOutLine}>
          <Image 
            source={imageUrl} 
            style={styles.image} 
            resizeMode="contain" 
          /> 
        </View>
      )}
      {iconName && ( <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <AntDesign  name="calendar" size={25} color="white" />
      </View>)}
     
      <Text style={[styles.title,globalStyles.h5,globalStyles.fs2]} allowFontScaling={false}>{title}</Text>
      {post && <Text style={styles.post} allowFontScaling={false}>{post}</Text>} 
      {count &&   <Text style={styles.count} allowFontScaling={false}>{count}</Text>}
    
      {postCounter && (
        <View style={styles.countContainer}>
          <Text allowFontScaling={false}>{postCounter}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 145, 
    minHeight: 180, 
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    justifyContent: 'flex-start', 
    elevation: 5,
    
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  title: {
    marginTop:10,
  },
  post: {
    marginTop: 5,   
    fontSize: 14,
    color: '#555',
  },
  count: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  countContainer: {
    width: 100,
    height: 25,
    borderWidth: 1, 
    borderColor: '#DADADA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop:10
  },
  circleOutLine: {
    width: 70, 
    height: 70, 
    borderWidth: 3, 
    borderColor: 'blue',
    borderRadius: 35, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    marginBottom: 10,
  },
  image: {
    width: '85%', 
    height: '85%', 
    borderRadius: 35, 
    position: 'absolute', 
    top: '7.5%', 
    left: '7.5%', 
  }
});

export default CustomCardNew;

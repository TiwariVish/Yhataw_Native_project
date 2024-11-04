import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { globalStyles } from '../../GlobalCss/GlobalStyles';

interface FlipButtonBarProps {
  segments: string[];
  showSearch?: boolean;
  onSegmentChange?: (segment: string) => void;
  onSearchChange?: (text: string) => void;
  selectedSegment?: string; 
  style?: {};
  scrollViewRef?: React.RefObject<ScrollView>;
}

const FlipButtonBar: React.FC<FlipButtonBarProps> = ({ segments, showSearch = false, onSegmentChange, onSearchChange, selectedSegment, style, scrollViewRef }) => {
  const [searchText, setSearchText] = useState('');

  const handleSegmentClick = (segment: string) => {
    if (onSegmentChange) {
      onSegmentChange(segment);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const isScrollable = segments.length > 3;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.segmentedControl}>
        <ScrollView
          ref={scrollViewRef} // Pass the ref to ScrollView
          horizontal={isScrollable}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {segments.map((segment) => (
            <TouchableOpacity
              key={segment}
              style={[styles.segmentButton, selectedSegment === segment && styles.activeSegment]}
              onPress={() => handleSegmentClick(segment)}
            >
              <Text style={[styles.segmentText, selectedSegment === segment && styles.activeText, globalStyles.h7, globalStyles.fs3]} allowFontScaling={false}>
                {segment}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {showSearch && (
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View>
          {/* <View style={styles.filterContainer}>
            <Feather name="filter" size={20} color="#333" />
          </View> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  segmentedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 5,
    marginBottom: 15,
    width: '100%',
    height: 50,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    height: '100%',
  },
  activeSegment: {
    backgroundColor: '#3A86FF',
  },
  segmentText: {
    color: '#0A1629',
  },
  activeText: {
    color: '#FFFFFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default FlipButtonBar;

import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

export const DashboardSkeleton: React.FC = () => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <View style={styles.skeletonItem} />
        </View>
        <View style={styles.textContainer}>
          <View
            style={[styles.skeletonItem, styles.skeletonText, { width: 120 }]}
          />
          <View
            style={[styles.skeletonItem, styles.skeletonText, { width: 80 }]}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonItem,
              { width: 350, height: 135, margin: 15 },
            ]}
          />
        ))}
      </ScrollView>
      <View style={styles.textContainer1}>
        <View
          style={[styles.skeletonItem, styles.skeletonText, { width: 120 }]}
        />
      </View>
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonItem,
              { width: 200, height: 100, margin: 15 },
            ]}
          />
        ))}
      </ScrollView>
      <View style={styles.textContainer1}>
        <View
          style={[styles.skeletonItem, styles.skeletonText, { width: 120 }]}
        />
      </View>
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonItem,
              { width: 200, height: 100, margin: 15 },
            ]}
          />
        ))}
      </ScrollView>
      <View style={styles.textContainer1}>
        <View
          style={[styles.skeletonItem, styles.skeletonText, { width: 120 }]}
        />
      </View>
      <ScrollView
        horizontal
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonItem,
              { width: 200, height: 100, margin: 15 },
            ]}
          />
        ))}
      </ScrollView>
    </>
  );
};

export const MyProfileSkeleton = () => {
  const skeletonButtons = Array.from({ length: 6 }); // Change the length as needed

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImage} />
          <View style={styles.textContainer}>
            <View style={[styles.skeletonText, { width: 120 }]} />
            <View style={[styles.skeletonText, { width: 80 }]} />
          </View>
        </View>
        {skeletonButtons.map((_, index) => (
          <View key={index} style={styles.buttonContainer}>
            <View style={[styles.skeletonButton, { width: 250 }]} />
          </View>
        ))}
      </View>
    </View>
  );
};



export const LeadsSkeleton = () =>{
  const rows = Array.from({ length: 10 }); 
  return (
    <View style={styles.wrapper}>
      {rows.map((_, index) => (
        <View key={index} style={styles.skeletonContainer}>
          <View style={styles.circleLoader} />
          <View style={[styles.skeletonButton, { width: 250 }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 30,
  },
  imageContainer: {
    backgroundColor: "#e0e0e0",
    height: 50,
    width: 50,
    marginRight: 12,
    borderRadius: 5,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  textContainer1: {
    marginLeft: 20,
    marginTop:20,
  },
  textContainerAll: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  skeletonItem: {
    backgroundColor: "#e0e0e0", // Light gray color for skeletons
    borderRadius: 4,
  },
  skeletonText: {
    height: 20,
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    // paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonButton: {
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginLeft :10
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    margin:10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleLoader: {
    width: 70,
    height: 70,
    borderRadius: 50, 
    backgroundColor: '#e0e0e0',
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getNotification,
  updatePushNotification,
} from "../../Global/Notifications/PushNotificationService";
import RenderHTML from "react-native-render-html";
import { NotificationLoder } from "../../Global/Components/SkeletonStructures";

interface Notification {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  status: string;
}

const NotificationsScreen = () => {
  const { width } = useWindowDimensions();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllNotifications(true);
  }, []);

  const getAllNotifications = async (isLoading: boolean) => {
    if (isLoading) {
      setLoading(true);
    }
    try {
      const response = await getNotification();
      setNotifications(response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching notifications:", error);
    } finally {
      if (isLoading) {
        setLoading(false);
      }
    }
  };
  const handleNotificationUnreadClick = async (notification: any) => {
    console.log(notification, "notification clicked");
    if (notification.status === "unread") {
      try {
        const payload = {
          notificationId: notification._id,
          userId: notification.userId,
        };
        console.log(payload, "payloadpayload");
        const response = await updatePushNotification(payload);
        console.log("Update response:", response);
        if (response.success === 1) {
          getAllNotifications(false);
        }
      } catch (error) {
        console.error("Error updating notification status:", error);
      }
    }
  };

  const formatTimeAgo = (createdAt: string) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdAtDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.round(diffInMinutes / 1440);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <NotificationLoder />
      ) : notifications.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.notificationCard,
                {
                  backgroundColor:
                    item.status === "unread" ? "#d0e3fc" : "transparent",
                },
              ]}
              onPress={() => handleNotificationUnreadClick(item)}
            >
              <RenderHTML
                contentWidth={width}
                source={{ html: item?.title ?? "" }}
              />
              <RenderHTML
                contentWidth={width}
                source={{ html: item?.body ?? "" }}
                tagsStyles={{
                  strong: { color: "blue" },
                }}
              />
              <Text style={styles.time}>{formatTimeAgo(item.createdAt)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/NoNotification.png")}
            style={styles.image}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  notificationCard: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default NotificationsScreen;

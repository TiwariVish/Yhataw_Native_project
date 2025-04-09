import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  ActivityIndicator,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import CustomSearchBar from "../../NewDesine/GlobalComponets/CustomSearchBar";
import { LeadsSkeleton } from "../../Global/Components/SkeletonStructures";
import CustomCardLead from "../../NewDesine/GlobalComponets/CustomCardLead";
import store from "../../utils/store";
import { getAllUsers } from "./DashboardService";
import { getReminderCall } from "./LeadsService";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AllFilterBottomSheetModel from "../../Global/PopAndModels/AllFilterBottomSheetModel";
import { setLeadDatad } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";
import { LoginScreenNavigationProp, RootStackParamList } from "../type";

const AllLeadScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  type RouteProps = RouteProp<RootStackParamList, "AllLeadScreen">;
  const route = useRoute<RouteProps>();
  const selectViewData = route.params?.selectedView || null;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLeadData, setAllLeadData] = useState<any[]>([]);
  const [reminderData, setReminderData] = useState<{ [key: string]: any }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    pageNo: 0,
  });
  const [selectedStages, setSelectedStages] = useState([]);
  const [filters, setFilters] = useState<any>({});
  const [filteredLeadsnew, setFilteredLeads] = useState<any[]>([]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      getLeadDataAll(0);
    }
  }, [filters]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        if (isActive) await getLeadDataAll(0, paginationModel.pageSize, false);
      })();
      return () => {
        isActive = false;
      };
    }, [searchQuery, filteredLeadsnew])
  );

  useEffect(() => {
    (async () => {
      await handleReminder();
    })();
  }, [allLeadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getLeadDataAll(0, paginationModel.pageSize, false);
    setRefreshing(false);
  };

  const handleCardDataLeads = (item: any) => {
    dispatch(setLeadDatad(item));
    navigation.navigate("LeadInfoScreen", { selectedCard: 1 });
  };

  const getLeadDataAll = useCallback(
    async (
      pageNo: number,
      pageSize: number = paginationModel.pageSize,
      append = false
    ) => {
      setLoading(true);
      try {
        const payload = {
          userId: store.getState().auth.userId,
          pageNo: pageNo,
          pageSize: pageSize,
          search: searchQuery,
          start_date: "",
          end_date: "",
          formId: filters?.formId?.length ? filters.formId : null,
        };

        const response = await getAllUsers(payload);

        if (append) {
          setAllLeadData((prevData) => [
            ...prevData,
            ...(response?.data || []),
          ]);
        } else {
          setAllLeadData(response?.data || []);
        }

        setPaginationModel({ pageNo, pageSize });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching team lead data:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, filters]
  );

  const handleApplyFilters = (filters: any) => {
    console.log(filters, "filtersfiltersfiltersfiltersfiltersfiltersfilters");

    setFilters(filters);
    setIsVisible(false);

    const form_Name = Array.isArray(filters?.formId)
      ? filters.formId.map((formId: string) => formId.trim())
      : [];
    console.log(form_Name, "form_Nameform_Nameform_Nameform_Name");

    setSelectedStages(form_Name);
  };

  const handleLoadMore = useCallback(() => {
    if (!loading) {
      setPaginationModel((prevModel) => {
        const newPage = prevModel.pageNo + 1;
        getLeadDataAll(newPage, prevModel.pageSize, true);
        return { ...prevModel, pageNo: newPage };
      });
    }
  }, [loading]);

  const handleReminder = useCallback(async () => {
    if (allLeadData.length === 0) return;
    try {
      const remindersArray = await Promise.all(
        allLeadData.map(async (lead) => {
          try {
            const response = await getReminderCall(lead._id);
            return { [lead._id]: response.data ?? "No Reminder" };
          } catch (error) {
            console.error(
              `Error fetching reminder for lead ${lead._id}`,
              error
            );
            return { [lead._id]: "No Reminder" };
          }
        })
      );

      setReminderData(Object.assign({}, ...remindersArray));
    } catch (error) {
      console.error("Error in handleReminder:", error);
    }
  }, [allLeadData]);

  const handleDialPress = useCallback(async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Phone dialer is not available");
      }
    } catch (err) {
      console.error("Error opening dialer:", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <CustomSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setIsVisible(true)}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100
          ) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {loading && paginationModel.pageNo === 0 ? (
          <LeadsSkeleton />
        ) : filteredLeadsnew.length > 0 || allLeadData.length > 0 ? (
          (filteredLeadsnew.length > 0 ? filteredLeadsnew : allLeadData).map(
            (lead, index) => (
              <CustomCardLead
                key={index}
                name={lead?.leadName ?? ""}
                status={lead?.stage ?? ""}
                form_name={lead?.form_name ?? ""}
                dateTimeShow={lead?.createdAt ?? ""}
                priority={lead?.priority ?? ""}
                reminder={reminderData[lead._id] ?? "No Reminder"}
                onCallPress={() => handleDialPress(lead.leadPhone)}
                onMorePress={() =>
                  console.log(`More options for ${lead.leadName}`)
                }
                onTextPress={() => handleCardDataLeads(lead)}
              />
            )
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/nodatafound.png")}
              style={styles.image}
            />
          </View>
        )}

        {loading && paginationModel.pageNo > 0 && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size={30} color="#0000ff" />
          </View>
        )}
      </ScrollView>
      <Modal
        visible={isVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheetContainer}>
          <AllFilterBottomSheetModel
            visible={isVisible}
            onClose={() => setIsVisible(false)}
            onApplyFilters={handleApplyFilters}
            selectedStagesLocal={selectedStages}
            selectViewData={selectViewData}
            selectedFormdataFilter={filters.formId || []}
            selectedTab
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingMore: {
    marginVertical: 20,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "white",
  },
  bottomSheetContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
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

export default AllLeadScreen;

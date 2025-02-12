import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import FlipButtonBar from "../../Global/Components/FlipButtonBar";
import { getTeamList } from "./DashboardService";
import { RootStackParamList } from "../type";
import { RouteProp, useRoute } from "@react-navigation/native";
import CustomCardLead from "../../NewDesine/GlobalComponets/CustomCardLead";
import { getAllUsersAll } from "./AllTeamListService";
import CustomSearchBar from "../../NewDesine/GlobalComponets/CustomSearchBar";

const AllTeamList = () => {
  const [leadStatus, setLeadStatus] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>("All");
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedSubSegment, setSelectedSubSegment] = useState<string>("");
  const [allUserTeamWise, setAllUserTeamWise] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

  type RouteProps = RouteProp<RootStackParamList, "AllTeamList">;
  const route = useRoute<RouteProps>();
  const passedTeam = route.params?.allTeams || null;

  useEffect(() => {
    fetchTeamList();
  }, []);

  useEffect(() => {
    if (selectedTeam?.sub_teams?.length) {
      setSelectedSubSegment(selectedTeam.sub_teams[0].team_name);
      fetchUserDetails(selectedTeam.sub_teams[0]._id);
    } else {
      fetchUserDetails(selectedTeam?._id || "");
    }
  }, [selectedTeam]);

  const fetchUserDetails = async (teamId: string = "") => {
    try {
      const payload = {
        startDate: "",
        endDate: "",
        pageNumber: 0,
        pageSize: 25,
        teamId,
        search: "",
      };
      const res = await getAllUsersAll(payload);
      setAllUserTeamWise(res.data || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTeamList = async () => {
    try {
      const res = await getTeamList();
      const teams = res.data || [];
      setAllTeams(teams);
      setLeadStatus(["All", ...teams.map((team: any) => team.team_name)]);

      let matchedTeam = null;

      if (passedTeam && passedTeam.id && passedTeam.title) {
        matchedTeam = teams.find(
          (team: any) =>
            team.id === passedTeam.id ||
            team.team_name.trim().toLowerCase() ===
              passedTeam.title.trim().toLowerCase()
        );
      }

      if (matchedTeam) {
        setSelectedSegment(matchedTeam.team_name);
        setSelectedTeam(matchedTeam);
      } else {
        setSelectedSegment("All");
      }
    } catch (error) {
      console.error("Error fetching team list:", error);
    }
  };

  const handleSegmentChange = useCallback(
    (segment: string) => {
      if (segment === "All") {
        setSelectedSegment("All");
        setSelectedTeam(null);
        setSelectedSubSegment("");
        fetchUserDetails();
      } else {
        const team = allTeams.find((t) => t.team_name === segment);
        if (team) {
          setSelectedSegment(segment);
          setSelectedTeam(team);
        }
      }
    },
    [allTeams]
  );

  const handleSubSegmentChange = useCallback(
    (subSegment: string) => {
      const subTeam = selectedTeam?.sub_teams.find(
        (team) => team.team_name === subSegment
      );
      setSelectedSubSegment(subSegment);
      if (subTeam) fetchUserDetails(subTeam._id);
    },
    [selectedTeam]
  );

  const subTeams = selectedTeam?.sub_teams?.map((t: any) => t.team_name) || [];
  const filteredUsers = allUserTeamWise.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <FlipButtonBar
        segments={leadStatus}
        selectedSegment={selectedSegment}
        onSegmentChange={handleSegmentChange}
      />

      <CustomSearchBar
       value={searchQuery}
       onChangeText={(query) => setSearchQuery(query)}
        onFilterPress={() => console.log("Filter button pressed")}
      />

      {subTeams.length > 0 && (
        <View style={styles.tabContainer}>
          {subTeams.map((tab, index) => (
            <Pressable
              key={index}
              onPress={() => handleSubSegmentChange(tab)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedSubSegment === tab && styles.selectedText,
                ]}
              >
                {tab}
              </Text>
              {selectedSubSegment === tab && <View style={styles.underline} />}
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((item, index) => (
              <CustomCardLead
                key={item._id || index}
                name={item.name}
                status=""
                onCallPress={() => console.log("Call Pressed", item.user_name)}
                onMorePress={() =>
                  console.log("More Options Pressed", item.user_name)
                }
                onTextPress={() => console.log("Text Pressed", item.user_name)}
              />
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text>No data available</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // paddingBottom: 5,
    // marginTop: 10,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  underline: {
    width: "75%",
    height: 3,
    backgroundColor: "#007AFF",
    // marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    // marginTop: 10,
    // padding: 5,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default AllTeamList;

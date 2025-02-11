import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import FlipButtonBar from "../../Global/Components/FlipButtonBar";
import { getTeamList } from "./DashboardService";
import { RootStackParamList } from "../type";
import { RouteProp, useRoute } from "@react-navigation/native";
import CustomCardLead from "../../NewDesine/GlobalComponets/CustomCardLead";
import { getPreSalesDetails } from "./AllTeamListService";

const AllTeamList = () => {
  const [leadStatus, setLeadStatus] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedSubSegment, setSelectedSubSegment] = useState<string>("");
  const [selectPreSalesData, setSelectPreSalesData] = useState<any[]>([]);

  type RouteProps = RouteProp<RootStackParamList, "AllTeamList">;
  const route = useRoute<RouteProps>();
  const passedTeam = route.params?.allTeams || null;
  console.log(passedTeam, "Passed Team Data");

  useEffect(() => {
    getMemberLeadStage();
    getPreSalesDetailsAll();
  }, []);

  useEffect(() => {
    if (selectedTeam && selectedTeam.sub_teams.length > 0) {
      setSelectedSubSegment(selectedTeam.sub_teams[0].team_name);
    }
  }, [selectedTeam]);

  const getPreSalesDetailsAll = async () => {
    try {
      const payload = {
        startDate: "",
        endDate: "",
        pageNumber: "",
        pageSize: "",
        teamId: "",
        search: "",
      };
      const res = await getPreSalesDetails(payload);
      setSelectPreSalesData(res.data);
    } catch (error) {
      console.error("Error fetching PreSales details:", error);
    }
  };

  const getMemberLeadStage = async () => {
    try {
      const res = await getTeamList();
      const teams = res.data || [];

      setAllTeams(teams);
      const segments = teams.map((team: any) => team.team_name);
      setLeadStatus(segments);

      let matchedTeam = null;

      if (passedTeam) {
        matchedTeam = teams.find(
          (team: any) =>
            team.id === passedTeam.id || 
            team.team_name.trim().toLowerCase() === passedTeam.title.trim().toLowerCase()
        );
      }

      console.log("Matched Team:", matchedTeam);

      if (matchedTeam) {
        setSelectedSegment(matchedTeam.team_name);
        setSelectedTeam(matchedTeam);

        if (matchedTeam.sub_teams.length > 0) {
          setSelectedSubSegment(matchedTeam.sub_teams[0].team_name);
        }
      } else if (teams.length > 0) {
        const firstTeam = teams[0];
        setSelectedSegment(firstTeam.team_name);
        setSelectedTeam(firstTeam);

        if (firstTeam.sub_teams.length > 0) {
          setSelectedSubSegment(firstTeam.sub_teams[0].team_name);
        }
      }
    } catch (error) {
      console.error("Error fetching team list:", error);
    }
  };

  const handleSegmentChange = (segment: string) => {
    const team = allTeams.find((t: any) => t.team_name === segment);
    if (team) {
      setSelectedTeam(team);
      setSelectedSegment(segment);

      if (team.sub_teams.length > 0) {
        setSelectedSubSegment(team.sub_teams[0].team_name);
      } else {
        setSelectedSubSegment("");
      }
    }
  };

  const handleSubSegmentChange = (subSegment: string) => {
    setSelectedSubSegment(subSegment);
  };

  const subTeams = selectedTeam
    ? selectedTeam.sub_teams.map((subTeam: any) => subTeam.team_name)
    : [];

  return (
    <View style={styles.container}>
      <FlipButtonBar
        segments={leadStatus}
        selectedSegment={selectedSegment}
        onSegmentChange={handleSegmentChange}
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
        {selectedSubSegment ? (
          selectPreSalesData.length > 0 ? (
            selectPreSalesData.map((item, index) => {
              const status = item.Initial
                ? "Initial"
                : item.Interested
                ? "Interested"
                : item["Call Back"]
                ? "Call Back"
                : "Unknown";

              return (
                <CustomCardLead
                  key={item._id || index}
                  name={item.user_name}
                  status={status}
                  onCallPress={() => console.log("Call Pressed", item.user_name)}
                  onMorePress={() =>
                    console.log("More Options Pressed", item.user_name)
                  }
                  onTextPress={() => console.log("Text Pressed", item.user_name)}
                />
              );
            })
          ) : (
            <View>
              <Text>No data available</Text>
            </View>
          )
        ) : (
          <View>
            <Text>Based on clicked data is coming</Text>
          </View>
        )}
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
    paddingBottom: 5,
    marginTop: 10,
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
    marginTop: 5,
  },
  contentContainer: {
    marginTop: 10,
    padding: 10,
  },
});

export default AllTeamList;

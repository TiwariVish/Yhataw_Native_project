import urls from "../../Global/constants/UrlConstants";
import { getCallParams, makeCall } from "../../utils/Service";




// export async function getAllUsers(payload: any) {
//     try {
//       const callParams = await getCallParams("GET");
//       const response = await makeCall(
//         urls.LEADDATA +
//           `?start_date=&end_date=&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&searchUserId=${payload.lead_id}`,
//         callParams
//       );
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }

// export async function getAllUsers(payload: any) {
//   try {
//     const callParams = await getCallParams("GET");
//     const response = await makeCall(
//       urls.LEADDATA +
//         `?start_date=${payload.startDate || ""}&end_date=${payload.endDate || ""}&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&teamId=${payload.team_id || ""}&formId=${payload.formId || ""}&search=${payload.search || ""}`,
//       callParams
//     );
//     console.log(response,"fbskjfskfjsvdkfsvfkjsdfsdfs")
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

export async function getAllTeamData(id: any) {
    try {
      const callParams = await getCallParams("GET");
      const response = await makeCall(`${urls.GETTEAMDROP}/${id}`, callParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllUsersMyLead(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      console.log(callParams, "callParams");
      const response = await makeCall(
        urls.MYLEAD +
          `?start_date=&end_date=&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&formId=${payload.formId || ""}&stage=${payload.stage || ""}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getLeadStageProspect(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      console.log(callParams, "callParams");
      const response = await makeCall(
        urls.MYLEADSTAGEPROSPECT +
          `?start_date=${payload.start_date}&end_date=${payload.end_date}&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&search=${payload.search || ""}&formId=${payload.formId|| ""}&stage=${payload.stage|| ""}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getLeadStageOpportunity(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      console.log(callParams, "callParams");
      const response = await makeCall(
        urls.MYLEADSTAGEPOPPORTUNITY +
          `?start_date=${payload.start_date}&end_date=${payload.end_date}&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&search=${payload.search || ""}&formId=${payload.formId|| ""}&stage=${payload.stage|| ""}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  export async function getLeadStageClosure(payload: any) {
    try {
      const callParams = await getCallParams("GET");
      console.log(callParams, "callParams");
      const response = await makeCall(
        urls.MYLEADSTAGECLOSURE +
          `?start_date=${payload.start_date}&end_date=${payload.end_date}&id=${payload.userId}&page=${payload.pageNo}&limit=${payload.pageSize}&search=${payload.search || ""}&formId=${payload.formId|| ""}&stage=${payload.stage|| ""}`,
        callParams
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
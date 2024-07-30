// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../utils/store";

// export interface BlockingState {
//   punchInId: string;
//   punchIin: string;
//   status: boolean;
// }

// const initialState: BlockingState = {
//   punchInId: "",
//   punchIin: "",
//   status: false,
// };

// export const userDataSlice = createSlice({
//   name: "userData",
//   initialState,
//   reducers: {
//     punchInAction: (
//       state,
//       action: PayloadAction<{
//         punchIin: string;
//         punchInIdUserId: string;
//       }>
//     ) => {
//       state.punchInId = action.payload.punchInIdUserId;
//       state.punchIin = action.payload.punchIin;
//     },
//     punchOutAction: (state, action: {}) => {
//       state.punchInId = "";
//       state.punchIin = "";
//     },
//     isDrawerOpen: (state, action: PayloadAction<boolean>) => {
//       state.status = action.payload;
//     },
//   },
// });
// export const { punchInAction, punchOutAction, isDrawerOpen } =
//   userDataSlice.actions;

// export const selectPunchInUserId = (state: RootState) =>
//   state.userData.punchInId;

// export default userDataSlice.reducer;

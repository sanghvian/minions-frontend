import { RecordType } from "@models/index";
import { CompleteLinkedinContact } from "@models/linkedinContact.model";
import { CompleteUser, User, UserStatus } from "@models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialHardCodedUser: { value: CompleteUser } = {
  value: {
    id: "30fe81ea-633c-41fc-bfaf-fe1c233159fd",
    email: "founders@recontact.world",
    firefliesApiKey: "",
    name: "Ankit",
    recordType: RecordType.USER,
    spreadsheetId: "",
    status: UserStatus.SUBSCRIBED,
    subscriptionExpiryDate: "",
    token:
      "ya29.a0AXooCgun10o2Wn_sRH8ZyM13pcYfUEvQmF4vHarDX_fXL1uXtTh0cpCZOhE0U65M0y_j_uPw9EESXjUtxNSp7C-OEAFjkJbzM8pIulCrLpypKA-hNknNqYSaon-mjkMSA5nb1uddUl2RnZKKbt7G1vQfScvmD5GIfgaCgYKAQUSARESFQHGX2MiTS2j6vrpOd21AltcyBX4Mw0169",
    usageCount: 0,
    currentVideoTime: 0,
  },
};

export const initialUserState: { value: CompleteUser } = {
  value: {
    token: "",
    // numTries: 0,
    subscriptionExpiryDate: "",
    email: "",
    name: "",
    photoURL: "",
    status: UserStatus.UNAUTHENTICATED,
    calendarId: "",
    currentVideoTime: 0,
  }
}

export const userSlice = createSlice({
  name: "user",
  initialState: initialHardCodedUser,
  reducers: {
    setUser(state: { value: CompleteUser }, action: PayloadAction<User>) {
      state.value = action.payload;
    },
    setUserToken(
      state: { value: CompleteUser },
      action: PayloadAction<string>
    ) {
      state.value.token = action.payload;
    },
    setUsageCount(state: { value: CompleteUser }, action: PayloadAction<number>) {
      state.value.usageCount = action.payload
    },
    // setNumTries(state: { value: CompleteUser }, action: PayloadAction<number>) {
    //   state.value.numTries = action.payload
    // },
    setSubscriptionExpiryDate(
      state: { value: CompleteUser },
      action: PayloadAction<string>
    ) {
      state.value.subscriptionExpiryDate = action.payload;
    },
    setUserEmail(
      state: { value: CompleteUser },
      action: PayloadAction<string>
    ) {
      state.value.email = action.payload;
    },
    setUserPhotoURL(
      state: { value: CompleteUser },
      action: PayloadAction<string>
    ) {
      state.value.photoURL = action.payload;
    },
    setUserName(state: { value: CompleteUser }, action: PayloadAction<string>) {
      state.value.name = action.payload;
    },
    setUserStatus(
      state: { value: CompleteUser },
      action: PayloadAction<UserStatus>
    ) {
      state.value.status = action.payload;
    },
    setUserLinkedinContact(
      state: { value: CompleteUser },
      action: PayloadAction<CompleteLinkedinContact>
    ) {
      state.value.linkedinContact = action.payload;
      state.value.linkedinContactId = action.payload.id;
    },
    setUserCalendarId(
      state: { value: CompleteUser },
      action: PayloadAction<string>
    ) {
      state.value.calendarId = action.payload;
    },
    setTokenInfo(state: { value: CompleteUser }, action: PayloadAction<any>) {
      state.value.tokenInfo = action.payload;
    },
    setUserActionCount(
      state: { value: CompleteUser },
      action: PayloadAction<number>
    ) {
      state.value.usageCount = action.payload;
    },
    setUserCurrentVideoTime(state: { value: CompleteUser }, action: PayloadAction<number>) {
      state.value.currentVideoTime = action.payload
    },
    setActiveUserEmail(state: { value: CompleteUser }, action: PayloadAction<string>) {
      state.value.activeUserEmail = action.payload;
    },
    setActiveTopicId(state: { value: CompleteUser }, action: PayloadAction<string>) {
      state.value.activeTopicId = action.payload
    }
  },
});

export const {
  setUserToken,
  setUsageCount,
  // setNumTries,
  setSubscriptionExpiryDate,
  setUserEmail,
  setUserPhotoURL,
  setUserName,
  setUserStatus,
  setUser,
  setUserCalendarId,
  setUserLinkedinContact,
  setTokenInfo,
  setUserActionCount,
  setUserCurrentVideoTime,
  setActiveUserEmail,
  setActiveTopicId
} = userSlice.actions;

export default userSlice.reducer;

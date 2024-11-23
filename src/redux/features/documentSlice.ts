import { CompleteDocument } from "@models/document.model";
import { RecordType } from "@models/index";
import { CompleteTemplate, Template } from "@models/template.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentSliceInterface {
  activeDocument: CompleteDocument
}

export const initialDocumentState: DocumentSliceInterface = {
  activeDocument: {
    _id: "",
    templateId: {
      _id: "",
      name: "",
      description: "",
      userId: "",
      createdAt: "",
      updatedAt: "",
      contentBlocks: [],
    },
    recordType: RecordType.DOCUMENT,
    userId: "",
    contactId: "",
    createdAt: "",
    updatedAt: "",
    videoId: "",
    contact: {
      name: "",
      namespace: "",
      biography: "",
      interests: [],
      occupation: "",
      organization_name: "",
      location: "",
      timestamp: "",
      noteIds: [],
      recordType: RecordType.CONTACT,
    },
    contentResponses: [],
  },
};

export const documentSlice = createSlice({
  name: "document",
  initialState: initialDocumentState,
  reducers: {
    setActiveDocument(
      state: DocumentSliceInterface,
      action: PayloadAction<CompleteDocument>
    ) {
      state.activeDocument = action.payload;
    }
  },
});

export const { setActiveDocument } = documentSlice.actions;

export default documentSlice.reducer;


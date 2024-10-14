import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Contact } from "../types";
import {
  createContact,
  deleteContact,
  getContacts,
  getContactById,
} from "../api/contactsApi";
import { RootState } from "./store";

interface ContactsState {
  items: Contact[];
  openContact: Contact | null;
  apiCallingProgress: boolean;
}

const initialState: ContactsState = {
  items: [],
  openContact: null,
  apiCallingProgress: false,
};

export const getContactsThunk = createAsyncThunk(
  "contacts/getContacts",
  async () => {
    const contacts = await getContacts();
    return contacts;
  }
);

export const deleteContactThunk = createAsyncThunk(
  "contact/deleteContact",
  async (contactId: string) => {
    const deletedContact = await deleteContact(contactId);
    return deletedContact;
  }
);
export const getContactByIdThunk = createAsyncThunk(
  "contact/getContactById",
  async (contactId: string) => {
    const contact = await getContactById(contactId);
    return contact;
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getContactsThunk.pending, (state) => {
        state.apiCallingProgress = true;
      })
      .addCase(getContactsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.apiCallingProgress = false;
      })
      .addCase(getContactsThunk.rejected, (state) => {
        state.apiCallingProgress = false;
      })
      .addCase(createContactThunk.pending, (state) => {
        state.apiCallingProgress = true;
      })
      .addCase(createContactThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.apiCallingProgress = false;
      })
      .addCase(createContactThunk.rejected, (state) => {
        state.apiCallingProgress = false;
      })
      .addCase(deleteContactThunk.pending, (state) => {
        state.apiCallingProgress = true;
      })
      .addCase(deleteContactThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => {
          item.login.uuid !== action.payload.login.uuid;
        });
        state.apiCallingProgress = false;
      })
      .addCase(deleteContactThunk.rejected, (state) => {
        state.apiCallingProgress = false;
      })
      .addCase(getContactByIdThunk.pending, (state) => {
        state.apiCallingProgress = true;
      })
      .addCase(getContactByIdThunk.fulfilled, (state, action) => {
        state.openContact = action.payload;
        state.apiCallingProgress = false;
      })
      .addCase(getContactByIdThunk.rejected, (state) => {
        state.apiCallingProgress = false;
      });
  },
});

const contactsReducer = contactsSlice.reducer;
export const selectApiCallInProgress = (state: RootState) => {
  return state.contacts.apiCallingProgress;
};
export const selectContactList = (state: RootState) => {
  return state.contacts.items;
};
export const createContactThunk = createAsyncThunk(
  "contacts/createcontact",
  async (contact: Partial<Contact>) => {
    const newContact = await createContact(contact);
    return newContact;
  }
);
export const selectOpenContact = (state: RootState) => {
  return state.contacts.openContact;
};

export default contactsReducer;

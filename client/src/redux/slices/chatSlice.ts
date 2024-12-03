import { IChat, ChatState } from '../../types/chat-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';


const initialState: ChatState = {
  list: [],
  loading: false,
  error: null
}

export const fetchGlobalChats = createAsyncThunk ('chats/fetchGloablChats', 
  async(responderid: string | undefined, thunkApi) => {
    try{
      const token = localStorage.getItem('token');
      
      if (!token) {
        return thunkApi.rejectWithValue('No token provided');
      }

      const response = await axios.get(`http://localhost:3000/api/chat/${responderid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json',  
          }
        }
      );
      return response.data
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('Failed to fetch incidents');
    }
  })

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchGlobalChats.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchGlobalChats.fulfilled, (state, action: PayloadAction<Incident[]>) => {
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(fetchGlobalChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string
    })
  }
});

export default chatSlice.reducer
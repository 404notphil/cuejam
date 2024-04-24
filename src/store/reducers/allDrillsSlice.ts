// src/features/drills/drillsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from '../../app/store'; // Adjust the import path as needed
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import getDb from '../../app/db'; // Adjust based on where your getDb function is
import {ConfigureDrillState} from './configureDrillReducer';
import {RootState} from '../store';

export interface Drill {
  id: number;
  name: string;
  configuration: ConfigureDrillState;
}

export interface DrillsState {
  drills: Drill[];
  loading: boolean;
  error: string | null;
}

const initialState: DrillsState = {
  drills: [],
  loading: false,
  error: null,
};

const drillsSlice = createSlice({
  name: 'drills',
  initialState,
  reducers: {
    loadStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadSuccess(state, action: PayloadAction<Drill[]>) {
      state.drills = action.payload;
      state.loading = false;
    },
    loadFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {loadStart, loadSuccess, loadFailure} = drillsSlice.actions;

export default drillsSlice.reducer;

export const selectAllDrills: (state: RootState) => DrillsState = state =>
  state.allDrillsReducer;

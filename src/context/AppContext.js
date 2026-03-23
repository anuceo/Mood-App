/**
 * AppContext — global state for Mood App.
 *
 * Manages:
 *   - auth (user, token, login/signup/logout)
 *   - feed (items, pagination, mood filter, refresh)
 *   - resonance toggling with optimistic updates
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, boardApi, contentApi, setAuthToken, clearAuthToken, setUnauthorizedHandler } from '../services/api';

// ─── State shape ──────────────────────────────────────────────────────────────

const initialState = {
  // Auth
  user: null,
  token: null,
  authLoading: true,   // true while restoring token from storage on app start
  authError: null,

  // Feed
  feedItems: [],
  feedMoodFilter: null,
  feedPage: 1,
  feedTotal: 0,
  feedLoading: false,
  feedRefreshing: false,
  feedError: null,

  // Boards
  boards: [],
  boardsLoading: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const reducer = (state, action) => {
  switch (action.type) {
    // Auth
    case 'AUTH_LOADING':
      return { ...state, authLoading: true, authError: null };
    case 'AUTH_SUCCESS':
      return { ...state, authLoading: false, authError: null, user: action.user, token: action.token };
    case 'AUTH_ERROR':
      return { ...state, authLoading: false, authError: action.error };
    case 'AUTH_RESTORE_DONE':
      return { ...state, authLoading: false };
    case 'LOGOUT':
      return { ...initialState, authLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.user };

    // Feed
    case 'FEED_LOADING':
      return { ...state, feedLoading: true, feedError: null };
    case 'FEED_REFRESHING':
      return { ...state, feedRefreshing: true, feedError: null };
    case 'FEED_LOADED':
      return {
        ...state,
        feedLoading: false,
        feedRefreshing: false,
        feedItems: action.append ? [...state.feedItems, ...action.items] : action.items,
        feedPage: action.page,
        feedTotal: action.total,
        feedError: null,
      };
    case 'FEED_ERROR':
      return { ...state, feedLoading: false, feedRefreshing: false, feedError: action.error };
    case 'SET_MOOD_FILTER':
      return { ...state, feedMoodFilter: action.mood, feedItems: [], feedPage: 1 };

    // Optimistic resonance toggle
    case 'TOGGLE_RESONANCE':
      return {
        ...state,
        feedItems: state.feedItems.map((item) =>
          item._id === action.contentId
            ? {
                ...item,
                resonated: action.resonated,
                resonanceCount: item.resonanceCount + (action.resonated ? 1 : -1),
              }
            : item
        ),
      };
    case 'RESONANCE_CONFIRMED':
      return {
        ...state,
        feedItems: state.feedItems.map((item) =>
          item._id === action.contentId
            ? { ...item, resonanceCount: action.resonanceCount }
            : item
        ),
      };
    case 'RESONANCE_REVERTED':
      return {
        ...state,
        feedItems: state.feedItems.map((item) =>
          item._id === action.contentId
            ? {
                ...item,
                resonated: !action.resonated,
                resonanceCount: item.resonanceCount + (action.resonated ? -1 : 1),
              }
            : item
        ),
      };

    // Boards
    case 'BOARDS_LOADING':
      return { ...state, boardsLoading: true };
    case 'BOARDS_LOADED':
      return { ...state, boardsLoading: false, boards: action.boards };
    case 'BOARD_CREATED':
      return { ...state, boards: [action.board, ...state.boards] };
    case 'BOARD_DELETED':
      return { ...state, boards: state.boards.filter((b) => b._id !== action.boardId) };

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── 401 auto-logout ────────────────────────────────────────────────────────
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuthToken();
      AsyncStorage.removeItem('auth');
      dispatch({ type: 'LOGOUT' });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restore token on app launch ────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const { token, user } = JSON.parse(stored);
          setAuthToken(token);
          dispatch({ type: 'AUTH_SUCCESS', token, user });
        } else {
          dispatch({ type: 'AUTH_RESTORE_DONE' });
        }
      } catch {
        dispatch({ type: 'AUTH_RESTORE_DONE' });
      }
    };
    restore();
  }, []);

  // ── Auth actions ───────────────────────────────────────────────────────────

  const signup = useCallback(async (handle, email, password, primaryMood = null) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { token, user } = await authApi.signup(handle, email, password, primaryMood);
      setAuthToken(token);
      await AsyncStorage.setItem('auth', JSON.stringify({ token, user }));
      dispatch({ type: 'AUTH_SUCCESS', token, user });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', error: err.message });
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const { token, user } = await authApi.login(email, password);
      setAuthToken(token);
      await AsyncStorage.setItem('auth', JSON.stringify({ token, user }));
      dispatch({ type: 'AUTH_SUCCESS', token, user });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', error: err.message });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    clearAuthToken();
    await AsyncStorage.removeItem('auth');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const { user } = await authApi.updateMe(updates);
    await AsyncStorage.mergeItem('auth', JSON.stringify({ user }));
    dispatch({ type: 'UPDATE_USER', user });
  }, []);

  // ── Feed actions ───────────────────────────────────────────────────────────

  const loadFeed = useCallback(async ({ mood, page = 1, refresh = false } = {}) => {
    dispatch({ type: refresh ? 'FEED_REFRESHING' : 'FEED_LOADING' });
    try {
      const { items, pagination } = await contentApi.getFeed({ mood, page });
      dispatch({
        type: 'FEED_LOADED',
        items,
        page: pagination.page,
        total: pagination.total,
        append: page > 1 && !refresh,
      });
    } catch (err) {
      dispatch({ type: 'FEED_ERROR', error: err.message });
    }
  }, []);

  const setMoodFilter = useCallback((mood) => {
    dispatch({ type: 'SET_MOOD_FILTER', mood });
  }, []);

  const loadNextPage = useCallback(() => {
    const { feedPage, feedTotal, feedItems, feedMoodFilter, feedLoading } = state;
    if (feedLoading || feedItems.length >= feedTotal) return;
    loadFeed({ mood: feedMoodFilter, page: feedPage + 1 });
  }, [state, loadFeed]);

  // ── Resonance ──────────────────────────────────────────────────────────────

  const toggleResonate = useCallback(async (contentId, currentResonated) => {
    const next = !currentResonated;
    // Optimistic update
    dispatch({ type: 'TOGGLE_RESONANCE', contentId, resonated: next });
    try {
      const { resonanceCount } = await contentApi.toggleResonate(contentId);
      dispatch({ type: 'RESONANCE_CONFIRMED', contentId, resonanceCount });
    } catch {
      // Revert on failure
      dispatch({ type: 'RESONANCE_REVERTED', contentId, resonated: next });
    }
  }, []);

  // ── Board actions ──────────────────────────────────────────────────────────

  const loadBoards = useCallback(async () => {
    dispatch({ type: 'BOARDS_LOADING' });
    const { boards } = await boardApi.getMyBoards();
    dispatch({ type: 'BOARDS_LOADED', boards });
  }, []);

  const createBoard = useCallback(async (data) => {
    const { board } = await boardApi.createBoard(data);
    dispatch({ type: 'BOARD_CREATED', board });
    return board;
  }, []);

  const deleteBoard = useCallback(async (boardId) => {
    await boardApi.deleteBoard(boardId);
    dispatch({ type: 'BOARD_DELETED', boardId });
  }, []);

  const value = {
    ...state,
    // Auth
    signup,
    login,
    logout,
    updateProfile,
    // Feed
    loadFeed,
    setMoodFilter,
    loadNextPage,
    // Resonance
    toggleResonate,
    // Boards
    loadBoards,
    createBoard,
    deleteBoard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};

export default AppContext;

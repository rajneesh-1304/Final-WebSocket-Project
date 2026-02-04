import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as answerService from './answerService';


export const fetchAnswersThunk = createAsyncThunk(
  'answers/fetchByQuestion',
  async (questionId: number) => {
    const data = await answerService.getAnswersByQuestion(questionId);
    return data;
  }
);

export const createAnswerThunk = createAsyncThunk(
  'answers/create',
  async (payload: { content: string; userId: number; questionId: number }) => {
    const data = await answerService.createAnswer(payload);
    return data;
  }
);

export const replyAnswerThunk = createAsyncThunk(
  'answers/reply',
  async (
    { answerId, payload }: { answerId: number; payload: { answer: string; userId: number } }
  ) => {
    const data = await answerService.replyToAnswer(answerId, payload);
    return data;
  }
);

export const fetchRepliesThunk = createAsyncThunk(
  'answers/fetchReplies',
  async (answerId: number) => {
    const data = await answerService.getRepliesByAnswer(answerId);
    return { answerId, replies: data };
  }
);

export const upvoteAnswerThunk = createAsyncThunk(
  'answers/upvote',
  async ({answerId, userId}:any) => {
    const data = await answerService.upvoteAnswer(answerId, userId);
    return { answerId, ...data }; 
  }
);

export const downvoteAnswerThunk = createAsyncThunk(
  'answers/downvote',
  async ({answerId, userId}: any) => {
    const data = await answerService.downvoteAnswer(answerId, userId);
    return { answerId, ...data };
  }
);

const answerSlice = createSlice({
  name: 'answers',
  initialState: {
    answers: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAnswersThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnswersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.answers = action.payload;
      })
      .addCase(fetchAnswersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch answers';
      })

      .addCase(createAnswerThunk.fulfilled, state => {
      })

      .addCase(replyAnswerThunk.fulfilled, state => {
      })

      .addCase(fetchRepliesThunk.fulfilled, (state, action) => {
        const { answerId, replies } = action.payload;
        const ans = state.answers.find(a => a.id === answerId);
        if (ans) ans.replies = replies; 
      })

      .addCase(upvoteAnswerThunk.fulfilled, (state, action) => {
        const { answerId, upVotes } = action.payload;
        const ans = state.answers.find(a => a.id === answerId);
        if (ans) ans.upVotes = upVotes;
      })

      .addCase(downvoteAnswerThunk.fulfilled, (state, action) => {
        const { answerId, downVotes } = action.payload;
        const ans = state.answers.find(a => a.id === answerId);
        if (ans) ans.downVotes = downVotes;
      });
  },
});

export default answerSlice.reducer;

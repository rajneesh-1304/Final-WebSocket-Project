import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchQuestions, createQuestion, getQuestionId, upvoteQuestionAPI, downvoteQuestionAPI, updateQues, publishQues, deleteQuestion } from "./questionService";

export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  displayName: string;
}

export interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  user: User;
  tags: Tag[];
}

interface FetchQuestionsParams {
  page: number;
  limit: number;
  search?: string;
  sort?: 'score' | 'newest'; 
  tags?: string[];        
}


interface QuestionsState {
  questions: Question[];
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
};

export const fetchQuestionsThunk = createAsyncThunk(
  'questions/fetchAll',
  async (
    { page, limit, search, sort, tags }: FetchQuestionsParams,
    { rejectWithValue }
  ) => {
    try {
      return await fetchQuestions({ page, limit, search, sort, tags });
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch questions');
    }
  }
);


export const createQuestionThunk = createAsyncThunk(
  "questions/create",
  async (questionData: {
    title: string;
    description: string;
    type: string;
    userId: number;
    tags: string[];
  }, { rejectWithValue }) => {
    try {
      return await createQuestion(questionData);
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
);



export const getQuestionById = createAsyncThunk(
  "question/getbyId",
  async (id: number, { rejectWithValue }) => {
    try {
      return await getQuestionId(String(id));
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to create question");
    }
  }
)

export const upvoteQuestionThunk = createAsyncThunk(
  'questions/upvote',
  async ({ questionId, userId }: { questionId: number; userId: number }, { rejectWithValue }) => {
    try {
      return await upvoteQuestionAPI(questionId, userId);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to upvote question');
    }
  }
);

export const downvoteQuestionThunk = createAsyncThunk(
  'questions/downvote',
  async ({ questionId, userId }: { questionId: number; userId: number }, { rejectWithValue }) => {
    try {
      return await downvoteQuestionAPI(questionId, userId);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to downvote question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/update',
  async( {id, userId, payload}: any,{ rejectWithValue }) => {
    try {
      console.log(id, userId, payload, 'this is fskadflaks')
      return await updateQues(id, userId, payload);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to downvote question');
    }
  }
)

export const publishQuestion = createAsyncThunk(
  'questions/update',
  async( {id, userId}: any,{ rejectWithValue }) => {
    try {
      return await publishQues(id, userId);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to downvote question');
    }
  }
)


export const deleteQuestionThunk = createAsyncThunk(
  'question/delete',
  async(id: any, { rejectWithValue }) => {
    try {
      return await deleteQuestion(id);
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to downvote question');
    }
  }
)

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action) => {
        const { page, data } = action.payload;

        if (page === 1) {
          state.questions = data;
        } else {
          state.questions = [...state.questions, ...data];
        }

        state.loading = false;
      })

      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(createQuestionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.currentQuestion = action.payload;
        state.loading = false;
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload);
      })

      .addCase(upvoteQuestionThunk.fulfilled, (state, action) => {
        console.log(action.payload, 'lfjkalsjdkf')
        // state.loading = false;
        // state.error = String(action.payload);
      });
  },
});

export const { clearQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;

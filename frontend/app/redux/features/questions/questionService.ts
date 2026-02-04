import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchQuestionsParams {
  page: number;
  limit: number;
  search?: string;
  sort?: 'score' | 'newest'; 
  tags?: string[];        
}


export const fetchQuestions = async ({
  page,
  limit,
  search,
  sort,
  tags,
}: FetchQuestionsParams) => {
  try {
    const res = await axios.get(`${BASE_URL}/questions`, {
      params: {
        page,
        limit,
        search,
        sort,
        tags: tags?.join(','),
      },
    });

    return res.data;
  } catch (err: any) {
    console.error('Error fetching questions:', err);
    throw err?.response?.data || err.message;
  }
};


export const createQuestion = async (questionData: {
  title: string;
  description: string;
  type: string;
  userId: number;
  tags: string[];
}) => {
  try {
    const res = await axios.post(`${BASE_URL}/questions`, questionData);
    return res.data;
  } catch (err: any) {
    console.error("Error creating question:", err);
    throw err?.response?.data || err.message;
  }
};

export const getQuestionId = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/questions/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Error creating question:", err);
    throw err?.response?.data || err.message;
  }
}

export const upvoteQuestionAPI = async (
  questionId: number,
  userId: number
) => {
  const response = await axios.patch(
    `${BASE_URL}/questions/${questionId}/upvote`,
    { userId }
  );
  return response.data;
};


export const downvoteQuestionAPI = async (
  questionId: number,
  userId: number
) => {
  const response = await axios.patch(
    `${BASE_URL}/questions/${questionId}/downvote`,
    { userId }
  );
  return response.data;
};

export const updateQues = async (
  questionId: any,
  userId: any,
  data: any
) => {
  console.log(data, 'this is data')
  const response = await axios.patch(`${BASE_URL}/questions/${questionId}`, data);
  return response.data;
}

export const publishQues = async (
  questionId: any,
  userId: any,
) => {
  const response = await axios.patch(`${BASE_URL}/questions/${questionId}/publish`, { userId });
  return response.data;
}

export const deleteQuestion = async (id: number) => {
  const response = await axios.patch(`${BASE_URL}/questions/delete/${id}`);
  return response.data;
}
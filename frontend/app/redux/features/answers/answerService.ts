import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAnswersByQuestion = async (questionId: number) => {
  const res = await axios.get(`${BASE_URL}/answers/question/${questionId}`);
  return res.data;
};

export const createAnswer = async (data: {
  answer: string;
  userId: number;
  questionId: number;
}) => {
  const res = await axios.post(`${BASE_URL}/answers`, data);
  return res.data;
};

export const replyToAnswer = async (
  answerId: number,
  data: {
    content: string;
    userId: number;
  }
) => {
  const res = await axios.post(`${BASE_URL}/answers/${answerId}/reply`, data);
  return res.data;
};

export const upvoteAnswer = async (answerId: number, userId: number) => {
  const res = await axios.patch(`${BASE_URL}/answers/${answerId}/upvote`, userId);
  return res.data;
};

export const downvoteAnswer = async (answerId: number, userId: number) => {
  const res = await axios.patch(`${BASE_URL}/answers/${answerId}/downvote`, userId);
  return res.data;
};

export const getRepliesByAnswer = async (answerId: number) => {
  const res = await axios.get(`${BASE_URL}/answers/${answerId}/replies`);
  return res.data;
};

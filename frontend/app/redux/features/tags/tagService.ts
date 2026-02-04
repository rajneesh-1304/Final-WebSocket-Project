import axios from 'axios'; 

export interface Tag {
  id: number;
  name: string;
}

export const fetchTagsAPI = async () => {
  const res = await axios.get('http://localhost:3001/tags');
  return res.data;
};

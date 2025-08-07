import axios from 'axios';

export const getOAuthToken = async (code: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/callback`,
    { code: code },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

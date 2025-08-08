export type University = {
  name: string;
  isPublic: boolean;
};
export type User = {
  id: string;
  name: string;
  mbti: string;
  career: string;
  bio?: string;
  university: University;
  photos: string[]; //최대 3장허용
};

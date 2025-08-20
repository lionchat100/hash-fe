'use client';
import { useMutation } from '@tanstack/react-query';
import { checkNickname } from '../api/checkNickname';

export const useCheckNickname = () =>
  useMutation({
    mutationFn: (nickname: string) => checkNickname(nickname),
  });

'use client';

import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { postFeed } from '../api/postFeed';
import { FeedReq } from '@/entities/feed/model/types';
import { toast } from 'sonner';

interface FeedPostFormProps {
  onSuccess: (feedId: number) => void;
  onCancel: () => void;
  onFormStateChange?: (isValid: boolean, isSubmitting: boolean, hasContent: boolean) => void;
}

export interface FeedPostFormRef {
  submit: () => Promise<void>;
  isValid: boolean;
  isSubmitting: boolean;
}

export const FeedPostForm = forwardRef<FeedPostFormRef, FeedPostFormProps>(
  ({ onSuccess, onCancel, onFormStateChange }, ref) => {
    const [formData, setFormData] = useState<FeedReq>({
      title: '',
      content: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValid: boolean = Boolean(formData.title.trim() && formData.content.trim());
    const hasContent: boolean = Boolean(formData.title.trim() || formData.content.trim());

    const notifyFormStateChange = () => {
      onFormStateChange?.(isValid, isSubmitting, hasContent);
    };

    useEffect(() => {
      notifyFormStateChange();
    }, [isValid, isSubmitting, hasContent]);

    const handleInputChange =
      (field: keyof FeedReq) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
        setTimeout(() => notifyFormStateChange(), 0);
      };

    const submitForm = async () => {
      if (!isValid) {
        toast.error('제목과 내용을 모두 입력해주세요.', {
          position: 'bottom-center',
          duration: 3000,
        });
        return;
      }

      setIsSubmitting(true);
      notifyFormStateChange();

      try {
        const feedId = await postFeed(formData);
        onSuccess?.(feedId);
        setFormData({ title: '', content: '' });
        toast.success('피드 작성에 성공했습니다.', {
          position: 'bottom-center',
          duration: 3000,
        });
      } catch (error) {
        console.error('피드 작성 실패:', error);
        toast.error('피드 작성에 실패했습니다. 다시 시도해주세요.', {
          position: 'bottom-center',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
        notifyFormStateChange();
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await submitForm();
    };

    useImperativeHandle(ref, () => ({
      submit: submitForm,
      isValid,
      isSubmitting,
    }));

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="space-y-2">
          <Input
            id="title"
            type="text"
            placeholder="제목을 입력해주세요"
            value={formData.title}
            onChange={handleInputChange('title')}
            required
            disabled={isSubmitting}
            className="border-b-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="space-y-2">
          <Textarea
            id="content"
            placeholder="친구들과 자유롭게 이야기 해보세요"
            value={formData.content}
            onChange={handleInputChange('content')}
            required
            disabled={isSubmitting}
            rows={6}
            className="resize-none rounded-none bg-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </form>
    );
  },
);

FeedPostForm.displayName = 'FeedPostForm';

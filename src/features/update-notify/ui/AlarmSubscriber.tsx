'use client';
import { useAlarmSubscription } from '../model/useAlarmSubscription';

export function AlarmSubscriber() {
  useAlarmSubscription();
  return null;
}

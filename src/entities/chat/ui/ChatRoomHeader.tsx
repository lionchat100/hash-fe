import clsx from 'clsx';

interface ChatRoomHeaderProps {
  className?: string;
}

export const ChatRoomHeader = (props: ChatRoomHeaderProps) => {
  return <div className={clsx(props.className)}>상대방 이름</div>;
};

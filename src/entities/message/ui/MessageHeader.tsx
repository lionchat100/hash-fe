import clsx from 'clsx';

interface MessageHeaderProps {
  className?: string;
}

export const MessageHeader = (props: MessageHeaderProps) => {
  return <div className={clsx(props.className)}>상대방 이름</div>;
};

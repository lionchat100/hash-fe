export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
    </div>
  );
}

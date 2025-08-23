export const PolicyCard = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 rounded-xl bg-stone-200 p-5 text-sm font-medium text-stone-500">
        <div>보안정책 사항</div>
        <div>
          Tokit은 건전한 네트워킹 공간을 지향합니다. 욕설, 비방, 성적 발언, 불법 정보 유포 등 운영 정책에 위반되는
          행위는 사전 경고 없이 삭제 및 이용 제한이 될 수 있습니다.
        </div>
      </div>
    </div>
  );
};

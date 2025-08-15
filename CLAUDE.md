# Tokit 프로젝트 지침

## 개요

IT 업계 종사자를 위한 네트워킹·데이팅 애플리케이션.  
주요 기능: 채팅, 탐색 페이지, 프로필 상세, 좋아요, 마이페이지.

## 폴더 구조 (FSD 아키텍처)

- app: Next.js App Router, 전역 Provider
- views: 페이지 로직 + 데이터 페칭
- widgets: 재사용 가능 복합 UI 컴포넌트
- features: CUD 동작 구현
- entities: 핵심 도메인 정의, Read API
- shared: 공통 컴포넌트, 유틸

## API

- Base URL: `https://api.tokit.com`
- 인증: Bearer Token
- 주요 엔드포인트:
  - `GET /users/explore` → 탐색 페이지
  - `GET /users/:id` → 프로필 상세
  - `POST /users/:id/like` → 좋아요
  - ...

## 코드 규칙

- 폴더명: kebab-case
- 컴포넌트: PascalCase
- 변수: camelCase
- 상수: UPPER_CASE
- 이벤트 핸들러: handle+Event명

## API 문서

인증 및 인가
Security 로그인 링크
https://api.tokit.co.kr/oauth2/authorization/kakao

위 링크로 접속할 시, 바로 Kakao 로그인 페이지로 이동합니다.

인증 코드로 토큰 교환
클라이언트가 OAuth2 인증 후 발급받은 임시 인증 코드를 서버에 보내 액세스 토큰과 리프레시 토큰(쿠키)을 발급받습니다.

성공
HTTP 요청
POST /api/auth/token HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 53

{
"code" : "0ad5e3f3-f932-4dd7-a851-71d5a0a7f390"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: refresh_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiIxYjYyOTFkNi04YjNhLTQwNzUtYjM3NS0zYTUzMjBiZmY5YTciLCJpYXQiOjE3NTUxODM2MjksImV4cCI6MTc1NjM5MzIyOX0.bnBhCj9mZyB_0RXgYyWSBbe5u0FSaH3oBHgsNprjTnk; Path=/; Domain=tokit.co.kr; Max-Age=1209600; Expires=Thu, 28 Aug 2025 15:00:29 GMT; Secure; HttpOnly; SameSite=Lax
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:29 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 264

{
"accessToken" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiIxNDU0MDE4NS03ZjNjLTRkOGYtYjEwOS1kMjUyY2NiN2Q1OTgiLCJpYXQiOjE3NTUxODM2MjksImV4cCI6MTc1NTI3MDAyOX0.zlDGylSm04nW993JWnapJ2kYvOArfg3v689OqHac8W0"
}
액세스 토큰 재발급
만료된 액세스 토큰을 갱신하기 위해, 쿠키에 저장된 유효한 리프레시 토큰을 사용하여 새로운 액세스 토큰을 요청합니다.

성공
HTTP 요청
POST /api/auth/refresh HTTP/1.1
Content-Type: application/x-www-form-urlencoded; charset=ISO-8859-1
Host: localhost:44193
Cookie: refresh_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiI4MjM0NzYxNS0wZGM0LTRhOTAtYWFmOS1hYmRiNWE2ZTI5YWYiLCJpYXQiOjE3NTUxODM2MzAsImV4cCI6MTc1NjM5MzIzMH0.\_FhBJ_Kdi1uzscAkqAMOLU16y7xvfEXMmZhB_izqP50
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:30 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 264

{
"accessToken" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiI5ZDgyZTFmMi1lODc5LTQzNjYtODZlZS1hM2M5MzA2YTM2NzIiLCJpYXQiOjE3NTUxODM2MzAsImV4cCI6MTc1NTI3MDAzMH0.v7o-rZ8Xo3D0me8onLyB7eMBWzqVoNP7xV17pmx6_eY"
}
로그아웃
쿠키에 저장된 리프레시 토큰을 서버에서 무효화하고, 클라이언트의 쿠키를 삭제합니다.

성공
HTTP 요청
POST /api/auth/logout HTTP/1.1
Content-Type: application/x-www-form-urlencoded; charset=ISO-8859-1
Host: localhost:44193
Cookie: refresh_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiI2NGRiZGY4MS1jYmJiLTQyYjItOGQ3YS0yNGE0MzNlZGM2YjIiLCJpYXQiOjE3NTUxODM2MjksImV4cCI6MTc1NjM5MzIyOX0.KZRSGOitjjF-q7aYCJKwOF1gtbW2MC_CBLObg47g_0c
HTTP 응답
HTTP/1.1 204 No Content
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: refresh_token=; Path=/; Domain=tokit.co.kr; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=Lax
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:00:29 GMT
Keep-Alive: timeout=60
Connection: keep-alive
내 정보 조회
유효한 액세스 토큰을 사용하여 현재 로그인된 사용자의 정보를 조회합니다.

성공
HTTP 요청
GET /api/users/me HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 135

{
"id" : 1,
"email" : "wj1234@gmail.com",
"name" : "정원준",
"imageUrl" : "https://www",
"isOnboardingCompleted" : false
}
실패 (토큰 없음)
인증 토큰 없이 요청 시 401 Unauthorized 에러를 반환합니다.

HTTP 요청
GET /api/users/me HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: JSESSIONID=CE2D5B82257FE00C13EF115E10C289E3; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:00:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
사용자 관리
어드민 유저는 유저를 밴할수 있습니다.
어드민 유저는 유저아이디를 통해 해당 유저를 밴할 수 있습니다.

HTTP 요청
POST /api/admin/ban HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 90

{
"email" : "wj1234@gmail.com",
"reason" : "부적절한 행동으로 인한 차단"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:25 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 251

{
"message" : "사용자 정지를 성공하였습니다.",
"bannedUserId" : 1,
"bannedUserEmail" : "wj1234@gmail.com",
"reason" : "부적절한 행동으로 인한 차단",
"role" : "BANNED",
"bannedAt" : "2025-08-14T15:00:25.591029654"
}
어드민 유저는 밴된 유저를 해지 할수 있습니다.
어드민 유저는 유저아이디를 통해 밴된 유저를 해지 할 수 있습니다.

HTTP 요청
PATCH /api/admin/unban HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 76

{
"email" : "tokit@gmail.com",
"reason" : "반성하여 차단 해제"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:26 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 232

{
"message" : "사용자 해지를 성공하였습니다.",
"unbanUserId" : 2,
"unbanUserEmail" : "tokit@gmail.com",
"reason" : "반성하여 차단 해제",
"role" : "USER",
"unbanAt" : "2025-08-14T15:00:26.328283872"
}
유저는 밴시스템에 접근할수 없습니다.
유저는 밴시스템에 접근할 수 없습니다. .

HTTP 요청
POST /api/admin/ban HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 89

{
"email" : "tokit@gmail.com",
"reason" : "부적절한 행동으로 인한 차단"
}
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Set-Cookie: JSESSIONID=F6D07DAFFAE861290D10A3E2EFF5AF8C; Path=/; HttpOnly
Date: Thu, 14 Aug 2025 15:00:26 GMT
Keep-Alive: timeout=60
Connection: keep-alive
유저는 밴해제시스템에 접근할수 없습니다.
유저는 밴해제시스템에 접근할 수 없습니다. .

HTTP 요청
PATCH /api/admin/unban HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 76

{
"email" : "tokit@gmail.com",
"reason" : "반성하여 차단 해제"
}
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Set-Cookie: JSESSIONID=9A3595BD084A0F9529F5A0F4462783E0; Path=/; HttpOnly
Date: Thu, 14 Aug 2025 15:00:27 GMT
Keep-Alive: timeout=60
Connection: keep-alive
온보딩에 필요한 이넘 리스트를 불러옵니다
신규 회원이 온보딩 과정으로 진입하면 필요 이넘 리스트를 불러옵니다.

HTTP 요청
GET /api/users/onboarding/labels HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:20 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 4890

{
"genders" : [ {
"code" : "WOMEN",
"name" : "여성"
}, {
"code" : "MEN",
"name" : "남성"
} ],
"universities" : [ {
"code" : "CATHOLIC",
"name" : "가톨릭대학교"
}, {
"code" : "KANGNAM",
"name" : "강남대학교"
}, {
"code" : "KYUNGPOOK",
"name" : "경북대학교"
}, {
"code" : "KEIMYUNG",
"name" : "계명대학교"
}, {
"code" : "KOREA_SEJONG",
"name" : "고려대학교(세종)"
}, {
"code" : "KWANGWOON",
"name" : "광운대학교"
}, {
"code" : "KOOKMIN",
"name" : "국민대학교"
}, {
"code" : "KUMOH",
"name" : "금오공과대학교"
}, {
"code" : "NAMSEOUL",
"name" : "남서울대학교"
}, {
"code" : "DUKSUNG",
"name" : "덕성여자대학교"
}, {
"code" : "DONGGUK",
"name" : "동국대학교"
}, {
"code" : "DONGDUK",
"name" : "동덕여자대학교"
}, {
"code" : "MYONGJI_HUMANITIES",
"name" : "명지대학교(인문)"
}, {
"code" : "BAEKSEOK",
"name" : "백석대학교"
}, {
"code" : "SAHMYOOK",
"name" : "삼육대학교"
}, {
"code" : "SANGMYUNG_SEOUL",
"name" : "상명대학교(서울)"
}, {
"code" : "SANGMYUNG_CHEONAN",
"name" : "상명대학교(천안)"
}, {
"code" : "SOGANG",
"name" : "서강대학교"
}, {
"code" : "SEOKYEONG",
"name" : "서경대학교"
}, {
"code" : "SEOULTECH",
"name" : "서울과학기술대학교"
}, {
"code" : "SEOUL",
"name" : "서울대학교"
}, {
"code" : "SWOMEN",
"name" : "서울여자대학교"
}, {
"code" : "SUNGKYUL",
"name" : "성결대학교"
}, {
"code" : "SKHU",
"name" : "성공회대학교"
}, {
"code" : "SKKU",
"name" : "성균관대학교"
}, {
"code" : "SUNGSHIN",
"name" : "성신여자대학교"
}, {
"code" : "SOOKMYUNG",
"name" : "숙명여자대학교"
}, {
"code" : "SUNCHON",
"name" : "순천대학교"
}, {
"code" : "SCH",
"name" : "순천향대학교"
}, {
"code" : "SSU",
"name" : "숭실대학교"
}, {
"code" : "YONSEI_SINCHON",
"name" : "연세대학교(신촌)"
}, {
"code" : "YEUNGNAM",
"name" : "영남대학교"
}, {
"code" : "EULJI_SEONGNAM",
"name" : "을지대학교(성남)"
}, {
"code" : "EWHA",
"name" : "이화여자대학교"
}, {
"code" : "INCHEON",
"name" : "인천대학교"
}, {
"code" : "INHA",
"name" : "인하대학교"
}, {
"code" : "JOONGBU_GOYANG",
"name" : "중부대학교(고양)"
}, {
"code" : "CAU",
"name" : "중앙대학교"
}, {
"code" : "CHEONGJU",
"name" : "청주대학교"
}, {
"code" : "CNU",
"name" : "충남대학교"
}, {
"code" : "KUTC",
"name" : "한국교통대학교(충주)"
}, {
"code" : "HUFS_GLOBAL",
"name" : "한국외국어대학교(글로벌)"
}, {
"code" : "HUFS_SEOUL",
"name" : "한국외국어대학교(서울)"
}, {
"code" : "KAU",
"name" : "한국항공대학교"
}, {
"code" : "HNU",
"name" : "한남대학교"
}, {
"code" : "HANDONG",
"name" : "한동대학교"
}, {
"code" : "HANBAT",
"name" : "한밭대학교"
}, {
"code" : "HANSEO",
"name" : "한서대학교"
}, {
"code" : "HANSUNG",
"name" : "한성대학교"
}, {
"code" : "HANYANG_ERICA",
"name" : "한양대학교(ERICA)"
}, {
"code" : "HONGIK",
"name" : "홍익대학교"
} ],
"positions" : [ {
"code" : "FRONTEND",
"name" : "프론트엔드"
}, {
"code" : "BACKEND",
"name" : "백엔드"
}, {
"code" : "FULLSTACK",
"name" : "풀스택"
}, {
"code" : "AI",
"name" : "AI"
}, {
"code" : "UX_UI",
"name" : "디자인"
}, {
"code" : "PM",
"name" : "PM"
} ],
"mbti" : [ {
"code" : "ISTJ",
"name" : "ISTJ"
}, {
"code" : "ISFJ",
"name" : "ISFJ"
}, {
"code" : "INFJ",
"name" : "INFJ"
}, {
"code" : "INTJ",
"name" : "INTJ"
}, {
"code" : "ISTP",
"name" : "ISTP"
}, {
"code" : "ISFP",
"name" : "ISFP"
}, {
"code" : "INFP",
"name" : "INFP"
}, {
"code" : "INTP",
"name" : "INTP"
}, {
"code" : "ESTP",
"name" : "ESTP"
}, {
"code" : "ESFP",
"name" : "ESFP"
}, {
"code" : "ENFP",
"name" : "ENFP"
}, {
"code" : "ENTP",
"name" : "ENTP"
}, {
"code" : "ESTJ",
"name" : "ESTJ"
}, {
"code" : "ESFJ",
"name" : "ESFJ"
}, {
"code" : "ENTJ",
"name" : "ENTJ"
}, {
"code" : "ENFJ",
"name" : "ENFJ"
} ],
"preferenceType" : [ {
"code" : "POSITION_FOCUSED",
"name" : "직무 관련"
}, {
"code" : "CAREER_FOCUSED",
"name" : "취업 준비"
}, {
"code" : "PREFERENCE_FOCUSED",
"name" : "일상 이야기"
} ]
}
온보딩 완료
신규 회원이 온보딩 과정을 완료하여 프로필 정보를 등록합니다.

성공
HTTP 요청
PATCH /api/users/onboarding HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 346

{
"gender" : "여성",
"imageIds" : [ 35, 36 ],
"mbti" : "INTJ",
"position" : "백엔드",
"nickname" : "토킷개발자",
"bio" : "안녕하세요 토킷입니다.",
"university" : "서울대학교",
"marketingAgreements" : false,
"isUniversityView" : true,
"requiredAgreements" : true,
"preferenceType" : "직무 관련"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:21 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 105

{
"userId" : 2,
"message" : "온보딩이 완료되었습니다.",
"isOnboardingCompleted" : true
}
테스트용 엔드포인트
개발 및 테스트 환경(test 프로필)에서만 활성화되는 API입니다.

테스트용 로그인
이메일, 이름, 이미지 URL을 보내 즉시 액세스 토큰을 발급받습니다. 실제 OAuth2 인증 과정을 생략합니다.

성공
HTTP 요청
POST /api/test/login HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 88

{
"imageUrl" : "https://www",
"email" : "wj1234@gmail.com",
"name" : "정원준"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 264

{
"accessToken" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3ajEyMzRAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfVVNFUiIsImlkIjoxLCJqdGkiOiI2Mzg0YmNkZS01YWE5LTQzYjUtOWRhNS0yMTg0ODA5YWUwNzQiLCJpYXQiOjE3NTUxODM2MjgsImV4cCI6MTc1NTI3MDAyOH0.gH38uM7vRM-LU1EVrCuBXc-BvKvrhh8lV4NAjRQjv_o"
}
채팅
채팅방 생성
상대방의 id를 통해 새 채팅방을 생성합니다. 이미 채팅방이 존재할 경우 존재하는 채팅방의 id를 반환합니다.

성공
HTTP 요청
POST /api/chatrooms/init HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 23

{
"receiverId" : 24
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:41 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 22

{
"chatRoomId" : 1
}
채팅 메시지 전송
채팅 메시지를 전송합니다.

요청 경로: /app/chat.sendMessage/{roomId}

별도의 응답값이 반환되지 않습니다. 하위 response는 무시해주세요.

성공
HTTP 요청
POST /api/test/chat/messages HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 80

{
"chatRoomId" : 1,
"content" : "안녕하세요, 첫 메시지입니다."
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:00:40 GMT
Keep-Alive: timeout=60
Connection: keep-alive
채팅 내역 조회
특정 채팅방에 대한 채팅 초기 내역을 조회합니다.

성공
HTTP 요청
GET /api/chatrooms/chats/messages?roomId=1 HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:40 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 764

[ {
"messageId" : "689dfa18fde0c16885496cc9",
"chatRoomId" : 1,
"senderId" : 1,
"senderName" : "정원준",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:40.553Z",
"content" : "반갑습니다.",
"isEnd" : false
}, {
"messageId" : "689dfa18fde0c16885496cc8",
"chatRoomId" : 1,
"senderId" : 24,
"senderName" : "성이름",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:40.505Z",
"content" : "아, 네. 안녕하세요.",
"isEnd" : false
}, {
"messageId" : "689dfa18fde0c16885496cc7",
"chatRoomId" : 1,
"senderId" : 1,
"senderName" : "정원준",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:40.445Z",
"content" : "첫 번째 메시지",
"isEnd" : false
} ]
채팅 내역 lastId를 기준으로 조회
특정 채팅방에 대한 채팅 내역을 조회합니다.

성공
HTTP 요청
GET /api/chatrooms/chats/messages?roomId=1&lastId=0 HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:39 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 764

[ {
"messageId" : "689dfa17fde0c16885496cc5",
"chatRoomId" : 1,
"senderId" : 1,
"senderName" : "정원준",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:39.383Z",
"content" : "반갑습니다.",
"isEnd" : false
}, {
"messageId" : "689dfa17fde0c16885496cc4",
"chatRoomId" : 1,
"senderId" : 24,
"senderName" : "성이름",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:39.327Z",
"content" : "아, 네. 안녕하세요.",
"isEnd" : false
}, {
"messageId" : "689dfa17fde0c16885496cc3",
"chatRoomId" : 1,
"senderId" : 1,
"senderName" : "정원준",
"senderImageUrl" : "https://www",
"createdAt" : "2025-08-14T15:00:39.268Z",
"content" : "첫 번째 메시지",
"isEnd" : false
} ]
채팅방 리스트 조회
요청자의 채팅방 리스트를 조회합니다.

성공
HTTP 요청
GET /api/chatrooms HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:00:42 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 425

[ {
"chatRoomId" : 2,
"name" : "김백엔드",
"lastContent" : "김백엔드님, 안녕하세요.",
"lastSendAt" : "2025-08-14T15:00:42.02612Z",
"imageUrl" : "https://test.com/image6.jpg",
"isRead" : true
}, {
"chatRoomId" : 1,
"name" : "성이름",
"lastContent" : "동적 사용자2님, 안녕하세요?",
"lastSendAt" : "2025-08-14T15:00:41.947656Z",
"imageUrl" : "https://www",
"isRead" : true
} ]
채팅 읽음 신호
채팅 메시지를 읽었다는 신호(MessageAck)를 WebSocket으로 전송합니다. 서버는 해당 메시지의 읽음 상태를 업데이트합니다.

요청 경로: /app/message.ack

요청 필드
필드명 타입 필수 여부 설명
메시지 ID

끈

✅

읽음 처리할 메시지의 고유 ID

사용자 ID

긴

✅

읽은 사용자의 ID

요청 예시
{
"messageId": "64df7a8e2f1a4c3b98b7c001",
"userId": 42
}
응답
별도의 응답 본문은 없습니다. 읽음 신호 수신 후 서버 로그에 처리 결과가 기록됩니다.

피드 댓글
피드에 대한 댓글 관련 기능입니다.

피드 댓글 작성
특정 피드에 새로운 댓글을 작성합니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

성공
HTTP 요청
POST /api/feeds/1/comments HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 53

{
"content" : "이것은 댓글 내용입니다."
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:12 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 21

{
"commentId" : 1
}
피드 댓글 수정
댓글을 수정할 수 있습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `commentId`며, 수정할 댓글의 ID입니다.

성공
HTTP 요청
PATCH /api/feeds/comments/1 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 63

{
"content" : "이것은 새로운 댓글 내용입니다."
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:14 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 21

{
"commentId" : 1
}
피드 댓글 삭제
특정 댓글 ID를 사용하여 댓글을 삭제합니다. 이 작업은 '삭제됨' 상태로 표시하는 소프트 삭제(soft delete) 방식으로 처리되며, 이후 댓글 조회 시 목록에 나타나지 않습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `commentId`며, 삭제할 댓글의 ID입니다.

성공
HTTP 요청
DELETE /api/feeds/comments/1 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:03:09 GMT
Keep-Alive: timeout=60
Connection: keep-alive
피드 댓글 전체 조회
특정 피드에 작성된 모든 댓글을 페이지네이션으로 조회합니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

페이지네이션: page`와 `size 쿼리 파라미터를 사용하여 페이징을 제어할 수 있습니다. (예: ?page=0&size=10)

성공
HTTP 요청
GET /api/feeds/1/comments HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:06 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 1738

{
"content" : [ {
"id" : 1,
"feedId" : 1,
"feedCommentUserResponse" : {
"userId" : 1,
"name" : "정원준",
"imageUrl" : "https://www"
},
"content" : "댓글1",
"likeCount" : 0,
"isLiked" : false,
"createdAt" : "2025-08-14T15:02:57.529106",
"updatedAt" : "2025-08-14T15:02:57.529106"
}, {
"id" : 2,
"feedId" : 1,
"feedCommentUserResponse" : {
"userId" : 1,
"name" : "정원준",
"imageUrl" : "https://www"
},
"content" : "댓글2",
"likeCount" : 0,
"isLiked" : false,
"createdAt" : "2025-08-14T15:03:00.648634",
"updatedAt" : "2025-08-14T15:03:00.648634"
}, {
"id" : 3,
"feedId" : 1,
"feedCommentUserResponse" : {
"userId" : 1,
"name" : "정원준",
"imageUrl" : "https://www"
},
"content" : "댓글3",
"likeCount" : 0,
"isLiked" : false,
"createdAt" : "2025-08-14T15:03:03.765005",
"updatedAt" : "2025-08-14T15:03:03.765005"
}, {
"id" : 4,
"feedId" : 1,
"feedCommentUserResponse" : {
"userId" : 1,
"name" : "정원준",
"imageUrl" : "https://www"
},
"content" : "댓글4",
"likeCount" : 0,
"isLiked" : false,
"createdAt" : "2025-08-14T15:03:06.881868",
"updatedAt" : "2025-08-14T15:03:06.881868"
} ],
"pageable" : {
"pageNumber" : 0,
"pageSize" : 20,
"sort" : {
"sorted" : false,
"empty" : true,
"unsorted" : true
},
"offset" : 0,
"paged" : true,
"unpaged" : false
},
"size" : 20,
"number" : 0,
"sort" : {
"sorted" : false,
"empty" : true,
"unsorted" : true
},
"numberOfElements" : 4,
"first" : true,
"last" : true,
"empty" : false
}
피드 댓글 작성 속도 제한
과도한 요청을 방지하기 위해 댓글 작성 기능에는 속도 제한이 적용됩니다.

단기 제한: 3초에 1개의 댓글만 작성할 수 있습니다.

장기 제한: 10분에 5개의 댓글만 작성할 수 있습니다.

제한을 초과하여 API를 호출할 경우, 429 Too Many Requests 상태 코드가 반환됩니다.

실패 (3초 제한 위반)
3초 이내에 연속으로 댓글 작성을 요청하여 실패하는 경우입니다.

HTTP 요청
POST /api/feeds/1/comments HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 70

{
"content" : "이것은 속도 제한 테스트 댓글입니다."
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:02:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 21

{
"commentId" : 2
}
실패 (10분 제한 위반)
10분 이내에 6번째 댓글 작성을 요청하여 실패하는 경우입니다.

HTTP 요청
POST /api/feeds/1/comments HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 69

{
"content" : "이것은 10분 제한 테스트 댓글입니다."
}
HTTP 응답
HTTP/1.1 429 Too Many Requests
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:02:46 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 123

{
"status" : 429,
"code" : "TOO_MANY_API_REQUEST_EXCEPTION",
"message" : "API 요청 횟수를 초과했습니다."
}
피드 댓글 좋아요
특정 댓글에 '좋아요’를 누릅니다. 한 사용자는 댓글당 한 번만 좋아요를 누를 수 있으며, 반복 호출해도 카운트는 중복으로 증가하지 않습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `commentId`에 좋아요를 누를 댓글의 ID를 명시해야 합니다.

성공
HTTP 요청
POST /api/feeds/comments/1/like HTTP/1.1
Content-Type: application/x-www-form-urlencoded; charset=ISO-8859-1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:02:48 GMT
Keep-Alive: timeout=60
Connection: keep-alive
피드 댓글 좋아요 취소
눌렀던 '좋아요’를 취소합니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `commentId`에 좋아요를 취소할 댓글의 ID를 명시해야 합니다.

성공
HTTP 요청
DELETE /api/feeds/comments/1/like HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:02:52 GMT
Keep-Alive: timeout=60
Connection: keep-alive
피드
피드에 관련한 기능입니다.

피드 작성
새로운 피드를 작성합니다. 피드는 한 유저가 3초에 한 번만 작성할 수 있으며, 10분에 5개만 작성할 수 있습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

성공
HTTP 요청
POST /api/feeds HTTP/1.1
Content-Type: application/json
Host: localhost:44193
Content-Length: 58

{
"title" : "Test Title",
"content" : "Test Content"
}
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:01:58 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 18

{
"feedId" : 1
}
피드 최신순 조회
모든 피드를 최신순, 페이지네이션으로 조회합니다. (기본 10 page, 임의 조절 가능)

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

페이지네이션: lastId, size 쿼리 파라미터를 사용하여 페이징을 제어할 수 있습니다. (예: ?lastId=10&size=10)

성공
HTTP 요청
GET /api/feeds HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:01:22 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 2147

{
"content" : [ {
"feed" : {
"id" : 5,
"title" : "Test Title 5",
"content" : "Test Content 5",
"createdAt" : "2025-08-14T15:01:19.376579",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 4,
"title" : "Test Title 4",
"content" : "Test Content 4",
"createdAt" : "2025-08-14T15:01:16.258845",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 3,
"title" : "Test Title 3",
"content" : "Test Content 3",
"createdAt" : "2025-08-14T15:01:13.141252",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 2,
"title" : "Test Title 2",
"content" : "Test Content 2",
"createdAt" : "2025-08-14T15:01:10.022928",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 1,
"title" : "Test Title 1",
"content" : "Test Content 1",
"createdAt" : "2025-08-14T15:01:06.902519",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
} ],
"pageable" : {
"pageNumber" : 0,
"pageSize" : 30,
"sort" : {
"sorted" : true,
"empty" : false,
"unsorted" : false
},
"offset" : 0,
"paged" : true,
"unpaged" : false
},
"size" : 30,
"number" : 0,
"sort" : {
"sorted" : true,
"empty" : false,
"unsorted" : false
},
"numberOfElements" : 5,
"first" : true,
"last" : true,
"empty" : false
}
피드 좋아요순 조회
모든 피드를 좋아요순, 페이지네이션으로 조회합니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

페이지네이션: lastlLikeCount,lastId, size 쿼리 파라미터를 사용하여 페이징을 제어할 수 있습니다. (예: ?lastLikeCount=10&lastId=10&size=10)

성공
HTTP 요청
GET /api/feeds/hot HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:01:04 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 2141

{
"content" : [ {
"feed" : {
"id" : 3,
"title" : "Test Title 3",
"content" : "Test Content 3",
"createdAt" : "2025-08-14T15:00:54.46833",
"likeCount" : 2,
"isLiked" : true,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 1,
"title" : "Test Title 1",
"content" : "Test Content 1",
"createdAt" : "2025-08-14T15:00:48.232086",
"likeCount" : 2,
"isLiked" : true,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 5,
"title" : "Test Title 5",
"content" : "Test Content 5",
"createdAt" : "2025-08-14T15:01:00.705002",
"likeCount" : 1,
"isLiked" : true,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 4,
"title" : "Test Title 4",
"content" : "Test Content 4",
"createdAt" : "2025-08-14T15:00:57.586758",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
}, {
"feed" : {
"id" : 2,
"title" : "Test Title 2",
"content" : "Test Content 2",
"createdAt" : "2025-08-14T15:00:51.350856",
"likeCount" : 0,
"isLiked" : false,
"commentCount" : 0
},
"writer" : {
"name" : "김토킷",
"id" : 2,
"profileImageUrl" : "https://www"
}
} ],
"pageable" : {
"pageNumber" : 0,
"pageSize" : 30,
"sort" : {
"sorted" : false,
"empty" : true,
"unsorted" : true
},
"offset" : 0,
"paged" : true,
"unpaged" : false
},
"size" : 30,
"number" : 0,
"sort" : {
"sorted" : false,
"empty" : true,
"unsorted" : true
},
"numberOfElements" : 5,
"first" : true,
"last" : true,
"empty" : false
}
피드 삭제
특정 피드 ID를 사용하여 피드를 삭제합니다. 이 작업은 '삭제됨' 상태로 표시하는 소프트 삭제(soft delete) 방식으로 처리되며, 이후 피드 목록 조회 시 목록에 나타나지 않습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `feedId`에 삭제할 댓글의 ID를 명시해야 합니다.

성공
HTTP 요청
DELETE /api/feeds/1 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:01:38 GMT
Keep-Alive: timeout=60
Connection: keep-alive
피드 좋아요
특정 피드에 '좋아요’를 누릅니다. 한 사용자는 피드당 한 번만 좋아요를 누를 수 있으며, 반복 호출해도 카운트는 중복으로 증가하지 않습니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `feedId`에 좋아요를 누를 댓글의 ID를 명시해야 합니다.

성공
HTTP 요청
POST /api/feeds/1/like HTTP/1.1
Content-Type: application/x-www-form-urlencoded; charset=ISO-8859-1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:01:05 GMT
Keep-Alive: timeout=60
Connection: keep-alive
피드 좋아요 취소
눌렀던 '좋아요’를 취소합니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `feedId`에 좋아요를 취소할 댓글의 ID를 명시해야 합니다.

성공
HTTP 요청
DELETE /api/feeds/1/like HTTP/1.1
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:01:25 GMT
Keep-Alive: timeout=60
Connection: keep-alive
유저 카드 추천 시스템
유저 카드 추천 시스템은 MBTI와 포지션 정보를 기반으로 한 클러스터링 알고리즘을 통해 사용자와 유사한 성향의 다른 사용자들을 추천하는 기능입니다.

추천 알고리즘 개요
클러스터링 기반 추천 _ K-means 클러스터링을 통해 사용자를 유사한 그룹으로 분류 _ 9차원 벡터 공간에서 유사도 계산 (MBTI 4차원 + Position 5차원) \* 동일 클러스터 내 사용자 우선 추천, 부족 시 랜덤 보완

유사도 계산 방식 _ MBTI 호환성: 70% 가중치 (심리학적 궁합 이론 적용) _ 포지션 유사도: 30% 가중치 (협업 가능성 반영)

추천 카드 조회
현재 로그인한 사용자를 위한 맞춤형 사용자 카드 목록을 조회합니다. 동일 클러스터 내 사용자를 우선 추천하며, 조회 이력은 10분간 유지되어 중복 추천을 방지합니다.

기본 조회
기본적인 추천 카드 조회 요청입니다.

HTTP 요청
GET /api/users/card/list?size=10 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:23 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 3425

[ {
"userId" : 4,
"nickname" : "리액트킹",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo2-1.jpg", "https://test.com/photo2-2.jpg", "https://test.com/photo2-3.jpg" ],
"bio" : "React 전문 개발자입니다!",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 6,
"nickname" : "UX디자이너",
"university" : "이화여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo4-1.jpg", "https://test.com/photo4-2.jpg" ],
"bio" : "UX/UI 디자이너로 사용자 경험을 설계합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 5,
"nickname" : "뷰제이에스",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo3-1.jpg" ],
"bio" : "Vue.js로 멋진 웹을 만들어요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 7,
"nickname" : "창의디자이너",
"university" : "홍익대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo5-1.jpg" ],
"bio" : "창의적인 디자인으로 세상을 바꿔요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 22,
"nickname" : "효율개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo20-1.jpg", "https://test.com/photo20-2.jpg" ],
"bio" : "실용적이고 효율적인 개발을 추구합니다",
"focusType" : "취업 준비",
"isLikedByMe" : false
}, {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 17,
"nickname" : "감성디자이너",
"university" : "성신여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo15-1.jpg" ],
"bio" : "감성적인 디자인을 추구해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
} ]
특정 사용자 제외 조회
이미 매칭을 거절했거나 채팅을 나눈 사용자들을 제외하고 추천받을 수 있습니다.

HTTP 요청
GET /api/users/card/list?size=10&excludeUserIds=2%2C3 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:23 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 3425

[ {
"userId" : 4,
"nickname" : "리액트킹",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo2-1.jpg", "https://test.com/photo2-2.jpg", "https://test.com/photo2-3.jpg" ],
"bio" : "React 전문 개발자입니다!",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 6,
"nickname" : "UX디자이너",
"university" : "이화여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo4-1.jpg", "https://test.com/photo4-2.jpg" ],
"bio" : "UX/UI 디자이너로 사용자 경험을 설계합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 5,
"nickname" : "뷰제이에스",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo3-1.jpg" ],
"bio" : "Vue.js로 멋진 웹을 만들어요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 7,
"nickname" : "창의디자이너",
"university" : "홍익대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo5-1.jpg" ],
"bio" : "창의적인 디자인으로 세상을 바꿔요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 22,
"nickname" : "효율개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo20-1.jpg", "https://test.com/photo20-2.jpg" ],
"bio" : "실용적이고 효율적인 개발을 추구합니다",
"focusType" : "취업 준비",
"isLikedByMe" : false
}, {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 17,
"nickname" : "감성디자이너",
"university" : "성신여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo15-1.jpg" ],
"bio" : "감성적인 디자인을 추구해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
} ]
연속 조회 (중복 방지)
연속으로 카드를 조회할 때 이전에 본 사용자는 자동으로 제외됩니다.

HTTP 요청
GET /api/users/card/list?size=5 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:24 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 1654

[ {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 17,
"nickname" : "감성디자이너",
"university" : "성신여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo15-1.jpg" ],
"bio" : "감성적인 디자인을 추구해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
} ]
클러스터 부족 시 랜덤 보완
같은 클러스터 사용자가 부족한 경우 다른 클러스터에서 랜덤으로 보완하여 요청한 개수만큼 반환합니다.

HTTP 요청
GET /api/users/card/list?size=15 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:24 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 5166

[ {
"userId" : 4,
"nickname" : "리액트킹",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo2-1.jpg", "https://test.com/photo2-2.jpg", "https://test.com/photo2-3.jpg" ],
"bio" : "React 전문 개발자입니다!",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 6,
"nickname" : "UX디자이너",
"university" : "이화여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo4-1.jpg", "https://test.com/photo4-2.jpg" ],
"bio" : "UX/UI 디자이너로 사용자 경험을 설계합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 5,
"nickname" : "뷰제이에스",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo3-1.jpg" ],
"bio" : "Vue.js로 멋진 웹을 만들어요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 7,
"nickname" : "창의디자이너",
"university" : "홍익대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo5-1.jpg" ],
"bio" : "창의적인 디자인으로 세상을 바꿔요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 22,
"nickname" : "효율개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo20-1.jpg", "https://test.com/photo20-2.jpg" ],
"bio" : "실용적이고 효율적인 개발을 추구합니다",
"focusType" : "취업 준비",
"isLikedByMe" : false
}, {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 17,
"nickname" : "감성디자이너",
"university" : "성신여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo15-1.jpg" ],
"bio" : "감성적인 디자인을 추구해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 16,
"nickname" : "올라운더",
"university" : "인하대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo14-1.jpg", "https://test.com/photo14-2.jpg", "https://test.com/photo14-3.jpg" ],
"bio" : "창의적인 올라운드 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 15,
"nickname" : "PM리더",
"university" : "한양대학교(ERICA)",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo13-1.jpg" ],
"bio" : "사람과 기술을 연결하는 PM",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 14,
"nickname" : "프로젝트매니저",
"university" : "서강대학교",
"isUniversityVisible" : true,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo12-1.jpg", "https://test.com/photo12-2.jpg" ],
"bio" : "프로젝트 관리 전문가입니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 13,
"nickname" : "풀스택개발자",
"university" : "중앙대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo11-1.jpg" ],
"bio" : "풀스택 개발자로 전체를 아우르는 개발을 해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 12,
"nickname" : "파이썬데이터",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo10-1.jpg", "https://test.com/photo10-2.jpg" ],
"bio" : "Python으로 데이터를 다루는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
} ]
백엔드 개발자 클러스터 추천
백엔드 개발자의 추천 패턴을 확인할 수 있습니다.

HTTP 요청
GET /api/users/card/list?size=10 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:24 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 3400

[ {
"userId" : 9,
"nickname" : "스프링마스터",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo7-1.jpg" ],
"bio" : "Spring Framework 마스터",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 12,
"nickname" : "파이썬데이터",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo10-1.jpg", "https://test.com/photo10-2.jpg" ],
"bio" : "Python으로 데이터를 다루는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 10,
"nickname" : "자바개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo8-1.jpg", "https://test.com/photo8-2.jpg", "https://test.com/photo8-3.jpg" ],
"bio" : "Java로 견고한 시스템을 구축해요",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 11,
"nickname" : "노드제이에스",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo9-1.jpg" ],
"bio" : "Node.js 백엔드 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 22,
"nickname" : "효율개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo20-1.jpg", "https://test.com/photo20-2.jpg" ],
"bio" : "실용적이고 효율적인 개발을 추구합니다",
"focusType" : "취업 준비",
"isLikedByMe" : false
}, {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 17,
"nickname" : "감성디자이너",
"university" : "성신여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo15-1.jpg" ],
"bio" : "감성적인 디자인을 추구해요",
"focusType" : "일상 이야기",
"isLikedByMe" : false
} ]
본인 카드 조회 (qr용)
유저 id를 통해 유저 프로필카드를 볼 수 있습니다.

HTTP 요청
GET /api/users/profile HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:23 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 370

{
"userId" : 3,
"nickname" : "프론트마스터",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo1-1.jpg", "https://test.com/photo1-2.jpg" ],
"bio" : "안녕하세요! 프론트엔드 개발자입니다.",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}
추천 시스템 특징
개인화된 추천 _ 사용자의 MBTI와 포지션을 고려한 맞춤형 추천 _ 클러스터링을 통해 유사한 성향의 사용자 그룹 식별

중복 방지 시스템 _ Redis 기반 조회 이력 관리 (TTL 10분) _ 연속 조회 시 이전에 본 카드 자동 제외 \* 수동 제외 목록 지원 (excludeUserIds 파라미터)

유연한 추천 전략 _ 클러스터 기반 우선 추천 _ 부족한 경우 랜덤 보완으로 항상 요청한 개수만큼 반환 \* 실시간 필터링 가능

응답 데이터 구조
추천되는 각 사용자 카드는 다음 정보를 포함합니다:

userId: 사용자 ID

name: 사용자 이름

university: 대학교명

isUniversityVisible: 대학교 공개 여부

position: 직무 (백엔드, 프런트엔드, UX_UI, PM, 풀스택)

imageUrls: 프로필 이미지 URL 목록

에러 처리
인증 실패
인증 토큰 없이 요청 시 401 Unauthorized를 반환합니다.

HTTP 요청
GET /api/users/card/list?size=10 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: JSESSIONID=364864578E47E0359BB5EA47F4201B1F; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:03:21 GMT
Keep-Alive: timeout=60
Connection: keep-alive
유저 좋아요 시스템
유저 좋아요 시스템은 사용자 간의 관심 표현과 매칭 가능성을 높이는 핵심 기능입니다. 사용자는 다른 사용자에게 좋아요를 표시하거나 취소할 수 있으며, 자신이 좋아요한 사용자 목록을 조회할 수 있습니다.

좋아요 시스템 개요
핵심 기능 _ 토글 방식의 좋아요/취소 시스템 _ 좋아요한 사용자 목록 조회 _ 실시간 알림 연동 _ 카드 조회 시 좋아요 상태 표시

비즈니스 로직 _ 한 사용자는 다른 사용자에게 한 번만 좋아요 가능 _ 좋아요 취소 시 즉시 관계 해제 _ 자기 자신에게 좋아요 불가 (선택적 구현) _ 좋아요 시 상대방에게 실시간 알림 발송

좋아요 토글
사용자가 다른 사용자에게 좋아요를 누르거나 취소할 수 있습니다. 이미 좋아요한 사용자에게 다시 요청하면 좋아요가 취소됩니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

경로 파라미터: `toUserId`에 좋아요를 누를 대상 사용자의 ID를 명시해야 합니다.

좋아요 생성
처음 좋아요를 누르는 경우입니다.

HTTP 요청
POST /api/user/likes/2 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:31 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 22

{
"isLiked" : true
}
좋아요 취소 (토글)
이미 좋아요한 사용자에게 다시 요청하여 좋아요를 취소하는 경우입니다.

HTTP 요청
POST /api/user/likes/3 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:31 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 23

{
"isLiked" : false
}
여러 사용자 좋아요
한 사용자가 여러 명에게 연속으로 좋아요를 누를 수 있습니다.

HTTP 요청
GET /api/user/likes/lists HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:31 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 1278

[ {
"userId" : 2,
"nickname" : null,
"university" : null,
"isUniversityVisible" : null,
"position" : null,
"imageUrls" : [ ],
"bio" : null,
"focusType" : null,
"isLikedByMe" : true
}, {
"userId" : 3,
"nickname" : "프론트마스터",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo1-1.jpg", "https://test.com/photo1-2.jpg" ],
"bio" : "안녕하세요! 프론트엔드 개발자입니다.",
"focusType" : "일상 이야기",
"isLikedByMe" : true
}, {
"userId" : 4,
"nickname" : "리액트킹",
"university" : "연세대학교(신촌)",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo2-1.jpg", "https://test.com/photo2-2.jpg", "https://test.com/photo2-3.jpg" ],
"bio" : "React 전문 개발자입니다!",
"focusType" : "직무 관련",
"isLikedByMe" : true
}, {
"userId" : 5,
"nickname" : "뷰제이에스",
"university" : "성균관대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo3-1.jpg" ],
"bio" : "Vue.js로 멋진 웹을 만들어요",
"focusType" : "일상 이야기",
"isLikedByMe" : true
} ]
좋아요한 사용자 목록 조회
현재 로그인한 사용자가 좋아요한 모든 사용자의 목록을 조회합니다. 각 사용자의 카드 정보와 함께 반환되며, isLikedByMe 필드는 항상 `true`입니다.

요청 헤더: Authorization 헤더에 Bearer 토큰이 필요합니다.

좋아요 목록 조회
사용자가 좋아요한 사용자들의 상세 정보를 조회합니다.

HTTP 요청
GET /api/user/likes/lists HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 1042

[ {
"userId" : 6,
"nickname" : "UX디자이너",
"university" : "이화여자대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo4-1.jpg", "https://test.com/photo4-2.jpg" ],
"bio" : "UX/UI 디자이너로 사용자 경험을 설계합니다",
"focusType" : "직무 관련",
"isLikedByMe" : true
}, {
"userId" : 7,
"nickname" : "창의디자이너",
"university" : "홍익대학교",
"isUniversityVisible" : true,
"position" : "디자인",
"imageUrls" : [ "https://test.com/photo5-1.jpg" ],
"bio" : "창의적인 디자인으로 세상을 바꿔요",
"focusType" : "일상 이야기",
"isLikedByMe" : true
}, {
"userId" : 8,
"nickname" : "백엔드전문가",
"university" : "서울대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo6-1.jpg", "https://test.com/photo6-2.jpg" ],
"bio" : "서버 개발 전문가입니다",
"focusType" : "직무 관련",
"isLikedByMe" : true
} ]
빈 좋아요 목록
아직 아무도 좋아요하지 않은 경우 빈 배열을 반환합니다.

HTTP 요청
GET /api/user/likes/lists HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:28 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 3

[ ]
사용자 정보 검증
좋아요 목록에서 반환되는 사용자 정보의 완성도를 확인할 수 있습니다.

HTTP 요청
GET /api/user/likes/lists HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:30 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 545

[ {
"userId" : 2,
"nickname" : "토킷개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "백엔드",
"imageUrls" : [ "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/fc1cbde7-3327-4571-a934-fe0e60ec13ff_test-image180222637202334750.jpg", "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/c0d3eb1c-a779-4827-9937-0268eca6498d_test-image14714762262092548954.jpg" ],
"bio" : "안녕하세요 토킷입니다.",
"focusType" : "직무 관련",
"isLikedByMe" : true
} ]
카드 조회 시 좋아요 상태 반영
사용자가 카드 목록을 조회할 때, 각 카드에는 현재 사용자의 좋아요 여부가 isLikedByMe 필드로 표시됩니다.

좋아요하지 않은 사용자
좋아요를 누르지 않은 사용자들의 카드에서는 `isLikedByMe`가 `false`로 표시됩니다.

HTTP 요청
GET /api/users/card/list?size=5 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:27 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 1692

[ {
"userId" : 22,
"nickname" : "효율개발자",
"university" : "서울대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo20-1.jpg", "https://test.com/photo20-2.jpg" ],
"bio" : "실용적이고 효율적인 개발을 추구합니다",
"focusType" : "취업 준비",
"isLikedByMe" : false
}, {
"userId" : 21,
"nickname" : "액션리더",
"university" : "이화여자대학교",
"isUniversityVisible" : false,
"position" : "PM",
"imageUrls" : [ "https://test.com/photo19-1.jpg" ],
"bio" : "액션형 프로젝트 리더",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 20,
"nickname" : "융합개발자",
"university" : "숙명여자대학교",
"isUniversityVisible" : true,
"position" : "풀스택",
"imageUrls" : [ "https://test.com/photo18-1.jpg" ],
"bio" : "다양한 기술을 융합하는 개발자",
"focusType" : "직무 관련",
"isLikedByMe" : false
}, {
"userId" : 19,
"nickname" : "즐거운개발자",
"university" : "동덕여자대학교",
"isUniversityVisible" : true,
"position" : "프론트엔드",
"imageUrls" : [ "https://test.com/photo17-1.jpg", "https://test.com/photo17-2.jpg" ],
"bio" : "즐겁게 웹 개발하는 개발자",
"focusType" : "일상 이야기",
"isLikedByMe" : false
}, {
"userId" : 18,
"nickname" : "안정개발자",
"university" : "국민대학교",
"isUniversityVisible" : false,
"position" : "백엔드",
"imageUrls" : [ "https://test.com/photo16-1.jpg" ],
"bio" : "꼼꼼하고 안정적인 개발을 지향합니다",
"focusType" : "직무 관련",
"isLikedByMe" : false
} ]
인증 및 권한
좋아요 시스템의 모든 기능은 로그인된 사용자만 사용할 수 있습니다.

좋아요 권한 없음
인증되지 않은 사용자가 좋아요를 시도하면 401 Unauthorized를 반환합니다.

HTTP 요청
POST /api/user/likes/2 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: JSESSIONID=8104B37F4B776156B7A1835E3E549339; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:03:25 GMT
Keep-Alive: timeout=60
Connection: keep-alive
좋아요 목록 조회 권한 없음
인증되지 않은 사용자가 좋아요 목록을 조회하려 하면 401 Unauthorized를 반환합니다.

HTTP 요청
GET /api/user/likes/lists HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 401 Unauthorized
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Set-Cookie: JSESSIONID=7BC7C4AAE1A89C51B45313D2CA73224A; Path=/; HttpOnly
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Thu, 14 Aug 2025 15:03:25 GMT
Keep-Alive: timeout=60
Connection: keep-alive
자기 자신 좋아요 방지
자기 자신에게 좋아요를 시도하는 경우의 처리 방식입니다. (비즈니스 로직에 따라 허용/차단 결정)

HTTP 요청
POST /api/user/likes/1 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 400 Bad Request
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:26 GMT
Connection: close
Content-Length: 134

{
"status" : 400,
"code" : "USER_CAN_NOT_LIKE_HIMSELF",
"message" : "자기 자신에게 좋아요를 누를수 없습니다."
}
실시간 알림 연동
사용자가 좋아요를 누르면 상대방에게 실시간 알림이 발송됩니다.

좋아요 알림 발송
좋아요 생성 시 이벤트 기반으로 상대방에게 알림이 전송됩니다.

HTTP 요청
POST /api/user/likes/6 HTTP/1.1
Content-Type: application/json
Host: localhost:44193
HTTP 응답
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Thu, 14 Aug 2025 15:03:25 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 22

{
"isLiked" : true
}
좋아요 시스템 특징
토글 방식 좋아요 _ 같은 엔드포인트로 좋아요 생성/취소 모두 처리 _ isLiked 필드로 현재 상태 확인 가능 \* 중복 좋아요 방지 자동 처리

실시간 알림 _ 좋아요 시 즉시 상대방에게 푸시 알림 발송 _ 이벤트 기반 비동기 처리로 성능 최적화 \* WebSocket을 통한 실시간 알림 전달

카드 연동 _ 카드 조회 시 좋아요 상태 자동 반영 _ isLikedByMe 필드로 UI 상태 관리 용이 \* 추천 시스템과 독립적으로 동작

응답 데이터 구조
좋아요 토글 응답 \* isLiked: 좋아요 상태 (boolean)

좋아요 목록 응답 좋아요한 각 사용자는 다음 정보를 포함합니다:

userId: 사용자 ID

name: 사용자 이름

university: 대학교명 (한글)

isUniversityVisible: 대학교 공개 여부

position: 직무 (한글) - "백엔드", "프론트엔드", "UX/UI 디자이너", "PM", "풀스택"

imageUrls: 프로필 이미지 URL 목록

bio: 자기소개

focusType: 선호 매칭 타입

isLikedByMe: 좋아요 상태 (항상 true)

에러 처리
401 Unauthorized _ 인증 토큰이 없거나 유효하지 않은 경우 _ 모든 좋아요 관련 API에서 발생 가능

404 Not Found _ 존재하지 않는 사용자에게 좋아요 시도 시 _ 잘못된 사용자 ID 사용 시

400 Bad Request _ 자기 자신에게 좋아요 시도 시 (비즈니스 로직에 따라) _ 잘못된 요청 파라미터 사용 시

이미지 시스템
이미지를 업로드
이미지를 업로드하면 성공한다.

http-요청 \*

POST /api/images/upload/list HTTP/1.1
Content-Type: multipart/form-data; boundary="jS1C_feE6jbyqap2dn9V0uCfgbOsfk1"; boundary=6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm
Host: localhost:50540

Content-Disposition: form-data; name=images; filename=test-image3043501392012353777.jpg
Content-Type: image/jpeg

dummy-image-content
--6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm--
http-응답

Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 12 Aug 2025 11:06:38 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 520

{
"imageId" : 34,
"imageUrl" : "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/7dfd70a5-688f-4bd4-8748-b094549ace74_test-image15025584236384328391.jpg"
}
이미지를 2개 업로드
이미지를 2장 업로드시 성공한다.

ttp 요청

POST /api/images/upload/list HTTP/1.1
Content-Type: multipart/form-data; boundary="jS1C_feE6jbyqap2dn9V0uCfgbOsfk1"; boundary=6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm
Host: localhost:50540

--6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm
Content-Disposition: form-data; name=images; filename=test-image10758199083426670388.jpg
Content-Type: image/jpeg

dummy-image-content
--6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm
Content-Disposition: form-data; name=images; filename=test-image3043501392012353777.jpg
Content-Type: image/jpeg

dummy-image-content
--6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm--
http-응답

Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Content-Type: application/json
Transfer-Encoding: chunked
Date: Tue, 12 Aug 2025 11:06:38 GMT
Keep-Alive: timeout=60
Connection: keep-alive
Content-Length: 520

[ {
"imageId" : 34,
"imageUrl" : "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/7dfd70a5-688f-4bd4-8748-b094549ace74_test-image15025584236384328391.jpg"
}, {
"imageId" : 35,
"imageUrl" : "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/8e073a6e-f425-4333-9cbd-dde03ddbaf1e_test-image2039754421573724872.jpg"
}, {
"imageId" : 36,
"imageUrl" : "https://tokit-bucket.s3.ap-northeast-2.amazonaws.com/profile/07250f84-92ed-4484-bb91-33e3dae9cfa9_test-image16214962724622048079.jpg"
} ]
이미지 삭제
업로드된 이미지를 성공적으로 삭제한다.

http-요청

DELETE /api/images/34 HTTP/1.1
Host: localhost:50540
http-응답

HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Tue, 12 Aug 2025 11:06:40 GMT
Keep-Alive: timeout=60
Connection: keep-alive
이미지 없는 이미지 삭제
존재 하지 않는 이미지를 삭제 404 반환한다.

http-요청 t

DELETE /api/images/9999 HTTP/1.1
Host: localhost:50540
http-응답

HTTP/1.1 404 Not Found
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Tue, 12 Aug 2025 11:06:38 GMT
Keep-Alive: timeout=60
Connection: keep-alive
남의 이미지 삭제
남의 이미지를 삭제시도하면 403 반환한다.

http-요청

DELETE /api/images/34 HTTP/1.1
Host: localhost:50540
http-응답

HTTP/1.1 403 Forbidden
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
Date: Tue, 12 Aug 2025 11:06:38 GMT
Keep-Alive: timeout=60
Connection: keep-alive

# 이 폴더에 넣어야 할 실제 이미지 목록

아래 파일명 그대로 저장하면 코드 수정 없이 바로 반영됩니다. (src/config/site.ts 참고)

| 파일명 | 용도 | 권장 사이즈/비율 |
|---|---|---|
| hero-poster.jpg | 히어로 배경(영상 로드 전 표시되는 정지 이미지) | 1920x1080 이상, 16:9 |
| og-image.jpg | 카카오톡/SNS 공유 시 노출되는 썸네일 | 1200x630 |
| lesson-intro.jpg | 입문 클래스 카드 | 4:5 세로 |
| lesson-basic.jpg | 초급 클래스 카드 | 4:5 세로 |
| lesson-intermediate.jpg | 중급 클래스 카드 | 4:5 세로 |
| lesson-advanced.jpg | 상급 클래스 카드 | 4:5 세로 |
| lesson-oneday.jpg | 원데이 클래스 카드 | 4:5 세로 |
| lesson-kids.jpg | 유아 레슨 카드 | 4:5 세로 |
| instructor-jinho.jpg | 강사 소개 사진 (박진호) | 4:5 세로, 인물 중심 |
| gallery-1.jpg ~ gallery-8.jpg | 갤러리 그리드 (스키/스노보드/수중사진 등) | 정방형 또는 3:4 |

## 권장 사항
- Sony A1로 촬영한 원본 중 가장 스토리가 느껴지는 컷 우선 사용
- 색감은 브랜드 톤(White / Ice Blue / Snow Gray)과 어울리게 보정
- 파일 용량은 장당 500KB 내외로 압축 (WebP 변환 권장) — Next.js Image가 자동 최적화하지만 원본이 너무 크면 초기 업로드가 느려집니다

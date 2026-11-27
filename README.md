# Portfolio Nguyễn Phạm Trường Duy

Website tĩnh bằng tiếng Việt và tiếng Anh. Mở `index.html` để xem bản tiếng Việt hoặc `en/index.html` để xem bản tiếng Anh. Nút VI / EN dẫn đến bản tương ứng của trang đang xem. Tệp CV PDF gốc được dùng chung.

## Các trang

| Tệp | Nội dung |
|---|---|
| `index.html` | Giới thiệu, bộ thẻ dự án, Build · Design · Code · Ship, timeline tóm tắt và liên hệ |
| `du-an.html` | Danh mục dự án với bộ lọc Website, Python và IoT |
| `du-an/*.html` | Bảy trang dự án có tính năng, công nghệ và liên kết GitHub |
| `kinh-nghiem.html` | Bốn mốc làm việc, mô tả nhiệm vụ và tổng kết hành trình |
| `tech-stack.html` | Công nghệ, ngôn ngữ lập trình, dữ liệu và công cụ |
| `ve-toi.html` | Chân dung Spider-Man, kỹ năng, học vấn và hoạt động |
| `dich-vu.html` | Ba nhóm dịch vụ, quy trình phối hợp, câu hỏi thường gặp và soạn email yêu cầu |
| `nang-luc.html` | Năng lực, công cụ và các dự án minh họa |
| `hoc-van.html` | Hồ sơ học tập tại HUIT, hoạt động Orbis ICT và quá trình thực hành |
| `lien-he.html` | Thông tin liên hệ và biểu mẫu soạn email (có bản tiếng Anh trong `en/`) |

## GitHub Pages

1. Giải nén tệp ZIP. Chép toàn bộ nội dung, gồm cả thư mục `en/` và `assets/`, vào thư mục gốc của repository.
2. Mở **Settings → Pages**. Chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)** và lưu.
3. Mở địa chỉ GitHub cấp trong phần **Pages**. Các đường dẫn tương đối hỗ trợ cả URL dạng `/<ten-repository>/`.

[Hướng dẫn cấu hình GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Chỉnh sửa

Website này dùng HTML/CSS/JavaScript tĩnh và không cần bước build để xuất bản lên GitHub Pages. Chỉnh trực tiếp các trang trong thư mục gốc của ZIP hoặc trong `dist/` của repo. Tệp font Alata và giấy phép đi kèm nằm trong `assets/fonts/`.

Các trang Dịch vụ, Năng lực, Tech Stack và Học vấn, các phần Tech Stack/Số liệu/Học vấn/Dịch vụ trên trang chủ, menu Khám phá và chân trang được đồng bộ bằng [scripts/build-sections.mjs](./scripts/build-sections.mjs). Chỉnh nội dung VI/EN trong script này rồi chạy `node scripts/build-sections.mjs`. Script giữ nguyên các phần trang chủ ngoài những vùng có dấu `studio:`.

Chạy `node scripts/preview.mjs` rồi mở `http://127.0.0.1:4173/` để xem thử toàn bộ website. Không cần cài thư viện để chạy website hoặc tạo lại các trang.

Bấm hoặc chạm vào thẻ chân dung để lật sang mã QR GitHub. Mục Giới thiệu ghim trên màn hình để từng dòng chữ tự vào vị trí. Ở phần mở đầu dự án, từng từ bật lên và rõ dần khi cuộn. Các ký tự mờ ghép thành tiêu đề Dự án tiêu biểu, rồi phóng lớn tràn khung đồng thời mờ dần để hiện bộ thẻ. Tên dự án phía sau thẻ phóng lớn và trượt mờ sang trái khi cuộn sang dự án kế. Bạn cũng có thể dùng nút, phím mũi tên hoặc vuốt ngang để đổi dự án.

Ngay dưới bộ thẻ, phần Build · Design · Code · Ship giữ khung trên màn hình trong khi cuộn. Hai dòng nền chạy ngược chiều nhau. Các từ ở giữa lần lượt mở ra, nảy lên, trượt ngang và ghép chữ. Khi giảm chuyển động, ba dòng hiện ở dạng tĩnh.

Ở Kinh nghiệm, tiêu đề tan dần theo từng ký tự, thẻ đã xem thu về góc dưới và nền đổi theo thẻ mới. Phần tổng kết có liên kết trở lại từng mốc. Bạn cũng có thể dùng nút Trước và Tiếp theo. Tech Stack và phần Dịch vụ giữ trên màn hình trong khi nội dung lần lượt hiện rõ, sau đó cuộn tiếp sang phần dưới. Các phần có cả bản VI và EN.

Phần Một vài con số giữ khung trên màn hình khi cuộn, lần lượt đếm và vẽ cột biểu đồ từ dưới lên. Các con số gồm 20+ công nghệ và công cụ được nhắc đến trong hai CV, bảy dự án trong danh mục (bao gồm To-Do List App từ CV), bốn đơn vị từng làm việc và bốn năm học CNTT (2022–2026). Giá trị và nhãn VI/EN được chỉnh trong `stats` của `scripts/build-sections.mjs`.

Phần About Me trên trang chủ và trang Về tôi có khung cố định trong khi cuộn, hiệu ứng quỹ đạo quanh chân dung và thanh thể hiện tiến trình. Rê chuột qua chân dung để khám phá, bấm hoặc chạm để đổi trang phục; nhấn Escape để trở lại. Khi màn hình quá thấp hoặc bật giảm chuyển động, nội dung được hiển thị bình thường để không bị che khuất.

Giao diện trang đầu, menu kính nổi và trang Về tôi được điều chỉnh theo mã tham chiếu ChienDZ, dùng chung [reference.css](./reference.css) cho cả hai ngôn ngữ. Có thể kéo thẻ hồ sơ rồi thả để thẻ tự trở về; bấm để lật sang mã QR. Ở trang Về tôi, rê chuột để hé lộ trang phục Spider-Man, bấm hoặc nhấn Enter để giữ toàn bộ trang phục và nhấn Escape để trở lại.

Các hiệu ứng nằm trong [motion.css](./motion.css), [tech-stack.css](./tech-stack.css) và [main.js](./main.js). Khi thiết bị ưu tiên giảm chuyển động, nội dung hiển thị ngay, dòng giới thiệu giữ nguyên và thẻ trở về vị trí ngay khi thả.

Các phần bổ sung lấy cảm hứng về nhịp chữ, chiều sâu thẻ và bố cục từ [minwang.dev](https://minwang.dev/). [studio.css](./studio.css) và [studio.js](./studio.js) phụ trách menu Khám phá, xuất hiện khi cuộn, thẻ hồ sơ học tập, đếm số, thẻ dịch vụ và biểu mẫu soạn email. Nội dung học vấn, công việc và số liệu dùng thông tin đã có trong portfolio; không thêm chứng chỉ hoặc nhận xét khách hàng.

Chuyển động dùng chung một vòng cập nhật khi có cuộn, làm mềm theo thời gian thực và chỉ cập nhật những cảnh gần màn hình. Các nấc chuột được làm mềm; thao tác chạm, bàn di chuột và các vùng cuộn riêng vẫn dùng cách cuộn của trình duyệt. Ở chế độ giảm chuyển động, nội dung và các con số hiện ngay; các thẻ không nghiêng theo chuột. Biểu mẫu dịch vụ và biểu mẫu riêng trên trang Liên hệ mở bản nháp trong ứng dụng email để người dùng kiểm tra và tự gửi. Biểu mẫu Liên hệ cần ứng dụng email được cấu hình trên thiết bị; GitHub Pages không tự gửi hoặc lưu nội dung biểu mẫu.

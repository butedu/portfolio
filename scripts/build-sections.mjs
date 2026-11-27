import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = fs.existsSync(path.join(project, 'dist', 'index.html')) ? path.join(project, 'dist') : project;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, text) => fs.writeFileSync(path.join(root, file), text);
const languages = ['vi', 'en'];
const copy = {
  vi: {
    services: 'Dịch vụ', skills: 'Năng lực', education: 'Học vấn & hoạt động', discover: 'Khám phá',
    serviceTitle: 'TỪ Ý TƯỞNG.<br><span>ĐẾN BÀN GIAO.</span>',
    serviceIntro: 'Thiết kế ấn phẩm, xây dựng giao diện và theo sát website trong quá trình vận hành. Một mạch công việc, từ yêu cầu đầu tiên đến những lần cập nhật sau đó.',
    skillTitle: 'THIẾT KẾ.<br><span>CÙNG CÔNG NGHỆ.</span>',
    skillIntro: 'Những công cụ tôi dùng trong công việc và dự án. Mỗi nhóm năng lực đều gắn với một sản phẩm hoặc trải nghiệm cụ thể.',
    educationTitle: 'VỮNG TỪ<br><span>NỀN TẢNG.</span>',
    educationIntro: 'Học Công nghệ thông tin, thực hành qua dự án và tiếp tục học từ những người làm cùng mình.',
    serviceEyebrow: 'Cách tôi có thể hỗ trợ', skillEyebrow: 'Năng lực & công cụ', educationEyebrow: 'Học vấn & cộng đồng',
    explore: 'Khám phá năng lực', viewServices: 'Xem dịch vụ', viewEducation: 'Xem hồ sơ học tập', contact: 'Trao đổi công việc', evidence: 'Xem dự án liên quan',
    toolsLabel: 'CÔNG CỤ / CÁCH LÀM', deliverables: 'Nội dung có thể hỗ trợ',
    serviceItems: [
      ['Thiết kế ấn phẩm', 'Từ nội dung đến bố cục dễ đọc.', 'Brochure, banner và hình ảnh truyền thông cho sản phẩm, dịch vụ.', ['Bố cục brochure và tài liệu giới thiệu', 'Banner và hình ảnh truyền thông', 'Chỉnh sửa hình ảnh theo nội dung'], 'Photoshop · Figma · Canva', 'print'],
      ['Giao diện & nội dung', 'Đưa ý tưởng lên màn hình.', 'Xây dựng giao diện, sắp xếp nội dung và kiểm tra cách website hiển thị trên từng thiết bị.', ['Giao diện website và bố cục nội dung', 'Cập nhật bài viết, hình ảnh', 'Kiểm tra trên máy tính và điện thoại'], 'UI/UX · HTML · CSS · JavaScript', 'web'],
      ['Vận hành website', 'Theo sát sau khi đưa vào sử dụng.', 'Cập nhật, bảo trì và phối hợp xử lý các vấn đề phát sinh trong quá trình sử dụng website.', ['Cập nhật nội dung và bảo trì', 'Tiếp nhận, kiểm tra lỗi website', 'Quản trị máy chủ theo phạm vi công việc'], 'Quản trị nội dung · IT Support', 'ops']
    ],
    skillGroups: [
      ['Thiết kế & hình ảnh', 'Tổ chức thông tin, chỉnh sửa hình ảnh và xây dựng bố cục ấn phẩm.', ['Photoshop', 'Figma', 'Canva'], 'Kinh nghiệm tại Tour Đảo', './kinh-nghiem.html#tour-dao', 'design'],
      ['Giao diện & website', 'Xây dựng giao diện responsive, ứng dụng web và API.', ['HTML / CSS', 'JavaScript', 'PHP / Laravel', 'C# / ASP.NET Core', 'Angular'], 'VN News & Handicraft Shop', './du-an/vn-news.html', 'web'],
      ['Dữ liệu & ứng dụng', 'Phát triển ứng dụng, xử lý dữ liệu và làm việc với cơ sở dữ liệu.', ['Python', 'Flutter / Dart', 'SQL Server', 'MySQL', 'SQLite', 'Firebase'], 'ScheduleApp & Data Mining SPADE', './du-an/schedule-app.html', 'data'],
      ['Phối hợp & vận hành', 'Làm rõ yêu cầu, theo dõi tiến độ và kiểm tra kết quả trước khi bàn giao.', ['Quản trị nội dung', 'IT Support', 'Làm việc nhóm', 'Hỗ trợ khách hàng'], 'Quá trình làm việc', './kinh-nghiem.html', 'ops']
    ],
    processTitle: 'RÕ TỪ ĐẦU.<br><span>THEO SÁT ĐẾN CUỐI.</span>',
    process: [['Làm rõ yêu cầu', 'Trao đổi mục tiêu, nội dung, tài nguyên và phạm vi cần thực hiện.'], ['Phác thảo & thiết kế', 'Sắp xếp bố cục, thực hiện phương án và tiếp nhận phản hồi.'], ['Triển khai & kiểm tra', 'Đưa nội dung vào sản phẩm, kiểm tra giao diện và các thao tác chính.'], ['Bàn giao & cập nhật', 'Bàn giao tài nguyên, ghi nhận những điều cần theo dõi sau khi sử dụng.']],
    faqTitle: 'Trước khi bắt đầu',
    faqs: [['Tôi cần chuẩn bị những gì?', 'Mục tiêu, nội dung, hình ảnh hoặc nhận diện thương hiệu đang có, cùng thời gian bạn mong muốn hoàn thành. Có mẫu tham khảo sẽ giúp làm rõ yêu cầu.'], ['Thời gian và chi phí được xác định thế nào?', 'Sau khi trao đổi phạm vi, số lượng hạng mục và số lần chỉnh sửa. Bạn có thể gửi yêu cầu bên dưới để cùng thống nhất trước khi bắt đầu.'], ['Có thể trao đổi về website đang hoạt động không?', 'Có. Hãy mô tả điều cần cập nhật hoặc vấn đề đang gặp để tôi xem xét phạm vi và cách phối hợp phù hợp.']],
    briefTitle: 'Kể tôi nghe<br><span>ý tưởng của bạn.</span>', briefIntro: 'Điền vài dòng để chuẩn bị email trao đổi. Bạn sẽ kiểm tra và gửi từ ứng dụng email của mình.',
    name: 'Tên của bạn', email: 'Email liên hệ', service: 'Bạn cần hỗ trợ gì?', message: 'Nội dung công việc', messagePlaceholder: 'Mục tiêu, nội dung cần làm, thời gian dự kiến…', submit: 'Soạn email trao đổi',
    educationName: 'Đại học Công Thương TP.HCM', degree: 'Công nghệ thông tin', community: 'Cộng tác viên Orbis ICT',
    communityText: 'Tham gia workshop, trao đổi ý tưởng và phối hợp trong các hoạt động của cộng đồng công nghệ và truyền thông.',
    educationText: 'Kiến thức Công nghệ thông tin được thực hành qua các dự án website, ứng dụng Python và mô phỏng IoT trong portfolio.',
    educationRecord: 'HỒ SƠ HỌC TẬP', communityRecord: 'HOẠT ĐỘNG CỘNG ĐỒNG', cv: 'Tải CV', projects: 'Xem dự án thực hành',
    learnTitle: 'HỌC. LÀM.<br><span>TIẾP TỤC KHÁM PHÁ.</span>',
    learnItems: [['Nền tảng', 'Công nghệ thông tin', 'Chương trình học tại Đại học Công Thương TP.HCM, giai đoạn 2022–2026.'], ['Thực hành', 'Dự án cá nhân', 'Website tin tức, công cụ xếp lịch, khai phá dữ liệu, cửa hàng trực tuyến và mô phỏng RFID.'], ['Kết nối', 'Cộng đồng Orbis ICT', 'Học hỏi qua workshop, chia sẻ ý tưởng và cộng tác cùng cộng đồng.']],
    statsTitle: 'MỘT VÀI<br><span>CON SỐ.</span>', statsIntro: 'Những dấu mốc từ CV và các dự án đã giới thiệu.',
    stats: [['20', 'Công nghệ & công cụ trong CV', './tech-stack.html', '+'], ['7', 'Dự án đã giới thiệu', './du-an.html'], ['4', 'Đơn vị từng làm việc', './kinh-nghiem.html'], ['4', 'Năm học CNTT · 2022–2026', './hoc-van.html']],
    footerText: 'Thiết kế ấn phẩm. Vận hành website. Theo sát từ ý tưởng đến bàn giao.', connect: 'Kết nối',
    capabilityHeading: 'ĐỦ SÁNG TẠO.<br><span>VỮNG KỸ THUẬT.</span>',
    homeEducationHeading: 'HỌC TỪ NỀN TẢNG.<br><span>LỚN LÊN QUA THỰC HÀNH.</span>'
  },
  en: {
    services: 'Services', skills: 'Capabilities', education: 'Education & activities', discover: 'Explore',
    serviceTitle: 'FROM THE IDEA.<br><span>TO THE HANDOFF.</span>',
    serviceIntro: 'Print design, web interfaces and ongoing website operations. One connected process, from the first brief to the updates that follow.',
    skillTitle: 'DESIGN.<br><span>MEETS TECHNOLOGY.</span>',
    skillIntro: 'The tools I use in work and projects. Each capability connects to a specific product or practical experience.',
    educationTitle: 'BUILT ON<br><span>FOUNDATIONS.</span>',
    educationIntro: 'Studying information technology, putting ideas into practice and learning from the people I work with.',
    serviceEyebrow: 'How I can help', skillEyebrow: 'Capabilities & tools', educationEyebrow: 'Education & community',
    explore: 'Explore capabilities', viewServices: 'Explore services', viewEducation: 'Explore education', contact: 'Discuss your project', evidence: 'Explore related work',
    toolsLabel: 'TOOLS / APPROACH', deliverables: 'How I can support your work',
    serviceItems: [
      ['Print design', 'From content to a readable layout.', 'Brochures, banners and communication visuals for products and services.', ['Brochure and introductory document layouts', 'Banners and communication visuals', 'Image editing to suit the content'], 'Photoshop · Figma · Canva', 'print'],
      ['Interfaces & content', 'Bring the idea to the screen.', 'Build interfaces, organize content and check how a website works across devices.', ['Web interfaces and content layouts', 'Article and image updates', 'Desktop and mobile checks'], 'UI/UX · HTML · CSS · JavaScript', 'web'],
      ['Website operations', 'Stay involved after launch.', 'Updates, maintenance and coordination on issues that arise while a website is in use.', ['Content updates and maintenance', 'Review and troubleshoot website issues', 'Server administration within the agreed scope'], 'Content management · IT Support', 'ops']
    ],
    skillGroups: [
      ['Design & imagery', 'Organize information, edit images and build layouts for print.', ['Photoshop', 'Figma', 'Canva'], 'My work at Tour Đảo', './kinh-nghiem.html#tour-dao', 'design'],
      ['Interfaces & websites', 'Build responsive interfaces, web applications and APIs.', ['HTML / CSS', 'JavaScript', 'PHP / Laravel', 'C# / ASP.NET Core', 'Angular'], 'VN News & Handicraft Shop', './du-an/vn-news.html', 'web'],
      ['Data & applications', 'Develop applications, process data and work with databases.', ['Python', 'Flutter / Dart', 'SQL Server', 'MySQL', 'SQLite', 'Firebase'], 'ScheduleApp & Data Mining SPADE', './du-an/schedule-app.html', 'data'],
      ['Coordination & operations', 'Clarify requirements, follow progress and check the result before handoff.', ['Content management', 'IT Support', 'Teamwork', 'Customer support'], 'My work history', './kinh-nghiem.html', 'ops']
    ],
    processTitle: 'CLEAR AT THE START.<br><span>INVOLVED TO THE END.</span>',
    process: [['Understand the brief', 'Discuss the goal, content, assets and scope of the work.'], ['Sketch & design', 'Develop layouts, prepare a direction and incorporate feedback.'], ['Build & review', 'Put content into the product and check the layout and key interactions.'], ['Handoff & update', 'Deliver the assets and document what to follow up once the product is in use.']],
    faqTitle: 'Before we begin',
    faqs: [['What should I prepare?', 'Your goals, content, existing images or brand assets, and intended timeline. References help clarify the direction.'], ['How are time and cost determined?', 'After discussing the scope, number of deliverables and revision rounds. Use the brief below to agree on the details before starting.'], ['Can we discuss an existing website?', 'Yes. Describe the updates you need or the issue you are experiencing so I can review the scope and a suitable way to collaborate.']],
    briefTitle: 'Tell me about<br><span>your idea.</span>', briefIntro: 'Write a few lines to prepare a project email. You will review and send it from your own email app.',
    name: 'Your name', email: 'Contact email', service: 'What do you need help with?', message: 'Project details', messagePlaceholder: 'Your goal, deliverables, intended timeline…', submit: 'Prepare project email',
    educationName: 'Ho Chi Minh City University of Industry and Trade', degree: 'Information technology', community: 'Orbis ICT Contributor',
    communityText: 'Joined workshops, shared ideas and contributed to activities in the tech and media community.',
    educationText: 'Applied information technology foundations through web projects, Python applications and an IoT simulation in this portfolio.',
    educationRecord: 'EDUCATION RECORD', communityRecord: 'COMMUNITY ACTIVITIES', cv: 'Download CV', projects: 'Explore practice projects',
    learnTitle: 'LEARN. BUILD.<br><span>KEEP EXPLORING.</span>',
    learnItems: [['Foundations', 'Information technology', 'Studied at Ho Chi Minh City University of Industry and Trade, 2022–2026.'], ['Practice', 'Personal projects', 'A news website, scheduling tool, data mining application, online store and RFID simulation.'], ['Connections', 'Orbis ICT community', 'Learning through workshops, sharing ideas and contributing to the community.']],
    statsTitle: 'A FEW<br><span>NUMBERS.</span>', statsIntro: 'Highlights from my CV and the projects shown here.',
    stats: [['20', 'Technologies & tools in my CV', './tech-stack.html', '+'], ['7', 'Projects featured', './du-an.html'], ['4', 'Organizations worked with', './kinh-nghiem.html'], ['4', 'Years studying IT · 2022–2026', './hoc-van.html']],
    footerText: 'Print design. Website operations. Involved from the first idea to the handoff.', connect: 'Connect',
    capabilityHeading: 'CREATIVE THINKING.<br><span>TECHNICAL GROUNDING.</span>',
    homeEducationHeading: 'LEARN THE FOUNDATIONS.<br><span>GROW THROUGH PRACTICE.</span>'
  }
};

const art = kind => `<div class="studio-art art-${kind}" aria-hidden="true"><span></span><span></span><span></span><i></i></div>`;
const heading = (eyebrow, title, id = '') => `<div class="studio-heading"><p class="kicker">${eyebrow}</p><h2${id ? ` id="${id}"` : ''} data-studio-reveal>${title}</h2></div>`;
const cta = t => `<section class="studio-cta"><div class="wrap"><p class="kicker">${t.serviceEyebrow}</p><h2 data-studio-reveal>${t.briefTitle}</h2><a class="button primary" href="./lien-he.html">${t.contact}</a></div></section>`;
const groups = (t, full) => `<div class="capability-grid">${t.skillGroups.map(([title, text, tools, evidence, url, icon]) => `<article class="capability-item" data-studio-reveal>${art(icon)}<h3>${title}</h3><p>${text}</p><ul class="studio-tags">${tools.map(tool => `<li>${tool}</li>`).join('')}</ul>${full ? `<a class="text-link" href="${url}">${evidence}</a>` : ''}</article>`).join('')}</div>`;
const services = (t, full) => `<div class="service-grid">${t.serviceItems.map(([title, subtitle, text, items, tools, kind]) => `<article class="service-card" data-studio-reveal data-studio-tilt>${art(kind)}<p class="service-subtitle">${subtitle}</p><h3>${title}</h3><p>${text}</p>${full ? `<ul class="service-deliverables">${items.map(item => `<li>${item}</li>`).join('')}</ul><p class="service-tools">${tools}</p>` : ''}<a class="text-link" href="./dich-vu.html${full ? '#bat-dau' : '#' + kind}">${full ? t.contact : t.viewServices}<span class="sr"> · ${title}</span></a></article>`).join('')}</div>`;
const records = (t, assets) => `<div class="record-deck" data-studio-scene>${[['education', t.educationRecord, '2022 — 2026', t.educationName, t.degree, 'GPA 3.1 / 4.0'], ['community', t.communityRecord, '2025 — 2026', t.community, t.communityText, 'ORBIS ICT']].map(([kind, label, date, title, text, note], i) => `<article class="record-card record-${kind}" data-studio-reveal style="--record-index:${i}"><div class="record-meta"><span>${label}</span><span>${date}</span></div><div class="record-emblem" aria-hidden="true">${i ? 'O' : 'IT'}<span>+</span></div><h3>${title}</h3><p>${text}</p><div class="record-bottom"><strong>${note}</strong><span>TRƯỜNG DUY</span></div></article>`).join('')}</div>`;

function techStack(lang, standalone = false) {
  const en = lang === 'en';
  const titleTag = standalone ? 'h1' : 'h2';
  const groups = en ? [
    ['Languages', 'C# · PHP · Python · Dart · JavaScript · HTML · CSS', 'code'],
    ['Web & mobile', 'ASP.NET Core · Laravel · Angular · Flutter · RESTful API', 'screens'],
    ['Data & cloud', 'SQL Server · MySQL · SQLite · Firebase Firestore', 'data'],
    ['Tools & AI', 'Git · Postman · Swagger · Figma · Canva · Photoshop · Basic AI & data mining', 'tools']
  ] : [
    ['Ngôn ngữ', 'C# · PHP · Python · Dart · JavaScript · HTML · CSS', 'code'],
    ['Web & mobile', 'ASP.NET Core · Laravel · Angular · Flutter · RESTful API', 'screens'],
    ['Dữ liệu & cloud', 'SQL Server · MySQL · SQLite · Firebase Firestore', 'data'],
    ['Công cụ & AI', 'Git · Postman · Swagger · Figma · Canva · Photoshop · AI & khai phá dữ liệu cơ bản', 'tools']
  ];
  const note = en
    ? 'Tools and technologies I use across software, data and interface projects.'
    : 'Các công cụ và công nghệ tôi sử dụng trong dự án phần mềm, dữ liệu và giao diện.';
  const details = en ? 'Explore the full stack' : 'Xem Tech Stack đầy đủ';
  return `<section class="tech-stack" id="tech-stack" aria-labelledby="tech-stack-title" data-tech-stack>
    <span class="tech-stack-anchor" id="nang-luc" aria-hidden="true"></span>
    <div class="tech-stack-stage">
      <div class="tech-stack-layout">
        <div class="tech-stack-intro">
          <p class="tech-stack-kicker">${en ? 'Skills & technology' : 'Năng lực & công nghệ'}</p>
          <${titleTag} id="tech-stack-title">TECH<br><span class="tech-stack-accent"><span>STACK.</span><span aria-hidden="true">STACK.</span></span></${titleTag}>
          <p class="tech-stack-note">${note}</p>
          ${standalone ? '' : `<a class="tech-stack-link" href="./tech-stack.html">${details} <span aria-hidden="true">↗</span></a>`}
        </div>
        <div class="tech-stack-grid">
          ${groups.map(([label, tools, icon]) => `<article class="tech-stack-item" data-tech-stack-item><h${standalone ? '2' : '3'}>${label}</h${standalone ? '2' : '3'}><div class="tech-stack-icon tech-icon-${icon}" aria-hidden="true"><i></i><i></i><i></i><i></i></div><p>${tools}</p></article>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>`;
}

function techDetails(lang) {
  const en = lang === 'en';
  const groups = en ? [
    ['Development & security', 'Responsive design · RESTful APIs · Entity Framework Core · Authentication / JWT · Role-based authorization'],
    ['Development tools', 'Visual Studio · VS Code · Android Studio · SSMS · Git / GitHub · Postman · Swagger · Windows · Linux'],
    ['Testing & data', 'Test cases · Test plans · API testing · Basic AI, deep learning and data mining'],
    ['Design & collaboration', 'Figma · Canva · Adobe · Teamwork · Task planning · Technical English']
  ] : [
    ['Phát triển & bảo mật', 'Responsive design · RESTful API · Entity Framework Core · Xác thực / JWT · Phân quyền người dùng'],
    ['Công cụ phát triển', 'Visual Studio · VS Code · Android Studio · SSMS · Git / GitHub · Postman · Swagger · Windows · Linux'],
    ['Kiểm thử & dữ liệu', 'Test case · Test plan · Kiểm thử API · Kiến thức cơ bản về AI, deep learning và khai phá dữ liệu'],
    ['Thiết kế & phối hợp', 'Figma · Canva · Adobe · Làm việc nhóm · Lập kế hoạch · Đọc tài liệu tiếng Anh']
  ];
  return `<section class="tech-details" aria-labelledby="tech-details-title"><div class="tech-details-inner">
    <div><p class="tech-stack-kicker">${en ? 'More skills' : 'Kỹ năng bổ sung'}</p><h2 id="tech-details-title">${en ? 'TOOLS IN PRACTICE.' : 'CÔNG CỤ TRONG THỰC TẾ.'}</h2></div>
    <div class="tech-details-grid">${groups.map(([title, content]) => `<article><h3>${title}</h3><p>${content}</p></article>`).join('')}</div>
    <a class="tech-stack-link" href="./nang-luc.html">${en ? 'Explore capabilities and projects' : 'Xem năng lực và dự án'} <span aria-hidden="true">↗</span></a>
  </div></section>`;
}

function serviceArtwork(kind) {
  const grid = '<rect class="art-frame" x="2" y="4" width="296" height="90" pathLength="1"/><path class="art-grid" d="M2 34H298 M2 64H298 M76 4V94 M150 4V94 M224 4V94"/>';
  const pictures = {
    print: `<g class="art-outline"><rect x="37" y="20" width="166" height="69" rx="2" transform="rotate(-5 120 55)" pathLength="1"/><rect x="63" y="20" width="166" height="69" rx="2" transform="rotate(3 146 55)" pathLength="1"/><rect x="77" y="31" width="64" height="43" pathLength="1"/></g>
      <g class="art-detail"><path d="M151 35H214 M151 46H205 M151 58H211 M151 70H192" pathLength="1"/><path class="art-arrow" d="M233 56H275 M266 48L275 56L266 64" pathLength="1"/></g>
      <rect class="art-fill art-fill-a" x="81" y="35" width="56" height="35"/><rect class="art-fill art-fill-b" x="151" y="42" width="32" height="6"/><rect class="art-fill art-fill-c" x="151" y="65" width="41" height="6"/>`,
    web: `<g class="art-outline"><rect x="56" y="8" width="86" height="96" rx="9" pathLength="1"/><path d="M76 18H122 M75 91H93 M100 91H122" pathLength="1"/><rect x="73" y="34" width="52" height="40" pathLength="1"/><rect x="191" y="24" width="59" height="61" pathLength="1"/><path d="M191 37H250" pathLength="1"/></g>
      <g class="art-detail"><path class="art-arrow" d="M125 56H172 M164 48L172 56L164 64 M250 56H272" pathLength="1"/><path d="M200 47H241 M200 61H232" pathLength="1"/></g>
      <rect class="art-fill art-fill-a" x="78" y="39" width="42" height="30"/><rect class="art-fill art-fill-b" x="200" y="43" width="39" height="8"/><rect class="art-fill art-fill-c" x="200" y="57" width="27" height="8"/>`,
    ops: `<g class="art-outline"><rect x="14" y="38" width="52" height="35" pathLength="1"/><rect x="118" y="15" width="56" height="30" pathLength="1"/><rect x="118" y="64" width="56" height="30" pathLength="1"/><rect x="230" y="38" width="52" height="35" pathLength="1"/><path d="M66 55H91V30H118 M91 55V79H118 M174 30H202V55H230 M174 79H202V55" pathLength="1"/></g>
      <g class="art-detail"><path d="M20 55H60 M124 30H168 M124 79H168 M236 55H276" pathLength="1"/></g>
      <rect class="art-fill art-fill-a" x="27" y="47" width="25" height="17"/><rect class="art-fill art-fill-b" x="130" y="21" width="33" height="18"/><rect class="art-fill art-fill-c" x="130" y="70" width="33" height="18"/><rect class="art-fill art-fill-d" x="244" y="47" width="25" height="17"/>`
  };
  return `<svg class="service-story-art" viewBox="0 0 300 110" aria-hidden="true" focusable="false">${grid}${pictures[kind]}</svg>`;
}

function serviceStory(lang, standalone = false) {
  const en = lang === 'en';
  const titleTag = standalone ? 'h1' : 'h2';
  const entries = en ? [
    ['Print & visual design', 'Brochures, banners and visual materials shaped around the message.', 'print'],
    ['Web & applications', 'Responsive interfaces and practical web or mobile features, from design to implementation.', 'web'],
    ['Website operations', 'Content updates, maintenance and coordination when technical issues arise.', 'ops']
  ] : [
    ['Thiết kế ấn phẩm', 'Brochure, banner và hình ảnh truyền thông được xây dựng theo nội dung cần thể hiện.', 'print'],
    ['Website & ứng dụng', 'Giao diện responsive và tính năng web hoặc mobile, từ thiết kế đến triển khai.', 'web'],
    ['Vận hành website', 'Cập nhật nội dung, bảo trì và phối hợp xử lý các vấn đề kỹ thuật phát sinh.', 'ops']
  ];
  return `<section class="service-story" id="dich-vu" aria-labelledby="service-story-title" data-service-story>
    <div class="service-story-stage"><div class="service-story-shell">
      <p class="service-story-kicker">${en ? 'Services & collaboration' : 'Dịch vụ & hợp tác'}</p>
      <div class="service-story-heading">
        <${titleTag} id="service-story-title"><span data-service-title> ${en ? 'FROM THE IDEA.' : 'TỪ Ý TƯỞNG.'}</span><span data-service-title>${en ? 'TO THE HANDOFF.' : 'ĐẾN BÀN GIAO.'}</span></${titleTag}>
        <p>${en ? 'Design, development and website support connected through each stage of the work.' : 'Thiết kế, phát triển và hỗ trợ website xuyên suốt từng giai đoạn của công việc.'}</p>
      </div>
      <div class="service-story-list">
        ${entries.map(([title, text, kind]) => `<article class="service-story-row" data-service-row>
          <h${standalone ? '2' : '3'}><a href="./dich-vu.html#${kind}">${title}</a></h${standalone ? '2' : '3'}>
          <p>${text}</p>${serviceArtwork(kind)}
          <div class="service-story-rule" aria-hidden="true"><i></i><i></i><i></i><i></i><span></span></div>
        </article>`).join('\n        ')}
        <svg class="service-story-connections" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="connection-trunk" d="M999 -40V310" pathLength="1"/>
          <path class="connection-branch connection-branch-a" d="M999 100C998 160 966 239 920 284" pathLength="1"/>
          <path class="connection-branch connection-branch-b" d="M999 200C985 238 948 266 920 284" pathLength="1"/>
          <path class="connection-branch connection-branch-c" d="M999 299C974 289 948 278 920 284" pathLength="1"/>
        </svg>
      </div>
      <a class="service-story-link" href="./dich-vu.html#bat-dau">${en ? 'Discuss your project' : 'Trao đổi công việc'} <span aria-hidden="true">↗</span></a>
    </div></div>
  </section>`;
}

function contactFinale(lang, standalone = false) {
  const en = lang === 'en';
  const tag = standalone ? 'h1' : 'h2';
  const lines = en ? ['LET’S BRING', 'YOUR IDEAS', 'TO LIFE', 'TOGETHER.'] : ['CÙNG HIỆN', 'THỰC HÓA', 'Ý TƯỞNG', 'CỦA BẠN.'];
  const label = en ? 'Let’s bring your ideas to life together.' : 'Cùng hiện thực hóa ý tưởng của bạn.';
  return `<section id="lien-he" class="contact-finale" aria-labelledby="contact-title" data-contact-finale>
    <div class="contact-finale-stage">
      <div class="contact-finale-orb" aria-hidden="true"></div>
      <div class="contact-finale-shell">
        <div class="contact-finale-meta"><p>${en ? 'CONTACT' : 'LIÊN HỆ'}</p><p>${en ? 'KHANH HOA · VIETNAM' : 'KHÁNH HÒA · VIỆT NAM'}</p></div>
        <${tag} class="contact-finale-title" id="contact-title" aria-label="${label}">${lines.map(line => `<span data-finale-line>${line}</span>`).join('')}</${tag}>
        <div class="contact-finale-bottom">
          <p>${en ? 'Let’s discuss your design, website or digital product.' : 'Cùng trao đổi về thiết kế, website hoặc sản phẩm số của bạn.'}</p>
          <address>
            <a href="mailto:mbf2907.ntkh@gmail.com"><span aria-hidden="true">✉</span> mbf2907.ntkh@gmail.com</a>
            <a href="tel:+84796177075"><span aria-hidden="true">↗</span> 0796 177 075</a>
            <a href="https://github.com/butedu"><span aria-hidden="true">↗</span> GitHub</a>
            <a href="${standalone ? '#gui-loi-nhan' : './lien-he.html'}"><span aria-hidden="true">↗</span> ${standalone ? (en ? 'Write a message' : 'Gửi lời nhắn') : (en ? 'Contact page' : 'Trang liên hệ')}</a>
          </address>
        </div>
      </div>
      <p class="contact-finale-cue">${en ? 'Scroll to continue' : 'Cuộn để tiếp tục'} <span aria-hidden="true">↓</span></p>
    </div>
  </section>`;
}

function contactForm(lang) {
  const en = lang === 'en';
  const t = en ? {
    eyebrow: 'START A CONVERSATION', heading: 'TELL ME ABOUT<br><span>YOUR IDEA.</span>',
    intro: 'A few details are a great place to start. Share what you need and how I can reach you.',
    emailLabel: 'Prefer email?', name: 'Your name', namePlaceholder: 'How should I address you?',
    email: 'Email address', phone: 'Phone number', optional: 'optional', service: 'What can I help with?',
    message: 'Your message', messagePlaceholder: 'Tell me about your idea, goals or timeline…',
    required: 'Required fields', button: 'Send message', note: 'Your message will be sent directly to my email.',
    options: ['Print & visual design', 'Websites & applications', 'Website operations', 'Something else']
  } : {
    eyebrow: 'BẮT ĐẦU KẾT NỐI', heading: 'KỂ MÌNH NGHE<br><span>Ý TƯỞNG CỦA BẠN.</span>',
    intro: 'Một vài thông tin là đủ để bắt đầu. Hãy chia sẻ điều bạn cần và cách mình có thể liên hệ lại.',
    emailLabel: 'Hoặc gửi email trực tiếp', name: 'Họ và tên', namePlaceholder: 'Mình nên gọi bạn là gì?',
    email: 'Email liên hệ', phone: 'Số điện thoại', optional: 'không bắt buộc', service: 'Bạn cần hỗ trợ gì?',
    message: 'Nội dung lời nhắn', messagePlaceholder: 'Chia sẻ ý tưởng, mục tiêu hoặc thời gian dự kiến…',
    required: 'Thông tin bắt buộc', button: 'Gửi lời nhắn', note: 'Lời nhắn của bạn sẽ được gửi trực tiếp đến email của mình.',
    options: ['Thiết kế ấn phẩm', 'Website & ứng dụng', 'Vận hành website', 'Nhu cầu khác']
  };
  const safe = value => value.replaceAll('&', '&amp;');
  return `<section id="gui-loi-nhan" class="contact-inquiry" data-contact-inquiry aria-labelledby="contact-form-title">
    <canvas class="starfield contact-inquiry-stars" data-stars aria-hidden="true"></canvas>
    <div class="wrap contact-inquiry-layout">
      <div class="contact-inquiry-intro" data-studio-reveal>
        <p class="contact-inquiry-kicker"><span aria-hidden="true"></span>${t.eyebrow}</p>
        <h2 id="contact-form-title">${t.heading}</h2>
        <p class="contact-inquiry-copy">${t.intro}</p>
        <div class="contact-inquiry-mail"><span aria-hidden="true" class="contact-mail-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span><div><span>${t.emailLabel}</span><a href="mailto:mbf2907.ntkh@gmail.com">mbf2907.ntkh@gmail.com</a></div></div>
      </div>
      <form class="contact-inquiry-form" data-contact-form data-studio-reveal method="post">
        <input type="hidden" name="origin"><input type="hidden" name="requestId">
        <label class="contact-honeypot" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        <div class="contact-form-top"><span>${en ? 'YOUR MESSAGE' : 'LỜI NHẮN CỦA BẠN'}</span><span><i aria-hidden="true">*</i> ${t.required}</span></div>
        <div class="contact-form-row">
          <label class="contact-field" for="contact-name"><span>${t.name} <i aria-hidden="true">*</i></span><input id="contact-name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="100" placeholder="${t.namePlaceholder}"></label>
          <label class="contact-field" for="contact-email"><span>${t.email} <i aria-hidden="true">*</i></span><input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="200" placeholder="you@example.com"></label>
        </div>
        <label class="contact-field" for="contact-phone"><span>${t.phone} <small>(${t.optional})</small></span><input id="contact-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" placeholder="${en ? 'Your phone number' : 'Số điện thoại của bạn'}"></label>
        <fieldset class="contact-options"><legend>${t.service} <i aria-hidden="true">*</i></legend><div>${t.options.map((option, index) => `<label><input type="radio" name="service" value="${safe(option)}"${index === 0 ? ' required' : ''}><span>${safe(option)}</span></label>`).join('')}</div></fieldset>
        <label class="contact-field" for="contact-message"><span>${t.message} <i aria-hidden="true">*</i></span><textarea id="contact-message" name="message" rows="5" required minlength="10" maxlength="2500" placeholder="${t.messagePlaceholder}"></textarea></label>
        <div class="contact-form-bottom"><button type="submit" disabled><span>${t.button}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></button><p>${t.note}</p></div>
        <noscript><p class="contact-form-status">${en ? 'Please enable JavaScript to send a message.' : 'Vui lòng bật JavaScript để gửi lời nhắn.'}</p></noscript>
        <p class="contact-form-status" data-contact-form-status role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>`;
}

for (const lang of languages) {
  const t = copy[lang];
  const base = lang === 'en' ? 'en/' : '';
  const asset = lang === 'en' ? '../assets/' : './assets/';
  const shared = lang === 'en' ? '../' : './';
  let contact = read(base + 'lien-he.html');
  contact = contact.replace(/<section (?:id="lien-he" class="contact-finale"|class="contact contact-page contact-scene")[\s\S]*?<\/section>/, contactFinale(lang, true));
  contact = contact.replace('<main id="noi-dung" tabindex="-1">', '<main id="noi-dung" tabindex="-1" class="contact-finale-page">');
  contact = contact.replace(/\s*<!-- contact:form -->[\s\S]*?<!-- \/contact:form -->/g, '');
  contact = contact.replace(/\s*<\/main>/, `\n    <!-- contact:form -->\n${contactForm(lang)}\n    <!-- /contact:form -->\n  </main>`);
  write(base + 'lien-he.html', contact);
  const aboutPage = read(base + 've-toi.html').replace(/<a class="button secondary" href="[^"]*CV-Truong-Duy\.pdf"[^>]*>[\s\S]*?<\/a>/, '');
  write(base + 've-toi.html', aboutPage);
  const header = contact.match(/<header class="topbar">[\s\S]*?<\/header>/)[0].replaceAll(' aria-current="page"', '');
  const footer = contact.match(/<footer(?:\s[^>]*)?>[\s\S]*?<\/footer>/)[0];

  function page(file, title, intro, eyebrow, hero, body) {
    const stackPage = file === 'tech-stack.html';
    const servicePage = file === 'dich-vu.html';
    const customPage = stackPage || servicePage;
    const languageNav = `<nav class="language-switch" aria-label="${lang === 'en' ? 'Language' : 'Ngôn ngữ'}"><a href="${lang === 'en' ? '../' : ''}${file}" lang="vi" hreflang="vi" aria-label="Tiếng Việt"${lang === 'vi' ? ' aria-current="true"' : ''}>VI</a><a href="${lang === 'vi' ? 'en/' : ''}${file}" lang="en" hreflang="en" aria-label="English"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a></nav>`;
    const pageHeader = header.replace(/<nav class="language-switch"[\s\S]*?<\/nav>/, languageNav);
    const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#04070e">
  <meta name="description" content="${intro}">
  <title>${title} · Nguyễn Phạm Trường Duy</title>
  <link rel="icon" href="${asset}favicon.png" type="image/png">
  <link rel="alternate" hreflang="vi" href="${lang === 'en' ? '../' : ''}${file}">
  <link rel="alternate" hreflang="en" href="${lang === 'vi' ? 'en/' : ''}${file}">
  <link rel="preload" href="${asset}fonts/alata.woff" as="font" type="font/woff" crossorigin>
  <link rel="stylesheet" href="${shared}style.css">
  <link rel="stylesheet" href="${shared}motion.css">
  <link rel="stylesheet" href="${shared}reference.css">
  <link rel="stylesheet" href="${shared}studio.css">${stackPage ? `\n  <link rel="stylesheet" href="${shared}tech-stack.css">` : ''}
  <script src="${shared}main.js" defer></script>
  <script src="${shared}studio.js" defer></script>
</head>
<body id="dau-trang">
  <a class="skip" href="#noi-dung">${lang === 'en' ? 'Skip to main content' : 'Đến nội dung chính'}</a>
  ${pageHeader}
  <main id="noi-dung" tabindex="-1" class="${stackPage ? 'tech-stack-page' : servicePage ? 'service-story-page' : 'studio-page'}">
${customPage ? '' : `    <section class="studio-hero"><div class="wrap"><p class="kicker">${eyebrow}</p><h1 class="opening">${hero}</h1><div class="studio-hero-bottom"><p>${intro}</p><a class="studio-round" href="#chi-tiet" aria-label="${lang === 'en' ? 'Explore the details' : 'Khám phá nội dung'}"><span aria-hidden="true">+</span></a></div></div><div class="studio-gridline" aria-hidden="true"></div></section>`}
    ${body}
  </main>
  ${footer}
</body>
</html>
`;
    write(base + file, html);
  }

  const brief = `<section id="bat-dau" class="studio-brief"><div class="wrap brief-grid">${heading(t.contact, t.briefTitle)}<form data-project-brief action="mailto:mbf2907.ntkh@gmail.com" method="get"><p>${t.briefIntro}</p><div class="brief-fields"><label>${t.name}<input name="name" autocomplete="name" required maxlength="100"></label><label>${t.email}<input name="email" type="email" autocomplete="email" required maxlength="200"></label></div><label>${t.service}<select name="service">${t.serviceItems.map(item => `<option>${item[0]}</option>`).join('')}</select></label><label>${t.message}<textarea name="message" rows="5" required minlength="10" maxlength="3000" placeholder="${t.messagePlaceholder}"></textarea></label><button class="button primary" type="submit">${t.submit}</button><p class="brief-status" data-brief-status role="status"></p></form></div></section>`;
  const serviceBody = `<section id="chi-tiet" class="studio-section studio-paper"><div class="wrap">${heading(t.serviceEyebrow, t.serviceTitle)}${services(t, true)}</div></section><section class="studio-section process-section"><div class="wrap">${heading(t.services, t.processTitle)}<ol class="studio-process">${t.process.map(([title, text]) => `<li data-studio-reveal><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></div></section><section class="studio-section studio-paper"><div class="wrap faq-grid"><h2>${t.faqTitle}</h2><div>${t.faqs.map(([question, answer]) => `<details class="studio-faq"><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}</div></div></section>${brief}`;
  // Fragment names match the three service links on the home page.
  const servicesWithIds = serviceBody.replace(/<article class="service-card"/g, (() => { let i = 0; return () => `<article id="${t.serviceItems[i++][5]}" class="service-card"`; })());
  page('dich-vu.html', t.services, t.serviceIntro, t.serviceEyebrow, t.serviceTitle, serviceStory(lang, true) + servicesWithIds);
  page('nang-luc.html', t.skills, t.skillIntro, t.skillEyebrow, t.skillTitle, `<section id="chi-tiet" class="studio-section studio-paper"><div class="wrap capability-layout">${heading(t.toolsLabel, t.capabilityHeading)}${groups(t, true)}</div></section><section class="studio-section evidence-section"><div class="wrap">${heading(t.evidence, lang === 'en' ? 'SEE IT<br><span>IN THE WORK.</span>' : 'NĂNG LỰC<br><span>QUA SẢN PHẨM.</span>')}<div class="evidence-grid">${[['Online Certificate Classroom', 'Laravel · MySQL · Flutter API', 'online-certificate-classroom'], ['VN News', 'Laravel · PHP · MySQL', 'vn-news'], ['ScheduleApp', 'Python · Tkinter · JSON', 'schedule-app'], ['Data Mining SPADE', 'Python · Pandas', 'data-mining-spade'], ['Handicraft Shop', 'C# · ASP.NET MVC · SQL', 'handicraft-shop'], [lang === 'en' ? 'RFID Attendance' : 'Điểm danh RFID', 'ESP32 · RFID RC522', 'diem-danh-rfid']].map(([title, tools, slug]) => `<a class="evidence-row" href="./du-an/${slug}.html" data-studio-reveal><h3>${title}</h3><span>${tools}</span><i aria-hidden="true">+</i></a>`).join('')}</div></div></section>${cta(t)}`);
  page('tech-stack.html', 'Tech Stack', t.skillIntro, t.skillEyebrow, '', techStack(lang, true) + techDetails(lang));
  page('hoc-van.html', t.education, t.educationIntro, t.educationEyebrow, t.educationTitle, `<section id="chi-tiet" class="studio-section studio-paper record-section"><div class="wrap record-layout"><div>${heading(t.educationEyebrow, t.learnTitle)}<p class="studio-body-copy">${t.educationText}</p><a class="button secondary" href="${asset}CV-Truong-Duy.pdf" download="CV-Nguyen-Pham-Truong-Duy.pdf">${t.cv} <small>PDF</small></a></div>${records(t, asset)}</div></section><section class="studio-section learning-section"><div class="wrap"><ol class="learning-list">${t.learnItems.map(([label, title, text]) => `<li data-studio-reveal><p class="kicker">${label}</p><div><h2>${title}</h2><p>${text}</p></div></li>`).join('')}</ol><a class="text-link" href="./du-an.html">${t.projects}</a></div></section>${cta(t)}`);

  // Keep the source values and their labels together while presenting them low to high.
  const orderedStats = t.stats.map((entry, index) => ({ entry, index }))
    .sort((a, b) => Number(a.entry[0]) - Number(b.entry[0]) || a.index - b.index)
    .map(item => item.entry);
  const highestStat = Math.max(...orderedStats.map(([count]) => Number(count)), 1);
  const capabilityHome = `${techStack(lang)}<section id="con-so" class="studio-section studio-proof" data-proof-story aria-labelledby="proof-title">
    <div class="proof-stage"><div class="wrap proof-shell">
      <div class="proof-heading"><h2 id="proof-title">${t.statsTitle.replace('<br>', ' ')}</h2><p>${t.statsIntro}</p></div>
      <div class="proof-grid">${orderedStats.map(([count, label, url, suffix = ''], index) => `<a href="${url}" class="proof-item" data-proof-item aria-label="${count}${suffix} ${label}" style="--proof-ratio:${Number(count) / highestStat}">
        <div class="proof-number-group"><span class="proof-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><strong data-count="${count}" data-suffix="${suffix}">${count.padStart(2, '0')}${suffix}</strong><span class="proof-label">${label}</span></div>
        <div class="proof-chart" aria-hidden="true"><div class="proof-bar"></div><span class="proof-scan"></span></div>
      </a>`).join('')}</div>
    </div></div></section>`;
  const educationHome = `<section id="hoc-van" class="studio-section studio-paper record-section"><div class="wrap record-layout"><div>${heading(t.educationEyebrow, t.homeEducationHeading)}<p class="studio-body-copy">${t.educationIntro}</p><a class="text-link" href="./hoc-van.html">${t.viewEducation}</a></div>${records(t, asset)}</div></section>${serviceStory(lang)}`;
  let home = read(base + 'index.html');
  home = home.replace(/\s*<!-- studio:capabilities -->[\s\S]*?<!-- \/studio:capabilities -->/g, '').replace(/\s*<!-- studio:education -->[\s\S]*?<!-- \/studio:education -->/g, '');
  const about = home.match(/<section id="ho-so"[\s\S]*?<\/section>/);
  if (!about) throw new Error('Missing About Me section in ' + base + 'index.html');
  const cleanedAbout = about[0].replace(/<a class="button secondary" href="[^"]*CV-Truong-Duy\.pdf"[^>]*>[\s\S]*?<\/a>/, '');
  home = home.replace(/\s*<section id="ho-so"[\s\S]*?<\/section>/, '').replace(/\s*(?=<section class="section editorial technical-story)/, '\n    ' + cleanedAbout + '\n    ');
  home = home.replace(/<section id="lien-he"[\s\S]*?<\/section>/, contactFinale(lang));
  home = home.replace('    <section id="lien-he"', `    <!-- studio:capabilities -->\n${capabilityHome}\n    <!-- /studio:capabilities -->\n    <!-- studio:education -->\n${educationHome}\n    <!-- /studio:education -->\n    <section id="lien-he"`);
  write(base + 'index.html', home);
}

// Shared navigation, assets and footer stay identical on all static pages.
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() && entry.name !== 'node_modules' ? walk(path.join(directory, entry.name)) : entry.isFile() && entry.name.endsWith('.html') ? [path.join(directory, entry.name)] : []);
}
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const lang = /<html lang="en"/.test(html) ? 'en' : 'vi';
  const t = copy[lang];
  const contactHref = html.match(/class="nav-contact-mobile" href="([^"]+)"/)[1];
  const prefix = contactHref.slice(0, -'lien-he.html'.length);
  const shared = html.match(/href="([^"]*)reference\.css"/)[1];
  if (!html.includes('studio.css')) html = html.replace(/(<link rel="stylesheet" href="[^"]*reference\.css">)/, `$1\n  <link rel="stylesheet" href="${shared}studio.css">`);
  if (!html.includes('loader.css')) html = html.replace(/(<link rel="stylesheet" href="[^"]*reference\.css">)/, `$1\n  <link rel="stylesheet" href="${shared}loader.css">`);
  if (!html.includes('loader.js')) html = html.replace(/(<script src="[^"]*main\.js" defer><\/script>)/, `  <script src="${shared}loader.js"></script>\n  $1`);
  if (!html.includes('src="' + shared + 'studio.js"')) html = html.replace(/(<script src="[^"]*main\.js" defer><\/script>)/, `$1\n  <script src="${shared}studio.js" defer></script>`);
  html = html.replace(/\s*<!-- studio:navigation -->[\s\S]*?<!-- \/studio:navigation -->/g, '');
  const current = path.basename(file);
  const extra = [['dich-vu.html', t.services], ['tech-stack.html', 'Tech Stack'], ['nang-luc.html', t.skills], ['hoc-van.html', t.education]];
  const discovery = `<div class="nav-discovery"><button type="button" class="discovery-toggle" aria-expanded="false" aria-controls="discover-nav"${extra.some(([name]) => name === current) ? ' data-active="true"' : ''}>${t.discover}<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><div id="discover-nav" class="discovery-panel">${extra.map(([name, label]) => `<a href="${prefix}${name}"${current === name ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</div></div>`;
  html = html.replace(/(\s*<a class="nav-contact-mobile")/, `\n        <!-- studio:navigation -->${discovery}<!-- /studio:navigation -->$1`);
  html = html.replace(/\s*<!-- studio:footer -->[\s\S]*?<!-- \/studio:footer -->/g, '');
  const snow = lang === 'en' ? {
    eyebrow: 'A LITTLE SPACE TO CONNECT',
    note: 'Have an idea in mind? Let’s bring it to life together.', action: 'Start a conversation', toggle: 'Pause snowfall'
  } : {
    eyebrow: 'MỘT KHOẢNG ĐỂ KẾT NỐI',
    note: 'Bạn đang có một ý tưởng? Cùng nhau biến ý tưởng ấy thành hiện thực.', action: 'Trao đổi dự án', toggle: 'Tạm dừng tuyết'
  };
  const snowContactHref = current === 'lien-he.html' ? '#gui-loi-nhan' : `${prefix}lien-he.html`;
  const footer = `<div class="snow-footer-scene" aria-hidden="true"><div class="snow-mountains"></div><div class="snow-glow"></div><div class="snow-fall"></div></div>
  <div class="wrap snow-footer-intro"><div><p class="snow-footer-kicker"><span aria-hidden="true">✶</span> ${snow.eyebrow}</p><p class="snow-footer-note">${snow.note}</p></div><div class="snow-footer-actions"><a class="snow-contact" href="${snowContactHref}">${snow.action}</a><button class="snow-toggle" type="button" data-snow-toggle aria-pressed="true" hidden><span aria-hidden="true">❄</span> <span data-snow-label>${snow.toggle}</span></button></div></div>
  <div class="wrap studio-footer"><div><a class="footer-brand" href="${prefix}index.html">Trường Duy<span>.</span></a><p>${t.footerText}</p></div><nav aria-label="${t.discover}"><p>${t.discover}</p>${extra.map(([name, label]) => `<a href="${prefix}${name}">${label}</a>`).join('')}</nav><div><p>${t.connect}</p><a href="mailto:mbf2907.ntkh@gmail.com">mbf2907.ntkh@gmail.com</a><a href="tel:+84796177075">0796 177 075</a><span>Khánh Hòa, Việt Nam</span></div></div>`;
  html = html.replace(/<footer(?:\s[^>]*)?>/, '<footer class="snow-footer" data-snow-footer>');
  html = html.replace('<footer class="snow-footer" data-snow-footer>', `<footer class="snow-footer" data-snow-footer>\n<!-- studio:footer -->${footer}<!-- /studio:footer -->`);
  fs.writeFileSync(file, html);
}
console.log('Built 8 bilingual pages and synchronized navigation, footer and home sections.');

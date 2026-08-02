-- 匯入施家訓的 104 履歷真實資料

update public.about_profile set
  name = 'Josh',
  english_name = 'Josh',
  title = '軟體工程師 / 雲端工程師',
  bio = '面對日新月異的科技，積極學習是我面對挑戰的態度。8~9 年軟體開發經驗，專注於雲端架構規劃（AWS / GCP）、容器化技術（Docker / Kubernetes）、CI/CD 自動化部署與全端系統開發。曾負責智慧製造系統的軟體架構設計、IoT 雲端建置與微服務開發，樂於與團隊夥伴討論與分享技術，持續提升彼此的工作效率。',
  email = '',
  github = '',
  location = '台中市西屯區',
  avatar_url = ''
where id = 1;

insert into public.about_experiences (period, role, org, description, sort) values
('2026.03 — 至今', '全端工程師 / 雲端工程師', '巨大機械工業股份有限公司', '負責雲端架構規劃與全端系統開發。', 1),
('2024.07 — 2026.02', '資深軟體工程師 / 軟體副理', '馬森科技股份有限公司', '負責軟體架構設計與模組規劃、AI/ML 技術導入、容器化與 CI/CD Pipeline 建置、雲端平台架構與 HA 規劃、CNC 工具機與雲端服務 API 串接、管理 4 人以下團隊。', 2),
('2020.07 — 2024.04', '研發工程師', '香港商傲視科技有限公司台灣分公司', '容器化管理（Kubernetes / Docker）、AWS / GCP 雲端基礎建設、DevOps CI/CD、微服務開發、IoT 智慧家居/飯店/商務中心系統與 Android App 開發。', 3),
('2017.04 — 2020.06', '軟體工程師', '聯通整合系統股份有限公司', '前端網頁設計、後台程式撰寫、資料庫管理、伺服器網站架設、應用程式設計，參與 SECS/GEM 半導體設備控制、MES 系統等工業生產類專案開發。', 4),
('2016.03 — 2016.10', '助理工程師', '瑞迪國際股份有限公司', '多媒體資訊平台軟硬體設備組裝與維修。', 5);

insert into public.about_skills (name, level, sort) values
('AWS / GCP Cloud', 90, 1),
('Docker / Kubernetes', 88, 2),
('CI/CD Pipeline', 85, 3),
('Python / Node.js / C#', 88, 4),
('MySQL / MSSQL / Oracle / MongoDB', 80, 5),
('Linux', 82, 6);

insert into public.about_certificates (name, issuing_authority, sort) values
('LPIC Level 1', 'Linux Professional Institute', 1),
('IC3', 'Certiport', 2),
('丙級電腦硬體裝修技術士', '勞動部勞動力發展署技能檢定中心', 3),
('丙級網頁設計技術士', '勞動部勞動力發展署技能檢定中心', 4);

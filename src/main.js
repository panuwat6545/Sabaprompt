// --- 0. MOCK ANALYTICS SYSTEM ---
const SabaAnalytics = {
    trackEvent: function(eventName, eventParams) {
        console.log(`[SabaAnalytics Track] Event: "${eventName}"`, eventParams);
        if (typeof window !== 'undefined' && window.va) {
            window.va('event', { name: eventName, data: eventParams });
        }
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventParams);
        }
        if (typeof fbq === 'function') {
            fbq('trackCustom', eventName, eventParams);
        }
    }
};

// --- 1. LOCALIZATION DICTIONARY & HANDLERS ---
const i18nDict = {
    "auth_title": { th: "SABA PROMPT", en: "SABA PROMPT" },
    "auth_sub": { th: "ตัวช่วยเขียนอีเมล สื่อสารระดับยุทธศาสตร์ด้วย AI", en: "Empathetic Email Writing Assistant Powered by AI" },
    "tab_otp": { th: "OTP Sign-in", en: "OTP Sign-in" },
    "tab_fed": { th: "OAuth & AI Accounts", en: "OAuth & AI Accounts" },
    "phone_label": { th: "เบอร์โทรศัพท์มือถือ", en: "Mobile Phone Number" },
    "otp_label": { th: "กรอกรหัส OTP (รหัสจำลองคือ: 1234)", en: "Enter OTP Code (Mock: 1234)" },
    "btn_otp_init": { th: "รับรหัส OTP", en: "Get OTP Code" },
    "btn_otp_verify": { th: "ยืนยันเข้าสู่ระบบ", en: "Verify & Sign In" },
    "connect_ai_id": { th: "เชื่อมโยง AI Identity", en: "Connect AI Identity" },
    "or_text": { th: "หรือ", en: "OR" },
    "btn_guest": { th: "เข้าใช้งานแบบ Guest Mode", en: "Enter as Guest Mode" },
    "auth_disclaimer": { th: "การเข้าใช้ระบบจะทำการเก็บเซสชันในอุปกรณ์เพื่อความเป็นส่วนตัวสูงสุด (Layer 1 Privacy Framework)", en: "Data is saved locally on your browser for maximum data privacy (Layer 1 Privacy Framework)" },
    "nav_workspace": { th: "Workspace", en: "Workspace" },
    "nav_seo": { th: "วิธีเขียนอีเมล (SEO Guide)", en: "Email Guide (SEO)" },
    "nav_framework": { th: "Our Psychology & Framework", en: "Psychology & Framework" },
    "nav_architect": { th: "About the Architect", en: "About the Architect" },
    "vip_badge": { th: "VIP ACTIVE", en: "VIP ACTIVE" },
    "welcome_badge": { th: "SABA PROMPT • ตัวช่วยเขียนเมลลาหยุด & คุยงานระดับเซียน", en: "SABA PROMPT • Pro Email & Leave Assistant" },
    "welcome_subtitle": { th: "แพลตฟอร์มตัวช่วยเขียนอีเมลและขจัดดราม่าการสื่อสารในที่ทำงานด้วยพลังจิตวิทยาสากลและ AI อัจฉริยะ", en: "Resolve workplace communication drama with dynamic psychology and advanced AI." },
    "cat_title": { th: "เลือกสไตล์และรูปแบบการสื่อสารเชิงยุทธศาสตร์", en: "Select Strategic Communication Style" },
    "cat_closer_title": { th: "คุยงานลูกค้า / เสนอไอเดีย / ปิดการขาย", en: "Client Chat / Pitch Ideas / Close Sales" },
    "cat_closer_desc": { th: "มุ่งเน้นการชูคุณค่าหลักของงานและผลประโยชน์ร่วมกัน (Value-First Selling) เพื่อให้เขียนเมลปิดการขายได้อย่างน่าเชื่อถือ", en: "Focus on core value delivery and shared benefits (Value-First Selling) to close deals confidently." },
    "cat_leave_title": { th: "วิธีเขียนเมลลาหยุดกับหัวหน้า (อนุมัติทันที)", en: "Leave Request / Vacation (Instant Approval)" },
    "cat_leave_desc": { th: "วิธีเขียนอีเมลขอลากับผู้บริหารโดยไม่มีสะดุด ด้วยการเตรียมแผนจัดการความเสี่ยงและส่งมอบงานล่วงหน้า", en: "Secure time off seamlessly by presenting clear risk-mitigation plans and task handovers." },
    "cat_cowork_title": { th: "Co-Work ประสานงานข้ามแผนก", en: "Cross-Department Collaboration (Co-Work)" },
    "cat_cowork_desc": { th: "วิธีเขียนอีเมลประสานงานอย่างมีชั้นเชิง สลายกำแพง Silo ระหว่างฝ่ายด้วยหลัก Win-Win Strategy", en: "Collaborate strategically to break departmental silos using Win-Win tactics." },
    "form_title": { th: "Dynamic Form Controls", en: "Dynamic Form Controls" },
    "btn_suggest": { th: "แนะนำสถานการณ์", en: "Load Scenario" },
    "label_recipient": { th: "ชื่อผู้รับ / ตำแหน่ง", en: "Recipient / Position" },
    "label_sender": { th: "ชื่อผู้ส่ง (ชื่อของคุณ)", en: "Sender Name (Your Name)" },
    "label_doc": { th: "เอกสารประกอบการเจรจา (PC / Google Drive)", en: "Negotiation Document (PC / Google Drive)" },
    "doc_upload_main": { th: "ลากและวางไฟล์ที่นี่ หรือ <span class='text-brand-orange hover:underline'>คลิกเพื่ออัปโหลด</span>", en: "Drag and drop file here or <span class='text-brand-orange hover:underline'>click to upload</span>" },
    "doc_upload_sub": { th: "รองรับ PDF, DOCX, TXT, CSV (สูงสุด 15MB)", en: "Supports PDF, DOCX, TXT, CSV (Max 15MB)" },
    "btn_gdrive": { th: "นำเข้าจาก Google Drive", en: "Import from Google Drive" },
    "label_detail": { th: "เนื้อความ / รายละเอียดสิ่งที่เกิดขึ้น", en: "Original Context / Email Details" },
    "label_detail_badge": { th: "รองรับรูปภาพ", en: "Supports Images" },
    "label_tone": { th: "ระดับและโทนการเจรจาเชิง EQ", en: "EQ Communication Tone" },
    "tone_polite": { th: "😊 สุภาพ อ่อนโยน", en: "😊 Polite & Warm" },
    "tone_formal": { th: "💼 ทางการ มั่นใจ", en: "💼 Formal & Confident" },
    "tone_casual": { th: "☕ เป็นกันเอง ยืดหยุ่น", en: "☕ Casual & Flexible" },
    "tone_urgent": { th: "🚨 เร่งด่วน ตรงประเด็น", en: "🚨 Urgent & Direct" },
    "btn_compile": { th: "สร้างพรอพท์และร่างอีเมลด้วย AI", en: "GENERATE PROMPT & AI DRAFT" },
    "term_title": { th: "PROMPT COMPILER MATRIX", en: "PROMPT COMPILER MATRIX" },
    "tab_term_prompt": { th: "Prompt Output", en: "Prompt Output" },
    "tab_term_sim": { th: "Simulated Chat", en: "Simulated Chat" },
    "placeholder_prompt_title": { th: "พร้อมประกอบร่างคำสั่งพรอพท์", en: "Ready to Compile Prompt" },
    "placeholder_prompt_desc": { th: "กรอกข้อมูลตัวแปรทางฝั่งซ้ายมือ แล้วกดปุ่ม <span class='text-brand-orange font-bold'>สร้างพรอพท์และร่างอีเมลด้วย AI</span> เพื่อเริ่มวิเคราะห์ยุทธศาสตร์และรับโค้ดพรอพท์", en: "Fill in the variables on the left, then click <span class='text-brand-orange font-bold'>Generate Prompt & AI Draft</span> to generate." },
    "label_gen_prompt": { th: "Generated System Prompt", en: "Generated System Prompt" },
    "btn_copy_prompt": { th: "Copy Clean Prompt", en: "Copy Clean Prompt" },
    "placeholder_sim_title": { th: "รอยืนยันพรอพท์เชิงยุทธศาสตร์", en: "Awaiting Strategic Prompt" },
    "placeholder_sim_desc": { th: "เมื่อทำการคัดเลือกและกดประกอบคำสั่งเสร็จสิ้น ระบบ AI อัจฉริยะจะสวมรอยเจรจาแทนคุณด้วยการร่างอีเมลฉบับพรีเมียมให้ทันทีที่แผงนี้!", en: "Once compiled, the AI will draft your premium message here!" },
    "label_sim_email": { th: "Simulated Workspace Email", en: "Simulated Workspace Email" },
    "btn_copy_email": { th: "Copy Draft Message", en: "Copy Draft Message" },
    "sim_tip": { th: "💡 แนะนำ: ส่งข้อความนี้ในช่องทาง Chat หลัก หรือ Email ส่วนตัว", en: "💡 Tip: Send this message in main Chat channels or personal Email." },
    "tripbox_tag": { th: "🐈 เลี้ยงอาหารเปียกซาบะ", en: "🐈 Buy Wet Food for Saba" },
    "tripbox_title": { th: "ถูกใจยุทธศาสตร์คำสั่งพรอพท์นี้ไหม?", en: "Enjoy SABA PROMPT?" },
    "tripbox_desc": { th: "หากแอปพลิเคชันนี้ช่วยให้ประหยัดเวลาการเจรจางานและเจาะจิตวิทยาประสานงานไปได้หลายชั่วโมง คุณสามารถสนับสนุนค่าอาหารเปียกให้น้องแมวส้มตัวตึงซาบะของทีมพัฒนาโดยตรงโดยการสแกน PromptPay ด้านข้างได้เลยครับ! ขอบคุณสำหรับมิตรภาพและการสนับสนุน", en: "If this app saved you hours of writing, consider buying some wet food for our cat Saba by scanning the PromptPay code! Thanks for your support." },
    "fb_title": { th: "Feedback & Suggestions", en: "Feedback & Suggestions" },
    "fb_desc": { th: "เรามุ่งหวังที่จะปรับแต่งพรอพท์และโครงสร้างแอปพลิเคชันให้พนักงานทุกคนมีชีวิตในสเปซออฟฟิศที่ดีขึ้น ส่งข้อคิดเห็นของคุณโดยระบุรายละเอียดด้านล่างนี้", en: "Help us improve SABA PROMPT. Send your comments and feature ideas below." },
    "btn_fb_submit": { th: "ส่งความคิดเห็นเชิงสถาปัตยกรรม", en: "Submit Architect Feedback" },
    "fb_success_title": { th: "บันทึกข้อมูลเรียบร้อย", en: "Feedback Saved Successfully" },
    "fb_success_desc": { th: "ความคิดเห็นได้รับการบันทึกแล้ว ข้อมูลจะถูกเชื่อมต่อในคลังฐานระบบ SABA Prompt เพื่ออัปเกรดความเจ๋งในเวอร์ชันถัดไป", en: "Thank you! Your feedback has been saved and will help us grow." },
    "gdrive_title": { th: "Google Drive — เอกสารล่าสุด", en: "Google Drive — Recent Files" },
    "gdrive_cancel": { th: "ยกเลิก", en: "Cancel" },
    "cookie_text": { th: "เราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพในการใช้งานและเก็บข้อมูลเซสชันของคุณตามกฎหมาย PDPA <button class='underline text-brand-orange bg-transparent border-none' onclick='openPrivacyModal()'>นโยบายความเป็นส่วนตัว</button> และ <button class='underline text-brand-orange bg-transparent border-none' onclick='openTermsModal()'>ข้อตกลงการใช้งาน</button>", en: "We use cookies to improve your experience and store session data. Read our <button class='underline text-brand-orange bg-transparent border-none' onclick='openPrivacyModal()'>Privacy Policy</button> and <button class='underline text-brand-orange bg-transparent border-none' onclick='openTermsModal()'>Terms of Service</button>" },
    "cookie_accept": { th: "ยอมรับทั้งหมด", en: "Accept All" },
    "btn_tour": { th: "คู่มือแนะนำด่วน", en: "Quick Tour" },
    "btn_upgrade": { th: "อัปเกรด Pro", en: "Upgrade Pro" },
    "pricing_title": { th: "ยกระดับบัญชี SABA PROMPT Premium", en: "Upgrade SABA PROMPT Premium" },
    "pricing_subtitle": { th: "ยกระดับการทำงานและการเจรจาสื่อสารเชิงจิตวิทยาด้วย AI ปลดล็อกฟีเจอร์จัดเต็มเพื่อพนักงานและองค์กรมืออาชีพ", en: "Take your workplace communication to the next level. Unlock premium features for individual professionals and enterprise teams." },
    "plan_free_name": { th: "แผนใช้งานฟรี (Free Plan)", en: "Free Plan" },
    "plan_free_desc": { th: "เริ่มต้นใช้งานสำหรับบุคคลทั่วไป", en: "Essential tools for individual workers" },
    "plan_free_feat1": { th: "ใช้งาน Prompt Compiler ได้ไม่จำกัด", en: "Unlimited Prompt Compilation" },
    "plan_free_feat2": { th: "ดราฟต์อีเมล AI พื้นฐาน 3 ครั้ง/วัน", en: "3 Mock AI Email drafts per day" },
    "plan_free_feat3": { th: "ต้องใช้ API Key ของตนเองในการเชื่อมต่อจริง", en: "Requires personal API keys for live AI connection" },
    "btn_plan_current": { th: "แผนปัจจุบันของคุณ", en: "Current Plan" },
    "plan_pro_badge": { th: "ยอดนิยม", en: "POPULAR" },
    "plan_pro_name": { th: "Pro Architect", en: "Pro Architect" },
    "plan_pro_desc": { th: "เพิ่มผลลัพธ์และสมาธิการสื่อสารขั้นเทพ", en: "Maximum output and communication edge" },
    "plan_pro_feat1": { th: "ใช้งาน AI ร่างคำสั่งเมลด่วนได้ไม่จำกัด", en: "Unlimited live AI email drafts" },
    "plan_pro_feat2": { th: "ไม่ต้องป้อน API Keys เอง (รันหลังบ้านทันที)", en: "No API Keys required (Runs on our secure proxy)" },
    "plan_pro_feat3": { th: "สลับเรียก Gemini Pro / GPT-4o ได้ฟรี", en: "Free access to Gemini Pro & GPT-4o models" },
    "plan_pro_feat4": { th: "วิเคราะห์รูปภาพและแนบไฟล์ได้ถึง 15MB", en: "Image analysis & large document parsing (up to 15MB)" },
    "btn_plan_upgrade": { th: "สมัครสมาชิก Pro", en: "Upgrade to Pro" },
    "plan_ent_name": { th: "ระดับองค์กร (Enterprise)", en: "Enterprise Space" },
    "plan_ent_desc": { th: "สำหรับหน่วยงานและองค์กรสากล", en: "For companies and professional agencies" },
    "plan_ent_feat1": { th: "ฟีเจอร์ Pro ทั้งหมดแก่ทุกคนในทีม", en: "All Pro features unlocked for all team members" },
    "plan_ent_feat2": { th: "แท็บแชร์เทมเพลตเฉพาะแผนกในองค์กร", en: "Shared workspace template libraries" },
    "plan_ent_feat3": { th: "ปรับแต่งโทนเสียงและคำเฉพาะของบริษัท", en: "Custom company tone of voice & terminology" },
    "plan_ent_feat4": { th: "การันตี Uptime 99.9% พร้อม Dedicated Support", en: "99.9% Uptime SLA and dedicated account support" },
    "btn_plan_contact": { th: "ติดต่อฝ่ายขาย", en: "Contact Sales" },
    "vault_tag": { th: "แพ็กเกจพรีเมียม", en: "PREMIUM BUNDLE" },
    "vault_title": { th: "SABA Prompt Notion Vault (คลังพรอพท์ 100+ สถานการณ์)", en: "SABA Prompt Notion Vault (100+ Scenarios)" },
    "vault_desc": { th: "คลังพรอพท์เจรจาในชีวิตจริงของออฟฟิศ รวบรวมทางออกครอบคลุมทุกวิกฤตอารมณ์และจิตวิทยาการสื่อสาร (เช่น เขียนเมลทวงหนี้แบบผู้ดี, เมลยอมรับผิดแบบชนะใจ, เมลขอขึ้นเงินเดือนเชิงยุทธศาสตร์) โคลนไปใช้บน Notion ได้ทันที", en: "The ultimate database of real-world workplace email prompts. Solve conflicts, request promotions, handle terminations gracefully. Duplicate directly to Notion." },
    "btn_vault": { th: "รับสิทธิ์เข้าคลัง Notion Vault (290.-)", en: "Get Notion Prompt Vault (290 THB)" },
    "tour_modal_title": { th: "คู่มือการแนะนำด่วน SABA PROMPT", en: "SABA PROMPT Quick Guide" },
    "tour_s1_title": { th: "1. เลือกประเภทการ์ดความสัมพันธ์", en: "1. Select Relationship Style" },
    "tour_s1_desc": { th: "เริ่มต้นโดยเลือกหมวดหมู่ที่เหมาะสมกับการสื่อสารในหน้านั้นของคุณ (เช่น The Closer เมื่อจะปิดการขายหรือตกลงดีล, Tactical Vacation เพื่อขอหยุดงานโดยรักษาความสัมพันธ์กับหัวหน้า, หรือ The Diplomat เพื่อเชื่อมสัมพันธ์สยบดราม่า)", en: "Start by picking the style that fits your scenario: The Closer for sales & business deals, Tactical Vacation for leaving requests, or The Diplomat for handling sensitive workplace drama." },
    "tour_s2_title": { th: "2. กำหนดตัวแปรและข้อมูลผู้ติดต่อ", en: "2. Define Contact Variables" },
    "tour_s2_desc": { th: "ระบุตัวแปรที่เกี่ยวข้องลงในกล่องข้อความ เช่น บุคลิกของผู้รับสาร (เช่น หัวหน้าสุดโหด, ลูกค้ารายใหญ่) และระบุชื่อของคุณ หรือนำเข้าไฟล์เอกสาร PDF/DOCX เพื่อให้ AI ใช้อ้างอิงบริบทของหัวเรื่องได้อย่างเหมาะสม", en: "Fill in who the email goes to (e.g. micromanaging boss, enterprise client) and your sender name. Upload support PDFs or CSVs so the AI gains context." },
    "tour_s3_title": { th: "3. ป้อนเรื่องราว (วางรูปภาพได้) & ปรับโทน", en: "3. Input Context (Images supported) & Tone" },
    "tour_s3_desc": { th: "เขียนความต้องการดิบๆ ของคุณลงไป โดยคุณสามารถคัดลอกไฟล์รูปภาพหรือหน้าจอแคปเจอร์มาวางแทรกพร้อมข้อความได้โดยตรง จากนั้นเลือกน้ำเสียงระดับความเจรจา (EQ Tone) ที่เหมาะกับอารมณ์ที่อยากนำเสนอ", en: "Type your raw story or bullet points. You can copy & paste images (e.g. screenshots) directly alongside your text! Then, choose the EQ communication tone." },
    "tour_s4_title": { th: "4. กดรับผลลัพธ์พรอพท์และแบบร่างอีเมล AI", en: "4. Generate Prompt & AI Draft Output" },
    "tour_s4_desc": { th: "กดปุ่ม สร้างพรอพท์และร่างอีเมลด้วย AI แผงควบคุมเทอร์มินอลจะแสดงผลลัพธ์: แท็บ Prompt Output สำหรับนำโค้ดไปคุยต่อกับ AI ข้างนอก หรือแท็บ Simulated Chat เพื่อดูแบบร่างอีเมลสำเร็จรูปพร้อมส่งด่วน!", en: "Click Generate Prompt & AI Draft. SABA PROMPT analyzes the psychology and yields two views: Prompt Output (for copying to external AIs) or Simulated Chat (for viewing your complete generated email instantly)." }
};

let currentLang = 'th';
let currentUser = null;
let currentSelectedCategory = 'customer'; 
let selectedTone = 'สุภาพ อ่อนน้อม';
let uploadedFile = null; 
let isKeyVisible = false;
let currentTourStep = 1;
const totalTourSteps = 4;

function escapeHtmlForDisplay(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function toggleLanguage() {
    const newLang = currentLang === 'th' ? 'en' : 'th';
    setLanguage(newLang);
    showToast(
        newLang === 'en' ? "Language Changed" : "เปลี่ยนภาษาเสร็จสิ้น",
        newLang === 'en' ? "System localized to English" : "ระบบเปลี่ยนข้อความเป็นภาษาไทยแล้วครับ",
        "success"
    );
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('saba_lang', lang);
    document.documentElement.lang = lang;
    
    // Update Switch buttons labels
    const btnTexts = document.querySelectorAll('.nav-lang-btn-text, .auth-lang-btn-text');
    btnTexts.forEach(el => el.innerText = lang === 'th' ? 'EN' : 'TH');

    // Apply data-i18n replacements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nDict[key] && i18nDict[key][lang]) {
            el.innerHTML = i18nDict[key][lang];
        }
    });

    // Update placeholders
    document.getElementById('inputWho').placeholder = lang === 'th' ? "ตัวอย่าง: คุณรวิภา VP of Sales, พี่สมพงษ์ PM" : "e.g. VP of Sales, PM Lead, Project Lead";
    document.getElementById('inputSender').placeholder = lang === 'th' ? "ตัวอย่าง: สมชาย, นรินทร์" : "e.g. John, Sarah";
    
    const detailInput = document.getElementById('inputDetail');
    if (detailInput) {
        const thPlaceholder = "ระบุเรื่องราวหรือโจทย์งานแบบดิบๆ (สามารถ Copy ข้อความและรูปภาพมาวางได้เลย) เช่น: จะขอลาหยุดไปพักผ่อนต่างประเทศ 5 วัน...";
        const enPlaceholder = "Enter raw context (You can copy & paste text and images here), e.g. Requesting 5-day vacation...";
        if (detailInput.tagName.toLowerCase() === 'textarea') {
            detailInput.placeholder = lang === 'th' ? thPlaceholder : enPlaceholder;
        } else {
            detailInput.setAttribute('data-placeholder', lang === 'th' ? thPlaceholder : enPlaceholder);
        }
    }

    document.getElementById('feedback-text').placeholder = lang === 'th' 
        ? "ระบุสิ่งที่อยากให้ปรับปรุง ฟีเจอร์ที่อยากได้เพิ่ม หรือผลลัพธ์การใช้งานจริง..." 
        : "Describe improvements, request features or report feedback...";

    // Toggle static language pages views
    const blocks = ['view-seo', 'view-framework', 'view-architect', 'privacy-content', 'terms-content'];
    blocks.forEach(b => {
        const thEl = document.getElementById(`${b}-th`);
        const enEl = document.getElementById(`${b}-en`);
        if (thEl && enEl) {
            if (lang === 'th') {
                thEl.classList.remove('hidden');
                enEl.classList.add('hidden');
            } else {
                thEl.classList.add('hidden');
                enEl.classList.remove('hidden');
            }
        }
    });

    // If prompt was already compiled, regenerate prompt with the new language text
    const inputWho = document.getElementById('inputWho').value.trim();
    const inputSender = document.getElementById('inputSender').value.trim() || "[ชื่อของคุณ]";
    
    const detailInputEl = document.getElementById('inputDetail');
    let inputDetail = "";
    let hasImages = false;
    
    if (detailInputEl) {
        if (detailInputEl.tagName.toLowerCase() === 'textarea') {
            inputDetail = detailInputEl.value.trim();
        } else {
            inputDetail = detailInputEl.innerText.trim();
            hasImages = detailInputEl.querySelectorAll('img').length > 0;
        }
    }
    
    if (inputWho && (inputDetail || hasImages) && document.getElementById('compiler-placeholder').classList.contains('hidden')) {
        generateTargetPrompt(inputWho, inputDetail, inputSender, hasImages);
    }
}

// DOM Initialization
window.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Persistent authentication session check
    const savedSession = localStorage.getItem('saba_session_user');
    if (savedSession) {
        currentUser = savedSession;
        showDashboard();
    }

    // Cookie consent check
    const consent = localStorage.getItem('saba_cookie_consent');
    if (!consent) {
        document.getElementById('cookie-consent-banner').classList.remove('hidden');
    }

    // Setup language
    const savedLang = localStorage.getItem('saba_lang') || 'th';
    setLanguage(savedLang);

    // Load API settings
    loadApiSettings();
    
    // Characters counter
    const detailInput = document.getElementById('inputDetail');
    detailInput.addEventListener('input', (e) => {
        const textLength = e.target.innerText ? e.target.innerText.replace(/\n/g, '').length : (e.target.value ? e.target.value.length : 0);
        document.getElementById('charCounter').innerText = `${textLength} อักษร`;
    });
    
    // Tripbox support card dismiss check
    const tripboxDismissed = sessionStorage.getItem('saba_tripbox_dismissed');
    if (tripboxDismissed === 'true') {
        document.getElementById('tripbox-support-card').classList.add('hidden');
    }

    setupDragAndDrop();

    // Clipboard Paste Listener for contenteditable input Detail
    detailInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || window.clipboardData;
        
        // Look for image files in clipboard
        let hasImage = false;
        if (clipboardData.items) {
            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i];
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.alt = "Pasted image";
                        detailInput.appendChild(img);
                        showToast("แนบรูปภาพแล้ว", "ตรวจพบการวางรูปภาพจากคลิปบอร์ดและแทรกลงในกล่องข้อความเรียบร้อย", "success");
                        SabaAnalytics.trackEvent("image_pasted", {});
                    };
                    reader.readAsDataURL(file);
                    hasImage = true;
                }
            }
        }
        
        // Extract and insert plain text
        const text = clipboardData.getData('text/plain');
        if (text) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(text));
            // Trigger character counter
            const textLength = detailInput.innerText.replace(/\n/g, '').length;
            document.getElementById('charCounter').innerText = `${textLength} อักษร`;
        }
    });
});

// Setup Drag & Drop File Upload
function setupDragAndDrop() {
    const dropZone = document.getElementById('drag-drop-zone');
    const fileInput = document.getElementById('doc-file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processLocalFile(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        if (e.dataTransfer.files.length > 0) {
            processLocalFile(e.dataTransfer.files[0]);
        }
    });
}

// Upload local PC files
function processLocalFile(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    let mockText = `เอกสารสำคัญจากการอัปโหลดในเครื่องเพื่อใช้เสนอยุทธศาสตร์: ${file.name} ข้อมูลประกอบการอ้างอิงและประสานประสิทธิภาพตามนโยบายบริษัท`;
    
    uploadedFile = {
        name: file.name,
        size: `${sizeInMB} MB`,
        type: file.name.split('.').pop().toLowerCase(),
        mockContent: mockText
    };

    updateFileStatusUI();
    showToast("อัปโหลดไฟล์สำเร็จ", `นำเข้าเอกสาร ${file.name} จาก PC เรียบร้อยแล้วครับ`, "success");
    SabaAnalytics.trackEvent("file_uploaded_pc", { fileName: file.name, fileSize: sizeInMB });
}

function openGoogleDriveModal() {
    document.getElementById('gdrive-modal').classList.remove('hidden');
}

function closeGoogleDriveModal() {
    document.getElementById('gdrive-modal').classList.add('hidden');
}

function selectGoogleDriveFile(fileName, fileSize, fileType, fileInsight) {
    uploadedFile = {
        name: fileName,
        size: fileSize,
        type: fileType,
        mockContent: fileInsight
    };

    updateFileStatusUI();
    closeGoogleDriveModal();
    showToast("นำเข้าสำเร็จ", `ดึงเอกสาร ${fileName} จาก Google Drive เรียบร้อยแล้วครับ`, "success");
    SabaAnalytics.trackEvent("file_uploaded_gdrive", { fileName: fileName });
}

function clearUploadedFile() {
    uploadedFile = null;
    document.getElementById('doc-file-input').value = "";
    document.getElementById('file-status-container').classList.add('hidden');
    showToast("ลบไฟล์สำเร็จ", "เคลียร์เอกสารแนบออกจาก Workspace แล้วครับ", "info");
}

function updateFileStatusUI() {
    if (!uploadedFile) return;
    const container = document.getElementById('file-status-container');
    const nameDisp = document.getElementById('file-name-display');
    const sizeDisp = document.getElementById('file-size-display');
    const iconWrapper = document.getElementById('file-icon-wrapper');

    nameDisp.innerText = uploadedFile.name;
    sizeDisp.innerText = `${uploadedFile.size} • วิเคราะห์เนื้อหาพร้อมใช้`;

    let iconMarkup = '<i data-lucide="file-text" class="w-4 h-4"></i>';
    if (uploadedFile.type === 'pdf') {
        iconWrapper.className = "p-2 bg-rose-500/15 text-rose-500 rounded-lg";
        iconMarkup = '<i data-lucide="file-text" class="w-4 h-4"></i>';
    } else if (uploadedFile.type === 'xlsx' || uploadedFile.type === 'csv' || uploadedFile.type === 'spreadsheet') {
        iconWrapper.className = "p-2 bg-emerald-500/15 text-emerald-500 rounded-lg";
        iconMarkup = '<i data-lucide="file-spreadsheet" class="w-4 h-4"></i>';
    } else {
        iconWrapper.className = "p-2 bg-blue-500/15 text-blue-500 rounded-lg";
        iconMarkup = '<i data-lucide="file-text" class="w-4 h-4"></i>';
    }

    iconWrapper.innerHTML = iconMarkup;
    container.classList.remove('hidden');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// --- 3. MOCK AUTH SYSTEM (WITH PERSISTENCE & VALIDATION) ---
function handleGuestLogin() {
    const guestId = Math.floor(1000 + Math.random() * 9000);
    currentUser = `Guest_User_${guestId}`;
    localStorage.setItem('saba_session_user', currentUser);
    showDashboard();
    SabaAnalytics.trackEvent("login_guest", { userId: currentUser });
}

function switchLoginTab(type) {
    const btnOtp = document.getElementById('tab-otp');
    const btnFed = document.getElementById('tab-fed');
    const panelOtp = document.getElementById('login-otp-panel');
    const panelFed = document.getElementById('login-federated-panel');
    
    if (type === 'otp') {
        btnOtp.className = "py-2 text-xs font-semibold rounded-md bg-white border border-slate-200/80 text-brand-orange shadow-sm transition-all duration-300";
        btnOtp.setAttribute('aria-selected', 'true');
        btnFed.className = "py-2 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-900 transition-all duration-300";
        btnFed.setAttribute('aria-selected', 'false');
        panelOtp.classList.remove('hidden');
        panelFed.classList.add('hidden');
    } else {
        btnFed.className = "py-2 text-xs font-semibold rounded-md bg-white border border-slate-200/80 text-brand-orange shadow-sm transition-all duration-300";
        btnFed.setAttribute('aria-selected', 'true');
        btnOtp.className = "py-2 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-900 transition-all duration-300";
        btnOtp.setAttribute('aria-selected', 'false');
        panelFed.classList.remove('hidden');
        panelOtp.classList.add('hidden');
    }
    SabaAnalytics.trackEvent("auth_tab_switched", { tab: type });
}

function handleOTPRequest() {
    const phoneVal = document.getElementById('login-phone').value.trim();
    const actionBtn = document.getElementById('btn-otp-action');
    const confirmContainer = document.getElementById('otp-confirm-container');
    const otpCodeField = document.getElementById('login-otp-code');
    
    if (!phoneVal || phoneVal.length < 9) {
        showToast("แจ้งเตือน", "โปรดกรอกเบอร์โทรศัพท์มือถือให้ถูกต้องครับ", "warning");
        return;
    }

    if (confirmContainer.classList.contains('hidden')) {
        actionBtn.disabled = true;
        actionBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>กำลังส่ง OTP...</span>`;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            actionBtn.disabled = false;
            actionBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i><span data-i18n="btn_otp_verify">ยืนยันเข้าสู่ระบบ</span>`;
            confirmContainer.classList.remove('hidden');
            confirmContainer.classList.add('animate-fade-in');
            showToast("OTP ส่งสำเร็จ", "รหัสผ่านจำลองส่งไปยังเบอร์โทรแล้ว (รหัสทดสอบเพื่อรันระบบคือ: 1234)", "success");
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            const lang = localStorage.getItem('saba_lang') || 'th';
            if (lang === 'en') {
                actionBtn.innerText = "Verify & Sign In";
            }
        }, 1200);
    } else {
        const codeVal = otpCodeField.value.trim();
        if (codeVal === '1234') {
            currentUser = `+66 ${phoneVal.substring(1, 4)}***${phoneVal.substring(7)}`;
            localStorage.setItem('saba_session_user', currentUser);
            showDashboard();
            SabaAnalytics.trackEvent("login_otp_success", { phone: phoneVal });
        } else {
            showToast("รหัสไม่ถูกต้อง", "โปรดระบุรหัส OTP จำลองให้ถูกต้อง (พิมพ์ 1234 เพื่อรันตัวทดสอบระบบ)", "error");
        }
    }
}

function simulateThirdPartyLogin(provider) {
    showToast("กำลังประมวลผล", `กำลังเชื่อมโยงบัญชีและยืนยันตัวตนกับระบบ ${provider}...`, "info");
    setTimeout(() => {
        currentUser = `${provider} User`;
        localStorage.setItem('saba_session_user', currentUser);
        showDashboard();
        SabaAnalytics.trackEvent("login_oauth_success", { provider: provider });
    }, 1000);
}

function showDashboard() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-workspace').classList.remove('hidden');
    document.getElementById('session-user-badge').innerText = currentUser;
    
    const isVip = localStorage.getItem('saba_session_vip');
    const badge = document.querySelector('[data-i18n="vip_badge"]');
    if (badge && isVip === 'true') {
        const lang = localStorage.getItem('saba_lang') || 'th';
        badge.innerText = lang === 'en' ? "PRO ARCHITECT" : "PRO ACTIVE";
        badge.className = "text-[10px] uppercase tracking-wider font-black text-black px-1.5 py-0.2 bg-amber-400 rounded-full border border-amber-400";
    } else if (badge) {
        badge.innerText = "VIP ACTIVE";
        badge.className = "text-[10px] uppercase tracking-wider font-extrabold text-brand-orange px-1.5 py-0.2 bg-brand-orange/10 rounded-full border border-brand-orange/20";
    }

    showToast(
        localStorage.getItem('saba_lang') === 'en' ? "Welcome Back" : "ต้อนรับกลับเข้าสู่ระบบ",
        localStorage.getItem('saba_lang') === 'en' ? `Hello ${currentUser}! Saba Workspace is ready.` : `สวัสดีผู้ใช้ ${currentUser}! ระบบพร้อมรังสรรค์คำสั่งแล้วครับ`,
        "success"
    );

    const tourCompleted = localStorage.getItem('saba_tour_completed');
    if (!tourCompleted) {
        setTimeout(() => {
            startOnboardingTour();
        }, 1200);
    }
}

function handleSignOut() {
    currentUser = null;
    localStorage.removeItem('saba_session_user');
    document.getElementById('main-workspace').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    
    document.getElementById('otp-confirm-container').classList.add('hidden');
    document.getElementById('login-phone').value = "";
    document.getElementById('login-otp-code').value = "";
    document.getElementById('btn-otp-action').innerHTML = `<i data-lucide="smartphone" class="w-4 h-4"></i><span data-i18n="btn_otp_init">รับรหัส OTP</span>`;
    
    const lang = localStorage.getItem('saba_lang') || 'th';
    setLanguage(lang);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    showToast(
        lang === 'en' ? "Signed Out" : "ออกจากระบบ",
        lang === 'en' ? "Your session was securely cleared from local storage." : "บัญชีจำลองของคุณออกจากการใช้งานแล้ว ปลอดภัยตาม Layer 1 Framework",
        "info"
    );
    SabaAnalytics.trackEvent("logout", {});
}

// --- 4. NAVIGATION TABS ---
function navigateTab(tabName) {
    const tabs = ['workspace', 'seo', 'framework', 'architect'];
    tabs.forEach(t => {
        document.getElementById(`view-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).className = "px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/50 transition-all";
        document.getElementById(`nav-${t}`).setAttribute('aria-selected', 'false');
    });

    document.getElementById(`view-${tabName}`).classList.remove('hidden');
    document.getElementById(`nav-${tabName}`).className = "px-3.5 py-2 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-900 shadow-sm transition-all";
    document.getElementById(`nav-${tabName}`).setAttribute('aria-selected', 'true');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    SabaAnalytics.trackEvent("tab_navigation", { target: tabName });
}

function selectCategory(cat) {
    currentSelectedCategory = cat; 
    const categories = ['customer', 'leave', 'cowork'];
    
    categories.forEach(c => {
        const card = document.getElementById(`card-${c}`);
        if (!card) return;
        
        if (c === cat) {
            card.classList.remove('border-brand-border', 'border');
            card.classList.add('border-brand-orange', 'border-2', 'shadow-lg', 'shadow-orange-500/10');
            card.setAttribute('aria-selected', 'true');
        } else {
            card.classList.remove('border-brand-orange', 'border-2', 'shadow-lg', 'shadow-orange-500/10');
            card.classList.add('border-brand-border', 'border');
            card.setAttribute('aria-selected', 'false');
        }
    });
    SabaAnalytics.trackEvent("category_selected", { category: cat });
}

function selectTone(tone, element) {
    selectedTone = tone;
    const buttons = document.querySelectorAll('.tone-btn');
    buttons.forEach(btn => {
        btn.className = "tone-btn text-xs font-semibold py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-955 transition-all";
    });
    element.className = "tone-btn text-xs font-semibold py-2.5 px-2 rounded-xl bg-white border-2 border-brand-orange text-brand-orange transition-all shadow-sm";
    SabaAnalytics.trackEvent("tone_selected", { tone: tone });
}

// Preset Scenarios
const presetScenarios = {
    customer: {
        who: "คุณรวิศาล Head of Operations ของแบรนด์สปอนเซอร์รายใหญ่",
        sender: "สมศักดิ์ นำชัย",
        detail: "อยากส่งเรื่องแจ้งขอขยับวันเลื่อนนัดส่งมอบผลงานแคมเปญการตลาดยุค AI ออกไปอีก 3 วันเนื่องจากทีมพัฒนากราฟิกต้องการเรนเดอร์คุณภาพสูงระดับพรีเมียม จะชดเชยการอัปเกรดโมเดลตัวอย่างให้ลูกค้าฟรี 1 ชุด"
    },
    leave: {
        who: "พี่อนุกูล Managing Director ผู้เข้มงวดและกังวลงานขาดมือ",
        sender: "ณัฐพล",
        detail: "ต้องการลาพักผ่อนต่างประเทศ 5 วันทำการช่วงกลางเดือนพฤษภาคม ตั๋วเครื่องบินจ่ายเรียบร้อย งานปัจจุบันเคลียร์ล่วงหน้าส่งมอบครบ และฝากให้คุณเจมส์ทีมอาวุโสสแตนด์บายตรวจรับเรื่องสำคัญฉุกเฉินเรียบร้อย"
    },
    cowork: {
        who: "ทีมผู้ดูแลแคมเปญฝ่ายการเงินที่ค่อนข้างเคร่งครัดเอกสาร",
        sender: "วิไลวรรณ",
        detail: "ต้องการเอกสารใบกำกับงวดงานชุดสุดท้ายเพื่อให้เรานำไปใช้ยืนยันการตั้งงบโครงการดิจิทัลปีหน้า ตัวงบนี้จำเป็นต่อทั้งสองฝ่ายเพื่อได้งบเพิ่มในการจัดซื้อซอฟต์แวร์แสนล้ำในปีถัดไปร่วมกัน"
    }
};

const presetScenariosEn = {
    customer: {
        who: "Mr. Rawisarn, Head of Operations of Sponsor Brand",
        sender: "Somsak Namchai",
        detail: "Would like to request postponing AI campaign rendering outputs by 3 days for premium rendering. Will compensate sponsor by upgrading them to 1 free analytics slice."
    },
    leave: {
        who: "Mr. Anukul, Managing Director (strict leader)",
        sender: "Nattapol",
        detail: "Need to request a 5-day vacation leave in mid-May. Flights booked. Handover plans are set and James (Senior PM) is covering for urgent projects."
    },
    cowork: {
        who: "Finance Department Campaign Team",
        sender: "Wilaiwan",
        detail: "Require the final campaign invoice to secure next fiscal year's joint software upgrade funding which benefits both departments."
    }
};

function loadSuggestedScenario() {
    const presets = currentLang === 'th' ? presetScenarios : presetScenariosEn;
    const preset = presets[currentSelectedCategory];
    if (preset) {
        document.getElementById('inputWho').value = preset.who;
        document.getElementById('inputSender').value = preset.sender || "";
        
        const detailInput = document.getElementById('inputDetail');
        if (detailInput.tagName.toLowerCase() === 'textarea') {
            detailInput.value = preset.detail;
        } else {
            detailInput.innerText = preset.detail;
        }
        
        document.getElementById('charCounter').innerText = `${preset.detail.length} อักษร`;
        showToast(
            currentLang === 'en' ? "Scenario Loaded" : "โหลดเคสตัวอย่าง", 
            currentLang === 'en' ? `Loaded mock variables for ${currentSelectedCategory} category.` : `จำลองการกรอกข้อมูลของเคส ${currentSelectedCategory} สำเร็จแล้วครับ`, 
            "success"
        );
        SabaAnalytics.trackEvent("preset_scenario_loaded", { category: currentSelectedCategory });
    }
}

// --- 5. MEGA PROMPT COMPILER ---
function compileMegaPrompt() {
    const inputWho = document.getElementById('inputWho').value.trim();
    const inputSender = document.getElementById('inputSender').value.trim() || "[ชื่อของคุณ]";
    
    const detailInput = document.getElementById('inputDetail');
    let inputDetail = "";
    let hasImages = false;
    
    if (detailInput.tagName.toLowerCase() === 'textarea') {
        inputDetail = detailInput.value.trim();
    } else {
        inputDetail = detailInput.innerText.trim();
        hasImages = detailInput.querySelectorAll('img').length > 0;
    }

    if (!inputWho || (!inputDetail && !hasImages)) {
        showToast(
            currentLang === 'en' ? "Form Incomplete" : "กรอกข้อมูลไม่ครบถ้วน", 
            currentLang === 'en' ? "Please input recipient name and raw details context (or paste image)." : "โปรดระบุชื่อผู้รับ / ตำแหน่ง และรายละเอียดโจทย์งานที่พนักงานต้องการจัดการ (หรือวางรูปภาพ)", 
            "warning"
        );
        return;
    }

    const compileBtn = document.getElementById('btn-compile');
    compileBtn.disabled = true;
    compileBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin text-black"></i><span class="text-black">COMPILING MEGA PROMPT...</span>`;
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(async () => {
        compileBtn.disabled = false;
        compileBtn.innerHTML = `
            <div class="relative z-10 flex items-center justify-center gap-2 text-black">
                <i data-lucide="zap" class="w-4 h-4 fill-black"></i>
                <span data-i18n="btn_compile">COMPILE MEGA PROMPT</span>
            </div>`;
        
        // Reapply language translations to button text
        const lang = localStorage.getItem('saba_lang') || 'th';
        const spanText = compileBtn.querySelector('[data-i18n="btn_compile"]');
        if (spanText && i18nDict["btn_compile"] && i18nDict["btn_compile"][lang]) {
            spanText.innerHTML = i18nDict["btn_compile"][lang];
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        generateTargetPrompt(inputWho, inputDetail, inputSender, hasImages);
        
        document.getElementById('compiler-placeholder').classList.add('hidden');
        document.getElementById('simulate-placeholder').classList.add('hidden');

        showToast(
            currentLang === 'en' ? "Success!" : "สำเร็จ!", 
            currentLang === 'en' ? "System prompt compiled and psychology ingestion complete!" : "วิเคราะห์จิตวิทยาและประกอบร่างคำสั่ง Mega Prompt เรียบร้อยแล้ว!", 
            "success"
        );

        const matrixElement = document.getElementById('prompt-compiler-matrix');
        if (matrixElement) {
            matrixElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        SabaAnalytics.trackEvent("compile_prompt", { category: currentSelectedCategory, tone: selectedTone });

        // Call Secure API Gateway
        const apiKey = localStorage.getItem('saba_api_key');
        await queryRealAI(apiKey, inputWho, inputDetail, inputSender);
    }, 1000);
}

// Real API call logic via Secure Backend Proxy
async function queryRealAI(apiKey, who, detail, sender) {
    const provider = localStorage.getItem('saba_api_provider') || 'gemini';
    const model = localStorage.getItem('saba_api_model');
    const outputContainer = document.getElementById('simulated-draft-output');
    
    outputContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 space-y-3 font-mono text-xs text-brand-orange">
            <i data-lucide="loader" class="w-6 h-6 animate-spin"></i>
            <div class="animate-pulse font-bold">CONNECTING TO SECURE API GATEWAY...</div>
            <div class="text-zinc-500 font-normal">Analyzing EQ parameters using ${model}...</div>
        </div>
    `;
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    switchTerminalTab('simulate');

    // Extract base64 images from contenteditable `#inputDetail`
    const images = [];
    const imgElements = document.querySelectorAll('#inputDetail img');
    imgElements.forEach(img => {
        const src = img.src;
        if (src.startsWith('data:image/')) {
            const parts = src.split(',');
            const mime = parts[0].match(/:(.*?);/)[1];
            const data = parts[1];
            images.push({ mimeType: mime, data: data });
        }
    });

    try {
        let prompt = document.getElementById('compiled-prompt-output').innerText;
        // Strip highlighting HTML tags
        prompt = prompt.replace(/<span class="var-highlight">/g, "").replace(/<\/span>/g, "");
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-api-key': apiKey || ''
            },
            body: JSON.stringify({
                provider,
                model,
                prompt,
                images
            })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Gateway returned an error response.');
        }
        
        outputContainer.innerText = data.text;
        showToast(
            currentLang === 'en' ? "Email Generated!" : "ประมวลผลสำเร็จ!", 
            currentLang === 'en' ? `Live draft completed via ${model} secure gateway.` : `ร่างอีเมลผ่านเกตเวย์โมเดล ${model} เสร็จสิ้น!`, 
            "success"
        );
        SabaAnalytics.trackEvent("api_call_success", { provider, model });
    } catch (err) {
        console.error("AI API Call failed: ", err);
        outputContainer.innerHTML = `
            <div class="border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-xl p-4 text-xs font-mono space-y-2">
                <div class="font-bold flex items-center gap-1.5"><i data-lucide="alert-circle" class="w-4 h-4"></i> GATEWAY CONNECTION FAILED</div>
                <p>${err.message}</p>
                <p class="text-zinc-500 text-[10px] mt-2 leading-relaxed">โปรดตรวจสอบว่าเปิดบริการ Backend Serverless Node หรือได้เพิ่ม API Keys ของตัวเองในเมนูกดรูปฟันเฟืองด้านบนหรือยังครับ</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        showToast(
            currentLang === 'en' ? "API Proxy Gateway Error" : "เชื่อมต่อเกตเวย์ล้มเหลว", 
            err.message, 
            "error"
        );
        SabaAnalytics.trackEvent("api_call_error", { error: err.message });
    }
}

// Mega Prompt Generation logic
function generateTargetPrompt(who, detail, sender, hasImages = false) {
    let catHeader = "";
    let psychologyLayer = "";
    let generatedEmailMock = "";

    let fileSystemPrompt = "";
    let docReferenceText = "";
    
    let imageNoteTh = hasImages ? "\n• [มีภาพประกอบแนบมาด้วยในโจทย์]: โปรดพิจารณารายละเอียดจากภาพหากมีการวิเคราะห์ด้วย Vision AI" : "";
    let imageNoteEn = hasImages ? "\n• [Image Attached in Context]: Please consider visual details if analyzing via Vision AI." : "";
    
    if (currentLang === 'th') {
        if (uploadedFile) {
            fileSystemPrompt = `\n[ข้อมูลวิเคราะห์เอกสารแนบ - ${uploadedFile.name}]:\n• สาระสำคัญในเอกสาร: ${uploadedFile.mockContent}\n• ข้อกำหนด: ร่างอีเมลให้เชื่อมโยงและสอดคล้องกับสาระสำคัญของเอกสารนี้อย่างแนบเนียนและเป็นมืออาชีพ`;
            docReferenceText = ` ตามเอกสารที่ผมได้แนบมาพร้อมกันนี้ (${uploadedFile.name}) ซึ่งได้ระบุประเด็นและรายละเอียดหลักไว้อย่างครบถ้วนแล้วครับ`;
        }

        if (currentSelectedCategory === 'customer') {
            catHeader = "THE CLOSER: VALUE-FIRST INFLUENCE FRAMEWORK";
            psychologyLayer = "• ใช้จิตวิทยาแบบ Win-Win Selling ค้นหาคุณค่าที่ส่งมอบให้ผู้รับ\n• สร้างอารมณ์ความเชื่อมั่นแต่คงไว้ซึ่งความเคารพในอำนาจหน้าที่อย่างเหมาะสม";
            generatedEmailMock = `เรียน ${who},\n\nผมใคร่ขออนุญาตนำเรียนอัปเดตความคืบหน้าของโครงการแคมเปญการตลาดยุค AI ครับ${docReferenceText}\n\nจากการพิจารณาของทีมวิศวกรรมการผลิตร่วมกับนักออกแบบระดับสูง เพื่อส่งมอบผลลัพธ์คุณภาพสูงสุดระดับ Premium-Aesthetic ในโครงการนี้ ทางเราประสงค์ขอขยับเวลาจัดส่งต้นแบบรอบสุดท้ายเพิ่ม 3 วันทำการ ซึ่งเวลาที่เพิ่มนี้จะทำให้เราสามารถดำเนินการเรนเดอร์โมเดลอัจฉริยะได้อย่างละเอียดประณีต\n\nทางทีมตระหนักถึงความสำคัญและเพื่อเป็นการตอบแทนความร่วมมืออันดียิ่งนี้ เราขอมอบสิทธิ์การอัปเกรดระบบโมเดลวิเคราะห์ตัวอย่างชุดฟรีเป็นของขวัญเพิ่มเติมทันทีครับ\n\nขอแสดงความนับถืออย่างสูง,\n${sender}`;
        } else if (currentSelectedCategory === 'leave') {
            catHeader = "THE TACTICAL VACATION: RISK-MITIGATION VACATION PARADIGM";
            psychologyLayer = "• ถอดจิตวิทยาลดความหวาดระแวงของผู้บริหารด้วย Handover Plan\n• เสนอแผนแก้ไขความเสี่ยงรอบรับงานฉุกเฉิน เพื่อขจัดปัญหาการปฏิเสธ";
            generatedEmailMock = `เรียน ${who},\n\nผมเขียนจดหมายฉบับนี้ขึ้นเพื่อขอรายงานและอนุมัติวันหยุดพักผ่อนล่วงหน้าในช่วงกลางเดือนพฤษภาคม เป็นเวลา 5 วันทำการครับ\n\nเพื่อยืนยันว่าการทำงานขององค์กรและแผนกจะดำเนินไปอย่างราบรื่นร้อยเปอร์เซ็นต์ ผมได้จัดทำและวางแผนการรักษาความปลอดภัยจัดการงานทั้งหมด ซึ่งสรุปข้อมูลรายละเอียดและแผนส่งต่องานไว้เรียบร้อยแล้ว${docReferenceText || ' (ตามแผนงานรายละเอียดที่เตรียมไว้นี้)'} ดังนี้:\n1. งานหลักทั้งหมดได้รับการส่งมอบล่วงหน้าเป็นที่เรียบร้อยในสัปดาห์นี้\n2. ผมประสานงานมอบหมายงานเร่งด่วนฉุกเฉินให้คุณเจมส์ (อาวุโส) คอยดูแลประสานเรื่องด่วนแทนอย่างเป็นระบบเรียบร้อยแล้ว\n\nผมจะคอยตอบกลับอีเมลเฉพาะเรื่องด่วนฉุกเฉินสำคัญสูงเป็นระยะๆ และเชื่อมั่นว่างานจะรันต่อไปได้โดยไม่มีติดขัดครับ\n\nด้วยความเคารพอย่างสูง,\n${sender}`;
        } else {
            catHeader = "THE DIPLOMAT: SILO-BREAKING COLLABORATIVE DIALOGUE";
            psychologyLayer = "• สลายกำแพงการขัดแย้งข้ามสายงาน (Inter-departmental Silos)\n• เจรจาด้วยการอ้างอิงเป้าหมายที่แชร์ร่วมกันและผลสัมฤทธิ์ปลายทาง";
            generatedEmailMock = `สวัสดีครับคุณผู้ช่วย ${who},\n\nทางเราได้รับการติดต่อและประทับใจความคืบหน้าโครงการล่าสุดอย่างยิ่งครับ\n\nในการนี้ ผมอยากจะประสานเพื่อขอส่งมอบและตรวจรับใบกำกับงวดงานชุดสุดท้ายสำหรับแคมเปญ${docReferenceText} เพื่อที่ฝ่ายการเงินของทางแบรนด์จะได้รับข้อมูลตัวนี้ไปดำเนินขั้นตอนอนุมัติงบกองกลางปีหน้าของทั้งสองฝ่ายร่วมกัน ซึ่งการตั้งงบประมาณนี้เป็นคีย์หลักที่จะทำให้เราได้รับการจัดสรรและอัปเกรดระบบจัดซื้อซอฟต์แวร์ระดับโลกเพื่อเพิ่มขีดความสามารถร่วมกันทั้งสองแผนกครับ\n\nหากท่านมีข้อสงสัยหรือต้องการให้ข้อมูลเพิ่มเติมด้านใดเพื่อความสะดวกรวดเร็วแจ้งกลับผมได้ทันทีครับ\n\nขอแสดงความนับถือ,\n${sender}`;
        }

        const safeWho = escapeHtmlForDisplay(who);
        const safeSender = escapeHtmlForDisplay(sender);
        const safeDetail = escapeHtmlForDisplay(detail);
        const safeTone = escapeHtmlForDisplay(selectedTone);

        const highlightWho = `<span class="var-highlight">${safeWho}</span>`;
        const highlightSender = `<span class="var-highlight">${safeSender}</span>`;
        const highlightDetail = `<span class="var-highlight">${safeDetail}${hasImages ? ' [🖼️ มีภาพแนบ]' : ''}</span>`;
        const highlightTone = `<span class="var-highlight">${safeTone}</span>`;

        let highlightFileBlock = "";
        if (uploadedFile) {
            highlightFileBlock = `\n• <span class="text-brand-orange font-bold">เอกสารแนบเชิงลึก:</span> <span class="var-highlight">${escapeHtmlForDisplay(uploadedFile.name)} (${escapeHtmlForDisplay(uploadedFile.size)})</span>`;
        }

        const terminalFormattedText = `/*
 * ==========================================
 * SYSTEM PROMPT: ${catHeader}
 * CORE TARGET AI: Gemini / ChatGPT / Claude
 * ==========================================
 */

คุณคือผู้เชี่ยวชาญการเจรจาระดับสูงสไตล์ INFJ-A ที่มี EQ ลึกซึ้งและสุภาพอ่อนน้อมที่สุด 
หน้าที่ของคุณคือช่วยฉันตอบข้อความหรือเขียนอีเมลติดต่อกับผู้มีส่วนเกี่ยวข้อง

[บริบทความต้องการสื่อสาร - วิธีเขียนอีเมล]:
• ชื่อผู้รับ / ตำแหน่ง: ${highlightWho}
• ชื่อผู้ส่ง (ชื่อของคุณ): ${highlightSender}
• สถานการณ์ดั้งเดิม: ${highlightDetail}
• โทนและน้ำเสียงหลักที่ต้องการ: ${highlightTone}${highlightFileBlock}${imageNoteTh}

[จิตวิทยาและกรอบยุทธศาสตร์ที่นำมาใช้ประมวลผล - SABA PROMPT]:
${psychologyLayer}
• ดึงระบบ Radical Empathy ช่วยตอบสนองจุดเจ็บปวดของผู้ร่วมงานและรักษาประโยชน์ขององค์กร${uploadedFile ? '\n• วางกรอบวิเคราะห์ตามเอกสารอ้างอิงที่แนบมาโดยไม่ละทิ้งความสุภาพระดับมืออาชีพ' : ''}

[กติกาการแสดงผลลัพธ์ ตัวช่วยเขียนอีเมล]:
1. เสนอร่างทางเลือกในการเขียนข้อความเจรจาภาษาไทยจำนวน 1 ฉบับอย่างเป็นทางการ
2. ห้ามใช้คำพูดเชิงรุกราน หรือสร้างความตื่นตระหนก (Anti-Aggressive Strategy)
3. ปิดท้ายด้วยประโยคแสดงความเคารพที่เหมาะสม ตามด้วยชื่อผู้ส่ง: ${highlightSender}
4. ร่างเนื้อหาให้อ่านเข้าใจง่าย มีความกระชับ มั่นใจ และน่ารักสมดั่งพนักงานยุคใหม่`;

        document.getElementById('compiled-prompt-output').innerHTML = terminalFormattedText;
        document.getElementById('simulated-draft-output').innerText = generatedEmailMock;
    } else {
        // English Mode Mega Prompt Compiling
        if (uploadedFile) {
            fileSystemPrompt = `\n[Reference Document Analysis - ${uploadedFile.name}]:\n• Key contents: ${uploadedFile.mockContent}\n• Rule: Incorporate these key details naturally and professionally into the draft email.`;
            docReferenceText = ` as detailed in the attached document (${uploadedFile.name}) which outlines the main scope and guidelines.`;
        }

        if (currentSelectedCategory === 'customer') {
            catHeader = "THE CLOSER: VALUE-FIRST INFLUENCE FRAMEWORK";
            psychologyLayer = "• Use Win-Win Selling psychology to highlight value delivered to the recipient.\n• Instill confidence while remaining highly respectful of authority and guidelines.";
            generatedEmailMock = `Dear ${who},\n\nI would like to update you on the progress of our AI marketing campaign project.${docReferenceText}\n\nTo deliver the highest aesthetic quality for this launch, our design team requires an additional 3 business days for final rendering. This extension ensures the results meet premium-tier standards.\n\nTo show our appreciation for your partnership, we are pleased to upgrade your account to include 1 free additional analytics model slice.\n\nSincerely,\n${sender}`;
        } else if (currentSelectedCategory === 'leave') {
            catHeader = "THE TACTICAL VACATION: RISK-MITIGATION VACATION PARADIGM";
            psychologyLayer = "• Alleviate stakeholder anxiety through a clear Handover Plan.\n• Proactively address project risks during absence to ensure zero rejection.";
            generatedEmailMock = `Dear ${who},\n\nI am writing to formally request a 5-day vacation leave starting mid-May.\n\nTo ensure all workflows remain uninterrupted, I have put a full risk-mitigation handover plan in place${docReferenceText || ''}:\n1. All core project deliverables for this week have been completed ahead of schedule.\n2. James (Senior PM) has been briefed and will act as my backup to handle any urgent queries.\n\nI will monitor high-priority emails occasionally and remain confident that the team is fully supported.\n\nBest regards,\n${sender}`;
        } else {
            catHeader = "THE DIPLOMAT: SILO-BREAKING COLLABORATIVE DIALOGUE";
            psychologyLayer = "• Break cross-departmental silos.\n• Align negotiation points with shared corporate goals and bottom-line growth.";
            generatedEmailMock = `Hi ${who},\n\nHope you are doing well.\n\nI am writing to request the final signed invoice for the digital campaign budget.${docReferenceText} This document is required by our finance department to lock in our joint digital tool upgrade budget for next fiscal year, which directly benefits both of our teams.\n\nPlease let me know if you need any additional files or clarifications.\n\nBest regards,\n${sender}`;
        }

        const safeWho = escapeHtmlForDisplay(who);
        const safeSender = escapeHtmlForDisplay(sender);
        const safeDetail = escapeHtmlForDisplay(detail);
        const safeTone = escapeHtmlForDisplay(selectedTone);

        const highlightWho = `<span class="var-highlight">${safeWho}</span>`;
        const highlightSender = `<span class="var-highlight">${safeSender}</span>`;
        const highlightDetail = `<span class="var-highlight">${safeDetail}${hasImages ? ' [🖼️ Image Attached]' : ''}</span>`;
        const highlightTone = `<span class="var-highlight">${safeTone}</span>`;

        let highlightFileBlock = "";
        if (uploadedFile) {
            highlightFileBlock = `\n• <span class="text-brand-orange font-bold">Attached Doc:</span> <span class="var-highlight">${escapeHtmlForDisplay(uploadedFile.name)} (${escapeHtmlForDisplay(uploadedFile.size)})</span>`;
        }

        const terminalFormattedText = `/*
 * ==========================================
 * SYSTEM PROMPT: ${catHeader}
 * CORE TARGET AI: Gemini / ChatGPT / Claude
 * ==========================================
 */

You are an expert negotiator with high emotional intelligence (INFJ-A style) and professional tone.
Your task is to draft a clean email based on the context and parameters provided below.

[COMMUNICATION CONTEXT]:
• Recipient / Position: ${highlightWho}
• Sender Name (Your Name): ${highlightSender}
• Raw Context Notes: ${highlightDetail}
• Target EQ Tone: ${highlightTone}${highlightFileBlock}${imageNoteEn}

[PSYCHOLOGY & FRAMEWORK APPLIED]:
${psychologyLayer}
• Apply Radical Empathy to address the fears/goals of the recipient while maintaining business objectives.${uploadedFile ? '\n• Incorporate the attached reference document insights while keeping the email professional.' : ''}

[OUTPUT FORMAT INSTRUCTIONS]:
1. Draft 1 formal business email in English.
2. Avoid passive-aggressive phrases or alarmist words (Anti-Aggressive Strategy).
3. Conclude with a warm, professional closing followed by the Sender Name: ${highlightSender}
4. Ensure the draft is concise, easy to read, and polite.`;

        document.getElementById('compiled-prompt-output').innerHTML = terminalFormattedText;
        document.getElementById('simulated-draft-output').innerText = generatedEmailMock;
    }
}

// --- 6. SWITCH TERMINAL PREVIEW TABS ---
function switchTerminalTab(tab) {
    const btnPrompt = document.getElementById('tab-term-prompt');
    const btnSim = document.getElementById('tab-term-sim');
    const panelPrompt = document.getElementById('terminal-prompt-panel');
    const panelSim = document.getElementById('terminal-simulate-panel');

    if (tab === 'prompt') {
        btnPrompt.className = "px-3 py-1.5 text-xs font-bold rounded-md bg-brand-bg text-brand-orange border border-brand-border/30 transition-all";
        btnPrompt.setAttribute('aria-selected', 'true');
        btnSim.className = "px-3 py-1.5 text-xs font-bold rounded-md text-brand-muted hover:text-white transition-all";
        btnSim.setAttribute('aria-selected', 'false');
        panelPrompt.classList.remove('hidden');
        panelSim.classList.add('hidden');
    } else {
        btnSim.className = "px-3 py-1.5 text-xs font-bold rounded-md bg-brand-bg text-brand-orange border border-brand-border/30 transition-all";
        btnSim.setAttribute('aria-selected', 'true');
        btnPrompt.className = "px-3 py-1.5 text-xs font-bold rounded-md text-brand-muted hover:text-white transition-all";
        btnPrompt.setAttribute('aria-selected', 'false');
        panelSim.classList.remove('hidden');
        panelPrompt.classList.add('hidden');
    }
    SabaAnalytics.trackEvent("terminal_tab_switched", { tab: tab });
}

// --- 7. CLEAN COPY TO CLIPBOARD SCRIPT ---
function copyToClipboard(source) {
    let textToCopy = "";
    if (source === 'prompt') {
        const promptRaw = document.getElementById('compiled-prompt-output');
        textToCopy = promptRaw.innerText;
    } else {
        textToCopy = document.getElementById('simulated-draft-output').innerText;
    }

    if (!textToCopy || textToCopy.includes("พร้อมประกอบร่าง") || textToCopy.includes("รอยืนยันพรอพท์") || textToCopy.includes("Awaiting") || textToCopy.includes("Ready to")) {
        showToast("พบข้อผิดพลาด", "ไม่พบเนื้อความในการคัดลอก โปรดป้อนข้อมูลและรัน Mega Prompt ก่อนครับ", "warning");
        return;
    }

    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    showToast(
        currentLang === 'en' ? "Copied!" : "คัดลอกสำเร็จ!", 
        currentLang === 'en' ? "Copied clean text to your clipboard." : "คัดลอกข้อความคลีนแบบไร้แท็กโค้ดปะปนลงในคลิปบอร์ดแล้วครับ พร้อมวางใน AI ทันที!", 
        "success"
    );
    SabaAnalytics.trackEvent("copy_to_clipboard", { source: source });
}

// --- 8. TRIPBOX CONTROLS ---
function dismissTripbox() {
    document.getElementById('tripbox-support-card').classList.add('hidden');
    sessionStorage.setItem('saba_tripbox_dismissed', 'true');
    showToast("ซ่อนการสนับสนุนแล้ว", "ซ่อนกล่องสนับสนุนค่าอาหารเปียกเรียบร้อย และระบบได้จำเซสชันไว้ไม่ให้กวนใจคุณอีก", "info");
    SabaAnalytics.trackEvent("tripbox_dismissed", {});
}

function notifySupport() {
    showToast("สแกนสนับสนุนน้องซาบะ", "ขอบพระคุณเป็นอย่างยิ่งสำหรับการร่วมสนับสนุนค่าอาหารเปียกของเจ้าส้มซาบะและทีมพัฒนาครับ!", "success");
    SabaAnalytics.trackEvent("tripbox_qr_clicked", {});
}

// --- 9. FEEDBACK FORM SIMULATOR ---
function submitFeedback() {
    const fbText = document.getElementById('feedback-text').value.trim();
    if (!fbText) {
        showToast("กล่องข้อความว่างเปล่า", "โปรดป้อนข้อคิดเห็นหรือข้อเสนอแนะในการอัปเกรดฐานพรอพท์ก่อนครับ", "warning");
        return;
    }

    const fbFormPanel = document.getElementById('feedback-form-panel');
    const fbSuccessPanel = document.getElementById('feedback-success-panel');
    
    showToast("กำลังประมวลผล", "กำลังทำการ Mock API Post ส่งข้อมูลเพื่อบันทึกไปฐานระบบ...", "info");

    setTimeout(() => {
        fbFormPanel.classList.add('hidden');
        fbSuccessPanel.classList.remove('hidden');
        showToast("ส่งความคิดเห็นสำเร็จ", "บันทึกข้อแนะนำของคุณเรียบร้อยแล้ว!", "success");
        SabaAnalytics.trackEvent("feedback_submitted", { content: fbText });
    }, 1200);
}

// --- 10. TOAST NOTIFICATION UTILITY ---
function showToast(title, message, type = "info") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let typeColor = "border-l-indigo-500";
    let typeIcon = "info";
    if (type === "success") {
        typeColor = "border-l-brand-orange";
        typeIcon = "check-circle";
    } else if (type === "warning") {
        typeColor = "border-l-amber-500";
        typeIcon = "alert-triangle";
    } else if (type === "error") {
        typeColor = "border-l-rose-500";
        typeIcon = "x-circle";
    }

    toast.className = `w-80 bg-brand-surface border border-brand-border border-l-4 ${typeColor} rounded-xl p-4 shadow-2xl flex gap-3 pointer-events-auto transition-all duration-300 translate-x-10 opacity-0 z-50`;

    const safeTitle = escapeHtmlForDisplay(title);
    const safeMessage = escapeHtmlForDisplay(message);

    toast.innerHTML = `
        <div class="text-brand-orange mt-0.5" aria-hidden="true">
            <i data-lucide="${typeIcon}" class="w-4 h-4"></i>
        </div>
        <div class="flex-grow space-y-1">
            <h5 class="text-xs font-extrabold text-white uppercase tracking-wider">${safeTitle}</h5>
            <p class="text-[11px] text-brand-muted leading-relaxed">${safeMessage}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white flex-shrink-0" aria-label="Dismiss this toast alert notification">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.classList.remove('translate-x-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// --- 11. COOKIE CONSENT & POLICY MODAL FUNCTIONS ---
function acceptAllCookies() {
    localStorage.setItem('saba_cookie_consent', 'true');
    document.getElementById('cookie-consent-banner').classList.add('hidden');
    showToast(
        currentLang === 'en' ? "Consent Saved" : "ยอมรับคุกกี้แล้ว",
        currentLang === 'en' ? "Privacy preferences updated successfully." : "ระบบบันทึกความยินยอมของท่านเรียบร้อยแล้ว",
        "success"
    );
    SabaAnalytics.trackEvent("cookie_consent_accepted", {});
}

function openPrivacyModal() {
    document.getElementById('privacy-modal').classList.remove('hidden');
    SabaAnalytics.trackEvent("modal_opened", { name: "privacy" });
}
function closePrivacyModal() {
    document.getElementById('privacy-modal').classList.add('hidden');
}

function openTermsModal() {
    document.getElementById('terms-modal').classList.remove('hidden');
    SabaAnalytics.trackEvent("modal_opened", { name: "terms" });
}
function closeTermsModal() {
    document.getElementById('terms-modal').classList.add('hidden');
}

function openApiSettingsModal() {
    document.getElementById('api-settings-modal').classList.remove('hidden');
    SabaAnalytics.trackEvent("modal_opened", { name: "api_settings" });
}
function closeApiSettingsModal() {
    document.getElementById('api-settings-modal').classList.add('hidden');
}

// --- 12. API SETTINGS DYNAMIC LOGIC ---
function toggleApiFields() {
    const provider = document.getElementById('api-provider').value;
    const modelSelect = document.getElementById('api-model');
    const keyInput = document.getElementById('api-key');
    
    modelSelect.innerHTML = "";
    if (provider === 'gemini') {
        keyInput.placeholder = "AIzaSy...";
        const models = [
            { value: 'gemini-2.5-flash', text: 'Gemini 2.5 Flash (Recommended)' },
            { value: 'gemini-2.5-pro', text: 'Gemini 2.5 Pro (Powerful)' }
        ];
        models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.value;
            opt.innerText = m.text;
            modelSelect.appendChild(opt);
        });
    } else {
        keyInput.placeholder = "sk-proj-...";
        const models = [
            { value: 'gpt-4o-mini', text: 'GPT-4o Mini (Recommended)' },
            { value: 'gpt-4o', text: 'GPT-4o (Powerful)' }
        ];
        models.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.value;
            opt.innerText = m.text;
            modelSelect.appendChild(opt);
        });
    }
}

function toggleApiKeyVisibility() {
    const keyInput = document.getElementById('api-key');
    const eyeIcon = document.getElementById('api-key-eye');
    isKeyVisible = !isKeyVisible;
    if (isKeyVisible) {
        keyInput.type = "text";
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        keyInput.type = "password";
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadApiSettings() {
    const savedProvider = localStorage.getItem('saba_api_provider') || 'gemini';
    const savedKey = localStorage.getItem('saba_api_key') || '';
    const savedModel = localStorage.getItem('saba_api_model') || '';
    
    document.getElementById('api-provider').value = savedProvider;
    toggleApiFields();
    
    document.getElementById('api-key').value = savedKey;
    if (savedModel) {
        document.getElementById('api-model').value = savedModel;
    }
}

function saveApiSettings() {
    const provider = document.getElementById('api-provider').value;
    const key = document.getElementById('api-key').value.trim();
    const model = document.getElementById('api-model').value;
    
    localStorage.setItem('saba_api_provider', provider);
    localStorage.setItem('saba_api_key', key);
    localStorage.setItem('saba_api_model', model);
    
    closeApiSettingsModal();
    if (key) {
        showToast(
            currentLang === 'en' ? "API Keys Connected" : "เชื่อมต่อ API Keys สำเร็จ",
            currentLang === 'en' ? `Ready to make requests to ${model} model!` : `พร้อมใช้งานระบบส่ง Request หาโมเดล ${model} แล้วครับ!`,
            "success"
        );
    } else {
        showToast(
            currentLang === 'en' ? "Settings Saved" : "บันทึกการตั้งค่าแล้ว",
            currentLang === 'en' ? "Mock mode active (no API Key provided)" : "สลับเข้าใช้งานระบบจำลองแบบ Mock (ไม่มี API Key)",
            "info"
        );
    }
    SabaAnalytics.trackEvent("api_keys_configured", { provider, model, hasKey: !!key });
}

// --- 13. PRICING & NOTION VAULT SYSTEM ---
function openPricingModal() {
    document.getElementById('pricing-modal').classList.remove('hidden');
    SabaAnalytics.trackEvent("modal_opened", { name: "pricing" });
}

function closePricingModal() {
    document.getElementById('pricing-modal').classList.add('hidden');
}

function selectPlan(planName) {
    SabaAnalytics.trackEvent("plan_clicked", { plan: planName });
    if (planName === 'free') {
        showToast(
            currentLang === 'en' ? "Current Plan" : "แผนปัจจุบันของคุณ",
            currentLang === 'en' ? "You are currently on the Free Plan." : "คุณกำลังใช้งานแผนบริการฟรีอยู่แล้วครับ",
            "success"
        );
    } else if (planName === 'pro') {
        showToast(
            currentLang === 'en' ? "Pro Upgrade Processing" : "กำลังดำเนินการอัปเกรด Pro",
            currentLang === 'en' ? "Connecting to secure payment gateway..." : "กำลังเชื่อมต่อระบบทำรายการจ่ายชำระเงินจำลอง...",
            "warning"
        );
        setTimeout(() => {
            localStorage.setItem('saba_session_vip', 'true');
            const badge = document.querySelector('[data-i18n="vip_badge"]');
            if (badge) {
                badge.innerText = currentLang === 'en' ? "PRO ARCHITECT" : "PRO ACTIVE";
                badge.className = "text-[10px] uppercase tracking-wider font-black text-black px-1.5 py-0.2 bg-amber-400 rounded-full border border-amber-400";
            }
            closePricingModal();
            showToast(
                currentLang === 'en' ? "Upgrade Successful!" : "อัปเกรด Pro สำเร็จ!",
                currentLang === 'en' ? "Welcome to Pro Architect level! Unlimited compiles unlocked." : "ยินดีต้อนรับสู่ระดับ Pro Architect! ปลดล็อกการร่าง AI ไม่จำกัดเรียบร้อยแล้ว",
                "success"
            );
            SabaAnalytics.trackEvent("plan_upgraded", { plan: "pro" });
        }, 1500);
    } else if (planName === 'enterprise') {
        showToast(
            currentLang === 'en' ? "Contacting Enterprise Sales" : "กำลังติดต่อแผนกดูแลลูกค้าองค์กร",
            currentLang === 'en' ? "Our team has been notified. We will reach you shortly." : "ระบบแจ้งประสานฝ่ายบริการลูกค้าแล้ว ทีมงานจะติดต่อหาท่านโดยเร็วที่สุด",
            "success"
        );
    }
}

function buyNotionVault() {
    SabaAnalytics.trackEvent("notion_vault_purchase_clicked", {});
    showToast(
        currentLang === 'en' ? "Checkout Initiated" : "กำลังส่งข้อมูลสั่งซื้อ",
        currentLang === 'en' ? "Connecting to Digital Prompt Vault payment window..." : "กำลังเชื่อมต่อไปยังหน้ารับสินค้า Notion Vault (290.-) เชิงสากล...",
        "warning"
    );
    setTimeout(() => {
        showToast(
            currentLang === 'en' ? "Vault Unlocked!" : "ปลดล็อก Notion Vault แล้ว!",
            currentLang === 'en' ? "Access link sent. Check your simulated workspace mail." : "ส่งลิงก์นำเข้าฐานข้อมูล Notion ไปยังกล่องข้อความจำลองแล้ว! ขอบคุณสำหรับความสนับสนุน",
            "success"
        );
    }, 1500);
}

// --- 14. ONBOARDING TOUR SYSTEM ---
function startOnboardingTour() {
    currentTourStep = 1;
    updateTourSlide();
    document.getElementById('onboarding-tour-modal').classList.remove('hidden');
    SabaAnalytics.trackEvent("tour_started", {});
}

function closeOnboardingTour() {
    document.getElementById('onboarding-tour-modal').classList.add('hidden');
    localStorage.setItem('saba_tour_completed', 'true');
    SabaAnalytics.trackEvent("tour_closed", { completed: currentTourStep === totalTourSteps });
}

function nextTourSlide() {
    if (currentTourStep < totalTourSteps) {
        currentTourStep++;
        updateTourSlide();
    } else {
        closeOnboardingTour();
    }
}

function prevTourSlide() {
    if (currentTourStep > 1) {
        currentTourStep--;
        updateTourSlide();
    }
}

function updateTourSlide() {
    const slides = document.querySelectorAll('.tour-slide');
    slides.forEach(slide => slide.classList.add('hidden'));

    document.getElementById(`tour-slide-${currentTourStep}`).classList.remove('hidden');

    const indicators = document.getElementById('tour-indicators').children;
    for (let i = 0; i < indicators.length; i++) {
        if (i === currentTourStep - 1) {
            indicators[i].className = "w-1.5 h-1.5 rounded-full bg-brand-orange transition-all scale-125";
        } else {
            indicators[i].className = "w-1.5 h-1.5 rounded-full bg-zinc-700 transition-all";
        }
    }

    const prevBtn = document.getElementById('tour-prev-btn');
    const nextBtn = document.getElementById('tour-next-btn');

    if (currentTourStep === 1) {
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
        prevBtn.disabled = true;
    } else {
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        prevBtn.disabled = false;
    }

    if (currentTourStep === totalTourSteps) {
        nextBtn.innerText = currentLang === 'en' ? "Finish" : "เริ่มต้นใช้งานเลย";
        nextBtn.className = "px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-[11px] font-extrabold text-black rounded-xl transition-all shadow-md shadow-emerald-500/15";
    } else {
        nextBtn.innerText = currentLang === 'en' ? "Next" : "ถัดไป";
        nextBtn.className = "px-4 py-2 bg-brand-orange hover:bg-orange-600 text-[11px] font-extrabold text-black rounded-xl transition-all shadow-md shadow-brand-orange/15";
    }
}

// --- 15. BIND GLOBALS FOR INLINE HTML EVENT HANDLERS ---
window.toggleLanguage = toggleLanguage;
window.navigateTab = navigateTab;
window.selectCategory = selectCategory;
window.selectTone = selectTone;
window.loadSuggestedScenario = loadSuggestedScenario;
window.compileMegaPrompt = compileMegaPrompt;
window.switchTerminalTab = switchTerminalTab;
window.copyToClipboard = copyToClipboard;
window.dismissTripbox = dismissTripbox;
window.notifySupport = notifySupport;
window.submitFeedback = submitFeedback;
window.acceptAllCookies = acceptAllCookies;
window.openPrivacyModal = openPrivacyModal;
window.closePrivacyModal = closePrivacyModal;
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;
window.openApiSettingsModal = openApiSettingsModal;
window.closeApiSettingsModal = closeApiSettingsModal;
window.toggleApiFields = toggleApiFields;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.saveApiSettings = saveApiSettings;
window.openPricingModal = openPricingModal;
window.closePricingModal = closePricingModal;
window.selectPlan = selectPlan;
window.buyNotionVault = buyNotionVault;
window.startOnboardingTour = startOnboardingTour;
window.closeOnboardingTour = closeOnboardingTour;
window.nextTourSlide = nextTourSlide;
window.prevTourSlide = prevTourSlide;
window.clearUploadedFile = clearUploadedFile;
window.openGoogleDriveModal = openGoogleDriveModal;
window.closeGoogleDriveModal = closeGoogleDriveModal;
window.selectGoogleDriveFile = selectGoogleDriveFile;
window.handleOTPRequest = handleOTPRequest;
window.simulateThirdPartyLogin = simulateThirdPartyLogin;
window.handleSignOut = handleSignOut;
window.handleGuestLogin = handleGuestLogin;
window.switchLoginTab = switchLoginTab;

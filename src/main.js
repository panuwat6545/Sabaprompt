import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT INITIALIZATION ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('[Supabase Auth] Client initialized successfully.');
    } catch (err) {
        console.warn('[Supabase Auth] Initialization failed:', err);
    }
}

// Auto-check Supabase session on startup
if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            currentUser = session.user.email || session.user.phone || session.user.id;
            localStorage.setItem('saba_session_user', currentUser);
        }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            currentUser = session.user.email || session.user.phone || session.user.id;
            localStorage.setItem('saba_session_user', currentUser);
            if (typeof showDashboard === 'function') {
                showDashboard();
            }
        }
    });
}

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
    "slider_lbl_assertive": { th: "Assertiveness (ความเด็ดขาด)", en: "Assertiveness (ความเด็ดขาด)" },
    "slider_lbl_urgency": { th: "Urgency (ความเร่งด่วน)", en: "Urgency (ความเร่งด่วน)" },
    "slider_lbl_empathy": { th: "Empathy (ความเห็นอกเห็นใจ)", en: "Empathy (ความเห็นอกเห็นใจ)" },
    "slider_bound_polite": { th: "นอบน้อม (Polite)", en: "Polite" },
    "slider_bound_direct": { th: "เด็ดขาด (Direct)", en: "Direct" },
    "slider_bound_normal": { th: "ปกติ (Normal)", en: "Normal" },
    "slider_bound_urgent": { th: "เร่งด่วน (Urgent)", en: "Urgent" },
    "slider_bound_task": { th: "เน้นงาน (Task-focused)", en: "Task-focused" },
    "slider_bound_relation": { th: "เน้นความสัมพันธ์ (Relationship)", en: "Relationship" },
    "sender_label": { th: "ชื่อผู้ส่ง (ชื่อของคุณ)", en: "Sender Name (Your Name)" },
    "who_label": { th: "ชื่อผู้รับ / ตำแหน่ง", en: "Recipient / Position" },
    "tone_label": { th: "ระดับอารมณ์และจิตวิทยาการสื่อสาร (EQ Sliders)", en: "Interactive EQ Tone Sliders" },
    "detail_label": { th: "โจทย์งานดิบหรือเหตุการณ์ที่เกิดขึ้น", en: "Raw Details / Context" },
    "btn_load_scenario": { th: "จำลองสถานการณ์ตัวอย่าง", en: "Load Suggested Scenario" },
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
    "h1_sub_seo": { th: "ตัวช่วยเขียนอีเมล วิธีเขียนเมลด้วย AI", en: "AI Email Assistant & Writing Guide" },
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
let uploadedFiles = [];
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
    
    // Update Switch buttons visual indicators (TH/EN Segmented Control)
    const thBtn = document.getElementById('lang-btn-th');
    const enBtn = document.getElementById('lang-btn-en');
    const authThBtn = document.getElementById('auth-lang-btn-th');
    const authEnBtn = document.getElementById('auth-lang-btn-en');
    
    const updateButtons = (th, en) => {
        if (!th || !en) return;
        if (lang === 'th') {
            th.className = "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 focus:outline-none text-brand-orange bg-brand-orange/15 border border-brand-orange/30 shadow-sm";
            const dot = th.querySelector('span');
            if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse";
            
            en.className = "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 focus:outline-none text-gray-400 hover:text-white bg-transparent border border-transparent";
            const enDot = en.querySelector('span');
            if (enDot) enDot.className = "w-1.5 h-1.5 rounded-full bg-zinc-700 hidden";
        } else {
            en.className = "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 focus:outline-none text-brand-orange bg-brand-orange/15 border border-brand-orange/30 shadow-sm";
            const dot = en.querySelector('span');
            if (dot) dot.className = "w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse";
            
            th.className = "px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 focus:outline-none text-gray-400 hover:text-white bg-transparent border border-transparent";
            const thDot = th.querySelector('span');
            if (thDot) thDot.className = "w-1.5 h-1.5 rounded-full bg-zinc-700 hidden";
        }
    };
    
    updateButtons(thBtn, enBtn);
    updateButtons(authThBtn, authEnBtn);

    // Apply data-i18n replacements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nDict[key] && i18nDict[key][lang]) {
            el.innerHTML = i18nDict[key][lang];
        }
    });

    // Translate input placeholders
    const senderEl = document.getElementById('inputSender');
    if (senderEl) {
        senderEl.placeholder = lang === 'en' ? "e.g. John (Sales)" : "เช่น ก้องเกียรติ (ฝ่ายขาย)";
    }
    const whoEl = document.getElementById('inputWho');
    if (whoEl) {
        whoEl.placeholder = lang === 'en' ? "e.g. Somsak (Production Head)" : "เช่น คุณสมศักดิ์ (หัวหน้าฝ่ายผลิต)";
    }
    const detailEl = document.getElementById('inputDetail');
    if (detailEl) {
        if (detailEl.tagName.toLowerCase() === 'textarea') {
            detailEl.placeholder = lang === 'en' ? "Enter raw context (e.g. Requesting 5-day vacation...)" : "เขียนความต้องการดิบๆ ของคุณลงไป...";
        }
    }
    
    // Update quota indicators
    if (typeof updateQuotaIndicator === 'function') {
        updateQuotaIndicator();
    }

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

    // Deep Linking Conversion Loop URL Parameters Handler
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (cat && typeof selectCategory === 'function') {
        selectCategory(cat);
    }
    const who = params.get('who');
    if (who) {
        const inputWhoEl = document.getElementById('inputWho');
        if (inputWhoEl) inputWhoEl.value = who;
    }
    const detail = params.get('detail');
    if (detail) {
        if (detailInput) {
            detailInput.innerText = detail;
            detailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    
    // Tripbox support card dismiss check
    const tripboxDismissed = sessionStorage.getItem('saba_tripbox_dismissed');
    if (tripboxDismissed === 'true') {
        document.getElementById('tripbox-support-card').classList.add('hidden');
    }

    setupDragAndDrop();

    // Clipboard Drop Listener for contenteditable input Detail
    detailInput.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            e.preventDefault();
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.indexOf('image') !== -1) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.alt = file.name;
                        img.className = "max-w-xs max-h-40 rounded-lg border border-slate-200 shadow-sm my-2 block";
                        
                        const selection = window.getSelection();
                        if (selection.rangeCount) {
                            const range = selection.getRangeAt(0);
                            range.insertNode(img);
                            range.collapse(false);
                        } else {
                            detailInput.appendChild(img);
                        }
                        
                        showToast(
                            currentLang === 'en' ? "Image Attached" : "แนบรูปภาพแล้ว",
                            currentLang === 'en' ? `Image file "${file.name}" dropped successfully.` : `ตรวจพบการลากรูปภาพ "${file.name}" มาวางในกล่องข้อความเรียบร้อย`,
                            "success"
                        );
                        SabaAnalytics.trackEvent("image_dropped", { name: file.name });
                        
                        const textLength = detailInput.innerText.replace(/\n/g, '').length;
                        document.getElementById('charCounter').innerText = `${textLength} อักษร`;
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    });

    // Clipboard Paste Listener for contenteditable input Detail
    detailInput.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        let hasImage = false;

        if (clipboardData && clipboardData.items) {
            for (let i = 0; i < clipboardData.items.length; i++) {
                const item = clipboardData.items[i];
                if (item.type.indexOf('image') !== -1) {
                    e.preventDefault();
                    hasImage = true;
                    const file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.alt = "Pasted image";
                        img.className = "max-w-xs max-h-40 rounded-lg border border-slate-200 shadow-sm my-2 block";
                        
                        const selection = window.getSelection();
                        if (selection.rangeCount) {
                            const range = selection.getRangeAt(0);
                            range.insertNode(img);
                            range.collapse(false);
                        } else {
                            detailInput.appendChild(img);
                        }
                        
                        showToast("แนบรูปภาพแล้ว", "ตรวจพบการวางรูปภาพจากคลิปบอร์ดและแทรกลงในกล่องข้อความเรียบร้อย", "success");
                        SabaAnalytics.trackEvent("image_pasted", {});
                        
                        const textLength = detailInput.innerText.replace(/\n/g, '').length;
                        document.getElementById('charCounter').innerText = `${textLength} อักษร`;
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    });
});

// Setup Drag & Drop File Upload
function setupDragAndDrop() {
    const dropZone = document.getElementById('doc-drop-zone') || document.getElementById('drag-drop-zone');
    const fileInput = document.getElementById('doc-file-input');

    if (dropZone && fileInput) {
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
}

// Upload local PC files
function processLocalFile(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const type = file.name.split('.').pop().toLowerCase();
    
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    if (imageTypes.includes(type)) {
        showToast(
            currentLang === 'en' ? "Processing Image..." : "กำลังประมวลผลรูปภาพ...", 
            currentLang === 'en' ? "Importing image into strategy matrix..." : "ระบบกำลังนำภาพเข้ามาประกอบร่างยุทธศาสตร์...", 
            "info"
        );
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileObj = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: `${sizeInMB} MB`,
                type: type,
                mockContent: `[ภาพแนบประกอบยุทธศาสตร์: ${file.name}]`
            };
            uploadedFile = fileObj;
            uploadedFiles.push(fileObj);
            updateFileStatusUI();
            
            showToast(
                currentLang === 'en' ? "Image Attached" : "แนบไฟล์รูปภาพแล้ว", 
                currentLang === 'en' ? "Successfully uploaded and inserted image in text box." : "ตรวจพบการอัปโหลดไฟล์รูปภาพ และแทรกลงในกล่องข้อความเรียบร้อย", 
                "success"
            );
            SabaAnalytics.trackEvent("image_uploaded", { name: file.name });
        };
        reader.readAsDataURL(file);
        return;
    }
    
    showToast("กำลังประมวลผลไฟล์...", "ระบบกำลังอ่านและสแกนข้อมูลจากไฟล์ในเครื่องของคุณ...", "info");

    const reader = new FileReader();
    
    reader.onload = async function(e) {
        let parsedText = "";
        
        try {
            if (type === 'txt') {
                parsedText = e.target.result;
            } else if (type === 'csv') {
                parsedText = e.target.result;
            } else if (type === 'pdf') {
                const arrayBuffer = e.target.result;
                parsedText = await parsePdfClient(arrayBuffer);
            } else if (type === 'docx') {
                const arrayBuffer = e.target.result;
                parsedText = await parseDocxClient(arrayBuffer);
            } else {
                parsedText = `สแกนไฟล์เรียบร้อย: ${file.name} (ประเภทไฟล์นี้ไม่รองรับการดึงข้อความอัตโนมัติ จึงใช้ชื่อไฟล์เป็นบริบท)`;
            }
            
            const fileObj = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: `${sizeInMB} MB`,
                type: type,
                mockContent: parsedText.substring(0, 3000)
            };
            uploadedFile = fileObj;
            uploadedFiles.push(fileObj);
            
            updateFileStatusUI();
            showToast("สแกนและอ่านไฟล์สำเร็จ", `ระบบนำเข้าเนื้อหาจากไฟล์ ${file.name} เพื่อรันยุทธศาสตร์เรียบร้อยแล้ว`, "success");
            SabaAnalytics.trackEvent("file_parsed_success", { fileName: file.name, fileType: type });
        } catch (error) {
            console.error("Error parsing file:", error);
            showToast("สแกนไฟล์ล้มเหลว", `ไม่สามารถสกัดข้อความ: ${error.message}`, "error");
            
            // Fallback
            const fileObj = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: `${sizeInMB} MB`,
                type: type,
                mockContent: `ข้อมูลเอกสารแนบ: ${file.name} (สแกนล้มเหลวเนื่องจาก ${error.message})`
            };
            uploadedFile = fileObj;
            uploadedFiles.push(fileObj);
            updateFileStatusUI();
        }
    };
    
    if (type === 'txt' || type === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

// PDF.js Client-Side Parser
async function parsePdfClient(arrayBuffer) {
    if (typeof pdfjsLib === 'undefined') {
        throw new Error("ระบบไม่พบไลบรารี PDF.js โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    }
    
    // Set worker from standard cdnjs endpoint
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";
    
    // Limit to reading first 15 pages for prompt size safety
    const maxPages = Math.min(pdf.numPages, 15);
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }
    
    return fullText.trim() || "[ไม่พบข้อความตัวอักษรในไฟล์ PDF (ไฟล์นี้อาจเป็นภาพสแกนหรือสแกนล้มเหลว)]";
}

// Mammoth.js Client-Side Parser
async function parseDocxClient(arrayBuffer) {
    if (typeof mammoth === 'undefined') {
        throw new Error("ระบบไม่พบไลบรารี Mammoth.js โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    }
    
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value.trim() || "[ไม่พบเนื้อหาข้อความในไฟล์ DOCX]";
}

let googlePickerToken = null;

function openGoogleDriveModal() {
    const userSession = localStorage.getItem('saba_session_user') || '';
    if (userSession === 'Guest User' || !userSession) {
        showToast(
            "โปรดล็อกอินด้วย Google", 
            "กรุณาเข้าสู่ระบบด้วยบัญชี Google เพื่อใช้งานระบบนำเข้าจาก Google Drive ของคุณ", 
            "warning"
        );
        handleGoogleSignInClick();
        return;
    }

    if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
        initGoogleDrivePicker();
    } else {
        document.getElementById('gdrive-modal').classList.remove('hidden');
    }
}

function initGoogleDrivePicker() {
    const clientId = (import.meta && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : '') || 
                     (typeof process !== 'undefined' && process.env ? process.env.VITE_GOOGLE_CLIENT_ID : '') || '';
    const apiKey = (import.meta && import.meta.env ? import.meta.env.VITE_GOOGLE_API_KEY : '') || 
                   (import.meta && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '') || 
                   (typeof process !== 'undefined' && process.env ? process.env.VITE_GOOGLE_API_KEY : '') || 
                   (typeof process !== 'undefined' && process.env ? process.env.VITE_GEMINI_API_KEY : '') || '';

    if (!clientId || !apiKey) {
        document.getElementById('gdrive-modal').classList.remove('hidden');
        showToast("Google Drive Setup", "โปรดระบุ VITE_GOOGLE_CLIENT_ID และ VITE_GOOGLE_API_KEY เพื่อเปิดใช้ Google Picker หรือเลือกไฟล์จำลอง", "info");
        return;
    }

    try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/drive.file',
            callback: async (response) => {
                if (response.error) {
                    showToast("Google Auth Error", response.error, "error");
                    return;
                }
                googlePickerToken = response.access_token;
                createPicker(apiKey, googlePickerToken);
            },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
        console.error("Google Picker error:", err);
        document.getElementById('gdrive-modal').classList.remove('hidden');
    }
}

function createPicker(apiKey, accessToken) {
    gapi.load('picker', {
        callback: () => {
            const view = new google.picker.View(google.picker.ViewId.DOCS);
            const picker = new google.picker.PickerBuilder()
                .addView(view)
                .setOAuthToken(accessToken)
                .setDeveloperKey(apiKey)
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
        }
    });
}

async function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED) {
        const doc = data.docs[0];
        const fileId = doc.id;
        const fileName = doc.name;
        const fileSize = doc.sizeBytes ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB';
        const fileType = fileName.split('.').pop().toLowerCase();

        showToast("กำลังดึงไฟล์...", `กำลังโหลดไฟล์ ${fileName} จาก Google Drive...`, "info");
        
        try {
            const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
                headers: { 'Authorization': `Bearer ${googlePickerToken}` }
            });
            const textContent = await res.text();

            uploadedFile = {
                name: fileName,
                size: fileSize,
                type: fileType,
                mockContent: textContent.substring(0, 3000)
            };

            updateFileStatusUI();
            showToast("ดึงไฟล์สำเร็จ", `นำเข้าเนื้อหาจาก Google Drive: ${fileName} เรียบร้อยแล้ว`, "success");
            SabaAnalytics.trackEvent("file_uploaded_gdrive_real", { fileName: fileName });
        } catch (err) {
            selectGoogleDriveFile(fileName, fileSize, fileType, `[นำเข้าไฟล์ Google Drive]: ${fileName}`);
        }
    }
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
    uploadedFiles = [];
    document.getElementById('doc-file-input').value = "";
    const bar = document.getElementById('attached-previews-bar');
    if (bar) {
        bar.innerHTML = '';
        bar.classList.add('hidden');
    }
    const container = document.getElementById('file-status-container');
    if (container) container.classList.add('hidden');
    showToast("ลบไฟล์สำเร็จ", "เคลียร์เอกสารแนบทั้งหมดออกจาก Workspace แล้วครับ", "info");
}

function removeAttachedFile(id) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== id);
    if (uploadedFiles.length > 0) {
        uploadedFile = uploadedFiles[uploadedFiles.length - 1];
    } else {
        uploadedFile = null;
        document.getElementById('doc-file-input').value = "";
    }
    updateFileStatusUI();
    showToast("ลบไฟล์สำเร็จ", "เคลียร์เอกสารแนบที่เลือกแล้วครับ", "info");
}
window.removeAttachedFile = removeAttachedFile;

function updateFileStatusUI() {
    const bar = document.getElementById('attached-previews-bar');
    const container = document.getElementById('file-status-container');
    if (container) container.classList.add('hidden'); // Hide the old block container

    if (!bar) return;

    if (uploadedFiles.length === 0) {
        bar.innerHTML = '';
        bar.classList.add('hidden');
        return;
    }

    bar.innerHTML = uploadedFiles.map(file => {
        let iconName = 'file-text';
        let iconClass = 'text-orange-500';
        if (file.type === 'pdf') {
            iconName = 'file-text';
            iconClass = 'text-rose-500';
        } else if (file.type === 'xlsx' || file.type === 'csv' || file.type === 'spreadsheet') {
            iconName = 'file-spreadsheet';
            iconClass = 'text-emerald-500';
        } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.type)) {
            iconName = 'image';
            iconClass = 'text-blue-500';
        }

        const safeName = file.name.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

        return `
            <div class="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-3 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm animate-fade-in">
                <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${iconClass}"></i>
                <span class="truncate max-w-[120px]" title="${safeName}">${safeName}</span>
                <button onclick="removeAttachedFile('${file.id}')" class="text-slate-450 hover:text-rose-500 transition-colors p-0.5 ml-0.5" title="ลบไฟล์">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            </div>
        `;
    }).join('');

    bar.classList.remove('hidden');
    
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

async function handleOTPRequest() {
    const inputVal = document.getElementById('login-phone').value.trim();
    const actionBtn = document.getElementById('btn-otp-action');
    const confirmContainer = document.getElementById('otp-confirm-container');
    const otpCodeField = document.getElementById('login-otp-code');
    
    if (!inputVal || inputVal.length < 5) {
        showToast("แจ้งเตือน", "โปรดกรอกอีเมลหรือเบอร์โทรศัพท์มือถือให้ถูกต้องครับ", "warning");
        return;
    }

    const isEmail = inputVal.includes('@');

    if (confirmContainer.classList.contains('hidden')) {
        actionBtn.disabled = true;
        actionBtn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>กำลังส่ง OTP...</span>`;
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }

        if (supabase) {
            try {
                let error = null;
                if (isEmail) {
                    const res = await supabase.auth.signInWithOtp({ email: inputVal });
                    error = res.error;
                } else {
                    const formattedPhone = inputVal.startsWith('+') ? inputVal : `+66${inputVal.replace(/^0/, '')}`;
                    const res = await supabase.auth.signInWithOtp({ phone: formattedPhone });
                    error = res.error;
                }

                if (error) throw error;

                actionBtn.disabled = false;
                actionBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i><span data-i18n="btn_otp_verify">ยืนยันเข้าสู่ระบบ</span>`;
                confirmContainer.classList.remove('hidden');
                showToast("OTP ส่งสำเร็จ", isEmail ? `รหัสยืนยัน OTP ถูกส่งไปยังอีเมล ${inputVal} เรียบร้อยแล้ว` : `รหัสยืนยัน OTP ถูกส่งไปยังเบอร์ ${inputVal} เรียบร้อยแล้ว`, "success");
            } catch (err) {
                console.error("Supabase OTP error:", err);
                actionBtn.disabled = false;
                actionBtn.innerHTML = `<i data-lucide="smartphone" class="w-4 h-4"></i><span data-i18n="btn_otp_init">รับรหัส OTP</span>`;
                showToast("ส่ง OTP ล้มเหลว", err.message, "error");
            }
        } else {
            // Mock fallback
            setTimeout(() => {
                actionBtn.disabled = false;
                actionBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i><span data-i18n="btn_otp_verify">ยืนยันเข้าสู่ระบบ</span>`;
                confirmContainer.classList.remove('hidden');
                showToast("OTP ส่งสำเร็จ (Mock Mode)", "รหัสผ่านจำลองส่งแล้ว (รหัสทดสอบคือ: 1234)", "success");
                if (typeof lucide !== 'undefined') { lucide.createIcons(); }
            }, 400);
        }
    } else {
        const codeVal = otpCodeField.value.trim();
        if (supabase) {
            actionBtn.disabled = true;
            try {
                let res;
                if (isEmail) {
                    res = await supabase.auth.verifyOtp({ email: inputVal, token: codeVal, type: 'email' });
                } else {
                    const formattedPhone = inputVal.startsWith('+') ? inputVal : `+66${inputVal.replace(/^0/, '')}`;
                    res = await supabase.auth.verifyOtp({ phone: formattedPhone, token: codeVal, type: 'sms' });
                }

                if (res.error) throw res.error;

                currentUser = res.data.user?.email || res.data.user?.phone || inputVal;
                localStorage.setItem('saba_session_user', currentUser);
                showDashboard();
                showToast("ล็อกอินสำเร็จ", `ยินดีต้อนรับเข้าสู่ระบบ ${currentUser}`, "success");
            } catch (err) {
                console.error("OTP verification error:", err);
                actionBtn.disabled = false;
                showToast("รหัสไม่ถูกต้อง", err.message, "error");
            }
        } else {
            if (codeVal === '1234') {
                currentUser = isEmail ? inputVal : `+66 ${inputVal.substring(1, 4)}***${inputVal.substring(7)}`;
                localStorage.setItem('saba_session_user', currentUser);
                showDashboard();
                SabaAnalytics.trackEvent("login_otp_success", { input: inputVal });
            } else {
                showToast("รหัสไม่ถูกต้อง", "โปรดระบุรหัส OTP จำลองให้ถูกต้อง (พิมพ์ 1234 เพื่อรันตัวทดสอบระบบ)", "error");
            }
        }
    }
}

function handleGoogleJWTResponse(response) {
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const userName = payload.name || payload.email || 'Google User';
        const userPicture = payload.picture || '';

        currentUser = userName;
        localStorage.setItem('saba_session_user', currentUser);
        showDashboard();
        
        const badge = document.getElementById('session-user-badge');
        if (badge && userPicture) {
            badge.innerHTML = `<img src="${userPicture}" class="w-4 h-4 rounded-full inline mr-1 object-cover"/> ${userName}`;
        }

        showToast("เข้าสู่ระบบด้วย Google สำเร็จ", `ยินดีต้อนรับคุณ ${userName} เข้าสู่ SABA PROMPT`, "success");
        SabaAnalytics.trackEvent("google_login_success", { name: userName });
    } catch (err) {
        console.error("Failed to parse Google JWT credential:", err);
        showToast("การเข้าสู่ระบบล้มเหลว", "ไม่สามารถถอดรหัสผ่าน Google Account ได้", "error");
    }
}
window.handleGoogleJWTResponse = handleGoogleJWTResponse;

async function simulateThirdPartyLogin(provider) {
    if (provider === 'Google') {
        const googleClientId = localStorage.getItem('saba_google_client_id') || (import.meta && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : '') || '';
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id && googleClientId) {
            showToast("กำลังเชื่อมต่อ Google", "กำลังเริ่มระบบล็อกอิน Google Account ของแท้...", "info");
            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleJWTResponse
            });
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    showToast("Google One Tap", "โปรดอนุญาตป๊อปอัป Google บนหน้าจอ", "info");
                }
            });
            return;
        } else if (!googleClientId) {
            showToast(
                "เข้าสู่ระบบด้วย Google (จำลอง)", 
                "คุณสามารถกรอก Google Client ID ในหน้าตั้งค่าเฟืองเพื่อเปิดล็อกอิน Google ของแท้ได้เลยครับ!", 
                "info"
            );
        }
    }
    
    showToast("กำลังประมวลผล", `กำลังเชื่อมโยงบัญชีกับระบบ ${provider}...`, "info");
    setTimeout(() => {
        currentUser = `${provider} User`;
        localStorage.setItem('saba_session_user', currentUser);
        showDashboard();
        SabaAnalytics.trackEvent("login_oauth_success", { provider: provider });
    }, 800);
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
        
        const dot = card.querySelector('.indicator-dot');
        const badge = card.querySelector('.badge-text');
        const iconBg = card.querySelector('.icon-bg');
        
        if (c === cat) {
            card.className = "text-left w-full cursor-pointer bg-orange-50/60 border-2 border-brand-orange rounded-xl p-4 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange transition-all duration-300 relative overflow-hidden group shadow-lg";
            card.setAttribute('aria-selected', 'true');
            if (dot) dot.classList.remove('hidden');
            if (badge) {
                badge.className = "badge-text text-[8px] font-extrabold uppercase bg-brand-orange text-white px-2 py-0.5 rounded-full shadow-sm shadow-brand-orange/20";
            }
            if (iconBg) {
                iconBg.className = "icon-bg p-2 bg-brand-orange text-white rounded-lg transition-colors";
            }
        } else {
            card.className = "text-left w-full cursor-pointer bg-white border border-slate-200/80 rounded-xl p-4 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange transition-all duration-300 relative overflow-hidden group shadow-md hover:border-slate-300";
            card.setAttribute('aria-selected', 'false');
            if (dot) dot.classList.add('hidden');
            if (badge) {
                badge.className = "badge-text text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 border border-slate-200/60 px-2 py-0.5 rounded-full";
            }
            if (iconBg) {
                iconBg.className = "icon-bg p-2 bg-slate-100 text-slate-500 group-hover:text-brand-orange group-hover:bg-brand-orange/10 transition-colors";
            }
        }
    });
    SabaAnalytics.trackEvent("category_selected", { category: cat });
}

function selectTone(tone, element) {
    selectedTone = tone;
    const buttons = document.querySelectorAll('.tone-btn');
    buttons.forEach(btn => {
        btn.className = "tone-btn text-xs font-semibold py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all outline-none flex items-center justify-center gap-1.5";
        const dot = btn.querySelector('span');
        if (dot) {
            dot.className = "w-1.5 h-1.5 rounded-full bg-transparent";
        }
    });
    element.className = "tone-btn text-xs font-semibold py-2 px-3 rounded-lg bg-orange-50/60 border-2 border-brand-orange text-brand-orange transition-all outline-none shadow-sm flex items-center justify-center gap-1.5";
    const activeDot = element.querySelector('span');
    if (activeDot) {
        activeDot.className = "w-1.5 h-1.5 rounded-full bg-brand-orange";
    }
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
    // Quota limits validation
    const tier = localStorage.getItem('saba_subscription_tier') || 'free';
    const sentCount = parseInt(localStorage.getItem('saba_daily_emails_sent') || '0');
    const maxLimit = tier === 'pro' ? 200 : 5;

    if (sentCount >= maxLimit) {
        if (tier === 'free') {
            showToast(
                currentLang === 'en' ? "Free Limit Reached" : "หมดโควตาใช้งานฟรีประจำวัน",
                currentLang === 'en' ? "You have reached your daily limit of 5 drafts. Please upgrade to Pro Tier to unlock 200 drafts/day!" : "คุณใช้งานโควตาฟรีครบ 5 ครั้งสำหรับวันนี้แล้ว โปรดรอรีเซ็ตในวันถัดไป หรืออัปเกรดเป็น Pro Tier (199.-/เดือน) เพื่อใช้งาน 200 ครั้ง/วัน",
                "warning"
            );
            openPricingModal();
        } else {
            showToast(
                currentLang === 'en' ? "Pro Limit Reached" : "หมดโควตา Pro ประจำวัน",
                currentLang === 'en' ? "You have reached your daily Pro limit of 200 drafts. Please wait until tomorrow for a reset!" : "คุณใช้งานโควตา Pro ครบ 200 ครั้งสำหรับวันนี้แล้ว โปรดรอระบบรีเซ็ตใหม่ในวันถัดไปครับ",
                "warning"
            );
        }
        return;
    }

    const inputWho = document.getElementById('inputWho').value.trim();
    const inputSender = document.getElementById('inputSender').value.trim() || "[ชื่อของคุณ]";
    
    const detailInput = document.getElementById('inputDetail');
    let inputDetail = "";
    let hasImages = false;
    
    if (detailInput.tagName.toLowerCase() === 'textarea') {
        inputDetail = detailInput.value.trim();
    } else {
        inputDetail = detailInput.innerText.trim();
        hasImages = (detailInput.querySelectorAll('img').length > 0) || uploadedFiles.some(f => ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(f.type));
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
        
        // Increment daily emails count
        const newCount = sentCount + 1;
        localStorage.setItem('saba_daily_emails_sent', newCount.toString());
        updateQuotaIndicator();

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

        document.getElementById('simulate-placeholder').classList.add('hidden');
        
        // Always query live AI via Serverless Backend / Environment API Key automatically for all users!
        const userApiKey = localStorage.getItem('saba_api_key') || '';
        queryRealAI(userApiKey, inputWho, inputDetail, inputSender);
    }, 800);
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
    let generatedEmailMockA = "";
    let generatedEmailMockB = "";

    let fileSystemPrompt = "";
    let docReferenceText = "";
    
    let imageNoteTh = hasImages ? "\n• [มีภาพประกอบแนบมาด้วยในโจทย์]: โปรดพิจารณารายละเอียดจากภาพหากมีการวิเคราะห์ด้วย Vision AI" : "";
    let imageNoteEn = hasImages ? "\n• [Image Attached in Context]: Please consider visual details if analyzing via Vision AI." : "";

    // Read range sliders from DOM
    const assertive = document.getElementById('input-assertive') ? parseInt(document.getElementById('input-assertive').value) : 50;
    const urgency = document.getElementById('input-urgency') ? parseInt(document.getElementById('input-urgency').value) : 30;
    const empathy = document.getElementById('input-empathy') ? parseInt(document.getElementById('input-empathy').value) : 80;

    // Check if Privacy Shield (PII Masking) is enabled
    const privacyActive = document.getElementById('privacy-shield-active') && document.getElementById('privacy-shield-active').checked;
    let finalDetail = detail;
    if (privacyActive) {
        finalDetail = sanitizePII(detail, sender, who);
    }
    
    // Core emotional rules determined dynamically from Sliders
    let emotionalGuidelinesTh = "";
    let emotionalGuidelinesEn = "";

    if (assertive > 70) {
        emotionalGuidelinesTh += "\n• [Assertive Level: High (" + assertive + "%)]: วางกรอบเจรจาด้วยจุดยืนมั่นคง กระชับ ตรงประเด็น ไม่โอ้โลมหรือเกริ่นยาวเกินไป";
        emotionalGuidelinesEn += "\n• [Assertive Level: High (" + assertive + "%)]: Formulate the negotiation with a firm stance, keep it concise, direct, and avoid unnecessary small talk.";
    } else {
        emotionalGuidelinesTh += "\n• [Assertive Level: Gentle (" + assertive + "%)]: สื่อสารด้วยความอ่อนน้อมถ่อมตน ประนีประนอมสูง และเน้นแสดงความนับถือคู่กรณี";
        emotionalGuidelinesEn += "\n• [Assertive Level: Gentle (" + assertive + "%)]: Communicate with high humility, compromise-first approach, and show maximum politeness.";
    }

    if (urgency > 60) {
        emotionalGuidelinesTh += "\n• [Urgency Level: High (" + urgency + "%)]: กำหนดกรอบเวลาส่งมอบที่ชัดเจน ดึงผู้รับให้เข้ามาแก้ปัญหาร่วมกันโดยเร่งด่วนแต่สุภาพ";
        emotionalGuidelinesEn += "\n• [Urgency Level: High (" + urgency + "%)]: Set clear timelines, nudge the recipient for quick cooperation respectfully.";
    } else {
        emotionalGuidelinesTh += "\n• [Urgency Level: Normal (" + urgency + "%)]: รักษารอบการสื่อสารตามกำหนดการปกติ ไม่บีบคั้น";
        emotionalGuidelinesEn += "\n• [Urgency Level: Normal (" + urgency + "%)]: Keep communications at a normal business pace without high pressure.";
    }

    if (empathy > 70) {
        emotionalGuidelinesTh += "\n• [Empathy Level: High (" + empathy + "%)]: ใช้ Radical Empathy คาดเดาความอึดอัดใจและวิกฤตฝั่งผู้รับ (Fear Factor) พร้อมเสนอความช่วยเหลือเพื่อลดความขัดแย้ง";
        emotionalGuidelinesEn += "\n• [Empathy Level: High (" + empathy + "%)]: Use Radical Empathy to predict recipient anxiety or fear factor, offering clear backup paths to de-escalate tension.";
    } else {
        emotionalGuidelinesTh += "\n• [Empathy Level: Task-focused (" + empathy + "%)]: เน้นความถูกต้อง ชัดเจน และกติกาการปฏิบัติงานเป็นที่ตั้งหลัก";
        emotionalGuidelinesEn += "\n• [Empathy Level: Task-focused (" + empathy + "%)]: Focus strictly on execution parameters, objective clarity, and process compliance.";
    }

    if (currentLang === 'th') {
        if (uploadedFiles.length > 0) {
            const fileNames = uploadedFiles.map(f => f.name).join(', ');
            const fileContents = uploadedFiles.map(f => `• ${f.name}: ${f.mockContent}`).join('\n');
            fileSystemPrompt = "\n[ข้อมูลวิเคราะห์เอกสารแนบ - " + fileNames + "]:\n" + fileContents + "\n• ข้อกำหนด: ร่างอีเมลให้เชื่อมโยงและสอดคล้องกับสาระสำคัญของเอกสารเหล่านี้อย่างแนบเนียนและเป็นมืออาชีพ";
            docReferenceText = " ตามเอกสารรายละเอียดแนบ (" + fileNames + ") ซึ่งระบุหลักการข้อกำหนดร่วมกันไว้เป็นที่เรียบร้อยครับ";
        }

        if (currentSelectedCategory === 'customer') {
            catHeader = "THE CLOSER: VALUE-FIRST INFLUENCE FRAMEWORK";
            psychologyLayer = "• ใช้จิตวิทยาแบบ Win-Win Selling ค้นหาคุณค่าที่ส่งมอบให้ผู้รับ\n• สร้างอารมณ์ความเชื่อมั่นแต่คงไว้ซึ่งความเคารพในอำนาจหน้าที่อย่างเหมาะสม";
            
            generatedEmailMockA = "เรื่อง: เสนอทางเลือกปรับปรุงคุณภาพและอัปเกรดแคมเปญการตลาดดิจิทัล\n\nเรียน " + who + ",\n\nผมขออนุญาตนำเรียนอัปเดตความคืบหน้าการส่งมอบโครงการแคมเปญการตลาดยุค AI ครับ" + docReferenceText + "\n\nเพื่อส่งมอบผลงานการเรนเดอร์ระดับพรีเมียม (Premium-Aesthetic) ทางทีมออกแบบขอเรียนแจ้งขยับกำหนดการส่งมอบร่างสุดท้ายออกไปอีก 3 วันทำการครับ ซึ่งในระหว่างนี้เพื่อชดเชยเวลาทำงานและแสดงความขอบคุณ ทางเราขอมอบสิทธิ์อัปเกรดโมเดลวิเคราะห์ข้อมูลสถิติแคมเปญเพิ่มให้อีก 1 ชุดฟรีทันทีครับ\n\nขอแสดงความนับถืออย่างสูง,\n" + sender;
            
            generatedEmailMockB = "เรื่อง: แจ้งขยับกำหนดส่งมอบผลงานโครงการการตลาดดิจิทัล AI\n\nเรียน " + who + ",\n\nผมขออนุญาตประสานงานเพื่อแจ้งอัปเดตกำหนดส่งมอบโครงการแคมเปญล่าสุดครับ" + docReferenceText + "\n\nเนื่องด้วยกระบวนการเรนเดอร์กราฟิกจำเป็นต้องใช้เวลาเพิ่มเติมเพื่อให้ได้ชิ้นงานที่ตรงตามมาตรฐานสูงสุด ทางเราประสงค์ขอนัดหมายขยับวันส่งมอบออกไป 3 วันทำการ (เป็นวันที่ [วันที่กำหนด]) โดยเราได้จัดแจงระบบและอัปเกรดการสแกนโมเดลข้อมูลเพิ่มเติมอีก 1 ชุดไว้รองรับระบบให้เรียบร้อยแล้วเพื่อความราบรื่นครับ\n\nขอแสดงความนับถือ,\n" + sender;
            
        } else if (currentSelectedCategory === 'leave') {
            catHeader = "THE TACTICAL VACATION: RISK-MITIGATION VACATION PARADIGM";
            psychologyLayer = "• ถอดจิตวิทยาลดความหวาดระแวงของผู้บริหารด้วย Handover Plan\n• เสนอแผนแก้ไขความเสี่ยงรอบรับงานฉุกเฉิน เพื่อขจัดปัญหาการปฏิเสธ";
            
            generatedEmailMockA = "เรื่อง: รายงานแผนงานล่วงหน้าและขออนุมัติลาพักร้อนช่วงกลางเดือนพฤษภาคม\n\nเรียน " + who + ",\n\nผมใคร่ขอรายงานแผนการทำงานล่วงหน้าและขออนุมัติลากิจพักร้อนเป็นเวลา 5 วันทำการช่วงกลางเดือนพฤษภาคมครับ\n\nเพื่อดูแลการส่งมอบงานทั้งหมดให้อยู่ในความเรียบร้อยร้อยเปอร์เซ็นต์ ผมได้เตรียมข้อมูลแผนการส่งต่องาน (Handover Plan) ไว้พร้อมแล้วครับ\n1. งานหลักทั้งหมดจะจัดส่งเสร็จสิ้นล่วงหน้าในสัปดาห์นี้\n2. คุณเจมส์ (Senior PM) จะสแตนด์บายคอยช่วยเหลือตรวจเช็กเรื่องเร่งด่วนแทนตัวผมในระหว่างนี้\n\nขอขอบพระคุณล่วงหน้าสำหรับเวลาพิจารณาครับ\n\nด้วยความเคารพอย่างสูง,\n" + sender;
            
            generatedEmailMockB = "เรื่อง: ขออนุมัติวันหยุดลาพักร้อน 5 วันทำการและข้อเสนอแผนรับมือความเสี่ยงโครงการ\n\nเรียน " + who + ",\n\nผมเขียนจดหมายฉบับนี้เพื่อขออนุมัติลากิจพักผ่อนประจำปีเป็นเวลา 5 วันทำการ ในช่วงกลางเดือนพฤษภาคมครับ\n\nเพื่อป้องกันความเสี่ยงในการดำเนินงาน ผมได้จัดแจงระบบแผนงานส่งมอบไว้เรียบร้อยแล้ว" + (docReferenceText || '') + ":\n1. งานสำคัญหลักของแคมเปญสัปดาห์นั้นได้รับการจัดส่งล่วงหน้าเรียบร้อยแล้ว\n2. ประสานส่งต่อความรับผิดชอบเรื่องด่วนฉุกเฉินให้คุณเจมส์ (Senior PM) คอยดูแลแทนอย่างเป็นระบบ\n\nจึงเรียนมาเพื่อโปรดอนุมัติคำขอวันลาพักร้อนดังกล่าวครับ\n\nด้วยความเคารพ,\n" + sender;
            
        } else {
            catHeader = "THE DIPLOMAT: SILO-BREAKING COLLABORATIVE DIALOGUE";
            psychologyLayer = "• สลายกำแพงการขัดแย้งข้ามสายงาน (Inter-departmental Silos)\n• เจรจาด้วยการอ้างอิงเป้าหมายที่แชร์ร่วมกันและผลสัมฤทธิ์ปลายทาง";
            
            generatedEmailMockA = "เรื่อง: ประสานงานขอเอกสารใบกำกับงวดงานชุดสุดท้ายเพื่อเตรียมแผนงบซอฟต์แวร์ปีหน้า\n\nสวัสดีครับคุณผู้ช่วย " + who + ",\n\nผมขออนุญาตส่งข้อความมาทักทายและขอประสานงานเรื่องใบกำกับงวดงานแคมเปญชุดสุดท้ายครับ" + docReferenceText + "\n\nตัวใบกำกับนี้จะช่วยปลดล็อกขั้นตอนการอนุมัติและจัดตั้งงบประมาณส่วนกลางปีหน้าของฝ่ายบัญชีการเงิน ซึ่งเป็นงบก้อนสำคัญที่จะช่วยให้ฝ่ายของเราทั้งคู่ได้รับการจัดสรรและอัปเกรดระบบซอฟต์แวร์ทำงานใหม่เพื่อลดชั่วโมงงานของทั้งสองแผนกร่วมกันในปีหน้าอย่างมากครับ\n\nขอแสดงความนับถือ,\n" + sender;
            
            generatedEmailMockB = "เรื่อง: ขอรับใบกำกับงวดงานโครงการชุดสุดท้ายเพื่อนำส่งฝ่ายการเงินอนุมัติงบปีถัดไป\n\nสวัสดีครับคุณผู้ช่วย " + who + ",\n\nผมรบกวนขอใบกำกับงวดงานชุดสุดท้ายสำหรับโครงการล่าสุดเพื่อนำส่งบัญชีด่วนครับ" + docReferenceText + "\n\nฝ่ายการเงินต้องการเอกสารชุดนี้เพื่อสรุปรายการและตั้งงบประมาณซื้อระบบซอฟต์แวร์ปีถัดไป ซึ่งเป็นเป้าหมายหลักที่ทางเราและคุณตกลงร่วมมือกันไว้เพื่ออัปเกรดระบบงานของทั้งสองฝ่ายให้ดีขึ้น หากทางคุณเซ็นเอกสารเรียบร้อยแล้วสามารถแจ้งและจัดส่งกลับหาผมได้เลยครับ\n\nขอแสดงความนับถือ,\n" + sender;
        }

        const safeWho = escapeHtmlForDisplay(who);
        const safeSender = escapeHtmlForDisplay(sender);
        const safeDetail = escapeHtmlForDisplay(finalDetail); // Masked PII details
        const safeTone = escapeHtmlForDisplay(selectedTone);

        const highlightWho = '<span class="var-highlight">' + safeWho + '</span>';
        const highlightSender = '<span class="var-highlight">' + safeSender + '</span>';
        const highlightDetail = '<span class="var-highlight">' + safeDetail + (hasImages ? ' [🖼️ มีภาพแนบ]' : '') + '</span>';
        const highlightTone = '<span class="var-highlight">Assertive: ' + assertive + '%, Urgency: ' + urgency + '%, Empathy: ' + empathy + '%</span>';

        let highlightFileBlock = "";
        if (uploadedFile) {
            highlightFileBlock = '\n• <span class="text-brand-orange font-bold">เอกสารแนบเชิงลึก:</span> <span class="var-highlight">' + escapeHtmlForDisplay(uploadedFile.name) + ' (' + escapeHtmlForDisplay(uploadedFile.size) + ')</span>';
        }

        const terminalFormattedText = "/*\n" +
 " * ===================================================\n" +
 " * SYSTEM PROMPT: " + catHeader + "\n" +
 " * CORE TARGET AI: Gemini / ChatGPT / Claude\n" +
 " * SECURITY RULES: [Privacy Shield Active: " + (privacyActive ? "YES (PII Masked)" : "NO") + "]\n" +
 " * ===================================================\n" +
 " */\n\n" +
 "คุณคือผู้เชี่ยวชาญการเจรจาระดับสูงสไตล์ INFJ-A ที่มี EQ ลึกซึ้งและมีความเป็นมืออาชีพที่สุด\n" +
 "หน้าที่ของคุณคือเขียนหรือปรับดราฟต์อีเมลเจรจาระหว่างหน่วยงานหรือคู่ค้าทางธุรกิจ\n\n" +
 "[ข้อมูลผู้เกี่ยวข้องและบริบทการสื่อสาร]:\n" +
 "• ชื่อผู้รับ / ตำแหน่ง: " + highlightWho + "\n" +
 "• ชื่อผู้ส่ง (ชื่อของคุณ): " + highlightSender + "\n" +
 "• โจทย์ความต้องการดิบ: " + highlightDetail + "\n" +
 "• พารามิเตอร์ระดับอารมณ์ EQ: " + highlightTone + highlightFileBlock + imageNoteTh + "\n\n" +
 "[พฤติกรรมอารมณ์และจิตวิทยาที่ควบคุมการเจรจา (Sliders Mapped)]:" + emotionalGuidelinesTh + "\n" +
 psychologyLayer + "\n" +
 "• ดึงระบบ Radical Empathy ช่วยลดจุดเจ็บปวดของผู้รับ และสร้างแผนสำรองปิดจุดหวาดระแวงล่วงหน้า\n\n" +
 "[กติกาการแสดงผลลัพธ์ (A/B Output Format for SaaS)]:\n" +
 "1. ให้ผลลัพธ์ข้อความอีเมลเจรจาภาษาไทยเปรียบเทียบกันจำนวน 2 แบบ (Option A และ Option B)\n" +
 "   - Option A: Soft & Tactical (เน้นอารมณ์นอบน้อม ทอดสะพาน ประนีประนอมสูง)\n" +
 "   - Option B: Direct & Assertive (เน้นตรงจุดยืน มั่นคง ตรงเป้าหมาย รักษาสิทธิ์และแผนงานของฝ่ายเรา)\n" +
 "2. ปิดท้ายแต่ละทางเลือกด้วยชื่อผู้ส่งเสมอ: " + highlightSender + "\n" +
 "3. ห้ามใช้คำพูดสร้างความตื่นตระหนกหรือการพูดเชิงรุกรานเด็ดขาด";

        document.getElementById('compiled-prompt-output').innerHTML = terminalFormattedText;
        document.getElementById('simulated-draft-output-a').innerText = generatedEmailMockA;
        document.getElementById('simulated-draft-output-b').innerText = generatedEmailMockB;
    } else {
        // English Mode Mega Prompt Compiling
        if (uploadedFiles.length > 0) {
            const fileNames = uploadedFiles.map(f => f.name).join(', ');
            const fileContents = uploadedFiles.map(f => `• ${f.name}: ${f.mockContent}`).join('\n');
            fileSystemPrompt = "\n[Reference Document Analysis - " + fileNames + "]:\n" + fileContents + "\n• Rule: Incorporate these key details naturally and professionally into the draft email.";
            docReferenceText = " as detailed in the attached documents (" + fileNames + ") which outlines the main scope and guidelines.";
        }

        if (currentSelectedCategory === 'customer') {
            catHeader = "THE CLOSER: VALUE-FIRST INFLUENCE FRAMEWORK";
            psychologyLayer = "• Use Win-Win Selling psychology to highlight value delivered to the recipient.\n• Instill confidence while remaining highly respectful of authority and guidelines.";
            
            generatedEmailMockA = "Subject: Proposal for Premium Campaign Deliverables and Upgraded Service\n\nDear " + who + ",\n\nI would like to update you on the progress of our AI marketing campaign launch." + docReferenceText + "\n\nTo ensure we deliver the highest premium aesthetic quality, our design team requires an additional 3 business days for final rendering. To show our appreciation for your partnership, we are pleased to upgrade your account to include 1 free additional analytics model slice.\n\nSincerely,\n" + sender;
            
            generatedEmailMockB = "Subject: Postponement Notification & Compensatory Package for Marketing Campaign\n\nDear " + who + ",\n\nI am writing to notify you that the final deliverable date for our AI campaign has been rescheduled." + docReferenceText + "\n\nTo ensure the graphics rendering meets our top quality tier standards, we are extending the delivery window by 3 business days (to [Target Date]). We have prepared 1 additional free data parsing module upgrade on your dashboard to thank you for your understanding.\n\nBest regards,\n" + sender;
            
        } else if (currentSelectedCategory === 'leave') {
            catHeader = "THE TACTICAL VACATION: RISK-MITIGATION VACATION PARADIGM";
            psychologyLayer = "• Alleviate stakeholder anxiety through a clear Handover Plan.\n• Proactively address project risks during absence to ensure zero rejection.";
            
            generatedEmailMockA = "Subject: Forward Handover Plan & Vacation Request (Mid-May)\n\nDear " + who + ",\n\nI would like to share my forward project schedule and request a 5-day vacation leave for mid-May.\n\nTo ensure zero impact on our workflows, I have completed all core weekly deliverables ahead of schedule and briefed James (Senior PM) to handle any urgent inquiries during my absence. Thank you for your support and time.\n\nBest regards,\n" + sender;
            
            generatedEmailMockB = "Subject: Formal 5-Day Vacation Leave Request & Handover Plan\n\nDear " + who + ",\n\nI am writing to request a formal 5-day vacation leave starting mid-May.\n\nTo mitigate all project risks during my absence, I have set up the following handover plan" + (docReferenceText || '') + ":\n1. Core deliverables are completed in advance.\n2. James (Senior PM) will act as active PM cover for high-priority needs.\n\nSincerely,\n" + sender;
            
        } else {
            catHeader = "THE DIPLOMAT: SILO-BREAKING COLLABORATIVE DIALOGUE";
            psychologyLayer = "• Break cross-departmental silos.\n• Align negotiation points with shared corporate goals and bottom-line growth.";
            
            generatedEmailMockA = "Subject: Collaboration Request: Final Invoice for Next Fiscal Software Funding\n\nHi " + who + ",\n\nHope you are doing well.\n\nI would like to request the final digital campaign invoice" + docReferenceText + " to secure our joint software procurement funding for next year. This upgrade will significantly decrease manual hours for both of our teams.\n\nSincerely,\n" + sender;
            
            generatedEmailMockB = "Subject: Digital Invoice Submission Request for Mutual Software Budget Allocation\n\nHi " + who + ",\n\nPlease assist in sharing the final invoice for the digital campaign project." + docReferenceText + "\n\nOur accounts team requires this invoice to lock in our joint software license budget, which directly aligns with our shared department growth goals. Thank you for your fast action.\n\nBest regards,\n" + sender;
        }

        const safeWho = escapeHtmlForDisplay(who);
        const safeSender = escapeHtmlForDisplay(sender);
        const safeDetail = escapeHtmlForDisplay(finalDetail);
        const safeTone = escapeHtmlForDisplay(selectedTone);

        const highlightWho = '<span class="var-highlight">' + safeWho + '</span>';
        const highlightSender = '<span class="var-highlight">' + safeSender + '</span>';
        const highlightDetail = '<span class="var-highlight">' + safeDetail + (hasImages ? ' [🖼️ Image Attached]' : '') + '</span>';
        const highlightTone = '<span class="var-highlight">Assertive: ' + assertive + '%, Urgency: ' + urgency + '%, Empathy: ' + empathy + '%</span>';

        let highlightFileBlock = "";
        if (uploadedFile) {
            highlightFileBlock = '\n• <span class="text-brand-orange font-bold">Attached Doc:</span> <span class="var-highlight">' + escapeHtmlForDisplay(uploadedFile.name) + ' (' + escapeHtmlForDisplay(uploadedFile.size) + ')</span>';
        }

        const terminalFormattedText = "/*\n" +
 " * ===================================================\n" +
 " * SYSTEM PROMPT: " + catHeader + "\n" +
 " * CORE TARGET AI: Gemini / ChatGPT / Claude\n" +
 " * SECURITY RULES: [Privacy Shield Active: " + (privacyActive ? "YES (PII Masked)" : "NO") + "]\n" +
 " * ===================================================\n" +
 " */\n\n" +
 "You are an expert negotiator with high emotional intelligence (INFJ-A style) and professional tone.\n" +
 "Your task is to draft a clean email based on the context and parameters provided below.\n\n" +
 "[COMMUNICATION CONTEXT]:\n" +
 "• Recipient / Position: " + highlightWho + "\n" +
 "• Sender Name (Your Name): " + highlightSender + "\n" +
 "• Raw Context Notes: " + highlightDetail + "\n" +
 "• Target EQ Parameters: " + highlightTone + highlightFileBlock + imageNoteEn + "\n\n" +
 "[EMOTIONAL DIRECTION (Sliders Mapped)]:" + emotionalGuidelinesEn + "\n" +
 psychologyLayer + "\n" +
 "• Apply Radical Empathy to address the fears/goals of the recipient while maintaining business objectives.\n\n" +
 "[OUTPUT FORMAT INSTRUCTIONS]:\n" +
 "1. Draft 2 formal business emails in English.\n" +
 "   - Option A: Soft & Tactical (Polite tone, relationship-focused, compromise-first)\n" +
 "   - Option B: Direct & Assertive (Direct tone, task-focused, protective of our timeline/budget)\n" +
 "2. Conclude with a warm, professional closing followed by the Sender Name: " + highlightSender + "\n" +
 "3. Ensure both options are concise and easy to read.";

        document.getElementById('compiled-prompt-output').innerHTML = terminalFormattedText;
        document.getElementById('simulated-draft-output-a').innerText = generatedEmailMockA;
        document.getElementById('simulated-draft-output-b').innerText = generatedEmailMockB;
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
async function submitFeedback() {
    const fbText = document.getElementById('feedback-text').value.trim();
    if (!fbText) {
        showToast("กล่องข้อความว่างเปล่า", "โปรดป้อนข้อคิดเห็นหรือข้อเสนอแนะในการอัปเกรดฐานพรอพท์ก่อนครับ", "warning");
        return;
    }

    const fbFormPanel = document.getElementById('feedback-form-panel');
    const fbSuccessPanel = document.getElementById('feedback-success-panel');
    const webhookUrl = localStorage.getItem('saba_discord_webhook') || (import.meta && import.meta.env ? import.meta.env.VITE_DISCORD_WEBHOOK_URL : '') || '';

    showToast("กำลังส่งข้อมูล", "กำลังยิงส่งความคิดเห็นไปยัง Discord ห้องหลังบ้าน...", "info");

    if (webhookUrl) {
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: "SABA PROMPT Feedback Bot",
                    avatar_url: "https://sabaprompt.vercel.app/logo-web-rev01.png",
                    embeds: [{
                        title: "📝 ข้อเสนอแนะใหม่จากผู้ใช้งาน SABA PROMPT",
                        description: fbText,
                        color: 16355606, // Brand Orange #F97316
                        fields: [
                            { name: "👤 ผู้ส่ง", value: typeof currentUser === 'string' ? currentUser : (currentUser && currentUser.name ? currentUser.name : 'Guest Mode'), inline: true },
                            { name: "🌐 ภาษาใช้งาน", value: (currentLang || 'th').toUpperCase(), inline: true },
                            { name: "⏰ เวลาส่งข้อมูล", value: new Date().toLocaleString('th-TH'), inline: false }
                        ],
                        footer: { text: "SABA PROMPT Live Discord Gateway" }
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Discord Gateway Response: ${response.status}`);
            }

            fbFormPanel.classList.add('hidden');
            fbSuccessPanel.classList.remove('hidden');
            showToast("ส่งเข้า Discord สำเร็จ", "ส่งข้อแนะนำของคุณยิงตรงเข้าห้อง Discord เรียบร้อยแล้ว ขอบพระคุณครับ!", "success");
            SabaAnalytics.trackEvent("feedback_submitted_discord", { content: fbText });
        } catch (error) {
            console.error("Failed to send Discord webhook:", error);
            showToast("ส่งเข้า Discord ไม่สำเร็จ", `ข้อผิดพลาด: ${error.message}`, "error");
        }
    } else {
        setTimeout(() => {
            fbFormPanel.classList.add('hidden');
            fbSuccessPanel.classList.remove('hidden');
            showToast(
                "บันทึกความคิดเห็นแล้ว", 
                "บันทึกข้อมูลเรียบร้อย! (คุณสามารถใส่ Discord Webhook URL ในหน้าตั้งค่าเฟืองเพื่อยิงเข้า Discord จริงได้เลยครับ)", 
                "success"
            );
            SabaAnalytics.trackEvent("feedback_submitted_local", { content: fbText });
        }, 600);
    }
}

// --- 10. TOAST NOTIFICATION UTILITY ---
function showToast(title, message, type = "info") {
    // Only show errors and warnings, silence info and success to prevent cluttering the view
    if (type !== "error" && type !== "warning") {
        return;
    }
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
    const savedDiscord = localStorage.getItem('saba_discord_webhook') || '';
    const savedGoogleClientId = localStorage.getItem('saba_google_client_id') || '';
    const savedPromptPayId = localStorage.getItem('saba_promptpay_id') || '';
    const promptpayEl = document.getElementById('promptpay-id-input');
    if (promptpayEl) promptpayEl.value = savedPromptPayId;
    
    document.getElementById('api-provider').value = savedProvider;
    toggleApiFields();
    
    document.getElementById('api-key').value = savedKey;
    if (savedModel) {
        document.getElementById('api-model').value = savedModel;
    }
    const discordEl = document.getElementById('discord-webhook-url');
    if (discordEl) discordEl.value = savedDiscord;
    const googleEl = document.getElementById('google-client-id');
    if (googleEl) googleEl.value = savedGoogleClientId;
}

function saveApiSettings() {
    const provider = document.getElementById('api-provider').value;
    const key = document.getElementById('api-key').value.trim();
    const model = document.getElementById('api-model').value;
    const discordUrl = document.getElementById('discord-webhook-url') ? document.getElementById('discord-webhook-url').value.trim() : '';
    const googleClientId = document.getElementById('google-client-id') ? document.getElementById('google-client-id').value.trim() : '';
    
    localStorage.setItem('saba_api_provider', provider);
    localStorage.setItem('saba_api_key', key);
    localStorage.setItem('saba_api_model', model);
    localStorage.setItem('saba_discord_webhook', discordUrl);
    localStorage.setItem('saba_google_client_id', googleClientId);
    const promptPayId = document.getElementById('promptpay-id-input') ? document.getElementById('promptpay-id-input').value.trim() : '';
    localStorage.setItem('saba_promptpay_id', promptPayId);
    
    closeApiSettingsModal();
    showToast(
        currentLang === 'en' ? "Settings Saved" : "บันทึกการตั้งค่าแล้ว",
        currentLang === 'en' ? "Saved API, Discord Webhook, & Google Client ID!" : "บันทึกการตั้งค่า API, Discord Webhook และ Google Client ID เรียบร้อยแล้ว!",
        "success"
    );
    SabaAnalytics.trackEvent("api_keys_configured", { provider, model, hasKey: !!key, hasDiscord: !!discordUrl, hasGoogle: !!googleClientId });
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
        closePricingModal();
        openPaymentModal();
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
window.setLanguage = setLanguage;
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


// --- SABA PROMPT Global SaaS Upgrades Helper Functions ---
function sanitizePII(text, sender, recipient) {
    if (!text) return "";
    let cleanText = text;
    
    // Mask specific sender and recipient names if they appear in text (case-insensitive)
    if (sender && sender !== "[ชื่อของคุณ]") {
        const escapedSender = sender.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reSender = new RegExp(escapedSender, 'gi');
        cleanText = cleanText.replace(reSender, '[SENDER_NAME]');
    }
    if (recipient) {
        const escapedRecipient = recipient.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reRecipient = new RegExp(escapedRecipient, 'gi');
        cleanText = cleanText.replace(reRecipient, '[RECIPIENT_NAME]');
    }

    // Mask phone numbers (e.g. 081-234-5678, 02-345-6789, +66 81 234 5678, etc.)
    const phoneRegex = /(\+?66|0)[-.\s]?\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
    cleanText = cleanText.replace(phoneRegex, '[PHONE_REDACTED]');

    // Mask email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    cleanText = cleanText.replace(emailRegex, '[EMAIL_REDACTED]');

    // Mask currency/amounts (e.g. 50,000 บาท, $10,000, 3,000 THB)
    const currencyRegex = /\d{1,3}(,\d{3})*(\.\d{2})?\s*(บาท|THB|USD|\$|dollars?)/gi;
    cleanText = cleanText.replace(currencyRegex, '[BUDGET_REDACTED]');
    
    return cleanText;
}

function updateSliderVal(sliderId, value) {
    const valSpan = document.getElementById('val-' + sliderId);
    if (valSpan) {
        valSpan.innerText = value + '%';
    }
}

function copyDraft(type) {
    const outputId = type === 'A' ? 'simulated-draft-output-a' : 'simulated-draft-output-b';
    const textToCopy = document.getElementById(outputId).innerText;
    
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
        currentLang === 'en' ? "Copied Option " + type + "!" : "คัดลอกดราฟต์ " + type + " สำเร็จ!", 
        currentLang === 'en' ? "Copied clean draft to your clipboard." : "คัดลอกร่างจดหมายทางเลือก " + type + " ลงในคลิปบอร์ดแล้วครับ!", 
        "success"
    );
    SabaAnalytics.trackEvent("copy_draft_ab", { type: type });
}

function openMailClient(type) {
    const outputId = type === 'A' ? 'simulated-draft-output-a' : 'simulated-draft-output-b';
    const rawText = document.getElementById(outputId).innerText;
    if (!rawText) {
        showToast("พบข้อผิดพลาด", "ไม่พบเนื้อความในการส่งออก โปรดป้อนข้อมูลและรัน Mega Prompt ก่อนครับ", "warning");
        return;
    }
    
    let subject = "SABA PROMPT Email Draft";
    let body = rawText;
    
    const lines = rawText.split('\n');
    if (lines[0] && (lines[0].toLowerCase().startsWith('subject:') || lines[0].toLowerCase().startsWith('เรื่อง:'))) {
        subject = lines[0].substring(lines[0].indexOf(':') + 1).trim();
        body = lines.slice(1).join('\n').trim();
    }
    
    window.location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    SabaAnalytics.trackEvent("mailto_opened", { type: type });
}

// Expose functions to window scope for HTML onclick access
window.updateSliderVal = updateSliderVal;
window.copyDraft = copyDraft;
window.openMailClient = openMailClient;
window.sanitizePII = sanitizePII;
window.showToast = showToast;


// --- Quota Management & Billing Sandbox Functions ---
function updateQuotaIndicator() {
    const tier = localStorage.getItem('saba_subscription_tier') || 'free';
    
    // Update VIP badge to show only BASIC TIER or PRO TIER without sent counts
    const badge = document.querySelector('[data-i18n="vip_badge"]');
    if (badge) {
        badge.innerText = tier === 'pro' ? (currentLang === 'en' ? "PRO TIER" : "PRO TIER") : (currentLang === 'en' ? "BASIC TIER" : "BASIC TIER");
        if (tier === 'pro') {
            badge.className = "text-[10px] uppercase tracking-wider font-extrabold text-emerald-500 px-1.5 py-0.2 bg-emerald-500/10 rounded-full border border-emerald-500/20";
        } else {
            badge.className = "text-[10px] uppercase tracking-wider font-extrabold text-brand-orange px-1.5 py-0.2 bg-brand-orange/10 rounded-full border border-brand-orange/20";
        }
    }
}

function openPaymentModal() {
    document.getElementById('payment-modal').classList.remove('hidden');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    SabaAnalytics.trackEvent("modal_opened", { name: "payment" });
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

function togglePaymentForm(method) {
    if (method === 'card') {
        document.getElementById('payment-form-card').classList.remove('hidden');
        document.getElementById('payment-form-mobile').classList.add('hidden');
        document.getElementById('pay-method-card').checked = true;
    } else {
        document.getElementById('payment-form-card').classList.add('hidden');
        document.getElementById('payment-form-mobile').classList.remove('hidden');
        document.getElementById('pay-method-mobile').checked = true;
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    SabaAnalytics.trackEvent("payment_method_switched", { method });
}

function simulatePaymentSuccess() {
    localStorage.setItem('saba_subscription_tier', 'pro');
    localStorage.setItem('saba_daily_emails_sent', '0'); // reset sent count upon upgrade
    
    closePaymentModal();
    updateQuotaIndicator();
    
    showToast(
        currentLang === 'en' ? "Subscription Active!" : "สมัครสมาชิกสำเร็จ!",
        currentLang === 'en' ? "Welcome to SABA PROMPT Pro! Daily limit expanded to 200 emails." : "ยินดีต้อนรับสู่ระดับ Pro Architect! ปลดล็อกโควตา 200 ครั้ง/วัน สำเร็จแล้วครับ",
        "success"
    );
    SabaAnalytics.trackEvent("plan_upgraded", { plan: "pro" });
}

// Startup Quota Reset Check
(function() {
    const todayStr = new Date().toISOString().split('T')[0];
    let lastReset = localStorage.getItem('saba_last_reset_date') || '';
    if (lastReset !== todayStr) {
        localStorage.setItem('saba_daily_emails_sent', '0');
        localStorage.setItem('saba_last_reset_date', todayStr);
    }

    if (!localStorage.getItem('saba_subscription_tier')) {
        localStorage.setItem('saba_subscription_tier', 'free');
    }

    // Delay update slightly to ensure DOM elements exist
    setTimeout(updateQuotaIndicator, 300);
})();

// Bind to window
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.togglePaymentForm = togglePaymentForm;
window.simulatePaymentSuccess = simulatePaymentSuccess;
window.updateQuotaIndicator = updateQuotaIndicator;

// --- DYNAMIC PROMPTPAY EMVCO PAYLOAD & QR GENERATOR ---
function crc16Ccitt(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function generatePromptPayPayload(target, amount) {
    let sanitized = (target || '0812345678').replace(/[^0-9]/g, '');
    let targetTag = '';
    
    if (sanitized.length === 10 && sanitized.startsWith('0')) {
        const mobileFormatted = '0066' + sanitized.substring(1);
        targetTag = '0113' + mobileFormatted;
    } else if (sanitized.length === 13) {
        targetTag = '0213' + sanitized;
    } else {
        targetTag = '01130066812345678';
    }

    const merchantInfo = '0016A000000677010111' + targetTag;
    const tag29 = '29' + merchantInfo.length.toString().padStart(2, '0') + merchantInfo;
    
    let rawPayload = '000201' + '010212' + tag29 + '5303764';

    if (amount && parseFloat(amount) > 0) {
        const amountStr = parseFloat(amount).toFixed(2);
        rawPayload += '54' + amountStr.length.toString().padStart(2, '0') + amountStr;
    }

    rawPayload += '5802TH' + '6304';
    const checksum = crc16Ccitt(rawPayload);
    return rawPayload + checksum;
}

function updatePromptPayQR(amount) {
    const customInput = document.getElementById('promptpay-custom-amount');
    let finalAmount = amount;
    if (amount === 'custom' && customInput) {
        finalAmount = customInput.value || '29';
    }
    
    const target = localStorage.getItem('saba_promptpay_id') || (import.meta && import.meta.env ? import.meta.env.VITE_PROMPTPAY_ID : '') || (typeof process !== 'undefined' && process.env ? process.env.VITE_PROMPTPAY_ID : '') || '0812345678';
    const payload = generatePromptPayPayload(target, finalAmount);
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;
    
    const qrEl = document.getElementById('promptpay-qr-img');
    if (qrEl) {
        qrEl.src = qrImgUrl;
    }
    
    const displayEl = document.getElementById('promptpay-amount-display');
    if (displayEl) {
        displayEl.innerText = `ยอดสแกนตั้งอัตโนมัติ: ${parseFloat(finalAmount || 0).toFixed(2)} บาท`;
    }
    
    SabaAnalytics.trackEvent("promptpay_amount_changed", { amount: finalAmount });
}
window.updatePromptPayQR = updatePromptPayQR;
window.generatePromptPayPayload = generatePromptPayPayload;

function handleGoogleUserInfoResponse(userInfo) {
    const userName = userInfo.name || userInfo.email || 'Google User';
    const userPicture = userInfo.picture || '';

    currentUser = userName;
    localStorage.setItem('saba_session_user', userName);
    showDashboard();
    
    const badge = document.getElementById('session-user-badge');
    if (badge && userPicture) {
        badge.innerHTML = `<img src="${userPicture}" class="w-4 h-4 rounded-full inline mr-1 object-cover"/> ${userName}`;
    }

    showToast("เข้าสู่ระบบด้วย Google สำเร็จ", `ยินดีต้อนรับคุณ ${userName} เข้าสู่ SABA PROMPT`, "success");
    SabaAnalytics.trackEvent("google_login_success", { name: userName });
}

function handleGoogleSignInClick() {
    const clientId = localStorage.getItem('saba_google_client_id') || 
                     (import.meta && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : '') || 
                     (typeof process !== 'undefined' && process.env ? process.env.VITE_GOOGLE_CLIENT_ID : '') || '';
                     
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id && clientId) {
        showToast("กำลังเชื่อมต่อ Google", "กำลังเปิดหน้าต่างล็อกอิน Google Account ของแท้...", "info");
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleJWTResponse
        });
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                if (google.accounts.oauth2) {
                    const client = google.accounts.oauth2.initTokenClient({
                        client_id: clientId,
                        scope: 'email profile openid',
                        callback: (tokenResponse) => {
                            if (tokenResponse.access_token) {
                                fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                                })
                                .then(r => r.json())
                                .then(userInfo => {
                                    handleGoogleUserInfoResponse(userInfo);
                                });
                            }
                        }
                    });
                    client.requestAccessToken();
                }
            }
        });
    } else {
        simulateThirdPartyLogin('Google');
    }
}
window.handleGoogleSignInClick = handleGoogleSignInClick;
window.handleGoogleUserInfoResponse = handleGoogleUserInfoResponse;

function launchGooglePickerSDK() {
    const clientId = localStorage.getItem('saba_google_client_id') || 
                     (import.meta && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : '') || 
                     (typeof process !== 'undefined' && process.env ? process.env.VITE_GOOGLE_CLIENT_ID : '') || '';
    const apiKey = localStorage.getItem('saba_api_key') || 
                   (import.meta && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : '') || 
                   (typeof process !== 'undefined' && process.env ? process.env.VITE_GEMINI_API_KEY : '') || '';

    if (typeof gapi !== 'undefined' && typeof google !== 'undefined' && google.picker && clientId) {
        showToast("กำลังเปิด Google Drive", "กำลังดึงข้อมูลจาก Google Drive API...", "info");
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            callback: (tokenResponse) => {
                if (tokenResponse.access_token) {
                    const picker = new google.picker.PickerBuilder()
                        .addView(google.picker.ViewId.DOCS)
                        .setOAuthToken(tokenResponse.access_token)
                        .setDeveloperKey(apiKey)
                        .setCallback((data) => {
                            if (data.action === google.picker.Action.PICKED) {
                                const doc = data.docs[0];
                                showToast("เลือกไฟล์สำเร็จ", `นำเข้าเอกสาร ${doc.name} จาก Google Drive เรียบร้อยแล้ว`, "success");
                                uploadedFile = {
                                    name: doc.name,
                                    size: 'Google Drive',
                                    mockContent: `[เอกสารจาก Google Drive: ${doc.name}]`
                                };
                                updateFileStatusUI();
                                closeGoogleDriveModal();
                            }
                        })
                        .build();
                    picker.setVisible(true);
                }
            }
        });
        tokenClient.requestAccessToken();
    } else {
        showToast("เปิดคลัง Google Drive", "นำเข้าไฟล์ตัวอย่างจาก Google Drive...", "info");
        selectGoogleDriveFile('Q3_Performance_Review.pdf', '2.4 MB', 'pdf', 'สรุปผลประกอบการไตรมาส 3');
    }
}
window.launchGooglePickerSDK = launchGooglePickerSDK;

function processRealPaymentConfirmation() {
    localStorage.setItem('saba_subscription_tier', 'pro');
    localStorage.setItem('saba_session_vip', 'true');
    closePaymentModal();
    updateQuotaIndicator();
    showToast(
        currentLang === 'en' ? "Pro Tier Activated!" : "ยกระดับเป็น Pro Tier สำเร็จ!", 
        currentLang === 'en' ? "Your account has been upgraded to 200 drafts/day Pro status!" : "บัญชีของคุณได้รับการอัปเกรดเป็น Pro Tier (โควตา 200 เมล/วัน) เรียบร้อยแล้ว!", 
        "success"
    );
    SabaAnalytics.trackEvent("subscription_upgraded", { tier: "pro" });
}
window.processRealPaymentConfirmation = processRealPaymentConfirmation;
window.processLocalFile = processLocalFile;

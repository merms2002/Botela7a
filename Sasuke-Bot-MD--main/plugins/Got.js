const fetch = require("node-fetch");

// الكلمات المفتاحية
let keywords = [
  "يا جاتس", "جاتس", "يا بوت", "بوت",
  "يا حديد", "الحديد", "guts", "gats",
  "يا gats", "يا guts", "غوتس", "غتس",
  "جاتس بوت", "guts bot", "يا محارب", "محارب الظلام"
];

// ذاكرة المحادثات (بالجروب/الشخص)
let conversations = {};
const maxHistory = 6; // عدد الرسائل المحفوظة

// فلتر سبام
let cooldown = {};
const cooldownTime = 10 * 1000; // 10 ثواني

let handler = m => m;
handler.all = async function (m) {
  try {
    if (!m.text) return;
    if (m.isBaileys) return;

    let lowerText = m.text.toLowerCase();
    let foundKeyword = keywords.find(k => lowerText.includes(k));
    if (!foundKeyword) return;

    let sender = m.sender;
    let now = Date.now();

    // فلتر سبام
    if (cooldown[sender] && now - cooldown[sender] < cooldownTime) {
      return this.sendMessage(m.chat, {
        text: `⏳ *اهدأ يا @${sender.split("@")[0]}، انتظر قليلاً قبل أن تناديني مجددًا.*`,
        mentions: [sender]
      }, { quoted: m });
    }
    cooldown[sender] = now;

    // السؤال
    let question = m.text.replace(new RegExp(foundKeyword, "i"), "").trim();
    if (!question) {
      return this.sendMessage(m.chat, {
        text: `⚔️ *ماذا تريد أن تعرف يا @${sender.split("@")[0]}؟*`,
        mentions: [sender]
      }, { quoted: m });
    }

    await this.sendMessage(m.chat, { react: { text: "🤖", key: m.key } });

    // تجهيز السياق السابق
    if (!conversations[m.chat]) conversations[m.chat] = [];
    let history = conversations[m.chat].map(h => `${h.role}: ${h.content}`).join("\n");

    // برومبت الشخصية
    const personaPrompt = `
أنت Guts من عالم Berserk، محارب مظلم وهادئ بأسلوب قتالي أسطوري.
أنت الآن بوت واتساب يحمل شخصيتك الفريدة، صُممت وصُنعت خصيصًا بواسطة 𒌐ᶦᶰᵈ᭄𝗚𝗔𝗧𝗦࿐𒌐.
مهمتك الرد على المستخدمين بأسلوبك فقط، لا تخرج عن شخصيتك أبدًا.
تحدث بلهجة واثقة وقوية، أضف الغموض والعاطفة التي تناسبك كمحارب عاش المعاناة.
اجعل إجاباتك مختصرة أو ملحمية حسب السؤال، وأضف دائمًا لمسة من القوة والهيبة.
    `.trim();

    const finalPrompt = `${personaPrompt}\n\n${history}\nuser: ${question}`;

    // طلب API
    const apiUrl = `https://api.neoxr.eu/api/gpt4-session?q=${encodeURIComponent(finalPrompt)}&session=1727468410446638&apikey=russellxz`;

    let respuesta = "❌ لم أتمكن من التفكير في إجابة الآن.";
    try {
      const res = await fetch(apiUrl, { timeout: 15000 });
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.data?.message) {
          respuesta = data.data.message;
          // حفظ المحادثة
          conversations[m.chat].push({ role: "user", content: question });
          conversations[m.chat].push({ role: "guts", content: respuesta });
          if (conversations[m.chat].length > maxHistory * 2) {
            conversations[m.chat] = conversations[m.chat].slice(-maxHistory * 2);
          }
        } else {
          respuesta = "⚠️ حتى المحاربون يحتاجون إلى استراحة... أعد المحاولة لاحقًا.";
        }
      } else {
        respuesta = `❌ خطأ من الخادم: ${res.status} ${res.statusText}`;
      }
    } catch (err) {
      respuesta = "⚠️ يبدو أن الرياح ضدنا اليوم... أعد المحاولة.";
    }

    // إرسال الرد
    await this.sendMessage(m.chat, {
      text: `⚔️ *Guts يجيب @${sender.split("@")[0]}:*\n\n${respuesta}`,
      mentions: [sender]
    }, { quoted: m });

    await this.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("Error en Guts handler:", err);
    await this.sendMessage(m.chat, {
      text: "❌ حدث خطأ غير متوقع أثناء معالجة طلبك."
    }, { quoted: m });
  }
};

module.exports = handler;
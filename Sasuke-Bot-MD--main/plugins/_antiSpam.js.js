import {performance} from 'perf_hooks';

const handler = async (m, {conn, text}) => {
    // بداية العد للوقت
    const start = performance.now();

    // مصفوفة نصوص تظهر خطوة بخطوة كأنها عملية اختراق وهمية
    const hawemod = [
        "جاري حقن البرمجيات الخبيثة...",
        " █ 10%",
        " █ █ 20%",
        " █ █ █ 30%",
        " █ █ █ █ 40%",
        " █ █ █ █ █ 50%",
        " █ █ █ █ █ █ 60%",
        " █ █ █ █ █ █ █ 70%",
        " █ █ █ █ █ █ █ █ 80%",
        " █ █ █ █ █ █ █ █ █ 90%",
        " █ █ █ █ █ █ █ █ █ █ 100%",
        "نظام الاختراق قيد التشغيل.. \nالاتصال بالخادم فشل: خطأ 404",
        "تم الاتصال بالجهاز بنجاح... \nجاري استلام البيانات...",
        "تم استخراج البيانات من الجهاز 100% \nجاري حذف الأدلة والقضاء على البرمجيات الخبيثة...",
        "تم الانتهاء من الاختراق",
        "جارٍ إرسال سجلات البيانات...",
        "تم إرسال البيانات بنجاح وقطع الاتصال",
        "تم تنظيف سجلات النظام"
    ];

    // إرسال رسالة بداية
    let { key } = await conn.sendMessage(m.chat, { text: `*☠️ بدء عملية الاختراق الوهمية !! ☠️*` }, { quoted: m });

    // عرض كل رسالة في المصفوفة بفاصل زمني 1 ثانية مع تعديل نفس الرسالة
    for (let i = 0; i < hawemod.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await conn.sendMessage(m.chat, { text: hawemod[i], edit: key }, { quoted: m });
    }

    // نهاية العد للوقت (لو عايز تستخدمه ممكن)
    const end = performance.now();
    const executionTime = end - start;
};

handler.help = ['doxxing <الاسم> | <@المستخدم>'];
handler.tags = ['fun'];
handler.command = /^doxxing/i;

export default handler;

function getRandomValue(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
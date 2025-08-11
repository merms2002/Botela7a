import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        if (!args || !args[0]) {
            return conn.reply(m.chat, `🪐 من فضلك أدخل رابط Mediafire.\n*مثال:* ${usedPrefix}${command} https://www.mediafire.com/file/c2fyjyrfckwgkum/ZETSv1%25282%2529.zip/file`, m);
        }

        if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) {
            return conn.reply(m.chat, `❌ الرابط غير صالح، تأكد من أنه رابط Mediafire صحيح.`, m);
        }

        // رد فعل تعبير عن الانتظار
        m.react('🕒');

        // استدعاء API خارجي لتحميل بيانات الملف
        const json = await (await fetch(`https://api.sylphy.xyz/download/mediafire?url=${args[0]}&apikey=tesis-te-amo`)).json()

        if (!json.data.download) {
            return conn.reply(m.chat, "⚠️ لم نتمكن من الحصول على معلومات الملف.", m);
        }

        let info = `
📁 *اسم الملف:* ${json.data.filename}
⚖️ *الحجم:* ${json.data.size}
🔗 *الرابط:* ${args[0]}
🗂️ *نوع الملف:* ${json.data.mimetype}
`;
        m.reply(info);

        // إرسال الملف للمستخدم
        await conn.sendFile(m.chat, json.data.download, json.data.filename, "", m);
    } catch (e) {
        return conn.reply(m.chat, `❌ حدث خطأ: ${e.message}`, m);
    }
};

handler.command = handler.help = ['mediafire', 'mf', 'mfdl'];
handler.tags = ["تحميل", "descargas"];
export default handler;
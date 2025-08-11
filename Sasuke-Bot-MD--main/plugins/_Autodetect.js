/**
 * كود بوت واتساب - handler قبل أي رسالة 
 * © 2025 بواسطة 𒌐ᶦᶰᵈ᭄𝗚𝗔𝗧𝗦࿐𒌐
 * مفيش إعادة نشر أو استخدام بدون إذن صاحب الكود
 */

import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync} from 'fs'
import path from 'path'

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
    // لو مفيش نوع الحدث أو مش في جروب نخرج
    if (!m.messageStubType || !m.isGroup) return

    // بيانات رسالة مرجعية شكلها كأنها جهة اتصال افتراضية 
    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "AlienMenu"
        },
        message: {
            locationMessage: {
                name: "*Sasuke Bot MD 🌀*",
                jpegThumbnail: await (await fetch('https://files.catbox.moe/1j784p.jpg')).buffer(),
                vcard:
                    "BEGIN:VCARD\n" +
                    "VERSION:3.0\n" +
                    "N:;Sasuke;;;\n" +
                    "FN:Sasuke Bot\n" +
                    "ORG:Barboza Developers\n" +
                    "TITLE:\n" +
                    "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
                    "item1.X-ABLabel:Alien\n" +
                    "X-WA-BIZ-DESCRIPTION:🛸 نداء جماعي عالمي بأناقة.\n" +
                    "X-WA-BIZ-NAME:Sasuke\n" +
                    "END:VCARD"
            }
        },
        participant: "0@s.whatsapp.net"
    }

    // جلب إعدادات الشات من قاعدة البيانات
    let chat = global.db.data.chats[m.chat]
    // اسم المستخدم المرسل، مع علامة @
    let usuario = `@${m.sender.split`@`[0]}`
    // صورة البروفايل بتاعة الجروب أو صورة افتراضية لو مش موجودة
    let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

    // الرسائل اللي هتبعت حسب نوع الحدث
    let nombre = `✨ ${usuario} *غير اسم الجروب* ✨\n\n> 📝 *الاسم الجديد:* _${m.messageStubParameters[0]}_`
    let foto = `📸 *في صورة جديدة للجروب!* 📸\n\n> 💫 تم بواسطة: ${usuario}`
    let edit = `⚙️ ${usuario} عدل إعدادات الجروب.\n\n> 🔒 دلوقتي *${m.messageStubParameters[0] == 'on'? 'المشرفين بس': 'الكل'}* يقدروا يعدلوا الجروب.`
    let newlink = `🔗 *تم إعادة تعيين رابط الجروب!* 🔗\n\n> 💫 تم بواسطة: ${usuario}`
    let status = `🗣️ الجروب ات${m.messageStubParameters[0] == 'on'? 'قفل': 'فتح'} بواسطة ${usuario}!\n\n> 💬 دلوقتي *${m.messageStubParameters[0] == 'on'? 'المشرفين بس': 'الكل'}* يقدروا يكتبوا.`
    let admingp = `👑 @${m.messageStubParameters[0].split`@`[0]} *بقى مشرف في الجروب!* 👑\n\n> 💫 بواسطة: ${usuario}`
    let noadmingp = `🗑️ @${m.messageStubParameters[0].split`@`[0]} *ما بقاش مشرف.* 🗑️\n\n> 💫 بواسطة: ${usuario}`

    // بناءً على نوع الحدث نرسل الرسالة المناسبة لو الخاصية detect مفعلة في الداتا
    if (chat.detect && m.messageStubType == 21) {
        await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 22) {
        await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 23) {
        await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 25) {
        await this.sendMessage(m.chat, { text: edit, mentions: [m.sender]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 26) {
        await this.sendMessage(m.chat, { text: status, mentions: [m.sender]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 29) {
        await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]}, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 30) {
        await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]}, { quoted: fkontak })
    } else {
        console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters,
            type: WAMessageStubType[m.messageStubType],
        })
    }
}

export default handler
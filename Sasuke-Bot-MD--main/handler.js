import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.limit = false
        try {
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.limit))
                    user.limit = 10
                if (!('premium' in user)) 
                    user.premium = false
                if (!user.premium) 
                    user.premiumTime = 0
                if (!('registered' in user))
                    user.registered = false
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name
                    if (!isNumber(user.age))
                        user.age = -1
                    if (!isNumber(user.regTime))
                        user.regTime = -1
                }
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!('useDocument' in user))
                    user.useDocument = false
                if (!isNumber(user.level))
                    user.level = 0
                if (!isNumber(user.bank))
                    user.bank = 0
            } else 
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    useDocument: true,
                    bank: 0,
                    level: 0,
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('bienvenida' in chat))
                    chat.bienvenida = false 
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('antilinkxxx' in chat))
                    chat.antiLinkxxx = false
                if (!('detect' in chat)) 
                    chat.detect = true
                if (!('onlyLatinos' in chat))
                    chat.onlyLatinos = false
                if (!('audios' in chat))
                    chat.audios = false
                if (!('modoadmin' in chat))
                    chat.modoadmin = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
                if (!('antiLag' in chat))
                    chat.antiLag = false
                if (!('per' in chat))
                    chat.per = []
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    bienvenida: false,
                    antiLink: false,
                    antilinkxxx: false,
                    detect: true,
                    onlyLatinos: false,
                    nsfw: false,
                    audios: false,
                    modoadmin: false, 
                    expired: 0, 
                    antiLag: false,
                    per: [],
                }
            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('antiPrivate' in settings)) settings.antiPrivate = false
                if (!('antiPrivate2' in settings)) settings.antiPrivate2 = false
                if (!('antiBot' in settings)) settings.antiBot2 = false
                if (!('antiSpam' in settings)) settings.antiSpam = false
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                antiPrivate: false,
                antiPrivate2: false,
                antiBot: true,
                antiSpam: true,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }
        // Tesis estuvo aquí 🤤
       const mainBot = global?.conn?.user?.jid
       const chat = global.db.data.chats[m.chat] || {}
       const isSubbs = chat.antiLag === true
       const allowedBots = chat.per || []
       if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)
       const isAllowed = allowedBots.includes(this?.user?.jid)
       if (isSubbs && !isAllowed) 
            return
        // --
        if (opts['nyimak'])  return
        if (!m.fromMe && opts['self'])  return
        if (opts['swonly'] && m.chat !== 'status@broadcast')  return
        if (typeof m.text !== 'string')
            m.text = ''


        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]
        //- Tesis estuvo aquí 🙀🙀
        const sendNum = m?.sender?.replace(/[^0-9]/g, '')
        const isROwner = [conn.decodeJid(global.conn?.user?.id), ...global.owner?.map(([number]) => number)].map(v => (v || '').replace(/[^0-9]/g, '')).includes(sendNum)

// WillZek Estuvo Por Acá 
const dbsubsprems = global.db.data.settings[this.user.jid] || {}
const subsactivos = dbsubsprems.actives || []

const botIds = [this?.user?.id, this?.user?.lid, ...(global.owner?.map(([n]) => n) || [])
].map(jid => jid?.replace(/[^0-9]/g, '')).filter(Boolean)

const isPremSubs = subsactivos.some(jid => jid.replace(/[^0-9]/g, '') === sendNum) || botIds.includes(sendNum) || (global.conns || []).some(conn => conn?.user?.jid?.replace(/[^0-9]/g, '') === sendNum && conn?.ws?.socket?.readyState !== 3
  )

        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user.prem == true

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix

const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
const participants = (m.isGroup ? groupMetadata.participants : []) || []
//- Matías es mi novia (Tesis) 🥺       
const normalizeJid = jid => jid?.replace(/[^0-9]/g, '')
const cleanJid = jid => jid?.split(':')[0] || ''
const senderNum = normalizeJid(m.sender)
const botNums = [this.user?.jid, this.user?.lid].map(j => normalizeJid(cleanJid(j)))
const user = m.isGroup 
  ? participants.find(u => normalizeJid(u.jid) === senderNum) 
  : {}
const bot = m.isGroup 
  ? participants.find(u => botNums.includes(normalizeJid(u.id))) 
  : {}

const isRAdmin = user?.admin === 'superadmin'
const isAdmin = isRAdmin || user?.admin === 'admin'
const isBotAdmin = !!bot?.admin || bot?.admin === 'admin'

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
// Tesis estuvo aquí 🙀
                let text = _args.join` `  
command = (command || '').toLowerCase()  
const gruposPermitidos = [
  '120363146549758457@g.us','120363418782296007@g.us','120363402374296588@g.us','120363402051958678@g.us','120363421042789814@g.us','120363401850292240@g.us'
];

const comandosPermitidos = ['serbot', 'bots', 'kick', 'code', 's', 'delsession', 'on', 'off', 'tutosub'];

if (gruposPermitidos.includes(m.chat) &&!comandosPermitidos.includes(command)) {
  return;
}

                let fail = plugin.fail || global.dfail
               let isAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                        plugin.command.some(cmd => cmd instanceof RegExp ? 
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? 
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    let setting = global.db.data.settings[this.user.jid]
                    if (name != 'group-unbanchat.js' && chat?.isBanned)
                        return 
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                    if (name != 'owner-unbanbot.js' && setting?.banned)
                        return
                }
                let adminMode = global.db.data.chats[m.chat].modoadmin

                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin) return
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { 
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { 
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { 
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { 
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { 
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { 
                    fail('admin', m, this)
                    continue
                }
                if (plugin.premsub && !isPremSubs) { // Premium Subbots By WillZek (Por El Momento No Tiene Lógica De Premium)
                    fail('premsubs', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { 
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 
                if (xp > 200)
                    m.reply('chirrido -_-')
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    conn.reply(m.chat, `Se agotaron tus *✳️ Eris*`, m, rcanal)
                    continue
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isPremSubs,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        conn.reply(m.chat, `Utilizaste *${+m.limit}* ✳️`, m, rcanal)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    const settingsREAD = global.db.data.settings[this.user.jid] || {}
    if (opts['autoread']) await this.readMessages([m.key])
    if (settingsREAD.autoread) await this.readMessages([m.key])
  }
}

global.dfail = (type, m, conn, usedPrefix) => {
    let msg = {
        rowner: " |𝐀𝐯𝐢𝐬𝐨| `𝐋𝐨 𝐬𝐢𝐞𝐧𝐭𝐨 𝐞𝐬𝐭𝐞 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐬𝐨𝐥𝐨 𝐞𝐬 𝐩𝐚𝐫𝐚 𝐦𝐢 𝐜𝐫𝐞𝐚𝐝𝐨𝐫`🚫",
        owner: " _ |𝐀𝐯𝐢𝐬𝐨| *`😴 𝙋𝙚𝙧𝙙𝙤𝙣 𝙨𝙤𝙡𝙤 𝙢𝙞𝙨 𝙘𝙧𝙚𝙖𝙙𝙤𝙧𝙚𝙨 𝙥𝙪𝙚𝙙𝙚𝙣 𝙪𝙨𝙖𝙧𝙡𝙤😴.`*_",
        mods: " _*|𝐀𝐯𝐢𝐬𝐨| `⚡ 𝐄𝐡 𝐥𝐨 𝐬𝐢𝐞𝐧𝐭𝐨 𝐞𝐬𝐭𝐨 𝐬𝐨𝐥𝐨 𝐞𝐬 𝐩𝐚𝐫𝐚 𝐥𝐨𝐬 𝐦𝐨𝐝𝐬⚡`*_",
        premium: " |𝐀𝐯𝐢𝐬𝐨| *`🔑 𝐍𝐎 𝐄𝐑𝐄𝐒 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐇𝐀𝐁𝐋𝐀 𝐂𝐎𝐍 𝐌𝐈 𝐂𝐑𝐄𝐀𝐃𝐎𝐑⚡`*_",
        premsubs: '《★》Esta función solo puede ser usada por subbots premiums.', 
        group: " |𝐀𝐯𝐢𝐬𝐨|  _*`↘️ 𝐄𝐒𝐓𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎́ 𝐒𝐎𝐋𝐎 𝐅𝐔𝐍𝐂𝐈𝐎𝐍𝐀 𝐄𝐍 𝐆𝐑𝐔𝐏𝐎𝐒⚡`*_",
        private: " |𝐀𝐯𝐢𝐬𝐨|  _*`💬 𝐔𝐒𝐀 𝐄𝐋 𝐂𝐇𝐀𝐓 𝐏𝐑𝐈𝐕𝐀𝐃𝐎 𝐏𝐀𝐑𝐀 𝐄𝐒𝐓𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎⚡`*_",
        admin: "  |𝐀𝐯𝐢𝐬𝐨| _*`😂 𝐓𝐔 𝐍𝐎 𝐄𝐑𝐄𝐒 𝐀𝐃𝐌𝐈𝐍 😝⚡`*_",
        botAdmin: "  |𝐀𝐯𝐢𝐬𝐨| _*`⚠️ 𝗘𝘀 𝗻𝗲𝗰𝗲𝘀𝗮𝗿𝗶𝗼 𝗤𝘂𝗲 𝗦𝗲𝗮 𝗮𝗱𝗺𝗶𝗻 𝗣𝗥𝗜𝗠𝗘𝗥𝗢 𝗣𝗔𝗥𝗔 𝘂𝘀𝗮𝗿 𝗲𝘀𝘁𝗮 𝗳𝘂𝗻𝗰𝗶𝗼́𝗻⚡`*_",
        unreg: " | 𝐀𝐯𝐢𝐬𝐨| *`↘️𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙉𝙊 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊↘️`*_\n\n`Para Registrarse:`\n\n> .reg nombre.edad\n\n`Ejemplo:`\n\n> .reg Barboza.18",
        restrict: "> _*`Comando desactivado por mi Owner`*_" 
    }[type]
    if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
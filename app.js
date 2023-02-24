// Require the necessary discord.js classes
const {Client, GatewayIntentBits} = require("discord.js")
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],    
    partials: [
        'CHANNEL', // Required to receive DMs
    ]
})

const { token } = require('./config.json')
const llistaUsuaris = require('./llistaUsuaris.json')
let countUsuaris = 0
let usuarisAssignats = {}
let usuarisAmbIntereaccio = {}
const usuariRef = "<@123456789346>"
const accessIP = "188.222.222.22"

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async msg => {
    try{

        // Ignorem els missatges que no siguin del canal general
        if(msg.channel.name != "general") return

        // Ignorem el missatge si el missatge és d'un bot
        if (msg.author.bot) return 

        // Registrem les interaccions de l'usuari
        if(!(msg.author.username in usuarisAmbIntereaccio))
            usuarisAmbIntereaccio[msg.author.username] = 0
        else
            usuarisAmbIntereaccio[msg.author.username]++

        // Comprovem que ens digui Hola
        if (!msg.content.toLowerCase().includes('hola')) {
            if (usuarisAmbIntereaccio[msg.author.username] > 2)
                msg.reply(`Hola ${msg.author.username}, només cal que escriguis Hola! \nSi ho trobes massa complicat o tens qualsevol dubte, pots contactar amb nosaltres via ${usuariRef}.`)
            else if (usuarisAmbIntereaccio[msg.author.username] > 0)
                msg.reply(`Hola ${msg.author.username}, recorda que cal dir Hola! per obtenir accés al hacking day.`)
            else
                msg.reply(`Hola ${msg.author.username}, benvingut! en aquest xat pots demanar el teu usuari per jugar al hacking day. Per fer-ho, saluda dient: Hola!`)
            
            // Esborra el missatge
            setTimeout(() => {
                if (!msg.deleted) {
                   msg.delete()
                   .catch(err => {
                      console.log('An error occurred but the bot is still running')
                      console.error(err)
                   })
                }
             }, 3000) 
            return
        }

        // Marca que l'usuari ha fet interacció
        usuarisAmbIntereaccio[msg.author.username] = true

        // Si ja hem facilitat l'usuari
        if (msg.author.username in usuarisAssignats) {
            const nouJugador = usuarisAssignats[msg.author.username]
            msg.reply(`Hola ${msg.author.username}, ja tens un usuari assignat. Repassa els teus missatges privats per veure el teu usuari`)
            const thread = await msg.author.createDM()
            thread.send({
                        content:
                            `Et recodo les dades que necessites per accedir a ${accessIP}: \n\n`
                            + ' Usuari: ' + nouJugador.usuari + '\n'
                            + ' Clau: ' + nouJugador.clau  + '\n\n',
                        files: [nouJugador.clau]
            })


        }
        // Si encara no hem facilitat l'usuari
        else if (countUsuaris < llistaUsuaris.length) {
                const nouJugador = llistaUsuaris[countUsuaris]
                usuarisAssignats[msg.author.username] = llistaUsuaris[countUsuaris]
                msg.reply(`Hola ${msg.author.username}, t'he enviat un missatge privat amb el teu usuari`)

                const thread = await msg.author.createDM()
                thread.send({
                            content:
                                    `Hola ${msg.author.username}! Benvingut al hacking day de Londres! \n`
                                    + `Per jugar al hacking day has d\'accedir a la màquina ${accessIP} amb el següent usuari i la clau privada ssh: \n\n`
                                    + ' Usuari: ' + nouJugador.usuari + '\n'
                                    + ' Clau: ' + nouJugador.clau  + '\n\n'
                                    + `Si tens qualsevol dubte, pots contactar amb nosaltres via ${usuariRef}.`, 
                            files: [nouJugador.clau]
                })

                countUsuaris++
        }
        // Si ja no queden usuaris
        else {
                msg.reply(`Hola ${msg.author.username}, ja no queden més usuaris per assignar. Si tens qualsevol dubte, pots contactar amb nosaltres via ${usuariRef}.`)
        }
        
    }
    catch (error) {
        console.error(error)
    }
    })

// Log in to Discord with your client's token
client.login(token)

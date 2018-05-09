const socket_io = require('socket.io');
const axios = require('axios');
const {Users} = require('../models/users');

var users = new Users();
var io = socket_io();
var socket_api = {};

socket_api.io = io;


/**
 * SOCKET INTERFACE WAITING FOR CLIENT CONNECTIONS
 */
io.on('connection', (socket) => {
    /**
     * SOCKET DEFAULT METHOD WHEN A CLIENT DISCONNECT
     */
    socket.on('disconnect', function () {
        var user = users.removeUser(socket.id);
        console.log("THE USER #" + socket.id + " IS DISCONNECTED");

        if(user)
        {
            var messages = {};
            messages['fr-FR'] = user.nickname+" a quitté le chat";
            messages['en-EN'] = user.nickname+" left the chat";
            messages['de-DE'] = user.nickname+" verließ den Chat";
            messages['es-ES'] = user.nickname+" dejó el chat";
            messages['it-IT'] = user.nickname+" ha lasciato la chat";
            messages['nl-NL'] = user.nickname+" verliet de chat";
            messages['pl-PL'] = user.nickname+" opuścił czat";
            io.in(user.room).emit('leftMessage', messages);
            io.in(user.room).emit('updateUserList', users.getUserListRoom(user.room));
        }
    });
    /**
     * SOCKET JOIN METHOD WHEN A CLIENT JOIN A SPECIFIC ROOM
     */
    socket.on('join', (nickname, room, language) => {
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, nickname, room, language);

        var welcomeMessages = {};
        welcomeMessages['fr-FR'] = "Bienvenue "+nickname+" dans l'application de chat multilingue !";
        welcomeMessages['en-EN'] = "Welcome "+nickname+" to the multilingual chat app !";
        welcomeMessages['de-DE'] = "Willkommen "+nickname+" in der mehrsprachigen Chat-App !";
        welcomeMessages['es-ES'] = "Bienvenido "+nickname+" a la aplicación de chat multilingüe !";
        welcomeMessages['it-IT'] = "Benvenuto "+nickname+" nell'app chat multilingue !";
        welcomeMessages['nl-NL'] = "Welkom "+nickname+" op de meertalige chat app !";
        welcomeMessages['pl-PL'] = "Witamy "+nickname+" na wielojęzycznej aplikacji czatu !";

        var joinMessages = {};
        joinMessages['fr-FR'] = nickname+" a rejoint le chat";
        joinMessages['en-EN'] = nickname+" joined the chat";
        joinMessages['de-DE'] = nickname+" ist dem Chat beigetreten";
        joinMessages['es-ES'] = nickname+" se unió al chat";
        joinMessages['it-IT'] = nickname+" si unì alla chat";
        joinMessages['nl-NL'] = nickname+" sloot zich aan bij de chat";
        joinMessages['pl-PL'] = nickname+" dołączył do czatu";

        io.in(room).emit('updateUserList', users.getUserListRoom(room));
        socket.broadcast.to(room).emit('joinMessage', joinMessages);
        socket.emit('adminMessage', welcomeMessages);
    })

    /**
     * SOCKET METHOD WHEN A CLIENT SEND A NEW MESSAGE TO THE CHAT
     */
    socket.on('sendMessage', async (nickname, room, language, message) => {

        console.log((users.getUserList(room, 'fr-FR')));
        console.log((users.getUserList(room, 'de-DE')));
        console.log((users.getUserList(room, 'en-US')));
        var messages = {};
        messages['fr-FR'] = ((users.getUserList(room, 'fr-FR').length != 0) ? await translate(message, language, 'FR') : '');
        messages['en-EN'] = ((users.getUserList(room, 'en-EN').length != 0) ? await translate(message, language, 'EN') : '');
        messages['de-DE'] = ((users.getUserList(room, 'de-DE').length != 0) ? await translate(message, language, 'DE') : '');
        messages['es-ES'] = ((users.getUserList(room, 'es-ES').length != 0) ? await translate(message, language, 'ES') : '');
        messages['it-IT'] = ((users.getUserList(room, 'it-IT').length != 0) ? await translate(message, language, 'IT') : '');
        messages['nl-NL'] = ((users.getUserList(room, 'nl-NL').length != 0) ? await translate(message, language, 'NL') : '');
        messages['pl-PL'] = ((users.getUserList(room, 'pl-PL').length != 0) ? await translate(message, language, 'PL') : '');

        console.log(messages);
        io.in(room).emit('newMessage', messages, nickname);

    })

    /**
     * SOCKET TRANSLATE LIVE METHOD WHEN A CLIENT TRY THE TRANSLATION
     */
    socket.on('translateMessage', async (source_lang, message, target_lang) => {
        var translation = await translate(message, source_lang, target_lang.split('-')[1]);
        socket.emit('translateMessageResult', translation);



    })
});

/**
 * DEEPL REST TRANSLATE METHOD
 * @param text
 * @param source_lang
 * @param target_lang
 * @returns {Promise<*>}
 */
async function translate(text, source_lang, target_lang)
{
    // try
    // {
    //     var translation = await axios.get('https://api.deepl.com/v1/translate?', {params: {text: text,source_lang:source_lang.split('-')[1],target_lang:target_lang,auth_key:'c821231d-e4fc-f98c-3f61-0c863e825411'}});
    //     return translation.data.translations[0].text
    // } catch(error){
    //     console.log(error);
    //     return 'Error';
    // }
    //
    //
    return text;
}

module.exports = socket_api;
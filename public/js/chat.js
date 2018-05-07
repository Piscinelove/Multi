
/* HANDLE SOCKETS & MESSAGES */
var socket = io();

socket.on('newMessage', function (messages, from) {
    if(from != nickname) {
        $('#messages').append('<li><div class="message-text left">' + messages[language] + '</div><div class="message-from left">' + from + '</div></li>');
        var msg = new SpeechSynthesisUtterance(messages[language]);
        msg.lang = language;
        speechSynthesis.speak(msg);
    }
    else
        $('#messages').append('<li><div class="message-text right">'+messages[language]+'</div><div class="message-from right">'+from+'</div></li>');


});

socket.on('adminMessage', function (messages) {
    $('#messages').append('<li><div class="message-text left">'+messages[language]+'</div><div class="message-from left">Admin</div></li>');
});

socket.on('leftMessage', function (messages) {
    $('#messages').append('<li><div class="right red-text text-darken-1">'+messages[language]+'</div><div class="message-from right">Admin</div></li>');
});

socket.on('joinMessage', function (messages) {
    $('#messages').append('<li><div class="right teal-text">'+messages[language]+'</div><div class="message-from right">Admin</div></li>');
});

socket.on('updateUserList', function (users) {
    var usersList = jQuery('<div id="users"></div>');

    users.forEach(function (user)
    {
        usersList.append(jQuery('<li><a><img class="user-country" src=\"images/countries/'+user.language+'.svg\" />'+user.nickname+'</a></li>'));
    });

    $('#users').replaceWith(usersList);

});

/**
 * DEFAULT COMPONENTS INITIALISATION
 */
$(document).ready(function () {

    nickname = JSON.parse(nickname.replace(/&quot;/g, '"'));
    room = JSON.parse(room.replace(/&quot;/g, '"'));
    language = JSON.parse(language.replace(/&quot;/g, '"'));

    socket.emit('join',nickname, room, language);

})

/**
 * WEB SPEECH API HANDLE
 */
var $recognition;
var $recognizing;
var $transcript;


function writeMessage()
{
    if('webkitSpeechRecognition' in window)
    {
        $recognition = new webkitSpeechRecognition();
        $recognition.lang = language;
        $recognition.continous = false;
        $recognition.interimResults = true;

        $recognition.onstart = function () {
            $recognizing = true;
        };

        $recognition.onend = function () {
            $recognizing = false;

        };

        $recognition.onerror = function (event) {
            $recognizing = false;
        };


        $recognition.onresult = function (event)
        {
            $('#chat-message-input').val('');
            for(var i = event.resultIndex; i < event.results.length; i++)
            {
                $transcript = event.results[i][0].transcript;
                if(event.results[i].isFinal)
                {
                    $('#chat-message-input').val($transcript);
                    stopRecognition();

                    if($transcript)
                        socket.emit('sendMessage',nickname, room, language, $transcript);
                    else
                        $('#chat-message-input').val("Sorry "+nickname+" i didn't unterstand :(");
                }
                else
                {
                    $('#chat-message-input').val($('#chat-message-input').val()+$transcript);
                }

            }
        }


        if(!$recognizing)
        {
           startRecognition();
        }
        else
        {
            stopRecognition();
        }
    }
    else
    {
        confirm("Your browser doesn't support Web Speech API. Please try it with Google Chrome");
        window.location.href = '/login';
    }
}

function startRecognition()
{
    $recognition.start();
    $recognizing = true;
    $('#chat-message-input').val('');
    $('#chat-message-send-button').addClass('red');
    $('#chat-message-send-button').addClass('darken-3');
    $('#chat-message-send-button').addClass('pulse');
}


function stopRecognition()
{
    $recognition.stop();
    $recognizing = false;
    $('#chat-message-send-button').removeClass('red');
    $('#chat-message-send-button').removeClass('darken-3');
    $('#chat-message-send-button').removeClass('pulse');
}
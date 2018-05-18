/* HANDLE SOCKETS & MESSAGES */
var socket = io();

socket.on('translateMessagesResult', function (messages) {
    $('#en-EN').text(messages['en-EN']);
    $('#pl-PL').text(messages['pl-PL']);
    $('#nl-NL').text(messages['nl-NL']);
    $('#es-ES').text(messages['es-ES']);
    $('#de-DE').text(messages['de-DE']);
    $('#it-IT').text(messages['it-IT']);
});

/**
 * WEB SPEECH API HANDLE
 */

var $recognition;
var $recognizing;
var $transcript;

function demo()
{
    if('webkitSpeechRecognition' in window)
    {
        $recognition = new webkitSpeechRecognition();
        $recognition.lang = 'fr-FR';
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
            $('#demo-message').text('');
            for(var i = event.resultIndex; i < event.results.length; i++)
            {
                $transcript = event.results[i][0].transcript;
                if(event.results[i].isFinal)
                {
                    stopRecognition();
                    $('#demo-message').text($transcript);
                    if($transcript)
                        socket.emit('translateMessages', $transcript);
                    else
                        $('#demo-message').text("Error");
                }
                else
                {
                    $('#demo-message').text($('#demo-message').text()+$transcript);
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
    $('#demo-record-button').addClass('red');
    $('#demo-record-button').addClass('darken-3');
    $('#demo-record-button').addClass('pulse');
}


function stopRecognition()
{
    $recognition.stop();
    $recognizing = false;
    $('#demo-record-button').removeClass('red');
    $('#demo-record-button').removeClass('darken-3');
    $('#demo-record-button').removeClass('pulse');
}
/* HANDLE SOCKETS & MESSAGES */
var socket = io();

socket.on('translateMessageResult', function (message) {
    $('#translation-text').text(message);
});

/**
 * WEB SPEECH API HANDLE
 */

var $recognition;
var $recognizing;
var $transcript;
var $source_lang;
var $target_lang;

function talk()
{
    if('webkitSpeechRecognition' in window)
    {
        $source_lang = $('#try-source-language select').val();
        $target_lang = $('#try-target-language select').val();

        $recognition = new webkitSpeechRecognition();
        $recognition.lang = $source_lang;
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
            $('#translation-text').text('');
            for(var i = event.resultIndex; i < event.results.length; i++)
            {
                $transcript = event.results[i][0].transcript;
                if(event.results[i].isFinal)
                {
                    stopRecognition();
                    if($transcript)
                        socket.emit('translateMessage', $source_lang, $transcript, $target_lang);
                    else
                        $('#translation-text').text("Error");
                }
                else
                {
                    $('#translation-text').text($('#translation-text').text()+$transcript);
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
    $('#translation-text').text('');
    $('#try-record').addClass('red');
    $('#try-record').addClass('darken-3');
    $('#try-record').addClass('pulse');
}


function stopRecognition()
{
    $recognition.stop();
    $recognizing = false;
    $('#try-record').removeClass('red');
    $('#try-record').removeClass('darken-3');
    $('#try-record').removeClass('pulse');
}
// File von Dariush for Micro




let streamObj
let audioContext = window.AudioContext || window.webkitAudioContext;
let spectrum = new Uint8Array(8192);
function startMicrophoneInput() {
    var webaudio_tooling_obj = function () {
        var audioContext = new AudioContext();
        console.log(":studiomikrophon: Mic is starting up ...");
        var BUFF_SIZE = 16384;
        var audioInput = null,
            microphone_stream = null,
            gain_node = null,
            script_processor_node = null,
            script_processor_fft_node = null,
            analyserNode = null;
        navigator.getMic = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(function (stream) {
                    start_microphone(stream);    //Display the video stream in the video object
                })
                .catch(function (e) { logError(e.name + ": " + e.message); });
        }
        else {
            navigator.getMic({ audio: true, video: false },
                function (stream) {
                    start_microphone(stream);
                },
                function (e) { console.log(":kein_zutritt: Microphone  is not accessible." + e); });
        }
        // ---
        function show_some_data(given_typed_array, num_row_to_display, label) {
            var size_buffer = given_typed_array.length;
            var index = 0;
            var max_index = num_row_to_display;
            // console.log("__________ " + label);
            for (; index < max_index && index < size_buffer; index += 1) {
                console.log(given_typed_array[index]);
            }
        }
        function process_microphone_buffer(event) { // invoked by event loop
            var i, N, inp, microphone_output_buffer;
            microphone_output_buffer = event.inputBuffer.getChannelData(0); // just mono - 1 channel for now
            // microphone_output_buffer  <-- this buffer contains current gulp of data size BUFF_SIZE
            show_some_data(microphone_output_buffer, 5, "from getChannelData");
        }
        function start_microphone(stream) {
            gain_node = audioContext.createGain();
            gain_node.connect(audioContext.destination);
            microphone_stream = audioContext.createMediaStreamSource(stream);
            script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
            script_processor_node.onaudioprocess = process_microphone_buffer;
            microphone_stream.connect(script_processor_node);
            // --- setup FFT
            script_processor_fft_node = audioContext.createScriptProcessor(1024, 1, 1);
            script_processor_fft_node.connect(gain_node);
            analyserNode = audioContext.createAnalyser();
            analyserNode.smoothingTimeConstant = 0.7;
            // analyserNode.minDecibels = -80;
            analyserNode.fftSize = BUFF_SIZE;
            microphone_stream.connect(analyserNode);
            analyserNode.connect(script_processor_fft_node);
            script_processor_fft_node.onaudioprocess = function () {
                analyserNode.smoothingTimeConstant = 0.8
                // let spectrum = new Uint8Array(analyserNode.frequencyBinCount);
                analyserNode.getByteFrequencyData(spectrum);
                // console.log( analyserNode.frequencyBinCount)
                // draw the spectrogram
                /* if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {
         
                     show_some_data(spectrum, 5, "from fft");
                 }*/
            };
        }
    }();//  webaudio_tooling_obj = function()
}
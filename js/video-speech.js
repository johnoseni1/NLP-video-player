(function() {
	// Get some required handles
	var video = document.getElementById('v');
	var recStatus = document.getElementById('recStatus');
	var startRecBtn = document.getElementById('startRecBtn');
	var stopRecBtn = document.getElementById('stopRecBtn');
	var video_count = 1;
	var nextVideo = document.getElementById("sec-video");

	// Define a new speech recognition instance
	var rec = null;
	try {
		// const brain = require('brain.js');
		//  rec = new brain.NeuralNetwork();
		// var natural = require('natural');
		//  rec = new natural.WordTokenizer();
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	document.querySelector('.msg').setAttribute('data-state', 'show');
    	startRecBtn.setAttribute('disabled', 'true');
    	stopRecBtn.setAttribute('disabled', 'true');
    }
    if (rec) {
		rec.continuous = true;
		rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

		// Highlights the relevant command that was recognised in the command list for display purposes
		var highlightCommand = function(cmd) {
			var el = document.getElementById(cmd); 
			el.setAttribute('data-state', 'highlight');
			setTimeout(function() {
				el.setAttribute('data-state', '');
			}, 2000);
		}

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
		       			console.log('Recognised: ' + str);
		       			// If the user said 'video' then parse it further
		       				// Replay the video
		       				if (userSaid(str, 'replay')) {
								var nextVideo = document.getElementById("sec-video");
		       					video.currentTime = 0;
		       					video.play();
								nextVideo.pause();
		       					highlightCommand('vidReplay');
		       				}
		       				// Play the video
		       				else if (userSaid(str, 'play')) {
		       					video.play();
		       					highlightCommand('vidPlay');
		       				}
							   else if (userSaid(str, 'play Next')) {
								var nextVideo = document.getElementById("sec-video");
								nextVideo.play();
								highlightCommand('vidPlayNext');
							}
							   //Go to the next video
							   else if (userSaid(str, 'next')) {
								document.getElementById("sec-video").style.display="block";
								video_count++;
								if (video_count == 16) video_count = 1;
								var nextVideo = document.getElementById("sec-video");
								nextVideo.play();
								video.pause();
								highlightCommand('vidNext');
							}
		       				// Stop the video
		       				else if (userSaid(str, 'stop')) {
								var nextVideo = document.getElementById("sec-video");
								nextVideo.pause();
								video.pause();
		       					highlightCommand('vidStop');
		       				}

							   else if (userSaid(str, 'stop Next')) {
								var nextVideo = document.getElementById("sec-video");
								nextVideo.pause();
		       					highlightCommand('vidStopNext');
		       				}
		       				// If the user said 'volume' then parse it even further
		       				else if (userSaid(str, 'volume')) {
		       					// Check the current volume setting of the video
		       					var vol = Math.floor(video.volume * 10) / 10;
		       					// Increase the volume
		       					if (userSaid(str, 'increase')) {
		       						if (vol >= 0.9) video.volume = 1;
		       						else video.volume += 0.1;
		       						highlightCommand('vidVolInc');
		       					}
								   if (userSaid(str, 'increase Next')) {
									if (vol >= 0.9) nextVideo.volume = 1;
									else nextVideo.volume += 0.1;
									highlightCommand('vidVolIncNext');
								}
		       					// Decrease the volume
		       					else if (userSaid(str, 'decrease')) {
		       						if (vol <= 0.1) video.volume = 0;
		       						else video.volume -= 0.1;
		       						highlightCommand('vidVolDec');
		       					}
								   else if (userSaid(str, 'decrease Next')) {
									if (vol <= 0.1) nextVideo.volume = 0;
									else nextVideo.volume -= 0.1;
									highlightCommand('vidVolDecNext');
								}
		       					// Turn the volume off (mute)
		       					else if (userSaid(str, 'of')) {
		       						video.muted = true;
		       						highlightCommand('vidVolOff');
		       					}
								   else if (userSaid(str, 'of Next')) {
									nextVideo.muted = true;
									highlightCommand('vidVolOffNext');
								}
		       					// Turn the volume on (unmute)
		       					else if (userSaid(str, 'on')) {
		       						video.muted = false;
		       						highlightCommand('vidVolOn');
		       					}
								   else if (userSaid(str, 'on Next')) {
									nextVideo.muted = false;
									highlightCommand('vidVolOnNext');
								}
		       				}
		       			
	       			}
	        	}
	    	}
		};

		// Start speech recognition
		var startRec = function() {
			rec.start();
			recStatus.innerHTML = 'recognising';
		}
		// Stop speech recognition
		var stopRec = function() {
			rec.stop();
			recStatus.innerHTML = 'not recognising';
		}
		// Setup listeners for the start and stop recognition buttons
		startRecBtn.addEventListener('click', startRec, false);
		stopRecBtn.addEventListener('click', stopRec, false);
	}
})();
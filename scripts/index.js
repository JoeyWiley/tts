// Hide API Key while not focused
function keyObfuscate(obfuscated) {
	const keyInput = document.getElementById("apiKeyInput");
	if (obfuscated) {
		keyInput.type = "password";
	} else {
		keyInput.type = "";
	}
}

// On click 'SYNTHESIZE' button, synthesize input
var form = document.getElementById("controlBox");
function handleForm(event) {
	event.preventDefault();
	synthesizeSpeech();
}
form.addEventListener("submit", handleForm);

// Synthesize input using Google Cloud API
async function synthesizeSpeech() {
	const apiKey = document.getElementById("apiKeyInput").value;

	if (apiKey === "") {
		alert("Please enter your Google Cloud API key.");
		return;
	}

	if (encodeURIComponent(document.getElementById("textInput").value).replace(/%[A-F\d]{2}/g, "U").length > 5000) {
		alert(`Your content is ${encodeURIComponent(document.getElementById("textInput").value).replace(/%[A-F\d]{2}/g, "U").length}/5000 bytes. Please remove characters.`);
		return;
	}

	console.log(encodeURIComponent(document.getElementById("textInput").value).replace(/%[A-F\d]{2}/g, "U").length);

	try {
		// Here, we're collecting inputs from the main page, and setting defaults.
		const text = document.getElementById("textInput").value !== "" ? document.getElementById("textInput").value : "Hello World!";
		const voice = [document.getElementById("languageCode").value !== "" ? document.getElementById("languageCode").value : "en-US", document.getElementById("voiceName").value !== "" ? document.getElementById("voiceName").value : "en-US-Neural2-A"];
		const config = [
			"LINEAR16",
			document.getElementById("pitchInput").value !== "" ? parseFloat(document.getElementById("pitchInput").value) : 1,
			document.getElementById("speedInput").value !== "" ? parseFloat(document.getElementById("speedInput").value) : 1,
		];

		// Make an API request using the API key & inputs
		const response = await fetch(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`, {
			method: "POST",
			body: JSON.stringify({
				input: { text: text },
				voice: { languageCode: voice[0], name: voice[1] },
				audioConfig: { audioEncoding: config[0], effectsProfileId: ["headphone-class-device"], pitch: config[1], speakingRate: config[2] },
			}),
		});

		const data = await response.json();

		// Add our data to the audio player
		editAudioPlayer(data);
	} catch (error) {
		console.error("Error:", error);
		alert("Error:\n\n" + error);
	}
}

function editAudioPlayer(data) {
	const audioElement = document.getElementById("audioPlayer");
	const sourceElement = document.getElementById("audioSrc");

	// If the <source> element doesn't exist, create it with data. If it does, edit the data.
	if (!sourceElement) {
		const newSource = document.createElement("source");
		newSource.id = "audioSrc";
		newSource.type = "audio/wav";
		newSource.src = "data:audio/wav;base64," + data.audioContent;

		audioElement.appendChild(newSource);
	} else {
		sourceElement.src = "data:audio/wav;base64," + data.audioContent;
	}

	// Reload the <audio> element
	audioElement.load();
}

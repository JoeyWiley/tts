// Obfuscate API Key
function keyObfuscate(obfuscated) {
	const keyInput = document.getElementById("apiKeyInput");
	if (obfuscated) {
		keyInput.type = "password";
	} else {
		keyInput.type = "";
	}
}

// SUBMIT FORM
var form = document.getElementById("controlBox");
function handleForm(event) {
	event.preventDefault();
	synthesizeSpeech();
}
form.addEventListener("submit", handleForm);

// GOOGLE CLOUD API

async function synthesizeSpeech() {
	const apiKey = document.getElementById("apiKeyInput").value;

	if (apiKey === "") {
		alert("Please enter your Google Cloud API key.");
		return;
	}

	try {
		// Make an API request using the API key
		const text = document.getElementById("textInput").value !== "" ? document.getElementById("textInput").value : "Hello World!";
		const voice = [document.getElementById("languageCode").value !== "" ? document.getElementById("languageCode").value : "en-US", document.getElementById("voiceName").value !== "" ? document.getElementById("voiceName").value : "en-US-Neural2-A"];
		const config = [
			"LINEAR16",
			document.getElementById("pitchInput").value !== "" ? parseFloat(document.getElementById("pitchInput").value) : 1,
			document.getElementById("speedInput").value !== "" ? parseFloat(document.getElementById("speedInput").value) : 1,
		];
		const response = await fetch(`https://us-central1-texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`, {
			method: "POST",
			body: JSON.stringify({
				input: { text: text },
				voice: { languageCode: voice[0], name: voice[1] },
				audioConfig: { audioEncoding: config[0], effectsProfileId: ["headphone-class-device"], pitch: config[1], speakingRate: config[2] },
			}),
		});

		const data = await response.json();
		editAudio(data);
	} catch (error) {
		console.error("Error:", error);
		alert("Error:\n\n" + error);
	}
}

function editAudio(data) {
	const audioElement = document.getElementById("audioPlayer");
	const sourceElement = document.getElementById("audioSrc");
	if (!!!sourceElement) {
		const newSource = document.createElement("source");
		newSource.id = "audioSrc";
		newSource.type = "audio/wav";
		newSource.src = "data:audio/wav;base64," + data.audioContent;

		audioElement.appendChild(newSource);
	} else {
		sourceElement.src = "data:audio/wav;base64," + data.audioContent;
	}

	audioElement.load();
}

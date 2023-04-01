const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const limbiInput = document.getElementById('limbi');
const poemstyleInput = document.getElementById('poem-style');
const vociInput = document.getElementById('voci');
const poemContainer = document.getElementById('poem-container');


function generatePoem() {
  const apiUrl = 'https://api.openai.com/v1/completions';
  const apiKey = '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';

  const prompt = "Write a poetry entire in about 150 words about " + promptInput.value + " in " + limbiInput.value + " in a " + poemstyleInput.value + " style using the " + vociInput.value + " rhymes";
  console.log(prompt)
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 250,
    n: 1,
  };

  let poem = '';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        poem = data.choices[0].text.replace(/\n/g, "<br/>");
        poemContainer.innerHTML = poem;
        const savePdfBtn = document.querySelector('#save-pdf-btn');
        const saveTxtBtn = document.querySelector('#save-txt-btn');

        if (savePdfBtn && saveTxtBtn) {
          savePdfBtn.addEventListener('click', () => {
            // your code for saving as PDF
          });

          saveTxtBtn.addEventListener('click', () => {
            // your code for saving as TXT
          });
        }
        } else {
          console.error('Could not find save buttons.');
        } 
      })
    .catch(error => console.error(error));

  var imgElement = document.getElementById('image');

  fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      'model': 'image-alpha-001',
      'prompt': promptInput.value,
      'num_images': 1,
      'size': '1024x1024'
    })
  })
    .then(response => response.json())
    .then(data => {
      imgElement.src = data.data[0].url;
    })
    .catch(error => console.error(error));

}

const textarea = poemContainer;
voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("speechBtn");

let synth = speechSynthesis,
  isSpeaking = true;

voices();

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

speechBtn.addEventListener("click", e => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking) {
      textToSpeech(textarea.value);
    }
    if (textarea.value.length() > 80) {
      setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          isSpeaking = true;
          speechBtn.innerText = "Convert To Speech";
        } else {
        }
      }, 500);
      if (isSpeaking) {
        synth.resume();
        isSpeaking = false;
        speechBtn.innerText = "Pause Speech";
      } else {
        synth.pause();
        isSpeaking = true;
        speechBtn.innerText = "Resume Speech";
      }
    } else {
      speechBtn.innerText = "Convert To Speech";
    }
  }
});
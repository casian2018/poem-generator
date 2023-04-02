const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt');
const languageInput = document.getElementById('language');
const poemContainer = document.getElementById('poem-container');
const speachBtn = document.getElementById('speechSynthesis');

let header = document.querySelector('header');
let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');


window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', window.scrollY > 0);
});

menu.onclick = () => {
  navbar.classList.toggle('active');
}
window.onscroll = () => {
  navbar.classList.remove('active');
}

// Dark Mode
let darkmode = document.querySelector('#darkmode');

darkmode.onclick = () => {
  if (darkmode.classList.contains('bx-moon')) {
    darkmode.classList.replace('bx-moon', 'bx-sun');
    document.body.classList.add('active');
  } else {
    darkmode.classList.replace('bx-sun', 'bx-moon');
    document.body.classList.remove('active');
  }

}

let thepoemidkurenameit = "";

function generatePoem() {
  const apiUrl = 'https://api.openai.com/v1/completions';
  const apiKey = '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';

  const prompt = "translate " + promptInput.value + " in english then make a poem in about 100 words";
  console.log(prompt)
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    n: 1,
  };

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
        const poem = data.choices[0].text.replace(/\n/g, "<br/>");
        thepoemidkurenameit = data.choices[0].text.trim();
        poemContainer.innerHTML = poem;
        // Save as TXT
        const saveTxtBtn = document.getElementById('save-txt-btn');
        saveTxtBtn.addEventListener('click', () => {
          const txt = poem.replace(/<br\/>/g, "\n");
          const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
          saveAs(blob, "poem.txt");
        });
      } else {
        poemContainer.innerHTML = "Sorry, we couldn't generate a poem. Please try again later.";
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
      'size': '256x256'
    })
  })
    .then(response => response.json())
    .then(data => {
      imgElement.src = data.data[0].url;
    })
    .catch(error => console.error(error));

}


generateBtn.addEventListener('click', generatePoem);

const rollBtn = document.getElementById('roll-btn');

function generateRandomPrompt() {
  fetch('random.txt')
    .then(response => response.text())
    .then(data => {
      const prompts = data.trim().split('\n');
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const randomPrompt = prompts[randomIndex].trim();
      promptInput.value = randomPrompt;
    })
    .catch(error => console.error(error));
}

rollBtn.addEventListener('click', generateRandomPrompt);



generateBtn.addEventListener('click', generatePoem);

function speach() {
  // speechSynthesis
  // check if the Web Speech API is supported in the browser
  if ('speechSynthesis' in window) {
    // create a new SpeechSynthesisUtterance object
    var utterance = new SpeechSynthesisUtterance();

    // set the text to be spoken
    utterance.text = thepoemidkurenameit;

    // use the default voice
    utterance.voice = speechSynthesis.getVoices()[0];

    // speak the text
    speechSynthesis.speak(utterance);
  } else {
    console.log("Sorry, the Web Speech API is not supported in your browser.");
  }
}

speachBtn.addEventListener('click', (event) => {
  event.preventDefault();
  speach();
});
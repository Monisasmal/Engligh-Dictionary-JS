const toggleBtn = document.getElementById("toggleMode");

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
};

async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!word) {
    resultDiv.innerHTML = `<p>Please enter a word.</p>`;
    return;
  }

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Word not found");

    const data = await res.json();
    const def = data[0];

    const phonetic =
      def.phonetic || (def.phonetics.find((p) => p.text) || {}).text || "N/A";

    const meaning =
      def.meanings.find((m) => m.definitions.length > 0) || def.meanings[0];

    const definition =
      meaning.definitions.find((d) => d.example) || meaning.definitions[0];

    const audio = def.phonetics.find((p) => p.audio) || {};

    resultDiv.innerHTML = `
      <h2>${def.word}</h2>
      <p><strong>Phonetic:</strong> ${phonetic}</p>
      <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
      <p><strong>Definition:</strong> ${definition.definition}</p>
      <p><strong>Example:</strong> ${definition.example || "N/A"}</p>
      ${audio.audio ? `<audio controls src="${audio.audio}"></audio>` : ""}
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>❌ ${error.message}</p>`;
  }
}

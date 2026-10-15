export async function checkGrammar(text) {
  try {
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        text: text,
        language: "en-US"
      })
    });

    const data = await response.json();

    return data.matches.map((match) => ({
      message: match.message,
      offset: match.offset,
      length: match.length,
      suggestions: match.replacements.map((r) => r.value)
    }));
  } catch (error) {
    console.error("Grammar API error:", error);
    return [];
  }
}
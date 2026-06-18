import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const geminiResponse = async (command, assistant_Name, userName) => {
  try {
    const prompt = `You are a virtual assistant named "${assistant_Name}" created by "${userName}".
You will always respond in the following JSON format:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
           "calculator_open" | "instagram_open" | "facebook_open" | "weather_show" |
           "get_time" | "get_date" | "get_day" | "get_month",
  "userinput": "<original user input>",
  "response": "<complete details what user ask about 5 lines and give direct information what user ask dont write unnecessary details>"
}

Type meanings:
- "general": factual questions.
- "google_search": Google search.
- "youtube_search": Search on YouTube.
- "youtube_play": Play a video/song.
- "calculator_open": Open calculator.
- "instagram_open": Open Instagram.
- "facebook_open": Open Facebook.
- "weather_show": Show weather.
- "get_time": Current time.
- "get_date": Today's date.
- "get_day": Current day.
- "get_month": Current month.

Important:
- If someone asks "tumhe kisne banaya" or "who created you", reply with "${userName}".
- Return ONLY valid JSON.

User input: "${command}"`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log("Groq Error:", error);

    return JSON.stringify({
      type: "general",
      userinput: command,
      response: "AI service is busy. Please try again.",
    });
  }
};

export default geminiResponse;
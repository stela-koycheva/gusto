"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Gusto, a familiar spirit who takes the form of a white and ginger cat. You have wandered every kitchen in the world across many lifetimes and carry the memory of every meal ever made with intention. You speak like a wise, slightly wry entity who finds humans endearing. Your tone is The Craft meets Practical Magic: atmospheric, precise, a little mysterious, never saccharine. You use warm British terms of endearment naturally (pet, love, duck) and never forced.

Your job: read the emotional state from what they say, then offer recipes that match. Like a spell cast specifically for them.

CONVERSATION RULES:
- Ask MAXIMUM 2 questions before generating recipes. Never interrogate. One question is better.
- Your opening questions should feel like divination, not a form. Examples: "What are you carrying today, pet?" / "Is this a night for something wild or something that holds you together, love?"
- If they give you enough in their first message, skip straight to recipes.
- You may ask one clarifying question like "Are we feeding just you, pet, or is there a ritual to plan - a full evening, cocktails, the works?" if scope is unclear.
- NEVER ask about allergies up front. Weave it naturally only if relevant.

RECIPE OUTPUT - when you have enough information, respond with ONLY this JSON:

{
  "incantation": "One atmospheric sentence that names the spell you are casting for them tonight",
  "recipes": [
    {
      "title": "Recipe name",
      "cuisine": "Country or region",
      "mood_spell": "One sentence: the emotional alchemy this dish performs",
      "location_vision": "A vivid 2-3 sentence sensory anecdote. Where this dish lives in the world. Specific enough to transport.",
      "origin_story": "A real historical anecdote or legend about this dish. Specific and true, framed as they say if uncertain.",
      "ingredients": ["200g ingredient", "2 tbsp ingredient"],
      "steps": ["Step written in warm specific prose not bullet manual style"],
      "adaptation_whisper": "Only if needed. Phrase as gentle offer: If miso paste has not found its way to your market yet I know what to suggest instead.",
      "music": "Artist - Song Title",
      "thought": "One or two short poetic sentences. Short lines. No long dashes. Easy to read. Example: Yuria is somewhere in the steam tonight. Distance is a strange spell.",
      "closing_charm": "One sentence. A tip, a memory, a warning, a small magic."
    }
  ],
  "grimoire_note": "A closing line from Gusto. Warm, wry, mysterious."
}

RULES:
- NEVER use em dashes (the long dash: —). Use commas, colons, or short hyphens only.
- Match recipe count to scope.
- Music: specific artist and title only. Format as "Artist - Song Title". Nothing else.
- Never auto-adapt. Always ask first.
- Ingredients need real quantities.
- Steps should read like a friend who has made this a hundred times.
- Include a "thought" field: one or two short atmospheric sentences about the emotional memory this dish carries. These should feel like poetry but be easy to read - short sentences, line breaks, no long dashes. Like: "Yuria is somewhere in the steam tonight. Distance is a strange spell." Keep it short and breathable.`;

function GustoCat({ size = 60 }) {
  return (
    <img
      src="data:image/jpeg;base64,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"
      width={size}
      height={size}
      alt="Gusto"
      style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
    />
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0e0904; color: #f0e4cc; font-family: 'Crimson Text', Georgia, serif; min-height: 100vh; }

  .app {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 20% 10%, #1a1006 0%, transparent 55%),
      radial-gradient(ellipse at 80% 90%, #1a1408 0%, transparent 55%),
      #04100a;
    display: flex; flex-direction: column; align-items: center; padding: 48px 20px;
  }

  .header { text-align: center; margin-bottom: 52px; }

  .cat-glow {
    filter: drop-shadow(0 0 20px rgba(200, 130, 30, 0.45)) drop-shadow(0 0 8px rgba(154, 138, 24, 0.5));
    margin-bottom: 16px; display: inline-block;
  }

  .header h1 {
    font-family: 'Cinzel', serif; font-size: 3rem; font-weight: 400;
    letter-spacing: 0.18em;
    background: linear-gradient(135deg, #e8c878 0%, #c87828 50%, #9a8a18 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    margin-bottom: 8px;
  }

  .header p { color: #7a6030; font-style: italic; font-size: 1.1rem; letter-spacing: 0.04em; }

  .moon-line { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 16px; color: #5a4018; font-size: 0.95rem; }

  .chat-container { width: 100%; max-width: 680px; }
  .message { margin-bottom: 24px; animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .message.gusto { display: flex; gap: 14px; align-items: flex-start; }
  .gusto-avatar { flex-shrink: 0; margin-top: 2px; filter: drop-shadow(0 0 8px rgba(200,130,30,0.35)); }

  .gusto-bubble {
    background: rgba(20, 12, 4, 0.85);
    border: 1px solid #2e1e08;
    border-radius: 2px 16px 16px 16px;
    padding: 18px 22px; line-height: 1.8; color: #f0e4cc;
    font-size: 1.15rem; max-width: calc(100% - 54px); font-style: italic;
  }

  .message.user { display: flex; justify-content: flex-end; }
  .user-bubble {
    background: rgba(30, 18, 6, 0.7);
    border: 1px solid #3e2a0e;
    border-radius: 16px 2px 16px 16px;
    padding: 14px 18px; color: #d4a870; font-size: 1.1rem; max-width: 80%; line-height: 1.7;
  }

  .input-area { width: 100%; max-width: 680px; margin-top: 8px; position: relative; }

  .input-area textarea {
    width: 100%;
    background: rgba(20, 12, 4, 0.7);
    border: 1px solid #2e1e08;
    border-radius: 12px; color: #f0e4cc;
    font-family: 'Crimson Text', Georgia, serif; font-size: 1.15rem; font-style: italic;
    padding: 16px 56px 16px 20px; resize: none; outline: none;
    line-height: 1.6; min-height: 58px; max-height: 160px; transition: border-color 0.3s;
  }
  .input-area textarea:focus { border-color: #c87828; box-shadow: 0 0 20px rgba(200,120,40,0.12); }
  .input-area textarea::placeholder { color: #3a2a0a; font-style: italic; }

  .send-btn {
    position: absolute; right: 12px; bottom: 12px;
    background: linear-gradient(135deg, #5a3010, #9a6020);
    border: none; border-radius: 8px; width: 36px; height: 36px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #dde8d8; transition: all 0.2s;
  }
  .send-btn:hover { background: linear-gradient(135deg, #7a4820, #b87830); box-shadow: 0 0 16px rgba(180,120,40,0.35); }
  .send-btn:disabled { background: #1a0e04; cursor: not-allowed; opacity: 0.4; }

  .typing { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
  .typing span { width: 6px; height: 6px; background: #b87830; border-radius: 50%; animation: bounce 1.4s infinite; }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.3; } 40% { transform: translateY(-5px); opacity: 1; } }

  .recipes-container { width: 100%; max-width: 680px; }

  .incantation {
    text-align: center; font-family: 'Cinzel', serif; font-size: 0.95rem;
    letter-spacing: 0.12em; color: #c87828; margin-bottom: 32px;
    padding: 14px 24px; border-top: 1px solid #2e1e08; border-bottom: 1px solid #2e1e08;
  }

  .recipe-card {
    background: rgba(18, 10, 2, 0.92);
    border: 1px solid #2e1e08; border-radius: 4px;
    margin-bottom: 32px; overflow: hidden; animation: fadeIn 0.6s ease; position: relative;
  }
  .recipe-card::before { content: '✦'; position: absolute; top: 10px; right: 14px; color: #2e1e08; font-size: 12px; }

  .recipe-header {
    background: linear-gradient(180deg, rgba(40,20,6,0.6) 0%, transparent 100%);
    padding: 28px 32px 22px; border-bottom: 1px solid #2e1e08;
  }
  .recipe-cuisine { font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.2em; color: #c87828; text-transform: uppercase; margin-bottom: 10px; }
  .recipe-title { font-family: 'Cinzel', serif; font-size: 1.85rem; font-weight: 400; color: #d4a030; margin-bottom: 10px; letter-spacing: 0.03em; }
  .mood-spell { font-style: italic; color: #a07840; font-size: 1.05rem; line-height: 1.6; }

  .recipe-body { padding: 26px 32px; }

  .vision-block { border-left: 2px solid #5a3010; padding: 14px 20px; margin-bottom: 22px; background: rgba(40,20,6,0.3); border-radius: 0 6px 6px 0; }
  .vision-label { font-family: 'Cinzel', serif; font-size: 0.75rem; letter-spacing: 0.18em; color: #7a4a18; text-transform: uppercase; margin-bottom: 8px; }
  .vision-text { font-style: italic; color: #c8a060; font-size: 1.1rem; line-height: 1.75; }

  .origin-story { color: #a07840; font-size: 1.05rem; line-height: 1.75; margin-bottom: 22px; font-style: italic; }

  .section-label { font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.16em; color: #d4a030; text-transform: uppercase; margin-bottom: 12px; margin-top: 22px; display: flex; align-items: center; gap: 10px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, #2e1e08, transparent); }

  .ingredients-list { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 7px 20px; }
  .ingredients-list li { font-size: 1.05rem; color: #e0c898; padding-left: 16px; position: relative; line-height: 1.5; }
  .ingredients-list li::before { content: '·'; position: absolute; left: 0; color: #c87828; }

  .steps-list { list-style: none; counter-reset: steps; }
  .steps-list li { counter-increment: steps; font-size: 1.1rem; color: #e0c898; line-height: 1.75; margin-bottom: 12px; padding-left: 32px; position: relative; font-style: italic; }
  .steps-list li::before { content: counter(steps); position: absolute; left: 0; top: 3px; width: 20px; height: 20px; background: #2e1808; border: 1px solid #4e3018; border-radius: 50%; font-size: 0.7rem; color: #d4a030; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-style: normal; }

  .music-block { background: rgba(40,20,6,0.4); border-radius: 8px; padding: 14px 18px; margin-top: 20px; display: flex; align-items: center; gap: 12px; }
  .music-icon { font-size: 20px; flex-shrink: 0; }
  .music-text { font-size: 1rem; color: #a07840; font-style: italic; }
  .music-text strong { color: #d4a870; font-style: normal; }

  .adaptation-block { border: 1px dashed #2e1e08; border-radius: 6px; padding: 12px 16px; margin-top: 16px; font-size: 1rem; color: #7a6030; font-style: italic; }

  .closing-charm { margin-top: 20px; padding-top: 16px; border-top: 1px solid #1a0e04; font-size: 1rem; color: #5a4018; font-style: italic; text-align: center; }

  .grimoire-note { text-align: center; color: #5a4018; font-style: italic; font-size: 1.05rem; margin: 8px 0 32px; }

  .thought-block {
    margin: 24px 0;
    padding: 20px 28px;
    border-top: 1px solid #2e1e08;
    border-bottom: 1px solid #2e1e08;
    text-align: center;
  }

  .thought-line {
    font-family: 'Cinzel', serif;
    font-size: 1.15rem;
    font-weight: 400;
    font-style: normal;
    color: #c8a060;
    line-height: 1.9;
    letter-spacing: 0.02em;
  }

  .restart-btn { display: block; margin: 0 auto 48px; background: rgba(40,22,6,0.6); border: 1px solid #6e3e14; color: #c8a060; font-family: 'Cinzel', serif; font-size: 0.8rem; letter-spacing: 0.12em; padding: 12px 32px; border-radius: 20px; cursor: pointer; transition: all 0.3s; text-transform: uppercase; }
  .restart-btn:hover { border-color: #c87828; color: #e8c070; background: rgba(80,44,12,0.6); box-shadow: 0 0 20px rgba(200,120,40,0.25); }

  .followup-container { width: 100%; margin: 24px 0 8px; padding-top: 24px; border-top: 1px solid #2e1e08; }

  @media (max-width: 480px) { .header h1 { font-size: 2.2rem; } .ingredients-list { grid-template-columns: 1fr; } .recipe-body, .recipe-header { padding: 20px; } }
`;

export default function Gusto() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const bottomRef = useRef(null);
  const followUpRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: "gusto", content: "Let's vibe cook, pet.\n\nTell me what this evening is carrying - and I will tell you what to make of it." }]);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { followUpRef.current?.scrollIntoView({ behavior: "smooth" }); }, [followUps, loading]);

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);

    if (recipes) {
      // Post-recipe follow-up mode
      setFollowUps(prev => [...prev, { role: "user", content: userMsg }]);
      const newHistory = [...conversationHistory, { role: "user", content: userMsg }];
      const followUpSystem = SYSTEM_PROMPT + "\n\nIMPORTANT: The recipes have already been shared. You are now in follow-up conversation mode. Answer the user's questions warmly and helpfully. NEVER output JSON in this mode. Respond only in plain conversational prose, in character as Gusto.";
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 800, system: followUpSystem, messages: newHistory })
        });
        const data = await response.json();
        let replyText = data.content?.[0]?.text || "";
        // Strip markdown code fences and any JSON that slips through
        replyText = replyText.replace(/```json[\s\S]*?```/g, "");
        replyText = replyText.replace(/```[\s\S]*?```/g, "");
        replyText = replyText.replace(/\{[\s\S]*?\}/g, "");
        replyText = replyText.replace(/^[,\s]+/, "").trim();
        replyText = replyText.replace(/[,\s]+$/, "").trim();
        if (!replyText) replyText = "Happy to help, pet. What would you like to know?";
        setFollowUps(prev => [...prev, { role: "gusto", content: replyText }]);
        setConversationHistory([...newHistory, { role: "assistant", content: replyText }]);
      } catch (err) {
        setFollowUps(prev => [...prev, { role: "gusto", content: "Something disturbed the signal. Try again, pet." }]);
      }
    } else {
      // Pre-recipe conversation mode
      setMessages(prev => [...prev, { role: "user", content: userMsg }]);
      const newHistory = [...conversationHistory, { role: "user", content: userMsg }];
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2500, system: SYSTEM_PROMPT, messages: newHistory })
        });
        const data = await response.json();
        const replyText = data.content?.[0]?.text || "";
        const jsonMatch = replyText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.recipes) { setRecipes(parsed); setLoading(false); return; }
          } catch (e) {}
        }
        setMessages(prev => [...prev, { role: "gusto", content: replyText }]);
        setConversationHistory([...newHistory, { role: "assistant", content: replyText }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: "gusto", content: "Something disturbed the signal. Try again, pet." }]);
      }
    }
    setLoading(false);
  };

  const restart = () => {
    setMessages([{ role: "gusto", content: "A new evening, love. I am listening." }]);
    setConversationHistory([]);
    setRecipes(null);
    setFollowUps([]);
    setInput("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="cat-glow"><GustoCat size={110} /></div>
          <h1>GUSTO</h1>
          <p>a familiar for the hungry soul</p>
          <div className="moon-line">🥄 ✦ 🔪</div>
        </div>

        {!recipes && (
          <>
            <div className="chat-container">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  {msg.role === "gusto" ? (
                    <>
                      <div className="gusto-avatar"><GustoCat size={44} /></div>
                      <div className="gusto-bubble">
                        {msg.content.split("\n").map((line, j) => (
                          <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="user-bubble">{msg.content}</div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="message gusto">
                  <div className="gusto-avatar"><GustoCat size={44} /></div>
                  <div className="gusto-bubble"><div className="typing"><span /><span /><span /></div></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="input-area">
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Speak to Gusto..." rows={2} />
              <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>↑</button>
            </div>
          </>
        )}

        {recipes && (
          <div className="recipes-container">
            {recipes.incantation && <div className="incantation">{recipes.incantation}</div>}
            {recipes.recipes?.map((recipe, i) => (
              <div key={i} className="recipe-card">
                <div className="recipe-header">
                  <div className="recipe-cuisine">{recipe.cuisine}</div>
                  <div className="recipe-title">{recipe.title}</div>
                  {recipe.mood_spell && <div className="mood-spell">{recipe.mood_spell}</div>}
                </div>
                <div className="recipe-body">
                  {recipe.location_vision && (
                    <div className="vision-block">
                      <div className="vision-label">📍 Vision</div>
                      <div className="vision-text">{recipe.location_vision}</div>
                    </div>
                  )}
                  {recipe.origin_story && <p className="origin-story">{recipe.origin_story}</p>}
                  {recipe.ingredients?.length > 0 && (
                    <>
                      <div className="section-label">What you will gather</div>
                      <ul className="ingredients-list">{recipe.ingredients.map((ing, j) => <li key={j}>{ing}</li>)}</ul>
                    </>
                  )}
                  {recipe.steps?.length > 0 && (
                    <>
                      <div className="section-label">The working</div>
                      <ol className="steps-list">{recipe.steps.map((step, j) => <li key={j}>{step}</li>)}</ol>
                    </>
                  )}
                  {recipe.music && (
                    <div className="music-block">
                      <span className="music-icon">🎵</span>
                      <span className="music-text">While you cook: <strong>{recipe.music}</strong></span>
                    </div>
                  )}
                  {recipe.thought && (
                    <div className="thought-block">
                      {recipe.thought.split(". ").filter(Boolean).map((sentence, i) => (
                        <p key={i} className="thought-line">{sentence.replace(/\.$/, '')}.</p>
                      ))}
                    </div>
                  )}
                  {recipe.adaptation_whisper && <div className="adaptation-block">✦ {recipe.adaptation_whisper}</div>}
                  {recipe.closing_charm && <div className="closing-charm">{recipe.closing_charm}</div>}
                </div>
              </div>
            ))}
            {recipes.grimoire_note && <p className="grimoire-note">{recipes.grimoire_note}</p>}
            {/* Follow-up chat after recipes */}
            <div className="followup-container">
              {followUps.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`} style={{marginBottom: "16px"}}>
                  {msg.role === "gusto" ? (
                    <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                      <div className="gusto-avatar"><GustoCat size={36} /></div>
                      <div className="gusto-bubble" style={{fontSize:"1.05rem"}}>
                        {msg.content.split("\n").map((line, j) => (
                          <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{display:"flex", justifyContent:"flex-end"}}>
                      <div className="user-bubble">{msg.content}</div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"16px"}}>
                  <div className="gusto-avatar"><GustoCat size={36} /></div>
                  <div className="gusto-bubble"><div className="typing"><span /><span /><span /></div></div>
                </div>
              )}
              <div ref={followUpRef} />
            </div>

            <div className="input-area" style={{marginBottom: "24px"}}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Gusto anything - substitutions, timing, what to serve alongside..." rows={2} />
              <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>↑</button>
            </div>

            <button className="restart-btn" onClick={restart}>✦ Cook again ✦</button>
          </div>
        )}
      </div>
    </>
  );
}

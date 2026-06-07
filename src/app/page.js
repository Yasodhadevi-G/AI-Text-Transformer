"use client";

import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("summarize");
  const [tone, setTone] = useState("simple");
  const [target, setTarget] = useState("Tamil");

  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const MODES = [
    {
      key: "summarize",
      label: "Summarize",
    },
    {
      key: "rewrite",
      label: "Rewrite",
    },
    {
      key: "translate",
      label: "Translate",
    },
  ];

  function loadSample() {
    setText(
      "I built a small feature to speed up the app. It loads faster now, and users should notice the difference. There were a few changes in the API and UI."
    );
  }

  function clearFields() {
    setText("");
    setOutput("");
  }

  async function onCopy() {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  }

  async function transform() {
    if (!text.trim()) {
      setOutput("Please enter some text.");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          mode,
          tone,
          target,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setOutput(data.output);
    } catch (error) {
      console.error(error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            AI Text Transformer
          </h1>

          <p className="mt-2 text-zinc-400">
            Summarize, Rewrite and Translate text using Gemini AI
          </p>
        </header>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          {/* Top Controls */}
          <div className="flex flex-wrap gap-2">
            {MODES.map((item) => (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  mode === item.key
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-auto flex gap-2">
              <button
                onClick={loadSample}
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
              >
                Load Sample
              </button>

              <button
                onClick={clearFields}
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Input Section */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Input Text
              </label>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                className="h-72 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 outline-none focus:border-zinc-500"
              />

              {/* Rewrite Options */}
              {mode === "rewrite" && (
                <div className="mt-3">
                  <label className="mr-2 text-sm text-zinc-300">
                    Tone:
                  </label>

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
                  >
                    <option value="simple">Simple</option>
                    <option value="professional">
                      Professional
                    </option>
                    <option value="friendly">
                      Friendly
                    </option>
                    <option value="funny">
                      Funny
                    </option>
                  </select>
                </div>
              )}

              {/* Translate Options */}
              {mode === "translate" && (
                <div className="mt-3">
                  <label className="mr-2 text-sm text-zinc-300">
                    Target Language:
                  </label>

                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Kannada">Kannada</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              )}

              <button
                onClick={transform}
                disabled={loading}
                className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
              >
                {loading ? "Thinking..." : "Transform"}
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Output
              </label>

              <div className="h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                {output ? (
                  output
                ) : (
                  <span className="text-zinc-500">
                    Your transformed text will appear here...
                  </span>
                )}
              </div>

              <button
                onClick={onCopy}
                className="mt-4 w-full rounded-xl border border-zinc-700 px-3 py-2 hover:bg-zinc-800"
              >
                Copy Output
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-zinc-500">
          Powered by Gemini AI
        </footer>
      </div>
    </main>
  );
}
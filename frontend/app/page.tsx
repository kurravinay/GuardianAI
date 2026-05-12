"use client"

import { useState } from "react"
import axios from "axios"

export default function Home() {

  const [text, setText] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const [result, setResult] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  async function analyzeText() {

    setLoading(true)

    try {

      const response = await axios.post(
        "https://guardianai-hedp.onrender.com/analyze-text",
        {
          text
        }
      )

      setResult(response.data)

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  async function analyzeImage() {

    if (!image) return

    setLoading(true)

    const formData = new FormData()

    formData.append("file", image)

    try {

      const response = await axios.post(
        "https://guardianai-hedp.onrender.com/analyze-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      setResult(response.data)

    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HERO */}

        <div className="text-center mb-14">

          <div className="inline-block px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm mb-6">
            AI Cybersecurity Assistant
          </div>

          <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
            Guardian AI
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Detect phishing, scam messages, fake job offers,
            malicious links, and fraud screenshots instantly using AI.
          </p>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Analyze Suspicious Message
            </h2>

            <textarea
              placeholder="Paste suspicious email, WhatsApp message, or SMS..."
              className="w-full h-48 rounded-2xl bg-black/30 border border-white/10 p-5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e)=>setText(e.target.value)}
            />

            <button
              onClick={analyzeText}
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-all duration-300 py-4 rounded-2xl font-bold text-lg shadow-lg"
            >
              Analyze Text
            </button>

            {/* IMAGE SECTION */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                Upload Screenshot
              </h2>

              <label className="border-2 border-dashed border-gray-700 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-all">

                <p className="text-gray-400 mb-3">
                  Upload scam screenshot
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e)=>{

                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0])
                    }

                  }}
                />

                <div className="bg-red-500 px-6 py-3 rounded-xl font-semibold">
                  Choose Image
                </div>

              </label>

              {image && (

                <div className="mt-6">

                  <img
                    src={URL.createObjectURL(image)}
                    className="rounded-2xl border border-white/10 max-h-72 object-cover"
                  />

                  <button
                    onClick={analyzeImage}
                    className="w-full mt-5 bg-gradient-to-r from-blue-500 to-cyan-500 py-4 rounded-2xl font-bold text-lg"
                  >
                    Analyze Screenshot
                  </button>

                </div>

              )}

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              AI Analysis Results
            </h2>

            {loading && (

              <div className="flex flex-col items-center justify-center h-full py-24">

                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>

                <p className="text-gray-400 text-lg">
                  Guardian AI is analyzing...
                </p>

              </div>

            )}

            {!loading && !result && (

              <div className="flex items-center justify-center h-full py-32 text-gray-500 text-center">

                Upload suspicious content to begin AI analysis

              </div>

            )}

            {!loading && result && (

              <div className="space-y-6">

                {/* RISK */}

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">

                  <p className="text-gray-400 mb-2">
                    Risk Level
                  </p>

                  <h3 className="text-4xl font-extrabold text-red-400 uppercase">
                    {result.risk_level}
                  </h3>

                </div>

                {/* SCORE */}

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">

                  <p className="text-gray-400 mb-2">
                    Scam Score
                  </p>

                  <h3 className="text-5xl font-extrabold text-yellow-300">
                    {result.scam_score}/100
                  </h3>

                </div>

                {/* EXPLANATION */}

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                  <p className="text-gray-400 mb-3">
                    AI Explanation
                  </p>

                  <p className="text-lg leading-relaxed">
                    {result.explanation}
                  </p>

                </div>

                {/* RECOMMENDATION */}

                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">

                  <p className="text-gray-400 mb-3">
                    Recommended Action
                  </p>

                  <p className="text-lg text-green-300">
                    {result.recommended_action}
                  </p>

                </div>

                {/* OCR */}

                {result.ocr_text && (

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">

                    <p className="text-gray-400 mb-3">
                      OCR Extracted Text
                    </p>

                    <pre className="whitespace-pre-wrap text-sm text-blue-100">
                      {result.ocr_text}
                    </pre>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </main>

  )
}

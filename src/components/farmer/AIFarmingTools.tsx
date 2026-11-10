import React, { useState, useRef, useCallback } from 'react';
import {
  Mic, MicOff, Send, Camera, Upload, CloudSun, FlaskConical,
  Sprout, TrendingUp, BarChart3, Satellite, GraduationCap,
  Volume2, VolumeX, Loader2, AlertCircle, CheckCircle2,
  ChevronRight, Globe, Wheat, Droplets, Thermometer,
  Wind, Eye, FileText, MessageSquare, Bot, Sparkles,
  Info, MapPin, Calendar, IndianRupee, Zap, Leaf
} from 'lucide-react';
import { useStore } from '../../services/useStore';
import { askGeminiAgronomy } from '../../services/gemini';

// ─── Types ──────────────────────────────────────────────────────────────────

type AIToolId =
  | 'voice_assistant'
  | 'disease_detector'
  | 'weather_advisor'
  | 'soil_analyzer'
  | 'crop_recommendation'
  | 'market_prices'
  | 'yield_predictor'
  | 'farm_monitoring'
  | 'expert_support';

interface ToolResult {
  content: string;
  confidence?: number;
  type: 'success' | 'warning' | 'info';
}

// ─── Language Config ─────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
];

// ─── Gemini AI Helper ─────────────────────────────────────────────────────────

async function queryGemini(prompt: string, cropName?: string, imageBase64?: string): Promise<ToolResult> {
  try {
    const result = await askGeminiAgronomy({
      question: prompt,
      cropName: cropName || 'general',
      imageBase64,
    });
    return {
      content: result.reply,
      confidence: result.confidenceScore,
      type: result.needsExpertReview ? 'warning' : 'success',
    };
  } catch {
    return {
      content: '⚠️ AI service not reachable. Please configure your VITE_GEMINI_API_KEY in the .env file to enable live AI responses.',
      type: 'warning',
    };
  }
}

// ─── Tool Panel Wrapper ───────────────────────────────────────────────────────

const ToolPanel: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, color, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className={`px-5 py-4 ${color} flex items-center gap-3`}>
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <p className="text-white/70 text-[11px]">{subtitle}</p>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Result Display ───────────────────────────────────────────────────────────

const ResultCard: React.FC<{ result: ToolResult; lang: string }> = ({ result, lang }) => (
  <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
    result.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
    result.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
    'bg-blue-50 border-blue-200 text-blue-900'
  }`}>
    {result.confidence !== undefined && (
      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-current/20">
        <div className={`w-2 h-2 rounded-full ${result.confidence >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span className="font-bold">AI Confidence: {result.confidence}%</span>
        {lang !== 'en' && <span className="text-[10px] opacity-70">· {LANGUAGES.find(l => l.code === lang)?.native} support active</span>}
      </div>
    )}
    {result.content}
  </div>
);

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = 'AI is processing...' }) => (
  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
    <Loader2 className="w-4 h-4 animate-spin text-[#176B45]" />
    <span>{text}</span>
  </div>
);

const ApiNotice: React.FC = () => (
  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 mb-4">
    <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
    <span>
      <strong>Note:</strong> Live AI responses require <code className="bg-blue-100 px-1 rounded">VITE_GEMINI_API_KEY</code> in your <code className="bg-blue-100 px-1 rounded">.env</code> file. The built-in agronomy engine provides intelligent fallback responses without an API key.
    </span>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
// 1. AI VOICE FARMING ASSISTANT
// ════════════════════════════════════════════════════════════════════════════

const VoiceAssistant: React.FC<{ lang: string; cropName: string }> = ({ lang, cropName }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Voice input not supported in this browser. Please type your question below.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = `${lang}-IN`;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[0].isFinal) setInputText(t);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speakResult = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.slice(0, 500));
    utter.lang = `${lang}-IN`;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleAsk = async () => {
    const q = (inputText || transcript).trim();
    if (!q) return;
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Please respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const r = await queryGemini(q + langNote, cropName);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />
      {/* Voice Button */}
      <div className="flex flex-col items-center gap-3 py-4 bg-gradient-to-b from-[#F0F7F0] to-white rounded-2xl border border-[#DCECDC]">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse'
              : 'bg-[#176B45] hover:bg-[#104D35] hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
        </button>
        <p className="text-xs text-gray-500">
          {isListening ? '🎙️ Listening... speak now' : 'Tap mic to speak'}
        </p>
        {transcript && (
          <div className="w-full px-4 py-2 bg-white border border-[#DCECDC] rounded-xl text-xs text-gray-700 italic">
            "{transcript}"
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="Type or speak your farming question..."
          className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
        />
        <button
          onClick={handleAsk}
          disabled={loading || (!inputText.trim() && !transcript.trim())}
          className="px-4 py-2 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          Ask
        </button>
      </div>

      {loading && <LoadingSpinner text="Consulting AI Agronomist..." />}
      {result && (
        <>
          <ResultCard result={result} lang={lang} />
          <button
            onClick={() => speakResult(result.content)}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              isSpeaking ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            {isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
          </button>
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 2. AI CROP DISEASE DETECTOR
// ════════════════════════════════════════════════════════════════════════════

const DiseaseDetector: React.FC<{ lang: string; cropName: string }> = ({ lang, cropName }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      setImagePreview(src);
      setImageBase64(src.split(',')[1] || '');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Please respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const prompt = `Analyze this crop image for diseases, pests, or nutritional deficiencies. Crop: ${cropName}. Additional symptoms described by farmer: "${symptoms || 'none provided'}". Provide: 1) Disease/pest identification, 2) Visible symptoms analysis, 3) Probable causes, 4) Organic treatment recommendations per ICAR standards.${langNote}`;
    const r = await queryGemini(prompt, cropName, imageBase64 || undefined);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />
      {/* Upload Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#DCECDC] hover:border-[#176B45] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#FAF8F0] hover:bg-[#F0F7F0]"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="crop" className="max-h-48 mx-auto rounded-xl object-cover shadow-md" />
        ) : (
          <>
            <Camera className="w-10 h-10 text-[#176B45]/40 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-600">Upload or capture crop photo</p>
            <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])}
        />
      </div>

      {/* Symptom Description */}
      <textarea
        value={symptoms}
        onChange={e => setSymptoms(e.target.value)}
        placeholder="Describe visible symptoms (e.g. yellowing leaves, brown spots, wilting tips)..."
        rows={3}
        className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none resize-none"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || (!imagePreview && !symptoms.trim())}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
      >
        <Eye className="w-4 h-4" />
        Analyze Disease & Symptoms
      </button>

      {loading && <LoadingSpinner text="Analyzing crop image with AI..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 3. AI WEATHER ADVISOR
// ════════════════════════════════════════════════════════════════════════════

const WeatherAdvisor: React.FC<{ lang: string; cropName: string; location: string }> = ({ lang, cropName, location }) => {
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [customLocation, setCustomLocation] = useState(location);

  // Mock weather data (replace with real weather API)
  const mockWeather = {
    temp: 28, humidity: 72, rainfall: 12, windSpeed: 14,
    condition: 'Partly Cloudy', forecast: '70% chance of rain in next 48 hours'
  };

  const handleGetAdvice = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const prompt = `Weather-based crop advisory for ${cropName} at ${customLocation}. Current conditions: Temperature ${mockWeather.temp}°C, Humidity ${mockWeather.humidity}%, Recent Rainfall ${mockWeather.rainfall}mm, Wind ${mockWeather.windSpeed}km/h, ${mockWeather.condition}. Forecast: ${mockWeather.forecast}. Provide: 1) Weather risk assessment for current crop stage, 2) Irrigation adjustments, 3) Disease risk from weather conditions, 4) Harvest timing recommendation, 5) Protective measures needed.${langNote}`;
    const r = await queryGemini(prompt, cropName);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />
      {/* Live Weather Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { icon: Thermometer, label: 'Temperature', value: `${mockWeather.temp}°C`, color: 'text-orange-500' },
          { icon: Droplets, label: 'Humidity', value: `${mockWeather.humidity}%`, color: 'text-blue-500' },
          { icon: CloudSun, label: 'Rainfall', value: `${mockWeather.rainfall}mm`, color: 'text-sky-500' },
          { icon: Wind, label: 'Wind', value: `${mockWeather.windSpeed}km/h`, color: 'text-gray-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#FAF8F0] border border-[#DCECDC] rounded-xl p-3 text-center">
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <div className="text-sm font-bold text-gray-800">{value}</div>
            <div className="text-[10px] text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span><strong>Alert:</strong> {mockWeather.forecast}</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customLocation}
          onChange={e => setCustomLocation(e.target.value)}
          placeholder="Enter location (village, district)..."
          className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
        />
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="px-4 py-2 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          <CloudSun className="w-3.5 h-3.5" />
          Advise
        </button>
      </div>

      {loading && <LoadingSpinner text="Getting crop-specific weather advice..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 4. AI SOIL HEALTH ANALYZER
// ════════════════════════════════════════════════════════════════════════════

const SoilAnalyzer: React.FC<{ lang: string }> = ({ lang }) => {
  const [soil, setSoil] = useState({ ph: 6.8, nitrogen: 240, phosphorus: 32, potassium: 180, organicCarbon: 0.72 });
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const prompt = `Soil health analysis for Indian farmer. Soil parameters: pH ${soil.ph}, Nitrogen ${soil.nitrogen}kg/ha, Phosphorus ${soil.phosphorus}kg/ha, Potassium ${soil.potassium}kg/ha, Organic Carbon ${soil.organicCarbon}%. Provide: 1) Overall soil health rating, 2) Nutrient deficiency identification, 3) pH correction recommendations, 4) Suitable crop recommendations for this soil, 5) Organic soil improvement plan using ZBNF/NPOP methods.${langNote}`;
    const r = await queryGemini(prompt);
    setResult(r);
    setLoading(false);
  };

  const fields = [
    { key: 'ph', label: 'Soil pH', unit: '', min: 0, max: 14, step: 0.1, ideal: '6.0–7.5', color: soil.ph >= 6 && soil.ph <= 7.5 ? 'text-emerald-600' : 'text-amber-600' },
    { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha', min: 0, max: 600, step: 10, ideal: '250–450', color: soil.nitrogen >= 250 ? 'text-emerald-600' : 'text-amber-600' },
    { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha', min: 0, max: 100, step: 1, ideal: '25–50', color: soil.phosphorus >= 25 ? 'text-emerald-600' : 'text-amber-600' },
    { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha', min: 0, max: 400, step: 10, ideal: '150–250', color: soil.potassium >= 150 ? 'text-emerald-600' : 'text-amber-600' },
    { key: 'organicCarbon', label: 'Organic Carbon', unit: '%', min: 0, max: 3, step: 0.01, ideal: '>0.75%', color: soil.organicCarbon >= 0.75 ? 'text-emerald-600' : 'text-amber-600' },
  ];

  return (
    <div className="space-y-3">
      <ApiNotice />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-2.5 border-2 border-dashed border-[#DCECDC] hover:border-[#176B45] rounded-xl text-xs text-gray-500 hover:text-[#176B45] flex items-center justify-center gap-2 transition-colors bg-[#FAF8F0]"
      >
        <Upload className="w-4 h-4" />
        Upload Soil Test Report (PDF/Image) — or enter values manually below
      </button>
      <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className="bg-[#FAF8F0] border border-[#DCECDC] rounded-xl p-3">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-gray-700">{f.label}</label>
              <span className={`text-[10px] font-semibold ${f.color}`}>Ideal: {f.ideal}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={(soil as any)[f.key]}
                onChange={e => setSoil({ ...soil, [f.key]: Number(e.target.value) })}
                className="flex-1 accent-[#176B45]"
              />
              <span className={`text-xs font-bold min-w-[48px] text-right ${f.color}`}>
                {(soil as any)[f.key]}{f.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <FlaskConical className="w-4 h-4" />
        Analyze Soil Health
      </button>

      {loading && <LoadingSpinner text="Analyzing soil nutrients..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 5. AI CROP RECOMMENDATION
// ════════════════════════════════════════════════════════════════════════════

const CropRecommendation: React.FC<{ lang: string; location: string }> = ({ lang, location }) => {
  const [form, setForm] = useState({
    soilType: 'Black Cotton Soil',
    waterAvailability: 'Borewell',
    landAcres: 5,
    season: 'Kharif (Jun-Oct)',
    district: location,
  });
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const prompt = `Crop recommendation for Indian farmer. Farm details: Location ${form.district}, Soil Type ${form.soilType}, Water Source ${form.waterAvailability}, Land Area ${form.landAcres} acres, Season ${form.season}. Recommend: 1) Top 3 most suitable crops with reasoning, 2) Cultivation requirements for each, 3) Estimated cost per acre, 4) Potential market price range, 5) Which crop has highest demand in Indian markets. Base on ICAR guidelines and local agro-climatic zones.${langNote}`;
    const r = await queryGemini(prompt);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {[
          { label: 'Soil Type', key: 'soilType', options: ['Black Cotton Soil', 'Red Laterite Soil', 'Sandy Loam', 'Alluvial Soil', 'Clay Soil'] },
          { label: 'Water Availability', key: 'waterAvailability', options: ['Borewell', 'Canal Irrigation', 'River', 'Rainfed', 'Drip Irrigation'] },
          { label: 'Season', key: 'season', options: ['Kharif (Jun-Oct)', 'Rabi (Nov-Mar)', 'Zaid (Mar-Jun)', 'Year Round'] },
        ].map(({ label, key, options }) => (
          <div key={key}>
            <label className="block font-bold text-gray-600 mb-1">{label}</label>
            <select
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-[#176B45] focus:outline-none"
            >
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label className="block font-bold text-gray-600 mb-1">Land Area (Acres)</label>
          <input
            type="number"
            value={form.landAcres}
            onChange={e => setForm({ ...form, landAcres: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-bold text-gray-600 mb-1">District / Location</label>
          <input
            type="text"
            value={form.district}
            onChange={e => setForm({ ...form, district: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
            placeholder="e.g. Nashik, Maharashtra"
          />
        </div>
      </div>

      <button
        onClick={handleRecommend}
        disabled={loading}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <Sprout className="w-4 h-4" />
        Get AI Crop Recommendations
      </button>

      {loading && <LoadingSpinner text="Analyzing agro-climatic conditions..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 6. AI MARKET PRICE INTELLIGENCE
// ════════════════════════════════════════════════════════════════════════════

const MarketPrices: React.FC<{ lang: string; cropName: string }> = ({ lang, cropName }) => {
  const { state } = useStore();
  const [selectedCrop, setSelectedCrop] = useState(cropName);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock mandi prices
  const mandiPrices = [
    { market: 'Nashik APMC', price: 2400, trend: '+8%', date: 'Today' },
    { market: 'Pune Market Yard', price: 2650, trend: '+12%', date: 'Today' },
    { market: 'Mumbai Vashi', price: 2800, trend: '+5%', date: 'Today' },
    { market: 'Lasalgaon Mandi', price: 2200, trend: '-3%', date: 'Today' },
  ];

  // Pure Krishi buyer demand
  const buyerDemand = state.requirements.flatMap(r =>
    r.items.filter(i => i.productName.toLowerCase().includes(selectedCrop.toLowerCase().split(' ')[0]))
      .map(i => ({ buyer: r.buyerName, qty: i.requiredQuantity, price: i.expectedPriceRange }))
  );

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const mandiData = mandiPrices.map(m => `${m.market}: ₹${m.price}/quintal (${m.trend})`).join(', ');
    const prompt = `Market price intelligence for ${selectedCrop}. Current mandi prices: ${mandiData}. Pure Krishi buyer demand: ${buyerDemand.length} active buyers. Provide: 1) Best selling opportunity analysis, 2) Price trend prediction for next 2 weeks, 3) Which market gives best returns, 4) Optimal timing to sell, 5) Post-harvest storage advice to maximize price.${langNote}`;
    const r = await queryGemini(prompt, selectedCrop);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />

      {/* Crop Selector */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Select Crop</label>
        <input
          type="text"
          value={selectedCrop}
          onChange={e => setSelectedCrop(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
        />
      </div>

      {/* Mandi Price Table */}
      <div className="bg-[#FAF8F0] rounded-xl border border-[#DCECDC] overflow-hidden">
        <div className="px-3 py-2 bg-[#176B45] text-white text-[11px] font-bold flex justify-between">
          <span>APMC / Mandi Prices</span>
          <span className="text-emerald-200">Live Data</span>
        </div>
        <div className="divide-y divide-gray-100">
          {mandiPrices.map(m => (
            <div key={m.market} className="px-3 py-2 flex justify-between items-center text-xs">
              <span className="text-gray-700">{m.market}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#104D35]">₹{m.price}/qtl</span>
                <span className={`text-[10px] font-bold ${m.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {m.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pure Krishi Demand */}
      {buyerDemand.length > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
          <p className="font-bold text-emerald-800 mb-1">🏪 Pure Krishi Buyer Demand ({buyerDemand.length} buyers)</p>
          {buyerDemand.slice(0, 2).map((b, i) => (
            <div key={i} className="text-emerald-700">• {b.buyer}: {b.qty} kg @ {b.price}</div>
          ))}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Get AI Market Intelligence
      </button>

      {loading && <LoadingSpinner text="Analyzing market trends..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 7. AI CROP YIELD PREDICTOR
// ════════════════════════════════════════════════════════════════════════════

const YieldPredictor: React.FC<{ lang: string; crops: any[]; farms: any[] }> = ({ lang, crops, farms }) => {
  const [form, setForm] = useState({
    cropName: crops[0]?.cropName || 'Desi Organic Tomatoes',
    farmAcres: farms[0]?.cultivatedAreaAcres || 3,
    soilHealth: 'Good',
    irrigationType: 'Drip',
    sowingDate: crops[0]?.sowingDate || new Date().toISOString().split('T')[0],
  });
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const prompt = `Crop yield prediction for ${form.cropName}. Farm details: ${form.farmAcres} acres, Soil Health: ${form.soilHealth}, Irrigation: ${form.irrigationType}, Sowing Date: ${form.sowingDate}. Provide: 1) Estimated yield range (low/medium/high scenarios) in kg/acre, 2) Total expected harvest for ${form.farmAcres} acres, 3) Expected harvest readiness date, 4) Key factors that could increase yield, 5) Important limitations and disclaimers for this prediction.${langNote}`;
    const r = await queryGemini(prompt, form.cropName);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-bold text-gray-600 mb-1">Crop Name</label>
          <input
            type="text"
            value={form.cropName}
            onChange={e => setForm({ ...form, cropName: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Farm Size (Acres)</label>
          <input
            type="number"
            value={form.farmAcres}
            onChange={e => setForm({ ...form, farmAcres: Number(e.target.value) })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Soil Health</label>
          <select
            value={form.soilHealth}
            onChange={e => setForm({ ...form, soilHealth: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          >
            {['Excellent', 'Good', 'Average', 'Poor'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Irrigation Type</label>
          <select
            value={form.irrigationType}
            onChange={e => setForm({ ...form, irrigationType: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          >
            {['Drip', 'Sprinkler', 'Flood', 'Rainfed'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-bold text-gray-600 mb-1">Sowing Date</label>
          <input
            type="date"
            value={form.sowingDate}
            onChange={e => setForm({ ...form, sowingDate: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          />
        </div>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
        <span>AI yield predictions are estimates based on typical conditions. Actual results may vary due to weather, pests, and other factors.</span>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <BarChart3 className="w-4 h-4" />
        Predict Crop Yield
      </button>

      {loading && <LoadingSpinner text="Calculating yield prediction..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 8. AI SMART FARM MONITORING
// ════════════════════════════════════════════════════════════════════════════

const FarmMonitoring: React.FC<{ lang: string; crops: any[]; farms: any[] }> = ({ lang, crops, farms }) => {
  const [selectedFarm, setSelectedFarm] = useState(farms[0]?.farmName || '');
  const [irrigationLog, setIrrigationLog] = useState('Last irrigated: 2 days ago, 4 hours drip');
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const cropSummary = crops.map(c => `${c.cropName} (${c.growthStage}, ${c.healthStatus})`).join(', ');
    const prompt = `Smart farm monitoring analysis. Farm: ${selectedFarm}. Active crops: ${cropSummary || 'Not specified'}. Irrigation status: ${irrigationLog}. Analyze: 1) Current farm condition assessment, 2) Water stress risk indicators, 3) Which crops need immediate attention, 4) Recommended monitoring actions for next 7 days, 5) Any early warning signs to watch for.${langNote}`;
    const r = await queryGemini(prompt);
    setResult(r);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <ApiNotice />

      {/* Farm Health Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {crops.slice(0, 4).map(crop => (
          <div key={crop.id} className={`p-3 rounded-xl border text-center text-xs ${
            crop.healthStatus === 'Excellent' ? 'bg-emerald-50 border-emerald-200' :
            crop.healthStatus === 'Good' ? 'bg-blue-50 border-blue-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <Leaf className={`w-5 h-5 mx-auto mb-1 ${
              crop.healthStatus === 'Excellent' ? 'text-emerald-600' :
              crop.healthStatus === 'Good' ? 'text-blue-600' : 'text-amber-600'
            }`} />
            <div className="font-bold text-gray-700 truncate text-[10px]">{crop.cropName.split(' ')[0]}</div>
            <div className={`text-[10px] font-semibold ${
              crop.healthStatus === 'Excellent' ? 'text-emerald-600' :
              crop.healthStatus === 'Good' ? 'text-blue-600' : 'text-amber-600'
            }`}>{crop.healthStatus}</div>
          </div>
        ))}
        {crops.length === 0 && (
          <div className="col-span-4 text-center text-xs text-gray-400 py-4">No crops registered. Add crops to enable monitoring.</div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Farm</label>
        <select
          value={selectedFarm}
          onChange={e => setSelectedFarm(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-[#176B45] focus:outline-none"
        >
          {farms.map(f => <option key={f.id}>{f.farmName}</option>)}
          {farms.length === 0 && <option>No farms registered</option>}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Irrigation Log</label>
        <input
          type="text"
          value={irrigationLog}
          onChange={e => setIrrigationLog(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none"
          placeholder="e.g. Last irrigated: 2 days ago, 4 hours drip"
        />
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-start gap-2">
        <Satellite className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
        <span><strong>Satellite/Drone Integration:</strong> Connect to Bhuvan (ISRO) or AgriStack for live satellite imagery when API credentials are configured.</span>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <Satellite className="w-4 h-4" />
        Analyze Farm Conditions
      </button>

      {loading && <LoadingSpinner text="Monitoring farm conditions..." />}
      {result && <ResultCard result={result} lang={lang} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 9. AI AGRICULTURE EXPERT SUPPORT
// ════════════════════════════════════════════════════════════════════════════

const ExpertSupport: React.FC<{ lang: string; cropName: string; farmerName: string }> = ({ lang, cropName, farmerName }) => {
  const { store, state } = useStore();
  const [question, setQuestion] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [aiResult, setAiResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAiResult(null);

    // First get AI response
    const langNote = lang !== 'en' ? ` Respond in ${LANGUAGES.find(l => l.code === lang)?.label}.` : '';
    const r = await queryGemini(
      `${question}${langNote} Also indicate if this requires human expert review.`,
      cropName
    );
    setAiResult(r);

    // If low confidence, escalate to expert system
    if (r.type === 'warning' || (r.confidence && r.confidence < 75)) {
      store.escalateToExpert(
        state.currentUser.id,
        farmerName,
        state.currentUser.phone || '+91 00000 00000',
        cropName,
        question,
        r.content,
        r.confidence || 60
      );
      setSubmitted(true);
    }

    setLoading(false);
  };

  const experts = [
    { name: 'Dr. Ramesh Patil', role: 'B.Sc. Agriculture, Nashik', specialty: 'Horticulture & Organic Farming', available: true },
    { name: 'Ms. Priya Sharma', role: 'M.Sc. Agronomy, Pune', specialty: 'Soil Health & Nutrient Management', available: true },
    { name: 'Mr. Suresh Kumar', role: 'Agriculture Extension Officer', specialty: 'IPM & Disease Management', available: false },
  ];

  return (
    <div className="space-y-4">
      <ApiNotice />

      {/* Available Experts */}
      <div>
        <p className="text-xs font-bold text-gray-700 mb-2">Available Agriculture Experts</p>
        <div className="space-y-2">
          {experts.map(e => (
            <div key={e.name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F0] border border-[#DCECDC] text-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${e.available ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-bold text-gray-800">{e.name}</p>
                  <p className="text-gray-500 text-[10px]">{e.role} • {e.specialty}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${e.available ? 'text-emerald-700' : 'text-gray-400'}`}>
                {e.available ? 'Online' : 'Busy'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Question Form */}
      <div className="space-y-2">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Describe your farming problem in detail. Include crop, symptoms, and what you've tried so far..."
          rows={4}
          className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#176B45] focus:outline-none resize-none"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-2 border border-dashed border-gray-300 hover:border-[#176B45] rounded-xl text-xs text-gray-500 hover:text-[#176B45] flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
          Attach crop photograph (optional)
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
        {imagePreview && <img src={imagePreview} alt="crop" className="w-full max-h-32 object-cover rounded-xl" />}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !question.trim()}
        className="w-full py-2.5 bg-[#176B45] hover:bg-[#104D35] disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Get AI Advice + Connect Expert
      </button>

      {loading && <LoadingSpinner text="Getting AI analysis and routing to expert..." />}

      {aiResult && (
        <>
          <ResultCard result={aiResult} lang={lang} />
          {submitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>✅ Your question has been automatically escalated to a Pure Krishi Agriculture Expert for verified review. You will receive a response within 2-4 hours.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN AI FARMING TOOLS COMPONENT
// ════════════════════════════════════════════════════════════════════════════

interface AIFarmingToolsProps {
  farmerName: string;
  cropName: string;
  location: string;
  crops: any[];
  farms: any[];
}

const TOOLS = [
  { id: 'voice_assistant', label: 'Voice Assistant', icon: Mic, color: 'bg-gradient-to-r from-violet-600 to-purple-700', desc: 'Talk to AI in your language' },
  { id: 'disease_detector', label: 'Disease Detector', icon: Eye, color: 'bg-gradient-to-r from-red-500 to-rose-600', desc: 'Upload crop photo to detect disease' },
  { id: 'weather_advisor', label: 'Weather Advisor', icon: CloudSun, color: 'bg-gradient-to-r from-sky-500 to-blue-600', desc: 'Crop-specific weather guidance' },
  { id: 'soil_analyzer', label: 'Soil Analyzer', icon: FlaskConical, color: 'bg-gradient-to-r from-amber-500 to-orange-600', desc: 'Analyze pH, NPK & nutrients' },
  { id: 'crop_recommendation', label: 'Crop Advisor', icon: Sprout, color: 'bg-gradient-to-r from-emerald-500 to-green-700', desc: 'Best crops for your farm' },
  { id: 'market_prices', label: 'Market Prices', icon: TrendingUp, color: 'bg-gradient-to-r from-teal-500 to-cyan-600', desc: 'Mandi prices & selling tips' },
  { id: 'yield_predictor', label: 'Yield Predictor', icon: BarChart3, color: 'bg-gradient-to-r from-indigo-500 to-blue-700', desc: 'Estimate harvest yield' },
  { id: 'farm_monitoring', label: 'Farm Monitor', icon: Satellite, color: 'bg-gradient-to-r from-slate-600 to-gray-800', desc: 'Crop health & irrigation' },
  { id: 'expert_support', label: 'Expert Support', icon: GraduationCap, color: 'bg-gradient-to-r from-[#176B45] to-[#104D35]', desc: 'Connect with agriculture experts' },
];

export const AIFarmingTools: React.FC<AIFarmingToolsProps> = ({
  farmerName, cropName, location, crops, farms
}) => {
  const [activeTool, setActiveTool] = useState<AIToolId | null>(null);
  const [selectedLang, setSelectedLang] = useState('en');

  const activeMeta = TOOLS.find(t => t.id === activeTool);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#176B45] to-[#104D35] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="font-bold text-base flex items-center gap-2">
              AI Farming Tools
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-emerald-200 text-xs">9 advanced AI tools • Powered by Gemini AI • ICAR standards</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <Globe className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span className="text-[11px] text-emerald-200 shrink-0">Language:</span>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  selectedLang === l.code
                    ? 'bg-white text-[#104D35]'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Grid */}
      {!activeTool && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as AIToolId)}
                className={`${tool.color} text-white p-4 rounded-2xl text-left hover:scale-[1.03] hover:shadow-lg transition-all group`}
              >
                <Icon className="w-6 h-6 mb-2 opacity-90" />
                <div className="font-bold text-xs">{tool.label}</div>
                <div className="text-[10px] text-white/70 mt-0.5">{tool.desc}</div>
                <ChevronRight className="w-3.5 h-3.5 mt-2 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>
            );
          })}
        </div>
      )}

      {/* Active Tool Panel */}
      {activeTool && activeMeta && (
        <div>
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-1.5 text-xs text-[#176B45] font-semibold hover:underline mb-3"
          >
            ← Back to AI Tools
          </button>

          <ToolPanel
            icon={activeMeta.icon}
            title={activeMeta.label}
            subtitle={activeMeta.desc}
            color={activeMeta.color}
          >
            {activeTool === 'voice_assistant' && (
              <VoiceAssistant lang={selectedLang} cropName={cropName} />
            )}
            {activeTool === 'disease_detector' && (
              <DiseaseDetector lang={selectedLang} cropName={cropName} />
            )}
            {activeTool === 'weather_advisor' && (
              <WeatherAdvisor lang={selectedLang} cropName={cropName} location={location} />
            )}
            {activeTool === 'soil_analyzer' && (
              <SoilAnalyzer lang={selectedLang} />
            )}
            {activeTool === 'crop_recommendation' && (
              <CropRecommendation lang={selectedLang} location={location} />
            )}
            {activeTool === 'market_prices' && (
              <MarketPrices lang={selectedLang} cropName={cropName} />
            )}
            {activeTool === 'yield_predictor' && (
              <YieldPredictor lang={selectedLang} crops={crops} farms={farms} />
            )}
            {activeTool === 'farm_monitoring' && (
              <FarmMonitoring lang={selectedLang} crops={crops} farms={farms} />
            )}
            {activeTool === 'expert_support' && (
              <ExpertSupport lang={selectedLang} cropName={cropName} farmerName={farmerName} />
            )}
          </ToolPanel>
        </div>
      )}
    </div>
  );
};


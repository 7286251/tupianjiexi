
import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Copy, 
  Languages, 
  RefreshCcw, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  Code2,
  Rocket,
  Palette,
  Candy
} from 'lucide-react';
import { analyzeImage, translateText } from './services/geminiService';
import { AnalysisResult, ImageFile } from './types';

const BUILTIN_PROMPT = 'Analyze this image in exhaustive JSON detail';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isBeautified, setIsBeautified] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatJSON = (text: string) => {
    try {
      const cleanText = text.replace(/```json\n?|```/g, '').trim();
      const obj = JSON.parse(cleanText);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return text;
    }
  };

  const performAnalysis = async (img: ImageFile) => {
    setIsAnalyzing(true);
    setResult(null);
    setIsBeautified(false);
    setShowTranslation(false);
    try {
      const text = await analyzeImage(img.base64, img.mimeType, BUILTIN_PROMPT);
      setResult({ originalText: text, isLoadingTranslation: false });
    } catch (error) {
      alert('哎呀，解析断片了，再试一次吧！');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          preview: URL.createObjectURL(file),
          base64: reader.result as string,
          mimeType: file.type,
        };
        setImage(newImage);
        performAnalysis(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReanalyze = () => image && performAnalysis(image);

  const handleTranslate = async () => {
    if (!result || result.translatedText) {
      setShowTranslation(!showTranslation);
      return;
    }
    setResult(prev => prev ? { ...prev, isLoadingTranslation: true } : null);
    try {
      const translated = await translateText(result.originalText, 'Chinese');
      setResult(prev => prev ? { ...prev, translatedText: translated, isLoadingTranslation: false } : null);
      setShowTranslation(true);
    } catch (error) {
      alert('翻译星人迷路了...');
      setResult(prev => prev ? { ...prev, isLoadingTranslation: false } : null);
    }
  };

  const getDisplayText = () => {
    if (!result) return "";
    let base = (showTranslation && result.translatedText) ? result.translatedText : result.originalText;
    return isBeautified && !showTranslation ? formatJSON(base) : base;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getDisplayText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setShowTranslation(false);
    setIsBeautified(false);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between dopamine-card px-6 py-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#00E5FF]">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-2xl border-2 border-black rotate-[-5deg] float-animation">
              <Candy className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter text-black">
              超强图片<span className="text-pink-500">反推</span>助手
            </h1>
          </div>
          <div className="flex gap-2">
            {image && (
              <button onClick={reset} className="p-2 bg-red-400 border-2 border-black rounded-xl btn-bounce shadow-[2px_2px_0px_0px_#000]">
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload */}
        <div className="lg:col-span-5 space-y-8">
          <div className="dopamine-card p-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-black text-black">投喂图片</h2>
            </div>
            
            <div className="relative">
              {!image ? (
                <label className="group flex flex-col items-center justify-center w-full h-[450px] border-4 border-dashed border-pink-200 rounded-[2.5rem] cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all bg-white overflow-hidden">
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="p-6 bg-cyan-400 rounded-full border-4 border-black group-hover:rotate-12 transition-transform mb-6 shadow-[6px_6px_0px_0px_#000]">
                      <Upload className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-xl font-black text-black mb-2">猛击这里上传</p>
                    <p className="text-pink-400 font-bold">我会立刻为你深度解析哦！</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative rounded-[2.5rem] border-4 border-black overflow-hidden group shadow-[10px_10px_0px_0px_#FFD600]">
                  <img src={image.preview} alt="Preview" className="w-full h-[450px] object-contain bg-slate-50" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white border-2 border-black text-black px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:bg-yellow-400 transition-all btn-bounce shadow-[4px_4px_0px_0px_#000]">
                      <RefreshCcw className="w-4 h-4" />
                      换一张试试
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-7">
          <div className="dopamine-card bg-white min-h-[600px] flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_#A555EC]">
            <div className="p-6 border-b-4 border-black flex flex-wrap items-center justify-between gap-4 bg-cyan-50 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border-2 border-black ${result ? 'bg-green-400' : 'bg-slate-200'} shadow-[2px_2px_0px_0px_#000]`}>
                  {isAnalyzing ? <RefreshCcw className="w-5 h-5 text-white animate-spin" /> : <Rocket className="w-5 h-5 text-white" />}
                </div>
                <h2 className="text-xl font-black text-black">解析情报站</h2>
              </div>
              
              {result && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsBeautified(!isBeautified)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${
                      isBeautified ? 'bg-purple-400 text-white' : 'bg-white text-black'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    {isBeautified ? '已美化' : '美化JSON'}
                  </button>
                  <button
                    onClick={handleTranslate}
                    disabled={result.isLoadingTranslation}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${
                      showTranslation ? 'bg-pink-500 text-white' : 'bg-white text-black'
                    }`}
                  >
                    <Languages className="w-4 h-4" />
                    {showTranslation ? '看原文' : '翻译中文'}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${
                      copied ? 'bg-green-400 text-white' : 'bg-yellow-400 text-black'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? '搞定！' : '复制'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 bg-white overflow-auto">
              {!result && !isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-pink-100 rounded-full border-4 border-black flex items-center justify-center mb-6 rotate-[-10deg] float-animation shadow-[6px_6px_0px_0px_#FFD1DC]">
                    <ImageIcon className="w-12 h-12 text-pink-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-black">还在等什么？</p>
                    <p className="text-slate-400 font-bold mt-2">快点给我投喂图片吧！</p>
                  </div>
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-8 py-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_#000]">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-lg font-black text-black uppercase tracking-widest">大脑高速运转中...</span>
                  </div>
                  <div className="space-y-4 px-10">
                    <div className="h-6 bg-pink-100 rounded-full border-2 border-pink-200 w-full animate-pulse"></div>
                    <div className="h-6 bg-cyan-100 rounded-full border-2 border-cyan-200 w-3/4 animate-pulse delay-75"></div>
                    <div className="h-6 bg-yellow-100 rounded-full border-2 border-yellow-200 w-5/6 animate-pulse delay-150"></div>
                  </div>
                </div>
              ) : (
                <div className="relative animate-in zoom-in-95 duration-300">
                  <div className="bg-slate-900 text-green-400 p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_#000] font-mono text-sm leading-relaxed overflow-hidden relative">
                    <div className="absolute top-4 right-4 text-slate-700 opacity-20 pointer-events-none uppercase font-black text-4xl rotate-[15deg]">
                      ANALYSIS
                    </div>
                    <pre className="relative z-10 whitespace-pre-wrap">
                      {getDisplayText()}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:block">
         <div className="bg-black text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
            Dopamine Powered AI Engine
         </div>
      </div>
    </div>
  );
};

export default App;

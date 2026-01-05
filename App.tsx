
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
  Candy,
  HelpCircle,
  BookOpen,
  Zap,
  Star,
  Monitor
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

  const copyToClipboard = () => {
    const text = (showTranslation && result?.translatedText) ? result.translatedText : (result?.originalText || "");
    navigator.clipboard.writeText(isBeautified && !showTranslation ? formatJSON(text) : text);
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

      {/* Main Tool Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                  <button onClick={() => setIsBeautified(!isBeautified)} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${isBeautified ? 'bg-purple-400 text-white' : 'bg-white text-black'}`}>
                    <Code2 className="w-4 h-4" />
                    {isBeautified ? '已美化' : '美化JSON'}
                  </button>
                  <button onClick={handleTranslate} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${showTranslation ? 'bg-pink-500 text-white' : 'bg-white text-black'}`}>
                    <Languages className="w-4 h-4" />
                    {showTranslation ? '看原文' : '翻译中文'}
                  </button>
                  <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-sm font-black transition-all btn-bounce shadow-[3px_3px_0px_0px_#000] ${copied ? 'bg-green-400 text-white' : 'bg-yellow-400 text-black'}`}>
                    <Copy className="w-4 h-4" />
                    {copied ? '搞定！' : '复制'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 bg-white overflow-auto">
              {!result && !isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-pink-100 rounded-full border-4 border-black flex items-center justify-center mb-6 rotate-[-10deg] float-animation shadow-[6px_6px_0px_0px_#FFD1DC]">
                    <ImageIcon className="w-12 h-12 text-pink-400" />
                  </div>
                  <p className="text-2xl font-black text-black">还在等什么？</p>
                  <p className="text-slate-400 font-bold mt-2">快点给我投喂图片吧！</p>
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-8 py-10">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-[4px_4px_0px_0px_#000]">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-lg font-black text-black uppercase tracking-widest">大脑高速运转中...</span>
                  </div>
                  <div className="space-y-4 px-10">
                    <div className="h-6 bg-pink-100 rounded-full border-2 border-pink-200 w-full animate-pulse"></div>
                    <div className="h-6 bg-cyan-100 rounded-full border-2 border-cyan-200 w-3/4 animate-pulse delay-75"></div>
                  </div>
                </div>
              ) : (
                <div className="relative animate-in zoom-in-95 duration-300">
                  <div className="bg-slate-900 text-green-400 p-6 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_#000] font-mono text-sm leading-relaxed overflow-hidden relative">
                    <pre className="relative z-10 whitespace-pre-wrap">
                      {(isBeautified && !showTranslation) ? formatJSON(showTranslation ? result.translatedText! : result.originalText) : (showTranslation ? result.translatedText : result.originalText)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- README CONTENT INTEGRATION --- */}
      <section className="max-w-6xl mx-auto px-4 mt-20 space-y-12">
        {/* About & Intro */}
        <div className="dopamine-card bg-yellow-400 p-8 border-4 border-black shadow-[8px_8px_0px_0px_#FF4D94]">
          <div className="flex items-center gap-4 mb-6">
            <HelpCircle className="w-10 h-10 text-black" />
            <h2 className="text-3xl font-black text-black">这是什么？</h2>
          </div>
          <p className="text-xl font-bold leading-relaxed text-black">
            「超强图片反推解析助手」是一款基于 <span className="underline decoration-pink-500 decoration-4">Gemini 3 系列模型</span> 的深度图像分析工具。
            它能以显微镜般的视角，将图片中的每一个像素转化为结构化的 <span className="bg-black text-white px-2 rounded">JSON 数据</span>，
            为你提供最详尽的画面描述、色彩分析及构图建议。
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="dopamine-card bg-white p-6 shadow-[6px_6px_0px_0px_#00E5FF]">
            <Zap className="w-8 h-8 text-cyan-500 mb-4" />
            <h3 className="text-xl font-black mb-2">自动解析</h3>
            <p className="font-bold text-slate-600 italic">上传即解析，无需手动输入繁琐指令，真正的一键智能反馈。</p>
          </div>
          <div className="dopamine-card bg-white p-6 shadow-[6px_6px_0px_0px_#A555EC]">
            <Star className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-black mb-2">双语互译</h3>
            <p className="font-bold text-slate-600 italic">支持中英文一键无损转换，无论是专业词汇还是通俗描述都能精准翻译。</p>
          </div>
          <div className="dopamine-card bg-white p-6 shadow-[6px_6px_0px_0px_#FFD600]">
            <Code2 className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="text-xl font-black mb-2">JSON 美化</h3>
            <p className="font-bold text-slate-600 italic">内置代码美化引擎，让解析结果以最优雅、易读的格式呈现。</p>
          </div>
        </div>

        {/* Step by Step Guide */}
        <div className="dopamine-card bg-cyan-400 p-8 border-4 border-black">
          <div className="flex items-center gap-4 mb-8">
            <BookOpen className="w-10 h-10 text-black" />
            <h2 className="text-3xl font-black text-black">使用方法</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start bg-white/40 p-4 rounded-2xl border-2 border-black">
              <span className="text-4xl font-black text-white stroke-black">01</span>
              <p className="font-bold">选择或拖拽图片到左侧投喂区</p>
            </div>
            <div className="flex gap-4 items-start bg-white/40 p-4 rounded-2xl border-2 border-black">
              <span className="text-4xl font-black text-white">02</span>
              <p className="font-bold">等待 AI 大脑分析（通常只需 3-5 秒）</p>
            </div>
            <div className="flex gap-4 items-start bg-white/40 p-4 rounded-2xl border-2 border-black">
              <span className="text-4xl font-black text-white">03</span>
              <p className="font-bold">点击按钮美化、翻译或一键复制结果</p>
            </div>
          </div>
        </div>

        {/* --- CARTOON SCREENSHOTS PREVIEW --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Monitor className="w-10 h-10 text-pink-500" />
            <h2 className="text-3xl font-black text-black uppercase italic">界面概览 / Screenshots</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mock Screenshot 1 */}
            <div className="dopamine-card bg-slate-100 p-4 border-4 border-black shadow-[10px_10px_0px_0px_#000]">
              <div className="bg-white rounded-xl border-2 border-black p-4 space-y-4">
                <div className="h-8 w-1/2 bg-yellow-400 border-2 border-black rounded-full"></div>
                <div className="flex gap-4">
                  <div className="h-40 w-1/2 bg-pink-100 border-2 border-black rounded-2xl flex items-center justify-center">
                    <ImageIcon className="text-pink-300" />
                  </div>
                  <div className="h-40 w-1/2 bg-cyan-100 border-2 border-black rounded-2xl flex flex-col p-2 space-y-2">
                    <div className="h-4 w-full bg-cyan-300 rounded"></div>
                    <div className="h-4 w-3/4 bg-cyan-300 rounded"></div>
                    <div className="h-4 w-5/6 bg-cyan-300 rounded"></div>
                  </div>
                </div>
              </div>
              <p className="text-center font-black mt-4 text-black uppercase italic">主页核心布局</p>
            </div>
            {/* Mock Screenshot 2 */}
            <div className="dopamine-card bg-slate-100 p-4 border-4 border-black shadow-[10px_10px_0px_0px_#000]">
               <div className="bg-slate-900 rounded-xl border-2 border-black p-4 space-y-3">
                  <div className="flex justify-end gap-2">
                     <div className="w-8 h-4 bg-purple-500 rounded"></div>
                     <div className="w-8 h-4 bg-pink-500 rounded"></div>
                  </div>
                  <div className="h-2 w-full bg-green-500/30 rounded"></div>
                  <div className="h-2 w-3/4 bg-green-500/30 rounded"></div>
                  <div className="h-2 w-1/2 bg-green-500/30 rounded"></div>
                  <div className="h-10 w-full border border-green-500/20 rounded flex items-center px-2">
                    <div className="w-full h-1 bg-green-500/40 rounded"></div>
                  </div>
               </div>
               <p className="text-center font-black mt-4 text-black uppercase italic">深度解析数据流</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="mt-20 border-t-4 border-black bg-white p-8 text-center">
        <p className="text-xl font-black text-black mb-2 italic">© 2025 超强图片反推解析助手 | ⚡️ POWERED BY GEMINI</p>
        <div className="flex justify-center gap-4 mt-4">
           <div className="w-10 h-10 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center font-black">AI</div>
           <div className="w-10 h-10 bg-pink-400 border-2 border-black rounded-full flex items-center justify-center font-black">JS</div>
           <div className="w-10 h-10 bg-cyan-400 border-2 border-black rounded-full flex items-center justify-center font-black">UI</div>
        </div>
      </footer>
    </div>
  );
};

export default App;

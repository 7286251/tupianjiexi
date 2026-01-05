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

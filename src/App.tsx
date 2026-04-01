import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Grid3X3, 
  Plus, 
  Settings, 
  Database, 
  Download, 
  Trash2, 
  ChevronRight, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  Award,
  Eye,
  EyeOff,
  Save,
  FileDown,
  Printer,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { 
  CognitiveLevel, 
  QuestionType, 
  Topic, 
  Question, 
  Exam, 
  ExamConfig, 
  MatrixCell,
  LearningOutcome
} from './types';
import { callGeminiAI, PROMPTS } from './services/gemini';

// --- Demo Data ---
const DEMO_TOPICS: Topic[] = [
  {
    id: 't1',
    name: 'Số hữu tỉ',
    outcomes: [
      { id: 'o1', code: '7.1.1', content: 'Nhận biết được số hữu tỉ và lấy được ví dụ về số hữu tỉ.' },
      { id: 'o2', code: '7.1.2', content: 'Thực hiện được các phép tính cộng, trừ, nhân, chia trong tập hợp số hữu tỉ.' },
      { id: 'o3', code: '7.1.3', content: 'Vận dụng được các tính chất của phép tính để tính toán một cách hợp lí.' }
    ]
  },
  {
    id: 't2',
    name: 'Hình lăng trụ đứng tam giác, tứ giác',
    outcomes: [
      { id: 'o4', code: '7.3.1', content: 'Mô tả được hình lăng trụ đứng tam giác, hình lăng trụ đứng tứ giác.' },
      { id: 'o5', code: '7.3.2', content: 'Tính được diện tích xung quanh và thể tích của hình lăng trụ đứng tam giác, tứ giác.' }
    ]
  }
];

const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    topicId: 't1',
    outcomeId: 'o1',
    content: 'Số nào sau đây là số hữu tỉ?',
    type: QuestionType.MULTIPLE_CHOICE,
    level: CognitiveLevel.RECOGNITION,
    options: ['-2/3', '√2', 'π', '0,101001...'],
    correctAnswer: '-2/3',
    explanation: '-2/3 có dạng a/b với a, b là số nguyên, b ≠ 0 nên là số hữu tỉ.',
    points: 0.25
  },
  {
    id: 'q2',
    topicId: 't1',
    outcomeId: 'o2',
    content: 'Kết quả của phép tính 1/2 + 1/3 là:',
    type: QuestionType.MULTIPLE_CHOICE,
    level: CognitiveLevel.UNDERSTANDING,
    options: ['2/5', '5/6', '1/6', '1/5'],
    correctAnswer: '5/6',
    explanation: '1/2 + 1/3 = 3/6 + 2/6 = 5/6.',
    points: 0.25
  }
];

// --- Components ---

const Header = ({ activeTab, onTabChange, onOpenSettings }: { activeTab: string, onTabChange: (t: string) => void, onOpenSettings: () => void }) => (
  <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-200 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white shadow-lg">
        <BrainCircuit size={24} />
      </div>
      <div>
        <h1 className="text-xl font-bold gradient-text">Ma trận Toán học Pro</h1>
        <p className="text-xs text-slate-500 font-medium">Hệ thống xây dựng đề thi chuẩn hóa</p>
      </div>
    </div>
    
    <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
      {[
        { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { id: 'input', label: 'Nhập liệu', icon: Plus },
        { id: 'matrix', label: 'Ma trận', icon: Grid3X3 },
        { id: 'generate', label: 'Tạo đề', icon: FileText },
        { id: 'bank', label: 'Ngân hàng', icon: Database },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === tab.id 
              ? "bg-white text-blue-600 shadow-sm" 
              : "text-slate-600 hover:bg-white/50"
          )}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
    </nav>

    <button 
      onClick={onOpenSettings}
      className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
    >
      <Settings size={22} />
    </button>
  </header>
);

const Dashboard = ({ stats }: { stats: any }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Chủ đề', value: stats.topics, icon: Grid3X3, color: 'blue' },
        { label: 'Câu hỏi', value: stats.questions, icon: Database, color: 'orange' },
        { label: 'Đề thi đã tạo', value: stats.exams, icon: FileText, color: 'green' },
        { label: 'YCCĐ', value: stats.outcomes, icon: CheckCircle2, color: 'purple' },
      ].map((item, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={item.label}
          className="glass-card p-6 rounded-2xl flex items-center gap-4"
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md",
            item.color === 'blue' && "bg-blue-500",
            item.color === 'orange' && "bg-orange-500",
            item.color === 'green' && "bg-emerald-500",
            item.color === 'purple' && "bg-purple-500",
          )}>
            <item.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{item.label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Sparkles className="text-orange-500" size={20} />
          Gợi ý từ AI
        </h3>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <p className="text-blue-800 text-sm leading-relaxed">
            Dựa trên ngân hàng câu hỏi hiện tại, bạn có thể bổ sung thêm các câu hỏi ở mức độ <strong>Vận dụng cao</strong> cho chương <strong>Số hữu tỉ</strong> để làm phong phú đề thi cuối kỳ.
          </p>
          <button className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            Tạo câu hỏi ngay <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="glass-card p-8 rounded-3xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {[
            { action: 'Đã tạo đề thi Giữa kỳ I', time: '2 giờ trước' },
            { action: 'Đã thêm 5 câu hỏi mới', time: '5 giờ trước' },
            { action: 'Đã cập nhật YCCĐ chương 2', time: 'Hôm qua' },
          ].map((act, i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
              <div>
                <p className="text-sm font-medium text-slate-700">{act.action}</p>
                <p className="text-xs text-slate-400">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const InputSection = ({ topics, onAddTopic, onUpdateTopic, onDeleteTopic }: { 
  topics: Topic[], 
  onAddTopic: (name: string) => void,
  onUpdateTopic: (topic: Topic) => void,
  onDeleteTopic: (id: string) => void
}) => {
  const [newTopicName, setNewTopicName] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleSuggestOutcomes = async (topic: Topic) => {
    setIsGenerating(topic.id);
    try {
      const response = await callGeminiAI(PROMPTS.SUGGEST_OUTCOMES(topic.name));
      if (response) {
        // Simple JSON extraction from markdown
        const jsonStr = response.match(/\[.*\]/s)?.[0] || response;
        const suggested = JSON.parse(jsonStr);
        const updatedTopic = {
          ...topic,
          outcomes: [
            ...topic.outcomes,
            ...suggested.map((s: any) => ({ id: Math.random().toString(36).substr(2, 9), ...s }))
          ]
        };
        onUpdateTopic(updatedTopic);
        Swal.fire('Thành công', 'Đã thêm các gợi ý YCCĐ từ AI', 'success');
      }
    } catch (error: any) {
      Swal.fire('Lỗi', error.message, 'error');
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quản lý Chương trình & YCCĐ</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Tên chương/bài học mới..." 
            className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none w-64"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <button 
            onClick={() => {
              if (newTopicName) {
                onAddTopic(newTopicName);
                setNewTopicName('');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} /> Thêm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {topics.map((topic) => (
          <motion.div 
            layout
            key={topic.id} 
            className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">{topic.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSuggestOutcomes(topic)}
                  disabled={isGenerating === topic.id}
                  className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 flex items-center gap-2 disabled:opacity-50"
                >
                  {isGenerating === topic.id ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Gợi ý YCCĐ
                </button>
                <button 
                  onClick={() => onDeleteTopic(topic.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {topic.outcomes.map((outcome) => (
                <div key={outcome.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1">
                    {outcome.code}
                  </span>
                  <p className="text-sm text-slate-600 flex-1">{outcome.content}</p>
                  <button className="text-slate-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Thêm yêu cầu cần đạt
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MatrixSection = ({ topics, questions, onGenerateExam }: { 
  topics: Topic[], 
  questions: Question[],
  onGenerateExam: (config: ExamConfig) => void
}) => {
  const [config, setConfig] = useState<ExamConfig>({
    id: '',
    title: 'Đề kiểm tra Giữa kỳ I - Toán 7',
    grade: '7',
    subject: 'Toán học',
    timeLimit: 90,
    totalPoints: 10,
    matrix: [],
    topics: topics.map(t => t.id)
  });

  const updateMatrix = (topicId: string, level: CognitiveLevel, type: QuestionType, val: number) => {
    const newMatrix = [...config.matrix];
    const idx = newMatrix.findIndex(c => c.topicId === topicId && c.level === level && c.type === type);
    if (idx >= 0) {
      newMatrix[idx].count = val;
    } else {
      newMatrix.push({ topicId, level, type, count: val });
    }
    setConfig({ ...config, matrix: newMatrix });
  };

  const getMatrixValue = (topicId: string, level: CognitiveLevel, type: QuestionType) => {
    return config.matrix.find(c => c.topicId === topicId && c.level === level && c.type === type)?.count || 0;
  };

  const totalQuestions = useMemo(() => config.matrix.reduce((acc, curr) => acc + curr.count, 0), [config.matrix]);

  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-6">Thiết kế Ma trận Đề thi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Tiêu đề đề thi</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-slate-200"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Thời gian (phút)</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-slate-200"
              value={config.timeLimit}
              onChange={(e) => setConfig({ ...config, timeLimit: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Tổng điểm</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-slate-200"
              value={config.totalPoints}
              onChange={(e) => setConfig({ ...config, totalPoints: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase border border-slate-200">Nội dung / Chủ đề</th>
                {Object.values(CognitiveLevel).map(level => (
                  <th key={level} className="p-4 text-center text-xs font-bold text-slate-500 uppercase border border-slate-200" colSpan={2}>
                    {level}
                  </th>
                ))}
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase border border-slate-200">Tổng</th>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-slate-200"></th>
                {Object.values(CognitiveLevel).map(level => (
                  <React.Fragment key={level}>
                    <th className="p-2 text-[10px] font-bold text-slate-400 border border-slate-200">TN</th>
                    <th className="p-2 text-[10px] font-bold text-slate-400 border border-slate-200">TL</th>
                  </React.Fragment>
                ))}
                <th className="border border-slate-200"></th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={topic.id}>
                  <td className="p-4 text-sm font-medium border border-slate-200">{topic.name}</td>
                  {Object.values(CognitiveLevel).map(level => (
                    <React.Fragment key={level}>
                      <td className="p-2 border border-slate-200">
                        <input 
                          type="number" 
                          className="w-12 text-center text-sm p-1 rounded border border-slate-100 focus:border-blue-400 outline-none"
                          value={getMatrixValue(topic.id, level, QuestionType.MULTIPLE_CHOICE)}
                          onChange={(e) => updateMatrix(topic.id, level, QuestionType.MULTIPLE_CHOICE, parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="p-2 border border-slate-200">
                        <input 
                          type="number" 
                          className="w-12 text-center text-sm p-1 rounded border border-slate-100 focus:border-blue-400 outline-none"
                          value={getMatrixValue(topic.id, level, QuestionType.ESSAY)}
                          onChange={(e) => updateMatrix(topic.id, level, QuestionType.ESSAY, parseInt(e.target.value) || 0)}
                        />
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="p-4 text-center font-bold text-blue-600 border border-slate-200">
                    {config.matrix.filter(c => c.topicId === topic.id).reduce((a, b) => a + b.count, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tổng số câu hỏi</p>
              <p className="text-2xl font-bold text-slate-800">{totalQuestions}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Tỷ lệ TN/TL</p>
              <p className="text-2xl font-bold text-slate-800">
                {Math.round((config.matrix.filter(c => c.type === QuestionType.MULTIPLE_CHOICE).reduce((a, b) => a + b.count, 0) / (totalQuestions || 1)) * 100)}% / 
                {Math.round((config.matrix.filter(c => c.type === QuestionType.ESSAY).reduce((a, b) => a + b.count, 0) / (totalQuestions || 1)) * 100)}%
              </p>
            </div>
          </div>
          <button 
            onClick={() => onGenerateExam(config)}
            disabled={totalQuestions === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={20} /> Tạo đề thi tự động
          </button>
        </div>
      </div>
    </div>
  );
};

const ExamView = ({ exam, onExport, onShuffle }: { exam: Exam | null, onExport: () => void, onShuffle: () => void }) => {
  if (!exam) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <FileText size={64} strokeWidth={1} className="mb-4 opacity-20" />
      <p className="text-lg font-medium">Chưa có đề thi nào được tạo</p>
      <p className="text-sm">Vui lòng thiết kế ma trận và nhấn "Tạo đề"</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Đề thi hoàn chỉnh</h2>
        <div className="flex gap-3">
          <button 
            onClick={onShuffle}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <Sparkles size={18} /> Hoán vị câu hỏi
          </button>
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <FileDown size={18} /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
            <Printer size={18} /> In đề thi
          </button>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[2rem] shadow-2xl max-w-4xl mx-auto bg-white">
        <div className="text-center mb-10 space-y-2">
          <h3 className="text-xl font-bold uppercase">{exam.config.title}</h3>
          <p className="text-sm font-medium">Môn: {exam.config.subject} - Lớp: {exam.config.grade}</p>
          <p className="text-sm italic">Thời gian làm bài: {exam.config.timeLimit} phút (không kể thời gian giao đề)</p>
          <div className="w-24 h-1 bg-slate-200 mx-auto mt-4" />
        </div>

        <div className="space-y-8">
          <section>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded flex items-center justify-center text-xs">I</span>
              PHẦN TRẮC NGHIỆM (7.0 điểm)
            </h4>
            <div className="space-y-6">
              {exam.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).map((q, i) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">Câu {i + 1}:</span> {q.content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                    {q.options?.map((opt, idx) => (
                      <p key={idx} className="text-sm">
                        <span className="font-bold">{String.fromCharCode(65 + idx)}.</span> {opt}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span className="bg-slate-800 text-white w-6 h-6 rounded flex items-center justify-center text-xs">II</span>
              PHẦN TỰ LUẬN (3.0 điểm)
            </h4>
            <div className="space-y-6">
              {exam.questions.filter(q => q.type === QuestionType.ESSAY).map((q, i) => (
                <div key={q.id} className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">Câu {i + 1}:</span> {q.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, settings, onSave }: { 
  isOpen: boolean, 
  onClose: () => void, 
  settings: any,
  onSave: (s: any) => void
}) => {
  const [key, setKey] = useState(settings.geminiApiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Cài đặt hệ thống</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Gemini API Key</label>
            <div className="relative">
              <input 
                type={showKey ? "text" : "password"}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 pr-10"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Lấy API Key tại <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-500 underline">Google AI Studio</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Model AI mặc định</label>
            <select className="w-full px-4 py-2 rounded-xl border border-slate-200">
              <option>gemini-3-flash-preview</option>
              <option>gemini-3.1-pro-preview</option>
              <option>gemini-2.5-flash-preview</option>
            </select>
          </div>

          <button 
            onClick={() => {
              onSave({ ...settings, geminiApiKey: key });
              onClose();
              Swal.fire('Đã lưu', 'Cài đặt đã được cập nhật thành công', 'success');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Save size={20} /> Lưu cài đặt
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>(DEMO_TOPICS);
  const [questions, setQuestions] = useState<Question[]>(DEMO_QUESTIONS);
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [settings, setSettings] = useState({
    geminiApiKey: localStorage.getItem('gemini_api_key') || '',
    model: 'gemini-3-flash-preview'
  });

  useEffect(() => {
    localStorage.setItem('gemini_api_key', settings.geminiApiKey);
  }, [settings.geminiApiKey]);

  const stats = useMemo(() => ({
    topics: topics.length,
    questions: questions.length,
    exams: exams.length,
    outcomes: topics.reduce((acc, t) => acc + t.outcomes.length, 0)
  }), [topics, questions, exams]);

  const handleAddTopic = (name: string) => {
    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      outcomes: []
    };
    setTopics([...topics, newTopic]);
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics(topics.map(t => t.id === updatedTopic.id ? updatedTopic : t));
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const handleGenerateExam = async (config: ExamConfig) => {
    Swal.fire({
      title: 'Đang tạo đề thi...',
      text: 'AI đang soạn thảo các câu hỏi dựa trên ma trận của bạn',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Logic: Pick existing questions or generate new ones
      // For demo, we'll pick existing and generate some placeholders
      const examQuestions: Question[] = [];
      
      for (const cell of config.matrix) {
        for (let i = 0; i < cell.count; i++) {
          // Try to find in bank
          const fromBank = questions.find(q => q.topicId === cell.topicId && q.level === cell.level && q.type === cell.type && !examQuestions.includes(q));
          if (fromBank) {
            examQuestions.push(fromBank);
          } else {
            // Generate using AI
            const topic = topics.find(t => t.id === cell.topicId);
            const prompt = PROMPTS.GENERATE_QUESTION(topic?.name || '', 'YCCĐ ngẫu nhiên', cell.level, cell.type);
            const aiResponse = await callGeminiAI(prompt);
            if (aiResponse) {
              const jsonStr = aiResponse.match(/\{.*\}/s)?.[0] || aiResponse;
              const qData = JSON.parse(jsonStr);
              const newQ: Question = {
                id: Math.random().toString(36).substr(2, 9),
                topicId: cell.topicId,
                outcomeId: topic?.outcomes[0]?.id || 'o-gen',
                content: qData.content,
                type: cell.type,
                level: cell.level,
                options: qData.options,
                correctAnswer: qData.correctAnswer,
                explanation: qData.explanation,
                points: cell.type === QuestionType.MULTIPLE_CHOICE ? 0.25 : 1.0
              };
              examQuestions.push(newQ);
              // Add to bank too
              setQuestions(prev => [...prev, newQ]);
            }
          }
        }
      }

      const newExam: Exam = {
        id: Math.random().toString(36).substr(2, 9),
        config,
        questions: examQuestions,
        createdAt: new Date().toISOString()
      };

      setExams([...exams, newExam]);
      setCurrentExam(newExam);
      setActiveTab('generate');
      Swal.close();
      Swal.fire('Hoàn tất', 'Đề thi đã được tạo thành công!', 'success');
    } catch (error: any) {
      Swal.close();
      Swal.fire('Lỗi', error.message, 'error');
    }
  };

  const handleExportExcel = () => {
    if (!currentExam) return;
    const data = currentExam.questions.map((q, i) => ({
      'STT': i + 1,
      'Nội dung': q.content,
      'Mức độ': q.level,
      'Dạng': q.type,
      'Đáp án': q.correctAnswer
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DeThi");
    XLSX.writeFile(wb, `${currentExam.config.title}.xlsx`);
  };

  const handleShuffle = () => {
    if (!currentExam) return;
    const shuffled = [...currentExam.questions].sort(() => Math.random() - 0.5);
    setCurrentExam({ ...currentExam, questions: shuffled });
    Swal.fire({
      title: 'Đã hoán vị',
      text: 'Các câu hỏi đã được xáo trộn ngẫu nhiên',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'input' && (
              <InputSection 
                topics={topics} 
                onAddTopic={handleAddTopic} 
                onUpdateTopic={handleUpdateTopic}
                onDeleteTopic={handleDeleteTopic}
              />
            )}
            {activeTab === 'matrix' && (
              <MatrixSection 
                topics={topics} 
                questions={questions} 
                onGenerateExam={handleGenerateExam} 
              />
            )}
            {activeTab === 'generate' && (
              <ExamView 
                exam={currentExam} 
                onExport={handleExportExcel}
                onShuffle={handleShuffle}
              />
            )}
            {activeTab === 'bank' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Ngân hàng câu hỏi</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <Plus size={20} /> Thêm câu hỏi thủ công
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions.map(q => (
                    <div key={q.id} className="glass-card p-4 rounded-xl border-l-4 border-l-orange-400">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          {q.level}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {q.type}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 line-clamp-2">{q.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={setSettings}
      />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'input', icon: Plus },
          { id: 'matrix', icon: Grid3X3 },
          { id: 'generate', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "p-3 rounded-xl transition-all",
              activeTab === tab.id ? "bg-blue-50 text-blue-600" : "text-slate-400"
            )}
          >
            <tab.icon size={24} />
          </button>
        ))}
      </nav>
    </div>
  );
}

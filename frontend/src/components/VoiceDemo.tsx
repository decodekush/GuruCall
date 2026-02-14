import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff,
  Mic, 
  Volume2, 
  Loader2,
  Sparkles,
  CheckCircle
} from 'lucide-react';

// Call states
type CallState = 
  | 'idle'           // Not in a call
  | 'dialing'        // Call is being made
  | 'ringing'        // Phone is ringing
  | 'welcome'        // Welcome message playing
  | 'select-level'   // User needs to select academic level
  | 'level-selected' // Level confirmation playing
  | 'recording'      // User is recording their question
  | 'processing'     // Processing the question
  | 'playing'        // Playing the answer
  | 'ended';         // Call ended

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const academicLevels = [
  { key: '1', label: 'Class 1-5', description: 'Primary School', level: 'elementary' },
  { key: '2', label: 'Class 6-8', description: 'Middle School', level: 'middle_school' },
  { key: '3', label: 'Class 9-10', description: 'Secondary School', level: 'middle_school' },
  { key: '4', label: 'Class 11-12', description: 'Higher Secondary', level: 'high_school' },
  { key: '5', label: 'College', description: 'Undergraduate', level: 'undergraduate' },
  { key: '6', label: 'Graduate', description: 'Postgraduate', level: 'graduate' },
  { key: '7', label: 'Professional', description: 'Expert Level', level: 'professional' },
];

const VoiceDemo = () => {
  const [callState, setCallState] = useState<CallState>('idle');
  const [selectedLevel, setSelectedLevel] = useState<typeof academicLevels[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [callDuration, setCallDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const BACKEND_URL = 'http://localhost:3000';

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (callState !== 'idle' && callState !== 'ended') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Browser fallback TTS
  const playBrowserTTS = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Browser does not support speech synthesis'));
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-US';
      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);
      window.speechSynthesis.speak(utterance);
    });
  };

  // Play TTS using backend
  const playTTS = async (text: string): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        console.warn('TTS failed, using browser fallback');
        await playBrowserTTS(text);
        return;
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.size < 1000 || !audioBlob.type.includes('audio')) {
        console.warn('Invalid TTS response, using browser fallback');
        await playBrowserTTS(text);
        return;
      }
      
      return new Promise((resolve) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => {
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          audioRef.current.onerror = async () => {
            URL.revokeObjectURL(audioUrl);
            await playBrowserTTS(text);
            resolve();
          };
        } else {
          resolve();
        }
      });
    } catch (err) {
      console.error('TTS error:', err);
      await playBrowserTTS(text);
    }
  };

  // Start the call
  const startCall = async () => {
    setCallDuration(0);
    setMessages([]);
    setSelectedLevel(null);
    setError(null);
    setCallState('dialing');

    // Simulate dialing for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCallState('ringing');
    
    // Simulate ringing for 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCallState('welcome');
    
    // Play welcome message
    const welcomeMessage = "Welcome to GuruCall, your AI-powered educational tutor. Please press a number from 1 to 7 to select your academic level. Press 1 for Class 1 to 5, Press 2 for Class 6 to 8, Press 3 for Class 9 to 10, Press 4 for Class 11 to 12, Press 5 for College, Press 6 for Graduate level, Press 7 for Professional level.";
    
    await playTTS(welcomeMessage);
    
    setCallState('select-level');
  };

  // Handle level selection
  const selectLevel = async (levelKey: string) => {
    const level = academicLevels.find(l => l.key === levelKey);
    if (!level) return;
    
    setSelectedLevel(level);
    setCallState('level-selected');
    
    // Play level confirmation
    const confirmationMessage = `You have selected ${level.label}, ${level.description}. Now please tell us your question or doubt after the beep.`;
    
    await playTTS(confirmationMessage);
    
    // Short delay then start recording
    await new Promise(resolve => setTimeout(resolve, 500));
    
    startRecording();
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setCallState('recording');
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Error accessing microphone:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && callState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  // Process recorded audio
  const processAudio = async (audioBlob: Blob) => {
    setCallState('processing');
    setCurrentTranscript('Processing your question...');

    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Step 1: Transcribe audio (STT)
      const sttResponse = await fetch(`${BACKEND_URL}/api/stt/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType: 'audio/webm'
        })
      });

      if (!sttResponse.ok) throw new Error('Failed to transcribe audio');
      
      const sttData = await sttResponse.json();
      const transcript = sttData.transcription;

      if (!transcript || transcript.trim() === '') {
        setError("Couldn't understand the audio. Please try again.");
        setCallState('select-level');
        setCurrentTranscript('');
        return;
      }

      setCurrentTranscript(transcript);
      
      // Add user message
      const userMessage: Message = { role: 'user', content: transcript };
      setMessages(prev => [...prev, userMessage]);

      // Step 2: Get AI response
      const aiResponse = await fetch(`${BACKEND_URL}/api/gemini/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: transcript,
          educationLevel: selectedLevel?.level || 'high_school',
          context: messages.slice(-10)
        })
      });

      if (!aiResponse.ok) throw new Error('Failed to get AI response');
      
      const aiData = await aiResponse.json();
      const aiText = aiData.response;

      // Add assistant message
      const assistantMessage: Message = { role: 'assistant', content: aiText };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentTranscript('');

      // Step 3: Play the response
      setCallState('playing');
      await playTTS(aiText);
      
      // After playing, allow user to ask another question
      const followUpMessage = "If you have another question, please speak now.";
      await playTTS(followUpMessage);
      
      // Start recording for follow-up
      startRecording();

    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process your question. Please try again.');
      setCallState('select-level');
    }
  };

  // End the call
  const endCall = () => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && callState === 'recording') {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    
    // Stop browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setCallState('ended');
    
    // Reset after showing ended state
    setTimeout(() => {
      setCallState('idle');
      setCallDuration(0);
      setSelectedLevel(null);
      setCurrentTranscript('');
      setError(null);
    }, 2000);
  };

  // Get current step for instructions
  const getCurrentStep = () => {
    switch (callState) {
      case 'idle':
      case 'ended':
        return 0;
      case 'dialing':
      case 'ringing':
        return 1;
      case 'welcome':
        return 2;
      case 'select-level':
        return 3;
      case 'level-selected':
      case 'recording':
        return 4;
      case 'processing':
      case 'playing':
        return 5;
      default:
        return 0;
    }
  };

  const steps = [
    { num: 1, title: 'Call GuruCall', desc: 'Click the green call button to start' },
    { num: 2, title: 'Wait for Connection', desc: 'Your call is being connected' },
    { num: 3, title: 'Listen to Welcome', desc: 'Hear the welcome message and options' },
    { num: 4, title: 'Select Your Level', desc: 'Press 1-7 to choose academic level' },
    { num: 5, title: 'Ask Your Question', desc: 'Record your doubt or question' },
    { num: 6, title: 'Get Your Answer', desc: 'Listen to AI tutor\'s explanation' },
  ];

  return (
    <section id="try-it" className="py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">GuruCall</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simulate a real GuruCall experience. Call our AI tutor, select your academic level, and get instant voice answers to your questions.
          </p>
          
          {/* Backend Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus === 'online' ? 'bg-green-400' : 
              backendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            <span className="text-sm text-gray-400">
              {backendStatus === 'online' ? 'Service Online' : 
               backendStatus === 'offline' ? 'Service Offline - Start backend' : 'Connecting...'}
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Left: Instructions Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-80 order-2 lg:order-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">How to Use</h3>
              </div>
              
              <div className="space-y-4">
                {steps.map((step) => {
                  const isActive = getCurrentStep() === step.num;
                  const isCompleted = getCurrentStep() > step.num;
                  
                  return (
                    <motion.div
                      key={step.num}
                      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-purple-600/20 border border-purple-500/50' 
                          : isCompleted
                          ? 'bg-green-600/10 border border-green-500/30'
                          : 'bg-gray-700/30 border border-transparent'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive 
                          ? 'bg-purple-600 text-white' 
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-bold">{step.num}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-sm ${
                          isActive ? 'text-purple-300' : 'text-gray-500'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Center: Phone Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            {/* Phone Frame */}
            <div className="relative w-[320px] h-[650px] bg-gray-900 rounded-[50px] border-4 border-gray-700 shadow-2xl overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20" />
              
              {/* Speaker Grill */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full z-30" />
              
              {/* Phone Screen */}
              <div className="absolute inset-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[42px] overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 pt-8 pb-2 text-white text-xs">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-2 bg-white rounded-sm" />
                      <div className="w-1 h-3 bg-white rounded-sm" />
                      <div className="w-1 h-4 bg-white rounded-sm" />
                      <div className="w-1 h-3 bg-gray-500 rounded-sm" />
                    </div>
                    <span className="ml-1">100%</span>
                  </div>
                </div>

                {/* Call Screen Content */}
                <div className="flex flex-col h-[calc(100%-60px)] px-4 pt-4">
                  {/* Idle State - Call Button */}
                  {callState === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                        <span className="text-4xl font-bold text-white">G</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">GuruCall</h3>
                      <p className="text-gray-400 text-sm mb-8">AI Educational Tutor</p>
                      
                      {backendStatus === 'online' ? (
                        <motion.button
                          onClick={startCall}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg shadow-green-500/30 transition-colors"
                        >
                          <Phone className="w-7 h-7 text-white" />
                        </motion.button>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center opacity-50">
                          <Phone className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <p className="text-gray-400 text-sm mt-4">
                        {backendStatus === 'online' ? 'Tap to call' : 'Service unavailable'}
                      </p>
                    </motion.div>
                  )}

                  {/* Dialing State */}
                  {callState === 'dialing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 w-24 h-24 rounded-full bg-purple-500"
                        />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg relative z-10">
                          <span className="text-4xl font-bold text-white">G</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mt-6 mb-2">GuruCall</h3>
                      <p className="text-purple-400 text-sm animate-pulse">Calling...</p>
                      <p className="text-gray-500 text-xs mt-4">{formatDuration(callDuration)}</p>
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Ringing State */}
                  {callState === 'ringing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                      >
                        <span className="text-4xl font-bold text-white">G</span>
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mt-6 mb-2">GuruCall</h3>
                      <p className="text-green-400 text-sm animate-pulse">Ringing...</p>
                      <p className="text-gray-500 text-xs mt-4">{formatDuration(callDuration)}</p>
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Welcome/Playing Welcome State */}
                  {callState === 'welcome' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4">
                        <Volume2 className="w-10 h-10 text-green-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Connected</h3>
                      <p className="text-green-400 text-sm mb-4">Call Active</p>
                      <p className="text-gray-500 text-xs">{formatDuration(callDuration)}</p>
                      
                      <div className="mt-6 px-4 py-3 bg-gray-700/50 rounded-xl">
                        <p className="text-gray-300 text-sm text-center animate-pulse">
                          🔊 Listening to welcome message...
                        </p>
                      </div>
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Select Level State - Show Dialpad */}
                  {callState === 'select-level' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col h-full"
                    >
                      <div className="text-center pt-2 pb-4">
                        <p className="text-green-400 text-sm">Call Active • {formatDuration(callDuration)}</p>
                        <p className="text-gray-300 text-xs mt-2">Select your academic level (1-7)</p>
                      </div>
                      
                      {/* Level Buttons Grid */}
                      <div className="flex-1 overflow-y-auto px-2">
                        <div className="grid grid-cols-1 gap-2">
                          {academicLevels.map((level) => (
                            <motion.button
                              key={level.key}
                              onClick={() => selectLevel(level.key)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-purple-600/30 border border-gray-600 hover:border-purple-500 rounded-xl transition-all"
                            >
                              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                {level.key}
                              </div>
                              <div className="text-left">
                                <p className="text-white text-sm font-medium">{level.label}</p>
                                <p className="text-gray-400 text-xs">{level.description}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 pb-2 flex justify-center">
                        <motion.button
                          onClick={endCall}
                          whileTap={{ scale: 0.95 }}
                          className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg"
                        >
                          <PhoneOff className="w-6 h-6 text-white" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Level Selected - Confirmation Playing */}
                  {callState === 'level-selected' && selectedLevel && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-purple-400">{selectedLevel.key}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{selectedLevel.label}</h3>
                      <p className="text-gray-400 text-sm mb-4">{selectedLevel.description}</p>
                      <p className="text-gray-500 text-xs">{formatDuration(callDuration)}</p>
                      
                      <div className="mt-6 px-4 py-3 bg-gray-700/50 rounded-xl">
                        <p className="text-purple-300 text-sm text-center animate-pulse">
                          🔊 Level confirmed. Preparing to record...
                        </p>
                      </div>
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Recording State */}
                  {callState === 'recording' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 w-24 h-24 rounded-full bg-red-500"
                        />
                        <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center relative z-10">
                          <Mic className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>
                      
                      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Recording</h3>
                      <p className="text-red-400 text-sm animate-pulse">🔴 Speak your question now</p>
                      <p className="text-gray-500 text-xs mt-2">{formatDuration(callDuration)}</p>
                      
                      {selectedLevel && (
                        <p className="text-gray-400 text-xs mt-4">
                          Level: {selectedLevel.label}
                        </p>
                      )}
                      
                      <motion.button
                        onClick={stopRecording}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-6 py-3 bg-white text-gray-900 rounded-full font-medium shadow-lg"
                      >
                        Done Speaking
                      </motion.button>
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-6 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Processing State */}
                  {callState === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-24 h-24 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center mb-4">
                        <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">Processing</h3>
                      <p className="text-yellow-400 text-sm">Analyzing your question...</p>
                      <p className="text-gray-500 text-xs mt-4">{formatDuration(callDuration)}</p>
                      
                      {currentTranscript && (
                        <div className="mt-6 px-4 py-3 bg-gray-700/50 rounded-xl max-w-full">
                          <p className="text-gray-300 text-sm text-center truncate">
                            "{currentTranscript}"
                          </p>
                        </div>
                      )}
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Playing Response State */}
                  {callState === 'playing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-4"
                      >
                        <Volume2 className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white mb-2">GuruCall Speaking</h3>
                      <p className="text-green-400 text-sm">🔊 Playing response...</p>
                      <p className="text-gray-500 text-xs mt-4">{formatDuration(callDuration)}</p>
                      
                      {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                        <div className="mt-6 px-4 py-3 bg-gray-700/50 rounded-xl max-w-full overflow-hidden">
                          <p className="text-gray-300 text-xs line-clamp-4">
                            {messages[messages.length - 1].content}
                          </p>
                        </div>
                      )}
                      
                      <motion.button
                        onClick={endCall}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center mt-8 shadow-lg"
                      >
                        <PhoneOff className="w-6 h-6 text-white" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Call Ended State */}
                  {callState === 'ended' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                        <PhoneOff className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Call Ended</h3>
                      <p className="text-gray-400 text-sm">Duration: {formatDuration(callDuration)}</p>
                      <p className="text-gray-500 text-xs mt-4">Thank you for using GuruCall</p>
                    </motion.div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-24 left-4 right-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl"
                    >
                      <p className="text-red-300 text-xs text-center">{error}</p>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full" />
            </div>
          </motion.div>

          {/* Right: Conversation History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-80 order-3"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 h-[500px] flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4">Conversation Log</h3>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-center">
                    <div>
                      <Phone className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Start a call to see</p>
                      <p className="text-sm">your conversation here</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl ${
                          msg.role === 'user'
                            ? 'bg-purple-600/30 border border-purple-500/30'
                            : 'bg-gray-700/50 border border-gray-600/30'
                        }`}
                      >
                        <p className={`text-xs font-medium mb-1 ${
                          msg.role === 'user' ? 'text-purple-400' : 'text-green-400'
                        }`}>
                          {msg.role === 'user' ? '👤 You' : '🤖 GuruCall'}
                        </p>
                        <p className="text-gray-200 text-sm line-clamp-4">{msg.content}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </section>
  );
};

export default VoiceDemo;

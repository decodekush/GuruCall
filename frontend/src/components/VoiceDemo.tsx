import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Loader2,
  MessageSquare,
  GraduationCap,
  Sparkles,
  RotateCcw
} from 'lucide-react';

type EducationLevel = 'elementary' | 'middle_school' | 'high_school' | 'undergraduate' | 'professional';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const educationLevels: { id: EducationLevel; label: string; description: string }[] = [
  { id: 'elementary', label: 'Class 1-5', description: 'Primary School' },
  { id: 'middle_school', label: 'Class 6-10', description: 'Middle School' },
  { id: 'high_school', label: 'Class 11-12', description: 'Higher Secondary' },
  { id: 'undergraduate', label: 'College', description: 'Undergraduate' },
  { id: 'professional', label: 'Professional', description: 'Expert Level' },
];

const VoiceDemo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('high_school');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use voice features.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
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
        setError("Couldn't understand the audio. Please try speaking more clearly.");
        setIsProcessing(false);
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
          educationLevel: selectedLevel,
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

      // Step 3: Generate and play TTS
      await playTTS(aiText);

    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process your question. Please make sure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Browser fallback TTS using Web Speech API
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

  const playTTS = async (text: string) => {
    setIsPlaying(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        console.warn('ElevenLabs TTS failed, using browser fallback');
        await playBrowserTTS(text);
        setIsPlaying(false);
        return;
      }

      const audioBlob = await response.blob();
      
      // Check if blob is valid audio (not an error response)
      if (audioBlob.size < 1000 || !audioBlob.type.includes('audio')) {
        console.warn('Invalid TTS response, using browser fallback');
        await playBrowserTTS(text);
        setIsPlaying(false);
        return;
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = async () => {
          console.warn('Audio playback failed, using browser fallback');
          URL.revokeObjectURL(audioUrl);
          await playBrowserTTS(text);
          setIsPlaying(false);
        };
      }
    } catch (err) {
      console.error('TTS error, trying browser fallback:', err);
      try {
        await playBrowserTTS(text);
      } catch (browserErr) {
        console.error('Browser TTS also failed:', browserErr);
      }
      setIsPlaying(false);
    }
  };

  const stopSpeaking = () => {
    // Stop HTML5 audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    
    // Stop browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    console.log('Audio stopped');
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentTranscript('');
    setError(null);
  };

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
            Try GuruCall <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Demo</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience our AI tutor simulation. Ask any academic question using your voice and get instant, level-appropriate explanations.
          </p>
          
          {/* Prototype Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span><strong>Prototype Mode:</strong> This demo simulates the call experience. Real phone calls require carrier integration.</span>
          </motion.div>
          
          {/* Backend Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              backendStatus === 'online' ? 'bg-green-400' : 
              backendStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            <span className="text-sm text-gray-400">
              {backendStatus === 'online' ? 'Backend Connected' : 
               backendStatus === 'offline' ? 'Backend Offline - Start the server' : 'Checking...'}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Education Level Selector */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Select Your Level</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {educationLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      selectedLevel === level.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{level.label}</div>
                    <div className="text-xs opacity-70">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Recording Button */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
              <div className="flex flex-col items-center">
                {/* Main Recording Button */}
                <motion.button
                  onClick={isPlaying ? stopSpeaking : (isRecording ? stopRecording : startRecording)}
                  disabled={isProcessing || backendStatus !== 'online'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : isProcessing
                      ? 'bg-yellow-500'
                      : isPlaying
                      ? 'bg-green-500 hover:bg-red-500'
                      : backendStatus !== 'online'
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                  }`}
                >
                  {/* Pulse animation when recording */}
                  {isRecording && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  
                  {isProcessing ? (
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  ) : isPlaying ? (
                    <VolumeX className="w-12 h-12 text-white" />
                  ) : isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </motion.button>

                {/* Status Text */}
                <p className="mt-6 text-center text-gray-300">
                  {isRecording ? (
                    <span className="text-red-400">🔴 Recording... Click to stop</span>
                  ) : isProcessing ? (
                    <span className="text-yellow-400">Processing your question...</span>
                  ) : isPlaying ? (
                    <span className="text-green-400">🔊 Playing response... <span className="text-red-300">Click to stop</span></span>
                  ) : backendStatus !== 'online' ? (
                    <span className="text-gray-500">Start the backend server first</span>
                  ) : (
                    <span>Click to start speaking</span>
                  )}
                </p>

                {/* Audio Controls */}
                {(isPlaying || messages.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex gap-3"
                  >
                    {isPlaying ? (
                      <button
                        onClick={stopSpeaking}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2 transition-colors"
                      >
                        <VolumeX className="w-4 h-4" />
                        Stop Audio
                      </button>
                    ) : messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                      <button
                        onClick={() => playTTS(messages[messages.length - 1].content)}
                        disabled={isProcessing || isRecording}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-300 text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <Volume2 className="w-4 h-4" />
                        Replay Last Response
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Current Transcript */}
                {currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-gray-700/50 rounded-lg text-gray-300 text-sm max-w-full"
                  >
                    "{currentTranscript}"
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 mt-0.5 text-purple-400" />
                <div>
                  <p className="font-medium text-gray-300 mb-1">How to use:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Select your education level above</li>
                    <li>Click the microphone button and ask your question</li>
                    <li>Click again to stop recording</li>
                    <li>Listen to the AI tutor's response</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Conversation History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 flex flex-col h-[600px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Conversation</h3>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-center">
                  <div>
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your conversation will appear here.</p>
                    <p className="text-sm mt-1">Click the microphone to start!</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-purple-600 text-white rounded-br-md'
                            : 'bg-gray-700 text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {/* Play button for assistant messages */}
                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => playTTS(msg.content)}
                            disabled={isPlaying || isProcessing || isRecording}
                            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <Volume2 className="w-3 h-3" />
                            Play Audio
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
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

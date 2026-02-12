"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    FaceMesh: new (config: { locateFile: (file: string) => string }) => {
      setOptions: (options: Record<string, unknown>) => void;
      onResults: (callback: (results: FaceMeshResults) => void) => void;
      send: (data: { image: HTMLVideoElement }) => Promise<void>;
    };
  }
}

interface FaceMeshResults {
  multiFaceLandmarks?: Array<Array<{ x: number; y: number; z?: number }>>;
}

interface Role {
  name: string;
  confidence: number;
  rationale?: string;
}

interface Question {
  id: string;
  question: string;
  role: string;
  difficulty: string;
}

interface ReportData {
  total_raw_score?: number;
  max_possible?: number;
  roles?: Array<{
    role_name: string;
    total_raw_score: number;
    max_possible: number;
  }>;
  final_summary?: string;
  total_questions?: number;
}

const PREP_SECONDS = 10;
const RECORD_SECONDS = 60;

export default function AIInterviewPage() {
  const [apiBase] = useState(
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [question, setQuestionState] = useState<Question | null>(null);
  const [timerRemaining, setTimerRemaining] = useState(60);
  const [audioStatus, setAudioStatus] = useState("Mic idle.");
  const [resumeMessage, setResumeMessage] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [gazeStatus, setGazeStatus] = useState("Camera check idle.");
  const [gazeWarnings, setGazeWarnings] = useState(0);
  const [reportOutput, setReportOutput] = useState("No report generated yet.");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [micMeterWidth, setMicMeterWidth] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewLocked, setInterviewLocked] = useState(false);
  const [currentSection, setCurrentSection] = useState<1 | 2 | 3 | 4>(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioDiscardRef = useRef(false);
  const timerExpiredSentRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const camStreamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<InstanceType<typeof window.FaceMesh> | null>(null);
  const gazeMonitorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gazeLastResultAtRef = useRef(0);
  const gazeIsOnScreenRef = useRef(true);
  const gazeAwaySinceRef = useRef(0);
  const lastGazeWarningAtRef = useRef(0);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRecordDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRecordStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRafRef = useRef<number | null>(null);
  const camVideoLoopRafRef = useRef<number | null>(null);
  const faceMeshBusyRef = useRef(false);

  const gazeVideoRef = useRef<HTMLVideoElement>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);

  const MAX_GAZE_WARNINGS = 5;

  const cleanupAllResources = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    if (autoRecordDelayTimerRef.current)
      clearTimeout(autoRecordDelayTimerRef.current);
    if (autoRecordStopTimerRef.current)
      clearTimeout(autoRecordStopTimerRef.current);
    if (gazeMonitorTimerRef.current) clearInterval(gazeMonitorTimerRef.current);
    if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
    if (camVideoLoopRafRef.current)
      cancelAnimationFrame(camVideoLoopRafRef.current);
    stopAndReleaseStream();
    stopCameraMonitoring();
  };

  useEffect(() => {
    // Load FaceMesh library
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
    script.async = true;
    document.body.appendChild(script);

    return cleanupAllResources;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apiFetch = async (path: string, options = {}) => {
    const base = apiBase.replace(/\/$/, "");
    const response = await fetch(`${base}${path}`, options);
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Request failed (${response.status})`);
    }
    if (response.status === 204) return null;
    return response.json();
  };

  const toast = (message: string) => {
    setSessionMessage(message);
  };

  const resumeToast = (message: string) => {
    setResumeMessage(message);
  };

  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  };

  const downloadJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const speakText = (text: string) => {
    if (!text || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const distance2D = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const averagePoint = (points: Array<{ x: number; y: number }>) => {
    const total = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 },
    );
    return { x: total.x / points.length, y: total.y / points.length };
  };

  const isLookingAtScreen = (
    landmarks: Array<{ x: number; y: number; z?: number }>,
  ) => {
    if (!landmarks || landmarks.length < 477) return false;

    const leftOuter = landmarks[33];
    const leftInner = landmarks[133];
    const rightInner = landmarks[362];
    const rightOuter = landmarks[263];
    const leftUpper = landmarks[159];
    const leftLower = landmarks[145];
    const rightUpper = landmarks[386];
    const rightLower = landmarks[374];

    const leftIris = averagePoint([
      landmarks[468],
      landmarks[469],
      landmarks[470],
      landmarks[471],
    ]);
    const rightIris = averagePoint([
      landmarks[473],
      landmarks[474],
      landmarks[475],
      landmarks[476],
    ]);

    const leftEyeWidth = Math.max(distance2D(leftOuter, leftInner), 0.0001);
    const rightEyeWidth = Math.max(distance2D(rightOuter, rightInner), 0.0001);
    const leftEyeOpen = distance2D(leftUpper, leftLower) / leftEyeWidth;
    const rightEyeOpen = distance2D(rightUpper, rightLower) / rightEyeWidth;

    const leftRatio =
      (leftIris.x - leftOuter.x) / Math.max(leftInner.x - leftOuter.x, 0.0001);
    const rightRatio =
      (rightIris.x - rightInner.x) /
      Math.max(rightOuter.x - rightInner.x, 0.0001);

    const eyesOpenEnough = leftEyeOpen > 0.12 && rightEyeOpen > 0.12;
    const gazeCentered =
      leftRatio > 0.2 &&
      leftRatio < 0.8 &&
      rightRatio > 0.2 &&
      rightRatio < 0.8;
    return eyesOpenEnough && gazeCentered;
  };

  const stopCameraMonitoring = () => {
    console.log("Stopping camera monitoring...");
    if (camVideoLoopRafRef.current) {
      cancelAnimationFrame(camVideoLoopRafRef.current);
      camVideoLoopRafRef.current = null;
    }
    if (gazeMonitorTimerRef.current) {
      clearInterval(gazeMonitorTimerRef.current);
      gazeMonitorTimerRef.current = null;
    }
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach((track) => track.stop());
      camStreamRef.current = null;
    }
    if (gazeVideoRef.current) {
      gazeVideoRef.current.srcObject = null;
    }
    faceMeshBusyRef.current = false;
    gazeAwaySinceRef.current = 0;
    gazeLastResultAtRef.current = 0;
  };

  const finalizeInterviewDueToProctoring = () => {
    if (interviewLocked) return;
    setInterviewLocked(true);
    if (timerRef.current) clearInterval(timerRef.current);
    clearAutoRecordTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      audioDiscardRef.current = true;
      stopRecorderOnly();
    }
    stopAndReleaseStream();
    stopCameraMonitoring();
    setQuestionState(null);
    setSessionMessage("Interview stopped: 5 proctoring warnings reached.");
    setGazeStatus("Interview stopped by proctoring policy.");
  };

  const issueGazeWarning = () => {
    const now = Date.now();
    if (now - lastGazeWarningAtRef.current < 4000) return;
    lastGazeWarningAtRef.current = now;
    const newWarnings = gazeWarnings + 1;
    setGazeWarnings(newWarnings);
    console.log(`Gaze warning ${newWarnings}/${MAX_GAZE_WARNINGS} issued`);
    toast(
      `Warning ${newWarnings}/${MAX_GAZE_WARNINGS}: keep your eyes on the screen.`,
    );
    setGazeStatus("Warning issued: you are not looking at the screen.");
    if (newWarnings >= MAX_GAZE_WARNINGS) {
      finalizeInterviewDueToProctoring();
    }
  };

  const startGazeViolationMonitor = () => {
    if (gazeMonitorTimerRef.current) {
      clearInterval(gazeMonitorTimerRef.current);
      gazeMonitorTimerRef.current = null;
    }
    console.log("Gaze violation monitor started");
    gazeMonitorTimerRef.current = setInterval(() => {
      if (!sessionId || interviewLocked) return;

      const now = Date.now();
      const staleSignal = now - gazeLastResultAtRef.current > 2500;
      const hasAttention = !staleSignal && gazeIsOnScreenRef.current;

      if (hasAttention) {
        gazeAwaySinceRef.current = 0;
        setGazeStatus("Camera active: candidate is looking at the screen.");
        return;
      }

      if (!gazeAwaySinceRef.current) {
        gazeAwaySinceRef.current = now;
        console.log("Candidate looking away - timer started");
        setGazeStatus("Look back at the screen to avoid warning.");
        return;
      }

      const awayDuration = now - gazeAwaySinceRef.current;
      if (awayDuration >= 2500) {
        console.log(`Candidate away for ${awayDuration}ms - issuing warning`);
        gazeAwaySinceRef.current = now;
        issueGazeWarning();
      }
    }, 1000);
  };

  const initCameraAndGazeMonitor = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setGazeStatus("Browser does not support camera access.");
      return false;
    }
    if (typeof window.FaceMesh === "undefined") {
      setGazeStatus("Face tracking module failed to load.");
      return false;
    }

    try {
      setGazeStatus("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      camStreamRef.current = stream;
      console.log("Camera stream acquired successfully");

      if (gazeVideoRef.current) {
        gazeVideoRef.current.srcObject = stream;
        await gazeVideoRef.current.play();
        console.log("Video element started playing");
      }

      if (!faceMeshRef.current) {
        console.log("Initializing FaceMesh...");
        faceMeshRef.current = new window.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        faceMeshRef.current.onResults((results: FaceMeshResults) => {
          gazeLastResultAtRef.current = Date.now();
          const landmarks = results.multiFaceLandmarks?.[0];
          const lookingAtScreen = Boolean(
            landmarks && isLookingAtScreen(landmarks),
          );
          gazeIsOnScreenRef.current = lookingAtScreen;

          // Debug logging (can be removed in production)
          if (!lookingAtScreen && landmarks) {
            console.log("Gaze detection: not looking at screen");
          }
        });
        console.log("FaceMesh initialized");
      }

      const processFrame = async () => {
        if (!gazeVideoRef.current || !camStreamRef.current) return;
        if (!faceMeshBusyRef.current && gazeVideoRef.current.readyState >= 2) {
          try {
            faceMeshBusyRef.current = true;
            if (faceMeshRef.current) {
              await faceMeshRef.current.send({ image: gazeVideoRef.current });
            }
          } catch (err) {
            console.error("FaceMesh processing error:", err);
            gazeIsOnScreenRef.current = false;
          } finally {
            faceMeshBusyRef.current = false;
          }
        }
        camVideoLoopRafRef.current = requestAnimationFrame(processFrame);
      };

      // Start processing frames
      processFrame();
      console.log("Frame processing started");

      // Initialize gaze monitoring state
      gazeIsOnScreenRef.current = true;
      gazeAwaySinceRef.current = 0;
      lastGazeWarningAtRef.current = 0;
      gazeLastResultAtRef.current = Date.now();
      setGazeStatus("Camera active: gaze monitor running.");

      // Start the violation monitor
      console.log("Starting gaze violation monitor...");
      startGazeViolationMonitor();
      return true;
    } catch (err) {
      console.error("Camera initialization error:", err);
      setGazeStatus(
        `Camera access denied: ${err instanceof Error ? err.message : String(err)}`,
      );
      stopCameraMonitoring();
      return false;
    }
  };

  const stopAndReleaseStream = () => {
    if (meterRafRef.current) {
      cancelAnimationFrame(meterRafRef.current);
      meterRafRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
  };

  const stopRecorderOnly = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const clearAutoRecordTimers = () => {
    if (autoRecordDelayTimerRef.current) {
      clearTimeout(autoRecordDelayTimerRef.current);
      autoRecordDelayTimerRef.current = null;
    }
    if (autoRecordStopTimerRef.current) {
      clearTimeout(autoRecordStopTimerRef.current);
      autoRecordStopTimerRef.current = null;
    }
  };

  const uploadAudioAnswer = async (
    blob: Blob,
    options: { immediateNext?: boolean } = {},
  ) => {
    if (!sessionId || !question) return;
    const ext = blob.type.includes("ogg") ? "ogg" : "webm";
    const formData = new FormData();
    formData.append("file", blob, `answer.${ext}`);
    try {
      const data = await apiFetch(
        `/interview/${sessionId}/answer/audio?question_id=${encodeURIComponent(
          question.id,
        )}`,
        {
          method: "POST",
          body: formData,
        },
      );
      await handlePostAnswerFlow(data, options);
    } catch (err) {
      setAudioStatus(
        `Audio upload failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const startRecording = async () => {
    if (!question || interviewLocked) return;
    try {
      audioDiscardRef.current = false;
      audioChunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const stream = micStreamRef.current;
      if (!stream) {
        setAudioStatus("Microphone is not ready.");
        return;
      }
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const shouldGoNextImmediately = stopRequestedRef.current;
        stopRequestedRef.current = false;
        if (audioDiscardRef.current) {
          audioDiscardRef.current = false;
          resetAudioUI();
          return;
        }
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });
        if (!blob.size) {
          setAudioStatus("Recorded audio was empty.");
          resetAudioUI();
          if (shouldGoNextImmediately) {
            submitStoppedAnswerWithoutAudio();
          }
          return;
        }
        if (audioPlaybackRef.current) {
          audioPlaybackRef.current.src = URL.createObjectURL(blob);
          audioPlaybackRef.current.hidden = false;
        }
        uploadAudioAnswer(blob, { immediateNext: shouldGoNextImmediately });
        resetAudioUI();
      };
      recorder.start();
      setIsRecording(true);
      setAudioStatus("Recording... speak now.");
      autoRecordStopTimerRef.current = setTimeout(() => {
        stopRecording();
      }, RECORD_SECONDS * 1000);
    } catch (err) {
      setAudioStatus(
        `Mic error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      return;
    }
    setAudioStatus("Processing recording...");
    if (autoRecordStopTimerRef.current) {
      clearTimeout(autoRecordStopTimerRef.current);
      autoRecordStopTimerRef.current = null;
    }
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const resetAudioUI = () => {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.hidden = true;
      audioPlaybackRef.current.src = "";
    }
    setMicMeterWidth(0);
    setAudioStatus("Mic idle.");
  };

  const startTimer = () => {
    if (interviewLocked) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRemaining(PREP_SECONDS + RECORD_SECONDS);
    timerRef.current = setInterval(() => {
      setTimerRemaining((prev) => {
        const newVal = prev - 1;
        if (newVal <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
          ) {
            return newVal;
          }
          if (!timerExpiredSentRef.current) {
            timerExpiredSentRef.current = true;
            submitTimeoutAnswer();
          }
        }
        return newVal;
      });
    }, 1000);
  };

  const setQuestion = (q: Question | null) => {
    if (interviewLocked && q) {
      return;
    }
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
    clearAutoRecordTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      audioDiscardRef.current = true;
      stopRecorderOnly();
    }
    setQuestionState(q);
    stopRequestedRef.current = false;
    timerExpiredSentRef.current = false;
    resetAudioUI();
    if (q) {
      startTimer();
      speakText(q.question);
      setAudioStatus(`Question read. Recording starts in ${PREP_SECONDS}s...`);
      autoRecordDelayTimerRef.current = setTimeout(() => {
        autoRecordDelayTimerRef.current = null;
        startRecording();
      }, PREP_SECONDS * 1000);
    }
  };

  const startIntro = async (currentSessionId: string) => {
    const roleNames = roles.map((r) => r.name).join(", ");
    const introText =
      `Hello! I'm your interviewer today. ` +
      `We'll go through a quick warm-up and then technical questions for ${roleNames}. ` +
      `Please answer out loud. You have 60 seconds for each response. ` +
      `We'll begin in a moment.`;
    speakText(introText);
    toast(
      "Interviewer introduction in progress. Starting questions in 10 seconds...",
    );
    introTimerRef.current = setTimeout(async () => {
      introTimerRef.current = null;
      toast("Loading your first question...");
      await loadNextQuestion(currentSessionId);
    }, 10000);
  };

  const initMicStream = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioStatus("Browser does not support audio recording.");
      return false;
    }
    try {
      setAudioStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof window.AudioContext;
            }
          ).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }
      if (!audioContextRef.current) {
        setAudioStatus("AudioContext not available.");
        return false;
      }
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 1024;
      const data = new Uint8Array(analyserRef.current.fftSize);
      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const percent = Math.min(100, Math.max(4, Math.round(rms * 220)));
        setMicMeterWidth(percent);
        meterRafRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
      setAudioStatus("Microphone ready. Recording will start automatically.");
      return true;
    } catch (err) {
      setAudioStatus(
        `Mic access denied: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  };

  const handlePostAnswerFlow = async (
    data: { has_more_questions?: boolean },
    options: { immediateNext?: boolean } = {},
  ) => {
    if (interviewLocked) return;
    if (!data.has_more_questions) {
      toast("Interview completed. Generating report...");
      stopAndReleaseStream();
      stopCameraMonitoring();
      setCurrentSection(4);
      // Auto-generate report
      setTimeout(() => handleGenerateReport(), 1000);
      return;
    }
    const immediateNext = Boolean(options.immediateNext);
    toast("Answer submitted. Loading next question...");
    if (!immediateNext && timerRef.current) {
      clearInterval(timerRef.current);
    }
    await loadNextQuestion();
  };

  const handleAnalyzeResume = async () => {
    const file = resumeFileRef.current?.files?.[0];
    if (!file) {
      resumeToast("Please select a resume file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    resumeToast("Analyzing resume...");
    try {
      const data = await apiFetch("/resume/analyze", {
        method: "POST",
        body: formData,
      });
      setRoles(data.roles || []);
      resumeToast("Roles detected. You can start the interview.");
    } catch (err) {
      resumeToast(
        `Analyze failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleStartInterview = async () => {
    if (!roles.length) {
      toast("No roles detected yet.");
      return;
    }
    toast("Starting interview...");
    try {
      setInterviewLocked(false);
      setGazeWarnings(0);
      gazeAwaySinceRef.current = 0;
      lastGazeWarningAtRef.current = 0;
      setGazeStatus("Camera check idle.");

      const payload = {
        roles: roles.map((role) => ({
          name: role.name,
          confidence: role.confidence,
          rationale: role.rationale || "",
        })),
      };
      const data = await apiFetch("/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSessionId(data.session_id);
      setReportData(null);
      toast(`Interview started. ${data.total_questions} questions queued.`);
      const micReady = await initMicStream();
      const camReady = await initCameraAndGazeMonitor();
      if (!micReady || !camReady) {
        await apiFetch(`/interview/${data.session_id}`, { method: "DELETE" });
        setSessionId(null);
        stopAndReleaseStream();
        stopCameraMonitoring();
        setQuestion(null);
        toast(
          "Interview cancelled: microphone and camera access are required.",
        );
        return;
      }
      await startIntro(data.session_id);
    } catch (err) {
      toast(
        `Start failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const loadNextQuestion = async (currentSessionId?: string) => {
    const sid = currentSessionId || sessionId;
    if (!sid || interviewLocked) {
      toast("Cannot load question: session not ready");
      return;
    }
    try {
      const data = await apiFetch(`/interview/${sid}/question`);
      if (!data) {
        setQuestion(null);
        toast("Interview completed.");
        stopAndReleaseStream();
        stopCameraMonitoring();
        setCurrentSection(4);
        return;
      }
      setQuestion(data);
      toast("Question loaded. Please answer out loud.");
    } catch (err) {
      toast(
        `Question fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const submitTimeoutAnswer = async () => {
    if (!question || !sessionId || interviewLocked) return;
    try {
      const payload = {
        question_id: question.id,
        answer_text: "(No answer - time expired)",
      };
      const data = await apiFetch(`/interview/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await handlePostAnswerFlow(data);
    } catch (err) {
      toast(
        `Timeout submit failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const submitStoppedAnswerWithoutAudio = async () => {
    if (!question || !sessionId || interviewLocked) return;
    try {
      const payload = {
        question_id: question.id,
        answer_text: "(Candidate stopped early)",
      };
      const data = await apiFetch(`/interview/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await handlePostAnswerFlow(data, { immediateNext: true });
    } catch (err) {
      toast(
        `Stop submit failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleStopAnswer = async () => {
    if (!sessionId || !question || interviewLocked) {
      console.log("Cannot stop answer:", {
        sessionId,
        hasQuestion: !!question,
        interviewLocked,
      });
      return;
    }
    if (stopRequestedRef.current) {
      console.log("Stop already requested");
      return;
    }
    console.log("Stop answer requested");
    stopRequestedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    clearAutoRecordTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Stopping active recording...");
      setAudioStatus("Stopping and submitting answer...");
      stopRecorderOnly();
      return;
    }
    console.log("No active recording, submitting without audio...");
    await submitStoppedAnswerWithoutAudio();
    stopRequestedRef.current = false;
  };

  const handleGenerateReport = async () => {
    if (!sessionId) return;
    try {
      const data = await apiFetch(`/interview/${sessionId}/report`);
      const roles = data.roles || [];
      const lines = [];
      if (
        typeof data.total_raw_score === "number" &&
        typeof data.max_possible === "number"
      ) {
        lines.push(
          `Overall Score: ${data.total_raw_score}/${data.max_possible}`,
        );
        lines.push("");
      }
      roles.forEach(
        (role: {
          role_name: string;
          total_raw_score: number;
          max_possible: number;
        }) => {
          lines.push(
            `${role.role_name}: ${role.total_raw_score}/${role.max_possible}`,
          );
          lines.push("");
        },
      );
      if (data.final_summary) {
        lines.push("Summary:");
        lines.push(data.final_summary);
        lines.push("");
      }
      lines.push(`Total questions: ${data.total_questions}`);
      setReportOutput(lines.join("\n"));
      setReportData(data);
      toast("Report generated.");
    } catch (err) {
      toast(
        `Report failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) {
      toast("Generate the report first.");
      return;
    }
    downloadJSON(reportData, "interview_report.json");
  };

  const handleDownloadAnswers = async () => {
    if (!sessionId) return;
    try {
      const data = await apiFetch(`/interview/${sessionId}/export`);
      downloadJSON(data, "interview_answers.json");
    } catch (err) {
      toast(
        `Download failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    try {
      await apiFetch(`/interview/${sessionId}`, { method: "DELETE" });
      toast("Session deleted.");
      setSessionId(null);
      clearAutoRecordTimers();
      stopAndReleaseStream();
      stopCameraMonitoring();
      resetAudioUI();
      setGazeStatus("Camera check idle.");
      setGazeWarnings(0);
      setInterviewLocked(false);
      setQuestion(null);
    } catch (err) {
      toast(`End failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-0">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-muted/30 via-background to-muted/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" />
      </div>

      <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <style jsx>{`
          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slideInFromRight 0.5s ease-out;
          }
          .animate-slide-up {
            animation: slideInFromBottom 0.5s ease-out;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Interview System
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Intelligent role-based technical interviewing with live
                proctoring
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                    currentSection === step
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : currentSection > step
                        ? "bg-primary/50 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentSection > step ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`hidden sm:block w-12 md:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                      currentSection > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {currentSection === 1 && "Step 1: Introduction"}
              {currentSection === 2 && "Step 2: Upload Resume"}
              {currentSection === 3 && "Step 3: AI Interview"}
              {currentSection === 4 && "Step 4: Results"}
            </p>
          </div>
        </header>

        {/* Section 1: Introduction/Procedure */}
        {currentSection === 1 && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to AI Interview
                </h2>
                <p className="text-muted-foreground text-lg">
                  Let&apos;s get you ready for your intelligent technical
                  interview
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Upload Your Resume</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your resume in PDF, DOC, or DOCX format. Our AI
                      will analyze your background and detect relevant roles.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">
                      Camera & Microphone Setup
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Grant access to your camera and microphone. Live
                      proctoring ensures interview integrity with gaze tracking.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Answer Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;ll have 10 seconds to prepare and 60 seconds to
                      answer each question. Speak clearly into your microphone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Review Your Results</h3>
                    <p className="text-sm text-muted-foreground">
                      After completing all questions, receive a detailed
                      performance report with scores and feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-500 mb-1">
                      Important Notes
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • Ensure you&apos;re in a quiet, well-lit environment
                      </li>
                      <li>
                        • Keep your eyes on the screen during the interview
                      </li>
                      <li>
                        • You&apos;ll receive warnings if you look away (max 5
                        warnings)
                      </li>
                      <li>• Make sure your internet connection is stable</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentSection(2)}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started →
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Resume Upload */}
        {currentSection === 2 && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Upload Your Resume</h2>
                <p className="text-muted-foreground text-lg">
                  Our AI will analyze your resume and detect relevant technical
                  roles
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center transition-colors duration-200">
                  <input
                    ref={resumeFileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="block w-full text-sm text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </p>
                </div>

                {resumeMessage && (
                  <div className="animate-slide-up bg-muted/50 border border-border rounded-xl p-4">
                    <p className="text-sm">{resumeMessage}</p>
                  </div>
                )}

                {roles.length > 0 && (
                  <div className="animate-slide-up bg-primary/10 border border-primary/30 rounded-xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Detected Roles
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {roles.map((role, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg text-sm font-medium"
                        >
                          <span>{role.name}</span>
                          <span className="text-xs bg-primary/30 px-2 py-0.5 rounded-full text-primary">
                            {(role.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentSection(1)}
                    className="flex-1 bg-muted text-foreground hover:bg-muted/80 py-3 px-6 rounded-xl font-semibold transition-colors duration-200"
                  >
                    ← Back
                  </button>
                  {roles.length === 0 ? (
                    <button
                      onClick={handleAnalyzeResume}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Analyze Resume
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentSection(3)}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: AI Interview */}
        {currentSection === 3 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Video */}
              <div className="lg:col-span-2 space-y-6">
                {/* Camera Video */}
                <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Live Camera Proctoring
                    </h3>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                        gazeWarnings >= MAX_GAZE_WARNINGS / 2
                          ? "bg-destructive/20 text-destructive border border-destructive/30"
                          : "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
                      }`}
                    >
                      Warnings: {gazeWarnings}/{MAX_GAZE_WARNINGS}
                    </span>
                  </div>
                  <video
                    ref={gazeVideoRef}
                    className="w-full aspect-video rounded-lg bg-muted/50 border border-border object-cover mb-3"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="bg-muted/30 border border-border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      {gazeStatus}
                    </p>
                  </div>
                </div>

                {/* Answer Recording */}
                <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Your Answer
                    </h3>
                    <button
                      onClick={handleStopAnswer}
                      disabled={!question || interviewLocked}
                      className="bg-destructive/20 text-destructive hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Stop & Submit
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {isRecording ? (
                        <div className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full"></div>
                      )}
                      <span className="text-sm font-medium">
                        {isRecording
                          ? "Recording in progress..."
                          : "Waiting to record"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {audioStatus}
                    </p>

                    {/* Microphone Level Meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Audio Level</span>
                        <span>{micMeterWidth}%</span>
                      </div>
                      <div className="h-2.5 bg-background border border-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-75"
                          style={{ width: `${micMeterWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <audio
                    ref={audioPlaybackRef}
                    controls
                    className="w-full mt-3"
                    hidden
                  />
                </div>
              </div>

              {/* Right Column - Question and Controls */}
              <div className="lg:col-span-1 space-y-6">
                {/* Timer and Progress */}
                <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-3xl font-bold tabular-nums">
                        {timerRemaining}s
                      </span>
                    </div>
                  </div>

                  {/* Time Progress Bar */}
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timerRemaining <= 10
                          ? "bg-destructive"
                          : timerRemaining <= 30
                            ? "bg-yellow-500"
                            : "bg-primary"
                      }`}
                      style={{
                        width: `${(timerRemaining / (PREP_SECONDS + RECORD_SECONDS)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Display */}
                <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          question ? "bg-green-500 animate-pulse" : "bg-muted"
                        }`}
                      ></div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {question ? "Active Question" : "Awaiting Question"}
                      </span>
                    </div>
                  </div>

                  <div key={question?.id} className="animate-slide-in">
                    <p className="text-xl leading-relaxed mb-6 min-h-[6rem]">
                      {question
                        ? question.question
                        : "Waiting for the interview to begin..."}
                    </p>
                  </div>

                  {question && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-semibold px-3 py-1 bg-primary/10 rounded-lg">
                          {question.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Difficulty:
                        </span>
                        <span className="font-semibold px-3 py-1 bg-accent/10 rounded-lg capitalize">
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interview Controls */}
                {!sessionId ? (
                  <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                    <h3 className="font-bold mb-4">Ready to Begin?</h3>
                    <button
                      onClick={handleStartInterview}
                      disabled={roles.length === 0}
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-bold transition-all duration-200 shadow-lg text-sm"
                    >
                      Start Interview
                    </button>
                    {sessionMessage && (
                      <div className="mt-3 bg-muted/50 border border-border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {sessionMessage}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-500">
                        Interview in Progress
                      </span>
                    </div>
                    <button
                      onClick={handleEndSession}
                      className="w-full bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm"
                    >
                      End Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Results */}
        {currentSection === 4 && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 sm:p-12 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Interview Complete!</h2>
                <p className="text-muted-foreground text-lg">
                  Here&apos;s your performance report
                </p>
              </div>

              <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {reportOutput}
                </pre>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleDownloadAnswers}
                  disabled={!reportData}
                  className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Answers
                </button>
                <button
                  onClick={handleDownloadReport}
                  disabled={!reportData}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Report
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setCurrentSection(1);
                    setRoles([]);
                    setReportData(null);
                    setReportOutput("No report generated yet.");
                  }}
                  className="bg-muted text-foreground hover:bg-muted/80 py-3 px-8 rounded-xl font-semibold transition-colors duration-200"
                >
                  Start New Interview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioDiscardRef = useRef(false);
  const timerExpiredSentRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const camStreamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<ReturnType<typeof window.FaceMesh> | null>(null);
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
    }
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
        setGazeStatus("Look back at the screen to avoid warning.");
        return;
      }

      if (now - gazeAwaySinceRef.current >= 2500) {
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
      if (gazeVideoRef.current) {
        gazeVideoRef.current.srcObject = stream;
        await gazeVideoRef.current.play();
      }

      if (!faceMeshRef.current) {
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
          gazeIsOnScreenRef.current = Boolean(
            landmarks && isLookingAtScreen(landmarks),
          );
        });
      }

      const processFrame = async () => {
        if (!gazeVideoRef.current || !camStreamRef.current) return;
        if (!faceMeshBusyRef.current && gazeVideoRef.current.readyState >= 2) {
          try {
            faceMeshBusyRef.current = true;
            await faceMeshRef.current.send({ image: gazeVideoRef.current });
          } catch {
            gazeIsOnScreenRef.current = false;
          } finally {
            faceMeshBusyRef.current = false;
          }
        }
        camVideoLoopRafRef.current = requestAnimationFrame(processFrame);
      };
      processFrame();

      gazeIsOnScreenRef.current = true;
      gazeAwaySinceRef.current = 0;
      lastGazeWarningAtRef.current = 0;
      setGazeStatus("Camera active: gaze monitor running.");
      startGazeViolationMonitor();
      return true;
    } catch (err) {
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

  const startIntro = async () => {
    const roleNames = roles.map((r) => r.name).join(", ");
    const introText =
      `Hello! I'm your interviewer today. ` +
      `We'll go through a quick warm-up and then technical questions for ${roleNames}. ` +
      `Please answer out loud. You have 60 seconds for each response. ` +
      `We'll begin in a moment.`;
    speakText(introText);
    toast(
      "Interviewer introduction in progress. Starting questions in 20 seconds...",
    );
    introTimerRef.current = setTimeout(async () => {
      introTimerRef.current = null;
      await loadNextQuestion();
    }, 20000);
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
      toast("Interview completed. Generate the report.");
      stopAndReleaseStream();
      stopCameraMonitoring();
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
      await startIntro();
    } catch (err) {
      toast(
        `Start failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const loadNextQuestion = async () => {
    if (!sessionId || interviewLocked) return;
    try {
      const data = await apiFetch(`/interview/${sessionId}/question`);
      if (!data) {
        setQuestion(null);
        toast("Interview completed.");
        stopAndReleaseStream();
        stopCameraMonitoring();
        return;
      }
      setQuestion(data);
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
    if (!sessionId || !question || interviewLocked) return;
    if (stopRequestedRef.current) return;
    stopRequestedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    clearAutoRecordTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setAudioStatus("Stopping and submitting answer...");
      stopRecorderOnly();
      return;
    }
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

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                AI Interview System
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Intelligent role-based technical interviewing with live
                proctoring
              </p>
            </div>

            {/* Session Status Badge */}
            {sessionId && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">
                  Session Active
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Questions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Video - Center */}
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
                <p className="text-sm text-muted-foreground">{gazeStatus}</p>
              </div>
            </div>

            {/* Question Display - Below Video */}
            <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      question ? "bg-green-500 animate-pulse" : "bg-muted"
                    }`}
                  ></div>
                  <h3 className="text-lg font-bold">
                    {question ? "Current Question" : "Awaiting Question"}
                  </h3>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
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
                  <span className="text-xl font-bold tabular-nums">
                    {timerRemaining}s
                  </span>
                </div>
              </div>

              {/* Time Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
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

              <p className="text-lg leading-relaxed mb-4 min-h-[3rem]">
                {question
                  ? question.question
                  : "Upload your resume and start the interview to begin. The system will analyze your background and generate tailored technical questions."}
              </p>

              {question && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    Role:{" "}
                    <span className="font-semibold text-foreground">
                      {question.role}
                    </span>
                  </span>
                  <span>
                    Difficulty:{" "}
                    <span className="font-semibold text-foreground capitalize">
                      {question.difficulty}
                    </span>
                  </span>
                </div>
              )}

              {/* Answer Recording */}
              <div className="mt-6 bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-primary"
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
                  </h4>
                  <button
                    onClick={handleStopAnswer}
                    disabled={!question || !isRecording}
                    className="bg-destructive/20 text-destructive hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200"
                  >
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
                    <span className="text-sm">
                      {isRecording
                        ? "Recording in progress..."
                        : "Waiting to record"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{audioStatus}</p>

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

            {/* Performance Report - Below Video and Questions */}
            <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Performance Report
                </h3>
                <button
                  onClick={handleGenerateReport}
                  disabled={!sessionId}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-200"
                >
                  Generate Report
                </button>
              </div>

              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {reportOutput}
                </pre>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadAnswers}
                  disabled={!reportData}
                  className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors duration-200"
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
                  className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors duration-200"
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
            </div>
          </div>

          {/* Right Column - Upload Resume and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Resume */}
            <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
              <h3 className="text-base font-bold mb-4">Upload Resume</h3>
              <div className="space-y-3">
                <input
                  ref={resumeFileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
                <button
                  onClick={handleAnalyzeResume}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Analyze Resume
                </button>
                {resumeMessage && (
                  <div className="bg-muted/50 border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      {resumeMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detected Roles */}
            <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
              <h3 className="text-base font-bold mb-4">Detected Roles</h3>
              {roles.length === 0 ? (
                <div className="bg-muted/30 border border-dashed border-border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No roles detected yet
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm font-medium"
                    >
                      <span>{role.name}</span>
                      <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full text-primary">
                        {(role.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interview Controls */}
            <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm shadow-lg">
              <h3 className="text-base font-bold mb-4">Interview Session</h3>
              <div className="space-y-3">
                <button
                  onClick={handleStartInterview}
                  disabled={roles.length === 0 || !!sessionId}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-bold transition-colors duration-200 shadow-lg text-sm"
                >
                  {sessionId ? "Interview Running" : "Start Interview"}
                </button>
                <button
                  onClick={handleEndSession}
                  disabled={!sessionId}
                  className="w-full bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  End Session
                </button>
                {sessionMessage && (
                  <div className="bg-muted/50 border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      {sessionMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

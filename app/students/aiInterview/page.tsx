"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/* ================================================================== */
/*  Type declarations                                                  */
/* ================================================================== */

declare global {
  interface Window {
    FaceMesh: new (config: { locateFile: (file: string) => string }) => {
      setOptions: (opts: Record<string, unknown>) => void;
      onResults: (cb: (r: FaceMeshResults) => void) => void;
      send: (d: { image: HTMLVideoElement }) => Promise<void>;
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

interface AnswerFeedback {
  score: number;
  reasoning: string;
  transcribed_text?: string;
}

interface ReportRole {
  role_name: string;
  total_raw_score: number;
  max_possible: number;
}

interface ReportData {
  total_raw_score?: number;
  max_possible?: number;
  roles?: ReportRole[];
  final_summary?: string;
  total_questions?: number;
}

/* ================================================================== */
/*  Constants & pure helpers                                           */
/* ================================================================== */

const PREP_SECONDS = 10;
const RECORD_SECONDS = 60;
const CODING_SECONDS = 10 * 60;
const MAX_GAZE_WARNINGS = 5;

const fmt = (s: number) => {
  const v = Math.max(0, s);
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
};

const isCodingQ = (q: Question | null): boolean => {
  if (!q) return false;
  const id = q.id.toLowerCase();
  const role = q.role.toLowerCase();
  const text = q.question.toLowerCase();
  return (
    role === "coding_round" ||
    id.startsWith("coding_") ||
    id === "coding_round_1" ||
    text.includes("write working code")
  );
};

const pctColor = (p: number) =>
  p >= 0.75
    ? "text-emerald-500"
    : p >= 0.5
      ? "text-amber-500"
      : "text-rose-500";

const barColor = (p: number) =>
  p >= 0.75 ? "bg-emerald-500" : p >= 0.5 ? "bg-amber-500" : "bg-rose-500";

const strokeDash = (p: number) =>
  p >= 0.75
    ? "stroke-emerald-500"
    : p >= 0.5
      ? "stroke-amber-500"
      : "stroke-rose-500";

const diffBadge = (d: string) => {
  switch (d) {
    case "hard":
      return "bg-rose-500/15 text-rose-500 border-rose-500/30";
    case "medium":
      return "bg-amber-500/15 text-amber-600 border-amber-500/30";
    default:
      return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  }
};

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function AIInterviewPage() {
  /* ---------------------------------------------------------------- */
  /*  State                                                            */
  /* ---------------------------------------------------------------- */

  const [apiBase] = useState(
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  );
  const [section, setSection] = useState<1 | 2 | 3 | 4>(1);

  // session
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);

  // interview
  const [question, setQuestionState] = useState<Question | null>(null);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerTotal, setTimerTotal] = useState(PREP_SECONDS + RECORD_SECONDS);
  const [phase, setPhase] = useState<
    "idle" | "prep" | "recording" | "submitted" | "coding"
  >("idle");
  const [interviewLocked, setInterviewLocked] = useState(false);

  // audio
  const [audioStatus, setAudioStatus] = useState("Mic idle.");
  const [micLevel, setMicLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // coding
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [codingAnswer, setCodingAnswer] = useState("");
  const [codingSubmitting, setCodingSubmitting] = useState(false);

  // feedback
  const [lastFeedback, setLastFeedback] = useState<AnswerFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // proctoring
  const [gazeStatus, setGazeStatus] = useState("Camera check idle.");
  const [gazeWarnings, setGazeWarnings] = useState(0);

  // UI
  const [resumeMsg, setResumeMsg] = useState("");
  const [sessionMsg, setSessionMsg] = useState("");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Refs                                                             */
  /* ---------------------------------------------------------------- */

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioDiscardRef = useRef(false);
  const timerExpiredSentRef = useRef(false);
  const stopRequestedRef = useRef(false);

  const camStreamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<InstanceType<typeof window.FaceMesh> | null>(null);
  const gazeMonitorRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gazeLastResultRef = useRef(0);
  const gazeOnScreenRef = useRef(true);
  const gazeAwaySinceRef = useRef(0);
  const lastGazeWarnRef = useRef(0);

  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRecordDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRecordStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const meterRafRef = useRef<number | null>(null);
  const camLoopRafRef = useRef<number | null>(null);
  const fmBusyRef = useRef(false);

  // stable refs for async callbacks (avoid stale closures)
  const questionRef = useRef<Question | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const lockedRef = useRef(false);
  const codingSubRef = useRef(false);
  const qNumRef = useRef(0);

  // DOM refs
  const gazeVideoRef = useRef<HTMLVideoElement>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement>(null);
  const resumeFileRef = useRef<HTMLInputElement>(null);
  const codingTextareaRef = useRef<HTMLTextAreaElement>(null);

  /* ---- keep stable refs in sync ---- */
  useEffect(() => {
    questionRef.current = question;
  }, [question]);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);
  useEffect(() => {
    lockedRef.current = interviewLocked;
  }, [interviewLocked]);
  useEffect(() => {
    codingSubRef.current = codingSubmitting;
  }, [codingSubmitting]);
  useEffect(() => {
    qNumRef.current = questionNumber;
  }, [questionNumber]);

  /* ================================================================ */
  /*  Utility functions                                                */
  /* ================================================================ */

  const apiFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const base = apiBase.replace(/\/$/, "");
      const res = await fetch(`${base}${path}`, options);
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || `Request failed (${res.status})`);
      }
      if (res.status === 204) return null;
      return res.json();
    },
    [apiBase],
  );

  const toast = useCallback((m: string) => setSessionMsg(m), []);
  const resumeToast = useCallback((m: string) => setResumeMsg(m), []);

  const downloadJSON = useCallback((data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis)
      return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }, []);

  const mimeType = useCallback(() => {
    if (typeof MediaRecorder === "undefined") return "";
    return (
      [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ].find((t) => MediaRecorder.isTypeSupported(t)) || ""
    );
  }, []);

  /* ================================================================ */
  /*  Gaze / FaceMesh                                                  */
  /* ================================================================ */

  const dist2 = useCallback(
    (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2),
    [],
  );

  const avgPt = useCallback(
    (pts: { x: number; y: number }[]) => ({
      x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
      y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
    }),
    [],
  );

  const isLooking = useCallback(
    (lm: { x: number; y: number; z?: number }[]) => {
      if (!lm || lm.length < 477) return false;
      const lO = lm[33],
        lI = lm[133],
        rI = lm[362],
        rO = lm[263];
      const lU = lm[159],
        lL = lm[145],
        rU = lm[386],
        rL = lm[374];
      const lIris = avgPt([lm[468], lm[469], lm[470], lm[471]]);
      const rIris = avgPt([lm[473], lm[474], lm[475], lm[476]]);
      const lW = Math.max(dist2(lO, lI), 1e-4);
      const rW = Math.max(dist2(rO, rI), 1e-4);
      const lOpen = dist2(lU, lL) / lW;
      const rOpen = dist2(rU, rL) / rW;
      const lR = (lIris.x - lO.x) / Math.max(lI.x - lO.x, 1e-4);
      const rR = (rIris.x - rI.x) / Math.max(rO.x - rI.x, 1e-4);
      return (
        lOpen > 0.12 &&
        rOpen > 0.12 &&
        lR > 0.2 &&
        lR < 0.8 &&
        rR > 0.2 &&
        rR < 0.8
      );
    },
    [avgPt, dist2],
  );

  /* ================================================================ */
  /*  Audio & stream management                                        */
  /* ================================================================ */

  const releaseStream = useCallback(() => {
    if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
    meterRafRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
  }, []);

  const stopRecorderOnly = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    )
      mediaRecorderRef.current.stop();
  }, []);

  const clearAutoTimers = useCallback(() => {
    if (autoRecordDelayRef.current) clearTimeout(autoRecordDelayRef.current);
    autoRecordDelayRef.current = null;
    if (autoRecordStopRef.current) clearTimeout(autoRecordStopRef.current);
    autoRecordStopRef.current = null;
  }, []);

  const resetAudioUI = useCallback(() => {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.hidden = true;
      audioPlaybackRef.current.src = "";
    }
    setMicLevel(0);
    setAudioStatus("Mic idle.");
    setIsRecording(false);
  }, []);

  /* ================================================================ */
  /*  Camera proctoring                                                */
  /* ================================================================ */

  const stopCamera = useCallback(() => {
    if (camLoopRafRef.current) cancelAnimationFrame(camLoopRafRef.current);
    camLoopRafRef.current = null;
    if (gazeMonitorRef.current) clearInterval(gazeMonitorRef.current);
    gazeMonitorRef.current = null;
    camStreamRef.current?.getTracks().forEach((t) => t.stop());
    camStreamRef.current = null;
    if (gazeVideoRef.current) gazeVideoRef.current.srcObject = null;
    fmBusyRef.current = false;
    gazeAwaySinceRef.current = 0;
    gazeLastResultRef.current = 0;
  }, []);

  const finalizeProctoring = useCallback(() => {
    if (lockedRef.current) return;
    setInterviewLocked(true);
    lockedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (codingTimerRef.current) clearInterval(codingTimerRef.current);
    clearAutoTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      audioDiscardRef.current = true;
      stopRecorderOnly();
    }
    releaseStream();
    stopCamera();
    setQuestionState(null);
    setPhase("idle");
    setSessionMsg("Interview stopped: 5 proctoring warnings reached.");
    setGazeStatus("Interview stopped by proctoring policy.");
  }, [clearAutoTimers, releaseStream, stopCamera, stopRecorderOnly]);

  const issueGazeWarn = useCallback(() => {
    const now = Date.now();
    if (now - lastGazeWarnRef.current < 4000) return;
    lastGazeWarnRef.current = now;
    setGazeWarnings((prev) => {
      const n = prev + 1;
      setSessionMsg(
        `Warning ${n}/${MAX_GAZE_WARNINGS}: keep your eyes on the screen.`,
      );
      setGazeStatus("Warning: not looking at the screen.");
      if (n >= MAX_GAZE_WARNINGS) finalizeProctoring();
      return n;
    });
  }, [finalizeProctoring]);

  const startGazeMonitor = useCallback(() => {
    if (gazeMonitorRef.current) clearInterval(gazeMonitorRef.current);
    gazeMonitorRef.current = setInterval(() => {
      if (!sessionIdRef.current || lockedRef.current) return;
      const now = Date.now();
      const stale = now - gazeLastResultRef.current > 2500;
      const ok = !stale && gazeOnScreenRef.current;
      if (ok) {
        gazeAwaySinceRef.current = 0;
        setGazeStatus("Looking at screen.");
        return;
      }
      if (!gazeAwaySinceRef.current) {
        gazeAwaySinceRef.current = now;
        setGazeStatus("Look back at the screen.");
        return;
      }
      if (now - gazeAwaySinceRef.current >= 2500) {
        gazeAwaySinceRef.current = now;
        issueGazeWarn();
      }
    }, 1000);
  }, [issueGazeWarn]);

  const initCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setGazeStatus("Camera not supported.");
      return false;
    }
    if (typeof window.FaceMesh === "undefined") {
      setGazeStatus("Face tracking not loaded.");
      return false;
    }
    try {
      setGazeStatus("Requesting camera...");
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
          locateFile: (f: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });
        faceMeshRef.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        faceMeshRef.current.onResults((r: FaceMeshResults) => {
          gazeLastResultRef.current = Date.now();
          gazeOnScreenRef.current = Boolean(
            r.multiFaceLandmarks?.[0] && isLooking(r.multiFaceLandmarks[0]),
          );
        });
      }
      const loop = async () => {
        if (!gazeVideoRef.current || !camStreamRef.current) return;
        if (!fmBusyRef.current && gazeVideoRef.current.readyState >= 2) {
          try {
            fmBusyRef.current = true;
            await faceMeshRef.current?.send({ image: gazeVideoRef.current });
          } catch {
            gazeOnScreenRef.current = false;
          } finally {
            fmBusyRef.current = false;
          }
        }
        camLoopRafRef.current = requestAnimationFrame(loop);
      };
      loop();
      gazeOnScreenRef.current = true;
      gazeAwaySinceRef.current = 0;
      lastGazeWarnRef.current = 0;
      gazeLastResultRef.current = Date.now();
      setGazeStatus("Gaze monitor running.");
      startGazeMonitor();
      return true;
    } catch (e) {
      setGazeStatus(
        `Camera denied: ${e instanceof Error ? e.message : String(e)}`,
      );
      stopCamera();
      return false;
    }
  }, [isLooking, startGazeMonitor, stopCamera]);

  /* ================================================================ */
  /*  Cleanup on unmount                                               */
  /* ================================================================ */

  const cleanupAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (codingTimerRef.current) clearInterval(codingTimerRef.current);
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    clearAutoTimers();
    if (gazeMonitorRef.current) clearInterval(gazeMonitorRef.current);
    if (meterRafRef.current) cancelAnimationFrame(meterRafRef.current);
    if (camLoopRafRef.current) cancelAnimationFrame(camLoopRafRef.current);
    releaseStream();
    stopCamera();
  }, [clearAutoTimers, releaseStream, stopCamera]);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
    s.async = true;
    document.body.appendChild(s);
    return cleanupAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================================================================ */
  /*  Post-answer flow                                                 */
  /* ================================================================ */

  const handlePostAnswer = useCallback(
    async (
      data: {
        has_more_questions?: boolean;
        score?: number;
        reasoning?: string;
        transcribed_text?: string;
      },
      opts: { immediateNext?: boolean } = {},
    ) => {
      if (lockedRef.current) return;

      // per-answer feedback
      if (data.score !== undefined || data.transcribed_text) {
        setLastFeedback({
          score: data.score ?? 0,
          reasoning: data.reasoning ?? "",
          transcribed_text: data.transcribed_text,
        });
        setShowFeedback(true);
      }
      setPhase("submitted");

      if (!data.has_more_questions) {
        toast("All questions answered. Generating report...");
        releaseStream();
        stopCamera();
        setSection(4);
        setTimeout(async () => {
          const sid = sessionIdRef.current;
          if (!sid) return;
          try {
            const rpt = await apiFetch(`/interview/${sid}/report`);
            setReportData(rpt);
            setSessionMsg("Report generated.");
          } catch (e) {
            setSessionMsg(
              `Report failed: ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }, 1500);
        return;
      }

      toast("Answer submitted. Loading next...");
      if (!opts.immediateNext && timerRef.current)
        clearInterval(timerRef.current);

      // load next question
      const sid = sessionIdRef.current;
      if (!sid || lockedRef.current) return;
      try {
        const next = await apiFetch(`/interview/${sid}/question`);
        if (!next) {
          setQuestionState(null);
          setPhase("idle");
          toast("Interview completed.");
          releaseStream();
          stopCamera();
          setSection(4);
          return;
        }
        setQuestionNumber((p) => p + 1);
        applyQuestion(next);
      } catch (e) {
        toast(
          `Question fetch failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* ================================================================ */
  /*  Upload audio answer                                              */
  /* ================================================================ */

  const uploadAudio = useCallback(
    async (blob: Blob, opts: { immediateNext?: boolean } = {}) => {
      const sid = sessionIdRef.current;
      const q = questionRef.current;
      if (!sid || !q) return;
      const ext = blob.type.includes("ogg") ? "ogg" : "webm";
      const fd = new FormData();
      fd.append("file", blob, `answer.${ext}`);
      try {
        const data = await apiFetch(
          `/interview/${sid}/answer/audio?question_id=${encodeURIComponent(q.id)}`,
          { method: "POST", body: fd },
        );
        await handlePostAnswer(data, opts);
      } catch (e) {
        setAudioStatus(
          `Upload failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      }
    },
    [apiFetch, handlePostAnswer],
  );

  /* ================================================================ */
  /*  Recording controls                                               */
  /* ================================================================ */

  const submitStoppedNoAudio = useCallback(async () => {
    const sid = sessionIdRef.current;
    const q = questionRef.current;
    if (!sid || !q || lockedRef.current) return;
    try {
      const data = await apiFetch(`/interview/${sid}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: q.id,
          answer_text: "(Candidate stopped early)",
        }),
      });
      await handlePostAnswer(data, { immediateNext: true });
    } catch (e) {
      toast(`Submit failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [apiFetch, handlePostAnswer, toast]);

  const startRecording = useCallback(async () => {
    if (!questionRef.current || lockedRef.current) return;
    try {
      audioDiscardRef.current = false;
      audioChunksRef.current = [];
      const mt = mimeType();
      const stream = micStreamRef.current;
      if (!stream) {
        setAudioStatus("Microphone not ready.");
        return;
      }
      const rec = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined);
      mediaRecorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data?.size) audioChunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        const goNext = stopRequestedRef.current;
        stopRequestedRef.current = false;
        if (audioDiscardRef.current) {
          audioDiscardRef.current = false;
          resetAudioUI();
          return;
        }
        const blob = new Blob(audioChunksRef.current, {
          type: rec.mimeType || mt || "audio/webm",
        });
        if (!blob.size) {
          setAudioStatus("Recorded audio was empty.");
          resetAudioUI();
          if (goNext) submitStoppedNoAudio();
          return;
        }
        if (audioPlaybackRef.current) {
          audioPlaybackRef.current.src = URL.createObjectURL(blob);
          audioPlaybackRef.current.hidden = false;
        }
        uploadAudio(blob, { immediateNext: goNext });
        resetAudioUI();
      };

      rec.start();
      setIsRecording(true);
      setPhase("recording");
      setAudioStatus("Recording... speak now.");

      autoRecordStopRef.current = setTimeout(() => {
        stopRecording();
      }, RECORD_SECONDS * 1000);
    } catch (e) {
      setAudioStatus(
        `Mic error: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mimeType, resetAudioUI, submitStoppedNoAudio, uploadAudio]);

  const stopRecording = useCallback(() => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    )
      return;
    setAudioStatus("Processing...");
    if (autoRecordStopRef.current) clearTimeout(autoRecordStopRef.current);
    autoRecordStopRef.current = null;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }, []);

  /* ================================================================ */
  /*  Coding round                                                     */
  /* ================================================================ */

  const submitCoding = useCallback(
    async ({ timedOut = false }: { timedOut?: boolean } = {}) => {
      const sid = sessionIdRef.current;
      const q = questionRef.current;
      if (!sid || !q || lockedRef.current || codingSubRef.current) return;
      const typed = (codingTextareaRef.current?.value ?? "").trim();
      const text = typed || (timedOut ? "(No answer — time expired)" : "");
      if (!text) {
        toast("Write your answer before submitting.");
        return;
      }
      setCodingSubmitting(true);
      codingSubRef.current = true;
      try {
        const data = await apiFetch(`/interview/${sid}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question_id: q.id, answer_text: text }),
        });
        if (codingTimerRef.current) clearInterval(codingTimerRef.current);
        await handlePostAnswer(data, { immediateNext: true });
      } catch (e) {
        toast(
          `Coding submit failed: ${e instanceof Error ? e.message : String(e)}`,
        );
      } finally {
        setCodingSubmitting(false);
        codingSubRef.current = false;
      }
    },
    [apiFetch, handlePostAnswer, toast],
  );

  /* ================================================================ */
  /*  Timer                                                            */
  /* ================================================================ */

  const submitTimeoutAnswer = useCallback(async () => {
    const sid = sessionIdRef.current;
    const q = questionRef.current;
    if (!sid || !q || lockedRef.current) return;
    if (isCodingQ(q)) {
      submitCoding({ timedOut: true });
      return;
    }
    try {
      const data = await apiFetch(`/interview/${sid}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: q.id,
          answer_text: "(No answer — time expired)",
        }),
      });
      await handlePostAnswer(data);
    } catch (e) {
      toast(
        `Timeout submit failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }, [apiFetch, handlePostAnswer, submitCoding, toast]);

  const startTimer = useCallback(
    (coding: boolean) => {
      if (lockedRef.current) return;
      if (timerRef.current) clearInterval(timerRef.current);
      if (codingTimerRef.current) clearInterval(codingTimerRef.current);
      const total = coding ? CODING_SECONDS : PREP_SECONDS + RECORD_SECONDS;
      setTimerTotal(total);
      setTimerRemaining(total);
      timerExpiredSentRef.current = false;
      if (coding) {
        codingTimerRef.current = setInterval(() => {
          setTimerRemaining((p) => {
            const n = p - 1;
            if (n <= 0) {
              if (codingTimerRef.current) clearInterval(codingTimerRef.current);
              if (!timerExpiredSentRef.current) {
                timerExpiredSentRef.current = true;
                submitCoding({ timedOut: true });
              }
            }
            return n;
          });
        }, 1000);
      } else {
        timerRef.current = setInterval(() => {
          setTimerRemaining((p) => {
            const n = p - 1;
            if (n <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
              )
                return n;
              if (!timerExpiredSentRef.current) {
                timerExpiredSentRef.current = true;
                submitTimeoutAnswer();
              }
            }
            return n;
          });
        }, 1000);
      }
    },
    [submitCoding, submitTimeoutAnswer],
  );

  /* ================================================================ */
  /*  Apply question (orchestrator)                                    */
  /* ================================================================ */

  const applyQuestion = useCallback(
    (q: Question | null) => {
      if (lockedRef.current && q) return;
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }
      clearAutoTimers();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        audioDiscardRef.current = true;
        stopRecorderOnly();
      }
      if (codingTimerRef.current) {
        clearInterval(codingTimerRef.current);
        codingTimerRef.current = null;
      }
      setQuestionState(q);
      stopRequestedRef.current = false;
      timerExpiredSentRef.current = false;
      setShowFeedback(false);
      resetAudioUI();
      const coding = isCodingQ(q);
      setIsCodingMode(coding);
      setCodingAnswer("");
      if (q) {
        if (coding) {
          setPhase("coding");
          startTimer(true);
          speak(
            "Coding round started. You have ten minutes. Submit when ready.",
          );
          toast("Coding round — 10 minutes.");
          setTimeout(() => codingTextareaRef.current?.focus(), 200);
        } else {
          setPhase("prep");
          startTimer(false);
          speak(q.question);
          setAudioStatus(`Recording starts in ${PREP_SECONDS}s...`);
          autoRecordDelayRef.current = setTimeout(() => {
            autoRecordDelayRef.current = null;
            startRecording();
          }, PREP_SECONDS * 1000);
        }
      } else {
        setPhase("idle");
      }
    },
    [
      clearAutoTimers,
      resetAudioUI,
      speak,
      startRecording,
      startTimer,
      stopRecorderOnly,
      toast,
    ],
  );

  /* ================================================================ */
  /*  Mic init                                                         */
  /* ================================================================ */

  const initMic = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioStatus("Audio not supported.");
      return false;
    }
    try {
      setAudioStatus("Requesting microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AC =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) {
        setAudioStatus("AudioContext unavailable.");
        return false;
      }
      audioCtxRef.current = new AC();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      audioCtxRef.current
        .createMediaStreamSource(stream)
        .connect(analyserRef.current);
      analyserRef.current.fftSize = 1024;
      const buf = new Uint8Array(analyserRef.current.fftSize);
      const meter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        setMicLevel(Math.min(100, Math.max(4, Math.round(rms * 220))));
        meterRafRef.current = requestAnimationFrame(meter);
      };
      meter();
      setAudioStatus("Microphone ready.");
      return true;
    } catch (e) {
      setAudioStatus(
        `Mic denied: ${e instanceof Error ? e.message : String(e)}`,
      );
      return false;
    }
  }, []);

  /* ================================================================ */
  /*  Intro                                                            */
  /* ================================================================ */

  const startIntro = useCallback(
    (sid: string) => {
      const names = roles.map((r) => r.name).join(", ");
      speak(
        `Hello! I'm your interviewer today. We'll cover questions for ${names}, each with 60 seconds, followed by a coding round. Let's begin.`,
      );
      toast("Introduction — first question in 15 seconds...");
      introTimerRef.current = setTimeout(async () => {
        introTimerRef.current = null;
        toast("Loading first question...");
        if (!sid || lockedRef.current) return;
        try {
          const q = await apiFetch(`/interview/${sid}/question`);
          if (!q) {
            setQuestionState(null);
            toast("No questions available.");
            releaseStream();
            stopCamera();
            return;
          }
          setQuestionNumber(1);
          applyQuestion(q);
        } catch (e) {
          toast(`Fetch failed: ${e instanceof Error ? e.message : String(e)}`);
        }
      }, 15000);
    },
    [apiFetch, applyQuestion, releaseStream, roles, speak, stopCamera, toast],
  );

  /* ================================================================ */
  /*  Main handlers                                                    */
  /* ================================================================ */

  const handleAnalyze = useCallback(async () => {
    const file = resumeFileRef.current?.files?.[0];
    if (!file) {
      resumeToast("Please select a resume file.");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    setIsAnalyzing(true);
    resumeToast("Analyzing resume...");
    try {
      const data = await apiFetch("/resume/analyze", {
        method: "POST",
        body: fd,
      });
      setRoles(data.roles || []);
      resumeToast(
        data.roles?.length
          ? `${data.roles.length} role(s) detected.`
          : "No roles found. Try a different resume.",
      );
    } catch (e) {
      resumeToast(
        `Analysis failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiFetch, resumeToast]);

  const handleStart = useCallback(async () => {
    if (!roles.length) {
      toast("Analyze a resume first.");
      return;
    }
    setIsStarting(true);
    toast("Starting interview...");
    try {
      setInterviewLocked(false);
      lockedRef.current = false;
      setGazeWarnings(0);
      gazeAwaySinceRef.current = 0;
      lastGazeWarnRef.current = 0;
      setGazeStatus("Camera check idle.");
      setReportData(null);
      setShowFeedback(false);
      setLastFeedback(null);
      setQuestionNumber(0);

      const payload = {
        roles: roles.map((r) => ({
          name: r.name,
          confidence: r.confidence,
          rationale: r.rationale || "",
        })),
      };
      const data = await apiFetch("/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSessionId(data.session_id);
      sessionIdRef.current = data.session_id;
      setTotalQuestions(data.total_questions || 0);
      toast(`Interview started — ${data.total_questions} questions.`);

      const micOk = await initMic();
      const camOk = await initCamera();
      if (!micOk || !camOk) {
        await apiFetch(`/interview/${data.session_id}`, { method: "DELETE" });
        setSessionId(null);
        sessionIdRef.current = null;
        releaseStream();
        stopCamera();
        applyQuestion(null);
        toast("Cancelled — microphone & camera required.");
        return;
      }
      startIntro(data.session_id);
    } catch (e) {
      toast(`Start failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsStarting(false);
    }
  }, [
    apiFetch,
    applyQuestion,
    initCamera,
    initMic,
    releaseStream,
    roles,
    startIntro,
    stopCamera,
    toast,
  ]);

  const handleStop = useCallback(async () => {
    const sid = sessionIdRef.current;
    const q = questionRef.current;
    if (!sid || !q || lockedRef.current || stopRequestedRef.current) return;
    stopRequestedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    clearAutoTimers();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setAudioStatus("Stopping...");
      stopRecorderOnly();
      return;
    }
    await submitStoppedNoAudio();
    stopRequestedRef.current = false;
  }, [clearAutoTimers, stopRecorderOnly, submitStoppedNoAudio]);

  const handleGenerateReport = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      const data = await apiFetch(`/interview/${sid}/report`);
      setReportData(data);
      toast("Report generated.");
    } catch (e) {
      toast(`Report failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [apiFetch, toast]);

  const handleDownloadReport = useCallback(() => {
    if (!reportData) return;
    downloadJSON(reportData, "interview_report.json");
  }, [downloadJSON, reportData]);

  const handleDownloadAnswers = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      const data = await apiFetch(`/interview/${sid}/export`);
      downloadJSON(data, "interview_answers.json");
    } catch (e) {
      toast(`Download failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [apiFetch, downloadJSON, toast]);

  const handleEnd = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      await apiFetch(`/interview/${sid}`, { method: "DELETE" });
      toast("Session ended.");
      setSessionId(null);
      sessionIdRef.current = null;
      clearAutoTimers();
      if (codingTimerRef.current) clearInterval(codingTimerRef.current);
      releaseStream();
      stopCamera();
      resetAudioUI();
      setGazeStatus("Camera check idle.");
      setGazeWarnings(0);
      setInterviewLocked(false);
      lockedRef.current = false;
      setQuestionState(null);
      setIsCodingMode(false);
      setCodingAnswer("");
      setShowFeedback(false);
      setPhase("idle");
    } catch (e) {
      toast(`End failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [
    apiFetch,
    clearAutoTimers,
    releaseStream,
    resetAudioUI,
    stopCamera,
    toast,
  ]);

  const resetAll = useCallback(() => {
    setSection(1);
    setRoles([]);
    setReportData(null);
    setResumeMsg("");
    setSessionMsg("");
    setLastFeedback(null);
    setShowFeedback(false);
    setIsCodingMode(false);
    setCodingAnswer("");
    setTotalQuestions(0);
    setQuestionNumber(0);
    setPhase("idle");
  }, []);

  /* ================================================================ */
  /*  Derived                                                          */
  /* ================================================================ */

  const timerPct = timerTotal > 0 ? (timerRemaining / timerTotal) * 100 : 0;
  const timerCritical = isCodingMode
    ? timerRemaining <= 60
    : timerRemaining <= 10;
  const timerWarn = isCodingMode ? timerRemaining <= 180 : timerRemaining <= 30;
  const overallPct =
    reportData?.max_possible && reportData.total_raw_score !== undefined
      ? (reportData.total_raw_score ?? 0) / reportData.max_possible
      : 0;

  /* ================================================================ */
  /*  JSX                                                              */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-0">
      {/* Subtle background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20" />
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* CSS animations */}
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(24px);
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
          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(24px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .anim-up {
            animation: slideUp 0.45s ease-out both;
          }
          .anim-fade {
            animation: fadeIn 0.3s ease-out both;
          }
          .anim-right {
            animation: slideRight 0.45s ease-out both;
          }
        `}</style>

        {/* ========================================================== */}
        {/*  HEADER                                                     */}
        {/* ========================================================== */}
        <header className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                AI Interview
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Role-based technical interview with live proctoring
              </p>
            </div>
            {sessionId && totalQuestions > 0 && section === 3 && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium bg-card border border-border rounded-full px-4 py-2 shadow-sm">
                <span className="text-primary font-bold">
                  Q{questionNumber}
                </span>
                <span className="text-muted-foreground">
                  / {totalQuestions}
                </span>
              </div>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 select-none">
            {(
              [
                [1, "Intro"],
                [2, "Resume"],
                [3, "Interview"],
                [4, "Results"],
              ] as const
            ).map(([step, label], i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                      section === step
                        ? "bg-foreground text-background ring-4 ring-foreground/20 scale-110"
                        : section > step
                          ? "bg-foreground/80 text-background"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {section > step ? (
                      <svg
                        className="w-4 h-4"
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
                  <span
                    className={`hidden sm:block text-[10px] font-medium ${section >= step ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`w-8 sm:w-16 md:w-20 h-0.5 mx-1 rounded transition-colors duration-300 ${section > step ? "bg-foreground/60" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </header>

        {/* ========================================================== */}
        {/*  SECTION 1 — Introduction                                   */}
        {/* ========================================================== */}
        {section === 1 && (
          <div className="anim-fade max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-xl">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-foreground/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Welcome to AI Interview
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  A structured, AI-powered technical interview with live
                  proctoring, role-based questions, and a detailed performance
                  report.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    n: "1",
                    title: "Upload Your Resume",
                    desc: "Upload PDF or DOCX. Our AI detects relevant technical roles from your experience.",
                  },
                  {
                    n: "2",
                    title: "Camera & Microphone Access",
                    desc: "Grant access for live proctoring (gaze tracking) and audio recording of your answers.",
                  },
                  {
                    n: "3",
                    title: "Answer Questions",
                    desc: "10s prep + 60s to speak each answer. A 10-minute coding round follows technical questions.",
                  },
                  {
                    n: "4",
                    title: "Review Results",
                    desc: "Receive per-role scores, feedback on every answer, and an AI-generated summary.",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-foreground/10 flex items-center justify-center text-sm font-bold text-foreground">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-0.5 text-sm">
                        {s.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 mb-8 flex gap-3">
                <svg
                  className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
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
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 text-sm mb-1">
                    Before you start
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                    <li>Use a quiet, well-lit environment</li>
                    <li>Keep eyes on screen — 5 warnings = auto-stop</li>
                    <li>Ensure a stable internet connection</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setSection(2)}
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-3.5 px-6 rounded-xl font-bold transition-colors shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*  SECTION 2 — Resume Upload                                  */}
        {/* ========================================================== */}
        {section === 2 && (
          <div className="anim-fade max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-foreground/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
                <p className="text-muted-foreground text-sm">
                  PDF, DOC, or DOCX — we&apos;ll detect your technical roles
                </p>
              </div>

              <div className="space-y-5">
                {/* File input */}
                <div className="border-2 border-dashed border-border hover:border-foreground/30 rounded-xl p-6 text-center transition-colors">
                  <input
                    ref={resumeFileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="block w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-foreground file:text-background hover:file:bg-foreground/90 file:transition-colors cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Max 10 MB
                  </p>
                </div>

                {/* Status message */}
                {resumeMsg && (
                  <div className="anim-up bg-muted/50 border border-border rounded-xl p-3">
                    <p className="text-sm text-muted-foreground">{resumeMsg}</p>
                  </div>
                )}

                {/* Detected roles */}
                {roles.length > 0 && (
                  <div className="anim-up rounded-xl border border-border bg-muted/30 p-5">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-500"
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
                    <div className="space-y-2">
                      {roles.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-background/60 border border-border"
                        >
                          <span className="text-sm font-medium">{r.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-foreground/70 rounded-full"
                                style={{ width: `${r.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold w-10 text-right tabular-nums">
                              {(r.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSection(1)}
                    className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-semibold transition-colors text-sm"
                  >
                    Back
                  </button>
                  {roles.length === 0 ? (
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition-colors shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Spinner /> Analyzing...
                        </>
                      ) : (
                        "Analyze Resume"
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 flex gap-2">
                      <button
                        onClick={() => {
                          setRoles([]);
                          setResumeMsg("");
                        }}
                        className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-semibold transition-colors text-sm"
                      >
                        Re-analyze
                      </button>
                      <button
                        onClick={() => setSection(3)}
                        className="flex-[2] bg-foreground text-background hover:bg-foreground/90 py-3 rounded-xl font-bold transition-colors shadow-lg text-sm"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*  SECTION 3 — AI Interview                                   */}
        {/* ========================================================== */}
        {section === 3 && (
          <div className="anim-fade">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ---- Left Column (8/12) ---- */}
              <div className="lg:col-span-8 space-y-5">
                {/* Camera proctoring card */}
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle icon={<CameraIcon />}>Live Proctoring</CardTitle>
                    <span
                      className={`text-[11px] px-3 py-1 rounded-full font-semibold border ${
                        gazeWarnings >= 3
                          ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                          : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                      }`}
                    >
                      {gazeWarnings}/{MAX_GAZE_WARNINGS} warnings
                    </span>
                  </div>
                  <video
                    ref={gazeVideoRef}
                    className="w-full aspect-video rounded-lg bg-muted/50 border border-border object-cover mb-2"
                    autoPlay
                    playsInline
                    muted
                  />
                  <p className="text-xs text-muted-foreground">{gazeStatus}</p>
                </Card>

                {/* Audio answer card (hidden during coding) */}
                {!isCodingMode && (
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle icon={<MicIcon />}>
                        Your Answer
                        {phase === "prep" && (
                          <span className="ml-2 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Prep
                          </span>
                        )}
                        {phase === "recording" && (
                          <span className="ml-2 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">
                            Recording
                          </span>
                        )}
                        {phase === "submitted" && (
                          <span className="ml-2 text-[10px] font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            Submitted
                          </span>
                        )}
                      </CardTitle>
                      <button
                        onClick={handleStop}
                        disabled={!question || interviewLocked || isCodingMode}
                        className="bg-rose-500/15 text-rose-500 border border-rose-500/25 hover:bg-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed py-1.5 px-3.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Stop &amp; Submit
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${isRecording ? "bg-rose-500 animate-pulse" : "bg-muted-foreground/40"}`}
                        />
                        <span className="text-xs font-medium">
                          {isRecording ? "Recording..." : "Waiting"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {audioStatus}
                      </p>
                      {/* Mic level meter */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground w-10 shrink-0">
                          Level
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground/60 transition-all duration-75 rounded-full"
                            style={{ width: `${micLevel}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">
                          {micLevel}%
                        </span>
                      </div>
                    </div>
                    <audio
                      ref={audioPlaybackRef}
                      controls
                      className="w-full mt-3"
                      hidden
                    />
                  </Card>
                )}

                {/* Coding round card */}
                {isCodingMode && (
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <CardTitle icon={<CodeIcon />}>Coding Round</CardTitle>
                      <span
                        className={`text-lg font-mono font-bold tabular-nums px-3 py-1 rounded-full border ${
                          timerCritical
                            ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                            : timerWarn
                              ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                              : "bg-foreground/10 text-foreground border-border"
                        }`}
                      >
                        {fmt(timerRemaining)}
                      </span>
                    </div>
                    {/* Timer bar */}
                    <div className="mb-3">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 rounded-full ${timerCritical ? "bg-rose-500" : timerWarn ? "bg-amber-500" : "bg-foreground/50"}`}
                          style={{ width: `${timerPct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-right mt-1">
                        Auto-submits at 0:00
                      </p>
                    </div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Write your solution — include time &amp; space complexity
                    </label>
                    <textarea
                      ref={codingTextareaRef}
                      className="w-full h-52 bg-background border border-border rounded-lg p-3.5 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground/40"
                      placeholder={
                        "# Write your solution here\ndef solution(...):\n    pass\n\n# Time: O(?), Space: O(?)\n# Explanation: ..."
                      }
                      value={codingAnswer}
                      onChange={(e) => setCodingAnswer(e.target.value)}
                      disabled={codingSubmitting || interviewLocked}
                    />
                    <button
                      onClick={() => submitCoding({ timedOut: false })}
                      disabled={
                        !codingAnswer.trim() ||
                        codingSubmitting ||
                        interviewLocked
                      }
                      className="mt-3 w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      {codingSubmitting ? (
                        <>
                          <Spinner /> Submitting...
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Submit Answer
                        </>
                      )}
                    </button>
                  </Card>
                )}

                {/* Per-answer feedback */}
                {showFeedback && lastFeedback && (
                  <div className="anim-up">
                    <Card className="border-foreground/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Last Answer Feedback
                        </span>
                        <button
                          onClick={() => setShowFeedback(false)}
                          className="text-muted-foreground hover:text-foreground text-xs rounded px-2 py-0.5 hover:bg-muted transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                      {lastFeedback.transcribed_text && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                            Transcribed
                          </p>
                          <p className="text-sm italic leading-relaxed">
                            &ldquo;{lastFeedback.transcribed_text}&rdquo;
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-semibold">
                          Score
                        </span>
                        <span
                          className={`text-2xl font-bold tabular-nums ${lastFeedback.score >= 7 ? "text-emerald-500" : lastFeedback.score >= 5 ? "text-amber-500" : "text-rose-500"}`}
                        >
                          {lastFeedback.score}
                          <span className="text-sm text-muted-foreground font-normal">
                            /10
                          </span>
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${lastFeedback.score >= 7 ? "bg-emerald-500" : lastFeedback.score >= 5 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{
                              width: `${(lastFeedback.score / 10) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      {lastFeedback.reasoning && (
                        <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                          {lastFeedback.reasoning}
                        </p>
                      )}
                    </Card>
                  </div>
                )}
              </div>

              {/* ---- Right Column (4/12) ---- */}
              <div className="lg:col-span-4 space-y-5">
                {/* Timer card */}
                <Card>
                  <div className="text-center mb-3">
                    <span
                      className={`inline-block text-4xl font-bold tabular-nums ${isCodingMode ? "font-mono" : ""} ${timerCritical ? "text-rose-500" : timerWarn ? "text-amber-500" : ""}`}
                    >
                      {fmt(timerRemaining)}
                    </span>
                    {isCodingMode && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Coding — 10 min
                      </p>
                    )}
                    {!isCodingMode && phase === "prep" && (
                      <p className="text-[10px] text-amber-500 mt-1">
                        Preparing — recording soon
                      </p>
                    )}
                    {!isCodingMode && phase === "recording" && (
                      <p className="text-[10px] text-emerald-500 mt-1">
                        Recording in progress
                      </p>
                    )}
                    {!isCodingMode && phase === "submitted" && (
                      <p className="text-[10px] text-blue-500 mt-1">
                        Answer submitted
                      </p>
                    )}
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 rounded-full ${timerCritical ? "bg-rose-500" : timerWarn ? "bg-amber-500" : "bg-foreground/50"}`}
                      style={{ width: `${timerPct}%` }}
                    />
                  </div>
                </Card>

                {/* Question card */}
                <Card className="bg-gradient-to-br from-card to-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${question ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`}
                    />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {isCodingMode
                        ? "Coding Round"
                        : question
                          ? "Active Question"
                          : "Awaiting"}
                    </span>
                  </div>
                  <div key={question?.id} className="anim-right">
                    <p className="text-sm leading-relaxed mb-4 min-h-[3.5rem]">
                      {question?.question ??
                        "Waiting for the interview to begin..."}
                    </p>
                  </div>
                  {question && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-1 bg-foreground/10 rounded-md border border-border">
                        {question.role}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border capitalize ${diffBadge(question.difficulty)}`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                  )}
                </Card>

                {/* Controls card */}
                <Card>
                  {!sessionId ? (
                    <div className="space-y-3">
                      <h3 className="font-bold text-sm">Ready to begin?</h3>
                      <button
                        onClick={handleStart}
                        disabled={roles.length === 0 || isStarting}
                        className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
                      >
                        {isStarting ? (
                          <>
                            <Spinner /> Starting...
                          </>
                        ) : (
                          "Start Interview"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          In Progress
                        </span>
                        {totalQuestions > 0 && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            Q{questionNumber}/{totalQuestions}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleEnd}
                        className="w-full bg-rose-500/15 text-rose-500 border border-rose-500/25 hover:bg-rose-500/25 py-2 rounded-lg font-semibold text-xs transition-colors"
                      >
                        End Session
                      </button>
                    </div>
                  )}
                  {sessionMsg && (
                    <div className="mt-3 bg-muted/50 border border-border rounded-lg p-2.5">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {sessionMsg}
                      </p>
                    </div>
                  )}
                </Card>

                {/* Roles sidebar */}
                {roles.length > 0 && (
                  <Card>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                      Interview Roles
                    </p>
                    <div className="space-y-1.5">
                      {roles.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <span className="text-xs font-medium truncate">
                            {r.name}
                          </span>
                          <span className="text-[11px] font-bold tabular-nums ml-2">
                            {(r.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/*  SECTION 4 — Results                                        */}
        {/* ========================================================== */}
        {section === 4 && (
          <div className="anim-fade max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-foreground/10 rounded-2xl mx-auto mb-5 flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-1">Interview Complete</h2>
              <p className="text-muted-foreground text-sm">
                Your performance report
              </p>
            </div>

            {/* Loading state */}
            {!reportData && (
              <Card className="text-center py-12 mb-6">
                <Spinner className="mx-auto mb-3 w-6 h-6" />
                <p className="text-sm text-muted-foreground mb-2">
                  Generating report...
                </p>
                <button
                  onClick={handleGenerateReport}
                  className="text-xs text-foreground hover:underline"
                >
                  Retry
                </button>
              </Card>
            )}

            {/* Overall score */}
            {reportData && typeof reportData.total_raw_score === "number" && (
              <Card className="mb-5">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${overallPct * 100} 100`}
                        className={strokeDash(overallPct)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-xl font-bold ${pctColor(overallPct)}`}
                      >
                        {Math.round(overallPct * 100)}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Overall
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold mb-1">Overall Score</h3>
                    <p
                      className={`text-3xl font-bold tabular-nums ${pctColor(overallPct)}`}
                    >
                      {reportData.total_raw_score}
                      <span className="text-base text-muted-foreground font-normal">
                        {" "}
                        / {reportData.max_possible}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {reportData.total_questions ?? 0} questions answered
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Per-role cards */}
            {reportData?.roles && reportData.roles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {reportData.roles.map((role, i) => {
                  const p =
                    role.max_possible > 0
                      ? role.total_raw_score / role.max_possible
                      : 0;
                  return (
                    <Card key={i}>
                      <div className="flex items-start justify-between mb-2.5">
                        <div>
                          <h4 className="font-bold text-sm">
                            {role.role_name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground">
                            Role Performance
                          </p>
                        </div>
                        <span
                          className={`text-lg font-bold tabular-nums ${pctColor(p)}`}
                        >
                          {role.total_raw_score}
                          <span className="text-xs text-muted-foreground font-normal">
                            /{role.max_possible}
                          </span>
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Score</span>
                          <span>{Math.round(p * 100)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${barColor(p)}`}
                            style={{ width: `${p * 100}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* AI Summary */}
            {reportData?.final_summary && (
              <Card className="mb-5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                  AI Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {reportData.final_summary}
                </p>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <ActionBtn
                onClick={handleDownloadAnswers}
                disabled={!reportData}
                icon={<DownloadIcon />}
              >
                Answers JSON
              </ActionBtn>
              <ActionBtn
                onClick={handleDownloadReport}
                disabled={!reportData}
                primary
                icon={<ReportIcon />}
              >
                Report JSON
              </ActionBtn>
              <ActionBtn
                onClick={handleGenerateReport}
                disabled={!sessionId}
                icon={<RefreshIcon />}
              >
                Regenerate
              </ActionBtn>
            </div>

            <div className="text-center">
              <button
                onClick={resetAll}
                className="bg-muted hover:bg-muted/80 text-foreground py-3 px-8 rounded-xl font-semibold text-sm transition-colors"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card border border-border rounded-xl p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <h3 className="text-sm font-bold flex items-center gap-2">
      {icon}
      {children}
    </h3>
  );
}

function Spinner({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  primary,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        primary
          ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg"
          : "bg-muted text-foreground hover:bg-muted/80"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---- Icons ---- */

function CameraIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
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
        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
      />
    </svg>
  );
}

function ReportIcon() {
  return (
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
  );
}

function RefreshIcon() {
  return (
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
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

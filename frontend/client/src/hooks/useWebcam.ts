import { useState, useEffect, useRef, useCallback } from "react";

export function useWebcam() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      
      setStream(mediaStream);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready before marking as active
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, camera ready");
          setIsActive(true);
        };
      }
    } catch (err: any) {
      setError(err.message || "Failed to access webcam");
      setIsActive(false);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isActive) return null;

    // Check if video has loaded frames
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.log("Video not ready yet");
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Verify we have actual image data
    if (dataUrl === 'data:,' || dataUrl.length < 100) {
      console.log("Failed to capture valid frame");
      return null;
    }
    
    return dataUrl;
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    error,
    isActive,
    startWebcam,
    stopWebcam,
    captureFrame,
  };
}

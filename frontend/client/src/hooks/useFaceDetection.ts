import { useState, useEffect, useRef, useCallback } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) {
  const [faceBoxes, setFaceBoxes] = useState<FaceBox[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const animationFrameRef = useRef<number>();
  const isDetectingRef = useRef(false);

  // Load the BlazeFace model
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        console.log("Loading BlazeFace model...");
        const model = await blazeface.load();
        if (isMounted) {
          modelRef.current = model;
          setIsModelLoading(false);
          console.log("BlazeFace model loaded successfully");
        }
      } catch (error) {
        console.error("Failed to load BlazeFace model:", error);
        if (isMounted) {
          setIsModelLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Face detection loop
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !modelRef.current || !isActive || isDetectingRef.current) {
      return;
    }

    const video = videoRef.current;

    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detectFace);
      return;
    }

    isDetectingRef.current = true;

    try {
      const predictions = await modelRef.current.estimateFaces(video, false);
      
      console.log("BlazeFace predictions:", predictions ? predictions.length : 0);

      if (predictions && predictions.length > 0) {
        // BlazeFace returns coordinates in video's native resolution
        // We need to scale them to the rendered video element size
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;

        // Validate video dimensions
        if (videoWidth === 0 || videoHeight === 0 || displayWidth === 0 || displayHeight === 0) {
          return;
        }

        // Calculate aspect ratios
        const videoAspect = videoWidth / videoHeight;
        const displayAspect = displayWidth / displayHeight;

        // Calculate scale and offset due to object-cover
        let scale: number;
        let offsetX = 0;
        let offsetY = 0;

        if (displayAspect > videoAspect) {
          // Video is letterboxed vertically (black bars on top/bottom)
          scale = displayWidth / videoWidth;
          const scaledHeight = videoHeight * scale;
          offsetY = (displayHeight - scaledHeight) / 2;
        } else {
          // Video is letterboxed horizontally (black bars on sides)
          scale = displayHeight / videoHeight;
          const scaledWidth = videoWidth * scale;
          offsetX = (displayWidth - scaledWidth) / 2;
        }

        // Process all detected faces
        const boxes: FaceBox[] = predictions.map((face) => {
          const topLeft = face.topLeft as [number, number];
          const bottomRight = face.bottomRight as [number, number];

          // Scale coordinates from video space to display space
          const x = topLeft[0] * scale + offsetX;
          const y = topLeft[1] * scale + offsetY;
          const width = (bottomRight[0] - topLeft[0]) * scale;
          const height = (bottomRight[1] - topLeft[1]) * scale;

          return { x, y, width, height };
        });

        console.log("Setting faceBoxes:", boxes);
        setFaceBoxes(boxes);
      } else {
        // No faces detected
        setFaceBoxes([]);
      }
    } catch (error) {
      console.error("Face detection error:", error);
    } finally {
      isDetectingRef.current = false;
    }

    // Continue detection loop
    animationFrameRef.current = requestAnimationFrame(detectFace);
  }, [videoRef, isActive]);

  // Start/stop detection based on camera state
  useEffect(() => {
    console.log("Detection useEffect:", { isActive, isModelLoading, hasModel: !!modelRef.current });
    
    if (isActive && !isModelLoading && modelRef.current) {
      // Start detection loop
      console.log("Starting face detection loop");
      animationFrameRef.current = requestAnimationFrame(detectFace);
    } else {
      // Stop detection loop
      console.log("Stopping face detection loop");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setFaceBoxes([]);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isModelLoading, detectFace]);

  return {
    faceBoxes,
    isModelLoading,
  };
}

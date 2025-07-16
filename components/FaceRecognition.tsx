// components/FaceRecognition.tsx
import dynamic from 'next/dynamic';

const FaceRecognitionClient = dynamic(() => import('./FaceRecognitionClient'), { ssr: false });

export default function FaceRecognition(props: any) {
  return <FaceRecognitionClient {...props} />;
}

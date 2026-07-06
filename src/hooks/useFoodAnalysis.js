// src/hooks/useFoodAnalysis.js
import { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { DETECTED_FOODS_POOL } from '../utils/mockData';

const useFoodAnalysis = (onSuccess) => {
  const [cameraStep, setCameraStep] = useState('capture');
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'MacroMate needs access to your camera to scan your meals.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleCapture = async (useLibrary = false) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission && !useLibrary) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to scan meals. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    const result = useLibrary
      ? await launchImageLibrary(options)
      : await launchCamera(options);

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to open camera');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setCapturedImageUri(uri);
      setCameraStep('preview');
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsAnalysing(true);
    setCameraStep('analysing');

    // Mock API call
    setTimeout(() => {
      // Pick 2-3 random items from the pool
      const shuffled = [...DETECTED_FOODS_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

      setDetectedItems(selected);
      setIsAnalysing(false);

      if (selected.length === 0) {
        setCameraStep('capture');
        Alert.alert('Analysis Failed', 'No food items detected. Try a clearer photo.');
      } else {
        setCameraStep('results');
      }
    }, 2500);
  };

  const confirmAndLog = () => {
    setCameraStep('success');
    setTimeout(() => {
      onSuccess(detectedItems, capturedImageUri);
      resetFlow();
    }, 1500);
  };

  const resetFlow = () => {
    setCameraStep('capture');
    setCapturedImageUri(null);
    setDetectedItems([]);
    setIsAnalysing(false);
  };

  return {
    cameraStep,
    capturedImageUri,
    detectedItems,
    isAnalysing,
    handleCapture,
    confirmAndLog,
    resetFlow
  };
};

export default useFoodAnalysis;

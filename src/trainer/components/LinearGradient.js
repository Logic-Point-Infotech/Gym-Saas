// src/trainer/components/LinearGradient.js
import React from 'react';
import { View } from 'react-native';

export const LinearGradient = ({ colors, style, children, ...props }) => {
  const bg = Array.isArray(colors) && colors.length > 0 ? colors[0] : '#1A1A1A';
  return (
    <View style={[{ backgroundColor: bg }, style]} {...props}>
      {children}
    </View>
  );
};

export default LinearGradient;

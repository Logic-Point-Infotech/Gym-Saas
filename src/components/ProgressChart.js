// src/components/ProgressChart.js
import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../constants/ThemeContext';
import { MOCK_WEIGHT_HISTORY } from '../utils/mockData';

const { width } = Dimensions.get('window');

const ProgressChart = () => {
  const { theme } = useTheme();

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.primary,
    labelColor: (opacity = 1) => theme.textSecondary,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.primary
    }
  };

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <LineChart
        data={MOCK_WEIGHT_HISTORY}
        width={width - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border
        }}
      />
    </View>
  );
};

export default ProgressChart;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function RejectTrack({ rejectCount, maxRejectCount }) {
  return (
    <View style={styles.track}>
      {Array.from({ length: maxRejectCount }, (_, i) => {
        const filled = i < rejectCount;
        const danger = filled && i === maxRejectCount - 1;
        const nearDanger = !filled && i === rejectCount && rejectCount >= maxRejectCount - 2;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              filled && styles.dotFilled,
              danger && styles.dotDanger,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(200,60,60,0.4)',
    backgroundColor: 'rgba(80,20,20,0.2)',
  },
  dotFilled: {
    backgroundColor: colors.crimson,
  },
  dotDanger: {
    backgroundColor: '#ff4444',
  },
});

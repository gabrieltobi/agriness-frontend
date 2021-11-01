import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface Props extends TouchableOpacityProps {}

const Button = ({children, ...props}) => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.65} {...props}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
    fontWeight: '300',
    letterSpacing: 1,
  },
});

export default Button;

import React, {forwardRef} from 'react';
import {StyleSheet, View, TextInput, Text, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  label?: string;
}

const Input = forwardRef<TextInput, Props>(
  ({label, ...props}, forwardedRef) => {
    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor="#ccc"
          ref={forwardedRef}
          {...props}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 2,
  },
  input: {
    backgroundColor: 'transparent',
    color: 'white',
    borderColor: 'white',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

export default Input;

// filepath: components/TourismCMS/atoms/CMSInput.tsx
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import CMSText from './CMSText';

export interface CMSInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

/**
 * CMS Input Atom
 *
 * A standardized input component for TourismCMS forms.
 * Provides consistent styling and validation display.
 * Following Atomic Design principles as an atom.
 *
 * @param label - Input label text
 * @param error - Error message to display
 * @param hint - Help text for the input
 * @param required - Whether the field is required
 * @param containerStyle - Style for the container
 * @param inputStyle - Style for the input field
 */
const CMSInput: React.FC<CMSInputProps> = React.memo(
  ({
    label,
    error,
    hint,
    required = false,
    containerStyle,
    inputStyle,
    ...props
  }) => {
    const hasError = Boolean(error);

    return (
      <View style={[styles.container, containerStyle]}>
        
        {label && (
          <View style={styles.labelContainer}>
            <CMSText type="label" darkColor="#333" style={styles.label}>
              {label}
              {required && (
                <CMSText type="label" darkColor="#FF3B30">
                  
                  *
                </CMSText>
              )}
            </CMSText>
          </View>
        )}
        <TextInput
          style={[styles.input, hasError && styles.inputError, inputStyle]}
          placeholderTextColor="#999"
          {...props}
        />
        {error && (
          <CMSText type="caption" darkColor="#FF3B30" style={styles.errorText}>
            {error}
          </CMSText>
        )}
        {hint && !error && (
          <CMSText type="caption" darkColor="#666" style={styles.hintText}>
            {hint}
          </CMSText>
        )}
      </View>
    );
  }
);

CMSInput.displayName = 'CMSInput';

export default CMSInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    minHeight: 44,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    marginTop: 4,
  },
  hintText: {
    marginTop: 4,
  },
});


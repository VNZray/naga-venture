import { ThemedText } from '@/components/ThemedText';
import { EventFormData } from '@/types/event';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  data: EventFormData;
  setData: React.Dispatch<React.SetStateAction<EventFormData>>;
  errors: string[];
};

const ACCEPT = 'application/pdf,image/png,image/jpeg,image/jpg';

const StepEventPermits: React.FC<Props> = ({ data, setData, errors }) => {
  const permits = data.permits || {
    barangay_clearance: null,
    mayor_special_permit: null,
    fire_safety_certificate: null,
    sanitary_permit: null,
    zoning_clearance: null,
    others: [],
  };

  const isFieldError = (fieldName: string) => errors.includes(fieldName);

  const toAllowedMime = (file: File): 'application/pdf' | 'image/png' | 'image/jpeg' => {
    const t = file.type;
    if (t === 'application/pdf' || t === 'image/png' || t === 'image/jpeg') return t;
    if (file.name.toLowerCase().endsWith('.pdf')) return 'application/pdf';
    if (file.name.toLowerCase().endsWith('.png')) return 'image/png';
    return 'image/jpeg';
  };

  const onSelectSingle = (
    e: React.ChangeEvent<HTMLInputElement>,
    key:
      | 'barangay_clearance'
      | 'mayor_special_permit'
      | 'fire_safety_certificate'
      | 'sanitary_permit'
      | 'zoning_clearance'
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const next = {
      uri: URL.createObjectURL(file),
      name: file.name,
      mimeType: toAllowedMime(file),
      sizeBytes: file.size,
    };
    setData((prev) => ({
      ...prev,
      permits: {
        ...(prev.permits || {}),
        [key]: next,
      },
    }));
    // Allow choosing the same file again if needed
    if (e.target) e.target.value = '' as any;
  };

  const onRemoveSingle = (
    key:
      | 'barangay_clearance'
      | 'mayor_special_permit'
      | 'fire_safety_certificate'
      | 'sanitary_permit'
      | 'zoning_clearance'
  ) => {
    setData((prev) => ({
      ...prev,
      permits: {
        ...permits,
        [key]: null,
      },
    }));
  };

  const onSelectOthers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const mapped = Array.from(files).map((file) => ({
      uri: URL.createObjectURL(file),
      name: file.name,
      mimeType: toAllowedMime(file),
      sizeBytes: file.size,
    }));
    setData((prev) => ({
      ...prev,
      permits: {
        ...(prev.permits || { others: [] }),
        others: [ ...(prev.permits?.others || []), ...mapped ],
      },
    }));
    if (e.target) e.target.value = '' as any;
  };

  const removeOtherAt = (index: number) => {
    setData((prev) => ({
      ...prev,
      permits: {
        ...(prev.permits || { others: [] }),
        others: (prev.permits?.others || []).filter((_, i) => i !== index),
      },
    }));
  };

  const rows = useMemo(
    () => [
      {
        key: 'barangay_clearance' as const,
        label: 'Barangay Clearance (required)',
      },
      {
        key: 'mayor_special_permit' as const,
        label: 'Mayor’s Special Permit (required)',
      },
      {
        key: 'fire_safety_certificate' as const,
        label: 'Fire Safety Inspection Certificate (if applicable)',
      },
      { key: 'sanitary_permit' as const, label: 'Sanitary Permit (if applicable)' },
      {
        key: 'zoning_clearance' as const,
        label:
          'Locational/Zoning Clearance (if venue involves construction or special zoning)',
      },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <ThemedText type="title" darkColor="#000" style={{ marginBottom: 10 }}>
        Permits & Clearances
      </ThemedText>
      <ThemedText style={{ color: '#000', marginBottom: 15 }}>
        Please upload PDF, JPG, or PNG files.
      </ThemedText>

      {rows.map((r) => {
        const value = (permits as any)[r.key] as any | null;
        const errorKey = `permits.${r.key}`;
        const hasError = isFieldError(errorKey);
        return (
          <View key={r.key} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="subtitle" darkColor="#000">
                {r.label} {hasError && <ThemedText style={{ color: 'red' }}>*</ThemedText>}
              </ThemedText>
              {value ? (
                <View style={styles.fileRow}>
                  <Text style={styles.fileName}>{value.name}</Text>
                  <TouchableOpacity onPress={() => onRemoveSingle(r.key)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <input
                  type="file"
                  accept={ACCEPT}
                  onChange={(e) => onSelectSingle(e, r.key)}
                  style={styles.fileInput as any}
                />
              )}
              {hasError && (
                <ThemedText style={styles.errorText}>This document is required.</ThemedText>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.itemRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="subtitle" darkColor="#000">
            Others (optional) – Additional supporting documents
          </ThemedText>
          <input
            type="file"
            accept={ACCEPT}
            multiple
            onChange={onSelectOthers}
            style={styles.fileInput as any}
          />
          {(permits.others || []).length > 0 && (
            <View style={{ marginTop: 10 }}>
              {(permits.others || []).map((doc, idx) => (
                <View key={idx} style={styles.fileRow}>
                  <Text style={styles.fileName}>{doc.name}</Text>
                  <TouchableOpacity onPress={() => removeOtherAt(idx)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemRow: {
    marginBottom: 20,
  },
  fileRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileName: {
    color: '#000',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
  },
  fileInput: {
    marginTop: 8,
  },
});

export default StepEventPermits;


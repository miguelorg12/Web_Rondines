import { useState, useEffect } from 'react';

// Validadores basados en expresiones regulares para RondiTrack
// Diccionario de validaciones para formularios

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Expresiones regulares
const REGEX_PATTERNS = {
  // Usuarios
  CURP: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/,
  EMAIL: /^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{12,255}$/,
  CODE: /^\d{6}$/,
  BIOMETRIC: /^.{0,}$/,

  // Empresas y Sucursales
  PHONE: /^\d{10}$/,
  NAME: /^.{1,255}$/,
  ADDRESS: /^.{1,255}$/,

  // Planos y Checkpoints
  NFC_UID: /^.{0,}$/,
  IMAGE_URL: /^(https?:\/\/.*\.(jpeg|jpg|png)($|\?.*$)|data:image\/(jpeg|jpg|png);base64,[A-Za-z0-9+\/=]+|[\s\S]*)$/,
  COORDINATES: /^-?\d+$/,
  SEQUENCE: /^\d+$/,

  // Patrols y Turnos
  PATROL_NAME: /^(ronda_matutina|ronda_vespertina|ronda_nocturna)$/,
  FREQUENCY: /^(diaria|semanal|mensual)$/,
  SHIFT_NAME: /^(matutino|vespertino|nocturno)$/,
  PATROL_STATUS: /^(completado|pendiente|cancelado|en_progreso)$/,

  // Incidentes y Reportes
  INCIDENT_DESCRIPTION: /^.{1,255}$/,
  INCIDENT_STATUS: /^(reportado|en_revision|resuelto|descartado)$/,
  INCIDENT_SEVERITY: /^(baja|media|alta|critica)$/,
  REPORT_TYPE: /^(incidentes|asistencias|general)$/,

  // Textos generales
  GENERAL_TEXT: /^.{1,255}$/,
};

// Mensajes de error
const ERROR_MESSAGES = {
  CURP: "El CURP debe tener 18 caracteres en formato oficial (ej: GODE560427MDFLML09)",
  EMAIL: "Ingrese un email válido (ej: usuario@dominio.com)",
  PASSWORD: "La contraseña debe tener mínimo 12 caracteres, una mayúscula, una minúscula, un número y un símbolo",
  CODE: "El código debe tener exactamente 6 dígitos",
  PHONE: "El teléfono debe tener exactamente 10 dígitos",
  NAME: "El nombre debe tener entre 1 y 255 caracteres",
  ADDRESS: "La dirección debe tener entre 1 y 255 caracteres",
  REQUIRED: "Este campo es obligatorio",
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  PATTERN_MISMATCH: "Formato inválido",
};

// Validadores principales
export const validators = {
  // Validación de CURP
  validateCURP: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.CURP.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.CURP };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Email
  validateEmail: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.EMAIL.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.EMAIL };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Contraseña
  validatePassword: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.PASSWORD.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.PASSWORD };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Código de Verificación
  validateCode: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.CODE.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.CODE };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Teléfono
  validatePhone: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.PHONE.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.PHONE };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Nombre
  validateName: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.NAME.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.NAME };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Dirección
  validateAddress: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.ADDRESS.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.ADDRESS };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Texto General
  validateGeneralText: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.GENERAL_TEXT.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.NAME };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Coordenadas
  validateCoordinates: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.COORDINATES.test(value)) {
      return { isValid: false, message: "Las coordenadas deben ser números enteros" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Secuencia
  validateSequence: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.SEQUENCE.test(value)) {
      return { isValid: false, message: "La secuencia debe ser un número entero" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Tipo de Ronda
  validatePatrolName: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.PATROL_NAME.test(value)) {
      return { isValid: false, message: "Debe ser: ronda_matutina, ronda_vespertina o ronda_nocturna" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Frecuencia
  validateFrequency: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.FREQUENCY.test(value)) {
      return { isValid: false, message: "Debe ser: diaria, semanal o mensual" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Turno
  validateShiftName: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.SHIFT_NAME.test(value)) {
      return { isValid: false, message: "Debe ser: matutino, vespertino o nocturno" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Estado de Ronda
  validatePatrolStatus: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.PATROL_STATUS.test(value)) {
      return { isValid: false, message: "Debe ser: completado, pendiente, cancelado o en_progreso" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Descripción de Incidente
  validateIncidentDescription: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.INCIDENT_DESCRIPTION.test(value)) {
      return { isValid: false, message: ERROR_MESSAGES.ADDRESS };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Estado de Incidente
  validateIncidentStatus: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.INCIDENT_STATUS.test(value)) {
      return { isValid: false, message: "Debe ser: reportado, en_revision, resuelto o descartado" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Severidad de Incidente
  validateIncidentSeverity: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.INCIDENT_SEVERITY.test(value)) {
      return { isValid: false, message: "Debe ser: baja, media, alta o critica" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Tipo de Reporte
  validateReportType: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.REPORT_TYPE.test(value)) {
      return { isValid: false, message: "Debe ser: incidentes, asistencias o general" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de URL de Imagen
  validateImageUrl: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (!REGEX_PATTERNS.IMAGE_URL.test(value)) {
      return { isValid: false, message: "Debe ser una URL de imagen válida o datos Base64" };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Campo Requerido
  validateRequired: (value: string): ValidationResult => {
    if (!value || value.trim() === "") {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Campo Opcional (como el biométrico)
  validateOptional: (value: string): ValidationResult => {
    // Si está vacío, es válido (opcional)
    if (!value || value.trim() === "") {
      return { isValid: true, message: "" };
    }
    // Si tiene contenido, validar que no exceda 255 caracteres
    if (value.length > 255) {
      return { isValid: false, message: ERROR_MESSAGES.MAX_LENGTH(255) };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Campo Biométrico (siempre null/0)
  validateBiometric: (value: string): ValidationResult => {
    // El campo biométrico siempre es válido porque se envía como null/0
    return { isValid: true, message: "" };
  },

  // Validación de Longitud Mínima
  validateMinLength: (value: string, min: number): ValidationResult => {
    if (!value) {
      return { isValid: false, message: ERROR_MESSAGES.REQUIRED };
    }
    if (value.length < min) {
      return { isValid: false, message: ERROR_MESSAGES.MIN_LENGTH(min) };
    }
    return { isValid: true, message: "" };
  },

  // Validación de Longitud Máxima
  validateMaxLength: (value: string, max: number): ValidationResult => {
    if (!value) {
      return { isValid: true, message: "" };
    }
    if (value.length > max) {
      return { isValid: false, message: ERROR_MESSAGES.MAX_LENGTH(max) };
    }
    return { isValid: true, message: "" };
  },
};

// Hook personalizado para validación en tiempo real
export const useFieldValidation = (
  value: string,
  validator: (value: string) => ValidationResult,
  validateOnChange: boolean = true
) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (validateOnChange || touched) {
      const result = validator(value);
      setError(result.message);
    }
  }, [value, validator, validateOnChange, touched]);

  const handleBlur = () => {
    setTouched(true);
    const result = validator(value);
    setError(result.message);
  };

  return {
    error,
    isValid: !error,
    handleBlur,
    setTouched,
  };
};

// Función helper para validar formularios completos
export const validateForm = (fields: Record<string, string>, validators: Record<string, (value: string) => ValidationResult>) => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(fields).forEach(fieldName => {
    const validator = validators[fieldName];
    if (validator) {
      const result = validator(fields[fieldName]);
      if (!result.isValid) {
        errors[fieldName] = result.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// Función helper para preparar datos de usuario (incluye biométrico automático)
export const prepareUserData = (userData: Record<string, string>) => {
  return {
    ...userData,
    biometric: 0, // Siempre se envía como 0 (número)
  };
};

// Función helper para preparar datos de usuario con 0 hardcodeado
export const prepareUserDataWithZero = (userData: Record<string, string>) => {
  return {
    ...userData,
    biometric: 0, // Siempre se envía como 0
  };
};

export default validators; 
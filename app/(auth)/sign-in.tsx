import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';

export default function SignInScreen() {
  const { colors, fonts } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signIn({ email: email.trim(), password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please check your email and confirm your account' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.cosmic}
      style={styles.container}
    >
      <StarField />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.welcomeText, { color: colors.text, fontFamily: fonts.title }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                The cosmic realm awaits your return
              </Text>
            </View>

            {/* Sign In Form */}
            <MysticalCard style={styles.formCard}>
              <Text style={[styles.formTitle, { color: colors.text, fontFamily: fonts.title }]}>
                Sign In to Your Oracle
              </Text>

              {/* General Error */}
              {errors.general && (
                <View style={[styles.errorContainer, { backgroundColor: colors.error + '20', borderColor: colors.error + '40' }]}>
                  <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.general}
                  </Text>
                </View>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontFamily: fonts.body }]}>
                  Email
                </Text>
                <View style={[
                  styles.inputWrapper,
                  { borderColor: errors.email ? colors.error : colors.border }
                ]}>
                  <Mail color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text, fontFamily: fonts.body }]}
                    placeholder="Enter your mystical email"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.email && (
                  <Text style={[styles.fieldError, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontFamily: fonts.body }]}>
                  Password
                </Text>
                <View style={[
                  styles.inputWrapper,
                  { borderColor: errors.password ? colors.error : colors.border }
                ]}>
                  <Lock color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text, fontFamily: fonts.body }]}
                    placeholder="Enter your secret incantation"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff color={colors.textSecondary} size={20} />
                    ) : (
                      <Eye color={colors.textSecondary} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={[styles.fieldError, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* Sign In Button */}
              <MagicalButton
                title={loading ? "Entering the Realm..." : "Enter the Oracle's Chamber"}
                onPress={handleSignIn}
                disabled={loading}
                variant="golden"
                size="large"
                style={styles.signInButton}
                glowing={!loading}
              />

              {/* Sign Up Link */}
              <View style={styles.linkContainer}>
                <Text style={[styles.linkText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  New to the mystical realm?{' '}
                </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text style={[styles.linkButton, { color: colors.accent, fontFamily: fonts.body }]}>
                      Begin Your Journey
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </MysticalCard>

            {/* Mystical Elements */}
            <View style={styles.mysticalElements}>
              <Text style={styles.mysticalSymbol}>✨</Text>
              <Text style={styles.mysticalSymbol}>🔮</Text>
              <Text style={styles.mysticalSymbol}>✨</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  formCard: {
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  signInButton: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    minWidth: '80%',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: 14,
  },
  linkButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  mysticalElements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  mysticalSymbol: {
    fontSize: 24,
    opacity: 0.6,
  },
});
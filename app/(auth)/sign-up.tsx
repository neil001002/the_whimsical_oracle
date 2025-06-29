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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';

export default function SignUpScreen() {
  const { colors, fonts } = useTheme();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp({
        email: email.trim(),
        password,
        username: username.trim(),
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ general: 'An account with this email already exists' });
        } else if (error.message.includes('Password should be')) {
          setErrors({ password: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        // Navigate to onboarding
        router.replace('/(auth)/onboarding');
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
                Begin Your Journey
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                Join the mystical realm of cosmic wisdom
              </Text>
            </View>

            {/* Sign Up Form */}
            <MysticalCard style={styles.formCard}>
              <Text style={[styles.formTitle, { color: colors.text, fontFamily: fonts.title }]}>
                Create Your Oracle Account
              </Text>

              {/* General Error */}
              {errors.general && (
                <View style={[styles.errorContainer, { backgroundColor: colors.error + '20', borderColor: colors.error + '40' }]}>
                  <Text style={[styles.errorText, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.general}
                  </Text>
                </View>
              )}

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontFamily: fonts.body }]}>
                  Mystical Username
                </Text>
                <View style={[
                  styles.inputWrapper,
                  { borderColor: errors.username ? colors.error : colors.border }
                ]}>
                  <User color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text, fontFamily: fonts.body }]}
                    placeholder="Choose your mystical identity"
                    placeholderTextColor={colors.textSecondary}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username) setErrors({ ...errors, username: undefined });
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.username && (
                  <Text style={[styles.fieldError, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.username}
                  </Text>
                )}
              </View>

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
                    placeholder="Enter your cosmic email"
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
                    placeholder="Create your secret incantation"
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

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontFamily: fonts.body }]}>
                  Confirm Password
                </Text>
                <View style={[
                  styles.inputWrapper,
                  { borderColor: errors.confirmPassword ? colors.error : colors.border }
                ]}>
                  <Lock color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.textInput, { color: colors.text, fontFamily: fonts.body }]}
                    placeholder="Confirm your secret incantation"
                    placeholderTextColor={colors.textSecondary}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff color={colors.textSecondary} size={20} />
                    ) : (
                      <Eye color={colors.textSecondary} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={[styles.fieldError, { color: colors.error, fontFamily: fonts.body }]}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              {/* Sign Up Button */}
              <MagicalButton
                title={loading ? "Creating Your Mystical Account..." : "Enter the Mystical Realm"}
                onPress={handleSignUp}
                disabled={loading}
                variant="golden"
                size="large"
                style={styles.signUpButton}
                glowing={!loading}
              />

              {/* Sign In Link */}
              <View style={styles.linkContainer}>
                <Text style={[styles.linkText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                  Already have an oracle account?{' '}
                </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text style={[styles.linkButton, { color: colors.accent, fontFamily: fonts.body }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </MysticalCard>

            {/* Mystical Elements */}
            <View style={styles.mysticalElements}>
              <Text style={styles.mysticalSymbol}>🌟</Text>
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
  signUpButton: {
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
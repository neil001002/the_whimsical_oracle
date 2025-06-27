import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { StarField } from '@/components/ui/StarField';

export default function NotFoundScreen() {
  const { colors, fonts, spacing } = useTheme();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StarField />
        <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
          Mystical Void
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary, fontFamily: fonts.body }]}>
          The cosmic energies couldn't find this page in the celestial tapestry
        </Text>
        <Link href="/" style={[styles.link, { borderColor: colors.accent }]}>
          <Text style={[styles.linkText, { color: colors.accent, fontFamily: fonts.body }]}>
            Return to the Oracle's Chamber
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
    maxWidth: '80%',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderRadius: 30,
  },
  linkText: {
    fontSize: 16,
  },
});
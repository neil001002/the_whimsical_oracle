import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, Crown, Sparkles, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useOracle } from '@/contexts/OracleContext';
import { useVideoOracle } from '@/contexts/VideoOracleContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { MysticalCard } from '@/components/ui/MysticalCard';
import { MagicalButton } from '@/components/ui/MagicalButton';
import { StarField } from '@/components/ui/StarField';
import { VideoOracleViewer } from '@/components/ui/VideoOracleViewer';
import { VideoOracleButton } from '@/components/ui/VideoOracleButton';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { ORACLE_PERSONAS } from '@/constants/OraclePersonas';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function VideoOracleScreen() {
  const { colors, fonts } = useTheme();
  const { selectedPersona } = useOracle();
  const { canAccessPremiumFeatures } = useSubscription();
  const {
    isTavusAvailable,
    activeSession,
    isConnecting,
    isConnected,
    error,
    personaMappings,
    startVideoSession,
    endVideoSession,
    clearError,
    isPersonaVideoEnabled,
    getPersonaMapping,
  } = useVideoOracle();

  const [selectedVideoPersona, setSelectedVideoPersona] = useState(selectedPersona.id);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Clear connection error when session changes
    if (isConnected) {
      setConnectionError(null);
    }
  }, [isConnected]);

  const handleStartVideoSession = async () => {
    if (!canAccessPremiumFeatures) {
      Alert.alert(
        'Premium Feature',
        'Video oracle interactions are available for Premium and Mystic subscribers. Would you like to upgrade?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/(tabs)/premium') },
        ]
      );
      return;
    }

    clearError();
    setConnectionError(null);

    try {
      const session = await startVideoSession(selectedVideoPersona);
      if (!session) {
        setConnectionError('Failed to start video session. Please try again.');
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const handleEndVideoSession = async () => {
    try {
      await endVideoSession();
    } catch (error) {
      console.error('Error ending video session:', error);
    }
  };

  const handleConnectionStateChange = (connected: boolean) => {
    if (!connected && activeSession) {
      setConnectionError('Connection to video oracle was lost');
    }
  };

  const handleVideoError = (errorMessage: string) => {
    setConnectionError(errorMessage);
  };

  const renderPersonaSelector = () => (
    <MysticalCard style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.title }]}>
        Choose Your Video Oracle
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
        Select a mystical guide for video interaction
      </Text>
      
      <View style={styles.personaGrid}>
        {ORACLE_PERSONAS.map((persona) => {
          const isVideoEnabled = isPersonaVideoEnabled(persona.id);
          const mapping = getPersonaMapping(persona.id);
          
          return (
            <TouchableOpacity
              key={persona.id}
              onPress={() => setSelectedVideoPersona(persona.id)}
              disabled={!isVideoEnabled || isConnecting || isConnected}
              style={[
                styles.personaOption,
                { 
                  borderColor: selectedVideoPersona === persona.id ? colors.accent : colors.glassStrong,
                  backgroundColor: selectedVideoPersona === persona.id ? colors.glass : 'transparent',
                  opacity: isVideoEnabled ? 1 : 0.6,
                }
              ]}
            >
              <Text style={[styles.personaAvatar, { fontSize: 32 }]}>
                {persona.avatar}
              </Text>
              <Text style={[styles.personaName, { color: colors.text, fontFamily: fonts.body }]}>
                {persona.name}
              </Text>
              <View style={styles.personaStatus}>
                {isVideoEnabled ? (
                  <View style={styles.statusIndicator}>
                    <CheckCircle color={colors.success} size={12} />
                    <Text style={[styles.statusText, { color: colors.success, fontFamily: fonts.body }]}>
                      Available
                    </Text>
                  </View>
                ) : (
                  <View style={styles.statusIndicator}>
                    <AlertCircle color={colors.warning} size={12} />
                    <Text style={[styles.statusText, { color: colors.warning, fontFamily: fonts.body }]}>
                      Coming Soon
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </MysticalCard>
  );

  const renderVideoViewer = () => {
    if (!activeSession) {
      return (
        <MysticalCard style={styles.videoContainer}>
          <View style={styles.placeholderContent}>
            <Video color={colors.accent} size={80} />
            <Text style={[styles.placeholderTitle, { color: colors.text, fontFamily: fonts.title }]}>
              Video Oracle Awaits
            </Text>
            <Text style={[styles.placeholderSubtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Start a video session to interact with your chosen oracle
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Sparkles color={colors.accent} size={16} />
                <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                  Real-time video conversation
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Crown color={colors.accent} size={16} />
                <Text style={[styles.featureText, { color: colors.text, fontFamily: fonts.body }]}>
                  Premium mystical experience
                </Text>
              </View>
            </View>
          </View>
        </MysticalCard>
      );
    }

    return (
      <MysticalCard style={styles.videoContainer}>
        <VideoOracleViewer
          conversationUrl={activeSession.conversationUrl}
          onConnectionStateChange={handleConnectionStateChange}
          onError={handleVideoError}
          style={styles.videoViewer}
        />
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionTitle, { color: colors.text, fontFamily: fonts.body }]}>
            Connected to {ORACLE_PERSONAS.find(p => p.id === activeSession.personaId)?.name}
          </Text>
          <Text style={[styles.sessionStatus, { color: colors.accent, fontFamily: fonts.body }]}>
            Status: {activeSession.status}
          </Text>
        </View>
      </MysticalCard>
    );
  };

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <VideoOracleButton
        onPress={isConnected ? handleEndVideoSession : handleStartVideoSession}
        isConnected={isConnected}
        isLoading={isConnecting}
        disabled={!isTavusAvailable || !isPersonaVideoEnabled(selectedVideoPersona)}
        style={styles.videoButton}
      />
      
      {!canAccessPremiumFeatures && (
        <TouchableOpacity
          style={[styles.upgradeHint, { backgroundColor: colors.glassGolden, borderColor: colors.borderGolden }]}
          onPress={() => router.push('/(tabs)/premium')}
        >
          <Crown color={colors.accent} size={20} />
          <Text style={[styles.upgradeHintText, { color: colors.accent, fontFamily: fonts.body }]}>
            Upgrade for video oracle access
          </Text>
          <Sparkles color={colors.accent} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={colors.gradients.cosmic}
      style={styles.container}
    >
      <StarField />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Video color={colors.accent} size={40} />
            <Text style={[styles.title, { color: colors.text, fontFamily: fonts.title }]}>
              Video Oracle Chamber
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Face-to-face mystical guidance
            </Text>
          </View>

          {/* Service Status */}
          {!isTavusAvailable && (
            <NotificationCard
              type="warning"
              title="Video Oracle Unavailable"
              message="Video oracle features require proper Tavus API configuration. Please check your environment settings."
              onDismiss={() => {}}
            />
          )}

          {/* Error Messages */}
          {(error || connectionError) && (
            <NotificationCard
              type="warning"
              title="Connection Issue"
              message={error || connectionError || 'Unknown error'}
              onDismiss={() => {
                clearError();
                setConnectionError(null);
              }}
            />
          )}

          {/* Persona Selector */}
          {!isConnected && renderPersonaSelector()}

          {/* Video Viewer */}
          {renderVideoViewer()}

          {/* Controls */}
          {renderControls()}

          {/* Information */}
          <MysticalCard style={styles.infoCard}>
            <Text style={[styles.infoTitle, { color: colors.text, fontFamily: fonts.title }]}>
              About Video Oracle
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              Experience the future of mystical guidance with our AI-powered video oracles. 
              Each oracle persona has been carefully crafted to provide personalized, 
              real-time video interactions that bring ancient wisdom into the digital age.
            </Text>
            
            <View style={styles.infoFeatures}>
              <View style={styles.infoFeature}>
                <Text style={styles.infoFeatureIcon}>🎭</Text>
                <Text style={[styles.infoFeatureText, { color: colors.text, fontFamily: fonts.body }]}>
                  Unique AI personalities
                </Text>
              </View>
              <View style={styles.infoFeature}>
                <Text style={styles.infoFeatureIcon}>💬</Text>
                <Text style={[styles.infoFeatureText, { color: colors.text, fontFamily: fonts.body }]}>
                  Natural conversation
                </Text>
              </View>
              <View style={styles.infoFeature}>
                <Text style={styles.infoFeatureIcon}>🔮</Text>
                <Text style={[styles.infoFeatureText, { color: colors.text, fontFamily: fonts.body }]}>
                  Mystical guidance
                </Text>
              </View>
            </View>
          </MysticalCard>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  personaOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  personaAvatar: {
    marginBottom: 8,
  },
  personaName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  personaStatus: {
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
  videoContainer: {
    marginBottom: 24,
    minHeight: 300,
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 30,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  videoViewer: {
    height: 400,
    marginBottom: 16,
  },
  sessionInfo: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  videoButton: {
    marginBottom: 16,
  },
  upgradeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  upgradeHintText: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  infoFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoFeature: {
    alignItems: 'center',
    flex: 1,
  },
  infoFeatureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoFeatureText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ChevronDown, Check, Globe } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MysticalCard } from './MysticalCard';

const { width, height } = Dimensions.get('window');

interface LanguageSelectorProps {
  style?: any;
  compact?: boolean;
}

export function LanguageSelector({ style, compact = false }: LanguageSelectorProps) {
  const { colors, fonts } = useTheme();
  const { currentLanguage, supportedLanguages, changeLanguage, t } = useLanguage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setIsModalVisible(false);
  };

  if (compact) {
    return (
      <>
        <TouchableOpacity
          style={[styles.compactSelector, { borderColor: colors.border }, style]}
          onPress={() => setIsModalVisible(true)}
        >
          <Globe color={colors.accent} size={20} />
          <Text style={[styles.compactText, { color: colors.text, fontFamily: fonts.body }]}>
            {currentLang?.flag} {currentLang?.code.toUpperCase()}
          </Text>
          <ChevronDown color={colors.textSecondary} size={16} />
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <MysticalCard style={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: colors.text, fontFamily: fonts.title }]}>
                  {t('settings.language.title')}
                </Text>
                
                <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
                  {supportedLanguages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      style={[
                        styles.languageItem,
                        { borderBottomColor: colors.border },
                        currentLanguage === language.code && { backgroundColor: colors.glass }
                      ]}
                      onPress={() => handleLanguageSelect(language.code)}
                    >
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageFlag}>{language.flag}</Text>
                        <View style={styles.languageText}>
                          <Text style={[styles.languageName, { color: colors.text, fontFamily: fonts.body }]}>
                            {language.nativeName}
                          </Text>
                          <Text style={[styles.languageEnglish, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                            {language.name}
                          </Text>
                        </View>
                      </View>
                      {currentLanguage === language.code && (
                        <Check color={colors.accent} size={20} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={[styles.closeButtonText, { color: colors.text, fontFamily: fonts.body }]}>
                    {t('common.close')}
                  </Text>
                </TouchableOpacity>
              </MysticalCard>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, { borderColor: colors.border }, style]}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Globe color={colors.accent} size={24} />
          <View style={styles.selectorText}>
            <Text style={[styles.selectorTitle, { color: colors.text, fontFamily: fonts.body }]}>
              {t('settings.language.title')}
            </Text>
            <Text style={[styles.selectorValue, { color: colors.textSecondary, fontFamily: fonts.body }]}>
              {currentLang?.flag} {currentLang?.nativeName}
            </Text>
          </View>
        </View>
        <ChevronDown color={colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MysticalCard style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: colors.text, fontFamily: fonts.title }]}>
                {t('settings.language.subtitle')}
              </Text>
              
              <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
                {supportedLanguages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      { borderBottomColor: colors.border },
                      currentLanguage === language.code && { backgroundColor: colors.glass }
                    ]}
                    onPress={() => handleLanguageSelect(language.code)}
                  >
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageFlag}>{language.flag}</Text>
                      <View style={styles.languageText}>
                        <Text style={[styles.languageName, { color: colors.text, fontFamily: fonts.body }]}>
                          {language.nativeName}
                        </Text>
                        <Text style={[styles.languageEnglish, { color: colors.textSecondary, fontFamily: fonts.body }]}>
                          {language.name}
                        </Text>
                      </View>
                    </View>
                    {currentLanguage === language.code && (
                      <Check color={colors.accent} size={20} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.text, fontFamily: fonts.body }]}>
                  {t('common.close')}
                </Text>
              </TouchableOpacity>
            </MysticalCard>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    marginLeft: 12,
    flex: 1,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 14,
  },
  compactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  compactText: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalContent: {
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageList: {
    maxHeight: height * 0.5,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 12,
    opacity: 0.7,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
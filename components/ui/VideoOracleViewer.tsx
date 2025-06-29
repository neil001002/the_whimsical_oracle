import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/contexts/ThemeContext';

interface VideoOracleViewerProps {
  conversationUrl: string;
  onConnectionStateChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export function VideoOracleViewer({
  conversationUrl,
  onConnectionStateChange,
  onError,
  style,
}: VideoOracleViewerProps) {
  const { colors } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inject JavaScript to handle Tavus events
  const injectedJavaScript = `
    (function() {
      // Listen for Tavus conversation events
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type) {
          switch(event.data.type) {
            case 'tavus_conversation_started':
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'connection_state_changed',
                connected: true
              }));
              break;
            case 'tavus_conversation_ended':
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'connection_state_changed',
                connected: false
              }));
              break;
            case 'tavus_error':
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: event.data.message || 'Video oracle error'
              }));
              break;
          }
        }
      });

      // Override console.log to capture Tavus logs
      const originalLog = console.log;
      console.log = function(...args) {
        originalLog.apply(console, args);
        if (args[0] && typeof args[0] === 'string') {
          if (args[0].includes('Tavus') || args[0].includes('conversation')) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'log',
              message: args.join(' ')
            }));
          }
        }
      };

      // Signal that the page is ready
      setTimeout(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'page_ready'
        }));
      }, 1000);
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'connection_state_changed':
          onConnectionStateChange?.(data.connected);
          break;
        case 'error':
          onError?.(data.message);
          break;
        case 'page_ready':
          setIsLoading(false);
          break;
        case 'log':
          console.log('Tavus WebView:', data.message);
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError?.(`Failed to load video oracle: ${nativeEvent.description}`);
    setIsLoading(false);
  };

  if (Platform.OS === 'web') {
    // For web platform, use iframe
    return (
      <View style={[styles.container, style]}>
        <iframe
          src={conversationUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 16,
            backgroundColor: colors.surface,
          }}
          allow="camera; microphone; autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onLoad={() => {
            setIsLoading(false);
            onConnectionStateChange?.(true);
          }}
          onError={() => {
            onError?.('Failed to load video oracle');
            setIsLoading(false);
          }}
        />
        {isLoading && (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
            <View style={[styles.loadingIndicator, { borderColor: colors.accent }]} />
          </View>
        )}
      </View>
    );
  }

  // For mobile platforms, use WebView
  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ uri: conversationUrl }}
        style={[styles.webView, { backgroundColor: colors.surface }]}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        originWhitelist={['*']}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
            <View style={[styles.loadingIndicator, { borderColor: colors.accent }]} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderRadius: 20,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
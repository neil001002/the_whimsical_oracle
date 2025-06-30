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

  // Inject JavaScript to handle Tavus events and bypass some restrictions
  const injectedJavaScript = `
    (function() {
      // Override console methods to capture logs
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'log',
          level: 'info',
          message: args.join(' ')
        }));
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'log',
          level: 'error',
          message: args.join(' ')
        }));
      };

      // Handle iframe load events
      window.addEventListener('load', function() {
        console.log('Tavus iframe loaded successfully');
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'connection_state_changed',
          connected: true
        }));
      });

      // Handle errors
      window.addEventListener('error', function(event) {
        console.error('Tavus iframe error:', event.error);
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'error',
          message: event.error?.message || 'Unknown iframe error'
        }));
      });

      // Try to detect when the conversation starts
      let checkInterval = setInterval(function() {
        // Look for Tavus-specific elements or events
        if (document.querySelector('[data-testid="video-container"]') || 
            document.querySelector('.daily-video-element') ||
            document.querySelector('video')) {
          console.log('Video element detected - conversation likely started');
          window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'conversation_started'
          }));
          clearInterval(checkInterval);
        }
      }, 1000);

      // Clear interval after 30 seconds to avoid infinite checking
      setTimeout(function() {
        clearInterval(checkInterval);
      }, 30000);

      // Signal that the script is ready
      setTimeout(() => {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'script_ready'
        }));
      }, 500);
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'connection_state_changed':
          onConnectionStateChange?.(data.connected);
          if (data.connected) {
            setIsLoading(false);
          }
          break;
        case 'conversation_started':
          console.log('Tavus conversation started');
          onConnectionStateChange?.(true);
          setIsLoading(false);
          break;
        case 'error':
          console.error('Tavus error:', data.message);
          onError?.(data.message);
          setIsLoading(false);
          break;
        case 'script_ready':
          console.log('Tavus script ready');
          setIsLoading(false);
          break;
        case 'log':
          if (data.level === 'error') {
            console.error('Tavus WebView:', data.message);
          } else {
            console.log('Tavus WebView:', data.message);
          }
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleLoadEnd = () => {
    console.log('WebView load ended');
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError?.(`Failed to load video oracle: ${nativeEvent.description}`);
    setIsLoading(false);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error:', nativeEvent);
    onError?.(`HTTP error loading video oracle: ${nativeEvent.statusCode}`);
    setIsLoading(false);
  };

  if (Platform.OS === 'web') {
    // For web platform, use iframe with enhanced security settings
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
          allow="camera; microphone; autoplay; encrypted-media; fullscreen; display-capture"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation-by-user-activation"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            console.log('Iframe loaded successfully');
            setIsLoading(false);
            onConnectionStateChange?.(true);
          }}
          onError={(e) => {
            console.error('Iframe error:', e);
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

  // For mobile platforms, use WebView with enhanced settings
  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ 
          uri: conversationUrl,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
          }
        }}
        style={[styles.webView, { backgroundColor: colors.surface }]}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleHttpError}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mixedContentMode="compatibility"
        originWhitelist={['*']}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        // Enhanced security and compatibility settings
        allowsBackForwardNavigationGestures={false}
        allowsLinkPreview={false}
        dataDetectorTypes="none"
        decelerationRate="normal"
        // Allow camera and microphone access
        allowsProtectedMedia={true}
        // Additional headers for better compatibility
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
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
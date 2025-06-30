import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
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
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Enhanced injected JavaScript for better Tavus integration
  const injectedJavaScript = `
    (function() {
      // Enhanced logging
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'log',
            level: 'info',
            message: args.join(' ')
          }));
        }
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'log',
            level: 'error',
            message: args.join(' ')
          }));
        }
      };

      console.warn = function(...args) {
        originalWarn.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'log',
            level: 'warn',
            message: args.join(' ')
          }));
        }
      };

      // Override fetch to monitor API calls
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        console.log('Fetch request:', args[0]);
        return originalFetch.apply(this, args)
          .then(response => {
            console.log('Fetch response:', response.status, response.url);
            return response;
          })
          .catch(error => {
            console.error('Fetch error:', error);
            throw error;
          });
      };

      // Monitor for Daily.co iframe creation and connection
      let dailyCheckInterval;
      let connectionTimeout;

      function checkForDailyConnection() {
        // Look for Daily.co iframe or video elements
        const dailyIframe = document.querySelector('iframe[src*="daily.co"]');
        const videoElements = document.querySelectorAll('video');
        const dailyContainer = document.querySelector('[data-testid*="daily"]') || 
                             document.querySelector('.daily-video-element') ||
                             document.querySelector('[class*="daily"]');

        if (dailyIframe) {
          console.log('Daily.co iframe detected:', dailyIframe.src);
          
          // Check if iframe is blocked
          dailyIframe.onload = function() {
            console.log('Daily.co iframe loaded successfully');
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'daily_iframe_loaded'
              }));
            }
          };

          dailyIframe.onerror = function(error) {
            console.error('Daily.co iframe failed to load:', error);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Daily.co iframe failed to load - connection refused'
              }));
            }
          };
        }

        if (videoElements.length > 0) {
          console.log('Video elements detected:', videoElements.length);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'video_detected',
              count: videoElements.length
            }));
          }
        }

        if (dailyContainer) {
          console.log('Daily container detected');
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'daily_container_detected'
            }));
          }
        }
      }

      // Start checking for Daily.co elements
      dailyCheckInterval = setInterval(checkForDailyConnection, 1000);

      // Set a timeout for connection
      connectionTimeout = setTimeout(function() {
        clearInterval(dailyCheckInterval);
        console.warn('Connection timeout - no Daily.co elements detected');
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'connection_timeout'
          }));
        }
      }, 30000);

      // Handle page load
      window.addEventListener('load', function() {
        console.log('Tavus page loaded');
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'page_loaded'
          }));
        }
        checkForDailyConnection();
      });

      // Handle errors
      window.addEventListener('error', function(event) {
        console.error('Page error:', event.error, event.message);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: event.error?.message || event.message || 'Unknown page error'
          }));
        }
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: 'Promise rejection: ' + (event.reason?.message || event.reason)
          }));
        }
      });

      // Try to bypass some iframe restrictions
      try {
        // Remove X-Frame-Options if present
        const metaTags = document.querySelectorAll('meta[http-equiv="X-Frame-Options"]');
        metaTags.forEach(tag => tag.remove());
        
        // Add meta tag to allow framing
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Frame-Options';
        meta.content = 'ALLOWALL';
        document.head.appendChild(meta);
      } catch (e) {
        console.log('Could not modify frame options:', e);
      }

      // Signal script is ready
      setTimeout(() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'script_ready'
          }));
        }
      }, 1000);

      // Cleanup function
      window.addEventListener('beforeunload', function() {
        clearInterval(dailyCheckInterval);
        clearTimeout(connectionTimeout);
      });
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'page_loaded':
          console.log('Tavus page loaded successfully');
          setIsLoading(false);
          break;
        case 'daily_iframe_loaded':
          console.log('Daily.co iframe loaded successfully');
          onConnectionStateChange?.(true);
          setConnectionError(null);
          break;
        case 'video_detected':
          console.log(`Video elements detected: ${data.count}`);
          onConnectionStateChange?.(true);
          setConnectionError(null);
          break;
        case 'daily_container_detected':
          console.log('Daily container detected');
          onConnectionStateChange?.(true);
          setConnectionError(null);
          break;
        case 'connection_timeout':
          console.warn('Connection timeout - Daily.co elements not detected');
          setConnectionError('Connection timeout - video chat may not be available');
          onError?.('Connection timeout - please try refreshing');
          break;
        case 'error':
          console.error('Tavus error:', data.message);
          if (data.message.includes('refused to connect') || data.message.includes('daily.co')) {
            setConnectionError('Video chat connection blocked - this may be due to browser security settings');
            onError?.('Video chat connection was blocked. Please try opening in a new window or check your browser settings.');
          } else {
            onError?.(data.message);
          }
          setIsLoading(false);
          break;
        case 'script_ready':
          console.log('Tavus script ready');
          break;
        case 'log':
          if (data.level === 'error') {
            console.error('Tavus WebView:', data.message);
          } else if (data.level === 'warn') {
            console.warn('Tavus WebView:', data.message);
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
    setConnectionError('Failed to load video oracle');
    onError?.(`Failed to load video oracle: ${nativeEvent.description}`);
    setIsLoading(false);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error:', nativeEvent);
    setConnectionError(`HTTP error: ${nativeEvent.statusCode}`);
    onError?.(`HTTP error loading video oracle: ${nativeEvent.statusCode}`);
    setIsLoading(false);
  };

  // Function to open in external browser as fallback
  const openInExternalBrowser = () => {
    if (Platform.OS === 'web') {
      window.open(conversationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (Platform.OS === 'web') {
    // For web platform, use iframe with maximum compatibility settings
    return (
      <View style={[styles.container, style]}>
        {connectionError ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.errorTitle, { color: colors.error }]}>
              Connection Issue
            </Text>
            <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
              {connectionError}
            </Text>
            <Text style={[styles.errorSuggestion, { color: colors.textSecondary }]}>
              Try opening the video chat in a new window:
            </Text>
            <button
              onClick={openInExternalBrowser}
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '12px',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Open in New Window
            </button>
          </View>
        ) : (
          <>
            <iframe
              src={conversationUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: 16,
                backgroundColor: colors.surface,
              }}
              allow="camera *; microphone *; autoplay *; encrypted-media *; fullscreen *; display-capture *; geolocation *; gyroscope *; accelerometer *; magnetometer *; payment *; usb *"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation allow-top-navigation-by-user-activation allow-downloads"
              referrerPolicy="no-referrer-when-downgrade"
              loading="eager"
              onLoad={() => {
                console.log('Iframe loaded successfully');
                setIsLoading(false);
                // Don't immediately set connected state, wait for Daily.co detection
              }}
              onError={(e) => {
                console.error('Iframe error:', e);
                setConnectionError('Failed to load video oracle iframe');
                onError?.('Failed to load video oracle');
                setIsLoading(false);
              }}
            />
            {isLoading && (
              <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
                <View style={[styles.loadingIndicator, { borderColor: colors.accent }]} />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                  Connecting to video oracle...
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  }

  // For mobile platforms, use WebView with enhanced settings
  return (
    <View style={[styles.container, style]}>
      {connectionError ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.errorTitle, { color: colors.error }]}>
            Connection Issue
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            {connectionError}
          </Text>
          <Text style={[styles.errorSuggestion, { color: colors.textSecondary }]}>
            Please try again or contact support if the issue persists.
          </Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ 
            uri: conversationUrl,
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
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
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false}
          dataDetectorTypes="none"
          decelerationRate="normal"
          allowsProtectedMedia={true}
          // Enhanced user agent for better compatibility
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
          // Additional props for better iframe support
          cacheEnabled={false}
          incognito={false}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          renderLoading={() => (
            <View style={[styles.loadingOverlay, { backgroundColor: colors.surface }]}>
              <View style={[styles.loadingIndicator, { borderColor: colors.accent }]} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Connecting to video oracle...
              </Text>
            </View>
          )}
        />
      )}
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
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorSuggestion: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
});
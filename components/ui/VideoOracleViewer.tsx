import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react-native';
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
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Enhanced injected JavaScript with better Daily.co detection
  const injectedJavaScript = `
    (function() {
      let connectionCheckInterval;
      let connectionTimeout;
      let hasConnected = false;
      
      // Enhanced logging
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = function(...args) {
        originalLog.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'log',
            message: args.join(' ')
          }));
        }
      };
      
      console.error = function(...args) {
        originalError.apply(console, args);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: args.join(' ')
          }));
        }
      };

      // Function to check for video connection
      function checkVideoConnection() {
        try {
          // Check for various indicators of successful video connection
          const videoElements = document.querySelectorAll('video');
          const dailyIframes = document.querySelectorAll('iframe[src*="daily.co"], iframe[src*="daily"]');
          const canvasElements = document.querySelectorAll('canvas');
          const mediaElements = document.querySelectorAll('[data-testid*="video"], [class*="video"], [id*="video"]');
          
          // Check for Daily.co specific elements
          const dailyContainers = document.querySelectorAll(
            '[class*="daily"], [id*="daily"], [data-daily], .DailyIframe, #daily-iframe'
          );
          
          // Check for Tavus specific elements
          const tavusElements = document.querySelectorAll(
            '[class*="tavus"], [id*="tavus"], [data-tavus]'
          );

          console.log('Connection check:', {
            videos: videoElements.length,
            iframes: dailyIframes.length,
            canvas: canvasElements.length,
            media: mediaElements.length,
            daily: dailyContainers.length,
            tavus: tavusElements.length
          });

          // Check if any video elements have actual video streams
          let hasActiveVideo = false;
          videoElements.forEach(video => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              hasActiveVideo = true;
              console.log('Active video detected:', video.videoWidth, 'x', video.videoHeight);
            }
          });

          // Check iframe accessibility
          let iframeAccessible = false;
          dailyIframes.forEach(iframe => {
            try {
              // Try to access iframe content (will fail if blocked)
              if (iframe.contentWindow) {
                iframeAccessible = true;
                console.log('Iframe accessible');
              }
            } catch (e) {
              console.log('Iframe blocked by CORS:', e.message);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'iframe_blocked',
                  message: 'Daily.co iframe blocked by CORS policy'
                }));
              }
            }
          });

          // Determine connection status
          const isConnected = hasActiveVideo || 
                             (dailyIframes.length > 0 && iframeAccessible) ||
                             videoElements.length > 0 ||
                             dailyContainers.length > 0 ||
                             tavusElements.length > 0;

          if (isConnected && !hasConnected) {
            hasConnected = true;
            console.log('Video connection established');
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'connection_established',
                hasVideo: hasActiveVideo,
                hasIframe: dailyIframes.length > 0,
                hasContainers: dailyContainers.length > 0
              }));
            }
            clearInterval(connectionCheckInterval);
            clearTimeout(connectionTimeout);
          }

          return isConnected;
        } catch (error) {
          console.error('Error checking video connection:', error);
          return false;
        }
      }

      // Start connection monitoring
      function startConnectionMonitoring() {
        console.log('Starting connection monitoring...');
        
        connectionCheckInterval = setInterval(checkVideoConnection, 2000);
        
        // Set timeout for connection failure
        connectionTimeout = setTimeout(() => {
          if (!hasConnected) {
            console.warn('Connection timeout - no video elements detected');
            clearInterval(connectionCheckInterval);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'connection_timeout',
                message: 'Video connection timeout - Daily.co may be blocked'
              }));
            }
          }
        }, 15000);
      }

      // Handle page events
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('DOM loaded');
          setTimeout(startConnectionMonitoring, 1000);
        });
      } else {
        console.log('DOM already loaded');
        setTimeout(startConnectionMonitoring, 1000);
      }

      // Monitor for dynamic content changes
      if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
          let shouldCheck = false;
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                  const element = node;
                  if (element.tagName === 'VIDEO' || 
                      element.tagName === 'IFRAME' || 
                      element.tagName === 'CANVAS' ||
                      (element.className && (
                        element.className.includes('daily') || 
                        element.className.includes('video') ||
                        element.className.includes('tavus')
                      ))) {
                    shouldCheck = true;
                  }
                }
              });
            }
          });
          
          if (shouldCheck && !hasConnected) {
            console.log('DOM mutation detected, checking connection...');
            checkVideoConnection();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }

      // Handle errors
      window.addEventListener('error', (event) => {
        console.error('Page error:', event.error?.message || event.message);
        if (event.error?.message?.includes('daily.co') || 
            event.error?.message?.includes('refused to connect')) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'daily_connection_refused',
              message: 'Daily.co connection refused - CORS or security policy blocking'
            }));
          }
        }
      });

      // Signal ready
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'script_ready'
        }));
      }

      // Cleanup
      window.addEventListener('beforeunload', () => {
        clearInterval(connectionCheckInterval);
        clearTimeout(connectionTimeout);
      });
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'script_ready':
          console.log('Video oracle script ready');
          setIsLoading(false);
          break;
        case 'connection_established':
          console.log('Video connection established:', data);
          onConnectionStateChange?.(true);
          setConnectionError(null);
          setShowFallback(false);
          break;
        case 'iframe_blocked':
        case 'daily_connection_refused':
          console.warn('Daily.co connection blocked:', data.message);
          setConnectionError('Video chat connection blocked by security policy');
          setShowFallback(true);
          onError?.('Video chat connection blocked. Please try opening in external browser.');
          break;
        case 'connection_timeout':
          console.warn('Connection timeout:', data.message);
          setConnectionError('Connection timeout - video chat may not be available');
          setShowFallback(true);
          onError?.('Connection timeout. Please try refreshing or opening in external browser.');
          break;
        case 'error':
          console.error('Video oracle error:', data.message);
          if (data.message.includes('daily.co') || data.message.includes('refused')) {
            setConnectionError('Video chat blocked by browser security');
            setShowFallback(true);
          }
          onError?.(data.message);
          break;
        case 'log':
          console.log('Video oracle:', data.message);
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
    setShowFallback(true);
    onError?.(`Failed to load video oracle: ${nativeEvent.description}`);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setConnectionError(null);
    setShowFallback(false);
    setIsLoading(true);
    
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleOpenExternal = async () => {
    try {
      if (Platform.OS === 'web') {
        window.open(conversationUrl, '_blank', 'noopener,noreferrer');
      } else {
        await Linking.openURL(conversationUrl);
      }
    } catch (error) {
      console.error('Failed to open external URL:', error);
      onError?.('Failed to open external browser');
    }
  };

  const renderFallbackOptions = () => (
    <View style={[styles.fallbackContainer, { backgroundColor: colors.surface }]}>
      <AlertCircle color={colors.warning} size={48} />
      <Text style={[styles.fallbackTitle, { color: colors.text }]}>
        Video Chat Connection Issue
      </Text>
      <Text style={[styles.fallbackMessage, { color: colors.textSecondary }]}>
        The video oracle connection was blocked by browser security settings. This is common with embedded video chat.
      </Text>
      
      <View style={styles.fallbackActions}>
        <TouchableOpacity
          style={[styles.fallbackButton, { backgroundColor: colors.accent }]}
          onPress={handleOpenExternal}
        >
          <ExternalLink color={colors.background} size={20} />
          <Text style={[styles.fallbackButtonText, { color: colors.background }]}>
            Open in Browser
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.fallbackButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent }]}
          onPress={handleRetry}
        >
          <RefreshCw color={colors.accent} size={20} />
          <Text style={[styles.fallbackButtonText, { color: colors.accent }]}>
            Try Again ({retryCount + 1})
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.fallbackNote, { color: colors.textSecondary }]}>
        Opening in your default browser usually resolves connection issues.
      </Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        {showFallback ? (
          renderFallbackOptions()
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
              allow="camera *; microphone *; autoplay *; encrypted-media *; fullscreen *; display-capture *"
              allowFullScreen
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation allow-downloads"
              onLoad={() => {
                console.log('Iframe loaded');
                setIsLoading(false);
              }}
              onError={() => {
                console.error('Iframe failed to load');
                setConnectionError('Failed to load video oracle');
                setShowFallback(true);
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

  return (
    <View style={[styles.container, style]}>
      {showFallback ? (
        renderFallbackOptions()
      ) : (
        <WebView
          ref={webViewRef}
          source={{ 
            uri: conversationUrl,
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            }
          }}
          style={[styles.webView, { backgroundColor: colors.surface }]}
          onMessage={handleMessage}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlaybook={true}
          allowsFullscreenVideo={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={false}
          allowsProtectedMedia={true}
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
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  fallbackMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.9,
  },
  fallbackActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  fallbackButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fallbackNote: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
});
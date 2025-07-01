import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseService } from '@/lib/supabase';
import { getRevenueCatService, CustomerInfo, PurchasesPackage, SubscriptionTier } from '@/services/RevenueCatService';

interface SubscriptionStatus {
  tier: 'free' | 'premium' | 'mystic';
  isActive: boolean;
  expirationDate: Date | null;
  willRenew: boolean;
  provider?: string;
  productId?: string;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  availablePackages: PurchasesPackage[];
  subscriptionTiers: SubscriptionTier[];
  isLoading: boolean;
  error: string | null;
  canAccessPremiumFeatures: boolean;
  canAccessMysticFeatures: boolean;
  isRevenueCatAvailable: boolean;
  
  // Actions
  purchaseSubscription: (packageToPurchase: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { session, userProfile, updateSubscription, syncUserData } = useAuth();
  const revenueCatService = getRevenueCatService();
  
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: 'free',
    isActive: false,
    expirationDate: null,
    willRenew: false,
  });
  
  const [availablePackages, setAvailablePackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevenueCatAvailable] = useState(revenueCatService.isServiceAvailable());

  // Initialize RevenueCat when component mounts
  useEffect(() => {
    initializeRevenueCat();
  }, []);

  // Update user ID when session changes
  useEffect(() => {
    if (session.user) {
      revenueCatService.setUserId(session.user.id);
      refreshSubscriptionStatus();
    } else {
      revenueCatService.logOut();
      resetSubscriptionStatus();
    }
  }, [session.user]);

  // Sync with user profile subscription status
  useEffect(() => {
    if (userProfile?.subscriptionStatus) {
      const profileStatus = userProfile.subscriptionStatus;
      setSubscriptionStatus({
        tier: profileStatus.tier || userProfile.subscription_tier,
        isActive: profileStatus.isActive || false,
        expirationDate: profileStatus.expirationDate ? new Date(profileStatus.expirationDate) : null,
        willRenew: profileStatus.willRenew || false,
        provider: profileStatus.provider,
        productId: profileStatus.productId,
      });
    }
  }, [userProfile]);

  const initializeRevenueCat = async () => {
    try {
      setError(null);
      
      // Get API key from environment
      const apiKey = getRevenueCatApiKey();
      
      if (!apiKey && isRevenueCatAvailable) {
        console.log('RevenueCat API key not configured, using mock implementation');
      }
      
      // Configure RevenueCat
      if (apiKey) {
        await revenueCatService.configure(apiKey);
      }
      
      // Load available packages
      await loadAvailablePackages();
      
      // Load subscription status if user is logged in
      if (session.user) {
        await refreshSubscriptionStatus();
      }
      
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize subscription service');
    } finally {
      setIsLoading(false);
    }
  };

  const getRevenueCatApiKey = (): string => {
    // Try different ways to get the API key
    if (typeof process !== 'undefined' && process.env) {
      return process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';
    }
    
    // For web environments, try accessing via global
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__.EXPO_PUBLIC_REVENUECAT_API_KEY || '';
    }
    
    return '';
  };

  const loadAvailablePackages = async () => {
    try {
      const packages = await revenueCatService.getOfferings();
      setAvailablePackages(packages);
    } catch (error) {
      console.error('Failed to load packages:', error);
      setError('Failed to load subscription options');
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      setError(null);
      const customerInfo = await revenueCatService.getCustomerInfo();
      await updateSubscriptionStatusFromCustomerInfo(customerInfo);
    } catch (error) {
      console.error('Failed to refresh subscription status:', error);
      setError('Failed to refresh subscription status');
    }
  };

  const updateSubscriptionStatusFromCustomerInfo = async (customerInfo: CustomerInfo) => {
    const tier = revenueCatService.getSubscriptionTier(customerInfo);
    const isActive = revenueCatService.hasActiveSubscription(customerInfo);
    const expirationDate = revenueCatService.getSubscriptionExpirationDate(customerInfo);
    
    // Check if subscription will renew
    const activeEntitlements = Object.values(customerInfo.entitlements.active);
    const willRenew = activeEntitlements.some(entitlement => entitlement.willRenew);
    
    const newStatus: SubscriptionStatus = {
      tier,
      isActive,
      expirationDate,
      willRenew,
      provider: 'revenuecat',
    };

    setSubscriptionStatus(newStatus);

    // Sync with Supabase if user is logged in
    if (session.user) {
      await updateSubscription(tier, {
        isActive,
        expirationDate: expirationDate?.toISOString() || null,
        willRenew,
        provider: 'revenuecat',
        lastUpdated: new Date().toISOString(),
      });

      // Comprehensive sync
      await syncUserData({
        subscriptionTier: tier,
        subscriptionStatus: {
          tier,
          isActive,
          expirationDate: expirationDate?.toISOString() || null,
          willRenew,
          provider: 'revenuecat',
          lastUpdated: new Date().toISOString(),
        },
      });
    }
  };

  const resetSubscriptionStatus = () => {
    setSubscriptionStatus({
      tier: 'free',
      isActive: false,
      expirationDate: null,
      willRenew: false,
    });
  };

  const purchaseSubscription = async (packageToPurchase: PurchasesPackage): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await revenueCatService.purchasePackage(packageToPurchase);
      await updateSubscriptionStatusFromCustomerInfo(result.customerInfo);
      
      // Track purchase event in Supabase
      if (session.user) {
        await SupabaseService.trackSubscriptionEvent(
          session.user.id,
          'purchase',
          subscriptionStatus.tier,
          revenueCatService.getSubscriptionTier(result.customerInfo),
          'revenuecat',
          result.transaction?.transactionIdentifier,
          Math.round(packageToPurchase.product.price * 100), // Convert to cents
          {
            productId: packageToPurchase.identifier,
            packageType: packageToPurchase.packageType,
          }
        );
      }
      
      console.log('Purchase successful:', result.productIdentifier);
      return true;
      
    } catch (error) {
      console.error('Purchase failed:', error);
      setError(error instanceof Error ? error.message : 'Purchase failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const customerInfo = await revenueCatService.restorePurchases();
      await updateSubscriptionStatusFromCustomerInfo(customerInfo);
      
      console.log('Purchases restored successfully');
      
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      setError('Failed to restore purchases');
    } finally {
      setIsLoading(false);
    }
  };

  // Computed values
  const canAccessPremiumFeatures = subscriptionStatus.tier === 'premium' || subscriptionStatus.tier === 'mystic';
  const canAccessMysticFeatures = subscriptionStatus.tier === 'mystic';

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        availablePackages,
        subscriptionTiers: revenueCatService.subscriptionTiers,
        isLoading,
        error,
        canAccessPremiumFeatures,
        canAccessMysticFeatures,
        isRevenueCatAvailable,
        purchaseSubscription,
        restorePurchases,
        refreshSubscriptionStatus,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
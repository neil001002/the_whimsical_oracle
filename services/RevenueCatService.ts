import { Platform } from 'react-native';

// RevenueCat types
export interface PurchasesPackage {
  identifier: string;
  packageType: string;
  product: {
    identifier: string;
    description: string;
    title: string;
    price: number;
    priceString: string;
    currencyCode: string;
  };
  offeringIdentifier: string;
}

export interface CustomerInfo {
  originalAppUserId: string;
  allPurchaseDates: { [key: string]: string };
  firstSeen: string;
  originalApplicationVersion: string | null;
  requestDate: string;
  latestExpirationDate: string | null;
  originalPurchaseDate: string | null;
  entitlements: {
    all: { [key: string]: EntitlementInfo };
    active: { [key: string]: EntitlementInfo };
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  nonSubscriptionTransactions: any[];
  managementURL: string | null;
}

export interface EntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
  expirationDate: string | null;
  store: string;
  productIdentifier: string;
  isSandbox: boolean;
  ownershipType: string;
  periodType: string;
}

export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
  transaction: any;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  productId: string;
  popular?: boolean;
}

// Check if RevenueCat is available
const isRevenueCatAvailable = (): boolean => {
  if (Platform.OS === 'web') {
    return false; // RevenueCat doesn't support web
  }
  
  try {
    // Check if we're in a custom development build
    const isCustomBuild = !__DEV__ || (typeof expo === 'undefined' || !expo?.modules?.ExpoGo);
    if (!isCustomBuild) {
      return false; // Not available in Expo Go
    }
    
    // Try to import RevenueCat to check if it's available
    require('react-native-purchases');
    return true;
  } catch (error) {
    console.warn('RevenueCat not available:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

export class RevenueCatService {
  private isAvailable: boolean;
  private isConfigured: boolean = false;
  private mockCustomerInfo: CustomerInfo;

  // Subscription tiers configuration
  public readonly subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'free',
      name: 'Seeker',
      description: 'Begin your mystical journey',
      price: 'Free',
      features: [
        '3 daily oracle readings',
        'Basic mystical personas',
        'Voice narration',
        'Reading history',
      ],
      productId: '',
    },
    {
      id: 'premium',
      name: 'Mystic',
      description: 'Unlock deeper wisdom',
      price: '$4.99/month',
      features: [
        'Unlimited oracle readings',
        'All mystical personas',
        'Enhanced interpretations',
        'Priority voice features',
        'Advanced analytics',
      ],
      productId: 'premium_monthly',
      popular: true,
    },
    {
      id: 'mystic',
      name: 'Oracle Master',
      description: 'Complete mystical mastery',
      price: '$9.99/month',
      features: [
        'Everything in Mystic',
        'Real-time voice chat',
        'Cosmic calendar',
        'Exclusive personas',
        'Premium support',
      ],
      productId: 'mystic_monthly',
    },
  ];

  constructor() {
    this.isAvailable = isRevenueCatAvailable();
    
    // Mock customer info for development/web
    this.mockCustomerInfo = {
      originalAppUserId: 'mock_user_123',
      allPurchaseDates: {},
      firstSeen: new Date().toISOString(),
      originalApplicationVersion: '1.0.0',
      requestDate: new Date().toISOString(),
      latestExpirationDate: null,
      originalPurchaseDate: null,
      entitlements: {
        all: {},
        active: {},
      },
      activeSubscriptions: [],
      allPurchasedProductIdentifiers: [],
      nonSubscriptionTransactions: [],
      managementURL: null,
    };

    if (!this.isAvailable) {
      console.log('RevenueCat service initialized with mock implementation');
    }
  }

  // Check if RevenueCat is available
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }

  // Configure RevenueCat
  async configure(apiKey: string): Promise<void> {
    if (!this.isAvailable) {
      console.log('Using mock RevenueCat configuration');
      this.isConfigured = true;
      return;
    }

    try {
      const Purchases = require('react-native-purchases');
      
      await Purchases.configure({ apiKey });
      this.isConfigured = true;
      console.log('RevenueCat configured successfully');
    } catch (error) {
      console.error('Failed to configure RevenueCat:', error);
      throw new Error('Failed to configure RevenueCat');
    }
  }

  // Get current customer info
  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!this.isAvailable || !this.isConfigured) {
      return this.mockCustomerInfo;
    }

    try {
      const Purchases = require('react-native-purchases');
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return this.mockCustomerInfo;
    }
  }

  // Get available packages
  async getOfferings(): Promise<PurchasesPackage[]> {
    if (!this.isAvailable || !this.isConfigured) {
      // Return mock packages for development
      return [
        {
          identifier: 'premium_monthly',
          packageType: 'MONTHLY',
          product: {
            identifier: 'premium_monthly',
            description: 'Premium monthly subscription',
            title: 'Mystic Monthly',
            price: 4.99,
            priceString: '$4.99',
            currencyCode: 'USD',
          },
          offeringIdentifier: 'default',
        },
        {
          identifier: 'mystic_monthly',
          packageType: 'MONTHLY',
          product: {
            identifier: 'mystic_monthly',
            description: 'Mystic monthly subscription',
            title: 'Oracle Master Monthly',
            price: 9.99,
            priceString: '$9.99',
            currencyCode: 'USD',
          },
          offeringIdentifier: 'default',
        },
      ];
    }

    try {
      const Purchases = require('react-native-purchases');
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current) {
        return Object.values(offerings.current.availablePackages);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return [];
    }
  }

  // Purchase a package
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<PurchaseResult> {
    if (!this.isAvailable || !this.isConfigured) {
      // Mock successful purchase for development
      const mockResult: PurchaseResult = {
        customerInfo: {
          ...this.mockCustomerInfo,
          entitlements: {
            all: {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                latestPurchaseDate: new Date().toISOString(),
                originalPurchaseDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                store: 'mock',
                productIdentifier: packageToPurchase.identifier,
                isSandbox: true,
                ownershipType: 'PURCHASED',
                periodType: 'NORMAL',
              },
            },
            active: {
              premium: {
                identifier: 'premium',
                isActive: true,
                willRenew: true,
                latestPurchaseDate: new Date().toISOString(),
                originalPurchaseDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                store: 'mock',
                productIdentifier: packageToPurchase.identifier,
                isSandbox: true,
                ownershipType: 'PURCHASED',
                periodType: 'NORMAL',
              },
            },
          },
          activeSubscriptions: [packageToPurchase.identifier],
          allPurchasedProductIdentifiers: [packageToPurchase.identifier],
        },
        productIdentifier: packageToPurchase.identifier,
        transaction: { transactionIdentifier: 'mock_transaction_123' },
      };
      
      // Update mock customer info
      this.mockCustomerInfo = mockResult.customerInfo;
      
      console.log('Mock purchase completed:', packageToPurchase.identifier);
      return mockResult;
    }

    try {
      const Purchases = require('react-native-purchases');
      const purchaseResult = await Purchases.purchasePackage(packageToPurchase);
      console.log('Purchase completed:', purchaseResult);
      return purchaseResult;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw new Error(`Purchase failed: ${error}`);
    }
  }

  // Restore purchases
  async restorePurchases(): Promise<CustomerInfo> {
    if (!this.isAvailable || !this.isConfigured) {
      console.log('Mock restore purchases');
      return this.mockCustomerInfo;
    }

    try {
      const Purchases = require('react-native-purchases');
      const customerInfo = await Purchases.restorePurchases();
      console.log('Purchases restored:', customerInfo);
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw new Error('Failed to restore purchases');
    }
  }

  // Check if user has active subscription
  hasActiveSubscription(customerInfo: CustomerInfo): boolean {
    return Object.keys(customerInfo.entitlements.active).length > 0;
  }

  // Get subscription tier from customer info
  getSubscriptionTier(customerInfo: CustomerInfo): 'free' | 'premium' | 'mystic' {
    const activeEntitlements = customerInfo.entitlements.active;
    
    if (activeEntitlements.mystic?.isActive) {
      return 'mystic';
    }
    
    if (activeEntitlements.premium?.isActive) {
      return 'premium';
    }
    
    return 'free';
  }

  // Check if user can access premium features
  canAccessPremiumFeatures(customerInfo: CustomerInfo): boolean {
    const tier = this.getSubscriptionTier(customerInfo);
    return tier === 'premium' || tier === 'mystic';
  }

  // Check if user can access mystic features
  canAccessMysticFeatures(customerInfo: CustomerInfo): boolean {
    const tier = this.getSubscriptionTier(customerInfo);
    return tier === 'mystic';
  }

  // Get subscription expiration date
  getSubscriptionExpirationDate(customerInfo: CustomerInfo): Date | null {
    const activeEntitlements = Object.values(customerInfo.entitlements.active);
    
    if (activeEntitlements.length === 0) {
      return null;
    }
    
    // Get the latest expiration date
    const expirationDates = activeEntitlements
      .map(entitlement => entitlement.expirationDate)
      .filter(date => date !== null)
      .map(date => new Date(date!));
    
    if (expirationDates.length === 0) {
      return null;
    }
    
    return new Date(Math.max(...expirationDates.map(date => date.getTime())));
  }

  // Set user ID
  async setUserId(userId: string): Promise<void> {
    if (!this.isAvailable || !this.isConfigured) {
      console.log('Mock set user ID:', userId);
      return;
    }

    try {
      const Purchases = require('react-native-purchases');
      await Purchases.logIn(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Failed to set user ID:', error);
    }
  }

  // Log out user
  async logOut(): Promise<void> {
    if (!this.isAvailable || !this.isConfigured) {
      console.log('Mock log out');
      // Reset mock customer info
      this.mockCustomerInfo = {
        originalAppUserId: 'mock_user_123',
        allPurchaseDates: {},
        firstSeen: new Date().toISOString(),
        originalApplicationVersion: '1.0.0',
        requestDate: new Date().toISOString(),
        latestExpirationDate: null,
        originalPurchaseDate: null,
        entitlements: {
          all: {},
          active: {},
        },
        activeSubscriptions: [],
        allPurchasedProductIdentifiers: [],
        nonSubscriptionTransactions: [],
        managementURL: null,
      };
      return;
    }

    try {
      const Purchases = require('react-native-purchases');
      await Purchases.logOut();
      console.log('User logged out');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }
}

// Singleton instance
let revenueCatService: RevenueCatService | null = null;

export const getRevenueCatService = (): RevenueCatService => {
  if (!revenueCatService) {
    revenueCatService = new RevenueCatService();
  }
  return revenueCatService;
};
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  PARTNER = 'partner',
}

export enum MerchantBillingPreference {
  PREPAID = 'prepaid', // Opt 1: In-app wallet funds
  CARD_ON_FILE = 'card_on_file', // Opt 2: Direct charge
}

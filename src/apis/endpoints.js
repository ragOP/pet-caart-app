export const endpoints = {
  // auth
  login: 'api/auth/user/login',
  register: 'api/auth/user/register',
  update_profile: 'api/auth/user/update-profile',
  generateReferralCode: 'api/auth/user/generate-referral-code',
  walletTransactions: 'api/auth/user/get-all-wallet-transactions',
  checkUserWallet: 'api/users/check-user-wallet',
  // products
  products: 'api/product',

  // blogs
  blogs: 'api/blogs',

  banners: 'api/configuration/banner',

  // sliders
  sliders: 'api/sliders/slider',
  // reviews
  createReview: 'api/reviews/create',
  getReviewsByProductId: 'api/reviews/get-all-reviews',

  // categories
  category: 'api/category',

  // sub categories
  sub_category: 'api/subcategory',

  // breeds
  breed: 'api/breed',

  // collection
  collection: 'api/collection',

  // header and footer
  header_footer: 'api/settings/header-footer/get',

  // cat banners
  cat_banners: 'api/cat-life-banner/get',

  // Ad banners
  ad_banners: 'api/configuration/ad-banner',

  // brands
  brands: 'api/brand',

  // address
  address: 'api/address',
  // product banner
  productBanner: 'api/product-banner',

  // cart
  cart: 'api/cart',
  reorderCart: 'api/cart/previous-order',
  // coupons
  coupons: 'api/coupon',

  // orders
  orders: 'api/orders',
  sendOtp: 'api/otp/send-otp',
  collection: 'api/collection',
  delivery: 'api/delivery/check',
  pageConfig: 'api/page-config/get-page-config-by-key',
};

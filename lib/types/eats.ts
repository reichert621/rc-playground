export interface Restaurant {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  servesCuisine: string[];
  priceRange: string;
  image: string[];
  potentialAction: OrderAction;
  address: PostalAddress;
  geo: GeoCoordinates;
  telephone: string;
  aggregateRating: AggregateRating;
  openingHoursSpecification: OpeningHoursSpecification[];
  deals: Deal[];
}

interface OrderAction {
  '@type': string;
  target: EntryPoint;
  deliveryMethod: string[];
}

interface EntryPoint {
  '@type': string;
  urlTemplate: string;
  inLanguage: string;
  actionPlatform: string[];
}

interface PostalAddress {
  '@type': string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  streetAddress: string;
}

interface GeoCoordinates {
  '@type': string;
  latitude: number;
  longitude: number;
}

interface AggregateRating {
  '@type': string;
  ratingValue: number;
  reviewCount: string;
}

interface OpeningHoursSpecification {
  '@type': string;
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface Deal {
  uuid: string;
  imageUrl: string;
  title: string;
  itemDescription: string;
  price: number;
  priceTagline: PriceTagline;
  spanCount: number;
  displayType: string;
  titleBadge: TitleBadge;
  isSoldOut: boolean;
  hasCustomizations: boolean;
  itemPromotion: ItemPromotion;
  itemDescriptionBadge: ItemDescriptionBadge;
  subsectionUuid: string;
  isAvailable: boolean;
  purchaseInfo: PurchaseInfo;
  sectionUuid: string;
  promoInfo: PromoInfo;
  promotionUUID: string;
  quickAddConfig: QuickAddConfig;
  labelPrimary: LabelPrimary;
  headingPrimary: HeadingPrimary;
  itemAvailabilityState: string;
  catalogItemAnalyticsData: CatalogItemAnalyticsData;
  imageOverlayElements: null; // Specify the type if it's not always null
  itemThumbnailElements: null; // Specify the type if it's not always null
}

interface PriceTagline {
  text: string;
  textFormat: string;
  accessibilityText: string;
}

interface TitleBadge {
  text: string;
  textFormat: string;
  accessibilityText: string;
}

interface ItemPromotion {
  buyXGetYItemPromotion: BuyXGetYItemPromotion;
  type: string;
}

interface BuyXGetYItemPromotion {
  buyQuantity: number;
  getQuantity: number;
  maxRedemptionCount: number;
}

interface ItemDescriptionBadge {
  text: string;
  textFormat: string;
}

interface PurchaseInfo {
  purchaseOptions: any[]; // Use more specific type if structure is known
  pricingInfo: any; // Use more specific type if structure is known
}

interface PromoInfo {
  promoInfoLabel: PromoInfoLabel;
  accessibilityText: string;
}

interface PromoInfoLabel {
  richTextElements: RichTextElement[];
}

interface RichTextElement {
  text?: {
    text: TextElement;
  };
  type: string;
  icon?: {
    icon: IconElement;
  };
}

interface TextElement {
  text: string;
  font?: {
    style: string;
    weight: string;
  };
  color?: string;
}

interface IconElement {
  icon: string;
  color?: string;
  size?: string;
}

interface QuickAddConfig {
  shouldShow: boolean;
  isInteractionEnabled: boolean;
  position: string;
}

interface LabelPrimary {
  richTextElements: RichTextElement[];
  accessibilityText: string;
}

interface HeadingPrimary {
  richTextElements: RichTextElement[];
  accessibilityText: string;
}

interface CatalogItemAnalyticsData {
  catalogSectionItemPosition: number;
}

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type AboutPageDocumentDataSlicesSlice = never

/**
 * Content for About Page documents
 */
interface AboutPageDocumentData {
	/**
	 * Slice Zone field in *About Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<AboutPageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *About Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: about_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *About Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: about_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *About Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * About Page document from Prismic
 *
 * - **API ID**: `about_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AboutPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<AboutPageDocumentData>, "about_page", Lang>;

/**
 * Item in *Brand → Top picks (bento grid, first is the large tile)*
 */
export interface BrandDocumentDataTopPicksItem {
	/**
	 * Title field in *Brand → Top picks (bento grid, first is the large tile)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.top_picks[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Subtitle field in *Brand → Top picks (bento grid, first is the large tile)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.top_picks[].subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Image field in *Brand → Top picks (bento grid, first is the large tile)*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.top_picks[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Button field in *Brand → Top picks (bento grid, first is the large tile)*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.top_picks[].cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Brand → Body types shown in Our Models*
 */
export interface BrandDocumentDataCategoryImagesItem {
	/**
	 * Category field in *Brand → Body types shown in Our Models*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.category_images[].category
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	category: ContentRelationshipFieldWithData<[{"fields":["name"],"id":"category"}]>;
	
	/**
	 * Image for this brand field in *Brand → Body types shown in Our Models*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.category_images[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Content for Brand documents
 */
interface BrandDocumentData {
	/**
	 * Name field in *Brand*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Logo field in *Brand*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * Order in brand pill bar field in *Brand*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.order
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	order: prismic.NumberField;
	
	/**
	 * Top picks (bento grid, first is the large tile) field in *Brand*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.top_picks[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	top_picks: prismic.GroupField<Simplify<BrandDocumentDataTopPicksItem>>;
	
	/**
	 * Body types shown in Our Models field in *Brand*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand.category_images[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	category_images: prismic.GroupField<Simplify<BrandDocumentDataCategoryImagesItem>>;
}

/**
 * Brand document from Prismic
 *
 * - **API ID**: `brand`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BrandDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<BrandDocumentData>, "brand", Lang>;

/**
 * Content for Category documents
 */
interface CategoryDocumentData {
	/**
	 * Name field in *Category*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: category.name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
}

/**
 * Category document from Prismic
 *
 * - **API ID**: `category`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type CategoryDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<CategoryDocumentData>, "category", Lang>;

type ContactPageDocumentDataSlicesSlice = never

/**
 * Content for Contact Page documents
 */
interface ContactPageDocumentData {
	/**
	 * Slice Zone field in *Contact Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ContactPageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Contact Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: contact_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Contact Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: contact_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Contact Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Contact Page document from Prismic
 *
 * - **API ID**: `contact_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ContactPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ContactPageDocumentData>, "contact_page", Lang>;

type HomepageDocumentDataSlicesSlice = HeroVideoSlice | BrandPicksSlice | ModelCategoriesSlice | VehicleHighlightsSlice | BrowseStripSlice | SplitFeatureSlice | ServiceTilesSlice

/**
 * Content for Homepage documents
 */
interface HomepageDocumentData {
	/**
	 * Slice Zone field in *Homepage*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomepageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: homepage.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Homepage*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: homepage.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Homepage*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: homepage.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Homepage document from Prismic
 *
 * - **API ID**: `homepage`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomepageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomepageDocumentData>, "homepage", Lang>;

/**
 * Item in *Settings → Opening hours*
 */
export interface SettingsDocumentDataOpeningHoursItem {
	/**
	 * Days field in *Settings → Opening hours*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.opening_hours[].days
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	days: prismic.KeyTextField;
	
	/**
	 * Hours field in *Settings → Opening hours*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.opening_hours[].hours
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	hours: prismic.KeyTextField;
}

/**
 * Item in *Settings → Navigation*
 */
export interface SettingsDocumentDataNavigationItem {
	/**
	 * Label field in *Settings → Navigation*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.navigation[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Link field in *Settings → Navigation*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.navigation[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Site name field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.site_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_name: prismic.KeyTextField;
	
	/**
	 * Tagline field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.tagline
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Phone field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.phone
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	phone: prismic.KeyTextField;
	
	/**
	 * Email field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * WhatsApp (digits only, international) field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.whatsapp
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	whatsapp: prismic.KeyTextField;
	
	/**
	 * Address field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.address
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	address: prismic.KeyTextField;
	
	/**
	 * Map link field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.map_url
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	map_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Directions link field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.directions_url
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	directions_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Opening hours field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.opening_hours[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	opening_hours: prismic.GroupField<Simplify<SettingsDocumentDataOpeningHoursItem>>;
	
	/**
	 * Navigation field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.navigation[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	navigation: prismic.GroupField<Simplify<SettingsDocumentDataNavigationItem>>;
	
	/**
	 * Footer note field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.footer_note
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	footer_note: prismic.RichTextField;
	
	/**
	 * Default meta title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.default_meta_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	default_meta_title: prismic.KeyTextField;
	
	/**
	 * Default meta description field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.default_meta_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	default_meta_description: prismic.KeyTextField;
	
	/**
	 * Default share image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.default_meta_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	default_meta_image: prismic.ImageField<never>;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

type VehicleDocumentDataSlicesSlice = never

/**
 * Item in *Vehicle → Variants*
 */
export interface VehicleDocumentDataVariantsItem {
	/**
	 * Variant ID (matches image folder) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Name field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Price (USD) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].from_price
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	from_price: prismic.NumberField;
	
	/**
	 * Blurb field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].blurb
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	blurb: prismic.KeyTextField;
	
	/**
	 * Engine field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].engine
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	engine: prismic.KeyTextField;
	
	/**
	 * Fuel field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].fuel
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	fuel: prismic.SelectField<"Petrol" | "Diesel" | "Petrol Hybrid" | "Diesel Hybrid" | "Electric">;
	
	/**
	 * Power (kW) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].power_kw
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	power_kw: prismic.NumberField;
	
	/**
	 * Torque (Nm) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].torque_nm
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	torque_nm: prismic.NumberField;
	
	/**
	 * Transmission field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].transmission
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	transmission: prismic.KeyTextField;
	
	/**
	 * Drive field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].drive
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	drive: prismic.KeyTextField;
	
	/**
	 * Economy (L/100 km) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].economy
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	economy: prismic.NumberField;
	
	/**
	 * Seats field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].seats
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	seats: prismic.NumberField;
	
	/**
	 * Payload (kg) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].payload_kg
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	payload_kg: prismic.NumberField;
	
	/**
	 * Towing (kg) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].towing_kg
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	towing_kg: prismic.NumberField;
	
	/**
	 * Length (mm) field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].length_mm
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	length_mm: prismic.NumberField;
	
	/**
	 * Safety field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].safety
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	safety: prismic.KeyTextField;
	
	/**
	 * Spec table field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Table
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].specs
	 * - **Documentation**: https://prismic.io/docs/fields/table
	 */
	specs: prismic.TableField;
	
	/**
	 * Hero image for this version field in *Vehicle → Variants*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[].hero_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	hero_image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Colour options*
 */
export interface VehicleDocumentDataColourOptionsItem {
	/**
	 * Variant IDs (comma-separated, trims that share this colour) field in *Vehicle → Colour options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.colour_options[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Colour name field in *Vehicle → Colour options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.colour_options[].colour_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	colour_name: prismic.KeyTextField;
	
	/**
	 * Hex (e.g. #1a1a1a) field in *Vehicle → Colour options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.colour_options[].hex
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	hex: prismic.KeyTextField;
	
	/**
	 * Studio image field in *Vehicle → Colour options*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.colour_options[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Exterior shots*
 */
export interface VehicleDocumentDataExteriorShotsItem {
	/**
	 * Image field in *Vehicle → Exterior shots*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_shots[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *Vehicle → Exterior shots*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_shots[].caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Item in *Vehicle → Interior shots*
 */
export interface VehicleDocumentDataInteriorShotsItem {
	/**
	 * Image field in *Vehicle → Interior shots*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_shots[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Caption field in *Vehicle → Interior shots*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_shots[].caption
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	caption: prismic.KeyTextField;
}

/**
 * Item in *Vehicle → Rivals*
 */
export interface VehicleDocumentDataRivalsItem {
	/**
	 * Vehicle field in *Vehicle → Rivals*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.rivals[].vehicle
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	vehicle: ContentRelationshipFieldWithData<[{"fields":["model_name"],"id":"vehicle"}]>;
}

/**
 * Item in *Vehicle → FAQ*
 */
export interface VehicleDocumentDataFaqItem {
	/**
	 * Question field in *Vehicle → FAQ*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.faq[].question
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	question: prismic.KeyTextField;
	
	/**
	 * Answer field in *Vehicle → FAQ*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.faq[].answer
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	answer: prismic.RichTextField;
}

/**
 * Item in *Vehicle → Highlights (bento)*
 */
export interface VehicleDocumentDataHighlightsItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Highlights (bento)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.highlights[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Title field in *Vehicle → Highlights (bento)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.highlights[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Text field in *Vehicle → Highlights (bento)*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.highlights[].text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
	
	/**
	 * Image field in *Vehicle → Highlights (bento)*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.highlights[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Exterior colour views*
 */
export interface VehicleDocumentDataExteriorViewsItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Exterior colour views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Colour name field in *Vehicle → Exterior colour views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[].colour_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	colour_name: prismic.KeyTextField;
	
	/**
	 * Colour hex (e.g. #1a1a1a) field in *Vehicle → Exterior colour views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[].colour_hex
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	colour_hex: prismic.KeyTextField;
	
	/**
	 * Angle field in *Vehicle → Exterior colour views*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[].angle
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	angle: prismic.SelectField<"Front" | "Front left" | "Left" | "Rear left" | "Rear" | "Rear right" | "Right" | "Front right">;
	
	/**
	 * Studio image field in *Vehicle → Exterior colour views*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Wheel options*
 */
export interface VehicleDocumentDataWheelOptionsItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Wheel options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.wheel_options[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Wheel name field in *Vehicle → Wheel options*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.wheel_options[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * Angle field in *Vehicle → Wheel options*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.wheel_options[].angle
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	angle: prismic.SelectField<"Front" | "Front left" | "Left" | "Rear left" | "Rear" | "Rear right" | "Right" | "Front right">;
	
	/**
	 * Image field in *Vehicle → Wheel options*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.wheel_options[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Interior views*
 */
export interface VehicleDocumentDataInteriorViewsItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Interior views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_views[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Tab field in *Vehicle → Interior views*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Upholstery
	 * - **API ID Path**: vehicle.interior_views[].tab
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tab: prismic.SelectField<"Upholstery" | "Trims", "filled">;
	
	/**
	 * Option name field in *Vehicle → Interior views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_views[].option_name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	option_name: prismic.KeyTextField;
	
	/**
	 * Swatch hex field in *Vehicle → Interior views*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_views[].swatch_hex
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	swatch_hex: prismic.KeyTextField;
	
	/**
	 * Image field in *Vehicle → Interior views*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_views[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Equipment highlights*
 */
export interface VehicleDocumentDataEquipmentItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Equipment highlights*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Category (e.g. Multimedia) field in *Vehicle → Equipment highlights*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[].category
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	category: prismic.KeyTextField;
	
	/**
	 * Title field in *Vehicle → Equipment highlights*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Text field in *Vehicle → Equipment highlights*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[].text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
	
	/**
	 * Image field in *Vehicle → Equipment highlights*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Item in *Vehicle → Technical data rows*
 */
export interface VehicleDocumentDataSpecRowsItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Technical data rows*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Section (e.g. Performance) field in *Vehicle → Technical data rows*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[].section
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	section: prismic.KeyTextField;
	
	/**
	 * Label field in *Vehicle → Technical data rows*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Value field in *Vehicle → Technical data rows*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[].value
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	value: prismic.KeyTextField;
	
	/**
	 * Show in the key figures table field in *Vehicle → Technical data rows*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[].key_figure
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	key_figure: prismic.BooleanField;
}

/**
 * Item in *Vehicle → Offers and prices*
 */
export interface VehicleDocumentDataOffersItem {
	/**
	 * Version IDs (comma-separated; blank = all versions) field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].variant_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	variant_id: prismic.KeyTextField;
	
	/**
	 * Type field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	type: prismic.SelectField<"Leasing" | "Finance" | "Cash offer" | "Trade-in" | "Other">;
	
	/**
	 * Title field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Text field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
	
	/**
	 * Button label field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].cta_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta_label: prismic.KeyTextField;
	
	/**
	 * Background image field in *Vehicle → Offers and prices*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Content for Vehicle documents
 */
interface VehicleDocumentData {
	/**
	 * Slice Zone field in *Vehicle*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<VehicleDocumentDataSlicesSlice>;
	
	/**
	 * Model name field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.model_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	model_name: prismic.KeyTextField;
	
	/**
	 * Tagline field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.tagline
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tagline: prismic.KeyTextField;
	
	/**
	 * Summary field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.summary
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	summary: prismic.KeyTextField;
	
	/**
	 * Short description field in *Vehicle*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.short_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	short_description: prismic.RichTextField;
	
	/**
	 * Long description field in *Vehicle*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.long_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	long_description: prismic.RichTextField;
	
	/**
	 * Brand field in *Vehicle*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.brand
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	brand: ContentRelationshipFieldWithData<[{"fields":["name","logo"],"id":"brand"}]>;
	
	/**
	 * Category field in *Vehicle*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.category
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	category: ContentRelationshipFieldWithData<[{"fields":["name"],"id":"category"}]>;
	
	/**
	 * Stock status field in *Vehicle*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Available
	 * - **API ID Path**: vehicle.stock_status
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	stock_status: prismic.SelectField<"Available" | "Limited Stock" | "Out of Stock", "filled">;
	
	/**
	 * Base price (USD) field in *Vehicle*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.base_price
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	base_price: prismic.NumberField;
	
	/**
	 * Hero image field in *Vehicle*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.hero_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	hero_image: prismic.ImageField<never>;
	
	/**
	 * Card image field in *Vehicle*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.card_image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	card_image: prismic.ImageField<never>;
	
	/**
	 * Show on home page field in *Vehicle*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.featured
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	featured: prismic.BooleanField;
	
	/**
	 * Variants field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.variants[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	variants: prismic.GroupField<Simplify<VehicleDocumentDataVariantsItem>>;
	
	/**
	 * Colour options field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.colour_options[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	colour_options: prismic.GroupField<Simplify<VehicleDocumentDataColourOptionsItem>>;
	
	/**
	 * Exterior shots field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_shots[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	exterior_shots: prismic.GroupField<Simplify<VehicleDocumentDataExteriorShotsItem>>;
	
	/**
	 * Interior shots field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_shots[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	interior_shots: prismic.GroupField<Simplify<VehicleDocumentDataInteriorShotsItem>>;
	
	/**
	 * Rivals field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.rivals[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	rivals: prismic.GroupField<Simplify<VehicleDocumentDataRivalsItem>>;
	
	/**
	 * FAQ field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.faq[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	faq: prismic.GroupField<Simplify<VehicleDocumentDataFaqItem>>;
	
	/**
	 * Source FM document uid (empty if Starbell-only) field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.source_uid
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	source_uid: prismic.KeyTextField;
	
	/**
	 * Last synced from FM field in *Vehicle*
	 *
	 * - **Field Type**: Timestamp
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.synced_at
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/timestamp
	 */
	synced_at: prismic.TimestampField;
	
	/**
	 * Highlights (bento) field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.highlights[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	highlights: prismic.GroupField<Simplify<VehicleDocumentDataHighlightsItem>>;
	
	/**
	 * Exterior colour views field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.exterior_views[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	exterior_views: prismic.GroupField<Simplify<VehicleDocumentDataExteriorViewsItem>>;
	
	/**
	 * Wheel options field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.wheel_options[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	wheel_options: prismic.GroupField<Simplify<VehicleDocumentDataWheelOptionsItem>>;
	
	/**
	 * Interior views field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.interior_views[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	interior_views: prismic.GroupField<Simplify<VehicleDocumentDataInteriorViewsItem>>;
	
	/**
	 * Equipment highlights field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.equipment[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	equipment: prismic.GroupField<Simplify<VehicleDocumentDataEquipmentItem>>;
	
	/**
	 * Technical data rows field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.spec_rows[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	spec_rows: prismic.GroupField<Simplify<VehicleDocumentDataSpecRowsItem>>;
	
	/**
	 * Offers and prices field in *Vehicle*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.offers[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	offers: prismic.GroupField<Simplify<VehicleDocumentDataOffersItem>>;/**
	 * Meta Title field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: vehicle.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Vehicle*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: vehicle.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Vehicle*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Vehicle document from Prismic
 *
 * - **API ID**: `vehicle`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type VehicleDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<VehicleDocumentData>, "vehicle", Lang>;

export type AllDocumentTypes = AboutPageDocument | BrandDocument | CategoryDocument | ContactPageDocument | HomepageDocument | SettingsDocument | VehicleDocument;

/**
 * Primary content in *BrandPicks → Default → Primary*
 */
export interface BrandPicksSliceDefaultPrimary {
	/**
	 * Top picks heading field in *BrandPicks → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand_picks.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Brand bar accessible label field in *BrandPicks → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: brand_picks.default.primary.pills_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	pills_label: prismic.KeyTextField;
}

/**
 * Default variation for BrandPicks Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrandPicksSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BrandPicksSliceDefaultPrimary>, never>;

/**
 * Slice variation for *BrandPicks*
 */
type BrandPicksSliceVariation = BrandPicksSliceDefault

/**
 * BrandPicks Shared Slice
 *
 * - **API ID**: `brand_picks`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrandPicksSlice = prismic.SharedSlice<"brand_picks", BrandPicksSliceVariation>;

/**
 * Primary content in *BrowseStrip → Default → Primary*
 */
export interface BrowseStripSliceDefaultPrimary {
	/**
	 * Strip text field in *BrowseStrip → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: browse_strip.default.primary.text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
	
	/**
	 * Button field in *BrowseStrip → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: browse_strip.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for BrowseStrip Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrowseStripSliceDefault = prismic.SharedSliceVariation<"default", Simplify<BrowseStripSliceDefaultPrimary>, never>;

/**
 * Slice variation for *BrowseStrip*
 */
type BrowseStripSliceVariation = BrowseStripSliceDefault

/**
 * BrowseStrip Shared Slice
 *
 * - **API ID**: `browse_strip`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type BrowseStripSlice = prismic.SharedSlice<"browse_strip", BrowseStripSliceVariation>;

/**
 * Item in *HeroVideo → Default → Primary → Slides*
 */
export interface HeroVideoSliceDefaultPrimarySlidesItem {
	/**
	 * Bunny Stream video ID field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].video_id
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	video_id: prismic.KeyTextField;
	
	/**
	 * Kicker (small text above headline) field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].kicker
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	kicker: prismic.KeyTextField;
	
	/**
	 * Headline field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].headline
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	headline: prismic.KeyTextField;
	
	/**
	 * Supporting text field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].body
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body: prismic.KeyTextField;
	
	/**
	 * Primary button field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].primary_cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	primary_cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Secondary button field in *HeroVideo → Default → Primary → Slides*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[].secondary_cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	secondary_cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *HeroVideo → Default → Primary*
 */
export interface HeroVideoSliceDefaultPrimary {
	/**
	 * Slides field in *HeroVideo → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero_video.default.primary.slides[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	slides: prismic.GroupField<Simplify<HeroVideoSliceDefaultPrimarySlidesItem>>;
}

/**
 * Default variation for HeroVideo Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroVideoSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeroVideoSliceDefaultPrimary>, never>;

/**
 * Slice variation for *HeroVideo*
 */
type HeroVideoSliceVariation = HeroVideoSliceDefault

/**
 * HeroVideo Shared Slice
 *
 * - **API ID**: `hero_video`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroVideoSlice = prismic.SharedSlice<"hero_video", HeroVideoSliceVariation>;

/**
 * Primary content in *ModelCategories → Default → Primary*
 */
export interface ModelCategoriesSliceDefaultPrimary {
	/**
	 * Heading field in *ModelCategories → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: model_categories.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Discover all button field in *ModelCategories → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: model_categories.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Label for 'view this brand' link field in *ModelCategories → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: model_categories.default.primary.view_label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	view_label: prismic.KeyTextField;
}

/**
 * Default variation for ModelCategories Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ModelCategoriesSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ModelCategoriesSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ModelCategories*
 */
type ModelCategoriesSliceVariation = ModelCategoriesSliceDefault

/**
 * ModelCategories Shared Slice
 *
 * - **API ID**: `model_categories`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ModelCategoriesSlice = prismic.SharedSlice<"model_categories", ModelCategoriesSliceVariation>;

/**
 * Item in *ServiceTiles → Default → Primary → Tiles*
 */
export interface ServiceTilesSliceDefaultPrimaryTilesItem {
	/**
	 * Title field in *ServiceTiles → Default → Primary → Tiles*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.tiles[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Short description field in *ServiceTiles → Default → Primary → Tiles*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.tiles[].blurb
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	blurb: prismic.KeyTextField;
	
	/**
	 * Icon field in *ServiceTiles → Default → Primary → Tiles*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.tiles[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"store" | "steering-wheel" | "banknote" | "shield" | "sliders">;
	
	/**
	 * Link field in *ServiceTiles → Default → Primary → Tiles*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.tiles[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Primary content in *ServiceTiles → Default → Primary*
 */
export interface ServiceTilesSliceDefaultPrimary {
	/**
	 * Heading field in *ServiceTiles → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Tiles field in *ServiceTiles → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: service_tiles.default.primary.tiles[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	tiles: prismic.GroupField<Simplify<ServiceTilesSliceDefaultPrimaryTilesItem>>;
}

/**
 * Default variation for ServiceTiles Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ServiceTilesSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ServiceTilesSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ServiceTiles*
 */
type ServiceTilesSliceVariation = ServiceTilesSliceDefault

/**
 * ServiceTiles Shared Slice
 *
 * - **API ID**: `service_tiles`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ServiceTilesSlice = prismic.SharedSlice<"service_tiles", ServiceTilesSliceVariation>;

/**
 * Primary content in *SplitFeature → Default → Primary*
 */
export interface SplitFeatureSliceDefaultPrimary {
	/**
	 * Eyebrow field in *SplitFeature → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.default.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * Heading field in *SplitFeature → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Body field in *SplitFeature → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.default.primary.body
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body: prismic.RichTextField;
	
	/**
	 * Button field in *SplitFeature → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Image field in *SplitFeature → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Default variation for SplitFeature Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SplitFeatureSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SplitFeatureSliceDefaultPrimary>, never>;

/**
 * Primary content in *SplitFeature → Image left → Primary*
 */
export interface SplitFeatureSliceImageLeftPrimary {
	/**
	 * Eyebrow field in *SplitFeature → Image left → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.imageLeft.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * Heading field in *SplitFeature → Image left → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.imageLeft.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * Body field in *SplitFeature → Image left → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.imageLeft.primary.body
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body: prismic.RichTextField;
	
	/**
	 * Button field in *SplitFeature → Image left → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.imageLeft.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Image field in *SplitFeature → Image left → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: split_feature.imageLeft.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
}

/**
 * Image left variation for SplitFeature Slice
 *
 * - **API ID**: `imageLeft`
 * - **Description**: Image left
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SplitFeatureSliceImageLeft = prismic.SharedSliceVariation<"imageLeft", Simplify<SplitFeatureSliceImageLeftPrimary>, never>;

/**
 * Slice variation for *SplitFeature*
 */
type SplitFeatureSliceVariation = SplitFeatureSliceDefault | SplitFeatureSliceImageLeft

/**
 * SplitFeature Shared Slice
 *
 * - **API ID**: `split_feature`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SplitFeatureSlice = prismic.SharedSlice<"split_feature", SplitFeatureSliceVariation>;

/**
 * Item in *VehicleHighlights → Default → Primary → Highlighted vehicles*
 */
export interface VehicleHighlightsSliceDefaultPrimaryVehiclesItem {
	/**
	 * Vehicle field in *VehicleHighlights → Default → Primary → Highlighted vehicles*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle_highlights.default.primary.vehicles[].vehicle
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	vehicle: prismic.ContentRelationshipField<"vehicle">;
	
	/**
	 * Label (e.g. Hatchback) field in *VehicleHighlights → Default → Primary → Highlighted vehicles*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle_highlights.default.primary.vehicles[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Primary content in *VehicleHighlights → Default → Primary*
 */
export interface VehicleHighlightsSliceDefaultPrimary {
	/**
	 * Heading field in *VehicleHighlights → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle_highlights.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	heading: prismic.KeyTextField;
	
	/**
	 * View all vehicles link field in *VehicleHighlights → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle_highlights.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	cta: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Highlighted vehicles field in *VehicleHighlights → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: vehicle_highlights.default.primary.vehicles[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	vehicles: prismic.GroupField<Simplify<VehicleHighlightsSliceDefaultPrimaryVehiclesItem>>;
}

/**
 * Default variation for VehicleHighlights Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VehicleHighlightsSliceDefault = prismic.SharedSliceVariation<"default", Simplify<VehicleHighlightsSliceDefaultPrimary>, never>;

/**
 * Slice variation for *VehicleHighlights*
 */
type VehicleHighlightsSliceVariation = VehicleHighlightsSliceDefault

/**
 * VehicleHighlights Shared Slice
 *
 * - **API ID**: `vehicle_highlights`
 * - **Description**: *None*
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type VehicleHighlightsSlice = prismic.SharedSlice<"vehicle_highlights", VehicleHighlightsSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			AboutPageDocument,
			AboutPageDocumentData,
			AboutPageDocumentDataSlicesSlice,
			BrandDocument,
			BrandDocumentData,
			BrandDocumentDataTopPicksItem,
			BrandDocumentDataCategoryImagesItem,
			CategoryDocument,
			CategoryDocumentData,
			ContactPageDocument,
			ContactPageDocumentData,
			ContactPageDocumentDataSlicesSlice,
			HomepageDocument,
			HomepageDocumentData,
			HomepageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			SettingsDocumentDataOpeningHoursItem,
			SettingsDocumentDataNavigationItem,
			VehicleDocument,
			VehicleDocumentData,
			VehicleDocumentDataSlicesSlice,
			VehicleDocumentDataVariantsItem,
			VehicleDocumentDataColourOptionsItem,
			VehicleDocumentDataExteriorShotsItem,
			VehicleDocumentDataInteriorShotsItem,
			VehicleDocumentDataRivalsItem,
			VehicleDocumentDataFaqItem,
			VehicleDocumentDataHighlightsItem,
			VehicleDocumentDataExteriorViewsItem,
			VehicleDocumentDataWheelOptionsItem,
			VehicleDocumentDataInteriorViewsItem,
			VehicleDocumentDataEquipmentItem,
			VehicleDocumentDataSpecRowsItem,
			VehicleDocumentDataOffersItem,
			AllDocumentTypes,
			BrandPicksSlice,
			BrandPicksSliceDefaultPrimary,
			BrandPicksSliceVariation,
			BrandPicksSliceDefault,
			BrowseStripSlice,
			BrowseStripSliceDefaultPrimary,
			BrowseStripSliceVariation,
			BrowseStripSliceDefault,
			HeroVideoSlice,
			HeroVideoSliceDefaultPrimarySlidesItem,
			HeroVideoSliceDefaultPrimary,
			HeroVideoSliceVariation,
			HeroVideoSliceDefault,
			ModelCategoriesSlice,
			ModelCategoriesSliceDefaultPrimary,
			ModelCategoriesSliceVariation,
			ModelCategoriesSliceDefault,
			ServiceTilesSlice,
			ServiceTilesSliceDefaultPrimaryTilesItem,
			ServiceTilesSliceDefaultPrimary,
			ServiceTilesSliceVariation,
			ServiceTilesSliceDefault,
			SplitFeatureSlice,
			SplitFeatureSliceDefaultPrimary,
			SplitFeatureSliceImageLeftPrimary,
			SplitFeatureSliceVariation,
			SplitFeatureSliceDefault,
			SplitFeatureSliceImageLeft,
			VehicleHighlightsSlice,
			VehicleHighlightsSliceDefaultPrimaryVehiclesItem,
			VehicleHighlightsSliceDefaultPrimary,
			VehicleHighlightsSliceVariation,
			VehicleHighlightsSliceDefault
		}
	}
}
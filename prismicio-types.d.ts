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

/**
 * Content for Compare Preset documents
 */
interface ComparePresetDocumentData {
	/**
	 * Label field in *Compare Preset*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: compare_preset.label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Vehicle A field in *Compare Preset*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: compare_preset.vehicle_a
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	vehicle_a: ContentRelationshipFieldWithData<[{"fields":["model_name"],"id":"vehicle"}]>;
	
	/**
	 * Vehicle B field in *Compare Preset*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: compare_preset.vehicle_b
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	vehicle_b: ContentRelationshipFieldWithData<[{"fields":["model_name"],"id":"vehicle"}]>;
	
	/**
	 * Vehicle C (optional) field in *Compare Preset*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: compare_preset.vehicle_c
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	vehicle_c: ContentRelationshipFieldWithData<[{"fields":["model_name"],"id":"vehicle"}]>;
}

/**
 * Compare Preset document from Prismic
 *
 * - **API ID**: `compare_preset`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ComparePresetDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ComparePresetDocumentData>, "compare_preset", Lang>;

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

type HomepageDocumentDataSlicesSlice = never

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
	 * Source FM document uid (empty if Zimoco-only) field in *Vehicle*
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
	synced_at: prismic.TimestampField;/**
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

export type AllDocumentTypes = AboutPageDocument | BrandDocument | CategoryDocument | ComparePresetDocument | ContactPageDocument | HomepageDocument | SettingsDocument | VehicleDocument;

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
			CategoryDocument,
			CategoryDocumentData,
			ComparePresetDocument,
			ComparePresetDocumentData,
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
			AllDocumentTypes
		}
	}
}
import {
	createClient as baseCreateClient,
	type ClientConfig,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import prismicConfig from "./prismic.config.json";

/**
 * SAFETY: this site may only ever read the Zimoco repository. The repo name
 * is deliberately NOT overridable from an environment variable, so it can never
 * be pointed at the live FM repo ("fmmotors") by mistake.
 */
const ALLOWED_REPOSITORY = "xcgt84rk";

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismicConfig.repositoryName;

if (repositoryName !== ALLOWED_REPOSITORY) {
	throw new Error(
		`Prismic repository must be "${ALLOWED_REPOSITORY}", got "${repositoryName}".`,
	);
}

/**
 * Cache tag for every Prismic fetch. The revalidate webhook clears this tag.
 */
export const PRISMIC_CACHE_TAG = "zimoco-prismic";

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
	const client = baseCreateClient(repositoryName, {
		routes: prismicConfig.routes,
		fetchOptions:
			process.env.NODE_ENV === 'production'
				? { next: { tags: [PRISMIC_CACHE_TAG] }, cache: 'force-cache' }
				: { next: { revalidate: 5 } },
		...config,
	});

	enableAutoPreviews({ client });

	return client;
};

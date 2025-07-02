import homepageContent from '@site/data/homepage-content.json';

// Define the structure of our content
type HomepageContent = typeof homepageContent;

// Create a recursive type to get all possible paths through the object
type PathsToStringLeaves<T> = T extends string 
  ? []
  : {
      [K in keyof T]: [K, ...PathsToStringLeaves<T[K]>]
    }[keyof T];

type Join<T extends string[], D extends string> = T extends readonly [infer F, ...infer R]
  ? F extends string
    ? R extends readonly string[]
      ? R['length'] extends 0
        ? F
        : `${F}${D}${Join<R, D>}`
      : never
    : never
  : '';

// Generate all possible dot-notation paths to string values
type ContentPaths = Join<PathsToStringLeaves<HomepageContent>, '.'>;

// Helper function to get nested value from object using dot notation
function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((current: any, key: string) => {
    return current?.[key];
  }, obj);
}

// Main translation function with type safety
export function t(key: ContentPaths): string {
  const value = getNestedValue(homepageContent, key);
  
  if (typeof value !== 'string') {
    console.error(`Translation key "${key}" does not resolve to a string value`);
    return key; // Return the key as fallback
  }
  
  return value;
}

// Helper function to get array values (for features, benefits, etc.)
export function tArray<T = any>(key: string): T[] {
  const value = getNestedValue(homepageContent, key);
  
  if (!Array.isArray(value)) {
    console.error(`Translation key "${key}" does not resolve to an array`);
    return [];
  }
  
  return value;
}

// Helper function to get object values (for complex structures)
export function tObject<T = any>(key: string): T {
  const value = getNestedValue(homepageContent, key);
  
  if (typeof value !== 'object' || value === null) {
    console.error(`Translation key "${key}" does not resolve to an object`);
    return {} as T;
  }
  
  return value;
}

// Export the content directly for more complex use cases
export { homepageContent };

// Type exports for external use
export type { ContentPaths, HomepageContent };
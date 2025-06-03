import i18n from "@/i18n";

// this handler is used to handle the messages, only for the messages object
const handler = {
  get(target: any, key: string) {
    // Check if the key exists in the target object
    if (key in target) {
      const value = target[key];

      // Construct the path correctly
      const path = target._path ? `${target._path}.${key}` : key;

      // If the value is an object, return a new proxy to handle nested properties
      if (typeof value === "object" && value !== null) {
        return new Proxy({ ...value, _path: path }, handler);
      }

      // For primitive values, apply the transformation
      return i18n.t(`messages.${path.toLowerCase()}`);
    }

    // Handle undefined keys
    return `No message defined for key: ${key}`;
  },
};

// Define the base object
const BASE_MESSAGES = {
  ERROR: {
    DEFAULT: "An error occurred",
  },
  SUCCESS: {
    DEFAULT: "Operation completed successfully",
  },
};

// Create a proxy for the base object
export const MESSAGES = new Proxy({ ...BASE_MESSAGES, _path: "" }, handler);

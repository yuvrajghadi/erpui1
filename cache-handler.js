const { IncrementalCache } = require('next/dist/server/lib/incremental-cache');

module.exports = class CustomCacheHandler {
  constructor(options) {
    this.options = options;
    this.cache = new Map();
  }

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, data, ctx) {
    this.cache.set(key, {
      value: data,
      lastModified: Date.now(),
    });
  }

  async revalidateTag(tag) {
    // Handle tag-based revalidation
    for (const [key, value] of this.cache.entries()) {
      if (value.tags && value.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }
};

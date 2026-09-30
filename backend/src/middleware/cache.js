const cacheStore = new Map();

function set(key, value, ttlMs = 60000) {
  const expireAt = Date.now() + ttlMs;
  cacheStore.set(key, { value, expireAt });
}

function get(key) {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expireAt) {
    cacheStore.delete(key);
    return null;
  }
  return item.value;
}

function clear() {
  cacheStore.clear();
}

function cacheMiddleware(ttlMs = 300000) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl || req.url;
    const cached = get(key);
    if (cached) {
      return res.json(cached);
    }
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      set(key, data, ttlMs);
      return originalJson(data);
    };
    next();
  };
}

module.exports = {
  set,
  get,
  clear,
  cacheMiddleware,
};

export async function readBucketJson(bucket, key) {
  const obj = await bucket.get(key);
  if (!obj) return null;

  const text = await obj.text();
  return {
    key,
    raw: text,
    json: JSON.parse(text)
  };
}

export async function objectExists(bucket, key) {
  const obj = await bucket.get(key);
  return Boolean(obj);
}

type Body = Record<string, any>;

export function bodyParser(body: string | undefined): Body {
  try {
    if (!body) return {};
    return JSON.parse(body);
  } catch (err) {
    return {};
  }
}

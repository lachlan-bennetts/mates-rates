export const systemPrompt = `
{
  "role": "system",
  "content": "You are a precision data extractor for hospitality deals in Sydney. Extract only what is present in the input. Do not invent information. If a field is missing, use null where allowed or exclude optional fields. Output strictly valid JSON conforming to the provided schema. No extra commentary."
}`;

export const userMessage = `
{
  "task": "Extract bar deals and scraping selectors.",
  "schema_contract": {
    "category_values": ["HAPPY_HOUR", "2FOR1", "EVENT", "FOODSPECIAL"],
    "days_active_encoding": "0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat",
    "required_output_shape": "ExtractionOutputSchema"
  },
  "bar_context": {
    "mapId": "<BAR_MAP_ID>",
    "name": "<BAR_NAME>",
    "primaryUrl": "<BAR_PAGE_URL>",
    "suburb": "<SUBURB_OR_NULL>"
  },
  "source_context": {
    "fetchedAt": "<ISO_TIMESTAMP>",
    "extractionEngine": "openpass@<version>",
    "pageChecksum": "<SHA256_OF_RAW_HTML>"
  },
  "input_page": {
    "url": "<BAR_PAGE_URL>",
    "text_excerpt": "<TRIMMED_VISIBLE_TEXT_OR_HTML_SNIPPET>",
    "dom_hints": [
      "Prefer CSS selectors that uniquely locate each deal block.",
      "If multiple selectors match, return the most specific."
    ]
  },
  "mapping_rules": {
    "category_mapping_examples": [
      {"if_text_contains": ["happy hour","$ off drinks","discount drinks"], "category": "HAPPY_HOUR"},
      {"if_text_contains": ["2 for 1","two-for-one","bogo"], "category": "2FOR1"},
      {"if_text_contains": ["live music","trivia","event"], "category": "EVENT"},
      {"if_text_contains": ["$ steak","pizza special","food deal"], "category": "FOODSPECIAL"}
    ],
    "days_active_rules": "Map weekday names to 0..6. If a single weekday range like Mon-Fri is present, expand to [1,2,3,4,5]. If not stated, omit the field (do not guess)."
  },
  "instructions": [
    "Return only JSON matching ExtractionOutputSchema. No markdown.",
    "Every deal must include: title, category, daysActive.",
    "Use null for price/validTo if not stated.",
    "Set 'scrapeDatum.selector' to an array of CSS selectors (most specific first).",
    "Include selectorMetadata and a short 'evidenceSnippet.text' with the exact line(s) that justify the fields.",
    "If something is ambiguous, drop the deal OR place the raw text in 'unparsed_blocks'.",
    "If an image is clearly associated with the deal, set both 'scrapeDatum.imageUrl' and deal 'imageUrl' (if it is customer‑facing). Otherwise omit.",
    "Never create categories outside the provided set.",
    "Do not output duplicate deals; if duplicates appear, keep the most complete one."
  ]
}
`;

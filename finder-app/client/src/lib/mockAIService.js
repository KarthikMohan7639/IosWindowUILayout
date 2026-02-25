// ── MockAIService ──────────────────────────────────────────
// Returns canned responses based on keyword matching.
// Simulates a typing delay for realism.

const RESPONSES = [
  {
    keywords: ["payment", "pay", "invoice", "billing", "cost", "price"],
    answer:
      "The payment terms are **Net 30**, due within 30 days of invoice date. A **1.5% monthly late fee** applies after the due date.",
  },
  {
    keywords: ["contract", "nda", "agreement", "legal", "terms"],
    answer:
      "The NDA contract with Acme Corp covers confidentiality of proprietary data. It was signed on Feb 5 and is valid for 2 years. Key clauses include non-disclosure, non-compete (12 months), and IP assignment.",
  },
  {
    keywords: ["deadline", "due", "schedule", "timeline", "when"],
    answer:
      "Based on the project brief, the current deadline is **March 15, 2026**. The next milestone review is scheduled for March 1.",
  },
  {
    keywords: ["budget", "finance", "financial", "report", "q4", "revenue"],
    answer:
      "The Q4 financial report shows total revenue of **$2.4M** (+12% QoQ). Operating expenses were $1.8M. Net margin improved to 25%.",
  },
  {
    keywords: ["design", "figma", "ui", "ux", "system"],
    answer:
      "The design system v2 includes updated color tokens, typography scale, spacing guidelines, and 48 reusable components. It's available in the Projects folder.",
  },
  {
    keywords: ["meeting", "notes", "agenda", "minutes"],
    answer:
      "The January meeting notes cover: Q1 roadmap planning, hiring updates (3 new engineers), and the product launch timeline for April.",
  },
  {
    keywords: ["search", "find", "where", "locate", "look"],
    answer:
      'You can use the search bar at the top of the Finder window to filter files by name or tag. Try searching for keywords like "invoice" or "project".',
  },
  {
    keywords: ["help", "how", "what", "can you"],
    answer:
      "I can help you understand your files and documents. Try asking about:\n- Payment terms in contracts\n- Financial report summaries\n- Project deadlines\n- Meeting notes\n- Design system details",
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    answer:
      "Hello! I'm your AI file assistant. Ask me about any document in your file system — contracts, invoices, reports, or meeting notes.",
  },
  {
    keywords: ["delete", "remove", "trash"],
    answer:
      "To delete a file, right-click it and select **Delete** from the context menu. Deleted items are removed permanently in this version.",
  },
  {
    keywords: ["create", "new", "add", "folder", "file"],
    answer:
      'To create a new file or folder, right-click in the empty area of the file list and choose **New Folder** or **New File**. You can also use the keyboard shortcut **⇧⌘N** for a new folder.',
  },
];

const FALLBACK =
  "I'm not sure about that. Try asking about payment terms, contracts, financial reports, project deadlines, or meeting notes.";

function findResponse(message) {
  const lower = message.toLowerCase();
  for (const entry of RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return FALLBACK;
}

export function sendMessage(message) {
  return new Promise((resolve) => {
    const response = findResponse(message);
    // simulate network / AI delay (400–1200ms)
    const delay = 400 + Math.random() * 800;
    setTimeout(() => resolve(response), delay);
  });
}

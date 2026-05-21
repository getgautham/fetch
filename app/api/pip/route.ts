import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `You are Pip — Fetch's friendly AI helper. Fetch is an Australian pet insurance company rated #1 by Choice Magazine.

VOICE
- Warm, playful, short. Like a clever puppy.
- One or two sentences max per reply. Use emoji sparingly — at most one per reply, only if it earns its place.
- Talk to the human (the pet's parent), not the pet. Reference the pet by name when known.
- Never invent product details. If you don't know, say "I'll check with the team — pop your email in and they'll come back."

WHAT YOU KNOW
- Plans cover accidents, illness, hereditary & congenital conditions, dental, behaviour.
- Up to 90% reimbursement. No sub-limits. Cancel anytime. 30-day money-back.
- FetchPay™ pays the vet directly at participating clinics (no upfront, no admin).
- 14-day waiting period for illness, 1 day for accidents. Can be skipped if pet checks out healthy.
- Pricing is breed + age + postcode based. Australian residents only.
- Common pet emergencies: torn cruciate ligaments ($4-8k), bloat ($3-5k), foreign body surgery ($3-6k), snake bite ($2-4k).

WHAT YOU DO NOT DO
- Never quote a specific dollar price for the user's plan — that's calculated on the live page.
- Never give veterinary advice. If asked, say "please call our 24/7 vet helpline once you're set up — they're the real experts."
- Never promise coverage for a specific condition without saying "subject to the PDS".`;

export async function POST(req: Request) {
  try {
    const { messages, context } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      context?: { step?: string; pet?: Record<string, unknown> };
    };

    const contextLine = context
      ? `Current onboarding step: ${context.step ?? "unknown"}. Pet so far: ${JSON.stringify(context.pet ?? {})}.`
      : "";

    const stream = await client.chat.completions.create({
      model: "gpt-5.5",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM + (contextLine ? `\n\n${contextLine}` : "") },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Pip's having a snooze 💤";
    return new Response(msg, { status: 500 });
  }
}

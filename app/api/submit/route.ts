import OpenAI from "openai";
import Airtable from "airtable";

export const runtime = "nodejs";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

type Lead = {
  petName: string;
  species: string;
  sex: string;
  breed: string;
  dob: string;
  source: string;
  lifestyle: string;
  address: string;
  hasInsurance: string;
  morePets: string;
  startDate: string;
  agreed: boolean;
  declarations: string[];
};

export async function POST(req: Request) {
  let body: Lead;
  try {
    body = (await req.json()) as Lead;
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }

  // 1. Personalised note from GPT-5.5
  let note = `${body.petName} is officially covered. Welcome to the pack 🩷`;
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-5.5",
      messages: [
        {
          role: "system",
          content:
            "You are Pip, Fetch's playful pet-insurance helper. Write ONE warm sentence (max 18 words) welcoming the pet by name. Reference one specific detail from their profile (breed, lifestyle, or source). No emoji at the start. End with a single pink heart emoji 🩷.",
        },
        {
          role: "user",
          content: `Pet: ${JSON.stringify(body)}. Write the welcome line.`,
        },
      ],
    });
    const out = completion.choices[0]?.message?.content?.trim();
    if (out) note = out;
  } catch {
    // keep fallback
  }

  // 2. Airtable lead write (skipped gracefully if env not configured)
  let airtableId: string | null = null;
  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME ?? "Leads";

  if (pat && baseId) {
    try {
      const base = new Airtable({ apiKey: pat }).base(baseId);
      const created = await base(tableName).create({
        "Pet name": body.petName,
        Species: body.species,
        Sex: body.sex,
        Breed: body.breed,
        DOB: body.dob,
        Source: body.source,
        Lifestyle: body.lifestyle,
        Address: body.address,
        "Has insurance": body.hasInsurance,
        "More pets": body.morePets,
        "Start date": body.startDate,
        Agreed: body.agreed,
        Declarations: body.declarations.join(", "),
        "Welcome note": note,
        Submitted: new Date().toISOString(),
      });
      airtableId = created.id;
    } catch (err) {
      console.error("airtable write failed", err);
    }
  }

  return Response.json({ note, airtableId, savedToAirtable: !!airtableId });
}

import { NextRequest, NextResponse } from 'next/server';
import {
  generateRecipeDraftFlow,
  GenerateRecipeInputSchema,
} from '@/ai/flows/generate-recipe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateRecipeInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a dish name or notes (at least 2 characters).',
        },
        { status: 400 }
      );
    }

    const draft = await generateRecipeDraftFlow(parsed.data);
    return NextResponse.json({ success: true, draft }, { status: 200 });
  } catch (error: any) {
    console.error('Error generating AI recipe draft:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          'Could not generate recipe with AI. Ensure GOOGLE_GENAI_API_KEY or GEMINI_API_KEY is configured.',
      },
      { status: 500 }
    );
  }
}


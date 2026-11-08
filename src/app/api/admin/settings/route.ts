import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { DEFAULT_SITE_SETTINGS, normalizeSiteSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/types';

const SETTINGS_FILE_PATH = path.join(process.cwd(), '.data', 'site-settings.json');

export async function readLocalSiteSettings(): Promise<SiteSettings | null> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    return normalizeSiteSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function writeLocalSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const normalized = normalizeSiteSettings(settings);
  await fs.mkdir(path.dirname(SETTINGS_FILE_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
  return normalized;
}

export async function GET() {
  const local = await readLocalSiteSettings();
  return NextResponse.json({
    success: true,
    settings: local || DEFAULT_SITE_SETTINGS,
    hasCustomLocal: Boolean(local),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = (await readLocalSiteSettings()) || DEFAULT_SITE_SETTINGS;
    const merged = normalizeSiteSettings({
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    });

    const saved = await writeLocalSiteSettings(merged);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/profile');

    return NextResponse.json({ success: true, settings: saved });
  } catch (error: any) {
    console.error('Error saving site settings via API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Could not save settings.' },
      { status: 500 }
    );
  }
}


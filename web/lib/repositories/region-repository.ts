import { createClient } from '../supabase/server';
import { YGCOUNCIL_TENANT_ID } from '../config/tenant';

export interface RegionData {
  id: string;
  name: string;
  code: string;
  sortOrder: number;
}

export async function getRegions(): Promise<RegionData[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('regions')
      .select('id, name, code, sort_order')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getFallbackRegions();
    }

    return data.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      sortOrder: r.sort_order,
    }));
  } catch (err) {
    console.warn('Region query fallback used:', err);
    return getFallbackRegions();
  }
}

function getFallbackRegions(): RegionData[] {
  const names = [
    '영광읍',
    '백수읍',
    '홍농읍',
    '대마면',
    '묘량면',
    '불갑면',
    '군서면',
    '군남면',
    '염산면',
    '법성면',
    '낙월면',
  ];
  return names.map((name, idx) => ({
    id: `reg-fallback-${idx + 1}`,
    name,
    code: `4687025${idx}00`,
    sortOrder: idx + 1,
  }));
}

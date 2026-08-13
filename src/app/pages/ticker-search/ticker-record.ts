export type TickerType = 'stock' | 'etf';

export interface TickerResult {
  symbol: string;
  name: string;
  exchange: string;
  price: string;
  changePercent: number;
  type: TickerType;
}

interface CompanySeed {
  symbol: string;
  name: string;
  type: TickerType;
}

const COMPANIES: CompanySeed[] = [
  { symbol: 'AME', name: 'Ametek Inc', type: 'stock' },
  { symbol: 'NVP', name: 'Nova Photonics', type: 'stock' },
  { symbol: 'SLR', name: 'Solaris Robotics', type: 'stock' },
  { symbol: 'BLH', name: 'Brightline Health', type: 'stock' },
  { symbol: 'CSM', name: 'Cascade Materials', type: 'stock' },
  { symbol: 'ORB', name: 'Orbital Freight', type: 'stock' },
  { symbol: 'GRB', name: 'Global Robotics ETF', type: 'etf' },
  { symbol: 'CLE', name: 'Clean Energy ETF', type: 'etf' },
];

const EXCHANGES = [
  { code: 'NYSE (US)', currency: '$' },
  { code: 'BIT (IT)', currency: '€' },
  { code: 'BMV (MX)', currency: '$' },
  { code: 'VIE (AT)', currency: '€' },
  { code: 'ETR (DE)', currency: '€' },
];

export function generateMockTickers(): TickerResult[] {
  const results: TickerResult[] = [];

  COMPANIES.forEach((company, ci) => {
    const listingCount = company.type === 'etf' ? 1 : 3 + (ci % 3);

    for (let ei = 0; ei < listingCount; ei++) {
      const exchange = EXCHANGES[ei % EXCHANGES.length];
      const basePrice = 50 + ((ci * 37 + ei * 13) % 400);
      const cents = (ci * 7 + ei * 11) % 100;
      const changeSeed = (ci * 5 + ei * 3) % 7;
      const changePercent = changeSeed === 0 ? 0 : Math.round(((changeSeed - 3) / 3) * 250) / 100;
      const symbol = ei === 0 ? company.symbol : `${ei + 1}${company.symbol}`;

      results.push({
        symbol,
        name: company.name,
        exchange: exchange.code,
        price: `${exchange.currency}${basePrice.toLocaleString()}.${cents.toString().padStart(2, '0')}`,
        changePercent,
        type: company.type,
      });
    }
  });

  return results;
}

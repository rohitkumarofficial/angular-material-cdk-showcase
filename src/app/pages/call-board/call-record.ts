export type CallPriority = 'critical' | 'urgent' | 'standard';

export interface CallRecord {
  id: string;
  type: string;
  priority: CallPriority;
  elapsed: string;
  facility: string;
  unit: string;
  room: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    physician: string;
  };
  careTeam: { role: string; name: string }[];
}

const CALL_TYPES: { type: string; priority: CallPriority }[] = [
  { type: 'Rapid Response', priority: 'critical' },
  { type: 'Cardiac Alert', priority: 'critical' },
  { type: 'Assist Needed', priority: 'urgent' },
  { type: 'Fall Alert', priority: 'urgent' },
  { type: 'Equipment Request', priority: 'standard' },
  { type: 'Housekeeping', priority: 'standard' },
];

const UNITS = ['3 West - Telemetry', '4 North - Surgical', 'ICU - Bay 2', '2 East - Med/Surg'];

const PATIENT_NAMES = [
  'Maria Alvarez',
  'David Chen',
  'Priya Natarajan',
  'James O’Connor',
  'Fatima Yusuf',
  'Liam Bennett',
  'Sofia Rossi',
  'Ethan Walker',
];

const PHYSICIANS = ['Dr. R. Adeyemi', 'Dr. L. Kowalski', 'Dr. M. Suzuki', 'Dr. A. Patel'];

const CARE_TEAM_NAMES = ['J. Ramirez', 'K. Novak', 'S. Okafor', 'T. Lindqvist', 'P. Delgado'];

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function generateMockCalls(count: number, facility = 'Northbridge Health'): CallRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const callType = pick(CALL_TYPES, i);
    const patientName = pick(PATIENT_NAMES, i * 3 + 1);
    return {
      id: `call-${i}`,
      type: callType.type,
      priority: callType.priority,
      elapsed: formatElapsed((i * 47) % 900),
      facility,
      unit: pick(UNITS, i * 5 + 2),
      room: `${100 + (i % 20)} - ${(i % 4) + 1}`,
      patient: {
        name: patientName,
        age: 24 + ((i * 7) % 60),
        gender: i % 2 === 0 ? 'Female' : 'Male',
        physician: pick(PHYSICIANS, i * 2 + 1),
      },
      careTeam: [
        { role: 'RN', name: pick(CARE_TEAM_NAMES, i) },
        { role: 'PCT', name: pick(CARE_TEAM_NAMES, i + 1) },
        { role: 'Charge', name: pick(CARE_TEAM_NAMES, i + 2) },
      ],
    };
  });
}

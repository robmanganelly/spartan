import { BrnTimeInput } from './lib/brn-time-input';
import { BrnTimeInputSegment } from './lib/brn-time-input-segment';

export * from './lib/brn-time-input';
export * from './lib/brn-time-input-segment';
export * from './lib/brn-time-input.token';

export const BrnTimeInputImports = [BrnTimeInput, BrnTimeInputSegment] as const;

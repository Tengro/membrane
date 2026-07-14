/**
 * Regression: a cache breakpoint must never land on a thinking block.
 *
 * The API rejects `cache_control` on thinking / redacted_thinking with
 * 400 "thinking.cache_control: Extra inputs are not permitted". The rule was
 * fixed in NativeFormatter (2026-07-01) but NOT in Membrane.buildNativeToolRequest
 * — the live Connectome path — so the 400 returned on 2026-07-14 the moment a
 * breakpoint landed on a thinking-terminated turn. One shared helper now.
 */
import { describe, it, expect } from 'vitest';
import { lastCacheableBlockIndex } from './formatters/native.js';

describe('lastCacheableBlockIndex', () => {
  it('steps back past a trailing thinking block', () => {
    expect(lastCacheableBlockIndex([
      { type: 'text', text: 'hi' },
      { type: 'thinking', thinking: '', signature: 'sig' },
    ])).toBe(0);
  });

  it('skips the breakpoint entirely for a thinking-only message', () => {
    expect(lastCacheableBlockIndex([
      { type: 'thinking', thinking: '', signature: 'sig' },
      { type: 'redacted_thinking', data: 'x' },
    ])).toBe(-1);
  });

  it('uses the last block when it is cacheable', () => {
    expect(lastCacheableBlockIndex([
      { type: 'thinking', thinking: '', signature: 'sig' },
      { type: 'tool_use', name: 't', input: {} },
    ])).toBe(1);
  });
});

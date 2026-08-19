import { afterEach, describe, expect, it, vi } from 'vitest';
import { getContactChannels } from './contact';

describe('getContactChannels', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('falls back to the default Instagram handle when none is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_INSTAGRAM_HANDLE', '');

    const { instagram } = getContactChannels();

    expect(instagram).toEqual({ label: '@trabalharn', href: 'https://instagram.com/trabalharn' });
  });

  it('normalizes a configured handle that is missing the "@" prefix', () => {
    vi.stubEnv('NEXT_PUBLIC_INSTAGRAM_HANDLE', 'outrahandle');

    const { instagram } = getContactChannels();

    expect(instagram).toEqual({ label: '@outrahandle', href: 'https://instagram.com/outrahandle' });
  });

  it('omits the WhatsApp channel when no number is configured', () => {
    vi.stubEnv('CONTACT_WHATSAPP_NUMBER', '');

    const { whatsapp } = getContactChannels();

    expect(whatsapp).toBeNull();
  });

  it('builds a wa.me link stripping non-digit characters from the configured number', () => {
    vi.stubEnv('CONTACT_WHATSAPP_NUMBER', '(84) 99999-0000');

    const { whatsapp } = getContactChannels();

    expect(whatsapp).toEqual({ label: '(84) 99999-0000', href: 'https://wa.me/84999990000' });
  });

  it('omits the e-mail channel when none is configured', () => {
    vi.stubEnv('CONTACT_EMAIL', '');

    const { email } = getContactChannels();

    expect(email).toBeNull();
  });

  it('builds a mailto link when an e-mail is configured', () => {
    vi.stubEnv('CONTACT_EMAIL', 'contato@trabalharn.com.br');

    const { email } = getContactChannels();

    expect(email).toEqual({ label: 'contato@trabalharn.com.br', href: 'mailto:contato@trabalharn.com.br' });
  });
});

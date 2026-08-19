export interface ContactChannel {
  label: string;
  href: string;
}

export interface ContactChannels {
  instagram: ContactChannel;
  whatsapp: ContactChannel | null;
  email: ContactChannel | null;
}

const DEFAULT_INSTAGRAM_HANDLE = '@trabalharn';

function buildInstagramChannel(handle: string): ContactChannel {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  return {
    label: normalizedHandle,
    href: `https://instagram.com/${normalizedHandle.slice(1)}`,
  };
}

function buildWhatsappChannel(rawNumber: string | undefined): ContactChannel | null {
  if (!rawNumber) {
    return null;
  }
  const digitsOnly = rawNumber.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }
  return { label: rawNumber, href: `https://wa.me/${digitsOnly}` };
}

function buildEmailChannel(address: string | undefined): ContactChannel | null {
  if (!address) {
    return null;
  }
  return { label: address, href: `mailto:${address}` };
}

export function getContactChannels(): ContactChannels {
  return {
    instagram: buildInstagramChannel(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || DEFAULT_INSTAGRAM_HANDLE),
    whatsapp: buildWhatsappChannel(process.env.CONTACT_WHATSAPP_NUMBER),
    email: buildEmailChannel(process.env.CONTACT_EMAIL),
  };
}

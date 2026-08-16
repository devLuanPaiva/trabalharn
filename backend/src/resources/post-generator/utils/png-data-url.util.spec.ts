import { toPngDataUrl } from './png-data-url.util';

describe('toPngDataUrl', () => {
  it('encodes the buffer as a base64 PNG data URL', () => {
    const buffer = Buffer.from([1, 2, 3]);

    expect(toPngDataUrl(buffer)).toBe(
      `data:image/png;base64,${buffer.toString('base64')}`,
    );
  });
});

import { PostGeneratorFontRepository } from './post-generator-font.repository';

const registerFromPathMock = jest.fn();

jest.mock('@napi-rs/canvas', () => ({
  GlobalFonts: {
    registerFromPath: (...args: unknown[]) => registerFromPathMock(...args),
  },
}));

describe('PostGeneratorFontRepository', () => {
  beforeEach(() => {
    registerFromPathMock.mockClear();
  });

  it('registers every brand font weight on the first call', () => {
    const repository = new PostGeneratorFontRepository();

    repository.registerBrandFonts();

    expect(registerFromPathMock).toHaveBeenCalledTimes(2);
    registerFromPathMock.mock.calls.forEach(([path, family]) => {
      expect(String(path)).toMatch(/poppins-(medium|bold)\.woff2$/);
      expect(family).toBe('Poppins');
    });
  });

  it('does not register fonts again on subsequent calls', () => {
    const repository = new PostGeneratorFontRepository();

    repository.registerBrandFonts();
    repository.registerBrandFonts();
    repository.registerBrandFonts();

    expect(registerFromPathMock).toHaveBeenCalledTimes(2);
  });
});

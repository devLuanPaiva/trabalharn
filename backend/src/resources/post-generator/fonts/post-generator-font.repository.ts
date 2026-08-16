import { Injectable } from '@nestjs/common';
import { GlobalFonts } from '@napi-rs/canvas';
import {
  BRAND_FONT_ASSET_PATHS,
  BRAND_FONT_FAMILY_NAME,
} from '../rendering/fonts.constant';

@Injectable()
export class PostGeneratorFontRepository {
  private fontsRegistered = false;

  registerBrandFonts(): void {
    if (this.fontsRegistered) {
      return;
    }

    Object.values(BRAND_FONT_ASSET_PATHS).forEach((fontFilePath) => {
      GlobalFonts.registerFromPath(fontFilePath, BRAND_FONT_FAMILY_NAME);
    });

    this.fontsRegistered = true;
  }
}

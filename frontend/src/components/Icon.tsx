import { ICONS } from '@/icons';
import { SvgXml } from 'react-native-svg';

type IconName = keyof typeof ICONS;

/** Recolor single-color glyphs (black fills/strokes) to match active/inactive tab states. */
function tint(xml: string, color: string): string {
  return xml.replace(/(fill|stroke)="(black|#000000|#000)"/g, `$1="${color}"`);
}

export function Icon({
  name,
  color,
  width,
  height,
  scale = 1,
}: {
  name: IconName;
  color?: string;
  width?: number;
  height?: number;
  scale?: number;
}) {
  const icon = ICONS[name];
  const xml = color ? tint(icon.xml, color) : icon.xml;
  return (
    <SvgXml
      xml={xml}
      width={(width ?? icon.width) * scale}
      height={(height ?? icon.height) * scale}
    />
  );
}

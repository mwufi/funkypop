import React from 'react';
import { SubtitleStyle } from '@/types/subtitles';
import * as TextStyles from '@/remotion/MyComp/subtitles/TextStyles';

interface StylePreviewProps {
  style: SubtitleStyle;
  isSelected: boolean;
  onClick: () => void;
}

const PREVIEW_TEXT = "Preview Text";

const StylePreview: React.FC<StylePreviewProps> = ({ style, isSelected, onClick }) => {
  // Convert style name to component name (e.g., 'tiktok-black' -> 'TiktokBlack')
  const componentName = style.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const StyleComponent = TextStyles[componentName as keyof typeof TextStyles];

  return (
    <div
      className={`relative cursor-pointer rounded-lg overflow-hidden bg-gray-800 p-4 h-24
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center scale-50 transform">
        <StyleComponent x={50} y={50} fontSize={40}>
          {PREVIEW_TEXT}
        </StyleComponent>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs">
        {style}
      </div>
    </div>
  );
};

const AVAILABLE_STYLES: SubtitleStyle[] = [
  'tiktok-black',
  'tiktok-white-border',
  'tiktok-white',
  'shadow',
  'uppercase',
  'laura',
  'logan',
  'enrico',
  'mike',
  'devin',
  'hormozi',
  'masi',
  'ali'
];

export const StyleSelector: React.FC<{
  selectedStyle: SubtitleStyle;
  onStyleSelect: (style: SubtitleStyle) => void;
}> = ({
  selectedStyle,
  onStyleSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {AVAILABLE_STYLES.map((style) => (
        <StylePreview
          key={style}
          style={style}
          isSelected={selectedStyle === style}
          onClick={() => onStyleSelect(style)}
        />
      ))}
    </div>
  );
};

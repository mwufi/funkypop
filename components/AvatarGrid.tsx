import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarGridProps {
  selectedAvatar: number | null;
  onSelect: (avatarNumber: number) => void;
}
export function AvatarGrid({ selectedAvatar, onSelect }: AvatarGridProps) {
  const avatarNumbers = Array.from({ length: 30 }, (_, i) => i + 1)
    .filter(num => ![16, 17, 21, 29, 37, 39, 40].includes(num));

  return (
    <div className="grid grid-cols-6 gap-2 p-2">
      {avatarNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onSelect(number)}
          className={cn(
            "relative w-full aspect-square rounded-lg overflow-hidden border-2",
            selectedAvatar === number ? "border-blue-500" : "border-transparent"
          )}
        >
          <Image
            src={`https://ynxmunrlesicnfibjctb.supabase.co/storage/v1/object/public/project-images/funkypop-public/images/${number}.png`}
            alt={`Avatar ${number}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}

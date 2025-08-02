"use client";

import Image from "next/image";

interface UserAvatarProps {
  name: string;
  image?: string;
  online?: boolean;
}

export default function UserAvatar({ name, image, online }: UserAvatarProps) {
  return (
    <div className="relative w-6 h-6 figma-transition-fast figma-hover-scale" title={name}>
      {image ? (
        <Image src={image} alt={name} fill className="rounded-full object-cover" />
      ) : (
        <div className="w-full h-full rounded-full bg-[var(--figma-border)] flex items-center justify-center text-xs text-[var(--figma-text)]">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-[var(--figma-bg)]" />
      )}
    </div>
  );
}


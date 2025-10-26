'use client';

import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface UserProfileProps {
  user: User;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function UserProfile({ 
  user, 
  variant = 'default',
  className = '' 
}: UserProfileProps) {
  const userMetadata = user.user_metadata;
  const displayName = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0] || 'Usuário';
  const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;
  const email = user.email;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{displayName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={displayName}
          width={64}
          height={64}
          className="rounded-full"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-2xl font-medium">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {displayName}
        </h3>
        {email && (
          <p className="text-sm text-gray-600 truncate">
            {email}
          </p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Conectado
          </span>
          {userMetadata?.provider && (
            <span className="text-xs text-gray-500">
              via {userMetadata.provider === 'google' ? 'Google' : userMetadata.provider}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
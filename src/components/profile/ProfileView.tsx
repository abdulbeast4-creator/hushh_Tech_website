import { useEffect, useState } from 'react';
import { User, Mail, Phone, Building2, AlertCircle } from 'lucide-react';
import config from '../../resources/config/config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileViewProps {
  userId: string;
}

interface ProfileData {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organisation: string | null;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
// Mirrors the loaded layout exactly — zero layout shift when data arrives.
// Uses only Tailwind's built-in animate-pulse; no custom CSS or variables.

const ProfileSkeleton = (): JSX.Element => (
  <div
    role="status"
    aria-label="Loading profile"
    aria-busy="true"
    className="w-full max-w-2xl mx-auto px-4 sm:px-0 space-y-4 animate-pulse"
  >
    {/* Header card */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200" />
        <div className="flex flex-col items-center sm:items-start gap-2 w-full pt-1">
          <div className="h-5 w-44 bg-gray-200 rounded-md" />
          <div className="h-3.5 w-28 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>

    {/* Contact grid — matches grid-cols-1 md:grid-cols-2 */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
      <div className="h-2.5 w-14 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-ios-gray-bg space-y-2">
          <div className="h-2 w-8 bg-gray-300 rounded" />
          <div className="h-4 w-40 bg-gray-300 rounded" />
        </div>
        <div className="p-4 rounded-xl bg-ios-gray-bg space-y-2">
          <div className="h-2 w-8 bg-gray-300 rounded" />
          <div className="h-4 w-28 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Info Card ────────────────────────────────────────────────────────────────

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-ios-gray-bg">
    <span className="text-hushh-blue mt-0.5 flex-shrink-0" aria-hidden="true">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold text-hushh-text-muted uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-ios-dark truncate">{value}</p>
    </div>
  </div>
);

// ─── ProfileView ───────────────────────────────────────────────────────────────

export function ProfileView({ userId }: ProfileViewProps): JSX.Element {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  // Initialise to true only when a fetch is possible — avoids calling setState
  // synchronously inside the effect (react-hooks/set-state-in-effect).
  const [loading, setLoading] = useState<boolean>(Boolean(userId && config.supabaseClient));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !config.supabaseClient) return;

    let cancelled = false;

    const fetchProfile = async (): Promise<void> => {
      try {
        const [{ data: authData, error: authErr }, { data: onboarding, error: onboardingErr }] =
          await Promise.all([
            config.supabaseClient.auth.getUser(),
            config.supabaseClient
              .from('onboarding_data')
              .select('legal_first_name, legal_last_name, phone_number, phone_country_code')
              .eq('user_id', userId)
              .maybeSingle(),
          ]);

        if (authErr) throw authErr;
        if (onboardingErr && onboardingErr.code !== 'PGRST116') throw onboardingErr;
        if (cancelled) return;

        const user = authData?.user;
        const firstName: string = onboarding?.legal_first_name ?? '';
        const lastName: string = onboarding?.legal_last_name ?? '';

        setProfile({
          name:
            [firstName, lastName].filter(Boolean).join(' ') ||
            user?.email?.split('@')[0] ||
            'User',
          email: user?.email ?? '',
          phoneCountryCode: onboarding?.phone_country_code ?? '',
          phoneNumber: onboarding?.phone_number ?? '',
          organisation:
            (user?.user_metadata?.company as string | undefined) ??
            (user?.user_metadata?.organization as string | undefined) ??
            null,
        });
      } catch (err) {
        console.error('[ProfileView]', err);
        if (!cancelled) setError('Unable to load profile. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-ios-red flex-shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700">{error ?? 'No profile data found.'}</p>
        </div>
      </div>
    );
  }

  const { name, email, phoneCountryCode, phoneNumber, organisation } = profile;
  const phoneDisplay =
    phoneNumber.length > 0 ? `${phoneCountryCode} ${phoneNumber}`.trim() : '—';

  return (
    <section
      aria-label="User Profile"
      className="w-full max-w-2xl mx-auto px-4 sm:px-0 space-y-4"
    >
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-full bg-ios-gray-bg flex items-center justify-center"
            aria-hidden="true"
          >
            <User className="w-8 h-8 text-hushh-text-muted" />
          </div>
          <div className="text-center sm:text-left min-w-0">
            <h2 className="text-lg font-semibold text-ios-dark truncate">{name}</h2>
            {organisation != null && organisation.length > 0 && (
              <p className="flex items-center justify-center sm:justify-start gap-1 text-sm text-hushh-text-muted mt-1">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{organisation}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact — grid-cols-1 mobile, grid-cols-2 md+ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
        <h3 className="text-[11px] font-semibold text-hushh-text-muted uppercase tracking-widest mb-4">
          Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={<Mail className="w-4 h-4" />} label="Email" value={email || '—'} />
          <InfoCard icon={<Phone className="w-4 h-4" />} label="Phone" value={phoneDisplay} />
        </div>
      </div>
    </section>
  );
}

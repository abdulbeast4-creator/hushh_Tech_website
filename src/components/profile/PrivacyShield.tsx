import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrivacyShieldProps {
  email: string;
  phone: string;
}

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  /** Descriptive label read by screen readers, e.g. "Toggle email address visibility" */
  ariaLabel: string;
}

interface VisibilityRowProps {
  id: string;
  fieldLabel: string;
  value: string;
  masked: string;
  visible: boolean;
  onToggle: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const maskEmail = (email: string): string => {
  const atIdx = email.indexOf('@');
  if (atIdx < 0) return '••••••••';
  return `${'•'.repeat(Math.min(atIdx, 6))}@${email.slice(atIdx + 1)}`;
};

const maskPhone = (phone: string): string =>
  '•'.repeat(Math.min(phone.replace(/\D/g, '').length, 10));

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
// Uses role="switch" (ARIA spec for binary on/off controls) with aria-checked
// so screen readers announce "on" / "off" rather than "checked" / "unchecked".

const ToggleSwitch = ({ id, checked, onChange, ariaLabel }: ToggleSwitchProps) => (
  <label
    htmlFor={id}
    className="relative inline-flex items-center cursor-pointer flex-shrink-0"
  >
    <input
      id={id}
      type="checkbox"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    {/* Track */}
    <span className="w-10 h-6 rounded-full bg-gray-200 transition-colors peer-checked:bg-ios-green peer-focus-visible:ring-2 peer-focus-visible:ring-ios-green peer-focus-visible:ring-offset-2" />
    {/* Thumb */}
    <span className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
  </label>
);

// ─── Visibility Row ────────────────────────────────────────────────────────────

const VisibilityRow = ({
  id,
  fieldLabel,
  value,
  masked,
  visible,
  onToggle,
}: VisibilityRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div className="min-w-0 mr-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
        {fieldLabel}
      </p>
      <p className="text-sm font-medium text-gray-900 truncate">
        {visible ? value : masked}
      </p>
    </div>

    <div className="flex items-center gap-2 flex-shrink-0">
      {visible ? (
        <Eye className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
      ) : (
        <EyeOff className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
      )}
      <ToggleSwitch
        id={id}
        checked={visible}
        onChange={onToggle}
        ariaLabel={`Toggle ${fieldLabel.toLowerCase()} visibility`}
      />
    </div>
  </div>
);

// ─── PrivacyShield ─────────────────────────────────────────────────────────────

export function PrivacyShield({ email, phone }: PrivacyShieldProps): JSX.Element {
  const [showEmail, setShowEmail] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(true);

  const liveStatus: string =
    showEmail && showPhone
      ? 'All contact fields visible'
      : [
          !showEmail ? 'Email hidden' : '',
          !showPhone ? 'Phone hidden' : '',
        ]
          .filter(Boolean)
          .join(', ');

  return (
    <section
      aria-label="Visibility Controls"
      className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-soft p-5"
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
        Visibility Controls
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Toggle visibility for each contact field.
      </p>

      <VisibilityRow
        id="toggle-email-visibility"
        fieldLabel="Email"
        value={email}
        masked={maskEmail(email)}
        visible={showEmail}
        onToggle={() => setShowEmail((v) => !v)}
      />
      <VisibilityRow
        id="toggle-phone-visibility"
        fieldLabel="Phone"
        value={phone}
        masked={maskPhone(phone)}
        visible={showPhone}
        onToggle={() => setShowPhone((v) => !v)}
      />

      {/* aria-live region — visually hidden, screen readers announce changes here */}
      <span role="status" aria-live="polite" className="sr-only">
        {liveStatus}
      </span>
    </section>
  );
}

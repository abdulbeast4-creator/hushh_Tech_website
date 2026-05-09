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
  ariaLabel: string;
}

interface FieldRowProps {
  label: string;
  value: string;
  visible: boolean;
  masked: string;
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
    <span className="w-10 h-6 rounded-full bg-gray-200 transition-colors peer-checked:bg-ios-green peer-focus-visible:ring-2 peer-focus-visible:ring-ios-green peer-focus-visible:ring-offset-2" />
    <span className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
  </label>
);

// ─── Field Row ────────────────────────────────────────────────────────────────

const FieldRow = ({ label, value, visible, masked }: FieldRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
      {visible ? (
        <Eye className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
      ) : (
        <EyeOff className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
      )}
      <span className="text-sm font-medium text-gray-900 tabular-nums truncate max-w-[160px]">
        {visible ? value : masked}
      </span>
    </div>
  </div>
);

// ─── PrivacyShield ─────────────────────────────────────────────────────────────

export function PrivacyShield({ email, phone }: PrivacyShieldProps): JSX.Element {
  const [controlled, setControlled] = useState<boolean>(false);

  const liveStatus = controlled ? 'Data visibility restricted' : 'All fields visible';

  return (
    <section
      aria-label="Information Control"
      className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-soft p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            Information Control
          </p>
          <p className="text-xs text-gray-500 leading-tight mt-0.5">
            {controlled ? 'Data visibility restricted' : 'All contact fields visible'}
          </p>
        </div>

        <ToggleSwitch
          id="data-visibility-toggle"
          checked={controlled}
          onChange={() => setControlled((v) => !v)}
          ariaLabel={controlled ? 'Disable data visibility control' : 'Enable data visibility control'}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-1" />

      {/* Fields */}
      <FieldRow
        label="Email"
        value={email}
        visible={!controlled}
        masked={maskEmail(email)}
      />
      <FieldRow
        label="Phone"
        value={phone}
        visible={!controlled}
        masked={maskPhone(phone)}
      />

      {/* Screen reader live region */}
      <span role="status" aria-live="polite" className="sr-only">
        {liveStatus}
      </span>
    </section>
  );
}

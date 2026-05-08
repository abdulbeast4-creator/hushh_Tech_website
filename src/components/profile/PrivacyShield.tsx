import { useState } from 'react';
import { ShieldCheck, ShieldOff, Eye, EyeOff } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PrivacyShieldProps {
  email: string;
  phone: string;
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
  `${'•'.repeat(Math.min(phone.replace(/\D/g, '').length, 10))}`;

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

const ToggleSwitch = ({ id, checked, onChange, ariaLabel }: ToggleSwitchProps) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer flex-shrink-0">
    <input
      id={id}
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
    />
    <span className="w-10 h-6 rounded-full bg-gray-200 transition-colors peer-checked:bg-ios-green peer-focus-visible:ring-2 peer-focus-visible:ring-ios-green peer-focus-visible:ring-offset-1" />
    <span className="absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
  </label>
);

// ─── Field Row ────────────────────────────────────────────────────────────────

const FieldRow = ({ label, value, visible, masked }: FieldRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900 tabular-nums ml-4 truncate max-w-[180px]">
      {visible ? value : masked}
    </span>
  </div>
);

// ─── PrivacyShield ─────────────────────────────────────────────────────────────

export function PrivacyShield({ email, phone }: PrivacyShieldProps) {
  const [shielded, setShielded] = useState(false);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-soft p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {shielded ? (
            <ShieldCheck
              className="w-5 h-5 text-ios-green flex-shrink-0"
              aria-hidden="true"
            />
          ) : (
            <ShieldOff
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              aria-hidden="true"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              Privacy Shield
            </p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">
              {shielded ? 'Contact details are hidden' : 'Contact details are visible'}
            </p>
          </div>
        </div>

        <ToggleSwitch
          id="privacy-shield-toggle"
          checked={shielded}
          onChange={() => setShielded((v) => !v)}
          ariaLabel={shielded ? 'Disable privacy shield' : 'Enable privacy shield'}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-1" />

      {/* Fields */}
      <FieldRow
        label="Email"
        value={email}
        visible={!shielded}
        masked={maskEmail(email)}
      />
      <FieldRow
        label="Phone"
        value={phone}
        visible={!shielded}
        masked={maskPhone(phone)}
      />

      {/* Status footer */}
      <div className="mt-3 flex items-center gap-1.5">
        {shielded ? (
          <EyeOff className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
        ) : (
          <Eye className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
        )}
        <span className="text-xs text-gray-400">
          {shielded ? 'Data masking active' : 'All fields visible'}
        </span>
      </div>

    </div>
  );
}

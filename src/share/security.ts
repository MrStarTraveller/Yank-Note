export const SECURITY_SETTING_KEYS = {
  PROFILE: 'security.profile',
  TRUSTED_REPOSITORIES: 'security.trusted-repositories',
  ALLOW_THIRD_PARTY_PLUGINS: 'security.allow-third-party-plugins',
  ALLOW_MACROS: 'security.allow-macros',
  ALLOW_CODE_RUN: 'security.allow-code-run',
  ALLOW_HTML_APPLETS: 'security.allow-html-applets',
  ALLOW_TERMINAL: 'security.allow-terminal',
  ALLOW_RPC: 'security.allow-rpc',
  ALLOW_AUTO_UPDATE: 'security.allow-auto-update',
} as const

export const SECURITY_PROFILES = {
  SAFE: 'safe',
  WORKSPACE: 'workspace',
  ADVANCED: 'advanced',
} as const

export const SECURITY_TRUST_LEVELS = {
  EXTERNAL_FILE: 'external-file',
  LOCAL_WORKSPACE: 'local-workspace',
  TRUSTED_WORKSPACE: 'trusted-workspace',
} as const

export const SECURITY_DEFAULTS = {
  [SECURITY_SETTING_KEYS.PROFILE]: '',
  [SECURITY_SETTING_KEYS.TRUSTED_REPOSITORIES]: [],
  [SECURITY_SETTING_KEYS.ALLOW_THIRD_PARTY_PLUGINS]: false,
  [SECURITY_SETTING_KEYS.ALLOW_MACROS]: false,
  [SECURITY_SETTING_KEYS.ALLOW_CODE_RUN]: false,
  [SECURITY_SETTING_KEYS.ALLOW_HTML_APPLETS]: false,
  [SECURITY_SETTING_KEYS.ALLOW_TERMINAL]: false,
  [SECURITY_SETTING_KEYS.ALLOW_RPC]: false,
  [SECURITY_SETTING_KEYS.ALLOW_AUTO_UPDATE]: false,
} as const

export const SECURITY_CAPABILITIES = {
  THIRD_PARTY_PLUGINS: 'third-party-plugins',
  MACROS: 'macros',
  CODE_RUN: 'code-run',
  HTML_APPLETS: 'html-applets',
  TERMINAL: 'terminal',
  RPC: 'rpc',
  AUTO_UPDATE: 'auto-update',
} as const

export type SecurityCapability = typeof SECURITY_CAPABILITIES[keyof typeof SECURITY_CAPABILITIES]
export type SecurityProfile = typeof SECURITY_PROFILES[keyof typeof SECURITY_PROFILES]
export type SecurityTrustLevel = typeof SECURITY_TRUST_LEVELS[keyof typeof SECURITY_TRUST_LEVELS]

export function getSecuritySettingKey (capability: SecurityCapability) {
  switch (capability) {
    case SECURITY_CAPABILITIES.THIRD_PARTY_PLUGINS:
      return SECURITY_SETTING_KEYS.ALLOW_THIRD_PARTY_PLUGINS
    case SECURITY_CAPABILITIES.MACROS:
      return SECURITY_SETTING_KEYS.ALLOW_MACROS
    case SECURITY_CAPABILITIES.CODE_RUN:
      return SECURITY_SETTING_KEYS.ALLOW_CODE_RUN
    case SECURITY_CAPABILITIES.HTML_APPLETS:
      return SECURITY_SETTING_KEYS.ALLOW_HTML_APPLETS
    case SECURITY_CAPABILITIES.TERMINAL:
      return SECURITY_SETTING_KEYS.ALLOW_TERMINAL
    case SECURITY_CAPABILITIES.RPC:
      return SECURITY_SETTING_KEYS.ALLOW_RPC
    case SECURITY_CAPABILITIES.AUTO_UPDATE:
      return SECURITY_SETTING_KEYS.ALLOW_AUTO_UPDATE
    default:
      return null
  }
}

import store from '@fe/support/store'
import type { Doc } from '@fe/types'
import { isOutOfRepo } from '@fe/services/document'
import { FLAG_SAFE_MODE } from '@fe/support/args'
import { getSetting, writeSettings } from './setting'
import {
  SECURITY_CAPABILITIES,
  SECURITY_DEFAULTS,
  SECURITY_PROFILES,
  SECURITY_SETTING_KEYS,
  SECURITY_TRUST_LEVELS,
  getSecuritySettingKey,
  type SecurityCapability,
  type SecurityProfile,
  type SecurityTrustLevel,
} from '@share/security'

const TRUST_REQUIRED_CAPABILITIES = new Set<SecurityCapability>([
  SECURITY_CAPABILITIES.THIRD_PARTY_PLUGINS,
  SECURITY_CAPABILITIES.MACROS,
  SECURITY_CAPABILITIES.CODE_RUN,
  SECURITY_CAPABILITIES.HTML_APPLETS,
  SECURITY_CAPABILITIES.TERMINAL,
  SECURITY_CAPABILITIES.RPC,
])

type BuildInSecurityProfile = '' | SecurityProfile

export function isSafeModeEnabled () {
  return FLAG_SAFE_MODE
}

export function getSecurityProfile () {
  return getSetting(SECURITY_SETTING_KEYS.PROFILE as 'security.profile', SECURITY_DEFAULTS[SECURITY_SETTING_KEYS.PROFILE]) as BuildInSecurityProfile
}

export function isSecurityProfileConfigured () {
  return !!getSecurityProfile()
}

export function getTrustedRepositories () {
  return getSetting(
    SECURITY_SETTING_KEYS.TRUSTED_REPOSITORIES as 'security.trusted-repositories',
    [...SECURITY_DEFAULTS[SECURITY_SETTING_KEYS.TRUSTED_REPOSITORIES]]
  )
}

export function isTrustedRepoName (repoName?: string | null) {
  return !!repoName && getTrustedRepositories().includes(repoName)
}

export function getCurrentSecurityTrustLevel (): SecurityTrustLevel {
  if (FLAG_SAFE_MODE) {
    return SECURITY_TRUST_LEVELS.EXTERNAL_FILE
  }

  const currentFile = store.state.currentFile
  if (currentFile) {
    return getDocumentTrustLevel(currentFile)
  }

  if (isTrustedRepoName(store.state.currentRepo?.name)) {
    return SECURITY_TRUST_LEVELS.TRUSTED_WORKSPACE
  }

  if (store.state.currentRepo?.name) {
    return SECURITY_TRUST_LEVELS.LOCAL_WORKSPACE
  }

  return SECURITY_TRUST_LEVELS.EXTERNAL_FILE
}

export function getDocumentTrustLevel (doc: Doc | null | undefined): SecurityTrustLevel {
  if (!doc || FLAG_SAFE_MODE || isOutOfRepo(doc)) {
    return SECURITY_TRUST_LEVELS.EXTERNAL_FILE
  }

  return isTrustedRepoName(doc.repo)
    ? SECURITY_TRUST_LEVELS.TRUSTED_WORKSPACE
    : SECURITY_TRUST_LEVELS.LOCAL_WORKSPACE
}

export function isTrustedDocument (doc: Doc | null | undefined) {
  return getDocumentTrustLevel(doc) === SECURITY_TRUST_LEVELS.TRUSTED_WORKSPACE
}

export function shouldUseSafeMode (doc: Doc | null | undefined) {
  return FLAG_SAFE_MODE || getDocumentTrustLevel(doc) !== SECURITY_TRUST_LEVELS.TRUSTED_WORKSPACE
}

export function isCapabilityEnabled (capability: SecurityCapability, doc?: Doc | null) {
  if (FLAG_SAFE_MODE) {
    return false
  }

  const key = getSecuritySettingKey(capability)
  if (!key) {
    return false
  }

  if (!getSetting(key, SECURITY_DEFAULTS[key])) {
    return false
  }

  if (!TRUST_REQUIRED_CAPABILITIES.has(capability)) {
    return true
  }

  const trustLevel = typeof doc === 'undefined'
    ? getCurrentSecurityTrustLevel()
    : getDocumentTrustLevel(doc)

  return trustLevel === SECURITY_TRUST_LEVELS.TRUSTED_WORKSPACE
}

export function isCapabilityConfigured (capability: SecurityCapability) {
  if (FLAG_SAFE_MODE) {
    return false
  }

  const key = getSecuritySettingKey(capability)
  if (!key) {
    return false
  }

  return !!getSetting(key, SECURITY_DEFAULTS[key])
}

export function shouldLoadThirdPartyPlugins () {
  return isCapabilityEnabled(SECURITY_CAPABILITIES.THIRD_PARTY_PLUGINS)
}

export async function trustRepository (repoName: string) {
  const trustedRepositories = Array.from(new Set([...getTrustedRepositories(), repoName]))
  await writeSettings({
    [SECURITY_SETTING_KEYS.TRUSTED_REPOSITORIES]: trustedRepositories,
  })
}

export async function untrustRepository (repoName: string) {
  await writeSettings({
    [SECURITY_SETTING_KEYS.TRUSTED_REPOSITORIES]: getTrustedRepositories().filter(item => item !== repoName),
  })
}

export async function applySecurityPreset (profile: SecurityProfile) {
  const patch: Partial<Record<keyof typeof SECURITY_DEFAULTS, unknown>> = {
    [SECURITY_SETTING_KEYS.PROFILE]: profile,
  }

  if (profile === SECURITY_PROFILES.SAFE) {
    patch[SECURITY_SETTING_KEYS.ALLOW_THIRD_PARTY_PLUGINS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_MACROS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_CODE_RUN] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_HTML_APPLETS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_TERMINAL] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_RPC] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_AUTO_UPDATE] = false
  } else if (profile === SECURITY_PROFILES.WORKSPACE) {
    patch[SECURITY_SETTING_KEYS.ALLOW_THIRD_PARTY_PLUGINS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_MACROS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_CODE_RUN] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_HTML_APPLETS] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_TERMINAL] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_RPC] = false
    patch[SECURITY_SETTING_KEYS.ALLOW_AUTO_UPDATE] = true
  } else if (profile === SECURITY_PROFILES.ADVANCED) {
    patch[SECURITY_SETTING_KEYS.ALLOW_THIRD_PARTY_PLUGINS] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_MACROS] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_CODE_RUN] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_HTML_APPLETS] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_TERMINAL] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_RPC] = true
    patch[SECURITY_SETTING_KEYS.ALLOW_AUTO_UPDATE] = true
  }

  await writeSettings(patch)
}

export type { SecurityProfile }
export { SECURITY_CAPABILITIES, SECURITY_PROFILES, SECURITY_TRUST_LEVELS }

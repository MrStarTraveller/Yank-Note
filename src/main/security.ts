import * as fs from 'fs-extra'
import * as path from 'path'
import * as yargs from 'yargs'
import config from './config'
import { USER_DATA } from './constant'
import {
  SECURITY_CAPABILITIES,
  SECURITY_DEFAULTS,
  getSecuritySettingKey,
  type SecurityCapability,
} from '../share/security'

const SAFE_MODE = !!yargs.argv['safe-mode']
const AUDIT_LOG_FILE = path.join(USER_DATA, 'security-audit.log')

export function isSafeMode () {
  return SAFE_MODE
}

export function isCapabilityEnabled (capability: SecurityCapability) {
  if (SAFE_MODE) {
    return false
  }

  const key = getSecuritySettingKey(capability)
  if (!key) {
    return false
  }

  return !!config.get(key, SECURITY_DEFAULTS[key])
}

export async function auditSecurityEvent (action: string, details: Record<string, unknown> = {}) {
  try {
    await fs.ensureDir(USER_DATA)
    await fs.appendFile(AUDIT_LOG_FILE, JSON.stringify({
      at: new Date().toISOString(),
      safeMode: SAFE_MODE,
      action,
      details,
    }) + '\n')
  } catch (error) {
    console.error('security audit log failed', error)
  }
}

export async function assertCapabilityEnabled (capability: SecurityCapability, details: Record<string, unknown> = {}) {
  if (isCapabilityEnabled(capability)) {
    return
  }

  await auditSecurityEvent('capability-denied', { capability, ...details })
  throw new Error(`Security policy blocked capability: ${capability}`)
}

export { SECURITY_CAPABILITIES }

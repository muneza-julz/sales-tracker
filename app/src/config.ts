import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Base URL of the Javalin backend (ApiServer.java, port 8080).
 *
 * Auto-detected from the Metro bundler's host address, so it follows
 * whatever LAN IP this machine currently has — no manual edits needed
 * when you switch networks.
 *
 * - Physical device / Expo Go: uses this machine's LAN IP.
 * - Android emulator: 10.0.2.2 is the emulator's alias for the host.
 * - Web: localhost, since the browser runs on this machine.
 * - Fallback below is used only if hostUri is unavailable.
 */
function detectApiBase(): string {
  if (Platform.OS === 'android' && !Constants.isDevice) {
    return 'http://10.0.2.2:8080';
  }
  const hostUri = Constants.expoConfig?.hostUri; // e.g. "192.168.1.10:8081"
  if (hostUri) {
    return `http://${hostUri.split(':')[0]}:8080`;
  }
  return 'http://10.100.20.176:8080';
}

export const API_BASE_URL = detectApiBase();

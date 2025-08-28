/**
 * @description Utility function to redirect user to the correct location based on profile refs
 */
export default function getRedirectLink(profileRef: string): string {
  // we currently have scout, team, athlete and admin profiles
  // if we have more than 1 profile ref, redirect to the public portal, otherwise
  // redirect to the correct location [profileRef].thefreeagentportal.com
  if (profileRef.includes(',')) {
    return 'https://thefreeagentportal.com';
  }
  return `https://${profileRef}.thefreeagentportal.com`;
}
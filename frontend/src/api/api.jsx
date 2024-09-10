const backendDomainURL = import.meta.env.VITE_BACKEND_URL;

export const Api = {
  singUp: {
    url: `${backendDomainURL}/user/register`,
  },
  singIn: {
    url: `${backendDomainURL}/user/login`,
  },
  logout: {
    url: `${backendDomainURL}/user/logout`,
  },
  userProfile: {
    url: `${backendDomainURL}/user/:id/profile`,
  },
  updateProfile: {
    url: `${backendDomainURL}/user/profile/edit`,
  },
  suggestUsers: {
    url: `${backendDomainURL}/user/profile/suggested`,
  },
  followAndUnfollow: {
    url: `${backendDomainURL}/user/followorunfollow/:id`,
  },
};

import { OAuth2Client } from 'google-auth-library';
import Auth from '../../config/key.config';

const oauth2Client = new OAuth2Client(
  Auth.GOOGLE_CLIENT_ID,
  Auth.GOOGLE_CLIENT_SECRET,
  Auth.GOOGLE_REDIRECT_URI
);

export default oauth2Client;

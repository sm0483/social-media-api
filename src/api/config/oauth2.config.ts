import { OAuth2Client } from 'google-auth-library';
import Auth from '../../config/key.config';

const oauth2Client = new OAuth2Client(
  Auth.GOOGLE_CLIENT_ID,
  Auth.GOOGLE_CLIENT_SECRET,
  Auth.GOOGLE_REDIRECT_URI
);

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['profile', 'email'],
});

export default oauth2Client;

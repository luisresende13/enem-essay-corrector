# Google Gemini API Setup Guide

## Quick Setup

### 1. Get Your API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Add to Environment Variables

Create or update `.env.local` in the `enem-essay-corrector` directory:

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

### 3. Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
pnpm dev
```

## API Key Security

⚠️ **Important Security Notes:**

1. **Never commit** `.env.local` to version control (it's in `.gitignore`)
2. **Never share** your API key publicly
3. **Use different keys** for development and production
4. **Rotate keys** regularly for security

## API Limits (Free Tier)

Google Gemini offers generous free tier limits:

- **Rate Limit**: 15 requests per minute
- **Daily Limit**: 1,500 requests per day
- **Token Limit**: 32,000 tokens per request

For this app:
- Each evaluation uses ~1 request
- Average response time: 10-30 seconds
- Typical token usage: 1,000-2,000 tokens per evaluation

## Testing the Integration

1. Upload an essay image
2. Transcribe the text
3. Click "Avaliar Redação"
4. Wait for the evaluation (10-30 seconds)
5. View the results

If you see errors:
- Check that `GEMINI_API_KEY` is set correctly
- Verify the API key is active at https://aistudio.google.com/app/apikey
- Check the console for detailed error messages

## Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Make sure `.env.local` exists in `enem-essay-corrector/` directory
- Verify the variable name is exactly `GEMINI_API_KEY`
- Restart the development server

### Error: "API key not valid"
- Check that you copied the entire API key
- Verify the key is active in Google AI Studio
- Try generating a new API key

### Error: "Rate limit exceeded"
- Wait a minute before trying again
- Free tier has 15 requests per minute limit
- Consider upgrading for higher limits

### Evaluation takes too long
- Normal: 10-30 seconds for evaluation
- Check your internet connection
- Try using `gemini-1.5-flash` (faster) instead of `gemini-1.5-pro`

## Model Options

The app uses `gemini-1.5-flash` by default (fast and free).

To change the model, edit `lib/services/gemini.ts`:

```typescript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // or 'gemini-1.5-pro'
  // ...
});
```

**Model Comparison:**
- `gemini-1.5-flash`: Faster, cheaper, good quality
- `gemini-1.5-pro`: Slower, more expensive, best quality

## Production Deployment

For production (Vercel, etc.):

1. Add `GEMINI_API_KEY` to environment variables in your hosting platform
2. Consider using a separate API key for production
3. Monitor usage at https://aistudio.google.com/app/apikey
4. Set up rate limiting if needed

## Additional Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [API Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/rate_limits)

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify your API key is valid
3. Review the troubleshooting section above
4. Check Google AI Studio for API status

---

**Setup Complete!** 🎉

Your AI evaluation system is ready to use.
import express from 'express';
import { verify_signature } from './signature';
import { ExtRequest } from './types';

const port = process.env.SERVER_PORT || 8000;
const app = express();

// Save raw request body for signature verification
// before it gets tampered with by other middlewares
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      (req as ExtRequest).rawBody = buf.toString();
    },
  })
);

app.use(express.json());

// Log incoming request
app.use(async (req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log(`Instnt Signature: ${req.header('Instnt-Signature') || 'no'}`);
  next();
});

// Process the webhook
app.post('/webhook', async (req, res) => {
  // Base64 encoded signature
  const signature = req.header('Instnt-Signature')!;
  // Raw body of the HTTP POST request
  const rawBody = (req as ExtRequest).rawBody;

  if (verify_signature(rawBody, signature)) {
    console.log(`Event ID: ${req.body.id}`);
    console.log(`Event Timestamp: ${req.body.timestamp}`);
    console.log(`Event Type: ${req.body.event_type}`);
    console.log(`Event Name: ${req.body.event_name}`);

    //
    // Webhook processing code goes here
    //

    // Sending HTTP 200 OK
    res.status(200).json({ success: true });
  } else {
    // Signature is invalid. Sending HTTP 400 Bad Request
    res.status(400).json();
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

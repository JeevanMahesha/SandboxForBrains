import { createServer } from 'node:http';
import { CopilotRuntime, BuiltInAgent } from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';

const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model: 'google/gemini-3.8-flash',
      systemPrompt: 'You are a helpful assistant.',
    }),
  },
});

const listener = createCopilotNodeListener({
  runtime,
  basePath: '/api/copilotkit',
  cors: true,
});

const PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 8200;
createServer(listener).listen(PORT, () => {
  console.log(`CopilotKit runtime listening on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/copilotkit/info`);
});

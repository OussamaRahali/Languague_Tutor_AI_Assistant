const express = require('express');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

// Replace 'REPLACE_WITH_YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const apiKey = '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';

const openai = new OpenAI({
    apiKey: apiKey,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    console.log('Request body:', req.body);
    next();
});

app.post('/run-message', async (req, res) => {
    try {
        const { threadId, message } = req.body;

        // Check if the thread ID is provided
        if (threadId) {
            console.log(`Processing message for thread ID: ${threadId}`);

            await openai.beta.threads.messages.create(threadId, {
                role: 'user',
                content: message,
            });

            const run = await openai.beta.threads.runs.create(threadId, {
                assistant_id: 'asst_cMWKilDgGEAn6DsTo3MfPkTM',
            });

            let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

            while (runStatus.status !== 'completed') {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            }

            const messages = await openai.beta.threads.messages.list(threadId);
            const lastMessageForRun = messages.data
                .filter(
                    (msg) => msg.run_id === run.id && msg.role === 'assistant'
                )
                .pop();

            if (lastMessageForRun) {
                const response = lastMessageForRun.content[0].text.value;
                console.log(`Response for thread ID ${threadId}:`, response);
                res.json({ threadId, response });
            } else {
                console.log(`No response from the assistant for thread ID ${threadId}`);
                res.json({ threadId, response: 'No response from the assistant.' });
            }
        } else {
            // If no thread ID is provided, create a new thread
            const newThread = await openai.beta.threads.create();

            // Add the user message to the new thread
            const newThreadId = newThread.id;
            console.log(`Creating new thread with ID: ${newThreadId}`);
            await openai.beta.threads.messages.create(newThreadId, {
                role: 'user',
                content: message,
            });

            // Run the assistant on the new thread
            const run = await openai.beta.threads.runs.create(newThreadId, {
                assistant_id: 'asst_cMWKilDgGEAn6DsTo3MfPkTM',
            });

            let runStatus = await openai.beta.threads.runs.retrieve(newThreadId, run.id);

            while (runStatus.status !== 'completed') {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                runStatus = await openai.beta.threads.runs.retrieve(newThreadId, run.id);
            }

            const messages = await openai.beta.threads.messages.list(newThreadId);
            const lastMessageForRun = messages.data
                .filter(
                    (msg) => msg.run_id === run.id && msg.role === 'assistant'
                )
                .pop();

            if (lastMessageForRun) {
                const response = lastMessageForRun.content[0].text.value;
                console.log(`Response for thread ID ${newThreadId}:`, response);
                res.json({ threadId: newThreadId, response });
            } else {
                console.log(`No response from the assistant for thread ID ${newThreadId}`);
                res.json({ threadId: newThreadId, response: 'No response from the assistant.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

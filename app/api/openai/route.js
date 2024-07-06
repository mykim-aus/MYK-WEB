import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();
const assistantId = process.env.ASSISTANT_ID;

async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    return thread.id;
  } catch (error) {
    throw new Error("Failed to create thread.");
  }
}

async function createMessage(threadId, userMessage) {
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });
  } catch (error) {
    throw new Error("Failed to create message.");
  }
}

async function runAssistant(threadId) {
  try {
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });
    return run;
  } catch (error) {
    throw new Error("Failed to run assistant.");
  }
}

async function getAssistantResponse(threadId) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    for (const message of messages.data.reverse()) {
      if (message.role === "assistant") {
        return message.content[0].text.value;
      }
    }
    throw new Error("No assistant messages found.");
  } catch (error) {
    throw new Error("Failed to retrieve messages.");
  }
}

export async function POST(request) {
  try {
    const json = await request.json();
    const message = json?.message;
    let threadId = json?.thread_id;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (!threadId) {
      threadId = await createThread();
    }

    await createMessage(threadId, message);

    const run = await runAssistant(threadId);

    if (run.status === "completed") {
      const responseMessage = await getAssistantResponse(threadId);
      return NextResponse.json({
        thread_id: threadId,
        message: responseMessage,
      });
    } else {
      return NextResponse.json(
        { error: `Assistant run status: ${run.status}` },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

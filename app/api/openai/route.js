import { NextResponse } from "next/server";
import OpenAI from "openai";
import clientPromise from "../../lib/mongodb";

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

async function logErrorToMongoDB(error) {
  try {
    const client = await clientPromise;
    const db = client.db("chatLogs");
    const collection = db.collection("errors");
    await collection.insertOne({
      error: error.message,
      timestamp: new Date(),
    });
  } catch (logError) {
    console.error("Failed to log error to MongoDB:", logError);
  }
}

async function getAssistantResponse(threadId) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);

    for (const message of messages.data) {
      if (message.role === "assistant") {
        let content = message.content[0].text.value;

        content = content.replace(/【[^】]*】/g, "");
        return JSON.parse(content);
      }
    }
    throw new Error("No assistant messages found.");
  } catch (error) {
    await logErrorToMongoDB(error);
    throw new Error(
      "Failed to retrieve messages. The error has been logged. Please try again."
    );
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
      const responseObject = await getAssistantResponse(threadId);
      const { message: responseMessage, recommend } = responseObject;

      // Retrieve the client's IP address
      const ipHeader = request.headers.get("x-forwarded-for");
      const ip = ipHeader
        ? ipHeader.split(",")[0].trim()
        : request.headers.get("remote-addr");

      // Log to MongoDB
      const client = await clientPromise;
      const db = client.db("chatLogs");
      const collection = db.collection("logs");
      await collection.insertOne({
        userMessage: message,
        responseMessage,
        ip: ip,
        requestTime: new Date(),
      });

      return NextResponse.json({
        thread_id: threadId,
        message: responseMessage,
        recommend: recommend,
      });
    } else {
      return NextResponse.json(
        { error: `Assistant run status: ${run.status}` },
        { status: 500 }
      );
    }
  } catch (error) {
    await logErrorToMongoDB(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

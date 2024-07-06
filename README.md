Resume Chatbot System (MINYEONG KIM RESUME WEBSITE SAMPLE)
=====================

This project implements a chatbot using the OpenAI API Assistant to provide resume-related assistance. The system is built using Next.js 14.

[Demo : https://myk-web.vercel.app](https://myk-web.vercel.app)

Installation
------------

To get started with the Resume Chatbot System, follow these steps:

1.  Clone the repository
    
2.  Install the required dependencies:
    
    `npm install`
    
3.  Create a `.env` file in the root directory and add the following environment variables:

    ```
    OPENAI_API_KEY=your_openai_api_key
    ASSISTANT_ID=your_assistant_id
    MONGODB_URI=your_mongodb_uri
    ```
    

Usage
-----

In the Assistant, upload your introduction content in txt or pdf format. Use the following instruction for the chatbot:

```
Refer to the attached file and answer as if you are the owner of the resume. Keep your response under 500 characters. respond in the following json format and create 3 recommended messages related to the response content from resume in an array within the recommend section.  {   "message":"response message here",   "recommend":[] }

```

Error Monitoring
--------------

If an error occurs, all logs can be checked in MongoDB. Review the logs and update the instruction as necessary.

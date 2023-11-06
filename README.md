# Next JS & Open AI / GPT: Next-generation Next JS & AI apps

This is the starter repo for the [Next JS & Open AI / GPT: Next-generation Next JS & AI apps course](https://www.udemy.com/course/next-js-ai/?referralCode=CF9492ACD4991930F84E).

PROTECTING ROUTES

we need to use next js server side props with auth0 to protect our routes. For a route that needs protecting we can add.

```js
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: 'this is a test'
    }
  };
});
```

**SETTING UP THE OPENAI API ENDPOINT**

Here's a summarized step-by-step guide on setting up an OpenAI endpoint in Next.js:

1. **OpenAI Setup**:

   - Go to the OpenAI platform (platform.openai.com) and sign up for an account.
   - Once logged in, you'll see the dashboard.
   - Navigate to "View API keys" (usually under your username on the top right).
   - Create a new API key. Important: Copy and safely store the API key; you won't be able to view it again in the OpenAI platform.

2. **Next.js Environment Setup**:

   - Navigate to the `.env.local` file in your Next.js project.
   - Set a new environment variable named `openai_API_key` and assign the API key value you copied from the OpenAI dashboard.

3. **API Endpoint Creation**:

   - In the `pages/api` directory, create a new file named `generatePost.js`.
   - Initially, you can copy the example code from the existing `hello.js` API route.
   - Rename the endpoint function in `generatePost.js` to something relevant, e.g., "generatePost".

4. **Frontend Button Setup**:

   - Add a button element on your page that will trigger the API call.
   - Add an onClick event handler to the button, linking it to a function named "handleClick" or similar.
   - Inside the handleClick function, use the browser's fetch API to call the `generatePost` endpoint. Handle the asynchronous operations with `async/await`.

5. **Integrating OpenAI**:
   - Install the OpenAI API package.
   - Import necessary utilities from the package, e.g., `configuration` and `OpenAIAPI`.
   - Set up the API configuration using the environment variable for the API key.
   - Create an instance of the OpenAI API using the configuration.
   - Within the generatePost.js, set up a call to OpenAI's "create completion" API. Pass in details like the model (`text.DaVinci.03` initially), temperature (e.g., 0 for consistency), maximum tokens (e.g., 3600), and a prompt (e.g., "generate a blog post about owning dogs").

```js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  //create configuration object
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 3600,
    prompt: 'Generate a blog post about owning dogs'
  });

  console.log('response:', response);

  res.status(200).json({ name: response.data.choices });
}
```

6. **Handling the OpenAI Response**:

   - Once the API call to OpenAI resolves, extract the generated text from the response.
   - The generated text is typically found in the `choices` array of the response.
   - Return the generated text as part of the endpoint's JSON response.

7. **Displaying the Result**:
   - On the frontend, after calling the `generatePost` endpoint, extract and display the generated text from the response underneath the generate button.

By following these steps, you will have integrated the OpenAI API into a Next.js application, allowing you to generate text based on given prompts.

**REFINING THE API CALL AND PROMPT**

---

In this tutorial, the goal is to refine an OpenAI API call in a project.

1. **Purpose**: The API call should ideally return three results: an SEO-friendly title, meta description, and an HTML-formatted blog post.
2. **Implementation**:
   - Modify the prompt for better results.
   - Use back ticks for multiple line prompts.
   - The new prompt will instruct the API to write an SEO-friendly blog post about a specific topic.
   - Example prompt: "Write a detailed SEO-friendly blog post about Top Ten Tips for Dog Owners that targets keywords."
   - Keywords, such as "first-time dog owners", "common dog health issues", and "best dog breeds" will be hardcoded initially.
   - Further instructions are given to format content in SEO-friendly HTML and to include an HTML title and meta description.
   - The expected return format is stringified JSON, with specific formatting instructions provided.
3. **API Endpoint**: The "Create Completion" endpoint for OpenAI will process these instructions.
4. **Frontend Interaction**:
   - The returned data will be logged and displayed beneath a "Generate" button on a webpage.
   - JSON parsing is used to handle the returned stringified JSON from the API call.
   - The content is rendered on the webpage, with formatting considerations using CSS.
5. **Errors & Resolutions**:
   - Issues with invalid JSON characters (like newline characters) are addressed.
   - Styling and user input flexibility (not hardcoding topics and keywords) will be discussed in the next lecture.

---

In generatePost.js

```js
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  //create configuration object
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(config);

  const topic = 'Top 10 tips for dog owners';
  const keywords =
    'first-time dog owners, common dog health issues, best dog breeds';

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    temperature: 0,
    max_tokens: 3600,
    prompt: `Write a long an detailed SEO-friendly blog post about ${topic}, that targets the following comma-seperated keywords: ${keywords}. The content shoould be formatted in SEO-friendly HTML. The response must include appropriate HTML title and meta description content. The return format must be stringified JSON in the following format:
    {
      "postContent": post content here
      "title": title goes here
      "metaDescription": meta description goes here
    }`
  });

  console.log('response:', response);
  //will return some \n characters which will not be recognised as valid json, so we need to spit and join to remove them.
  res.status(200).json({
    post: JSON.parse(response.data.choices[0]?.text.split('\n').join(''))
  });
}
```

In new.js

```js
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { AppLayout } from '../../components/AppLayout';
import { useState } from 'react';

export default function NewPost(props) {
  //console.log(props);
  const [postContent, setPostContent] = useState('');
  const handleClick = async () => {
    const response = await fetch(`/api/generatePost`, {
      method: 'POST'
    });
    const json = await response.json();
    console.log('RESULT:', json.post.postContent);
    setPostContent(json.post.postContent);
  };
  return (
    <div>
      <h1>this is the new post page</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <div
        className="max-w-screen-sm p-10"
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
```

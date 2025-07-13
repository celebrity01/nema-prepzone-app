import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Question, Scenario } from "../types";
import { getStaticScenarioImage } from "./staticImageService";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.error("VITE_API_KEY environment variable is not set.");
  throw new Error("VITE_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The scenario question for the user.",
    },
    choices: {
      type: Type.ARRAY,
      description:
        "An array of 2 to 3 possible actions for the user to choose from.",
      items: { type: Type.STRING },
    },
    correctChoiceIndex: {
      type: Type.INTEGER,
      description:
        "The 0-based index of the correct choice in the 'choices' array. This choice must be the objectively safest and best practice.",
    },
    feedback: {
      type: Type.ARRAY,
      description:
        "An array of feedback strings, one for each choice, in the same order. Explain why each choice is good or bad in a supportive, educational tone.",
      items: { type: Type.STRING },
    },
  },
  required: ["question", "choices", "correctChoiceIndex", "feedback"],
};

const briefingAndQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    briefing: {
      type: Type.STRING,
      description:
        "A short, one or two-sentence dramatic and immersive description of the emergency scenario, setting the scene for the user. This will be shown before the first question.",
    },
    questionData: questionSchema,
  },
  required: ["briefing", "questionData"],
};

function getSystemInstruction() {
  return `You are an AI assistant for Nigeria's National Emergency Management Agency (NEMA). Your role is to create educational disaster preparedness game scenarios. Generate a question and multiple-choice answers for the given disaster type. One choice must be the safest and correct action according to NEMA guidelines. The other choices should represent common but dangerous mistakes. Provide brief, clear feedback for each choice. The tone should be serious, educational, and supportive. Ensure the scenarios are culturally relevant to Nigeria.`;
}

const generateImage = async (categoryTitle: string): Promise<string> => {
  return await getStaticScenarioImage(categoryTitle);
};

const generateBriefingAndQuestion = async (
  categoryTitle: string,
): Promise<{ briefing: string; questionData: Question }> => {
  try {
    const prompt = `Create the first challenging scenario for '${categoryTitle}'. Provide a brief, immersive setup description and the first question with choices and feedback.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: briefingAndQuestionSchema,
      },
    });

    let text = response.text.trim();
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    }

    const data = JSON.parse(text);
    const questionData = data.questionData;

    if (
      !data.briefing ||
      !questionData ||
      !questionData.question ||
      !questionData.choices ||
      questionData.choices.length < 2 ||
      questionData.feedback.length !== questionData.choices.length
    ) {
      throw new Error(
        "Received invalid briefing or question data structure from AI.",
      );
    }

    return data as { briefing: string; questionData: Question };
  } catch (error) {
    console.error("Error generating briefing and question:", error);
    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse the AI's response for briefing/question. The data was not valid JSON.",
      );
    }
    throw new Error("Failed to generate initial scenario content.");
  }
};

const generateQuestion = async (
  categoryTitle: string,
  context?: string,
): Promise<Question> => {
  try {
    const prompt = context
      ? `The scenario is '${categoryTitle}'. Here is what just happened: ${context}. Now, create the next logical question and choices in this scenario.`
      : `Create the first challenging scenario question for: '${categoryTitle}'.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    let text = response.text.trim();
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    }

    const questionData = JSON.parse(text);

    if (
      !questionData.question ||
      !questionData.choices ||
      questionData.choices.length < 2 ||
      questionData.feedback.length !== questionData.choices.length
    ) {
      throw new Error("Received invalid question data structure from AI.");
    }

    return questionData as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse the AI's response. The data was not valid JSON.",
      );
    }
    throw new Error("Failed to generate scenario question.");
  }
};

export const generateInitialScenario = async (
  categoryTitle: string,
  promptDetail: string,
): Promise<Scenario> => {
  try {
    // Run sequentially to avoid potential stream conflicts
    const content = await generateBriefingAndQuestion(categoryTitle);
    const imageB64 = await generateImage(categoryTitle);
    return {
      imageB64,
      briefing: content.briefing,
      questionData: content.questionData,
    };
  } catch (error) {
    console.error("Error in generateInitialScenario:", error);
    throw error;
  }
};

export const generateNextQuestion = async (
  categoryTitle: string,
  context: string,
): Promise<Question> => {
  return generateQuestion(categoryTitle, context);
};

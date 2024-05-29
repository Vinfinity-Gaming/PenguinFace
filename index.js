const ENDPOINT_URL = "https://vinfinity-mixtral-8x7b-instruct-fastapi.hf.space";

class PenguinGPT {
    constructor() {
        this.history = [];
        this.templates = [
            ["Hello.", "Greetings! How can I assist you today?", "Can you help me find something?", "Of course! What are you looking for?"],
            ["What is the capital of France?", "The capital of France is Paris. How else can I help you?"]
        ];
    }

    async generateResponse(args) {
        const payload = {
            input: args.INPUT,
            history: this.history,
            templates: this.templates,
            system_prompt: "You are a helpful assistant.",
            system_output: "I am a helpful assistant!",
            temperature: 0.0,
            max_new_tokens: 100,
            top_p: 0.15,
            repetition_penalty: 1.0
        };

        try {
            const response = await fetch(ENDPOINT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.history.push([args.INPUT, data.response.output]);
            return data.response.output;
        } catch (error) {
            console.error("Error fetching response from Hugging Face:", error);
            return "Error: Unable to fetch response";
        }
    }
}

(function(Scratch) {
    'use strict';
    const penguinGPT = new PenguinGPT();
    Scratch.extensions.register({
        name: 'PenguinGPT',
        blocks: [
            {
                opcode: 'generateResponse',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Generate response for [INPUT]',
                arguments: {
                    INPUT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'Tell me a joke'
                    }
                }
            }
        ],
        menus: {},
        generateResponse: (args) => penguinGPT.generateResponse(args)
    });
})(Scratch);

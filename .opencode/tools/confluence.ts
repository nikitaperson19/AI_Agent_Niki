import { tool } from "@opencode-ai/plugin"

export default tool({
    description: "Получить страницу Confluence по pageId",

    args: {
        pageId: tool.schema.string()
    },

    async execute(args) {
        const baseUrl = process.env.CONFLUENCE_URL
        const email = process.env.CONFLUENCE_EMAIL
        const token = process.env.CONFLUENCE_API_TOKEN

        if (!baseUrl || !email || !token) {
            throw new Error("Не заданы переменные окружения Confluence")
        }

        const auth = Buffer.from(`${email}:${token}`).toString("base64")

        const response = await fetch(
            `${baseUrl}/wiki/api/v2/pages/${args.pageId}?body-format=storage`,
            {
                method: "GET",
                headers: {
                    Authorization: `Basic ${auth}`,
                    Accept: "application/json"
                }
            }
        )

        if (!response.ok) {
            throw new Error(
                `Confluence API error: ${response.status} ${response.statusText}`
            )
        }

        const data = await response.json()

        return JSON.stringify(data)
    }
})
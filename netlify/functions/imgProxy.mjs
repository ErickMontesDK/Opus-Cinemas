export const handler = async (event) => {
    try {
        const { url } = event.queryStringParameters;
        if (!url) {
            return {
                statusCode: 400,
                body: "Missing 'url' query parameter"
            };
        }

        const response = await fetch(url);
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: `Failed to fetch image: ${response.statusText}`
            };
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get("content-type") || "image/jpeg";

        return {
            statusCode: 200,
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=86400"
            },
            body: buffer.toString('base64'),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error("Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

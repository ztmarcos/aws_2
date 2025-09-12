import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
    PutItemCommand, 
    GetItemCommand, 
    ScanCommand, 
    UpdateItemCommand, 
    DeleteItemCommand 
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const TABLE_NAME = process.env.JOURNAL_TABLE_NAME || 'JournalEntries';

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    tags: string[];
    date: string;
    createdAt: string;
    updatedAt: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { httpMethod, path, pathParameters, body } = event;
        const entryId = pathParameters?.id;

        switch (httpMethod) {
            case 'GET':
                if (entryId) {
                    return await getEntry(entryId, headers);
                } else {
                    return await getAllEntries(headers);
                }
            
            case 'POST':
                return await createEntry(body, headers);
            
            case 'PUT':
                if (entryId) {
                    return await updateEntry(entryId, body, headers);
                }
                break;
            
            case 'DELETE':
                if (entryId) {
                    return await deleteEntry(entryId, headers);
                }
                break;
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};

async function getAllEntries(headers: any): Promise<APIGatewayProxyResult> {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });

        const result = await dynamoClient.send(command);
        const entries = result.Items?.map(item => unmarshall(item)) || [];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                entries: entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            })
        };
    } catch (error) {
        console.error('Error getting entries:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to get entries' })
        };
    }
}

async function getEntry(entryId: string, headers: any): Promise<APIGatewayProxyResult> {
    try {
        const command = new GetItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ id: entryId })
        });

        const result = await dynamoClient.send(command);
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Entry not found' })
            };
        }

        const entry = unmarshall(result.Item);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ entry })
        };
    } catch (error) {
        console.error('Error getting entry:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to get entry' })
        };
    }
}

async function createEntry(body: string | null, headers: any): Promise<APIGatewayProxyResult> {
    try {
        if (!body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Request body is required' })
            };
        }

        const { title, content, tags = [] } = JSON.parse(body);
        
        if (!title || !content) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Title and content are required' })
            };
        }

        const now = new Date().toISOString();
        const entry: JournalEntry = {
            id: `entry-${Date.now()}`,
            title,
            content,
            tags: Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
            date: now.split('T')[0],
            createdAt: now,
            updatedAt: now
        };

        const command = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: marshall(entry)
        });

        await dynamoClient.send(command);

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ 
                message: 'Entry created successfully',
                entry 
            })
        };
    } catch (error) {
        console.error('Error creating entry:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create entry' })
        };
    }
}

async function updateEntry(entryId: string, body: string | null, headers: any): Promise<APIGatewayProxyResult> {
    try {
        if (!body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Request body is required' })
            };
        }

        const { title, content, tags } = JSON.parse(body);
        const now = new Date().toISOString();

        const updateExpression = 'SET updatedAt = :updatedAt';
        const expressionAttributeValues: any = {
            ':updatedAt': now
        };

        if (title) {
            updateExpression += ', title = :title';
            expressionAttributeValues[':title'] = title;
        }

        if (content) {
            updateExpression += ', content = :content';
            expressionAttributeValues[':content'] = content;
        }

        if (tags) {
            updateExpression += ', tags = :tags';
            expressionAttributeValues[':tags'] = Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
        }

        const command = new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ id: entryId }),
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: marshall(expressionAttributeValues),
            ReturnValues: 'ALL_NEW'
        });

        const result = await dynamoClient.send(command);
        const updatedEntry = unmarshall(result.Attributes!);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'Entry updated successfully',
                entry: updatedEntry 
            })
        };
    } catch (error) {
        console.error('Error updating entry:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update entry' })
        };
    }
}

async function deleteEntry(entryId: string, headers: any): Promise<APIGatewayProxyResult> {
    try {
        const command = new DeleteItemCommand({
            TableName: TABLE_NAME,
            Key: marshall({ id: entryId })
        });

        await dynamoClient.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Entry deleted successfully' })
        };
    } catch (error) {
        console.error('Error deleting entry:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to delete entry' })
        };
    }
}

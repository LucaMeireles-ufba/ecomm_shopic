import { NextResponse } from 'next/server';
import { CopyAndPaste } from 'pixjs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, key, amount, city, id } = body;

        const payload = CopyAndPaste({
            name,
            key,
            amount,
            city,
            id,
            type: 'cpf',
        });

        return NextResponse.json({ payload });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate PIX payload' }, { status: 500 });
    }
}
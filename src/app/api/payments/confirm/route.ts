import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json()

    // Toss Payments confirmation API (sandbox mode)
    const secretKey = process.env.TOSS_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Payment configuration missing' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Payment confirmation failed' },
        { status: response.status }
      )
    }

    // In production, save to Supabase payments table here
    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        amount: data.totalAmount,
        status: data.status,
        method: data.method,
        approvedAt: data.approvedAt,
      },
    })
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { ContactFormData, ContactResponse } from '@/types';
import { validateEmail } from '@/lib/utils';

export async function POST(request: Request): Promise<Response> {
  try {
    const data: ContactFormData = await request.json();

    // Validation
    if (!data.name?.trim()) {
      return Response.json(
        { success: false, message: 'Name is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (!data.email?.trim() || !validateEmail(data.email)) {
      return Response.json(
        { success: false, message: 'Valid email is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (!data.subject?.trim()) {
      return Response.json(
        { success: false, message: 'Subject is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    if (!data.message?.trim()) {
      return Response.json(
        { success: false, message: 'Message is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    // In a real application, you would send an email here
    // For now, we'll just log the data and return success
    console.log('Contact form submission:', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with email service (SendGrid, Nodemailer, etc.)
    // const response = await sendEmail({...})

    const response: ContactResponse = {
      success: true,
      message: 'Message received successfully',
      timestamp: new Date().toISOString(),
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { success: false, message: 'Server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

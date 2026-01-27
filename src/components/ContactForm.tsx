'use client';

import { FormEvent, useState } from 'react';
import { ContactFormData, ContactResponse } from '@/types';
import { validateEmail } from '@/lib/utils';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    // Validation
    if (!formData.name.trim()) {
      setStatus('error');
      setMessage('Please enter your name');
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    if (!formData.subject.trim()) {
      setStatus('error');
      setMessage('Please enter a subject');
      return;
    }

    if (!formData.message.trim()) {
      setStatus('error');
      setMessage('Please enter your message');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ContactResponse = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Message sent successfully! I will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
        });
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-white font-semibold mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-white font-semibold mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-white font-semibold mb-2">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-white font-semibold mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="What is this about?"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-white font-semibold mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
          placeholder="Your message here..."
        />
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-600/20 border border-green-600 rounded-lg text-green-400">
          ✓ {message}
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400">
          ✗ {message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      <p className="text-gray-500 text-sm">* Required fields</p>
    </form>
  );
}

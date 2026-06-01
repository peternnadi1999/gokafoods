
import { Phone, MessageCircle, Mail, ChevronRight } from 'lucide-react';

// SEO Metadata

const FAQS = [
  { question: 'How long does delivery take?', answer: 'Delivery times vary by restaurant and distance. Estimated time is shown on each food item. Most orders arrive within 15–45 minutes.' },
  { question: 'Can I cancel my order?', answer: 'Orders can be cancelled within 2 minutes of placement. After that, please contact our support team for assistance.' },
  { question: 'How do I fund my wallet?', answer: 'Go to Profile → Fund Wallet and enter the amount. We accept card payments via Paystack.' },
  { question: 'What is the Stamp Card?', answer: 'Every order earns you a stamp. Collect 10 stamps to unlock a free meal reward from participating restaurants.' },
  { question: 'How do I report a wrong order?', answer: 'Call our support number or send a WhatsApp message within 1 hour of delivery. We will make it right.' },
  { question: 'Is my payment information secure?', answer: 'Yes. We use Paystack, a PCI-DSS compliant payment gateway. Your card details are never stored on our servers.' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 backdrop-blur-sm border-b border-gray-200/60 z-10 px-5 lg:px-8 pt-12 lg:pt-8 pb-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-500 font-roboto mt-0.5">We&apos;re here to help</p>
        </div>
      </div>

      <div className="px-5 lg:px-8 py-6 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Contact options ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Us</p>
              </div>

              <a href="tel:+2349135913460" className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Call Support</p>
                  <p className="text-gray-400 text-xs font-roboto">+234 913 591 3460</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
              </a>

              <a href="https://wa.me/2349116000228" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} className="text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">WhatsApp</p>
                  <p className="text-gray-400 text-xs font-roboto">+234 911 600 0228</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
              </a>

              <a href="mailto:support@gokafood.com" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Email Us</p>
                  <p className="text-gray-400 text-xs font-roboto">support@gokafood.com</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400" />
              </a>
            </div>

            {/* Hours card */}
            <div className="bg-primary-500 rounded-3xl p-5 mt-4 text-white">
              <p className="font-bold text-lg mb-1">Support Hours</p>
              <p className="text-primary-100 text-sm font-roboto">Monday – Sunday</p>
              <p className="font-semibold text-lg mt-1">7:00 AM – 10:00 PM</p>
              <p className="text-primary-200 text-xs font-roboto mt-2">WAT (West Africa Time)</p>
            </div>
          </div>

          {/* ── Right: FAQs ── */}
          <div className="lg:col-span-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Frequently Asked Questions</p>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl shadow-card group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none hover:bg-gray-50 rounded-2xl transition-colors">
                    <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-90" />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-500 text-sm font-roboto leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

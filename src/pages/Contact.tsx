
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-16 sm:mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-medium text-espresso">Contact Us</h1>
            <p className="text-taupe mt-4 text-lg">We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-serif font-medium text-espresso mb-6">Get in Touch</h2>
              <p className="text-taupe mb-8">
                Have questions about our products, need help with an order, or just want to say hello? 
                Use the form to send us a message, or reach out via the contact information below.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-clay flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-espresso">Our Location</h3>
                    <p className="text-taupe">123 Craft Street<br />Yarnville, YN 12345</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-clay flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-espresso">Email Us</h3>
                    <a href="mailto:hello@yarncraft.com" className="text-clay hover:text-espresso button-transition">
                      hello@yarncraft.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-clay flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-espresso">Call Us</h3>
                    <a href="tel:+15551234567" className="text-clay hover:text-espresso button-transition">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-serif font-medium text-espresso mb-4">Store Hours</h3>
                <div className="bg-white p-6 rounded-lg card-shadow">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-espresso">Monday - Friday</div>
                    <div className="text-taupe">9:00 AM - 6:00 PM</div>
                    <div className="text-espresso">Saturday</div>
                    <div className="text-taupe">10:00 AM - 5:00 PM</div>
                    <div className="text-espresso">Sunday</div>
                    <div className="text-taupe">Closed</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white p-6 sm:p-8 rounded-lg card-shadow">
                <h2 className="text-2xl font-serif font-medium text-espresso mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-espresso">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-espresso">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-espresso">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full flex items-center justify-center space-x-2 bg-espresso hover:bg-clay"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

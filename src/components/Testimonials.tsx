
import React from 'react';

type TestimonialProps = {
  quote: string;
  author: string;
  position: string;
  image: string;
  delay: string;
};

const Testimonial = ({ quote, author, position, image, delay }: TestimonialProps) => (
  <div 
    className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col animate-fade-up"
    style={{ animationDelay: delay }}
  >
    <div className="mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="text-yellow-400 inline-block">★</span>
      ))}
    </div>
    <p className="text-lg mb-6 flex-grow">{quote}</p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <img 
          src={image} 
          alt={author} 
          className="w-full h-full object-cover"
          loading="lazy" 
        />
      </div>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{position}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Noterra has completely transformed how I organize my thoughts. The interface is so clean and intuitive that taking notes feels effortless.",
      author: "Alexandra Chen",
      position: "Product Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
      delay: "0.1s"
    },
    {
      quote: "As a researcher, I need a reliable note-taking system. Noterra is the perfect balance of simplicity and power—I can focus on my work without distractions.",
      author: "Michael Torres",
      position: "Professor of Computer Science",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
      delay: "0.2s"
    },
    {
      quote: "I've tried many note apps, but Noterra stands out with its thoughtful design and seamless sync across devices. It's become an essential tool for my daily work.",
      author: "Sarah Johnson",
      position: "Content Strategist",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
      delay: "0.3s"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by thousands of users</h2>
          <p className="text-xl text-muted-foreground">
            Join a community of thinkers, creators, and professionals who rely on Noterra every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              image={testimonial.image}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

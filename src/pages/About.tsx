
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-16 sm:mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-medium text-espresso">About YarnCraft</h1>
            <p className="text-taupe mt-4 text-lg">Handcrafted with love, designed for creativity</p>
          </div>

          <div className="prose prose-lg mx-auto text-espresso">
            <p>
              YarnCraft was born from a passion for crochet and a desire to share high-quality, 
              sustainable yarn and tools with fellow crafters. What started as a small home-based 
              business has grown into a community of like-minded individuals who appreciate the art 
              of handmade creations.
            </p>

            <h2 className="text-2xl font-serif font-medium mt-8 mb-4">Our Story</h2>
            <p>
              Founded in 2018 by Emma Johnson, an avid crocheter with over 15 years of experience, 
              YarnCraft began as a small collection of hand-dyed yarns sold at local craft fairs. 
              As demand grew, so did our selection of products and our commitment to supporting 
              sustainable and ethical manufacturing practices.
            </p>
            <p>
              Today, YarnCraft offers a carefully curated selection of yarns, tools, and patterns 
              designed to inspire creativity and support crafters at every skill level. We believe 
              in the power of handmade items to bring joy, comfort, and a sense of accomplishment.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-serif font-medium mt-8 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div className="bg-white p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-medium text-clay mb-3">Sustainability</h3>
                <p>
                  We carefully source materials that are kind to our planet. Many of our yarns are 
                  made from organic, recycled, or responsibly harvested fibers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-medium text-clay mb-3">Quality</h3>
                <p>
                  Each product in our store is personally tested and approved by our team to ensure 
                  it meets our high standards for durability, feel, and performance.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-medium text-clay mb-3">Community</h3>
                <p>
                  We believe in the power of crafting to bring people together. Through workshops, 
                  online tutorials, and our social media communities, we foster connections.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg card-shadow">
                <h3 className="text-xl font-medium text-clay mb-3">Education</h3>
                <p>
                  We're committed to sharing knowledge and helping crafters develop their skills 
                  through clear patterns, helpful resources, and responsive customer support.
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <h2 className="text-2xl font-serif font-medium mt-8 mb-4">Meet Our Team</h2>
            <p>
              Our small but mighty team is made up of passionate crafters who understand the joy 
              of creating something beautiful with your own hands. From our customer service specialists 
              to our product curators, everyone at YarnCraft is committed to supporting your creative journey.
            </p>

            <p className="mt-6">
              Thank you for being part of our story. We look forward to being part of yours!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

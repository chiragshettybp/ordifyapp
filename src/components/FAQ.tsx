import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What's included in the Premium Sneaker Collection - 5 Pack®?",
    answer: "You get a complete sneaker collection system: 1x Premium Athletic Sneakers (Sizes 6-12), 1x Casual Walking Shoes (All weather protection), 1x High-Performance Running Shoes, 1x Stylish Street Sneakers (Multiple colorways), 1x Limited Edition Designer Kicks, 1x Premium Sneaker Care Kit, plus User's Manual and FREE Online Style Tutorial."
  },
  {
    question: "Is this suitable for beginners and all activity levels?",
    answer: "Absolutely! Our sneaker collection is designed for everyone from casual walkers to serious athletes. Each pair features different support levels and cushioning systems to match your activity needs and experience level."
  },
  {
    question: "Can I use these for sports and everyday wear?",
    answer: "Yes! Our versatile collection includes specialized sneakers for running, training, casual wear, and street style. Each pair is engineered for specific activities while maintaining all-day comfort for daily use."
  },
  {
    question: "How durable are these Premium Sneakers?",
    answer: "Our sneakers are built to last with premium materials, reinforced stitching, and high-quality rubber outsoles. Each pair is designed to withstand daily wear while maintaining their style and performance characteristics."
  },
  {
    question: "Who can benefit from this premium sneaker collection?",
    answer: "Perfect for athletes, fitness enthusiasts, style-conscious individuals, professionals who walk a lot, students, and anyone who values comfort and quality footwear. Suitable for all ages and activity levels."
  },
  {
    question: "What's your guarantee policy?",
    answer: "We offer a 30-day satisfaction guarantee and 1-year warranty on manufacturing defects. If you're not completely satisfied with your sneakers, we'll provide a full refund or exchange within 30 days of purchase."
  }
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-0">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-gray-800">
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-6 px-0 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
              >
                <h3 className="text-white font-medium text-lg pr-4">
                  {item.question}
                </h3>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-white transition-transform duration-200 flex-shrink-0",
                    openItem === index ? "rotate-180" : ""
                  )}
                />
              </button>
              {openItem === index && (
                <div className="pb-6 px-0">
                  <p className="text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <motion.div
      initial={false}
      className="glass-effect rounded-xl overflow-hidden"
    >
      <motion.header
        initial={false}
        onClick={onClick}
        className="text-lg font-semibold flex justify-between items-center cursor-pointer p-6 text-foreground"
      >
        {item.question}
        <ChevronDown
          className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <p className="text-muted-foreground leading-relaxed px-6 pb-6">
              {item.answer}
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Questions <span className="gradient-text">Fréquentes</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Toutes les réponses à vos interrogations sur HotelBot AI.
          </p>
        </motion.div>

        <div className="space-y-6">
          {data.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

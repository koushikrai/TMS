export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 30 } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.15 } 
  }
};

export const cardStagger = {
  animate: { 
    transition: { staggerChildren: 0.06 } 
  }
};

export const cardItem = {
  initial: { opacity: 0, y: 16 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 400, damping: 28 } 
  }
};

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 350, damping: 35 } 
  },
  exit: { 
    x: '100%', 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }
};

export const scaleIn = {
  initial: { scale: 0.92, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 400, damping: 30 } 
  }
};

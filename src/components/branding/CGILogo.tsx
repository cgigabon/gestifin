'use client';

import { motion } from 'framer-motion';

/**
 * 🎨 LOGO CGI - Centre Gabonais de l'Innovation
 * Avec animations et design fidèle
 */

interface CGILogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function CGILogo({ size = 'md', animated = true }: CGILogoProps) {
  const sizes = {
    sm: { container: 120, text: 'text-sm', subtitle: 'text-xs' },
    md: { container: 180, text: 'text-base', subtitle: 'text-sm' },
    lg: { container: 240, text: 'text-xl', subtitle: 'text-base' },
  };

  const config = sizes[size];

  const LogoContent = (
    <div className="flex flex-col items-center gap-3">
      {/* Logo Icon SVG-like */}
      <div className="relative" style={{ width: config.container, height: config.container * 0.6 }}>
        {/* Face centrale orange */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
          animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Yeux et motif */}
          <div className="relative w-full h-full">
            <div className="absolute left-4 top-5 w-3 h-1 bg-black rounded-full" />
            <div className="absolute right-4 top-5 w-3 h-1 bg-black rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 top-7 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-orange-800 rounded-full" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Branches vertes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${angle}deg) translateY(-40px)`,
            }}
            animate={animated ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          >
            <div className="w-3 h-10 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
            <div className="w-6 h-6 bg-green-400 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2" />
          </motion.div>
        ))}

        {/* Points bleus (technologie) */}
        {[30, 90, 150, 210, 270, 330].map((angle, i) => (
          <motion.div
            key={`blue-${i}`}
            className="absolute left-1/2 top-1/2"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${angle}deg) translateY(-55px)`,
            }}
            animate={animated ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </motion.div>
        ))}

        {/* Cercles orange (connexions) */}
        <motion.div
          className="absolute right-2 top-4 w-3 h-3 bg-orange-400 rounded-full"
          animate={animated ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-6 top-8 w-2 h-2 bg-orange-500 rounded-full"
          animate={animated ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        />
      </div>

      {/* Texte */}
      <div className="text-center space-y-1">
        <motion.h1
          className={`font-bold tracking-tight ${config.text}`}
          style={{
            background: 'linear-gradient(90deg, #6B7280 0%, #374151 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          CENTRE GABONAIS DE
          <br />
          L'INNOVATION
        </motion.h1>
        <motion.p
          className={`font-medium text-blue-600 ${config.subtitle}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Construisons un avenir meilleur
        </motion.p>
      </div>
    </div>
  );

  return animated ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {LogoContent}
    </motion.div>
  ) : (
    LogoContent
  );
}


